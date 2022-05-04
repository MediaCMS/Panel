"use strict"

import React from "react"
//import { Navigate } from "react-router-dom"
import Layout from "./Layout.js"
import Article from "./controllers/Article.js"
import Access from "./controllers/Access.js"
/*
import Category from "./controllers/Category.js"
import Tag from "./controllers/Tag.js"
import Page from "./controllers/Page.js"
import User from "./controllers/User.js"
*/

export default [
    { path: encodeURI('/доступ'), element: <Layout template={false} />, children: [
        { path: encodeURI('вхід'), element: <Access.Login /> },
        { path: encodeURI('вихід'), element: <Access.Logout /> },
    ] },
    { path: encodeURI('/'), element: <Layout template={true} />, children: [
        { path: encodeURI('статті'), /*element: <Navigate replace to="/статті/список" />,*/ children: [
            { path: encodeURI('список'), element: <Article.Index /> },
            { path: encodeURI('редактор/:id'), element: <Article.Edit /> },
            { path: encodeURI('редактор'), element: <Article.Edit /> },
        ] },
    ] },
  ]

const Routes = {
    Article: {
        title: "Статті",
        path: "/статті",
        //element: Article,
        actions: {
            Index: { path: "список", title: "Список" },
            Edit: { path: "редактор/:id", title: "Редагувати" },
            Edit: { path: "редактор", title: "Створити" }
        }
    },
    Category: {
        title: "Категорії",
        path: "/категорії",
        //element: Category,
        actions: {
            Index: { path: "список", title: "Список" },
            View: { path: "редактор/:id", title: "Редактор" },
        }
    },
    Tag: {
        title: "Мітки",
        path: "/мітки",
        //element: Tag,
        actions: {
            Index: { path: "список", title: "Список" },
            View: { path: "редактор/:id", title: "Редактор" }
        }
    },
    User: {
        title: "Автори",
        path: "/користувачі",
        //element: User,
        actions: {
            Index: { path: "список", title: "Список" },
            View: { path: "редактор/:id", title: "Редактор" }
        }
    },
    Page: {
        title: "Сторінки",
        path: "/сторінки",
        //element: Page,
        actions: {
            Index: { path: "список", title: "Список" },
            View: { path: "редактор/:id", title: "Редактор" }
        }
    },
    Access: {
        path: "/доступ",
        //element: Access,
        actions: {
            Login: { path: "вхід", title: "Вхід", layout: false },
            Logout: { path: "вихід", title: "Вихід", layout: false }
        }
    },
}