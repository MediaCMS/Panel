import express from 'express';
import cookieParser from 'cookie-parser';
import { client } from './db.js';
import { parseRequest } from './utils.js';
import router from './router.js';
import log from './log.js';
import db, { ObjectId } from './db.js';
import config from './config.js';

const app = express();
const server = app.listen(config.port, config.ip, () => {
    console.log(`HTTP server started [${app.get('env')}]`);
    console.log(`Listening at ${config.ip}:${config.port}`);
});
//const session = cookieSession(config.session);

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
//    session.secure = true;
}

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(config.root + '/dist'));

app.use((request, response, next) => {
    if (request.path.indexOf(config.path) !== 0) {
        console.log(config.root + '/dist/index.html')
        console.error(`302 Found (${request.path})`);
        return response.status(302)
            .sendFile(config.root + '/dist/index.html');
    }
    next();
});

app.use((request, response, next) => {
    response.locals.mode = app.get('env');
    parseRequest(request);
    response.on('finish', () => {
        if (!response.locals?.controller) return
        const log = {
            date: new Date(),
            controller: response.locals.controller,
            action: response.locals.action,
            user: new ObjectId(response.locals.user._id)
        };
        if (request.params?.id) {
            log.document = new ObjectId(request.params.id)
        }
        db.collection('log').insertOne(log);
    });
    next()
})

app.use(config.path, router);

app.use(async (request, response, next) => {
    if (typeof request.route !== 'undefined') {
        console.error(
            `404 Not Found (${request.method} ${request.path})`
        );
        return response.sendStatus(404);
    }
    next();
});

app.use((error, request, response, next) => {
    console.error(error);
    if (!response.headersSent) {
        response.status(500).json({
            message: error.message, name: error.name
        });
        next(error);
    }
    log(error);
});

process.on('unhandledRejection', async error => {
    console.log('Unhandled Rejection', error);
    await log(error);
    process.exit(1);
});

process.on('SIGINT', async () => {
    console.log('\nSIGINT signal received');
    await client.close();
    server.close();
    console.log(`HTTP server closed`);
    process.exit(0);
});