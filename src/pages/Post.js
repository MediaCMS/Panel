import Moment from 'moment'
import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Table, { Row, Cell } from '../components/Table.js'
import Editor from './Post/Editor.js'
import Filter from './Post/Filter.js'

const Post = () => {

    const context = useOutletContext()
    const [id, setID] = useState()
    const [params, setParams] = useState({
        date: {
            start: Moment().add(-5, 'years').format('YYYY-MM-DD'),
            end: Moment().format('YYYY-MM-DD'),
        },
        user: (context.user.role.level === 4) ? context.user.title : '',
        status: '', _sort: { field: 'date', order: -1 }, _skip: 0, _limit: 50
    })
    const [posts, setPosts] = useState([])
    const [editor, setEditor] = useState(false)
    const [filter, setFilter] = useState(false)

    const load = async params => {
        setParams(params)
        return await context.api.panel.get('/posts', { params })
     }

    const handleLoad = async () => 
        setPosts(
            await load({ ...params, _skip: 0 })
        )

    const handleAppend = async skip => {
        const postsNew = await load({ ...params, _skip: skip })
        setPosts([...posts, ...postsNew])
    }

    useEffect(() => {
        context.init({
            title: 'Публікації',
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
        <Table columns={['Дата', 'Назва', 'Автор']} className=""
            params={params} onAppend={handleAppend}>
            {posts.map(post => (
                <Row status={post.status} key={post._id}
                    onClick={() => {setID(post._id);setEditor(true)}}>
                    <Cell className="text-nowrap">{
                        Moment(post.date).format('YYYY-MM-DD HH:mm')
                    }</Cell>
                    <Cell className="text-start overflow-hidden">{post.title}</Cell>
                    <Cell className="text-start text-nowrap">{post.user}</Cell>
                </Row>
            ))}
        </Table>
        {editor && <Editor id={id} onChange={handleLoad}
            show={editor} onHide={() => {setID();setEditor(false)}} />}
        {filter && <Filter data={params} user={context.user}
            onChange={setParams} onSubmit={handleLoad}
            show={filter} onHide={() => setFilter(false)} />}
    </>
}

export default Post