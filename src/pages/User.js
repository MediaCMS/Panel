import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Table, { Row, Cell } from '../components/Table.js'
import Editor from './User/Editor.js'
import Filter from './User/Filter.js'

const User = () => {

    const [id, setID] = useState()
    const [users, setUsers] = useState([])
    const [params, setParams] = useState({
        status: true, _sort: { field: 'title', order: 1 }
    })
    const [editor, setEditor] = useState(false)
    const [filter, setFilter] = useState(false)
    const context = useOutletContext()

    const handleLoad = async () => {
        setUsers(
            await context.api.panel.get(
                '/users', { params }
            )
        )
    }

    useEffect(() => {
        context.init({
            title: 'Користувачі',
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
        <Table columns={['Назва', 'Пошта', 'Роль']}>
            {users.map(user => (
                <Row status={user.status} key={user._id}
                    onClick={() => {setID(user._id);setEditor(true)}}>
                    <Cell className="text-left">{user.title}</Cell>
                    <Cell className="text-left">{user.email}</Cell>
                    <Cell className="text-left">{user.role}</Cell>
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

export default User