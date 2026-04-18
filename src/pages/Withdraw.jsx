import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import { 
    ArrowUpRight, 
    Wallet, 
    ShieldCheck, 
    Info, 
    CheckCircle2, 
    AlertCircle,
    Globe,
    Zap,
    Coins,
    ChevronDown
} from 'lucide-react';

import API from '../api/axios';

const Withdraw = () => {
    const { balances, updateBalances } = useAuth();
    const [withdrawType, setWithdrawType] = useState('ARTH'); // 'ARTH' or 'USDT'
    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('');
    const [network, setNetwork] = useState('BSC (BEP-20)');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const activeBalance = balances.tokenBalance;
    const ARTH_PRICE = 0.010417;
    const fee = withdrawType === 'ARTH' ? 0 : 1; // 0 ARTH or 1 USDT fee
    const grossValue = withdrawType === 'ARTH' ? parseFloat(amount || 0) : (parseFloat(amount || 0) * ARTH_PRICE);
    const netSettlement = Math.max(0, grossValue - fee);
    
    useEffect(() => {
        updateBalances();
        gsap.fromTo(".withdraw-card", 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: "power3.out" }
        );
    }, [withdrawType]);

    const handleWithdraw = async () => {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0 || val + fee > activeBalance || !address) return;

        setIsProcessing(true);
        setError('');
        
        try {
            const res = await API.post('/tx/withdraw', {
                amount: val,
                currency: withdrawType,
                walletAddress: address
            });

            if (res.data.success) {
                setIsSuccess(true);
                updateBalances();
                setAmount('');
                setAddress('');
                setTimeout(() => setIsSuccess(false), 4000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Withdrawal failed');
        }
        setIsProcessing(false);
    };

    const setPercentage = (p) => {
        const calc = (activeBalance * p) - fee;
        setAmount(Math.max(0, calc).toFixed(2));
    };

    return (
        <div className="p-6 lg:p-6 space-y-10 relative min-h-[calc(100vh-80px)]">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-[#7b3fe4] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.03] pointer-events-none"></div>
            <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-[#22d3ee] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.03] pointer-events-none"></div>

            {/* Success Notification */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div 
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="fixed top-24 right-10 z-[60] bg-[#22C55E] text-white px-8 py-5 rounded-[2rem] shadow-[0_20px_50px_rgba(34,197,94,0.3)] flex items-center gap-4 border border-white/20 backdrop-blur-xl"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="font-bold uppercase tracking-[0.2em] text-[10px]">Transaction Successful</p>
                            <p className="text-xs text-white/80">Withdrawal request transmitted to node</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-[100vh]">
                    <div className="flex items-start gap-5 p-6 bg-yellow-500/5 rounded-[1rem] border border-yellow-500/50 mb-2">
                        <AlertCircle size={28} className="text-yellow-500 shrink-0 mt-1" />
                        <div>
                            <p className="text-sm font-bold text-yellow-500 uppercase tracking-[0.2em] mb-2">Attention Required</p>
                            <p className="text-xs text-gray-300 font-mono leading-relaxed max-w-2xl">Ensure destination address and network are correct. Artheron is not responsible for lost assets in cross-chain errors. Protocol settlement is finalized upon execution.</p>
                        </div>
                    </div>
                </motion.div>

                <div className="relative flex bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
                    <div 
                        className="absolute h-[calc(100%-8px)] rounded-xl bg-white/10 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-500 ease-out"
                        style={{
                            width: `calc(50% - 4px)`,
                            left: withdrawType === 'ARTH' ? '4px' : 'calc(50% + 4px)'
                        }}
                    />
                    <button 
                        onClick={() => setWithdrawType('ARTH')}
                        className={`relative z-10 px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2 ${withdrawType === 'ARTH' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <Coins size={14} /> ARTH Token
                    </button>
                    <button 
                        onClick={() => setWithdrawType('USDT')}
                        className={`relative z-10 px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2 ${withdrawType === 'USDT' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <Globe size={14} /> USDT Income
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-10 relative z-10">
                {/* Main Withdrawal Panel */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="withdraw-card glass-panel p-6 rounded-[1rem] border border-white/50! bg-[#0A0319]/40 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-[#22d3ee] rounded-full mix-blend-screen filter blur-[120px] opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity"></div>
                        
                        <div className="relative z-10 space-y-6">
                            {/* Balance Display */}
                            <div className="flex justify-between items-center bg-white/[0.02] p-6 rounded-[1rem] border border-white/50!">
                                <div className="flex items-center gap-5 font-heading">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${withdrawType === 'ARTH' ? 'bg-gradient-to-br from-[#7b3fe4] to-[#a855f7]' : 'bg-gradient-to-br from-[#22C55E] to-[#10B981]'}`}>
                                        {withdrawType === 'ARTH' ? 'A' : '$'}
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold mb-1">Settlement Balance</p>
                                        <h2 className="text-3xl font-bold font-mono tracking-tight text-white">
                                            {activeBalance.toLocaleString()} <span className="text-sm text-gray-600 ml-1">ARTH</span>
                                        </h2>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 text-[#22C55E] bg-[#22C55E]/10 px-3 py-1.5 rounded-xl border border-[#22C55E]/20 mb-2">
                                        <ShieldCheck size={14} />
                                        <span className="text-[9px] font-bold uppercase tracking-widest leading-none">Verified Liquidity</span>
                                    </div>
                                    <p className="text-[9px] text-gray-600 uppercase tracking-widest font-mono">Real-time Node Sync: 100%</p>
                                </div>
                            </div>

                            {/* Amount Input */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end px-2">
                                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Withdrawal Quantity</label>
                                    <div className="flex gap-2">
                                        {[0.25, 0.5, 1.0].map((p) => (
                                            <button 
                                                key={p}
                                                onClick={() => setPercentage(p)}
                                                className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-[12px] font-bold text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all font-mono"
                                            >
                                                {p * 100}%
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative group/input">
                                    <input 
                                        type="number" 
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-[#050814]/60 border border-white/50! rounded-[1rem] py-6 px-6 text-5xl font-mono text-white outline-none focus:border-[#22d3ee]/30 focus:bg-[#050814] transition-all font-bold placeholder:text-gray-900 shadow-inner"
                                    />
                                    <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                        <div className="h-10 w-px bg-white/5 mx-2"></div>
                                        <span className="text-xl font-bold font-heading text-gray-700 tracking-widest">ARTH</span>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-3 text-red-500 bg-red-500/5 p-4 rounded-2xl border border-red-500/10 text-xs font-bold uppercase tracking-widest">
                                    <AlertCircle size={18} /> {error}
                                </div>
                            )}

                            {/* Destination Input */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold ml-2">Destination Network</label>
                                    <div className="relative cursor-pointer">
                                        <div className="w-full bg-[#050814]/60 border border-white/50! rounded-2xl py-4 px-6 flex items-center justify-between text-sm font-mono text-white/80 transition-all hover:border-white/20">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold border border-yellow-500/20">B</div>
                                                {network}
                                            </div>
                                            <ChevronDown size={16} className="text-gray-600" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold ml-2">Wallet Address / Node ID</label>
                                    <div className="relative">
                                        <Wallet size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700" />
                                        <input 
                                            type="text" 
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="0x... or Node UID"
                                            className="w-full bg-[#050814]/60 border border-white/50! rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-[#22d3ee]/30 text-sm font-mono text-white transition-all placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Execute Button */}
                            <button 
                                onClick={handleWithdraw}
                                disabled={isProcessing || !amount || !address || parseFloat(amount) > activeBalance || (withdrawType === 'USDT' && netSettlement <= 0)}
                                className="w-full py-6 rounded-[2rem] bg-gradient-to-r from-[#22d3ee] to-[#7b3fe4] text-white font-bold uppercase tracking-[0.3em] text-xs shadow-[0_20px_50px_rgba(34,211,238,0.2)] hover:shadow-[0_25px_60px_rgba(34,211,238,0.3)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-500 disabled:opacity-20 disabled:hover:scale-100 flex items-center justify-center gap-4 relative overflow-hidden group"
                            >
                                {isProcessing ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        <span>Encrypting Transaction...</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <span>Execute Core Withdrawal</span>
                                        <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Protocol Details */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="withdraw-card glass-panel p-8 rounded-[1rem] border border-white/50! bg-[#0A0319]/60 relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#22d3ee] to-[#7b3fe4]"></div>
                        
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#22d3ee] border border-white/5">
                                    <Info size={20} />
                                </div>
                                <h3 className="text-lg font-bold font-heading uppercase tracking-tighter">Protocol <span className="text-white">Summary</span></h3>
                            </div>

                                <div className="space-y-5">
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Request quantity</span>
                                    <span className="text-sm font-mono font-bold text-white">{amount || '0.00'} ARTH</span>
                                </div>
                                {withdrawType === 'USDT' && (
                                     <>
                                        <div className="flex justify-between items-center px-2">
                                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Market Value (@{ARTH_PRICE})</span>
                                            <span className="text-sm font-mono font-bold text-white">${grossValue.toFixed(2)} USDT</span>
                                        </div>
                                        <div className="flex justify-between items-center px-2">
                                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Protocol Gas Fee</span>
                                            <span className="text-sm font-mono font-bold text-red-500/80">-1.00 USDT</span>
                                        </div>
                                     </>
                                )}
                                <div className="h-px bg-white/5"></div>
                                <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 shadow-inner">
                                    <span className="text-[10px] text-[#22d3ee] uppercase tracking-widest font-black">Net Settlement</span>
                                    <span className="text-xl font-mono font-black text-white">{netSettlement.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {withdrawType}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Withdraw;
