import express from 'express';
import process from 'process';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { client } from './db.js';
import log from './log.js';
import router from './router.js';
import routes from './routes.js';
import config from './config.js';

const app = express();
const server = app.listen(config.port, config.ip, () => {
    console.log(`HTTP server started [${app.get('env')}]`);
    console.log(`Listening at ${config.ip}:${config.port}`);
});
//const session = cookieSession(config.session);
const exclude = [
    config.path + routes.user.path + routes.user.actions.login.path
];

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
//    session.secure = true;
}

app.use(function (request, response, next) {
    //console.log(decodeURI(request.originalUrl));
    console.log(decodeURI(request.path), request.params, request.query);
    //console.log('app.use.request.cookies', request.cookies);
    if (!request.cookies?.token) {
        if (exclude.includes(decodeURI(request.path))) {
            return next();
        } 
        return response.sendStatus(401);
    }
    try {
        response.locals.user = jwt.verify(request.cookies.token, config.jwt.key);
    } catch (error) {
        return response.status(401).end(error);
    }
    next();
});

app.use(encodeURI(config.path), router);

app.use(async (error, request, response, next) => {
    console.error(error);
    if (response.headersSent) return next(error);
    response.status(500).json({
        message: error.message, name: error.name
    });
    await log(error);
})

process.on('unhandledRejection', async error => {
    console.log('Unhandled Rejection', error);
    await log(error);
    process.exit(1);
})

process.on('SIGINT', async () => {
    console.log('\nSIGINT signal received')
    await client.close();
    server.close();
    console.log(`HTTP server closed`);
    await client.close()
    process.exit(0);
})