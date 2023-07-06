import React, { useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'

export default function () {

    const context = useOutletContext()
    const navigate = useNavigate()

    useEffect(async () => {
        await context.api.panel.delete('/користувачі/вихід')
        context.setUser(null)
        localStorage.removeItem('user')
        navigate('/доступ/вхід')
    }, [])

    return <></>
}