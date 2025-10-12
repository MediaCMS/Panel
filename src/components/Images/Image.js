import PropTypes from 'prop-types'
import React from 'react'
import config from '../../config.js'

const Image = ({ title, name, tags, status, onClick }) => {

    const titleNew = title + ' (' +  tags.join() + ')'

    return (  
        <div className="image border border-white bg-secondary d-inline-block"
            onClick={onClick}>
            <img src={config.images.url + '/' + name}
                className={status ? '' : 'image-muted'}
                title={titleNew} alt={title} />
        </div>
    )
}

Image.propTypes = {
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    status: PropTypes.bool,
    onClick: PropTypes.func
}

export default Image