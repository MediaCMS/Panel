import React, { useState, useEffect, useContext, useRef } from 'react'
import Context from '../../../contexts/Form.js'
import Show from '../../../components/Form/Field/Image/Show.js'
import Choose from '../../../components/Form/Field/Image/Choose.js'
import config from '../../../config.js'

const Main = () => {

    const [background, setBackground] = useState([])
    const ref = { main: useRef(), title: useRef() }
    const data = useContext(Context)

    useEffect(() => ref.title.current.focus(), [ref.title.current])

    useEffect(() => {
        const background = !data.get('image.url') ? '' :
            `url(${config.images.url}/${data.get('image.url')}` +
            `?width=${ref.main.current.offsetWidth}` +
            `&height=${ref.main.current.offsetHeight})`
        setBackground(background)
    }, [data.get('image.url'), ref.main.current])

    return <div className="block block-type-main">
            <div className={'main' + (data.get('image') ? ' image' : '')}
            style={{ backgroundImage: background }} ref={ref.main}>
            <div className="layout">
                <div className="body">
                    <h1 contentEditable="true" suppressContentEditableWarning="true"
                        onBlur={
                            event => data.set('title', event.target.textContent)
                        }
                        ref={ref.title} className="editable" >
                        {data.get('title')}
                    </h1>
                </div>
            </div>
            <div className="bottom">
                <div className="buttons flex-grow-0">
                    {data.get('image.url')
                        ? <Show as="menu" name={'image.url'} className="menu"
                            onChange={() => data.set('image.url')}
                            label="Видалити зображення" />
                        : <Choose library={true}
                            onChange={value => data.set('image.url', value)} />
                    }
                </div>
            </div>
        </div>
    </div>
}

export default Main