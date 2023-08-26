import React, { useEffect } from 'react'
import { useRoutes, useOutletContext } from 'react-router-dom'
import Layout from './Layout.js'
import Main from './routes/Main.js'
import Post from './routes/Post.js'
//import Image from './routes/Image.js'
import Tag from './routes/Tag.js'
import Comment from './routes/Comment.js'
import User from './routes/User.js'
import Page from './routes/Page.js'
import Category from './routes/Category.js'
import Type from './routes/Type.js'
import Role from './routes/Role.js'
//import Log from './routes/Log.js'
import Access from './routes/Access.js'

const routes = [
    { path: '/access', element: <Layout template={false} />, children: [
        { path: 'login', element: <Access.Login /> },
        { path: 'logout', element: <Access.Logout /> }
    ] },
    { path: '/', element: <Layout template={true} />, children: [
        { index: true, element: <Main /> },
        { path: 'posts', module: Post },
        //{ path: 'photo', module: Image },
        { path: 'tags', module: Tag },
        { path: 'comments', module: Comment },
        { path: 'users', module: User },
        { path: 'pages', module: Page },
        { path: 'categories', module: Category },
        { path: 'types', module: Type },
        { path: 'roles', module: Role },
        //{ path: 'log/list', element: <Log.Index /> },
        { path: '*', element: <NotFound /> }
    ] }
]

for await (const route of routes[1].children) {
    if (route?.module) {
        route.children = [...route.children ?? [], ...[
            {
                path: 'list',
                element: React.createElement(route.module['Index'])
            }, {
                path: 'editor',
                element: React.createElement(route.module['Editor'])
            }, {
                path: 'editor/:id',
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
