export default {
    post: '/публікації',
    image: '/зображення',
    tag: {
        path: '/мітки',
        actions: {
            autocomplete: '/автозаповнення'
        }
    },
    comment: '/коментарі',
    user: {
        path: '/користувачі',
        actions: {
            login: { path: '/вхід', method: 'post' },
            logout: { path: '/вихід', method: 'delete' }
        }
    },
    page: '/сторінки',
    category: '/категорії',
    type: '/типи',
    role: '/ролі',
    log: {
        path: '/лог',
        crud: false,
        actions: {
            read: '/:id',
            list: ''
        }
    }
}