import express from 'express';
import routes from './routes.js';

const router = express.Router();

const controllers = {};
for (const name of Object.keys(routes)) {
    controllers[name] = (await import(`./controllers/${name}.js`)).default;
}

for (let route of Object.entries(routes)) {
    route = { name: route[0], ...route[1] };
    const controller = controllers[route.name];
    for (let action of Object.entries(route.actions)) {
        action = { name: action[0], ...action[1] };
        const callbacks = [];
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
                    next()
                }
            )
        }
        callbacks.push(controller[action.name]);
        router[action.method](route.path + action.path, callbacks);
    }
}

export { router as default };