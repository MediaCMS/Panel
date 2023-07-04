import React, { useEffect } from 'react'

export default () => {

    useEffect(async () => {
        context.setParams({
            title: 'Головна', router: 'main', container: true,
            width: 'standart', submenu: []
        })
    }, [])

    return <></>
}