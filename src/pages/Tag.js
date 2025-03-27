import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Table, { Row, Cell } from '../components/Table.js'
import Filter from './Tag/Filter.js'
import Editor from './Tag/Editor.js'

const Tag = () => {

    const [id, setID] = useState()
    const [tags, setTags] = useState([])
    const [params, setParams] = useState({
        status: true, _skip: 0, _limit: 50
    })
    const [editor, setEditor] = useState(false)
    const [filter, setFilter] = useState(false)
    const context = useOutletContext()

    const load = async params => {
        setParams(params)
        return await context.api.panel.get('/tags', { params })
     }

    const handleLoad = async () => 
        setTags(
            await load({ ...params, _skip: 0 })
        )

    const handleAppend = async skip => {
        const tagsNew = await load({ ...params, _skip: skip })
        setTags([...tags, ...tagsNew])
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
        <Table columns={['Заголовок', 'Опис']} className="mw-md"
            params={params} onAppend={handleAppend}>
            {tags.map(tag => (
                <Row title={tag.description} status={tag.status} key={tag._id}
                    onClick={() => {setID(tag._id);setEditor(true)}}>
                    <Cell className="text-left">{tag.title}</Cell>
                    <Cell className="text-left">{tag.slug}</Cell>
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

export default Tag