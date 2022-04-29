"use strict"

import routes from "./routes.js"

export default [
    { title: "Статті",      description: "Список статей сайту",             url: routes.Article.path + '/' + routes.Article.actions.Index.path },
    { title: "Категорії",   description: "Список категорій сайту",          url: routes.Category.path + '/' + routes.Category.actions.Index.path },
    { title: "Мітки",       description: "Список міток сайту",              url: routes.Tag.path + '/' + routes.Tag.actions.Index.path },
    { title: "Автори",      description: "Список користувачів сайту",       url: routes.User.path + '/' + routes.User.actions.Index.path },
    { title: "Сторінки",    description: "Список сторінок сайту",           url: routes.Page.path + '/' + routes.Page.actions.Index.path },
    { title: "Вихід",       description: "Вихід з панелі куерування",       url: routes.Access.path + '/' + routes.Access.actions.Logout.path },
]