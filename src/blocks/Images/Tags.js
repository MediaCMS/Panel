import React from 'react'

export default function (props) {

    return <div className="tags">
        {props.items.map(item => 
            <button type="button" className="btn btn-outline-dark"
                onClick={() => props.onClick(item)} key={item._id}>
                {item.title}
            </button>
        )}
    </div>
}