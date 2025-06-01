import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/LandingPage.css';

// Mock product data
const products = [
    {
        id: 1,
        title: 'ADIDAS | CLASSIC BACKPACK',
        description: 'Classic Adidas backpack with modern design. Perfect for everyday use with spacious compartments and durable material.',
        price: 70.00,
        image: '/images/products/adidas-black-backpack.jpg',
        variants: {
            colors: ['Black', 'Navy', 'Grey'],
            sizes: ['Small', 'Medium', 'Large']
        }
    },
    {
        id: 2,
        title: 'ADIDAS | CLASSIC BACKPACK | LEGEND INK MULTICOLOUR',
        description: 'Vibrant multicolor backpack featuring the iconic Adidas trefoil logo. Water-resistant material with multiple pockets.',
        price: 50.00,
        image: '/images/products/adidas-blue-backpack.jpg',
        variants: {
            colors: ['Blue Multi', 'Red Multi', 'Green Multi'],
            sizes: ['One Size']
        }
    },
    {
        id: 3,
        title: 'ADIDAS | KID\'S STAN SMITH',
        description: 'Iconic Stan Smith sneakers sized for kids. Features classic white leather upper with green accents.',
        price: 90.00,
        image: '/images/products/adidas-stan-smith.jpg',
        variants: {
            colors: ['White/Green', 'White/Navy', 'White/Pink'],
            sizes: ['1', '2', '3', '4', '5']
        }
    },
    {
        id: 4,
        title: 'ADIDAS | SUPERSTAR 80S',
        description: 'Timeless Superstar sneakers with premium leather upper and signature shell toe. Classic streetwear essential.',
        price: 170.00,
        image: '/images/products/adidas-superstar.jpg',
        variants: {
            colors: ['White/Black', 'Black/White', 'White/Gold'],
            sizes: ['6', '7', '8', '9', '10', '11']
        }
    },
    {
        id: 5,
        title: 'ASICS TIGER | GEL-LYTE V \'30 YEARS OF GEL\' PACK',
        price: 220.00,
        image: '/images/products/asics-gel-lyte.jpg',
        variants: {
            colors: ['Red', 'Blue', 'Black'],
            sizes: ['7', '8', '9', '10', '11']
        }
    },
    {
        id: 6,
        title: 'CONVERSE | CHUCK TAYLOR ALL STAR II HI',
        price: 140.00,
        image: '/images/products/converse-chuck-taylor.jpg',
        variants: {
            colors: ['Black', 'White', 'Red'],
            sizes: ['6', '7', '8', '9', '10']
        }
    }
];

const LandingPage = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [selectedVariants, setSelectedVariants] = useState({});

    const handleVariantChange = (productId, type, value) => {
        setSelectedVariants(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                [type]: value
            }
        }));
    };

    const handleQuantityChange = (productId, value) => {
        const quantity = Math.max(1, Math.min(10, value)); // Limit quantity between 1 and 10
        setSelectedVariants(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                quantity
            }
        }));
    };

    const handleAddToCart = (product) => {
        const variants = selectedVariants[product.id] || {};
        addToCart(product, variants);
    };

    const handleBuyNow = (productId) => {
        const productVariants = selectedVariants[productId] || {};
        navigate('/checkout', {
            state: {
                product: products.find(p => p.id === productId),
                variants: productVariants
            }
        });
    };

    return (
        <div className="landing-page">
            <div className="products-grid">
                {products && products.map(product => (
                    <div key={product.id} className="product-card">
                        <div className="product-image-container">
                            <div className="product-image">
                                <img src={product.image} alt={product.title} />
                            </div>
                        </div>
                        <div className="product-info">
                            <h3 className="product-title">{product.title}</h3>
                            <p className="product-description">{product.description}</p>
                            <p className="product-price">Rs. {product.price.toFixed(2)}</p>

                            <div className="variant-selectors">
                                {product.variants?.colors?.length > 0 && (
                                    <div className="variant-group">
                                        <label>Color:</label>
                                        <select
                                            onChange={(e) => handleVariantChange(product.id, 'color', e.target.value)}
                                            value={selectedVariants[product.id]?.color || ''}
                                        >
                                            <option value="">Select Color</option>
                                            {product.variants.colors.map(color => (
                                                <option key={color} value={color}>{color}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {product.variants?.sizes?.length > 0 && (
                                    <div className="variant-group">
                                        <label>Size:</label>
                                        <select
                                            onChange={(e) => handleVariantChange(product.id, 'size', e.target.value)}
                                            value={selectedVariants[product.id]?.size || ''}
                                        >
                                            <option value="">Select Size</option>
                                            {product.variants.sizes.map(size => (
                                                <option key={size} value={size}>{size}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="variant-group">
                                    <label>Quantity:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={selectedVariants[product.id]?.quantity || 1}
                                        onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="product-actions">
                                <button
                                    className="buy-now-button"
                                    onClick={() => handleBuyNow(product.id)}
                                >
                                    Buy Now
                                </button>
                                <button
                                    className="add-to-cart-button"
                                    onClick={() => handleAddToCart(product)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="view-all-container">
                <button className="view-all-button" onClick={() => navigate('/catalog')}>View all</button>
            </div>
        </div>
    );
};

export default LandingPage; 