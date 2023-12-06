import React, { useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'

export default () => {

    const context = useOutletContext()
    const navigate = useNavigate()

    useEffect(async () => {
        await context.api.panel.delete('/users/logout')
        context.setUser(null)
        localStorage.removeItem('user')
        navigate('/access/login')
    }, [])

    return <></>
}