import express from 'express';
import jwt from 'jsonwebtoken';
import routes from './routes.js';
import config from './config.js';

const authorization = (request, response, next) => {
    if (request.cookies?.token) {
        try {
            response.locals.user = jwt.verify(
                request.cookies.token, config.jwt.key
            );
        } catch (error) {
            return response.status(401).end(error);
        }
    } else {
        return response.sendStatus(403);
    }
    next();
}

const router = express.Router();

for (const route of routes) {
    const controller = (await import(
        `./controllers/${route.name}.js`
    )).default;
    for (const action of route.actions) {
        const callbacks = [];
        if (!action?.access) {
            callbacks.push(authorization);
        }
        if (action?.level) {
            callbacks.push((request, response, next) => {
                if (response.locals.user.role.level > action.level) {
                    return response.sendStatus(403);
                }
                next();
            })
        }
        if (action?.log) {
            callbacks.push(
                async (request, response, next) => {
                    response.locals.controller = route.name;
                    response.locals.action = action.name;
                    next();
                }
            )
        }
        callbacks.push(controller[action.name]);
        router[action.method](route.path + action.path, callbacks);
    }
}

export { router as default };