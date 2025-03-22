import PropTypes from 'prop-types'
import React from 'react'
import { Table, Button } from 'react-bootstrap'
import Row from './Table/Row.js'
import Cell from './Table/Cell.js'
import '../assets/styles/components/table.css'

const TableWrapper = props => {

    const handleAppend = () => {
        props.onAppend(
            props.params._skip + props.params._limit
        )
    }

    return (
        <Table className={props.className} hover>
            <thead>
                <tr className="text-center">
                    <Cell scope="col">#</Cell>
                    {props.columns.map(column => (
                        <Cell scope="col" key={column}>{column}</Cell>
                    ))}
                </tr>
            </thead>
            <tbody>
                {props.children.map((child, index) => 
                    React.cloneElement(child, [], 
                        <>
                            <th scope="row" className="text-center">{index + 1}</th>
                            {child.props?.children}
                        </>
                    )
                )}
            </tbody>
            {props?.onAppend
                && (<tfoot>
                    <tr className="text-center">
                        <td colSpan={props.columns.length + 1}>
                            <Button variant="outline-secondary"
                                className="my-4" onClick={handleAppend}>
                                Більше ...
                            </Button>
                        </td>
                    </tr>
                </tfoot>)
            }
        </Table>
   )
}

TableWrapper.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onAppend: PropTypes.func,
    params: PropTypes.object
}

export { TableWrapper as default, Row, Cell }