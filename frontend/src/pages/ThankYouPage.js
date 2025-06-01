import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ThankYouPage.css';
import GoogleMap from '../components/GoogleMap';

const ThankYouPage = () => {
    const navigate = useNavigate();
    const { orderNumber } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                if (!orderNumber) {
                    throw new Error('No order number provided');
                }

                const response = await axios.get(`http://localhost:5000/api/orders/${orderNumber}`);
                setOrderData(response.data);
            } catch (err) {
                console.error('Error fetching order:', err);
                setError(err.response?.data?.message || 'Failed to load order details.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [orderNumber]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!orderData) return null;

    const { orderDetails, customerInfo } = orderData;

    return (
        <div className="page-container">
            <header className="site-header">
                <div className="header-content">
                    <h1 className="site-title">eSalesOne-Test</h1>
                </div>
            </header>

            <main className="thank-you-container">
                <div className="main-content">
                    <div className="confirmation-header">
                        <div className="check-icon">✓</div>
                        <div className="confirmation-text">
                            <p className="confirmation-number">Confirmation #{orderNumber}</p>
                            <h1>Thank you, {customerInfo.fullName.split(' ')[0]}!</h1>
                        </div>
                    </div>

                    <div className="map-container">
                        <div className="shipping-address-label">
                            Shipping address
                            <div className="shipping-address-text">{customerInfo.city} {customerInfo.state}</div>
                        </div>
                        <GoogleMap
                            address={customerInfo.address}
                            city={customerInfo.city}
                            state={customerInfo.state}
                        />
                    </div>

                    <div className="confirmation-message">
                        <h2>Your order is confirmed</h2>
                        <p>You'll receive a confirmation email with your order number shortly.</p>
                    </div>

                    <div className="order-details">
                        <h2>Order details</h2>
                        <div className="order-details-grid">
                            <div className="details-section">
                                <h3>Contact information</h3>
                                <p>{customerInfo.email}</p>
                            </div>

                            <div className="details-section">
                                <h3>Payment method</h3>
                                <div className="payment-method">
                                    <div className="payment-badge">B</div>
                                    <div className="payment-details">•••• 1 · ₹{orderDetails.total.toFixed(2)}</div>
                                </div>
                            </div>

                            <div className="details-section">
                                <h3>Shipping address</h3>
                                <p>{customerInfo.fullName}</p>
                                <p>{customerInfo.address}</p>
                                <p>{customerInfo.zipCode} {customerInfo.city}</p>
                                <p>India</p>
                            </div>

                            <div className="details-section">
                                <h3>Billing address</h3>
                                <p>{customerInfo.fullName}</p>
                                <p>{customerInfo.address}</p>
                                <p>{customerInfo.zipCode} {customerInfo.city}</p>
                                <p>India</p>
                            </div>
                        </div>

                        <div className="details-section">
                            <h3>Shipping method</h3>
                            <p>Standard</p>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <div className="need-help">
                            Need help? <a href="/contact">Contact us</a>
                        </div>
                        <button onClick={() => navigate('/')} className="continue-shopping">
                            Continue shopping
                        </button>
                    </div>
                </div>

                <div className="side-content">
                    {orderDetails.items.map((item, index) => (
                        <div key={index} className="product-item">
                            <div className="product-image">
                                <img src={item.product.image} alt={item.product.title} />
                                <span className="quantity-badge">{item.quantity}</span>
                            </div>
                            <div className="product-details">
                                <h3>{item.product.title}</h3>
                                <p className="variant">{item.selectedSize} / {item.selectedColor}</p>
                            </div>
                            <div className="product-price">₹{item.product.price.toFixed(2)}</div>
                        </div>
                    ))}

                    <div className="price-summary">
                        <div className="price-row">
                            <span>Subtotal</span>
                            <span>₹{orderDetails.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="price-row">
                            <span>Shipping</span>
                            <span>FREE</span>
                        </div>
                        <div className="price-row">
                            <span>Estimated taxes</span>
                            <span>₹{((orderDetails.total - orderDetails.subtotal) || 0).toFixed(2)}</span>
                        </div>
                        <div className="price-row total">
                            <span>Total</span>
                            <div className="total-amount">
                                <span className="currency">INR</span>
                                <span>₹{orderDetails.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="site-footer">
                <a href="/privacy-policy" className="privacy-link">Privacy policy</a>
            </footer>
        </div>
    );
};

export default ThankYouPage; 