import React from 'react'
import { useOutletContext } from 'react-router-dom'
import config from '../../../../config.js'
import '../../../../assets/styles/components/fields/image.css'

export default function (props) {

    const context = useOutletContext()

    const handleDelete = async () => {
        props.onChange(null)
        if (!await context.api.panel.get('/images/check/' + props.name)) {
            //context.api.image.delete('/' + props.name)
            console.log('image.delete', props.name)
        }
    }

    return (
        <div className="image">
            <div className="delete">
                <img src={config.images.url + '/' + props.name}
                    onClick={handleDelete} title="Видалити зображення"
                    className="mw-100" />
            </div>
        </div>
    )
}