import * as express from 'express';
import Movie from './components/movie/movie.controller';

export default function registerRoutes(app: express.Application): void {
    new Movie(app);
}
