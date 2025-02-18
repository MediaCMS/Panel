import React from 'react'
import Text from './Text.js'

const Title = props => {

    return <Text name="title" label="Назва"
        placeholder="Назва ..." maxLength="128" {...props} />
}

export default Title