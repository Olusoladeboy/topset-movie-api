import { Response } from 'express';
import {
    StatusCodes,
} from 'http-status-codes';
import { encrypt } from './crypto';
import { getEntityCount } from './helper';
import logger from './logger';
import { FailResponseType, QueryEntityType, QueryResponseType, SuccessfulResponseType } from './types';

export const formatMsg = (msg: any) => {
    if (/E11000/.test(msg)) {
        const err = msg?.substring(
            msg.indexOf('{') + 1,
            msg.lastIndexOf(':'),
        );
        return `${err.toUpperCase().trim()} exists `;
    }
    return msg;
};

function send(res: Response): void {
    let obj = {};
    obj = res.locals.data;
    if (environment.isProductionEnvironment()) {
        logger.info(JSON.stringify(obj, null, 2));
    }
    if (environment.applyEncryption) {
        obj = encrypt(JSON.stringify(obj), environment.secretKey);
    }
    res.status(StatusCodes.OK).send(obj);
}

function json(res: Response): void {
    let obj = {};
    obj = res.locals.data;
    if (environment.isProductionEnvironment()) {
        logger.info(JSON.stringify(obj, null, 2));
    }
    if (environment.applyEncryption) {
        obj = encrypt(JSON.stringify(obj), environment.secretKey);
    }
    res.status(StatusCodes.OK).json(obj);
}

const successfulResponse = (
    res: Response,
    status: number = StatusCodes.OK,
    result: string | [] | any,
    msg: string) => {
    let obj: SuccessfulResponseType | string = {
        success: true,
        message: msg || 'Operation Successful',
        count: result ? result.length : 0,
        payload: result
    };
    if (environment.isProductionEnvironment()) {
        logger.info(JSON.stringify(obj, null, 2));
    }
    if (environment.applyEncryption) {
        obj = encrypt(JSON.stringify(obj), environment.secretKey);
    }
    res.status(status).json(obj);
}

const queryResponse = (
    res: Response,
    status: number = StatusCodes.OK,
    entity: QueryEntityType,
    msg?: string) => {
    let obj: QueryResponseType | string = {
        success: true,
        message: msg || 'Operation Successful',
        metadata: {
            total: entity.total || 0,
            limit: entity.limit || 0,
            count: getEntityCount(entity),
            skip: entity.skip || 0,
            page: Number(entity.skip || 0) + 1,
            sort: entity.sort || '',
        },
        count: entity ? entity.length : 0,
        payload: entity?.payload
    };
    if (environment.isProductionEnvironment()) {
        logger.info(JSON.stringify(obj, null, 2));
    }
    if (environment.applyEncryption) {
        obj = encrypt(JSON.stringify(obj), environment.secretKey);
    }
    res.status(status).json(obj);
}

const failedResponse = (res: Response, status: number = StatusCodes.BAD_REQUEST, msg: string) => {
    let obj: FailResponseType | string = {
        success: false,
        message: formatMsg(msg) || 'Operation Failed'
    };
    if (environment.isProductionEnvironment()) {
        logger.info(JSON.stringify(obj, null, 2));
    }
    if (environment.applyEncryption) {
        obj = encrypt(JSON.stringify(obj), environment.secretKey);
    }
    res.status(status).json(obj);
}

export {
    successfulResponse,
    queryResponse,
    failedResponse,
    send,
    json
};