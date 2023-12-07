import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Table, { Row, Cell } from '../components/Table.js'
import Filter from './Tag/Filter.js'
import Editor from './Tag/Editor.js'

export default () => {

    const [id, setID] = useState()
    const [tags, setTags] = useState([])
    const [params, setParams] = useState({ status: true })
    const [editor, setEditor] = useState(false)
    const [filter, setFilter] = useState(false)
    const context = useOutletContext()

    const handleLoad = async () => {
        setTags(
            await context.api.panel.get('/tags', { params })
        )
    }

    useEffect(() => {
        context.init({
            title: 'Мітки',
            submenu: [{
                title: 'Створити',
                onClick: () => setEditor(true)
            }, {
                title: 'Фільтр',
                onClick: () => setFilter(true)
            }]
        })
        handleLoad()
    }, [])

    return <>
        <Table columns={['Заголовок', 'Опис']}>
            {tags.map(tag => (
                <Row status={tag.status} key={tag._id}
                    onClick={() => {setID(tag._id);setEditor(true)}}>
                    <Cell className="text-left col-2">{tag.title}</Cell>
                    <Cell className="text-left">{tag.description}</Cell>
                </Row>
            ))}
        </Table>
        {editor && <Editor id={id} onChange={handleLoad}
            show={editor} onHide={() => {setID();setEditor(false)}} />}
        {filter && <Filter data={params}
            onChange={setParams} onSubmit={handleLoad}
            show={filter} onHide={() => setFilter(false)} />}
    </>
}