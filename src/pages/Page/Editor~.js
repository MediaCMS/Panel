import React, { useState, useEffect, useReducer } from 'react'
import { useOutletContext } from 'react-router-dom'
import Longread, { Reducer, actions} from '../../blocks/Editor/index.js'
import Form, { Field, Row, Cell } from '../../components/Form.js'

export default props => {

    const [page, setPage] = useState({})
    const [state, dispatch] = useReducer(Reducer, [{
        id: 0, type: 'main', title: 'Найменування'
    }])
    const context = useOutletContext()

    const handleSubmit = async () => {
        const pageNew = {
            ...page, title: state[0].title
        }
        if (state[0]?.image) {
            pageNew.image = state[0].image
        } else {
            delete pageNew.image
        }
        if (state.length > 1) {
            pageNew.blocks = state.slice(1)
        } else {
            delete pageNew.blocks
        }
        console.log(pageNew)
        setPage(pageNew)
        props?.id
            ? await context.api.panel.put('/pages/' + props.id, page)
            : await context.api.panel.post('/pages', page)
        props.onChange()
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/pages/' + props.id)
        props.onChange()
    }

    useEffect(async () => {
        props?.id && setPage(
            await context.api.panel.get('/pages/' + props.id)
        )
    }, [])

    return (
        <Form data={page} show={props.show} onHide={props.onHide}
            onChange={setPage} onSubmit={handleSubmit} onDelete={handleDelete}
            title="Редагування сторінки" fullscreen={true}>
            <Row>
                <Cell sm="3">
                    <Field.Title placeholder="Про проєкт" required />
                </Cell>
                <Cell sm="3">
                    <Field.Slug source={page.title} placeholder="про-проєкт" required />
                </Cell>
                <Cell sm="3">
                    <Field.Status label="Видимість сторінки" />
                </Cell>
            </Row>
            <Row>
                <Field.Description placeholder="Опис сторінки" />
            </Row>
            <Row><Field.Body placeholder="Текст сторінки" /></Row>
            <Row><Field.Image /></Row>
        </Form>
     )
}