import Field from './Field/Field.js'

const modules = [
    'Title', 'Description', 'Body', 'Image', 
    'Latitude', 'Longitude', 'Slug', 'Date', 'Status'
]

const components = {}

for await(const module of modules) {
    components[module] = (await import(
        /* webpackMode: "eager" */`./Field/${module}.js`)
    ).default
}

export default Object.assign(Field, components)