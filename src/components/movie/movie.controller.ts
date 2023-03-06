import aqp from 'api-query-params';
import bcryptjs from 'bcryptjs';
import { Application, NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { hash, setLimit } from '../../lib/helper';
import * as responsehandler from '../../lib/response-handler';
import BaseApi from '../BaseApi';
import MovieModel, { MovieDoc, validateCreate } from './movie.model';
import { MovieInterface } from './movie.types';
import { ClientSession } from 'mongoose';

const jwtdata = {
    jwtSecret: 'MonoTest',
    tokenExpireTime: 70000,
};
/**
 * Status controller
 */
export default class Movie extends BaseApi {
    jwtdata = {
        jwtSecret: 'TopSetMovie',
        tokenExpireTime: 70000,
    };

    constructor(express: Application) {
        super();
        this.register(express);
    }

    public register(express: Application): void {
        express.use('/api/movie', this.router);
        this.router.post('/', this.createMovie);
        this.router.get('/', this.listMovies);
    }


    public async createMovie(req: Request, res: Response, next: NextFunction): Promise<void> {
        const session: ClientSession = await MovieModel.startSession();
        session.startTransaction({
            readConcern: { level: 'snapshot' },
            writeConcern: { w: 1 },
        });
        try {
            const data: MovieInterface = req.body;
            const { error } = validateCreate.validate(data);
            if (error) throw new Error(error.message);
            const newRecord = new MovieModel(data);
            const result = await newRecord.save();
            if (!result) throw new Error('Cannot save data');
            await session.commitTransaction();
            session.endSession();
            responsehandler.successfulResponse(res, 200, result, 'Successful')

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            next(error);
        }
    }

    public async listMovies(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await fetchMovies(req?.query)
            responsehandler.queryResponse(res, 200, result)
        } catch (error) {
            next(error);
        }
    }



}


const fetchMovies = async (query?: any) => {
    const session: ClientSession = await MovieModel.startSession();
    session.startTransaction({
        readConcern: { level: 'snapshot' },
        writeConcern: { w: 1 },
    });
    try {
        const {
            filter, skip, sort, projection, population,
        } = aqp(query);
        if (filter.q) {
            filter.$or = [{ 'title': { '$regex': filter.q, '$options': 'i' } }]
            delete filter.q
        }
        let { limit } = aqp(query);
        limit = setLimit(limit || 100);
        const total = await MovieModel.countDocuments(filter).exec();
        const result = await MovieModel.find(filter)
            .populate(population)
            .skip(skip)
            .limit(limit)
            .sort(sort as any)
            .select(projection)
            .exec();

        if (!result) throw new Error('Error');
        await session.commitTransaction();
        session.endSession();
        return { payload: result, limit, sort, skip, total };
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(error)
    }
}