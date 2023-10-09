import React from 'react'
import Text from './Text.js'

export default function (props) {

    return <Text name="title" label="Назва"
        placeholder="Назва ..." maxLength="128" {...props} />
}