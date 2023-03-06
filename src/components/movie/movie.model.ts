/* eslint-disable no-use-before-define */
import Joi from 'joi';
import mongoose from 'mongoose';
import { MovieInterface } from './movie.types';

interface movieModelInterface extends mongoose.Model<MovieDoc> {
    build(attr: MovieInterface): MovieDoc
}

export interface MovieDoc extends mongoose.Document, MovieInterface {
}

export const validateCreate = Joi.object<MovieInterface>({
    title: Joi.string().trim().required(),
    imageUrl: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    price: Joi.string().trim().required(),
});

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,

    },
    imageUrl: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true,
    },
});

movieSchema.statics.build = (attr: MovieInterface) => new MovieModel(attr);
movieSchema.set('collection', 'movie');
const MovieModel = mongoose.model<MovieDoc, movieModelInterface>('Movie', movieSchema);

// Movie.build({
//     title: 'some title',
//     description: 'some description'
// });

export default MovieModel;