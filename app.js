"use strict"

import express from "express";
import process from "process";
import { MongoClient } from 'mongodb';
import cookieSession from "cookie-session";
import jwt from "jsonwebtoken";
import routes from "./routes.js";
import settings from "./settings.js";

const app = express();
const server = app.listen(settings.port, settings.ip, () => {
    console.log(`HTTP server started [${app.get('env')}]`);
    console.log(`Listening at ${settings.ip}:${settings.port}`);
});
const client = new MongoClient(settings.db);
await client.connect();
const db = client.db();
const router = express.Router();
const session = cookieSession(settings.session);

const controllers = {};
for (const [controllerName, controller] of Object.entries(routes)) {
    controllers[controllerName] = new (
        await import('./controllers/' + controllerName + '.js')
    ).default(db, controller);
}

const allowed = [];
allowed.push(settings.uri + routes.User.uri + routes.User.actions.login.uri);

app.use(session);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    session.secure = true;
}

app.use(function (request, response, next) {
    //console.log(decodeURI(request.originalUrl));
    //console.log(decodeURI(request.path), request.params, request.query);
    //console.log(request.headers);
    if (typeof request.session.token === 'undefined') {
        if (allowed.indexOf(decodeURI(request.path)) > -1) return next();
        return response.sendStatus(401);
    }
    // move to Layout
    const user = jwt.verify(request.session.token, settings.key);
    //console.log('user', user);
    if (!user?._id) {
        return response.sendStatus(401);
    }
    next();
});

for (const [routeName, route] of Object.entries(routes)) {
    const uri = encodeURI(settings.uri + route.uri);
    const controller = controllers[routeName];
    console.log(routeName, "    \t", decodeURI(uri));
    if (route?.actions) {
        for (const [actionName, action] of Object.entries(route.actions)) {
            console.log(" ", actionName, "\t", decodeURI(uri + action.uri));
            router[action.method](uri + encodeURI(action.uri), controller[actionName]);
        }
    }
    router.get(uri,  controller['find']);
    router.get(uri + '/:id',  controller['findOne']);
    router.post(uri,  controller['insert']);
    router.put(uri + '/:id',  controller['update']);
    router.delete(uri + '/:id',  controller['remove']);
}

app.use('/', router);

app.use(async (error, request, response, next) => {
    console.error(error);
    if (response.headersSent) return next(error);
    response.status(500).json({ message: error.message, name: error.name });
})

process.on('unhandledRejection', async (error) => {
    console.error('Unhandled Rejection', error);
    process.exit(1);
})

process.on('SIGINT', async () => {
    console.log(`HTTP server closed`);
    await client.close();
    server.close();
    process.exit(0);
})