import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [lastAddedItem, setLastAddedItem] = useState(null);

    const addToCart = (product, selectedVariants) => {
        const newItem = {
            product,
            quantity: selectedVariants?.quantity || 1,
            selectedSize: selectedVariants?.size || product.variants?.sizes[0] || 'OS',
            selectedColor: selectedVariants?.color || product.variants?.colors[0] || 'Default'
        };

        setCartItems(prev => {
            // Check if the item already exists with the same variants
            const existingItemIndex = prev.findIndex(item =>
                item.product.id === product.id &&
                item.selectedSize === newItem.selectedSize &&
                item.selectedColor === newItem.selectedColor
            );

            if (existingItemIndex !== -1) {
                // Update quantity if item exists
                const updatedItems = [...prev];
                updatedItems[existingItemIndex].quantity += newItem.quantity;
                return updatedItems;
            }

            // Add new item if it doesn't exist
            return [...prev, newItem];
        });

        setLastAddedItem(newItem);
        setShowNotification(true);

        // Hide notification after 3 seconds
        setTimeout(() => {
            setShowNotification(false);
        }, 3000);
    };

    const updateQuantity = (productId, newQuantity) => {
        setCartItems(prev =>
            prev.map(item =>
                item.product.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.product.id !== productId));
    };

    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            updateQuantity,
            removeFromCart,
            getCartCount,
            showNotification,
            lastAddedItem,
            setShowNotification
        }}>
            {children}
        </CartContext.Provider>
    );
}; 