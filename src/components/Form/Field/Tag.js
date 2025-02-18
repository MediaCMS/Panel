import React from 'react'
import Text from './Text.js'

const Tag = props => {

    return <Text name="tag" title="Фільтр за міткою"
        label="Мітка" placeholder="погода"
        maxLength="32" {...props} />
}

export default Tag