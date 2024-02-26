import React from 'react';
import './transactionHistory.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Pagination from 'react-bootstrap/Pagination';

function TransactionHistory() {

    /**
     * active page
     */
    let active = 1;

    /**
     * items in pagination
     */
    let items = [];

    /**
     * pagination items
     */
    for (let number = 1; number <= 5; number++) {
        items.push(
            <Pagination.Item key={number} active={number === active}>
                {number}
            </Pagination.Item>,
        );
    }
    return (
        <>
            <div className='transactionCardStyling'>
                <h5>Transaction History</h5>
                <div>
                    <ListGroup variant="flush">
                        <ListGroup.Item>Cras justo odio</ListGroup.Item>
                        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                        <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                        <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                        
                    </ListGroup>
                </div>
                <div className='historyPagination'>
                    <Pagination size="sm">{items}</Pagination>
                </div>
            </div>

        </>
    );

}

export default TransactionHistory;