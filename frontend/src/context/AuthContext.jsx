import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data.user);
            }
        } catch (error) {
            console.error('Auth status check failed:', error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const signup = async (userData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', userData);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            setError(null);
            return { success: true };
        } catch (error) {
            setError(error.response?.data?.message || 'Signup failed');
            return { success: false, error: error.response?.data?.message || 'Signup failed' };
        }
    };

    const signin = async (credentials) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/signin', credentials);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            setError(null);
            return { success: true };
        } catch (error) {
            setError(error.response?.data?.message || 'Sign in failed');
            return { success: false, error: error.response?.data?.message || 'Sign in failed' };
        }
    };

    const signout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setError(null);
    };

    const value = {
        user,
        loading,
        error,
        signup,
        signin,
        signout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}; 