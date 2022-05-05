"use strict"

import React from "react"
import { Routes, Route } from "react-router-dom"
import Layout from "./Layout.js"
import ArticleIndex from "./controllers/Article/Index.js"
import ArticleEditor from "./controllers/Article/Editor.js"
import AccessLogin from "./controllers/Access/Login.js"
import AccessLogout from "./controllers/Access/Logout.js"
/*
import Category from "./controllers/Category.js"
import Tag from "./controllers/Tag.js"
import Page from "./controllers/Page.js"
import User from "./controllers/User.js"
*/

export default function () {

    return (
        <Routes>
            <Route path={encodeURI('/доступ')} element={<Layout template={false} />}>
                <Route path={encodeURI('вхід')} element={<AccessLogin />} />
                <Route path={encodeURI('вихід')} element={<AccessLogout />} />
            </Route>
            <Route path={encodeURI('/')} element={<Layout template={true} />}>
                <Route path={encodeURI('статті')}>
                    <Route path={encodeURI('список')} element={<ArticleIndex />} />
                    <Route path={encodeURI('редактор')} element={<ArticleEditor />} />
                    <Route path={encodeURI('редактор/:id')} element={<ArticleEditor />} />
                </Route>
            </Route>
        </Routes>
    )
}