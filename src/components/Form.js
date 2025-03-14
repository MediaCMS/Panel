import PropTypes from 'prop-types'
import React from 'react'
import { Form, Modal } from 'react-bootstrap'
import Context from '../contexts/Form.js'
import Field from './Form/Field.js'
import Control from './Form/Control.js'
import Table from './Form/Table.js'
import Row from './Form/Row.js'
import Cell from './Form/Cell.js'
import Buttons from './Form/Buttons.js'
import '../assets/styles/components/form.css'

const recurse = (data, name, value, override = true) => {
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

const FormWrapper = props => {

    const title = props.title ??
        ((props?.as && (props?.as === 'filter'))
            ? 'Фільтрування даних'
            : 'Редагування даних'
        )

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

    const handleSubmit = async event => {
        event.preventDefault()
        event.stopPropagation()
        const form = new FormData(event.target)
        const data = Object.fromEntries(form)
        const result = await props.onSubmit(data) ?? true
        result && props.onHide()
    }

    return (
        <Context.Provider value={actions}>
            <Modal className="p-0" show={props.show} onHide={props.onHide}
                 animation={true} size={props.size ??
                    (props?.as && (props.as === 'filter') ? 'md' : 'lg')
                } fullscreen={props.fullscreen ?? false}
                autoFocus={true} enforceFocus={false}
                style={{ paddingLeft: '1px' }}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{props.children}</Modal.Body>
                    <Modal.Footer className="justify-content-center">
                        <Buttons {...props} />
                    </Modal.Footer>
                </Form>
            </Modal>
        </Context.Provider>
    )
}

FormWrapper.propTypes = {
    title: PropTypes.string,
    as: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    size: PropTypes.string,
    fullscreen: PropTypes.bool,
    children: PropTypes.node
}

export { FormWrapper as default, Field, Control, Table, Row, Cell }