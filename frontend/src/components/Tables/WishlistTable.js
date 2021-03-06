import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Image, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { getDurationBetweenDates } from 'utilities/date';
import { productUrl } from 'utilities/appUrls';
import { getUserId } from 'utilities/localStorage';
import MyScrollToTop from 'components/MyScrollToTop';
import SortTh from './SortTh';
import moment from 'moment';

import './tables.css';

const WishlistTable = ({ products, setProducts }) => {
    const history = useHistory();
    const userId = getUserId();

    const [active, setActive] = useState("defaultSort");

    const getTimeColumn = (product) => {
        const productEndDate = moment.utc(product.endDate);
        return moment().isSameOrAfter(productEndDate) ? "0s" : getDurationBetweenDates(moment(), productEndDate);
    }

    const isClosed = (endDate) => moment().isSameOrAfter(moment.utc(endDate));

    const getImageSrc = (product) => product.url !== null ? product.url : "/images/placeholder-image-gray.png";

    return (
        <>
            <Table style={products.length === 0 ? { borderBottom: 'none' } : null} variant="gray-transparent" responsive>
                <thead>
                    <tr className="product-table-header">
                        <SortTh style={{ width: 142 }} active={active} setActive={setActive} data={products} setData={setProducts} name="defaultSort" type="date">Item</SortTh>
                        <SortTh active={active} setActive={setActive} data={products} setData={setProducts} name="name" type="string">Name</SortTh>
                        <SortTh style={{ minWidth: 178 }} active={active} setActive={setActive} data={products} setData={setProducts} name="endDate" type="date">Time Left</SortTh>
                        <SortTh style={{ minWidth: 135 }} active={active} setActive={setActive} data={products} setData={setProducts} name="maxBid" type="number">Highest Bid</SortTh>
                        <th style={{ width: 230 }}>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>
                                <Image style={{ cursor: 'pointer' }} onClick={() => history.push(productUrl(product))} className="avatar-image-medium" src={getImageSrc(product)} />
                            </td>
                            <td>
                                <div style={{ cursor: 'pointer' }} onClick={() => history.push(productUrl(product))} className="product-table-name">
                                    {product.name}
                                </div>
                                <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                        <Tooltip>
                                            {product.id}
                                        </Tooltip>
                                    }
                                >
                                    <div className="product-table-id">
                                        #{product.id.substring(0, 8)}
                                    </div>
                                </OverlayTrigger>
                            </td>
                            <td>
                                {getTimeColumn(product)}
                            </td>
                            <td style={product.personId === userId ? { color: 'var(--strong-green)', fontWeight: 'bold' } : { fontWeight: 'bold' }}>
                                {product.maxBid !== null ? "$ " + product.maxBid : "/"}
                            </td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Button
                                        size="lg"
                                        variant="fill-gray"
                                        className="wishlist-table-button"
                                        style={isClosed(product.endDate) ? { color: 'var(--error)' } : { color: 'var(--success)' }}
                                        disabled
                                    >
                                        {isClosed(product.endDate) ? "CLOSED" : "OPEN"}
                                    </Button>
                                    <Button
                                        size="lg-2"
                                        variant="transparent-black-shadow-disabled"
                                        style={{ width: 105, marginLeft: 20 }}
                                        onClick={() => history.push(productUrl(product))}
                                    >
                                        {isClosed(product.endDate) || product.personAddedId === userId ? "VIEW" : "BID"}
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <MyScrollToTop />
        </>
    );
}

export default WishlistTable;
