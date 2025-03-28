import express from 'express';
import jwt from 'jsonwebtoken';
import { logging } from './utils.js';
import routes from './routes.js';
import config from './config.js';

const verification = (request, response, next) => {
    if (request.cookies?.token) {
        try {
            response.locals.user = jwt.verify(
                request.cookies.token, config.key
            );
        } catch (error) {
            return response.status(403).end(error);
        }
    } else {
        return response.sendStatus(401);
    }
    next();
}

const router = express.Router();

for (const route of routes) {
    const controller = (await import(
        `./controllers/${route.name}.js`
    )).default;
    for (const action of route.actions) {
        const middleware = [];
        if (action?.level) {
            middleware.push(verification);
            middleware.push((request, response, next) => {
                if (response.locals.user.role.level > action.level) {
                    return response.sendStatus(403);
                }
                next();
            })
        }
        if (action?.log) {
            middleware.push(
                (request, response, next) => {
                    logging(
                        route.name,
                        action.name,
                        response.locals.user._id,
                        request.params.id
                    );
                    next();
                }
            )
        }
        middleware.push(controller[action.name]);
        router[action.method](route.path + action.path, middleware);
    }
}

export { router as default };