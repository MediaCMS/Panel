"use strict"

export default {
    Publication: { path: "/публікації" }, 
    Photo: { path: "/фото" },
    Tag: {
        path: "/мітки",
        actions: {
            autocomplete: { path: '/автозаповнення' }
        }
    },
    Comment: { path: "/коментарі" },
    User: {
        path: "/користувачі",
        actions: {
            login: { path: '/вхід' },
            logout: { path: '/вихід' }
        }
    },
    Page: { path: "/сторінки" },
    Category: { path: "/категорії" },
    Type: { path: "/типи" },
    Role: { path: "/ролі" },
    Log: { 
        path: "/лог",
        kit: false,
        actions: {
            findOne: { path: '/:id' },
            findMany: { path: '' }
        }
    }
}