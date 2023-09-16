import React, { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

export default () => {

    const context = useOutletContext()

    useEffect(async () => {
        context.init({ title: 'Головна' })
    }, [])

    return <p className="lead">Голова сторінка сайту</p>
}