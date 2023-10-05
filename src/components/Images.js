import React, { useState } from 'react'
import Image from './Images/Image.js'
import config from '../../config.js'
import '../assets/styles/components/images.css'

function Images(props) {

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

export { Images as default, Image }