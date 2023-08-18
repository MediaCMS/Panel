export default {
    post: {
        path: '/публікації',
        actions: {
            list: { path: '', method: 'get', level: 5 },
            read: { path: '/:id', method: 'get', level: 4 },
            create: { path: '', method: 'post', level: 4 },
            update: { path: '/:id', method: 'put', level: 4 },
            delete: { path: '/:id', method: 'delete', level: 4 }
        }
    },
    //image: '/зображення',
    tag:  {
        path: '/мітки',
        actions: {
            list: { path: '', method: 'get', level: 5 },
            read: { path: '/:id', method: 'get', level: 4 },
            create: { path: '', method: 'post', level: 3 },
            update: { path: '/:id', method: 'put', level: 3 },
            delete: { path: '/:id', method: 'delete', level: 3 }
        }
    },
    comment:  {
        path: '/коментарі',
        actions: {
            list: { path: '', method: 'get', level: 3 },
            read: { path: '/:id', method: 'get', level: 3 },
            update: { path: '/:id', method: 'put', level: 3 },
            delete: { path: '/:id', method: 'delete', level: 3 }
        }
    },
    user: {
        path: '/користувачі',
        actions: {
            list: { path: '', method: 'get', level: 5 },
            read: { path: '/:id', method: 'get', level: 4 },
            login: { path: '/вхід', method: 'post' },
            create: { path: '', method: 'post', level: 2 },
            update: { path: '/:id', method: 'put', level: 2 },
            logout: { path: '/вихід', method: 'delete', level: 4 },
            delete: { path: '/:id', method: 'delete', level: 2 }
        }
    },
    page: {
        path: '/сторінки',
        actions: {
            list: { path: '', method: 'get', level: 2 },
            read: { path: '/:id', method: 'get', level: 2 },
            create: { path: '', method: 'post', level: 2 },
            update: { path: '/:id', method: 'put', level: 2 },
            delete: { path: '/:id', method: 'delete', level: 2 }
        }
    },
    category: {
        path: '/категорії',
        actions: {
            list: { path: '', method: 'get', level: 4 },
            read: { path: '/:id', method: 'get', level: 4 },
            create: { path: '', method: 'post', level: 2 },
            update: { path: '/:id', method: 'put', level: 2 },
            delete: { path: '/:id', method: 'delete', level: 2 }
        }
    },
    type: {
        path: '/типи',
        actions: {
            list: { path: '', method: 'get', level: 5 },
            read: { path: '/:id', method: 'get', level: 4 },
            create: { path: '', method: 'post', level: 1 },
            update: { path: '/:id', method: 'put', level: 1 },
            delete: { path: '/:id', method: 'delete', level: 1 }
        }
    },
    role: {
        path: '/ролі',
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
        path: '/лог',
        actions: {
            read: '/:id',
            list: ''
        }
    }
    */
}