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
            callbacks.push(
                (request, response, next) => {
                    if (response.locals.user.role.level > action.level) {
                        return response.sendStatus(403);
                    }
                    next();
                }
            );
        }
        callbacks.push(controller[action.name]);
        if (!('log' in action) || action.log) {
            callbacks.push((request, response) => 
                log.create.bind(request, response, route.name, action.name),
            )
        }
        router[action.method](route.path + action.path, callbacks);
    }
}

router.all('*', async (request, response, next) => {
    console.log('404', request.path)
    response.sendStatus(404);
    next();
});

export { router as default };