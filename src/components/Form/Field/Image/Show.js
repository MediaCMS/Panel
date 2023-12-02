import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import Editor from '../../../../blocks/Image.js'
import config from '../../../../config.js'
import '../../../../assets/styles/components/fields/image.css'

export default function (props) {

    const [editor, setEditor] = useState(false)

    return <>
        <div className="image">
            <img src={config.images.url + '/' + props.name} />
            {props.onChange &&
                <div className="menu">
                    <Button variant="danger" onClick={() => props.onChange(null)}
                        title="Видалити зображення з поточного документа">
                        Видалити
                    </Button>
                    <Button variant="success" onClick={() => setEditor(true)}
                        title="Зберегти зображення в бібліотеці">
                        Зберегти
                    </Button>
                </div>
            }
        </div>
        {editor && <Editor name={props.name} title="Редагування зображення"
            show={editor} onHide={() => setEditor(false)} />}
    </>
}