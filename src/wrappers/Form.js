import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form, Modal, Button } from 'react-bootstrap'
import Context from './Form/Context.js'
import Field from './Form/Field.js'
import Control from './Form/Control.js'
import Row from './Form/Row.js'
import Cell from './Form/Cell.js'
import '../assets/styles/components/form.css'

const FormWrapper = props => {

    const outletContext = useOutletContext()

    const actions = { 
        set: (name, value, override) => {
            props.onChange(dataOld => {
                const dataNew = { ...dataOld }
                handleChange(dataNew, name.split('.'), value, override)
                return dataNew
            })
        },
        get: name => {
            return handleChange(props.data, name.split('.'))
        }
    }

    const handleChange = (data, name, value, override = true) => {
        if (name.length > 1) {
            if (typeof data[name[0]] === 'undefined') {
                data[name[0]] = {}
            }
            return handleChange(data[name[0]], name.slice(1), value, override)
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

    const handleSubmit = event => {
        event.preventDefault()
        props.onSubmit(
            Object.fromEntries(
                new FormData(event.target)
            )
        )
        if (props?.show) handleHide()
    }

    const handleDelete = async () => {
        if (await outletContext.setConfirm('Ви впевненні?')) {
            props.onDelete()
        }
    }

    const handleHide = () => {
        props.onChangeShow(false)
    }

    return (
        <Context.Provider value={actions}>
            {props?.show
                ?   <Modal show={props.show} onHide={handleHide} animation={true}>
                        <Form onSubmit={handleSubmit}>
                            <Modal.Header closeButton>
                                <Modal.Title id="filterLabel">Фільтрування даних</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>{props.children}</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleHide}>Закрити</Button>
                                <Button type="submit">Фільтрувати</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                :   <Form onSubmit={handleSubmit}>
                        <div className="mx-auto" style={{ maxWidth: '840px' }}>
                            <div>{props.children}</div>
                            <div className="text-center my-5">
                                {props?.data._id && props?.onDelete && (
                                    <Button onClick={handleDelete} variant="danger" className="me-2">
                                        Видалити
                                    </Button>
                                )}
                                <Button type="submit">Зберегти</Button>
                            </div>
                        </div>
                    </Form>
            }
        </Context.Provider>
    )
}

export { FormWrapper as default, Field, Control, Row, Cell }