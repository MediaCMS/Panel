import React, { useEffect } from 'react'
//import { useOutletContext } from 'react-router-dom'
import Show from '../../Form/Field/Image/Show.js'
import Choose from '../../Form/Field/Image/Choose.js'
import config from '../../../config.js'

export default props => {

    //const context = useOutletContext()

    const handleImageUpload = image => {
        console.log(image)
        props.onChange('image', image)
    }
    /*
    const handleImageRemove = async () => {
        await context.api.image.delete(null, {
            data: { image: props.image }
        })
        props.onChange('image')
    }
    */
    useEffect(() => {
        props.menu.dispatch(
            props.menu.actions.remove(['move', 'remove'])
        )
    }, [])

    return (
        <div className={'main' + (props?.image ? ' image' : '')}
            style={{ backgroundImage: props?.image
                ? `url(${config.images.url + '/' + props.image})` : ''}}>
            <h1 contentEditable="true" suppressContentEditableWarning="true"
                onBlur={
                    event => props.onChange('title', event.target.textContent)
                }
                onPaste={props.onPaste}>
                {props.title}
            </h1>
            <div className="text-center position-absolute mx-auto">
                {props?.image
                    ? <Show as="menu" name={props.image} className="imageMenu"
                        onChange={() => props.onChange('image')} />
                    : <Choose onChange={handleImageUpload} library={true} />
                }
            </div>
        </div>
    )
}