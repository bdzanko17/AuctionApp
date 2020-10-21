import React, { useEffect, useState } from 'react';
import { SiFacebook, SiTwitter, SiInstagram } from "react-icons/si";
import { RiAuctionFill } from "react-icons/ri";
import { GrFormSearch } from "react-icons/gr";
import { FormControl, Image, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { removeSession, getUser } from 'utilities/localStorage';
import { homeUrl, loginUrl, myAccountUrl, registerUrl, shopUrl } from 'utilities/appUrls';
import { useUserContext } from 'AppContext';
import * as qs from 'query-string';

import './header.css';

const Header = () => {
    const { loggedIn, setLoggedIn } = useUserContext();

    const user = getUser();
    const history = useHistory();

    const [searchInput, setSearchInput] = useState("");

    const handleLogout = () => {
        setLoggedIn(false);
        removeSession();
    };

    useEffect(() => {
        const urlParams = qs.parse(history.location.search);
        if (searchInput !== urlParams.query)
            setSearchInput(urlParams.query);
        // eslint-disable-next-line
    }, [history.location.search])

    const handleSearch = async () => {
        const urlParams = {
            query: searchInput,
            sort: "default"
        };
        history.push({
            pathname: shopUrl,
            search: qs.stringify(urlParams)
        });
    }

    return (
        <>
            <div className="top-header-container">
                <div className="socials-container">
                    <a className="social-link" rel="noopener noreferrer" href="https://www.facebook.com/AtlantBH" target="_blank">
                        <SiFacebook />
                    </a>
                    <a className="social-link" rel="noopener noreferrer" href="https://twitter.com/atlantbh" target="_blank">
                        <SiTwitter />
                    </a>
                    <a className="social-link" rel="noopener noreferrer" href="https://www.instagram.com/atlantbh" target="_blank">
                        <SiInstagram />
                    </a>
                </div>
                <Nav className="top-header-nav-links">
                    {loggedIn ?
                        (
                            <>
                                <Image style={{ marginRight: '0.5rem' }} roundedCircle className="avatar-image-tiny" src={user.photo} />
                                {user.firstName + ' ' + user.lastName + ' |'}
                                <Link style={{ paddingRight: 0, paddingLeft: 5 }} className="white-nav-link nav-link" onClick={handleLogout} to={homeUrl}>
                                    Log out
                                </Link>
                            </>
                        ) :
                        (
                            <>
                                <Link className="white-nav-link nav-link" to={loginUrl}>
                                    Login
                                </Link>
                                <Navbar.Text style={{ color: 'var(--text-secondary)' }}>
                                    or
                                </Navbar.Text>
                                <Link style={{ paddingRight: 0 }} className="white-nav-link nav-link" to={registerUrl}>
                                    Create an Account
                                </Link>
                            </>
                        )}
                </Nav>
            </div>

            <div className="bottom-header-container">
                <Link className="bottom-header-brand" to={homeUrl}>
                    <RiAuctionFill style={{ color: 'var(--pale-purple)', marginRight: 5 }} />
                    AUCTION
                </Link>
                <div className="bottom-header-search">
                    <FormControl
                        value={searchInput || ""}
                        onChange={(e) => setSearchInput(e.target.value)}
                        size="xl-18"
                        type="text"
                        maxLength="255"
                        placeholder="Try enter: Shoes"
                        onKeyUp={(e) => e.key === 'Enter' ? handleSearch() : null}
                    />
                    <GrFormSearch className="bottom-header-search-icon" onClick={handleSearch} />
                </div>
                <Nav>
                    <NavLink exact className="black-nav-link nav-link" activeClassName="black-active-nav-link" to={homeUrl}>HOME</NavLink>
                    <NavLink className="black-nav-link nav-link" activeClassName="black-active-nav-link" to={shopUrl}>SHOP</NavLink>
                    <NavLink style={{ paddingRight: 0 }} className="black-nav-link nav-link" activeClassName="black-active-nav-link" to={myAccountUrl}>MY ACCOUNT</NavLink>
                </Nav>
            </div>
        </>
    );
}

export default Header;