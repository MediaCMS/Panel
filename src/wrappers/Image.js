import React, { useState, useCallback } from "react"
import image from "../image.js"

export default function (props) {

    const [source, setSource] = useState()

    const ref = useCallback(node => {
        if (!node) return
        setSource(
            image.adapt(props.src,
                props?.width ?? node.clientWidth,
                props?.height ?? node.clientHeight
            )
        )
    }, [])

    return <img src={source} alt={props.title} loading="lazy"
        className={props?.className} ref={ref} />
}