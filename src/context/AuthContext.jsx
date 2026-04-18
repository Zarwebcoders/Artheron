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

    const login = async (accountNumber, password) => {
        try {
            const res = await API.post('/auth/login', { accountNumber, password });
            if (res.data.success) {
                if (res.data.require2FA) {
                    return { success: true, require2FA: true, email: res.data.email };
                }
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

    const verify2FA = async (accountNumber, otp) => {
        try {
            const res = await API.post('/auth/verify-2fa', { accountNumber, otp });
            if (res.data.success) {
                const { token, user: userData } = res.data;
                localStorage.setItem('artheron_token', token);
                setUser(userData);
                setBalances(userData.balances);
                return { success: true, role: userData.role };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Invalid code' };
        }
    };

    const toggle2FA = async () => {
        try {
            const res = await API.put('/auth/toggle-2fa');
            if (res.data.success) {
                setUser(prev => ({ ...prev, is2FAEnabled: res.data.is2FAEnabled }));
                return { success: true, is2FAEnabled: res.data.is2FAEnabled };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Update failed' };
        }
    };

    const forgotPassword = async (email) => {
        try {
            const res = await API.post('/auth/forgot-password', { email });
            return { success: res.data.success, message: res.data.message };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Request failed' };
        }
    };

    const resetPassword = async (token, password) => {
        try {
            const res = await API.put(`/auth/reset-password/${token}`, { password });
            if (res.data.success) {
                const { token: jwtToken, user: userData } = res.data;
                localStorage.setItem('artheron_token', jwtToken);
                setUser(userData);
                setBalances(userData.balances);
                return { success: true };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Reset failed' };
        }
    };

    const updatePassword = async (currentPassword, newPassword, confirmPassword) => {
        try {
            const res = await API.put('/auth/update-password', { 
                currentPassword, 
                newPassword, 
                confirmPassword 
            });
            return { success: res.data.success, message: res.data.message };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Update failed' };
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
            verify2FA,
            toggle2FA,
            forgotPassword,
            resetPassword,
            updatePassword,
            logout, 
            isAdmin, 
            loading,
            updateBalances 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
