import React from 'react';
import { Image, Table } from 'react-bootstrap';
import moment from 'moment';

const BidTable = ({ bids }) => {

    return (
        <Table variant="gray-transparent" responsive>
            <thead>
                <tr>
                    <th colSpan="2">Bider</th>
                    <th>Date</th>
                    <th>Bid</th>
                </tr>
            </thead>
            <tbody>
                {bids.map((bid, i) => (
                    <tr key={bid.id}>
                        <td style={{ fontWeight: 'bold' }} colSpan="2">
                            <Image style={{ marginRight: 20 }} className="avatar-image-small" src={bid.photo} roundedCircle />
                            {bid.firstName + ' ' + bid.lastName}
                        </td>
                        <td>{moment(bid.date).format("D MMMM YYYY")}</td>
                        <td style={i === 0 ? { color: '#6CC047', fontWeight: 'bold' } : { fontWeight: 'bold' }}>{'$ ' + bid.price}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default BidTable;