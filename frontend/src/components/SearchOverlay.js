import React, { useEffect } from 'react';
import '../styles/SearchOverlay.css';

const SearchOverlay = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div className="search-backdrop" onClick={onClose}></div>
            <div className="search-overlay">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search"
                        className="search-input"
                        autoFocus
                    />
                    <button className="close-button" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </>
    );
};

export default SearchOverlay;