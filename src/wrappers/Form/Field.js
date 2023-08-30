import Field from './Field/Field.js'

const modules = [
    'Date', 'DateTime', 'Title', 'Description', 'Body', 'Text', 'Image',
    'Autocomplete', 'Latitude', 'Longitude', 'Slug', 'Status', 'Sort'
]

const components = {}

for await(const module of modules) {
    components[module] = (await import(
        /* webpackMode: "eager" */`./Field/${module}.js`)
    ).default
}

export default Object.assign(Field, components)