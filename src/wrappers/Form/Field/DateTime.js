import React, { useState, useEffect } from 'react'
import Moment from 'moment'
import Field from './Field.js'

export default function (props) {

    return <Field type="datetime-local" name="time" label="Час"
        value={Moment().format('YYYY-MM-DD HH:mm:ss')} {...props} />
}