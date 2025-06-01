import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthPages.css';

const SignInPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signin } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Get the redirect path from location state, default to home
    const from = location.state?.from || '/';

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const result = await signin(formData);
            if (result.success) {
                // Navigate to the redirect path after successful login
                navigate(from);
            } else {
                setErrors({ submit: result.error });
            }
        } catch (error) {
            setErrors({ submit: 'An error occurred during sign in' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-box">
                <h2>Sign In</h2>
                {errors.submit && <div className="error-message">{errors.submit}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <button type="submit" className="auth-button" disabled={isLoading}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                <p className="auth-switch">
                    Don't have an account? <span onClick={() => navigate('/signup', { state: { from } })}>Create One</span>
                </p>
            </div>
        </div>
    );
};

export default SignInPage; 