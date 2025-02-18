import React from 'react'
import Text from './Text.js'

const Body = props => {

    return <Text name="body" rows="10" label="Текст"
         placeholder="Текст ..." maxLength="32768" {...props} />
}

export default Body