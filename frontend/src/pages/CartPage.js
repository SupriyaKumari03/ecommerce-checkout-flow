import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/CartPage.css';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity >= 1) {
            updateQuantity(productId, newQuantity);
        }
    };

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/signin', { state: { from: '/cart' } });
            return;
        }

        if (cartItems.length > 0) {
            navigate('/checkout', {
                state: {
                    cartItems: cartItems,
                    subtotal: calculateSubtotal(),
                }
            });
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="empty-cart-container">
                <h1>Your cart is empty</h1>
                <Link to="/" className="continue-shopping">
                    Continue shopping
                </Link>
                {!isAuthenticated && (
                    <div className="empty-cart-auth">
                        <div className="account-prompt">
                            <i className="fas fa-user-circle"></i>
                            <div className="prompt-content">
                                <h2>Have an account?</h2>
                                <p>
                                    <Link to="/signin" className="login-link">Sign in</Link>
                                    <span> to check out faster and view your order history.</span>
                                </p>
                            </div>
                        </div>
                        <div className="auth-buttons">
                            <Link to="/signin" className="auth-button signin">Sign in</Link>
                            <Link to="/signup" className="auth-button signup">Create Account</Link>
                        </div>
                    </div>
                )}
                <div className="payment-methods">
                    <div className="payment-icons">
                        <img src="/images/payment/visa.svg" alt="Visa" />
                        <img src="/images/payment/mastercard.svg" alt="Mastercard" />
                        <img src="/images/payment/amex.svg" alt="American Express" />
                        <img src="/images/payment/paypal.svg" alt="PayPal" />
                        <img src="/images/payment/diners.svg" alt="Diners Club" />
                        <img src="/images/payment/discover.svg" alt="Discover" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            {!isAuthenticated && (
                <div className="cart-auth-banner">
                    <div className="auth-message">
                        <i className="fas fa-user-circle"></i>
                        <span>Have an account? <Link to="/signin" state={{ from: '/cart' }}>Sign in</Link> for a faster checkout experience</span>
                    </div>
                </div>
            )}
            <h1>Shopping Cart</h1>
            <div className="cart-container">
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="cart-item">
                            <img src={item.product.image} alt={item.product.title} />
                            <div className="item-details">
                                <h3>{item.product.title}</h3>
                                <p className="item-description">{item.product.description}</p>
                                <div className="item-variants">
                                    <p>Color: {item.selectedColor}</p>
                                    <p>Size: {item.selectedSize}</p>
                                </div>
                                <div className="quantity-controls">
                                    <button
                                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="item-price">Rs. {(item.product.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <button
                                className="remove-button"
                                onClick={() => removeFromCart(item.product.id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <div className="cart-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-details">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>Rs. {calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>Rs. {calculateSubtotal().toFixed(2)}</span>
                        </div>
                    </div>
                    {!isAuthenticated && (
                        <div className="auth-prompt">
                            <p>Please <Link to="/signin" state={{ from: '/cart' }}>sign in</Link> to proceed with checkout</p>
                        </div>
                    )}
                    <button
                        className="checkout-button"
                        onClick={handleCheckout}
                        disabled={cartItems.length === 0}
                    >
                        {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage; 