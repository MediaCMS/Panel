import React from 'react'
import Context from '../contexts/Form.js'
import Standard from './Form/Standard.js'
import Modal from './Form/Modal.js'
import Field from './Form/Field.js'
import Control from './Form/Control.js'
import Row from './Form/Row.js'
import Cell from './Form/Cell.js'
import '../assets/styles/components/form.css'

const FormWrapper = props => {

    const actions = { 
        set: (name, value, override) => {
            props.onChange(dataOld => {
                const dataNew = { ...dataOld }
                recurse(dataNew, name.split('.'), value, override)
                return dataNew
            })
        },
        get: name => {
            return recurse(props.data, name.split('.'))
        }
    }

    const handleSubmit = event => {
        event.preventDefault()
        event.stopPropagation()
        props.onSubmit(
            Object.fromEntries(
                new FormData(event.target)
            )
        )
    }

    return (
        <Context.Provider value={actions}>
            {(props?.as && (props.as === 'modal')) 
                ?   <Modal {...props} onSubmit={handleSubmit} />
                :   <Standard {...props} onSubmit={handleSubmit} />
            }
        </Context.Provider>
    )
}

function recurse(data, name, value, override = true) {
    if (name.length > 1) {
        if (typeof data[name[0]] === 'undefined') {
            data[name[0]] = {}
        }
        return recurse(data[name[0]], name.slice(1), value, override)
    } else {
        if (typeof value === 'undefined') return data[name[0]]
        if ((name[0] in data) && !override) return
        data[name[0]] = (
            (typeof value == 'string') 
            && !isNaN(value) 
            && !isNaN(parseFloat(value)))
            ? +value : value
    }
}

export { FormWrapper as default, Field, Control, Row, Cell }