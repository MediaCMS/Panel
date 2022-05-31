"use strict"

import React from "react"
import { useRoutes } from "react-router-dom"
import Layout from "./Layout.js"
import Article from "./controllers/Article.js"
import Category from "./controllers/Category.js"
import Tag from "./controllers/Tag.js"
import Page from "./controllers/Page.js"
import Role from "./controllers/Role.js"
import User from "./controllers/User.js"
import Log from "./controllers/Log.js"

const routes = [
    { path: encodeURI("/доступ"), element: <Layout template={false} />, children: [
        { path: encodeURI("вхід"), element: <User.Login /> },
        { path: encodeURI("вихід"), element: <User.Logout /> }
    ] },
    { path: "/", element: <Layout template={true} />, children: [
        { path: encodeURI("/статті"),       module: Article },
        { path: encodeURI("/категорії"),    module: Category },
        { path: encodeURI("/мітки"),        module: Tag },
        { path: encodeURI("/сторінки"),     module: Page },
        { path: encodeURI("/ролі"),         module: Role },
        { path: encodeURI("/користувачі"),  module: User },
        { path: encodeURI("/лог"),          element: <Log /> },
    ] },
]

for await (const route of routes[1].children) {
    if (route?.module) {
        route.children = [...route.children ?? [], ...[
            {
                path: encodeURI("список"),
                element: React.createElement(route.module['Index'])
            },
            {
                path: encodeURI("редактор"),
                element: React.createElement(route.module['Editor'])
            },
            {
                path: encodeURI("редактор/:id"),
                element: React.createElement(route.module['Editor'])
            },
        ]]
    }
}


export default function () {

    const element = useRoutes(routes)

    return element
}