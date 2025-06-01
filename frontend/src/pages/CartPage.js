import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/CartPage.css';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
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
                <div className="account-prompt">
                    <h2>Have an account?</h2>
                    <Link to="/login" className="login-link">Log in</Link>
                    <span> to check out faster.</span>
                </div>
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
                    <button
                        className="checkout-button"
                        onClick={handleCheckout}
                        disabled={cartItems.length === 0}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage; 