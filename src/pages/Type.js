import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Table, { Row, Cell } from '../components/Table.js'
import Editor from './Type/Editor.js'

export default () => {

    const [id, setID] = useState()
    const [types, setTypes] = useState([])
    const [editor, setEditor] = useState(false)
    const context = useOutletContext()

    const handleLoad = async () => {
        setTypes(
            await context.api.panel.get('/types')
        )
    }

    useEffect(() => {
        context.init({
            title: 'Типи',
            submenu: [{
                title: 'Створити',
                onClick: () => setEditor(true)
            }],
            width: 'small'
        })
        handleLoad()
    }, [])

    return <>
        <Table columns={['Назва', 'Опис']}>
            {types.map(type => (
                <Row status={type.status} key={type._id}
                    onClick={() => {setID(type._id);setEditor(true)}}>
                    <Cell className="text-left">{type.title}</Cell>
                    <Cell className="text-left">{type.description}</Cell>
                </Row>
            ))}
        </Table>
        {editor && <Editor id={id} onChange={handleLoad}
            show={editor} onHide={() => {setID();setEditor(false)}} />}
    </>
}