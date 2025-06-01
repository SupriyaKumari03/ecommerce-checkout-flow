// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage.js';
import CatalogPage from './pages/CatalogPage.js';
import CartPage from './pages/CartPage.js';
import CheckoutPage from './pages/CheckoutPage.js';
import ThankYouPage from './pages/ThankYouPage.js';
import ContactPage from './pages/ContactPage.js';
import SignUpPage from './pages/SignUpPage.jsx';
import SignInPage from './pages/SignInPage.jsx';
import CartNotification from './components/CartNotification';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <Header />
          <CartNotification />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/thank-you/:orderNumber" element={<ThankYouPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
          </Routes>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
