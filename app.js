"use strict"

import express from "express";
import process from "process";
import { MongoClient } from 'mongodb';
//import cors from "cors";
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

const controllers = {};
for (const [controllerName, controller] of Object.entries(routes)) {
    controllers[controllerName] = new (
        await import('./controllers/' + controllerName + '.js')
    ).default(db, controller);
}
//console.log(controllers)

//app.use(cors(settings.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
}

app.use(function (request, response, next) {
    //console.log(decodeURI(request.originalUrl));
    //console.log(decodeURI(request.path), request.params, request.query);
    //console.log(request.headers['x-api-key']);
    next();
});

for (const [routeName, route] of Object.entries(routes)) {
    console.log(routeName, decodeURI(settings.uri + route.uri))
    const uri = encodeURI(settings.uri + route.uri);
    const controller = controllers[routeName];
    router.get(uri,  controller['find']);
    router.get(uri + '/:id',  controller['findOne']);
    router.post(uri,  controller['insert']);
    router.put(uri + '/:id',  controller['update']);
    router.delete(uri + '/:id',  controller['remove']);
    if (route?.actions) {
        for (const [actionName, action] of Object.entries(route.actions)) {
            router[action.method](action.uri,  controller[actionName]);
        }
    }
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