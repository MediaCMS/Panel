"use strict"

import React from "react"
import { Routes, Route, useRoutes } from "react-router-dom"
//import Access from "./controllers/Access.js"
//import Article from "./controllers/Article.js"
//import routes from "./routes.js"
import routes from "./routes2.js"
//import Layout from "./Layout.js"

export default function () {

    return useRoutes(routes)
}
/*
    return (
        <Routes>
            <Route path={encodeURI('/вхід')} element={<Access.Login />} />
            <Route path={encodeURI('/')} element={<Layout title="Список" />}>
                <Route path={encodeURI('статті')}>
                    <Route path={encodeURI('список')} element={<Article.Index title="Список" />} />
                    <Route path={encodeURI('редактор')} element={<Article.Edit title="Редактор" />} />
                    <Route path={encodeURI('редактор/:id')} element={<Article.Edit title="Редактор" />} />
                </Route>
            </Route>
        </Routes>
    )
*/
/*
    return (
        <Routes>
            {Object.entries(routes).map(([controllerName, controller]) =>
                <Route path={encodeURI(controller.path) + '/*'} key={controllerName}>
                    {Object.entries(controller.actions).map(([actionName, action]) => (
                        <Route
                            path={encodeURI(action.path)}
                            element={
                                <Layout
                                    controller={{
                                        name: controllerName,
                                        title: controller.title,
                                        path: controller.path,
                                        element: controller.element
                                    }}
                                    action={{ name: actionName, ...action}}
                                />}
                            key={actionName}
                        />
                    ))}
                </Route>
            )}
        </Routes>
    )
*/
