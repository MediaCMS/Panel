import Moment from 'moment'
import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Table, { Row, Cell } from '../components/Table.js'
import Filter from './Comment/Filter.js'
import Editor from './Comment/Editor.js'

const Comment = () => {

    const [id, setID] = useState()
    const [comments, setComments] = useState([])
    const [params, setParams] = useState({
        date: {
            start: Moment().add(-5, 'years').format('YYYY-MM-DD'),
            end: Moment().format('YYYY-MM-DD'),
        },
        status: true, 
        _sort: { field: 'date', order: -1 }, _skip: 0, _limit: 50
    })
    const [editor, setEditor] = useState(false)
    const [filter, setFilter] = useState(false)
    const context = useOutletContext()

    const load = async params => {
        setParams(params)
        return await context.api.panel.get('/comments', { params })
    }

    const handleLoad = async () => 
        setComments(
            await load({ ...params, _skip: 0 })
        )

    const handleAppend = async skip => {
        const commentsNew = await load({ ...params, _skip: skip })
        setComments([...comments, ...commentsNew])
    }

    useEffect(() => {
        context.init({
            title: 'Коментарі',
            submenu: [{
                title: 'Фільтр', 
                onClick: () => setFilter(true)
            }]
        })
        handleLoad()
    }, [])

    return <>
        <Table columns={['Дата', 'Повідомлення', 'Користувач']}
            params={params} onAppend={handleAppend}>
            {comments.map(comment => (
                <Row status={comment.status} key={comment._id}
                    onClick={() => {setID(comment._id);setEditor(true)}}>
                    <Cell className="text-left text-nowrap">
                        {
                            Moment(comment.date).format('YYYY-MM-DD')
                            + '<br />' +
                            Moment(comment.date).format('HH:mm')
                        }
                    </Cell>
                    <Cell className="text-left overflow-hidden">{comment.text}</Cell>
                    <Cell className="text-left">{comment.user}</Cell>
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

export default Comment