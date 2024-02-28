import React, { useState, useEffect, useMemo, useReducer } from 'react'
import { useOutletContext } from 'react-router-dom'
import Editor, { Reducer, actions} from '../../components/Editor.js'
import Form, { Field, Table, Row, Cell } from '../../components/Form.js'
import config from '../../config.js'

export default props => {

    const [page, setPage] = useState({})
    const [state, dispatch] = useReducer(Reducer, [{
        id: 0, type: 'main', title: 'Найменування'
    }])
    const [slug, setSlug] = useState()
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
        console.log(pageNew, page.title, page.slug)
        setPage(pageNew)
        if (props?.id) {
            await context.api.panel.put('/pages/' + props.id, pageNew)
            //context.api.main.delete('/cache/' + slug)
        } else {
            await context.api.panel.post('/pages', pageNew)
        }
        props.onChange()
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/pages/' + props.id)
        props.onChange()
    }

    useEffect(async () => {
        if (!props?.id) return
        const pageNew = await context.api.panel.get('/pages/' + props.id)
        const blocks = [{ id: 0, type: 'main', title: pageNew?.title }]
        if (pageNew?.image) {
            blocks[0].image = pageNew.image
        }
        if (pageNew?.blocks) {
            blocks.push(...pageNew.blocks)
        }
        dispatch(actions.load(blocks))
        console.log(pageNew)
        setSlug(pageNew.slug)
        setPage(pageNew)
    }, [])

    const url = useMemo(() => (
        config.main.url + '/' + page.slug
    ), [page.slug])

    return (
        <Form data={page} show={props.show} onHide={props.onHide}
            onChange={setPage} onSubmit={handleSubmit} onDelete={handleDelete}
            title="Редагування сторінки" fullscreen={true}>
            <Editor blocks={{ state, dispatch, actions }} />
            <Table size="medium">
                <Row>
                    <Field.Description placeholder="Опис сторінки" />
                </Row>
                <Row>
                    <Cell sm="8">
                        <Field.Slug source={state[0].title} placeholder="про-проєкт" required />
                    </Cell>
                    <Cell sm="4">
                        <Field.Status label="Видимість сторінки" />
                    </Cell>
                </Row>
                <Row>
                    <Field label="Адреса сторінки">
                        <a href={url + '?preview'} className='d-block'>{url}</a>
                    </Field>
                </Row>
            </Table>
        </Form>
     )
}