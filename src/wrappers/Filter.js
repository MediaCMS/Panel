import React from 'react'
import { Form, Modal, Button } from 'react-bootstrap'
import Context from './Form/Context.js'
import Field from './Form/Field.js'
import Control from './Form/Control.js'
import Row from './Form/Row.js'
import Cell from './Form/Cell.js'

function Filter(props) {

    const handleChange = (name, value) => {
        props.onChange(dataOld => ({ ...dataOld, [name]: value }))
    }

    const handleSubmit = event => {
        event.preventDefault()
        props.onSubmit(
            Object.fromEntries(
                new FormData(event.target)
            )
        )
    }

    return (
        <Context.Provider value={handleChange}>
            {(props?.type && (props.type === 'filter')) && (
                <Filter {...props} onSubmit={handleSubmit} />
            )}
            <Modal show={props.show} onHide={props.onHide} animation={true}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title id="filterLabel">Фільтрування даних</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{props.children}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={props.onHide}>Закрити</Button>
                        <Button type="submit" onClick={props.onHide}>Фільтрувати</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Context.Provider>
    )
}


export { Filter as default, Field, Control, Row, Cell }