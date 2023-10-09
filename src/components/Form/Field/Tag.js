import React from 'react'
import Text from './Text.js'

export default function (props) {

    return <Text name="tag" title="Фільтр за міткою"
        label="Мітка" placeholder="погода"
        maxLength="32" {...props} />
}