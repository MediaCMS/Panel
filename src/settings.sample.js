"use strict"

export default {
    name: "Медіа",
    slogan: "Панель керування",
    api: {
        url: "http://пк.медіа/ппі",
        key: "",
        timeout: 3_000 
    },
    images: {
        url: "http://фото.медіа/сховище",
        api: "http://фото.медіа/ппі",
        key: "",
        widths: [320, 480, 640, 960, 1280, 1600, 1920, 2560, 3840],
    },
    months: [
        "січня", "лютого", "березня", "квітня", "травня", "червня",
        "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
    ],
    menu: 5,
    notFound: "Сторінка не знайдена",
    alert: "Демонстраційний сайт <a href=\"https://github.com/MediaCMS\" title=\"MediaCMS\" className=\"alert-link\">MediaCMS</a>",
    copyright: "2022"
}