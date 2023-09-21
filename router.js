import express from 'express';
import routes from './routes.js';
import log from './controllers/log.js';

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
        if ('level' in action) {
            callbacks.push((request, response, next) => {
                if (response.locals.user.role.level > action.level) {
                    return response.sendStatus(403);
                }
                next();
            })
        }
        if (('log' in action) && action.log) {
            callbacks.push(
                new Proxy(controller[action.name], {
                    apply: async (target, thisArg, args) => {
                        await target(...args);
                        log.create(args[0], args[1], route.name, action.name);
                    }
                })
            )
        } else {
            callbacks.push(controller[action.name]);
        }
        router[action.method](route.path + action.path, callbacks);
    }
}

export { router as default };