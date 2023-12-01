export default {
    post: {
        path: '/posts',
        actions: {
            list: { path: '', method: 'get', level: 5 },
            read: { path: '/:id', method: 'get', level: 4 },
            create: { path: '', method: 'post', level: 4, log: true },
            update: { path: '/:id', method: 'put', level: 4, log: true },
            delete: { path: '/:id', method: 'delete', level: 4, log: true }
        }
    },
    image:  {
        path: '/images',
        actions: {
            list: { path: '', method: 'get', level: 5 },
            check: { path: '/check/:id', method: 'get', level: 4 },
            read: { path: '/:id', method: 'get', level: 4 },
            create: { path: '', method: 'post', level: 4, log: true },
            update: { path: '/:id', method: 'put', level: 4, log: true },
            delete: { path: '/:id', method: 'delete', level: 4, log: true }
        }
    },
    gallery:  {
        path: '/galleries',
        actions: {
            list: { path: '', method: 'get', level: 5 },
            read: { path: '/:id', method: 'get', level: 4 },
            create: { path: '', method: 'post', level: 4, log: true },
            update: { path: '/:id', method: 'put', level: 4, log: true },
            delete: { path: '/:id', method: 'delete', level: 4, log: true }
        }
    },
    tag:  {
        path: '/tags',
        actions: {
            list: { path: '', method: 'get', level: 5 },
            read: { path: '/:id', method: 'get', level: 4 },
            create: { path: '', method: 'post', level: 3, log: true },
            update: { path: '/:id', method: 'put', level: 3, log: true },
            delete: { path: '/:id', method: 'delete', level: 3, log: true }
        }
    },
    comment:  {
        path: '/comments',
        actions: {
            list: { path: '', method: 'get', level: 3 },
            read: { path: '/:id', method: 'get', level: 3, log: true },
            update: { path: '/:id', method: 'put', level: 3, log: true },
            delete: { path: '/:id', method: 'delete', level: 3, log: true }
        }
    },
    user: {
        path: '/users',
        actions: {
            list: { path: '', method: 'get', level: 5 },
            read: { path: '/:id', method: 'get', level: 4 },
            login: { path: '/login', method: 'post', log: true },
            create: { path: '', method: 'post', level: 2, log: true },
            update: { path: '/:id', method: 'put', level: 2, log: true },
            logout: { path: '/logout', method: 'delete', level: 4, log: true },
            delete: { path: '/:id', method: 'delete', level: 2, log: true }
        }
    },
    page: {
        path: '/pages',
        actions: {
            list: { path: '', method: 'get', level: 2 },
            read: { path: '/:id', method: 'get', level: 2 },
            create: { path: '', method: 'post', level: 2, log: true },
            update: { path: '/:id', method: 'put', level: 2, log: true },
            delete: { path: '/:id', method: 'delete', level: 2, log: true }
        }
    },
    category: {
        path: '/categories',
        actions: {
            list: { path: '', method: 'get', level: 4 },
            read: { path: '/:id', method: 'get', level: 4 },
            create: { path: '', method: 'post', level: 2, log: true },
            update: { path: '/:id', method: 'put', level: 2, log: true },
            delete: { path: '/:id', method: 'delete', level: 2, log: true }
        }
    },
    type: {
        path: '/types',
        actions: {
            list: { path: '', method: 'get', level: 5 },
            read: { path: '/:id', method: 'get', level: 4 },
            create: { path: '', method: 'post', level: 1, log: true },
            update: { path: '/:id', method: 'put', level: 1, log: true },
            delete: { path: '/:id', method: 'delete', level: 1, log: true }
        }
    },
    role: {
        path: '/roles',
        actions: {
            list: { path: '', method: 'get', level: 5 },
            read: { path: '/:id', method: 'get', level: 4 },
            create: { path: '', method: 'post', level: 1, log: true },
            update: { path: '/:id', method: 'put', level: 1, log: true },
            delete: { path: '/:id', method: 'delete', level: 1, log: true }
        }
    },
    log: {
        path: '/logs',
        actions: {
            list: { path: '', method: 'get', level: 3 }
        }
    }
}