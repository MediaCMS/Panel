import React from 'react'
import Text from './Text.js'

export default function (props) {

    return <Text name="description" rows="3" label="Опис"
        placeholder="Опис ..." maxLength="256" {...props} />
}