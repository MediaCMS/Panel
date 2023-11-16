import React from 'react'
import config from '../../../../config.js'
import '../../../../assets/styles/components/fields/image.css'

export default function (props) {

    const handleDelete = () => {
        props.onChange(null)
    }

    return (
        <div className="image">
            <div className="delete">
                <img src={config.images.url + '/' + props.slug}
                    onClick={handleDelete} title="Видалити зображення"
                    className="mw-100" />
            </div>
        </div>
    )
}