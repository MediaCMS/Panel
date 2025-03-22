import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Table, { Row, Cell } from '../components/Table.js'
import Editor from './User/Editor.js'
import Filter from './User/Filter.js'

const User = () => {

    const [id, setID] = useState()
    const [users, setUsers] = useState([])
    const [params, setParams] = useState({
        status: true, _skip: 0, _limit: 50,
        _sort: { field: 'title', order: 1 }
    })
    const [editor, setEditor] = useState(false)
    const [filter, setFilter] = useState(false)
    const context = useOutletContext()

    const load = async params => {
        setParams(params)
        return await context.api.panel.get('/users', { params })
     }

    const handleLoad = async () => 
        setUsers(await load({ ...params, _skip: 0 })
    )

    const handleAppend = async skip => {
        const usersNew = await load({ ...params, _skip: skip })
        setUsers([...users, ...usersNew])
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
        <Table columns={['Назва', 'Пошта', 'Роль']} className=""
            params={params} onAppend={handleAppend}>
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