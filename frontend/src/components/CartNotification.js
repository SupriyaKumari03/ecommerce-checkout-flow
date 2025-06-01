import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/CartNotification.css';

const CartNotification = () => {
    const { showNotification, lastAddedItem, setShowNotification, cartItems } = useCart();
    const navigate = useNavigate();

    if (!showNotification || !lastAddedItem) return null;

    const handleCheckout = () => {
        setShowNotification(false);
        navigate('/checkout', {
            state: {
                cartItems: cartItems,
                subtotal: cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
            }
        });
    };

    return (
        <div className="cart-notification">
            <div className="notification-content">
                <div className="notification-header">
                    <span className="success-icon">✓</span>
                    <span>Item added to your cart</span>
                    <button
                        className="close-button"
                        onClick={() => setShowNotification(false)}
                    >
                        ×
                    </button>
                </div>
                <div className="added-item">
                    <img
                        src={lastAddedItem.product.image}
                        alt={lastAddedItem.product.title}
                        className="item-image"
                    />
                    <div className="item-details">
                        <h4>{lastAddedItem.product.title}</h4>
                        <p>Size: {lastAddedItem.selectedSize}</p>
                        <p>Color: {lastAddedItem.selectedColor}</p>
                    </div>
                </div>
                <div className="notification-actions">
                    <Link to="/cart" className="view-cart-button" onClick={() => setShowNotification(false)}>
                        View cart ({cartItems.length})
                    </Link>
                    <button
                        className="checkout-button"
                        onClick={handleCheckout}
                    >
                        Check out
                    </button>
                    <button
                        className="continue-shopping"
                        onClick={() => setShowNotification(false)}
                    >
                        Continue shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartNotification; 