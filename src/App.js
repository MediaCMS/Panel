import React, { useEffect } from 'react'
import { useRoutes, useOutletContext } from 'react-router-dom'
import Layout from './Layout.js'
import Main from './routes/Main.js'
//import Post from './routes/Post.js'
//import Image from './routes/Image.js'
//import Tag from './routes/Tag.js'
//import Comment from './routes/Comment.js'
//import User from './routes/User.js'
//import Page from './routes/Page.js'
//import Category from './routes/Category.js'
//import Type from './routes/Type.js'
//import Role from './routes/Role.js'
//import Log from './routes/Log.js'

const routes = [
    /*
    { path: encodeURI('/доступ'), element: <Layout template={false} />, children: [
        { path: encodeURI('вхід'), element: <User.Login /> },
        { path: encodeURI('вихід'), element: <User.Logout /> }
    ] },
    */

    { path: '/', element: <Layout template={true} />, children: [
        { index: true,                      element: <Main /> },
        //{ path: encodeURI('/публікації'),   module: Post },
        //{ path: encodeURI('/зображення'),   module: Image },
        //{ path: encodeURI('/мітки'),        module: Tag },
        //{ path: encodeURI('/коментарі'),    module: Comment },
        //{ path: encodeURI('/користувачі'),  module: User },
        //{ path: encodeURI('/сторінки'),     module: Page },
        //{ path: encodeURI('/категорії'),    module: Category },
        //{ path: encodeURI('/типи'),         module: Type },
        //{ path: encodeURI('/ролі'),         module: Role },
        //{ path: encodeURI('/логи/список'),  element: <Log.Index /> },
        { path: '*', element: <NotFound /> }
    ] }
]
/*
for await (const route of routes[1].children) {
    if (route?.module) {
        route.children = [...route.children ?? [], ...[
            {
                path: encodeURI('список'),
                element: React.createElement(route.module['Index'])
            }, {
                path: encodeURI('редактор'),
                element: React.createElement(route.module['Editor'])
            }, {
                path: encodeURI('редактор/:id'),
                element: React.createElement(route.module['Editor'])
            },
        ]]
    }
}
*/
export default function () {

    return useRoutes(routes)
}

function NotFound() {

    const context = useOutletContext()

    useEffect(() => {
        context.init({ title: 'Сторінка не знайдена' })
    }, [])

    return (
        <p className="lead">
            За вашим запитом нічого не знайдено.
            Скористайтесь меню щоб знайти необхідну вам сторінку.
        </p>
    )
}
