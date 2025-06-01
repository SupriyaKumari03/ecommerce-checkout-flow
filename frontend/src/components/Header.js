import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SearchOverlay from './SearchOverlay';
import '../styles/Header.css';

const Header = () => {
    const { getCartCount } = useCart();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const handleSearchClick = () => {
        setIsSearchOpen(true);
    };

    const handleSearchClose = () => {
        setIsSearchOpen(false);
    };

    return (
        <>
            <SearchOverlay isOpen={isSearchOpen} onClose={handleSearchClose} />
            <header className="header">
                <nav className="nav-container">
                    <div className="nav-links">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/catalog" className="nav-link">Catalog</Link>
                        <Link to="/contact" className="nav-link">Contact</Link>
                    </div>

                    <div className="logo">
                        <Link to="/">
                            <h1>e-SalesOne</h1>
                        </Link>
                    </div>

                    <div className="nav-actions">
                        <button className="icon-button" onClick={handleSearchClick}>
                            <i className="fas fa-search"></i>
                        </button>
                        <button className="icon-button">
                            <i className="fas fa-user"></i>
                        </button>
                        <Link to="/cart" className="icon-button cart-button">
                            <i className="fas fa-shopping-cart"></i>
                            <span className="cart-count">{getCartCount()}</span>
                        </Link>
                    </div>
                </nav>
            </header>
        </>
    );
};

export default Header;