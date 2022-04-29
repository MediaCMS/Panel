"use strict"

export default {
    Article: { 
        path: "/статті",
    }, 
    Category: {
        path: "/категорії",
    },
    Tag: {
        path: "/мітки",
    },
    Page: {
        path: "/сторінки",
    },
    User: {
        path: "/користувачі",
        actions: {
            login: { path: '/вхід', method: 'get' },
            logout: { path: '/вихід', method: 'get' }
        }
    }
}