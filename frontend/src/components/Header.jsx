import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SearchOverlay from './SearchOverlay';
import '../styles/Header.css';

const Header = () => {
    const navigate = useNavigate();
    const { getCartCount } = useCart();
    const { user, signout, isAuthenticated } = useAuth();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleSearchClick = () => {
        setIsSearchOpen(true);
    };

    const handleSearchClose = () => {
        setIsSearchOpen(false);
    };

    const handleSignOut = () => {
        signout();
        setShowUserMenu(false);
        navigate('/');
    };

    const handleUserIconClick = () => {
        if (!isAuthenticated) {
            navigate('/signin');
            return;
        }
        setShowUserMenu(!showUserMenu);
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

                        {isAuthenticated ? (
                            <div className="user-menu-container">
                                <button
                                    className="icon-button"
                                    onClick={handleUserIconClick}
                                    title="Account Menu"
                                >
                                    <i className="fas fa-user"></i>
                                </button>
                                {showUserMenu && (
                                    <div className="user-menu">
                                        <div className="user-info">
                                            <p>Welcome, {user.firstName}!</p>
                                        </div>
                                        <Link to="/profile" className="menu-item">My Profile</Link>
                                        <Link to="/orders" className="menu-item">My Orders</Link>
                                        <button onClick={handleSignOut} className="menu-item sign-out">
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                className="icon-button"
                                onClick={() => navigate('/signin')}
                                title="Sign In"
                            >
                                <i className="fas fa-user"></i>
                            </button>
                        )}

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