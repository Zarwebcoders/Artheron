import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import {
    ArrowDown,
    Wallet,
    ShieldCheck,
    TrendingUp,
    Zap,
    QrCode,
    Copy,
    Upload,
    CheckCircle2,
    Info,
    CreditCard,
    ArrowRight,
    RefreshCw
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';

import API from '../api/axios';

const BuyToken = () => {
    const { balances, updateBalances } = useAuth();
    const { account, balance, isConnecting, connectWallet, contract, provider } = useWallet();
    const [buyMode, setBuyMode] = useState('manual');
    const [amount, setAmount] = useState('');
    const [autoAmount, setAutoAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('usdt');
    const [step, setStep] = useState(1);
    const [isSuccess, setIsSuccess] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [proofFile, setProofFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const tokenPrice = 0.045; // 1 ARTH = $0.045

    const handleAutoBuy = async () => {
        if (!account) return connectWallet();
        if (!autoAmount || parseFloat(autoAmount) <= 0) return;

        setIsLoading(true);
        setError('');

        try {
            if (!provider || !contract) {
                console.error("Wallet objects missing:", { provider, contract });
                throw new Error("Wallet not initialized. Please reconnect your wallet.");
            }

            // Calculate the value to send to the contract based on autoAmount
            // Exchange Rate: 0.0001 ETH per 1 ARTH
            const pricePerToken = 0.0001;
            const totalValue = (parseFloat(autoAmount) * pricePerToken).toFixed(18);
            const totalValueWei = ethers.parseEther(totalValue);

            console.log("Initiating Web3 Purchase:", { amount: autoAmount, value: totalValue });

            // Execute the contract call
            let tx;
            try {
                tx = await contract.buyTokens({
                    value: totalValueWei
                });
            } catch (estError) {
                console.warn("Gas estimation failed, bypassing with manual limit...", estError);
                // Fallback: Manually set gas limit if estimation fails (common if contract reverts)
                tx = await contract.buyTokens({
                    value: totalValueWei,
                    gasLimit: 120000
                });
            }

            const receipt = await tx.wait();

            if (receipt.status === 1) {
                // Record in backend via our API engine
                await API.post('/tx/auto-buy', {
                    amount: autoAmount,
                    txHash: receipt.hash
                });

                setIsSuccess(true);
                updateBalances();
                setTimeout(() => {
                    setIsSuccess(false);
                    setAutoAmount('');
                }, 3000);
            }
        } catch (err) {
            console.error("Web3 Purchase Error:", err);

            let errorMessage = 'Protocol Error: Node Communication Interrupted';

            if (err.message?.includes('user rejected')) {
                errorMessage = 'Transaction Cancelled by User';
            } else if (err.code === 'INSUFFICIENT_FUNDS') {
                errorMessage = 'Insufficient ETH for transaction + gas';
            } else if (err.code === 'CALL_EXCEPTION') {
                errorMessage = 'Contract Revert: Ensure the protocol has ARTH liquidity and you are on the correct network.';
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        }
        setIsLoading(false);
    };

    const paymentMethods = [
        { id: 'usdt', name: 'USDT (BEP20)', icon: <TrendingUp size={18} />, color: '#26A17B', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
        { id: 'btc', name: 'Bitcoin', icon: <Zap size={18} />, color: '#F7931A', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
        { id: 'eth', name: 'Ethereum', icon: <Zap size={18} />, color: '#627EEA', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
        { id: 'upi', name: 'UPI / Bank', icon: <CreditCard size={18} />, color: '#6B7280', address: 'artheron@upi' },
    ];

    const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);

    useEffect(() => {
        gsap.fromTo(".buy-card",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power2.out" }
        );
    }, [step]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const handleProceed = () => {
        if (!amount || parseFloat(amount) <= 0) return;
        setStep(2);
    };

    const handleSubmitProof = async () => {
        if (!proofFile) return setError('Please upload payment proof');

        setIsLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('amount', (parseFloat(amount) / tokenPrice).toFixed(0)); // Convert USD to ARTH
        formData.append('method', selectedMethod.name);
        formData.append('proof', proofFile);

        try {
            const res = await API.post('/tx/buy', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false);
                    setStep(1);
                    setAmount('');
                    setProofFile(null);
                }, 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Submission failed');
        }
        setIsLoading(false);
    };

    return (
        <div className="p-6 lg:p-10 space-y-10 relative">

            {/* Success Overlay */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07010f]/90 backdrop-blur-xl"
                    >
                        <div className="text-center">
                            <div className="w-24 h-24 mx-auto rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                                <CheckCircle2 size={48} className="text-green-500" />
                            </div>
                            <h2 className="text-4xl font-bold font-heading mb-4 uppercase tracking-tighter">Request <span className="text-green-500">Submitted</span></h2>
                            <p className="text-gray-400 max-w-sm mx-auto font-light leading-relaxed">Your payment proof is being verified by the Artheron Oracle. ARTH tokens will be credited shortly.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold font-heading mb-1 uppercase tracking-tight">
                        LIQUIDITY <span className="text-gradient">GATEWAY</span>
                    </h1>
                    <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase bg-white/5 py-1 px-3 rounded-full border border-white/5 inline-block">
                        Current Price: $0.045 / ARTH
                    </p>
                </motion.div>

                {account ? (
                    <div className="flex items-center gap-4 bg-[#0A0319]/50 border border-white/5 rounded-2xl px-5 py-3 backdrop-blur-xl">
                        <div className="text-right">
                            <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mb-1">Asset Balance</p>
                            <p className="text-sm font-mono font-bold text-[#22d3ee]">{parseFloat(balance).toLocaleString()} ARTH</p>
                        </div>
                        <div className="h-8 w-px bg-white/10"></div>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7b3fe4] to-[#22d3ee] flex items-center justify-center text-white shadow-lg">
                                <Wallet size={18} />
                            </div>
                            <div>
                                <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mb-0.5">Connected Node</p>
                                <p className="text-[10px] font-mono text-white/70">{account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={connectWallet}
                        disabled={isConnecting}
                        className="bg-white text-black px-8 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center gap-2 group"
                    >
                        <Wallet size={16} />
                        {isConnecting ? 'Initializing...' : 'Link Wallet'}
                    </button>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-10 items-start">
                {/* Main Purchase Card */}
                <div className="lg:col-span-2 space-y-8">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="buy-card glass-panel p-10 rounded-[2.5rem] border border-white/5 bg-[#0A0319]/60 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#22d3ee] rounded-full mix-blend-screen filter blur-[100px] opacity-[0.05] pointer-events-none"></div>

                                <div className="relative z-10 space-y-10">
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[#22d3ee]/10 border border-[#22d3ee]/20 flex items-center justify-center text-[#22d3ee] glow-blue">
                                                <Wallet size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold font-heading uppercase tracking-tighter text-white">Purchase ARTH Tokens</h2>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Secure Institutional Layer</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => setBuyMode('manual')}
                                                className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${buyMode === 'manual' ? 'bg-[#22d3ee] text-black shadow-lg rounded-lg' : 'text-gray-500 hover:text-white'}`}
                                            >Manual</button>
                                            <button
                                                onClick={() => setBuyMode('automatic')}
                                                className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${buyMode === 'automatic' ? 'bg-[#7b3fe4] text-white shadow-lg rounded-lg' : 'text-gray-500 hover:text-white'}`}
                                            >Automatic</button>
                                        </div>
                                    </div>

                                    {buyMode === 'automatic' ? (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                            <div className="relative">
                                                <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-3 block">Token Amount (ARTH)</label>
                                                <input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={autoAmount}
                                                    onChange={(e) => setAutoAmount(e.target.value)}
                                                    className="w-full bg-[#050814]/50 border border-white/5 rounded-3xl py-10 px-8 text-5xl font-mono text-white outline-none focus:border-[#7b3fe4]/30 transition-all font-bold placeholder:text-gray-900"
                                                />
                                            </div>

                                            <div className="bg-[#7b3fe4]/5 border border-[#7b3fe4]/10 rounded-[2rem] p-8 space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Protocol Engine</span>
                                                    <span className="text-[10px] text-[#22d3ee] font-bold uppercase tracking-widest bg-[#22d3ee]/10 px-3 py-1 rounded-lg">Web3 Direct</span>
                                                </div>
                                                <p className="text-xs text-gray-400 leading-relaxed font-light">By clicking "Initiate Web3 Purchase", you will execute a smart contract transaction. ARTH tokens will be minted directly to your connected wallet address.</p>
                                            </div>

                                            <button
                                                onClick={handleAutoBuy}
                                                disabled={isLoading || !autoAmount || parseFloat(autoAmount) <= 0}
                                                className="w-full py-6 rounded-3xl bg-gradient-to-r from-[#7b3fe4] to-[#22d3ee] text-white font-bold uppercase tracking-widest text-[10px] shadow-[0_0_30px_rgba(123,63,228,0.4)] hover:shadow-[0_0_50px_rgba(34,211,238,0.5)] transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-20 flex items-center justify-center gap-3 group"
                                            >
                                                {isLoading ? <RefreshCw size={18} className="animate-spin" /> : <><ShieldCheck size={20} /> <span>Initiate Web3 Purchase</span></>}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
                                            <div className="space-y-6">
                                                <div className="relative">
                                                    <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold mb-3 block">Amount in USD</label>
                                                    <input
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={amount}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                        className="w-full bg-[#050814]/50 border border-white/5 rounded-3xl py-10 px-8 text-5xl font-mono text-white outline-none focus:border-[#22d3ee]/30 transition-all font-bold placeholder:text-gray-800"
                                                    />
                                                    <div className="absolute right-8 bottom-8 flex items-center gap-2 text-[#22d3ee] font-bold text-sm bg-[#22d3ee]/10 px-3 py-1 rounded-lg border border-[#22d3ee]/20">
                                                        USD
                                                    </div>
                                                </div>
                                                <div className="bg-white/5 border border-white/5 rounded-3xl p-8 flex justify-between items-center group hover:bg-white/[0.08] transition-all">
                                                    <div>
                                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Estimated Receipt</p>
                                                        <h3 className="text-4xl font-bold font-mono text-white">
                                                            {amount ? (parseFloat(amount) / tokenPrice).toFixed(0).toLocaleString() : '0'}
                                                            <span className="text-sm text-gray-600 font-light ml-3">ARTH</span>
                                                        </h3>
                                                    </div>
                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7b3fe4] to-[#22d3ee] p-[1px]">
                                                        <div className="w-full h-full bg-[#0A0319] rounded-2xl flex items-center justify-center text-white font-bold text-xs uppercase tracking-tighter">PRO</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold block">Settlement Method</label>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {paymentMethods.map((method) => (
                                                        <button
                                                            key={method.id}
                                                            onClick={() => setPaymentMethod(method.id)}
                                                            className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 group ${paymentMethod === method.id ? 'bg-white/10 border-white/20 shadow-lg' : 'bg-white/[0.02] border-white/5 opacity-50 hover:opacity-100'}`}
                                                        >
                                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ backgroundColor: paymentMethod === method.id ? method.color : 'transparent', color: paymentMethod === method.id ? '#fff' : method.color }}>
                                                                {method.icon}
                                                            </div>
                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-white">{method.name.split(' ')[0]}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleProceed}
                                                disabled={!amount || parseFloat(amount) <= 0}
                                                className="w-full py-6 rounded-3xl bg-gradient-to-r from-[#22d3ee] to-[#7b3fe4] text-white font-bold uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_60px_rgba(123,63,228,0.5)] transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-30 disabled:hover:scale-100 flex items-center justify-center gap-3 group"
                                            >
                                                <span>Proceed to Settlement</span>
                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="buy-card glass-panel p-10 rounded-[2.5rem] border border-white/5 bg-[#0A0319]/60 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full mix-blend-screen filter blur-[100px] opacity-[0.05] pointer-events-none"></div>

                                <div className="relative z-10 space-y-10">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setStep(1)}
                                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                                            >
                                                <ArrowRight size={20} className="rotate-180" />
                                            </button>
                                            <div>
                                                <h2 className="text-xl font-bold font-heading uppercase tracking-tighter text-white text-gradient">Payment Channel</h2>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Artheron Treasury Direct</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Due</p>
                                            <p className="text-2xl font-bold font-mono text-white">${amount}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-[#050814]/50 p-8 rounded-[2rem] border border-white/5">
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="p-4 bg-white rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                                                <QrCode size={160} className="text-black" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] text-gray-500 uppercase tracking-[0.25em] font-bold mb-1">Scan to Pay</p>
                                                <p className="text-[8px] text-gray-700 font-mono uppercase">Official Artheron Node QR</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold ml-1">Merchant Address</label>
                                                <div className="relative group">
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={selectedMethod.address}
                                                        className="w-full bg-[#07010f] border border-white/5 rounded-2xl py-4 pl-4 pr-12 text-xs font-mono text-white/70 outline-none"
                                                    />
                                                    <button
                                                        onClick={() => handleCopy(selectedMethod.address)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 transition-all active:scale-95"
                                                    >
                                                        {copySuccess ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="bg-[#12052b] p-5 rounded-2xl border border-[#7b3fe4]/20 space-y-2">
                                                <div className="flex items-center gap-2 text-[#7b3fe4] font-bold text-[10px] uppercase tracking-widest">
                                                    <Info size={14} /> Network Notice
                                                </div>
                                                <p className="text-[10px] text-gray-400 leading-relaxed font-light">
                                                    Send exactly <span className="text-white font-bold">${amount} {selectedMethod.name.split(' ')[0]}</span> via <span className="text-white font-bold">{selectedMethod.name.includes('BEP20') ? 'BNB Chain' : selectedMethod.name}</span>.
                                                    Incorrect network may lead to asset loss.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-px flex-grow bg-white/5"></div>
                                            <span className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">Deposit Verification</span>
                                            <div className="h-px flex-grow bg-white/5"></div>
                                        </div>

                                        {error && (
                                            <div className="flex items-center gap-2 text-red-500 bg-red-500/5 p-4 rounded-2xl border border-red-500/10 text-xs font-bold uppercase tracking-widest">
                                                <Info size={16} /> {error}
                                            </div>
                                        )}

                                        <div className="relative group">
                                            <div className={`bg-[#050814]/50 border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer ${proofFile ? 'border-green-500/50 bg-green-500/5' : 'border-white/5 group-hover:border-[#22d3ee]/30'}`}>
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${proofFile ? 'bg-green-500/10 text-green-500' : 'bg-[#22d3ee]/10 text-[#22d3ee]'}`}>
                                                    {proofFile ? <CheckCircle2 size={24} /> : <Upload size={24} />}
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs text-white font-bold uppercase tracking-widest">
                                                        {proofFile ? proofFile.name : 'Upload Screenshot'}
                                                    </p>
                                                    <p className="text-[10px] text-gray-600 mt-1 uppercase">
                                                        {proofFile ? `${(proofFile.size / 1024 / 1024).toFixed(2)} MB` : 'JPG, PNG, PDF up to 5MB'}
                                                    </p>
                                                </div>
                                            </div>
                                            <input
                                                type="file"
                                                onChange={(e) => setProofFile(e.target.files[0])}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>

                                        <button
                                            onClick={handleSubmitProof}
                                            disabled={isLoading || !proofFile}
                                            className="w-full py-6 rounded-3xl bg-gradient-to-r from-green-500 to-[#22d3ee] text-white font-bold uppercase tracking-widest text-[10px] shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-30"
                                        >
                                            {isLoading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <span>Submit Transmission Proof</span>
                                                    <Zap size={18} className="group-hover:animate-pulse" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar - Support/Stats */}
                <div className="space-y-8">
                    <div className="buy-card glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-[#0A0319]/80 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#22d3ee] rounded-full mix-blend-screen filter blur-[60px] opacity-[0.1]"></div>

                        <div className="relative z-10 flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#22d3ee]">
                                    <ShieldCheck size={20} />
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-tighter">Secured Node</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                    <span>System Status</span>
                                    <span className="text-[#22d3ee] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] animate-pulse"></span> Optimal</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                    <span>Oracle Delay</span>
                                    <span className="text-white">~ 2-5 min</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="buy-card glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-[#12052b] to-[#0A0319] relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Market Intel</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex-grow">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Buy Volume (24h)</p>
                                        <p className="text-xl font-bold font-mono text-white">$4.28M</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-green-500">
                                        <ArrowRight size={20} className="-rotate-45" />
                                    </div>
                                </div>
                                <div className="h-px bg-white/5"></div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-grow">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Total Minted</p>
                                        <p className="text-xl font-bold font-mono text-white">82.5M <span className="text-xs text-gray-700 tracking-tighter">ARTH</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyToken;
