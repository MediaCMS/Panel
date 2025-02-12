import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo, useReducer } from 'react'
import { useOutletContext } from 'react-router-dom'
import Editor, { Reducer, actions} from '../../components/Editor.js'
import Form, { Field, Table, Row, Cell } from '../../components/Form.js'
import config from '../../config.js'

const PageEditor = ({ id, show, onChange, onHide }) => {

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
        setPage(pageNew)
        if (id) {
            await context.api.panel.put('/pages/' + id, pageNew)
            context.api.main.delete('/kesh/storinky/' + slug)
        } else {
            await context.api.panel.post('/pages', pageNew)
        }
        onChange()
    }

    const handleDelete = async () => {
        await context.api.panel.delete('/pages/' + id)
        onChange()
    }

    useEffect(async () => {
        if (!id) return
        const pageNew = await context.api.panel.get('/pages/' + id)
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
        config.main.url + '/storinky/' + page.slug
    ), [page.slug])

    return (
        <Form data={page} show={show} onHide={onHide}
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
                        <a href={url + '?preview=true'} className='d-block'>{url}</a>
                    </Field>
                </Row>
            </Table>
        </Form>
    )
}

PageEditor.propTypes = {
    id: PropTypes.string,
    show: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired
}

export default PageEditor