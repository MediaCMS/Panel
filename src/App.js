import React, { useEffect } from 'react'
import { useRoutes, useOutletContext } from 'react-router-dom'
import Layout from './layouts/Main.js'
import Main from './pages/Main.js'
import Post from './pages/Post.js'
import Image from './pages/Image.js'
import Tag from './pages/Tag.js'
import Comment from './pages/Comment.js'
import User from './pages/User.js'
import Page from './pages/Page.js'
import Category from './pages/Category.js'
import Type from './pages/Type.js'
import Role from './pages/Role.js'
import Log from './pages/Log.js'
import Access from './pages/Access.js'

const routes = [
    { path: '/access', element: <Layout template={false} />, children: [
        { path: 'login', element: <Access.Login /> },
        { path: 'logout', element: <Access.Logout /> }
    ] },
    { path: '/', element: <Layout template={true} />, children: [
        { index: true, element: <Main /> },
        { path: 'posts', module: Post },
        { path: 'images', element: <Image /> },
        { path: 'tags', module: Tag },
        { path: 'comments', module: Comment },
        { path: 'users', module: User },
        { path: 'pages', module: Page },
        { path: 'categories', module: Category },
        { path: 'types', element: <Type /> },
        { path: 'roles', module: Role },
        { path: 'log', children: [
            { path: 'list', element: <Log.Index /> }
        ] },
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
