import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import Image from './Images/Image.js'
import config from '../../config.js'
import '../assets/styles/components/images.css'

const Images = props => {

    const [rows, setRows] = useState(config.rows)

    const handleMore = () => {
        setRows(rowsOld => rowsOld + config.rows)
    }

    return (<>
        <div className="images">
            {props.children.slice(0, rows)}
        </div>
        {props.children.length > rows ? (
            <div className="text-center">
                <Button variant="outline-secondary"
                    classname="my-4" onClick={handleMore}>Більше ...</Button>
            </div>
        ) : null}
   </>)
}

Images.propTypes = {
    children: PropTypes.node.isRequired
}

export { Images as default, Image }