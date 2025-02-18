import PropTypes from 'prop-types'
import React, { useContext } from 'react'
import Context from '../../../contexts/Form.js'
import Show from './Image/Show.js'
import Choose from './Image/Choose.js'
import Field from './Field.js'

const Image = ({ name, label, required }) => {

    const data = useContext(Context)
    const nameNew = name ?? 'image'
    const value = data.get(nameNew)

    const handleChange = value => {
        data.set(nameNew, value)
    }

    return <Field label={label ?? 'Зображення'}>
        {value
            ? <Show name={value} onChange={name ? null : handleChange} />
            : <Choose onChange={handleChange} library={!name}
                required={required} />
        }
    </Field>
}

Image.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    required: PropTypes.bool
}

export default Image