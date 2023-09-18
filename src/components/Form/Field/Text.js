import React from 'react'
import Field from './Field.js'

export default function (props) {

    const minLength = props.minLength ?? 1;
    const maxLength = props.maxLength ?? 65_536;
    const title = `Від ${minLength} до ${maxLength} символів`;

    return (
        <Field type={props?.rows ? 'textarea' : 'input'} name="text"
            pattern=".*" label="Текст" rows={props.rows}
            placeholder="Текст ..." title={title}
            minLength={length.min} maxLength={length.max}
            {...props} />
    )
}