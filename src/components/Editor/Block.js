import React, { useState, useEffect, useMemo, useReducer } from 'react'
import MenuReducer, { actions as menuActions } from '../../reducers/Menu.js'
import Menu from './Menu.js'

export default props => {

    const [menuState, menuDispatch] = useReducer(MenuReducer, props.menu)
    const [isActive, setActive] = useState(false)
    const { component, blocks, ...propsNew } = props

    const handleChange = (name, value) => {
        if (typeof name === 'undefined') {
            return props.blocks.dispatch(
                props.blocks.actions.remove(props.id)
            )
        }
        if (typeof value === 'undefined') {
            return props.blocks.dispatch(
                props.blocks.actions.remove(props.id, name)
            )
        }
        props.blocks.dispatch(
            props.blocks.actions.update(
                props.id, { [name]: value }
            )
        )
    }

    useEffect(() => {
        if (!props?.size) return
        menuDispatch(
            menuActions.update('resize', { value: props.size })
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

    return <div
        data-id={props.id}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        className={`block block-type-${props.type} border-bottom position-relative`}>
        {React.createElement(props.component, { ...propsNew, menu: {
            state: menuState, dispatch: menuDispatch, actions: menuActions, resize 
        }, onChange: handleChange}, null)}
        {isActive && 
            (<span className="type fs-6 text-capitalize opacity-25 position-absolute">
                <em>{props.label}</em>
            </span>)}
        {isActive ? <Menu items={menuState} id={props.id} /> : null}
    </div>
}