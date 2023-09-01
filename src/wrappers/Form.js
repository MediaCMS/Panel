import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Form, Modal, Button } from 'react-bootstrap'
import Context from './Form/Context.js'
import Field from './Form/Field.js'
import Control from './Form/Control.js'
import Row from './Form/Row.js'
import Cell from './Form/Cell.js'

function FormWrapper(props) {

    const outletContext = useOutletContext()

    const handleChange = (name, value) => {
        props.onChange(dataOld => {
            const dataNew = { ...dataOld }
            change(dataNew, name.split('.'), value)
            return dataNew
            function change(o,k,v) {
                if (k.length>1) {
                    if (typeof o[k[0]] === 'undefined') {
                        o[k[0]] = {}
                    }
                    return change(o[k[0]],k.slice(1), v)
                } else {
                    return o[k[0]] = (
                        (typeof v == 'string') 
                        && !isNaN(v) 
                        && !isNaN(parseFloat(v)))
                        ? +v : v
                }
            }
        })
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
        <Context.Provider value={{ data: props.data, onChange: handleChange }}>
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
                        <div className="mx-auto" style={{ maxWidth: '720px' }}>
                            <div>{props.children}</div>
                            <div className="text-center my-5">
                                {props?.id && props?.onDelete && (
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