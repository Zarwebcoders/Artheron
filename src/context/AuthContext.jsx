import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [balances, setBalances] = useState({
        tokenBalance: 0,
        stakeBalance: 0,
        incomeBalance: 0,
        lockedBalance: 0
    });
    const [loading, setLoading] = useState(true);

    const checkStatus = async () => {
        const token = localStorage.getItem('artheron_token');
        if (token) {
            try {
                const res = await API.get('/auth/me');
                if (res.data.success) {
                    const userData = res.data.data;
                    setUser(userData);
                    setBalances(userData.balances);
                }
            } catch (err) {
                console.error("Session check failed", err);
                logout();
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        checkStatus();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await API.post('/auth/login', { email, password });
            if (res.data.success) {
                const { token, user: userData } = res.data;
                localStorage.setItem('artheron_token', token);
                setUser(userData);
                setBalances(userData.balances);
                return { success: true, role: userData.role };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await API.post('/auth/register', { name, email, password });
            if (res.data.success) {
                // Success now means OTP was sent
                return { success: true, message: res.data.message };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Registration failed' };
        }
    };

    const verifyOTP = async (email, otp) => {
        try {
            const res = await API.post('/auth/verify-otp', { email, otp });
            if (res.data.success) {
                const { token, user: userData } = res.data;
                localStorage.setItem('artheron_token', token);
                setUser(userData);
                setBalances(userData.balances);
                return { success: true };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Verification failed' };
        }
    };

    const resendOTP = async (email) => {
        try {
            const res = await API.post('/auth/resend-otp', { email });
            return { success: res.data.success, message: res.data.message };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Resend failed' };
        }
    };

    const logout = () => {
        setUser(null);
        setBalances({
            tokenBalance: 0,
            stakeBalance: 0,
            incomeBalance: 0,
            lockedBalance: 0
        });
        localStorage.removeItem('artheron_token');
    };

    const isAdmin = user?.role === 'admin';

    const updateBalances = async () => {
        // Fetch fresh balances from backend
        try {
            const res = await API.get('/auth/me');
            if (res.data.success) {
                setBalances(res.data.data.balances);
            }
        } catch (err) {
            console.error("Balance update failed", err);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            balances, 
            login, 
            register,
            verifyOTP,
            resendOTP,
            logout, 
            isAdmin, 
            loading,
            updateBalances 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
