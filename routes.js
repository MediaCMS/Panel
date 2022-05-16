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
        actions: {
            autocomplete: { path: '/автозаповнення' }
        }
    },
    Page: {
        path: "/сторінки",
    },
    User: {
        path: "/користувачі",
        actions: {
            login: { path: '/вхід' },
            logout: { path: '/вихід' }
        }
    }
}