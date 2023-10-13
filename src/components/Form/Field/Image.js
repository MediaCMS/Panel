import React from 'react'
import Field from './Field.js'
import Upload from './Image/Upload.js'
import Choose from './Image/Choose.js'
import '../../../assets/styles/components/fields/image.css'

export default function (props) {

    return (
        <Field label={props?.label ?? 'Зображення'}>
            {props?.as && (props.as === 'upload')
                ? <Upload {...props} />
                : <Choose {...props} />}
        </Field>
    )
}