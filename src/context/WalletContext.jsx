import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState('0');
    const [isConnecting, setIsConnecting] = useState(false);

    // Mock checking if wallet is connected
    useEffect(() => {
        const savedAccount = localStorage.getItem('artheron_wallet');
        if (savedAccount) {
            setAccount(savedAccount);
            setBalance('12500'); // Mock ARTH balance
        }
    }, []);

    const connectWallet = async () => {
        setIsConnecting(true);
        try {
            // In a real Web3 app, we would use window.ethereum.request({ method: 'eth_requestAccounts' })
            // For this UI demo, we'll mock the connection after a slight delay
            await new Promise(resolve => setTimeout(resolve, 800));

            const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
            setAccount(mockAddress);
            setBalance('12500');
            localStorage.setItem('artheron_wallet', mockAddress);
        } catch (error) {
            console.error("Failed to connect wallet", error);
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setBalance('0');
        localStorage.removeItem('artheron_wallet');
    };

    return (
        <WalletContext.Provider value={{
            account,
            balance,
            isConnecting,
            connectWallet,
            disconnectWallet
        }}>
            {children}
        </WalletContext.Provider>
    );
};
