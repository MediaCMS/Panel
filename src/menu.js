"use strict"

import routes from "./routes.js"

export default [
    { title: "Статті",      description: "Список статей сайту",             url: routes.Article.uri },
    { title: "Категорії",   description: "Список категорій сайту",          url: routes.Category.uri },
    { title: "Мітки",       description: "Список міток сайту",              url: routes.Tag.uri },
    { title: "Автори",      description: "Список користувачів сайту",       url: routes.User.uri },
    { title: "Сторінки",    description: "Список сторінок сайту",           url: routes.Page.uri },
    { title: "Вихід",       description: "Вихід з панелі куерування",       url: routes.Access.uri + '/' + routes.Access.actions.Logout.alias },
]