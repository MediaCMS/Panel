"use strict"

import React from "react"
import { Routes, Route } from "react-router-dom"
import routes from "./routes.js"
import Layout from "./Layout.js"

export default function () {

    return (
        <Routes>
            {Object.entries(routes).map(([controllerName, controller]) =>
                <Route path={encodeURI(controller.uri) + '/*'} key={controllerName}>
                    {Object.entries(controller.actions).map(([actionName, action]) => (
                        <Route
                            path={(action?.alias ? encodeURI(action.alias) : '')}
                            element={
                                <Layout
                                    controller={{ name: controllerName, uri: controller.uri, module: controller.module }}
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
