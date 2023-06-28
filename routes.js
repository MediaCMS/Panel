export default {
    post: { path: '/публікації' },
    /*
    image: { path: '/зображення' },
    tag: {
        path: '/мітки',
        actions: {
            autocomplete: { path: '/автозаповнення' }
        }
    },
    comment: { path: '/коментарі' },
    */
    user: {
        path: '/користувачі',
        actions: {
            login: { path: '/вхід' },
            logout: { path: '/вихід' }
        }
    },
    /*
    page: { path: '/сторінки' },
    category: { path: '/категорії' },
    type: { path: '/типи' },
    role: { path: '/ролі' },
    log: { 
        path: '/лог',
        crud: false,
        actions: {
            findOne: { path: '/:id' },
            findMany: { path: '' }
        }
    }
    */
}