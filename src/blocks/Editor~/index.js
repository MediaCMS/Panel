'use strict'

import React from 'react'
import Reducer, { actions } from './Reducer.js'
import Block from './Block.js'
import './index.scss'

const components = {}
const types = ['main', 'header', 'text', 'image', 'gallery', 'video']

for(const type of types) {
    components[type] = (
        await import(/* webpackMode: "eager" */
            './Blocks/' + type[0].toUpperCase() + type.slice(1) + '.js'
        )
    ).default
}

function Longread(props) {

    const handleInsert = (id, type) => {
        props.blocks.dispatch(
            props.blocks.actions.insert(id, type)
        )
    }

    const handleMove = (id, direction) => {
        props.blocks.dispatch(
            props.blocks.actions.move(id, direction)
        )
    }

    const handleRemove = id => {
        props.blocks.dispatch(
            props.blocks.actions.remove(id)
        )
    }

    const menu = [
        { name: 'Insert', value: 'insert', variant: 'success', event: handleInsert, submenu:
            Object.keys(components).slice(1).map(type => ({
                name: type[0].toUpperCase() + type.slice(1), value: type
            }))
        },
        { name: 'Move', value: 'move', variant: 'primary', event: handleMove, submenu: [
            { name: 'First', value: 'first' },
            { name: 'Up', value: 'up' },
            { name: 'Down', value: 'down' },
            { name: 'Last', value: 'last' }
        ]},
        { name: 'Remove', value: 'remove', variant: 'danger', event: handleRemove }
    ]

    return (
        <article itemScope="itemscope" itemType="https://schema.org/Article"
            style={{ fontSize: 'calc(16px + 0.5vw) !important' }}>
            {props.blocks?.state && props.blocks.state.map(block =>
                <Block {...props} {...block} menu={menu.map(item => ({...item}))}
                    component={components[block.type]} key={block.id} />
            )}
        </article>
    )
}

export { Longread as default, Reducer, actions }