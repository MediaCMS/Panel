import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Table, { Row, Cell } from '../components/Table.js'
import Editor from './Page/Editor.js'

const Page = () => {

    const [id, setID] = useState()
    const [pages, setPages] = useState([])
    const [editor, setEditor] = useState(false)
    const context = useOutletContext()

    const handleLoad = async () =>
        setPages(
            await context.api.panel.get('/pages')
        )


    useEffect(() => {
        context.init({
            title: 'Сторінки',
            submenu: [{
                title: 'Створити',
                onClick: () => setEditor(true)
            }]
        })
        handleLoad()
    }, [])

    return <>
        <Table columns={['Назва', 'Посилання', 'Опис']}>
            {pages.map(page => (
                <Row status={page.status} key={page._id}
                    onClick={() => {setID(page._id);setEditor(true)}}>
                    <Cell className="text-left text-nowrap">{page.title}</Cell>
                    <Cell className="text-left text-nowrap">{page.slug}</Cell>
                    <Cell className="text-left overflow-hidden">{page.description}</Cell>
                </Row>
            ))}
        </Table>
        {editor && <Editor id={id} onChange={handleLoad}
            show={editor} onHide={() => {setID();setEditor(false)}} />}
    </>
}

export default Page