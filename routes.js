export default [
    {
        name: 'post',
        path: '/posts',
        actions: [
            { name: 'list', path: '', method: 'get', level: 5 },
            { name: 'read', path: '/:id', method: 'get', level: 4 },
            { name: 'create', path: '', method: 'post', level: 4, log: true },
            { name: 'update', path: '/:id', method: 'put', level: 4, log: true },
            { name: 'delete', path: '/:id', method: 'delete', level: 4, log: true }
        ]
    },
    {
        name: 'image',
        path: '/images',
        actions: [
            { name: 'list', path: '', method: 'get', level: 5 },
            { name: 'read', path: '/:id', method: 'get', level: 4 },
            { name: 'create', path: '', method: 'post', level: 3, log: true },
            { name: 'update', path: '/:id', method: 'put', level: 3, log: true },
            { name: 'delete', path: '/:id', method: 'delete', level: 3, log: true }
        ]
    },
    {
        name: 'tag',
        path: '/tags',
        actions: [
            { name: 'list', path: '', method: 'get', level: 5 },
            { name: 'read', path: '/:id', method: 'get', level: 4 },
            { name: 'create', path: '', method: 'post', level: 3, log: true },
            { name: 'update', path: '/:id', method: 'put', level: 3, log: true },
            { name: 'delete', path: '/:id', method: 'delete', level: 3, log: true }
        ]
    },
    {
        name: 'comment',
        path: '/comments',
        actions: [
            { name: 'list', path: '', method: 'get', level: 3 },
            { name: 'read', path: '/:id', method: 'get', level: 3, log: true },
            { name: 'update', path: '/:id', method: 'put', level: 3, log: true },
            { name: 'delete', path: '/:id', method: 'delete', level: 3, log: true }
        ]
    },
    {
        name: 'user',
        path: '/users',
        actions: [
            { name: 'list', path: '', method: 'get', level: 5 },
            { name: 'read', path: '/:id', method: 'get', level: 4 },
            { name: 'login', path: '/login', method: 'post', log: true, access: true },
            { name: 'create', path: '', method: 'post', level: 2, log: true },
            { name: 'update', path: '/:id', method: 'put', level: 2, log: true },
            { name: 'logout', path: '/logout', method: 'delete', level: 4, log: true },
            { name: 'delete', path: '/:id', method: 'delete', level: 2, log: true }
        ]
    },
    {
        name: 'page',
        path: '/pages',
        actions: [
            { name: 'list', path: '', method: 'get', level: 3 },
            { name: 'read', path: '/:id', method: 'get', level: 3 },
            { name: 'create', path: '', method: 'post', level: 3, log: true },
            { name: 'update', path: '/:id', method: 'put', level: 3, log: true },
            { name: 'delete', path: '/:id', method: 'delete', level: 3, log: true }
        ]
    },
    {
        name: 'category',
        path: '/categories',
        actions: [
            { name: 'list', path: '', method: 'get', level: 5 },
            { name: 'read', path: '/:id', method: 'get', level: 4 },
            { name: 'create', path: '', method: 'post', level: 1, log: true },
            { name: 'update', path: '/:id', method: 'put', level: 1, log: true },
            { name: 'delete', path: '/:id', method: 'delete', level: 1, log: true }
        ]
    },
    {
        name: 'type',
        path: '/types',
        actions: [
            { name: 'list', path: '', method: 'get', level: 5 },
            { name: 'read', path: '/:id', method: 'get', level: 4 },
            { name: 'create', path: '', method: 'post', level: 1, log: true },
            { name: 'update', path: '/:id', method: 'put', level: 1, log: true },
            { name: 'delete', path: '/:id', method: 'delete', level: 1, log: true }
        ]
    },
    {
        name: 'role',
        path: '/roles',
        actions: [
            { name: 'list', path: '', method: 'get', level: 2 },
            { name: 'read', path: '/:id', method: 'get', level: 1 },
            { name: 'create', path: '', method: 'post', level: 1, log: true },
            { name: 'update', path: '/:id', method: 'put', level: 1, log: true },
            { name: 'delete', path: '/:id', method: 'delete', level: 1, log: true }
        ]
    },
    {
        name: 'log',
        path: '/logs',
        actions: [
            { name: 'list', path: '', method: 'get', level: 1 }
        ]
    }
]