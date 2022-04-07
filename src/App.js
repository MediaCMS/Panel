"use strict"

import React from "react"
import { Routes, Route } from "react-router-dom"
import Layout from "./Layout.js"
import routes from "./routes.js"
import User from "./Routes/User.js"

export default function () {

    return (
        <Routes>
            {Object.entries(routes).map(([routeName, route]) =>
                <Route path={encodeURI(route.uri) + '/*'} key={routeName}>
                    {Object.entries(route.subRoutes).map(([subRouteName, subRoute]) => (
                        <Route
                            path={(subRoute?.alias ? encodeURI(subRoute.alias) : '')}
                            element={
                                <Layout
                                    route={{ name: routeName, uri: route.uri, module: route.module }}
                                    subRoute={{ name: subRouteName, ...subRoute}}
                                />}
                            key={subRouteName}
                        />
                    ))}
                </Route>
            )}
            <Route path={encodeURI('/вхід')} key="login" element={React.createElement(User.Login)} />
            <Route path={encodeURI('/вихід')} key="logout" element={React.createElement(User.Logout)} />
        </Routes>
    )
}
