"use strict"

import React from "react"
import { Routes, Route } from "react-router-dom"
import Layout from "./Layout.js"
import Article from "./controllers/Article.js"
import Category from "./controllers/Category.js"
import Tag from "./controllers/Tag.js"
import Page from "./controllers/Page.js"
import Role from "./controllers/Role.js"
import User from "./controllers/User.js"

const modules = {}
const routes = ['Article', 'Category', 'Tag', 'Page', 'Role', 'User', { name: 'Log', kit: false }]
routes.map(async route => {
    const routeName = (typeof route === 'string') ? route : route.name
    console.log(route, routeName)
    modules[routeName] = await import(/* webpackMode: "eager" */`./controllers/${routeName}.js`)
})
console.log(modules)

export default function () {

    return (
        <Routes>
            <Route path={encodeURI('/доступ')} element={<Layout template={false} />}>
                <Route path={encodeURI('вхід')} element={<User.Login />} />
                <Route path={encodeURI('вихід')} element={<User.Logout />} />
            </Route>
            <Route path={encodeURI('/')} element={<Layout template={true} />}>
                <Route path={encodeURI('статті')}>
                    <Route path={encodeURI('список')} element={<Article.Index />} />
                    <Route path={encodeURI('редактор')} element={<Article.Editor />} />
                    <Route path={encodeURI('редактор/:id')} element={<Article.Editor />} />
                </Route>
                <Route path={encodeURI('категорії')}>
                    <Route path={encodeURI('список')} element={<Category.Index />} />
                    <Route path={encodeURI('редактор')} element={<Category.Editor />} />
                    <Route path={encodeURI('редактор/:id')} element={<Category.Editor />} />
                </Route>
                <Route path={encodeURI('мітки')}>
                    <Route path={encodeURI('список')} element={<Tag.Index />} />
                    <Route path={encodeURI('редактор')} element={<Tag.Editor />} />
                    <Route path={encodeURI('редактор/:id')} element={<Tag.Editor />} />
                </Route>
                <Route path={encodeURI('сторінки')}>
                    <Route path={encodeURI('список')} element={<Page.Index />} />
                    <Route path={encodeURI('редактор')} element={<Page.Editor />} />
                    <Route path={encodeURI('редактор/:id')} element={<Page.Editor />} />
                </Route>
                <Route path={encodeURI('ролі')}>
                    <Route path={encodeURI('список')} element={<Role.Index />} />
                    <Route path={encodeURI('редактор')} element={<Role.Editor />} />
                    <Route path={encodeURI('редактор/:id')} element={<Role.Editor />} />
                </Route>
                <Route path={encodeURI('користувачі')}>
                    <Route path={encodeURI('список')} element={<User.Index />} />
                    <Route path={encodeURI('редактор')} element={<User.Editor />} />
                    <Route path={encodeURI('редактор/:id')} element={<User.Editor />} />
                </Route>
            </Route>
        </Routes>
    )
}