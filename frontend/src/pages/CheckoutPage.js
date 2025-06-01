import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/CheckoutPage.css';
import axios from 'axios';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [orderDetails, setOrderDetails] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Handle both single product and cart checkout
        if (location.state?.cartItems) {
            console.log('Cart items:', location.state.cartItems);
            // Cart checkout
            setOrderDetails({
                items: location.state.cartItems.map(item => ({
                    ...item,
                    product: {
                        ...item.product,
                        // Remove numeric IDs to avoid MongoDB casting issues
                        id: typeof item.product.id === 'string' ? item.product.id : undefined
                    }
                })),
                subtotal: location.state.subtotal,
                shipping: 0, // Free shipping
                total: location.state.subtotal
            });
        } else if (location.state?.product) {
            console.log('Single product:', location.state.product);
            // Single product checkout
            const { product, variants } = location.state;
            const subtotal = product.price * (variants?.quantity || 1);

            // Create a demo product without an ID for testing
            const demoProduct = {
                title: product.title || 'Demo Product',
                price: product.price || 0,
                image: product.image || '/placeholder.jpg',
                description: product.description || 'Demo product for testing'
            };

            setOrderDetails({
                items: [{
                    product: demoProduct,
                    quantity: variants?.quantity || 1,
                    selectedColor: variants?.color || product.variants?.colors[0] || 'Default',
                    selectedSize: variants?.size || product.variants?.sizes[0] || 'OS',
                }],
                subtotal,
                shipping: 0, // Free shipping
                total: subtotal
            });
        } else {
            // No product data, redirect to home
            navigate('/');
        }
    }, [location, navigate]);

    const validateForm = () => {
        const newErrors = {};

        // Full Name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        // Address validation
        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        // City validation
        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }

        // State validation
        if (!formData.state.trim()) {
            newErrors.state = 'State is required';
        }

        // PIN Code validation (6 digits for India)
        const pinCodeRegex = /^[1-9][0-9]{5}$/;
        if (!pinCodeRegex.test(formData.zipCode)) {
            newErrors.zipCode = 'Please enter a valid 6-digit PIN code';
        }

        // Card Number validation
        const cardRegex = /^\d{16}$/;
        if (!cardRegex.test(formData.cardNumber.replace(/\s/g, ''))) {
            newErrors.cardNumber = 'Please enter a valid 16-digit card number';
        }

        // Expiry Date validation
        const [month, year] = formData.expiryDate.split('/').map(num => num.trim());
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;

        if (!month || !year || month < 1 || month > 12 || year < currentYear) {
            newErrors.expiryDate = 'Please enter a valid future expiry date (MM/YY)';
        } else if (year == currentYear && month < currentMonth) {
            newErrors.expiryDate = 'Card has expired';
        }

        // CVV validation
        const cvvRegex = /^\d{3}$/;
        if (!cvvRegex.test(formData.cvv)) {
            newErrors.cvv = 'Please enter a valid 3-digit CVV';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Format card number with spaces
        if (name === 'cardNumber') {
            formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        }

        // Format expiry date
        if (name === 'expiryDate') {
            formattedValue = value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '$1/$2')
                .substr(0, 5);
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);

        try {
            // Simulate different transaction outcomes based on card number
            // Last digit: 0-3 = approved, 4-6 = declined, 7-9 = error
            const lastDigit = parseInt(formData.cardNumber.slice(-1));
            let transactionStatus;

            if (lastDigit <= 3) {
                transactionStatus = 'approved';
            } else if (lastDigit <= 6) {
                transactionStatus = 'declined';
            } else {
                transactionStatus = 'error';
            }

            // Generate unique order number
            const timestamp = Date.now().toString(36);
            const random = Math.random().toString(36).substr(2, 5);
            const orderNumber = `${timestamp}-${random}`.toUpperCase();

            // Create order data with proper structure
            const orderData = {
                orderNumber,
                orderDetails: {
                    items: orderDetails.items.map(item => ({
                        product: {
                            title: item.product.title,
                            price: item.product.price,
                            image: item.product.image,
                            description: item.product.description
                        },
                        quantity: item.quantity,
                        selectedColor: item.selectedColor,
                        selectedSize: item.selectedSize
                    })),
                    subtotal: orderDetails.subtotal,
                    shipping: orderDetails.shipping,
                    total: orderDetails.total
                },
                customerInfo: {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode
                },
                transactionStatus
            };

            console.log('Sending order data:', JSON.stringify(orderData, null, 2));

            // Send order to backend
            const response = await axios.post('http://localhost:5000/api/orders', orderData);
            console.log('Order response:', response.data);

            // Remove session storage and directly navigate with order number
            navigate(`/thank-you/${response.data.orderNumber}`);
        } catch (error) {
            console.error('Order submission error:', error.response?.data || error.message);
            console.error('Full error object:', error);
            setErrors(prev => ({
                ...prev,
                submit: error.response?.data?.message || 'An error occurred while processing your order. Please try again.'
            }));
        } finally {
            setIsProcessing(false);
        }
    };

    if (!orderDetails) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <div className="checkout-form-section">
                    <h1>Checkout</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-section">
                            <h2>Shipping Information</h2>
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className={errors.fullName ? 'error' : ''}
                                />
                                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={errors.email ? 'error' : ''}
                                    />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={errors.phone ? 'error' : ''}
                                    />
                                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className={errors.address ? 'error' : ''}
                                />
                                {errors.address && <span className="error-message">{errors.address}</span>}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">City</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className={errors.city ? 'error' : ''}
                                    />
                                    {errors.city && <span className="error-message">{errors.city}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="state">State</label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className={errors.state ? 'error' : ''}
                                    />
                                    {errors.state && <span className="error-message">{errors.state}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="zipCode">ZIP Code</label>
                                    <input
                                        type="text"
                                        id="zipCode"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        className={errors.zipCode ? 'error' : ''}
                                    />
                                    {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h2>Payment Information</h2>
                            <div className="form-group">
                                <label htmlFor="cardNumber">Card Number</label>
                                <input
                                    type="text"
                                    id="cardNumber"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleInputChange}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="19"
                                    className={errors.cardNumber ? 'error' : ''}
                                />
                                {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="expiryDate">Expiry Date</label>
                                    <input
                                        type="text"
                                        id="expiryDate"
                                        name="expiryDate"
                                        value={formData.expiryDate}
                                        onChange={handleInputChange}
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        className={errors.expiryDate ? 'error' : ''}
                                    />
                                    {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cvv">CVV</label>
                                    <input
                                        type="text"
                                        id="cvv"
                                        name="cvv"
                                        value={formData.cvv}
                                        onChange={handleInputChange}
                                        placeholder="123"
                                        maxLength="3"
                                        className={errors.cvv ? 'error' : ''}
                                    />
                                    {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                                </div>
                            </div>
                        </div>

                        {errors.submit && (
                            <div className="error-message submit-error">
                                {errors.submit}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="place-order-button"
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Processing...' : 'Place Order'}
                        </button>
                    </form>
                </div>

                <div className="order-summary-section">
                    <h2>Order Summary</h2>
                    {orderDetails.items.map((item, index) => (
                        <div key={index} className="order-item">
                            <img src={item.product.image} alt={item.product.title} className="product-image" />
                            <div className="product-details">
                                <h3>{item.product.title}</h3>
                                <p className="product-description">{item.product.description}</p>
                                <div className="product-meta">
                                    <p>Color: {item.selectedColor}</p>
                                    <p>Size: {item.selectedSize}</p>
                                    <p>Quantity: {item.quantity}</p>
                                </div>
                                <p className="product-price">Rs. {item.product.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                    <div className="order-totals">
                        <div className="subtotal">
                            <span>Subtotal</span>
                            <span>Rs. {orderDetails.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="shipping">
                            <span>Shipping</span>
                            <span>{orderDetails.shipping === 0 ? 'Free' : `Rs. ${orderDetails.shipping.toFixed(2)}`}</span>
                        </div>
                        <div className="total">
                            <span>Total</span>
                            <span>Rs. {orderDetails.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage; 