import React from 'react'
import Text from './Text.js'

export default function (props) {

    return <Text name="body" rows="10" label="Текст"
         placeholder="Текст ..." maxLength="32768" {...props} />
}