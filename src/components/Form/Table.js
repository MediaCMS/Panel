import React from 'react'

const sizes = { small: '480px', medium: '640px', large: '960px' }

export default props => {

    return <div className="mt-5 mx-auto"
        style={{ maxWidth: sizes[props.size] }} {...props}>
        {props?.children}
    </div>

}

