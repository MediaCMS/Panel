"use strict"

import React from "react"
import { useRoutes } from "react-router-dom"
import Layout from "./Layout.js"
import Publication from "./controllers/Publication.js"
import Photo from "./controllers/Photo.js"
import Tag from "./controllers/Tag.js"
import Comment from "./controllers/Comment.js"
import User from "./controllers/User.js"
import Page from "./controllers/Page.js"
import Category from "./controllers/Category.js"
import Type from "./controllers/Type.js"
import Role from "./controllers/Role.js"
import Log from "./controllers/Log.js"

const routes = [
    { path: encodeURI("/доступ"), element: <Layout template={false} />, children: [
        { path: encodeURI("вхід"), element: <User.Login /> },
        { path: encodeURI("вихід"), element: <User.Logout /> }
    ] },
    { path: "/", element: <Layout template={true} />, children: [
        { path: encodeURI("/публікації"),   module: Publication },
        { path: encodeURI("/фото"),         module: Photo },
        { path: encodeURI("/мітки"),        module: Tag },
        { path: encodeURI("/коментарі"),    module: Comment },
        { path: encodeURI("/користувачі"),  module: User },
        { path: encodeURI("/сторінки"),     module: Page },
        { path: encodeURI("/категорії"),    module: Category },
        { path: encodeURI("/типи"),         module: Type },
        { path: encodeURI("/ролі"),         module: Role },
        { path: encodeURI("/логи/список"),  element: <Log.Index /> },
    ] },
]

for await (const route of routes[1].children) {
    if (route?.module) {
        route.children = [...route.children ?? [], ...[
            {
                path: encodeURI("список"),
                element: React.createElement(route.module['Index'])
            }, {
                path: encodeURI("редактор"),
                element: React.createElement(route.module['Editor'])
            }, {
                path: encodeURI("редактор/:id"),
                element: React.createElement(route.module['Editor'])
            },
        ]]
    }
}


export default function () {

    return useRoutes(routes)
}