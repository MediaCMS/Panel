import React from 'react'
import { Form, Modal } from 'react-bootstrap'
import ButtonsStandard from './Buttons/Standard.js'
import ButtonsFilter from './Buttons/Filter.js'

export default props => {

    const title = props.title ?? 'Фільтрування даних'

    const handleHide = () => {
        props.onChangeShow(false)
    }

    return (
        <Modal show={props.show} onHide={handleHide}
            size={props.size} animation={true}>
            <Form onSubmit={props.onSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title id="filterLabel">{title}</Modal.Title>
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