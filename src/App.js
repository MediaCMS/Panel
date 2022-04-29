"use strict"

import React from "react"
import { Routes, Route } from "react-router-dom"
import routes from "./routes.js"
import Layout from "./Layout.js"

export default function () {

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
}
