import React from 'react'
import Moment from 'moment'
import Field from './Field.js'

export default function (props) {

    return <Field type="date" name="date" label="Дата" 
        {...props} value={Moment().format('YYYY-MM-DD')} />
}