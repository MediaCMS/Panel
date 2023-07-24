import React, { useEffect } from 'react'
import { useRoutes, useOutletContext } from 'react-router-dom'
import Layout from './Layout.js'
import Main from './routes/Main.js'
//import Post from './routes/Post.js'
//import Image from './routes/Image.js'
//import Tag from './routes/Tag.js'
//import Comment from './routes/Comment.js'
//import User from './routes/User.js'
import Page from './routes/Page.js'
import Category from './routes/Category.js'
import Type from './routes/Type.js'
import Role from './routes/Role.js'
//import Log from './routes/Log.js'
import Access from './routes/Access.js'

const routes = [
    { path: '/доступ', element: <Layout template={false} />, children: [
        { path: 'вхід', element: <Access.Login /> },
        { path: 'вихід', element: <Access.Logout /> }
    ] },
    { path: '/', element: <Layout template={true} />, children: [
        { index: true,           element: <Main /> },
        //{ path: '/публікації',   module: Post },
        //{ path: '/зображення',   module: Image },
        //{ path: '/мітки',        module: Tag },
        //{ path: '/коментарі',    module: Comment },
        //{ path: '/користувачі',  module: User },
        { path: '/сторінки',     module: Page },
        { path: '/категорії',    module: Category },
        { path: '/типи',         module: Type },
        { path: 'ролі',          module: Role },
        //{ path: '/логи/список',  element: <Log.Index /> },
        { path: '*',             element: <NotFound /> }
    ] }
]

for await (const route of routes[1].children) {
    if (route?.module) {
        route.children = [...route.children ?? [], ...[
            {
                path: 'список',
                element: React.createElement(route.module['Index'])
            }, {
                path: 'редактор',
                element: React.createElement(route.module['Editor'])
            }, {
                path: 'редактор/:id',
                element: React.createElement(route.module['Editor'])
            },
            { path: '*', element: <NotFound /> }
        ]]
    }
}

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
