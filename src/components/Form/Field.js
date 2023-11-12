import Field from './Field/Field.js'
import Image from './Field/Image.js'

const modules = [
    'Date', 'DateTime', 'Title', 'Description', 'Body', 'Text', 'Tag', 'Image',
    'Autocomplete', 'Latitude', 'Longitude', 'Slug', 'Status', 'Sort'
]

const fields = {}

for (const module of modules) {
    fields[module] = (await import(
        /* webpackMode: "eager" */`./Field/${module}.js`)
    ).default
}

export default Object.assign(Field, fields)