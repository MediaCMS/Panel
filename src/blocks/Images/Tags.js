import React from 'react'
import { Button } from 'react-bootstrap'

export default function (props) {

    return <div className="tags text-center">
        {props.items.map(item => {
            let size = ''
            if (item.images > 5) size = 'lg'
            if (item.images < 3) size = 'sm'
            return (
                <Button size={size} className="m-2" key={item._id}
                    variant={item.images === 1 ? 'outline-secondary' : 'outline-dark'}
                    onClick={() => props.onClick(item)}>
                    <span className={item.images > 7 ? 'fw-bold' : 'fw-normal'}>
                        {item.title}
                    </span>
                </Button>
            )
        })}
    </div>
}