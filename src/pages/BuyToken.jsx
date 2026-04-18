import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import {
    TrendingUp,
    Wallet,
    ArrowRight,
    ShieldCheck,
    RefreshCw,
    Zap,
    QrCode,
    Info,
    Copy,
    CheckCircle2,
    Upload,
    CreditCard
} from 'lucide-react';

import API from '../api/axios';

const BuyToken = () => {
    const { balances, updateBalances } = useAuth();
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('usdt');
    const [step, setStep] = useState(1);
    const [isSuccess, setIsSuccess] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [proofFile, setProofFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [marketStats, setMarketStats] = useState({ buyVolumeUSD: 4280000, totalMinted: 82500000 });

    const tokenPrice = 0.010417; // 1 ARTH = $0.010417 ($1 = 96 ARTH)

    const paymentMethods = [
        { id: 'usdt', name: 'USDT (BEP20)', icon: <TrendingUp size={18} />, color: '#26A17B', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
        { id: 'btc', name: 'Bitcoin', icon: <Zap size={18} />, color: '#F7931A', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
        { id: 'eth', name: 'Ethereum', icon: <Zap size={18} />, color: '#627EEA', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
        { id: 'upi', name: 'UPI / Bank', icon: <CreditCard size={18} />, color: '#6B7280', address: 'artheron@upi' },
    ];

    const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get('/tx/stats');
                if (res.data.success) {
                    setMarketStats(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch market stats", err);
            }
        };
        fetchStats();

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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-4 bg-[#7b3fe4]/5 border border-[#7b3fe4]/50 px-6 py-4 rounded-[1rem] shadow-2xl backdrop-blur-xl">
                        <div className="w-12 h-12 rounded-2xl bg-[#7b3fe4]/10 flex items-center justify-center text-[#7b3fe4] shadow-inner border border-[#7b3fe4]/20">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Live Asset Value</p>
                            <p className="text-2xl font-bold font-mono text-white tracking-widest leading-none flex items-baseline gap-1">
                                $0.0104 <span className="text-xs text-gray-500 font-bold uppercase">/ ARTH</span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid lg:grid-cols-3 gap-10 items-start">
                {/* Main Purchase Card */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-panel p-8 lg:p-8 rounded-[1rem] border border-white/50! bg-[#0A0319]/50 space-y-12 relative overflow-hidden group">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#7b3fe4]/10 blur-[100px] pointer-events-none group-hover:bg-[#7b3fe4]/15 transition-all"></div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#7b3fe4]/10 border border-[#7b3fe4]/20 flex items-center justify-center text-[#7b3fe4]">
                                    <Wallet size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold font-heading uppercase text-white tracking-tight">Purchase <span className="text-gradient">ARTH TOKENS</span></h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Secure Institutional Layer</p>
                                </div>
                            </div>
                        </div>
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                                <div className="space-y-8">
                                    {/* Amount Input */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest px-1">Amount in USD</label>
                                        <div className="relative group">
                                            <input 
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full bg-[#050814]/50 border border-white/50 rounded-3xl py-6 px-6 text-5xl font-mono text-white outline-none focus:border-[#22d3ee]/30 transition-all font-bold placeholder:text-gray-900 shadow-inner"
                                            />
                                            <div className="absolute right-8 bottom-8 flex items-center gap-2 text-[#22d3ee] font-bold text-sm bg-[#22d3ee]/10 px-3 py-1 rounded-lg border border-[#22d3ee]/20">
                                                USD
                                            </div>
                                        </div>
                                        <div className="bg-white/5 border border-white/50 rounded-3xl p-6 flex justify-between items-center group hover:bg-white/[0.08] transition-all">
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Estimated Arth Receipt</p>
                                                <h3 className="text-4xl font-bold font-mono text-white">
                                                    {amount ? (parseFloat(amount) / tokenPrice).toFixed(0).toLocaleString() : '0'}
                                                    <span className="text-sm text-gray-600 font-light ml-3">ARTH</span>
                                                </h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Method Selection */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold block">Settlement Method</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {['USDT', 'Bitcoin', 'Ethereum', 'UPI'].map((method) => (
                                                <button 
                                                    key={method}
                                                    onClick={() => setPaymentMethod(method.toLowerCase())}
                                                    className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 group relative overflow-hidden ${paymentMethod === method.toLowerCase() ? 'bg-[#7b3fe4]/10 border-[#7b3fe4]/40 text-white' : 'bg-white/5 border-white/20 text-gray-500 hover:border-white/50'}`}
                                                >
                                                    {paymentMethod === method.toLowerCase() && <motion.div layoutId="methodBg" className="absolute inset-0 bg-[#7b3fe4]/5 pointer-events-none" />}
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${paymentMethod === method.toLowerCase() ? 'bg-[#7b3fe4] text-white shadow-lg shadow-[#7b3fe4]/20' : 'bg-white/5 text-gray-500 group-hover:scale-110'}`}>
                                                        {method === 'USDT' && <TrendingUp size={20} />}
                                                        {method === 'Bitcoin' && <Zap size={20} className="text-orange-500" />}
                                                        {method === 'Ethereum' && <Zap size={20} className="text-indigo-400" />}
                                                        {method === 'UPI' && <CreditCard size={20} />}
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{method}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setStep(2)}
                                    disabled={!amount || parseFloat(amount) <= 0}
                                    className="w-full py-6 rounded-3xl bg-white text-black font-bold uppercase tracking-[0.4em] text-xs shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:shadow-[0_0_70px_rgba(255,255,255,0.2)] hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
                                >
                                    Confirm
                                    <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-2 transition-transform" />
                                </button>
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
            </div>

            {/* Sidebar - Support/Stats */}
            <div className="space-y-8">


                    <div className="buy-card glass-panel p-6 rounded-[1rem] border border-white/50! bg-gradient-to-br from-[#12052b] to-[#0A0319] relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Market Intel</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex-grow">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Buy Volume (24h)</p>
                                        <p className="text-xl font-bold font-mono text-white">
                                            ${(marketStats.buyVolumeUSD / 1000000).toFixed(2)}M
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-green-500">
                                        <TrendingUp size={20} className="scale-x-[-1] rotate-[135deg]" />
                                    </div>
                                </div>
                                <div className="h-px bg-white/5"></div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-grow">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Total Minted</p>
                                        <p className="text-xl font-bold font-mono text-white">
                                            {(marketStats.totalMinted / 1000000).toFixed(1)}M <span className="text-xs text-gray-700 tracking-tighter">ARTH</span>
                                        </p>
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
