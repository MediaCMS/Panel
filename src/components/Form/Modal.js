import React from 'react'
import { Form, Modal } from 'react-bootstrap'
import ButtonsStandard from './Buttons/Standard.js'
import ButtonsFilter from './Buttons/Filter.js'

export default props => {

    const title = props.title ?? 'Фільтрування даних'

    return (
        <Modal show={props.show} onHide={props.onHide}
            size={props.size} animation={true}>
            <Form onSubmit={props.onSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.children}</Modal.Body>
                <Modal.Footer>
                    {(props?.as && (props.as === 'modal') && !props?.title)
                        ? <ButtonsFilter onClick={handleHide} />
                        : <ButtonsStandard {...props}  />
                    }
                </Modal.Footer>
            </Form>
        </Modal>
    )
}