import PropTypes from 'prop-types'
import React from 'react'
import Field from './Field.js'

const Text = props => {

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

Text.propTypes = {
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
    rows: PropTypes.number
}

export default Text