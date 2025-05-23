import React, { useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'

const Logout = () => {

    const context = useOutletContext()
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            await context.api.panel.delete('/access/logout')
            context.setUser(null)
            localStorage.removeItem('user')
            navigate('/access/login')
        })()
    }, [])

    return <></>
}

export default Logout