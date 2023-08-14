import React, { useState, useEffect } from 'react'
import Moment from 'moment'
import Field from './Field.js'

export default function (props) {
    
    const [time, setTime] = useState(Moment())

    useEffect(async () => {
        if (!props?.value) return
        const timeNew = Moment(props?.value)
        setTime(timeNew)
    }, [props.value])

    return <Field type="date" name="date" label="Дата" 
        {...props} value={time.format('YYYY-MM-DD')} />
}