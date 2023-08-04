import React from 'react'
import { Form } from 'react-bootstrap'

export default function (props) {

    return (
        <Form.Group className={'autocomplete single dropdown ' + (props?.className ?? '')}>
            <Form.Label>{props.label ?? 'Автозаповнення'}</Form.Label>
            <Form.Control type="text" name="prompt" value={prompt}
                pattern={props.pattern ?? '.{1,128}'}
                onFocus={handleFocus} onChange={handleChange} onBlur={handleBlur}
                title={props.title ?? 'Введіть початкові символи для пошуку'} />
            {!!items.length && (
                <ul className="dropdown-menu show">
                    {items.map(item => (
                        <li key={item._id} className="dropdown-item" onMouseDown={handleClick}
                                id={item._id}>{item.title}
                        </li>
                    ))}
                </ul>
            )}
        </Form.Group>
    )
}