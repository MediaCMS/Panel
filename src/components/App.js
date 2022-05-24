"use strict"

import React from "react"
import { Routes, Route } from "react-router-dom"
import Layout from "./Layout.js"
import Article from "./controllers/Article.js"
import Category from "./controllers/Category.js"
/*
import Tag from "./controllers/Tag.js"
import Page from "./controllers/Page.js"
*/
import User from "./controllers/User.js"

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
            </Route>
        </Routes>
    )
}