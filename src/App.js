import React, { useEffect } from 'react'
import { useRoutes, useOutletContext } from 'react-router-dom'
import Layout from './layouts/Main.js'
import Main from './pages/Main.js'
//import Post from './pages/Post.js'
//import Image from './pages/Image.js'
//import Tag from './pages/Tag.js'
//import Comment from './pages/Comment.js'
import User from './pages/User.js'
import Page from './pages/Page.js'
//import Category from './pages/Category.js'
//import Type from './pages/Type.js'
import Role from './pages/Role.js'
//import Log from './pages/Log.js'
import { Login, Logout } from './pages/Access.js'
import config from './config.js'

const articleLink = document.createElement('link')
articleLink.setAttribute('href', config.main.url + '/blocks.css?v=3')
articleLink.setAttribute('rel', 'stylesheet')
document.head.appendChild(articleLink)

const twitterScript = document.createElement('script')
twitterScript.setAttribute('src', 'https://platform.twitter.com/widgets.js')
twitterScript.setAttribute('charset', 'utf-8')
twitterScript.setAttribute('async', 'true')
document.head.appendChild(twitterScript)

const routes = [
    { path: '/access', element: <Layout template={false} />, children: [
        { path: 'login', element: <Login /> },
        { path: 'logout', element: <Logout /> }
    ] },
    { path: '/', element: <Layout template={true} />, children: [
        { index: true, element: <Main /> },
//        { path: 'posts', element: <Post /> },
//        { path: 'images', element: <Image /> },
//        { path: 'tags', element: <Tag /> },
//        { path: 'comments', element: <Comment /> },
        { path: 'users', element: <User /> },
        { path: 'pages', element: <Page /> },
//        { path: 'categories', element: <Category /> },
//        { path: 'types', element: <Type /> },
        { path: 'roles', element: <Role /> },
//        { path: 'log', element: <Log /> },
        { path: '*', element: <NotFound /> }
    ] }
]

export default function () {

    return useRoutes(routes)
}

function NotFound() {

    const context = useOutletContext()

    useEffect(() => {
        context.init(
            { title: 'Сторінка не знайдена' }
        )
    }, [])

    return (
        <p className="lead">
            За вашим запитом нічого не знайдено.
            Скористайтесь меню щоб знайти необхідну вам сторінку.
        </p>
    )
}