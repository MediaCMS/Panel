"use strict"

import { useEffect } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"

export default function Logout() {

    const navigate = useNavigate()
    const context = useOutletContext()

    useEffect(async () => {
        await context.api.get('/користувачі/вихід')
        localStorage.removeItem('user')
        navigate('/доступ/вхід')
    }, [])

    return null
}