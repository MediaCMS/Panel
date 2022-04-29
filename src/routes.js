"use strict"

import Article from "./controllers/Article.js"
import Category from "./controllers/Category.js"
import Tag from "./controllers/Tag.js"
import Page from "./controllers/Page.js"
import User from "./controllers/User.js"
import Access from "./controllers/Access.js"

export default {
    Article: {
        title: "Статті",
        path: "/статті",
        element: Article,
        actions: {
            Index: { path: "список", title: "Список" },
            Edit: { path: "редактор/:id", title: "Редагувати" },
            Edit: { path: "редактор", title: "Створити" }
        }
    },
    Category: {
        title: "Категорії",
        path: "/категорії",
        element: Category,
        actions: {
            Index: { path: "список", title: "Список" },
            View: { path: "редактор/:id", title: "Редактор" },
        }
    },
    Tag: {
        title: "Мітки",
        path: "/мітки",
        element: Tag,
        actions: {
            Index: { path: "список", title: "Список" },
            View: { path: "редактор/:id", title: "Редактор" }
        }
    },
    User: {
        title: "Автори",
        path: "/користувачі",
        element: User,
        actions: {
            Index: { path: "список", title: "Список" },
            View: { path: "редактор/:id", title: "Редактор" }
        }
    },
    Page: {
        title: "Сторінки",
        path: "/сторінки",
        element: Page,
        actions: {
            Index: { path: "список", title: "Список" },
            View: { path: "редактор/:id", title: "Редактор" }
        }
    },
    Access: {
        path: "/доступ",
        element: Access,
        actions: {
            Login: { path: "вхід", title: "Вхід", layout: false },
            Logout: { path: "вихід", title: "Вихід", layout: false }
        }
    },
}