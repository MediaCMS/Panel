import React, { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

const Main = () => {

    const context = useOutletContext()

    useEffect(() => {
        context.init({ title: 'Головна' })
    }, [])

    return <p className="lead">Голова сторінка сайту</p>
}

export default Main