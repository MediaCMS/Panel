export default {
    post: {
        path: '/posts',
        actions: {
            list: { path: '', method: 'get', level: 5 },
            read: { path: '/:id', method: 'get', level: 4 },
            create: { path: '', method: 'post', level: 4 },
            update: { path: '/:id', method: 'put', level: 4 },
            delete: { path: '/:id', method: 'delete', level: 4 }
        }
    },
    image:  {
        path: '/images',
        actions: {
            list: { path: '', method: 'get', level: 5 },
            read: { path: '/:id', method: 'get', level: 4 },
            create: { path: '', method: 'post', level: 4 },
            update: { path: '/:id', method: 'put', level: 4 },
            delete: { path: '/:id', method: 'delete', level: 4 }
        }
    },
    tag:  {
        path: '/tags',
        actions: {
            list: { path: '', method: 'get', level: 5 },
            read: { path: '/:id', method: 'get', level: 4 },
            create: { path: '', method: 'post', level: 3 },
            update: { path: '/:id', method: 'put', level: 3 },
            delete: { path: '/:id', method: 'delete', level: 3 }
        }
    },
    comment:  {
        path: '/comments',
        actions: {
            list: { path: '', method: 'get', level: 3 },
            read: { path: '/:id', method: 'get', level: 3 },
            update: { path: '/:id', method: 'put', level: 3 },
            delete: { path: '/:id', method: 'delete', level: 3 }
        }
    },
    user: {
        path: '/users',
        actions: {
            list: { path: '', method: 'get', level: 5 },
            read: { path: '/:id', method: 'get', level: 4 },
            login: { path: '/login', method: 'post' },
            create: { path: '', method: 'post', level: 2 },
            update: { path: '/:id', method: 'put', level: 2 },
            logout: { path: '/logout', method: 'delete', level: 4 },
            delete: { path: '/:id', method: 'delete', level: 2 }
        }
    },
    page: {
        path: '/pages',
        actions: {
            list: { path: '', method: 'get', level: 2 },
            read: { path: '/:id', method: 'get', level: 2 },
            create: { path: '', method: 'post', level: 2 },
            update: { path: '/:id', method: 'put', level: 2 },
            delete: { path: '/:id', method: 'delete', level: 2 }
        }
    },
    category: {
        path: '/categories',
        actions: {
            list: { path: '', method: 'get', level: 4 },
            read: { path: '/:id', method: 'get', level: 4 },
            create: { path: '', method: 'post', level: 2 },
            update: { path: '/:id', method: 'put', level: 2 },
            delete: { path: '/:id', method: 'delete', level: 2 }
        }
    },
    type: {
        path: '/types',
        actions: {
            list: { path: '', method: 'get', level: 5 },
            read: { path: '/:id', method: 'get', level: 4 },
            create: { path: '', method: 'post', level: 1 },
            update: { path: '/:id', method: 'put', level: 1 },
            delete: { path: '/:id', method: 'delete', level: 1 }
        }
    },
    role: {
        path: '/roles',
        actions: {
            list: { path: '', method: 'get', level: 5 },
            read: { path: '/:id', method: 'get', level: 4 },
            create: { path: '', method: 'post', level: 1 },
            update: { path: '/:id', method: 'put', level: 1 },
            delete: { path: '/:id', method: 'delete', level: 1 }
        }
    },
    /*
    log: {
        path: '/log',
        actions: {
            read: '/:id',
            list: ''
        }
    }
    */
}