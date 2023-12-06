import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Table, { Row, Cell } from '../components/Table.js'
import Editor from './Role/Editor.js'

export default () => {

    const [id, setID] = useState()
    const [roles, setRoles] = useState([])
    const [editor, setEditor] = useState(false)
    const context = useOutletContext()

    const handleLoad = async () => {
        setRoles(
            await context.api.panel.get('/roles')
        )
    }

    useEffect(() => {
        context.init({
            title: 'Ролі',
            submenu: [{
                title: 'Створити',
                onClick: () => setEditor(true)
            }]
        })
        handleLoad()
    }, [])

    return <>
        <Table columns={['Назва', 'Опис', 'Рівень']}>
            {roles.map(role => (
                <Row status={role.status} key={role._id}
                    onClick={() => {setID(role._id);setEditor(true)}}>
                    <Cell className="text-left">{role.title}</Cell>
                    <Cell className="text-left">{role.description}</Cell>
                    <Cell className="text-center">{role.level}</Cell>
                </Row>
            ))}
        </Table>
        {editor && <Editor id={id} onChange={handleLoad}
            show={editor} onHide={() => {setID();setEditor(false)}}
            title="Редагування ролі" />}
    </>
}