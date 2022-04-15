"use strict"

export default {
    Article: { 
        uri: "/статті",
    }, 
    Category: {
        uri: "/категорії",
    },
    Tag: {
        uri: "/мітки",
    },
    Page: {
        uri: "/сторінки",
    },
    User: {
        uri: "/користувачі",
        actions: {
            login: { uri: '/вхід', method: 'get' },
            logout: { uri: '/вихід', method: 'get' }
        }
    }
}