import React from 'react'
import { Button } from 'react-bootstrap'

export default props => {

    return <>
        <Button variant="secondary" onClick={props.onClick}>Закрити</Button>
        <Button type="submit" onClick={props.onClick}>Фільтрувати</Button>
    </>

}