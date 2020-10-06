import React, { useEffect, useState } from 'react';
import { Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { getUserId } from 'utilities/localStorage';
import { IoIosArrowForward } from "react-icons/io";
import { RiHeartFill } from "react-icons/ri";
import { getProduct, getRelatedProducts } from 'api/product';
import { bidForProduct, getBidsForProduct } from 'api/bid';
import { wishlistProduct, removeWishlistProduct } from 'api/wishlist';
import { productUrl } from 'utilities/appUrls';
import ImageCard from 'components/ImageCard';
import BidTable from 'components/BidTable';
import moment from 'moment';

import './itemPage.css';
import ProductPhotos from 'components/ProductPhotos';

const ItemPage = ({ match, setBreadcrumb, showMessage }) => {
    const personId = getUserId();

    const [product, setProduct] = useState(null);
    const [bids, setBids] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingWish, setLoadingWish] = useState(false);
    const [active, setActive] = useState(true);
    const [ownProduct, setOwnProduct] = useState(false);
    const [bidPrice, setBidPrice] = useState("");
    const [minPrice, setMinPrice] = useState(0);

    useEffect(() => {
        formBreadcrumb();
        const fetchData = async () => {
            const productId = match.params.id;
            try {
                const data = await getProduct(productId, personId);
                setActive(moment().isBetween(moment(data.startDate), moment(data.endDate), null, "[)"));
                setOwnProduct(data.personId === personId);
                setProduct(data);
                if (personId === null) {
                    setRelatedProducts(await getRelatedProducts(productId));
                }
                const bids = await getBidsForProduct(productId);
                const highestBidFromUser = Math.max(...bids.map(bid => bid.personId === personId ? bid.price : 0), 0);
                setMinPrice(highestBidFromUser === 0 ? data.startPrice : highestBidFromUser + 0.01);
                setBids(bids);
            } catch (e) { }
        }

        fetchData();
        // eslint-disable-next-line
    }, [match.params.id])

    const formBreadcrumb = () => {
        const urlElements = match.url.split("/").slice(1, -1);
        setBreadcrumb("SINGLE PRODUCT", [...urlElements.map((el, i) => {
            return {
                text: el.toUpperCase().split("_").join(" "),
                href: "/" + urlElements.slice(0, i + 1).join("/")
            }
        }), { text: "SINGLE PRODUCT" }]);
    }

    const bid = async () => {
        if (personId === null) {
            showMessage("warning", "You have to be logged in to place bids.");
            return;
        }
        setLoading(true);
        const price = bidPrice;
        try {
            await bidForProduct(parseFloat(price), product.id);
            const newBids = await getBidsForProduct(product.id);
            setMinPrice(Math.max(...newBids.map(bid => bid.personId === personId ? bid.price : 0), 0) + 0.01);
            if (personId === newBids[0].personId)
                showMessage("success", "Congratulations! You are the highest bider!");
            else
                showMessage("warning", "There are higher bids than yours. You could give a second try!");
            setBids(newBids);
            setBidPrice("");
        } catch (e) { }
        setLoading(false);
    }

    const getTimeInfo = () => {
        const productStartDate = moment(product.startDate)
        if (moment().isBefore(productStartDate))
            return (
                <>
                    Time start: {productStartDate.format("D MMMM YYYY [at] HH:mm")}
                    <br />
                    Time end: {moment(product.endDate).format("D MMMM YYYY [at] HH:mm")}
                </>
            );
        const timeLeft = !active ? 0 : moment.duration(moment(product.endDate).diff(moment())).format("D [days] h [hours] m [minutes]");
        return (
            <>
                Time left: {timeLeft}
            </>
        );
    }

    const renderTooltip = () => {
        let tooltipText = "";
        switch (true) {
            case ownProduct:
                tooltipText = "You can't bid on your own product";
                break;
            case !active:
                tooltipText = "Auction is yet to start for this product";
                break;
            case bidPrice === "":
                break;
            case isNaN(bidPrice):
                tooltipText = "Entered value isn't a valid number";
                break;
            case bidPrice < minPrice:
                tooltipText = "Price can't be lower than $" + minPrice;
                break;
            default:
                break;
        }

        return tooltipText === "" ?
            (<div></div>) : (
                <Tooltip>
                    {tooltipText}
                </Tooltip>
            );
    }

    const wishlist = async () => {
        if (personId === null) {
            showMessage("warning", "You have to be logged in to wishlist products.");
            return;
        }
        setLoadingWish(true);
        try {
            if (product.wished) {
                await removeWishlistProduct(personId, product.id);
                showMessage("success", "You have removed the product from your wishlist.");
            }
            else {
                await wishlistProduct(personId, product.id);
                showMessage("success", "You have added the product to your wishlist.");
            }
            product.wished = !product.wished;
        } catch (e) { }
        setLoadingWish(false);
    }

    return (
        <>
            {product !== null ? (
                <>
                    <div className="product-container">
                        <ProductPhotos photos={product.photos} />

                        <div className="product-info-container">
                            <div>
                                <h1>
                                    {product.name}
                                </h1>
                                <div style={{ marginTop: 10 }} className="featured-product-price">
                                    Start from ${product.startPrice}
                                </div>
                            </div>
                            <div className="place-bid-container">
                                <div>
                                    <Form.Control value={bidPrice} disabled={ownProduct || !active || loading} maxLength="7" className="form-control-gray place-bid-form" size="xl-18" type="text" onChange={e => setBidPrice(e.target.value)} />
                                    <div className="place-bid-label">
                                        Enter ${minPrice} or more
                                    </div>
                                </div>
                                <OverlayTrigger
                                    placement="right"
                                    overlay={renderTooltip()}
                                >
                                    <Button disabled={ownProduct || !active || loading || isNaN(bidPrice) || bidPrice < minPrice} style={{ width: 192, padding: 0 }} size="xxl" variant="transparent-black-shadow" onClick={bid}>
                                        PLACE BID
                                    <IoIosArrowForward style={{ fontSize: 24 }} />
                                    </Button>
                                </OverlayTrigger>
                            </div>
                            <div style={{ color: '#9B9B9B' }}>
                                Highest bid: {' '}
                                <span style={{ color: '#8367D8', fontWeight: 'bold' }}>
                                    ${bids[0] === undefined ? 0 : bids[0].price}
                                </span>
                                <br />
                                No bids: {bids.length}
                                <br />
                                {getTimeInfo()}
                            </div>
                            <div>
                                <Button
                                    className="wishlist-button"
                                    style={product.wished ? { borderColor: '#8367D8' } : null}
                                    variant="transparent-gray"
                                    onClick={wishlist}
                                    disabled={loadingWish}
                                >
                                    Wishlist
                                    {product.wished ? (
                                        <RiHeartFill style={{ fontSize: 22, marginLeft: 5, color: '#8367D8' }} />
                                    ) : (
                                            <RiHeartFill style={{ fontSize: 22, marginLeft: 5, color: '#ECECEC' }} />
                                        )}
                                </Button>
                                <div className="font-18" style={{ marginTop: 15 }}>
                                    Details
                                    <div className="gray-line" />
                                    <div className="font-15">
                                        {product.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
            {personId !== null && bids.length !== 0 ? (
                <BidTable bids={bids} />
            ) : null}
            {personId === null && product !== null ? (
                <div style={{ marginTop: 150 }} className="featured-container">
                    <h2>
                        Related products
                    </h2>
                    <div className="gray-line" />
                    <div className="featured-items-container">
                        {relatedProducts.map(product => (
                            <ImageCard key={product.id} data={product} size="xxl" url={productUrl(product)} />
                        ))}
                    </div>
                </div>
            ) : null}
        </>
    );
}

export default withRouter(ItemPage);
