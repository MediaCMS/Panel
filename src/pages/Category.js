import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Table, { Row, Cell } from '../components/Table.js'
import Editor from './Category/Editor.js'

const Category = () => {

    const [id, setID] = useState()
    const [categories, setCategories] = useState([])
    const [editor, setEditor] = useState(false)
    const context = useOutletContext()

    const handleLoad = async () => {
        setCategories(
            await context.api.panel.get('/categories')
        )
    }

    useEffect(() => {
        context.init({
            title: 'Категорії',
            submenu: [{
                title: 'Створити',
                onClick: () => setEditor(true)
            }],
            width: 'small'
        })
        handleLoad()
    }, [])

    return <>
        <Table columns={['Назва', 'Посилання', 'Сортування']}>
            {categories.map(category => (
                <Row status={category.status} key={category._id}
                    onClick={() => {setID(category._id);setEditor(true)}}>
                    <Cell className="text-left">{category.title}</Cell>
                    <Cell className="text-left">{category.slug}</Cell>
                    <Cell className="text-center">{category.order}</Cell>
                </Row>
            ))}
        </Table>
        {editor && <Editor id={id} onChange={handleLoad}
            show={editor} onHide={() => {setID();setEditor(false)}} />}
    </>
}

export default Category