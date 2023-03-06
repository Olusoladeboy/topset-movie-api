import * as http from 'http';
import { AddressInfo } from 'net';
import mongoose, { ConnectOptions } from 'mongoose';
import App from './App';
import Environment from './environments/environment';
import { setGlobalEnvironment } from './global';
import logger from './lib/logger';

const env: Environment = new Environment();
setGlobalEnvironment(env);
const app: App = new App();
let server: http.Server;

function serverError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') {
        throw error;
    }
    // handle specific error codes here.
    throw error;
}

console.log(env.mongoUri);
mongoose.Promise = global.Promise;

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
} as ConnectOptions;
mongoose.connect(env.mongoUri, mongooseOptions).then(() => {
    console.log('connected to database');
}).catch(error => {
    throw new Error(error);
});

function serverListening(): void {
    const addressInfo: AddressInfo = <AddressInfo>server.address();
    logger.info(`Listening on ${addressInfo.address}:${env.port}`);
}

app.init().then(() => {
    app.express.set('port', env.port);

    server = app.httpServer; // http.createServer(App);
    server.on('error', serverError);
    server.on('listening', serverListening);
    server.listen(env.port);
}).catch((err: Error) => {
    logger.info('app.init error');
    logger.error(err.name);
    logger.error(err.message);
    logger.error(err.stack);
});

process.on('unhandledRejection', (reason: Error) => {
    logger.error('Unhandled Promise Rejection: reason:', reason.message);
    logger.error(reason.stack);
    // application specific logging, throwing an error, or other logic here
});


