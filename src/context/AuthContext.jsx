import React, { createContext, useContext, useState, useEffect } from 'react';

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

    useEffect(() => {
        // Mock session check
        const savedUser = localStorage.getItem('artheron_user');
        const savedBalances = localStorage.getItem('artheron_balances');
        
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        if (savedBalances) {
            setBalances(JSON.parse(savedBalances));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        // Initial mock balances for a new PRO user
        const initialBalances = {
            tokenBalance: 5000,
            stakeBalance: 1200,
            incomeBalance: 150,
            lockedBalance: 0
        };
        setBalances(initialBalances);
        localStorage.setItem('artheron_user', JSON.stringify(userData));
        localStorage.setItem('artheron_balances', JSON.stringify(initialBalances));
    };

    const logout = () => {
        setUser(null);
        setBalances({
            tokenBalance: 0,
            stakeBalance: 0,
            incomeBalance: 0,
            lockedBalance: 0
        });
        localStorage.removeItem('artheron_user');
        localStorage.removeItem('artheron_balances');
    };

    const isAdmin = user?.role === 'admin';

    const updateBalances = (newBalances) => {
        const updated = { ...balances, ...newBalances };
        setBalances(updated);
        localStorage.setItem('artheron_balances', JSON.stringify(updated));
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            balances, 
            login, 
            logout, 
            isAdmin, 
            loading,
            updateBalances 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
