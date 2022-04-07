"use strict"

import Article from "./Routes/Article.js"
import Category from "./Routes/Category.js"
import Tag from "./Routes/Tag.js"
import Page from "./Routes/Page.js"
import User from "./Routes/User.js"

export default {
    Article: {
        uri: "/статті",
        module: Article,
        subRoutes: {
            Index: { title: "Статті" },
            Edit: { alias: ":id?" }
        }
    },
    Category: {
        uri: "/категорії",
        module: Category,
        subRoutes: {
            Index: { title: "Категорії" },
            View: { alias: ":id?" },
        }
    },
    Tag: {
        uri: "/мітки",
        module: Tag,
        subRoutes: {
            Index: { title: "Мітки" },
            View: { alias: ":id?" }
        }
    },
    User: {
        uri: "/користувачі",
        module: User,
        subRoutes: {
            Index: { title: "Автори" },
            View: { alias: ":id?" }
        }
    },
    Page: {
        uri: "/сторінки",
        module: Page,
        subRoutes: {
            Index: { title: "Сторінки" },
            View: { alias: ":id?" }
        }
    },
}