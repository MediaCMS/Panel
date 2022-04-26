"use strict"

import Article from "./controllers/Article.js"
import Category from "./controllers/Category.js"
import Tag from "./controllers/Tag.js"
import Page from "./controllers/Page.js"
import User from "./controllers/User.js"
import Access from "./controllers/Access.js"

export default {
    Article: {
        uri: "/статті",
        module: Article,
        actions: {
            Index: { title: "Статті" },
            Edit: { alias: ":id?" }
        }
    },
    Category: {
        uri: "/категорії",
        module: Category,
        actions: {
            Index: { title: "Категорії" },
            View: { alias: ":id?" },
        }
    },
    Tag: {
        uri: "/мітки",
        module: Tag,
        actions: {
            Index: { title: "Мітки" },
            View: { alias: ":id?" }
        }
    },
    User: {
        uri: "/користувачі",
        module: User,
        actions: {
            Index: { title: "Автори" },
            View: { alias: ":id?" }
        }
    },
    Page: {
        uri: "/сторінки",
        module: Page,
        actions: {
            Index: { title: "Сторінки" },
            View: { alias: ":id?" }
        }
    },
    Access: {
        uri: "/доступ",
        module: Access,
        actions: {
            Login: { alias: "вхід", title: "Вхід", layout: false },
            Logout: { alias: "вихід", title: "Вихід", layout: false }
        }
    },
}