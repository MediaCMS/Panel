import express from 'express';
import routes from './routes.js';
import config from './config.js';

const router = express.Router();

const controllers = {};
for (const name of Object.keys(routes)) {
    controllers[name] = await import(`./controllers/${name}.js`);
}

console.log();
for (let route of Object.entries(routes)) {
    route = { name: route[0], ...route[1] };
    const path = encodeURI(config.path + route.path);
    const controller = controllers[route.name];
    console.log(
        (!('crud' in route) || (route.crud === true)) ? '+' : '-',
        route.name.padEnd(16, ' '),
        route.path
    );
    if (route?.actions) {
        for (let action of Object.entries(route.actions)) {
            action = { name: action[0], ...action[1] };
            console.log(
                '   ',
                action.name.padEnd(14, ' '), decodeURI(route.path + action.path),
                ` [${action?.method ?? 'get'}]`
            );
            router[action?.method ?? 'get'](
                path + encodeURI(action.path), controller[action.name]
            );
        }
    }
    if (!('crud' in route) || (route.crud === true)) {
        router.get(path, controller['index']);
        router.get(path + '/:id', controller['read']);
        router.post(path, controller['create']);
        router.put(path + '/:id', controller['update']);
        router.delete(path + '/:id', controller['delete']);
    } else {

    }
}
console.log();

router.get('/:slug', async (request, response, next) => {
    console.log(request.params.slug)
    response.status(404);
    next();
});

router.use(async (request, response, next) => {
    if (response.statusCode === 404) {
        response.locals.title = config.notFound.title;
        response.locals.description = config.notFound.description;
        response.locals.keywords = config.notFound.keywords;
        response.render('404');
    }
    next();
});

export { router as default };