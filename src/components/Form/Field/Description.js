import React from 'react'
import Text from './Text.js'

const Description = props => {

    return <Text name="description" rows="3" label="Опис"
        placeholder="Опис ..." maxLength="256" {...props} />
}

export default Description