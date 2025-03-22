import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import Image from './Images/Image.js'
import config from '../config.js'
import '../assets/styles/components/images.css'

const Images = props => {

    const [limit, setLimit] = useState(config.limit)

    const handleAppend = () => {
        setLimit(limitOld => limitOld + config.limit)
    }

    return <>
        <div className="images">
            {props.children.slice(0, limit)}
        </div>
        {props.children.length > limit && (
            <div className="text-center">
                <Button variant="outline-secondary"
                    classname="my-4" onClick={handleAppend}>
                        Більше ...
                </Button>
            </div>
        )}
   </>
}

Images.propTypes = {
    children: PropTypes.node.isRequired
}

export { Images as default, Image }