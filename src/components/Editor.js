import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import Reducer, { actions } from '../reducers/Editor.js'
import Block from './Editor/Block.js'
import '../assets/styles/components/editor.css'

const components = {}
const types = {
    main: 'Головна', header: 'Заголовок', text: 'Текст', image: 'Зображення',
    video: 'Відео', facebook: 'Фейсбук', twitter: 'Твіттер', map: 'Мапа',
    table: 'Таблиця', list: 'Перелік', quote: 'Цитата', raw: 'Неформат',
    address: 'Адреса', code: 'Код'
}

for(const type of Object.keys(types)) {
    components[type] = (
        await import(/* webpackMode: "eager" */
            './Editor/Blocks/' + type[0].toUpperCase() + type.slice(1) + '.js'
        )
    ).default
}

const Editor = props => {

    const handleInsert = (type, id) => {
        props.blocks.dispatch(
            props.blocks.actions.insert(id, type)
        )
    }

    const handleMove = (direction, id) => {
        props.blocks.dispatch(
            props.blocks.actions.move(id, direction)
        )
    }

    const handleRemove = (_value = null, id) => {
        props.blocks.dispatch(
            props.blocks.actions.remove(id)
        )
    }

    const menu = useMemo(() => {
        const menu = {
            insert: { 
                event: handleInsert, label: 'Додати', variant: 'success',
                submenu: {}
            },
            move: {
                event: handleMove, label: 'Перемістити', variant: 'primary',
                submenu: {
                    first: { label: 'Перший' },
                    up: { label: 'Вгору' },
                    down: { label: 'Вниз' },
                    last: { label: 'Останній' }
                }
            },
            remove: {
                event: handleRemove, label: 'Видалити', variant: 'danger',
            }
        }

        Object.entries(types).slice(1, 8)
        .forEach(([type, label]) => 
            menu.insert.submenu[type] = { label }
        )
        menu.insert.submenu.other = { label: 'Інші', divider: true, submenu: {} }
        Object.entries(types).slice(8)
        .forEach(([type, label]) => 
            menu.insert.submenu.other.submenu[type] = { label }
        )
        return menu
    }, [])

    return <article itemScope="itemscope" itemType="https://schema.org/Article">
        {props.blocks?.state && props.blocks.state.map(block =>
            <Block {...props} {...block} menu={menu} label={types[block.type]}
                component={components[block.type]} key={block.id} />
    )}
    </article>
}

Editor.propTypes = {
    blocks: PropTypes.shape({
        state: PropTypes.arrayOf(PropTypes.object),
        dispatch: PropTypes.func.isRequired,
        actions: PropTypes.shape({
            insert: PropTypes.func.isRequired,
            move: PropTypes.func.isRequired,
            remove: PropTypes.func.isRequired
        }).isRequired
    }).isRequired
}

export { Editor as default, Reducer, actions }