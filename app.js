import express from 'express';
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

const pathLogin = config.path
    + routes.user.path
    + routes.user.actions.login.path;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('dist'));

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
//    session.secure = true;
}

app.use(function (request, response, next) {
    //console.log(decodeURI(request.originalUrl));
    console.log(request.path, request.method, request.params, request.query);
    //console.log('app.use.request.cookies', request.cookies);
    if (!request.cookies?.token) {
        if (request.path === pathLogin) {
            return next();
        } 
        return response.sendStatus(403);
    }
    try {
        response.locals.user = jwt.verify(request.cookies.token, config.jwt.key);
    } catch (error) {
        return response.status(401).end(error);
    }
    next();
});

app.use(config.path, router);

app.use(async (request, response, next) => {
    console.log('last', request.path, request.method, request.params, request.route)
    if (typeof request.route !== 'undefined') return next();
    console.log(request.path.slice(0, 4))
    let message;
    if (request.path.slice(0, 4) === '/api') {
        message = '404 Not Found';
        response.sendStatus(404);
    } else {
        message = '302 Found';
        response.status(302).sendFile(config.root + '/dist/index.html');
    }
    message += ` (${request.path}, ${request.method})`
    console.error(message);
    next(new Error(message));
});

app.use((error, request, response, next) => {
    console.error(error);
    console.log(response.headersSent)
    if (!response.headersSent) {
    /*
        response.status(500).json({
            message: error.message, name: error.name
        });
    */
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
    console.log('\nSIGINT signal received')
    await client.close();
    server.close();
    console.log(`HTTP server closed`);
    await client.close()
    process.exit(0);
});