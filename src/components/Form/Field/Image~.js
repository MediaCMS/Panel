import React from 'react'
import axios from 'axios'
import config from '../../../config.js'

export function Image(props) {

    const handlUpload = async event => {
        const formData = new FormData()
        formData.append('image', event.target.files[0])
        const response = await axios.post(config.images.api, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-api-key': config.images.key
            }
        })
        if (response.status !== 200) {
            console.error(response)
            return alert('Під час збереження зображення виникла помилка')
        }
        props.onChange(props.name, response.data)
    }

    const handleDelete = async () => {
        const response = await axios.delete(
            config.images.api + props.value.substr(7, 32),
            { headers: { 'x-api-key': config.images.key } }
        )
        if (response.status !== 200) {
            console.error(response)
            return alert('Під час видалення зображення виникла помилка')
        }
        props.onChange(props.name, null)
    }

    return (<>
        {props?.value ? (
            <img src={config.images.url + props.value} onClick={handleDelete}
                title='Видалити зображення' className='w-100 my-3' />
        ) : (
            <input type='file' name={props.name} title={props.title}
                onChange={handlUpload} className={props.className} />
        )}
    </>)
        
}