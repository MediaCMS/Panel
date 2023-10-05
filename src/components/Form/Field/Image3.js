import React, { useContext } from 'react'
import { useOutletContext } from 'react-router-dom'
import Context from '../../../contexts/Form.js'
import config from '../../../config.js'

export default function (props) {

    const context = useOutletContext()
    const data = useContext(Context)
    const name = props.name ?? 'image2'
    const value = data.get(name)

    const handlUpload = async event => {
        const formData = new FormData()
        formData.append('image', event.target.files[0])
        const response = await context.api.image.post(
            config.images.api,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' }}
        )
        console.log(response)
        data.set(props.name, response.data.path)
    }

    const handleDelete = async () => {
        try {
            await context.api.image.delete(
                config.images.api + '///' + value.substr(7, 32)
            )
            data.set(props.name, null)
        } catch (error) {
            console.error('error123', error)
        }
    }

    return value
        ? <img src={config.images.url + value} onClick={handleDelete}
            title='Видалити зображення' className='w-100 my-3' />
        : <input type='file' name={props.name} title={props.title}
            onChange={handlUpload} className={props.className} />
}