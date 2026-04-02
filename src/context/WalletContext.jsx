import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import ArtheronContract from '../contracts/Artheron.json';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState('0');
    const [isConnecting, setIsConnecting] = useState(false);
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [isOwner, setIsOwner] = useState(false);

    const updateBalance = useCallback(async (userAddress, tokenContract) => {
        try {
            const rawBalance = await tokenContract.balanceOf(userAddress);
            const decimals = await tokenContract.decimals();
            setBalance(ethers.formatUnits(rawBalance, decimals));
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    }, []);

    const checkIfOwner = useCallback(async (userAddress, tokenContract) => {
        try {
            const ownerAddress = await tokenContract.owner();
            setIsOwner(userAddress.toLowerCase() === ownerAddress.toLowerCase());
        } catch (error) {
            console.error("Error checking owner:", error);
        }
    }, []);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("MetaMask is not installed!");
            return;
        }

        setIsConnecting(true);
        try {
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await browserProvider.send("eth_requestAccounts", []);
            const signer = await browserProvider.getSigner();
            const address = accounts[0];

            setAccount(address);
            setProvider(browserProvider);

            const tokenContract = new ethers.Contract(
                ArtheronContract.address,
                ArtheronContract.abi,
                signer
            );
            setContract(tokenContract);

            await updateBalance(address, tokenContract);
            await checkIfOwner(address, tokenContract);

            localStorage.setItem('artheron_wallet', address);
        } catch (error) {
            console.error("Failed to connect wallet", error);
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setBalance('0');
        setContract(null);
        setIsOwner(false);
        localStorage.removeItem('artheron_wallet');
    };

    // Auto-connect if already connected
    useEffect(() => {
        const init = async () => {
            if (window.ethereum && localStorage.getItem('artheron_wallet')) {
                try {
                    const browserProvider = new ethers.BrowserProvider(window.ethereum);
                    const signer = await browserProvider.getSigner();
                    const address = await signer.getAddress();
                    
                    setAccount(address);
                    setProvider(browserProvider);

                    const tokenContract = new ethers.Contract(
                        ArtheronContract.address,
                        ArtheronContract.abi,
                        signer
                    );
                    setContract(tokenContract);

                    await updateBalance(address, tokenContract);
                    await checkIfOwner(address, tokenContract);
                } catch (e) {
                    console.error("Auto-connect failed", e);
                }
            }
        };
        init();

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    window.location.reload();
                } else {
                    disconnectWallet();
                }
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }
    }, [updateBalance, checkIfOwner]);

    return (
        <WalletContext.Provider value={{
            account,
            balance,
            isConnecting,
            isOwner,
            contract,
            provider,
            connectWallet,
            disconnectWallet,
            refreshBalance: () => account && contract && updateBalance(account, contract)
        }}>
            {children}
        </WalletContext.Provider>
    );
};
