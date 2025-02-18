import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Table, Button } from 'react-bootstrap'
import Row from './Table/Row.js'
import Cell from './Table/Cell.js'
import config from '../config.js'
import '../assets/styles/components/table.css'

const TableWrapper = props => {

    const [rows, setRows] = useState(config.rows)

    const handleMore = () => {
        setRows(rowsOld => rowsOld + config.rows)
    }

    return (
        <Table hover>
            <thead>
                <tr className="text-center">
                    <Cell scope="col">#</Cell>
                    {props.columns.map(column => (
                        <Cell scope="col" key={column}>{column}</Cell>
                    ))}
                </tr>
            </thead>
            <tbody>
                {props.children.slice(0, rows).map((child, index) => 
                    React.cloneElement(child, [], 
                        <>
                            <th scope="row" className="text-center">{index + 1}</th>
                            {child.props?.children}
                        </>
                    )
                )}
            </tbody>
            {props.children.length > rows ? (
                <tfoot>
                    <tr className="text-center">
                        <td colSpan={props.columns.length + 1}>
                            <Button variant="outline-secondary"
                                classname="my-4" onClick={handleMore}>Більше ...</Button>
                        </td>
                    </tr>
                </tfoot>
            ) : null}
        </Table>
   )
}

TableWrapper.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    children: PropTypes.node.isRequired
}

export { TableWrapper as default, Row, Cell }