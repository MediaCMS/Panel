import React, { useContext } from 'react'
import Context from '../../../contexts/Form.js'
import Show from './Image/Show.js'
import Choose from './Image/Choose.js'
import Field from './Field.js'

export default function (props) {

    const data = useContext(Context)
    const name = props?.name ?? 'image'
    const value = data.get(name)

    const handleChange = value => {
        data.set(name, value)
    }

    return <Field label={props?.label ?? 'Зображення'}>
        {value
            ? <Show name={value} onChange={props?.name ? null : handleChange} />
            : <Choose onChange={handleChange} library={!props?.name}
                required={props.required} />
        }
    </Field>
}