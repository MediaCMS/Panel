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
            login: '/вхід',
            logout: '/вихід'
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