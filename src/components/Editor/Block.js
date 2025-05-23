import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo, useReducer } from 'react'
import MenuReducer, { actions as menuActions } from '../../reducers/Menu.js'
import Menu from './Menu.js'

const Block = props => {

    const [menuState, menuDispatch] = useReducer(
        MenuReducer, props.menu
    )
    const [isActive, setActive] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const { component, blocks, ...propsNew } = props

    const handleChange = (name, value) => {
        if (props?.onChange) {
            return props.onChange(name, value)
        }
        if (typeof name === 'undefined') {
            return props.blocks.dispatch(
                props.blocks.actions.remove(
                    props.id
                )
            )
        }
        if (typeof name === 'object'
            && !Array.isArray(name) && name !== null) {
            return props.blocks.dispatch(
                props.blocks.actions.merge(
                    props.id, name
                )
            )
        }
        if (typeof value === 'undefined') {
            return props.blocks.dispatch(
                props.blocks.actions.remove(
                    props.id, name
                )
            )
        }
        props.blocks.dispatch(
            props.blocks.actions.update(
                props.id, name, value
            )
        )
    }

    const handlePaste = event => {
        const data = (event.clipboardData
            || window['clipboardData']).getData('text/plain')
        const selection = window.getSelection()
        if (!selection.rangeCount) return
        const range = selection.getRangeAt(0)
        range.deleteContents();
        range.insertNode(document.createTextNode(data))
        selection.collapseToEnd()
        event.preventDefault()
    }

    const handleEnter = event => {
        if (event.key === 'Enter') {
            props.blocks.dispatch(
                props.blocks.actions.insert(
                    props.id, 'text'
                )
            )
            event.preventDefault()
        }
    }

    useEffect(() => {
        if (!props?.size) return
        menuDispatch(
            menuActions.update(
                'resize', { value: props.size }
            )
        )
    }, [props.size])

    const resize = useMemo(() => ({
        value: 'full', label: 'Розмір', variant: 'secondary',
        event: value => handleChange('size', value),
        submenu: {
            small: { label: 'Малий' },
            medium: { label: 'Середній' },
            large: { label: 'Великий' },
            full: { label: 'Повний' }
        }
    }), [])

    return <div data-id={props.id}
        onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)}
        className={`block block-type-${props.type} border-bottom position-relative`}>
        {React.createElement(props.component, { ...propsNew, menu: {
            state: menuState, dispatch: menuDispatch, actions: menuActions, resize 
        }, onChange: handleChange, onPaste: handlePaste, onEnter: handleEnter }, null)}
        {isActive &&
            (<span className="type fs-6 text-capitalize opacity-25 position-absolute">
                <em>{props.label}</em>
            </span>)}
        {isActive ? <Menu items={menuState} id={props.id} /> : null}
    </div>
}

Block.propTypes = {
    menu: PropTypes.object.isRequired,
    component: PropTypes.elementType.isRequired,
    blocks: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
        actions: PropTypes.shape({
            remove: PropTypes.func.isRequired,
            merge: PropTypes.func.isRequired,
            update: PropTypes.func.isRequired,
            insert: PropTypes.func.isRequired
        }).isRequired
    }).isRequired,
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string,
    size: PropTypes.string,
    onChange: PropTypes.func
}

export default Block