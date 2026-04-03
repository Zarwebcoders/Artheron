import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import { 
    ShieldCheck, 
    Info, 
    TrendingUp, 
    Lock, 
    RefreshCw, 
    AlertCircle, 
    ArrowUpRight, 
    Zap,
    Skull,
    History as HistoryIcon,
    CheckCircle2
} from 'lucide-react';

import API from '../api/axios';

const Staking = () => {
    const { balances, updateBalances } = useAuth();
    const [stakeAmount, setStakeAmount] = useState('');
    const [isAutoCompound, setIsAutoCompound] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
    // Monthly ROI is 6%
    const monthlyROI = 6;
    const dailyROI = (monthlyROI / 30).toFixed(4);

    useEffect(() => {
        gsap.fromTo(".stake-card", 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power2.out" }
        );
    }, []);

    const handleStake = async () => {
        const amount = parseFloat(stakeAmount);
        if (isNaN(amount) || amount <= 0) return;

        setIsLoading(true);
        setError('');
        try {
            const res = await API.post('/assets/stake', { amount });
            if (res.data.success) {
                setIsSuccess(true);
                updateBalances();
                setStakeAmount('');
                setTimeout(() => setIsSuccess(false), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Staking failed');
        }
        setIsLoading(false);
    };

    const handleClaim = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await API.post('/assets/claim');
            if (res.data.success) {
                setIsSuccess(true);
                updateBalances();
                setTimeout(() => setIsSuccess(false), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Claim failed');
        }
        setIsLoading(false);
    };

    const handleSOSWithdraw = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await API.post('/assets/sos');
            if (res.data.success) {
                setIsSuccess(true);
                updateBalances();
                setIsSOSModalOpen(false);
                setTimeout(() => setIsSuccess(false), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'SOS liquidation failed');
        }
        setIsLoading(false);
    };

    return (
        <div className="p-6 lg:p-10 space-y-10 relative">
            
            {/* Success Notification */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div 
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-24 right-10 z-[60] bg-[#22C55E] text-white px-6 py-4 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.3)] flex items-center gap-3 border border-white/20"
                    >
                        <CheckCircle2 size={24} />
                        <span className="font-bold uppercase tracking-widest text-xs">Protocol Update Successful</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold font-heading mb-1 uppercase tracking-tight">
                        STAKING <span className="text-gradient">PROTOCOL</span>
                    </h1>
                    <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase bg-white/5 py-1 px-3 rounded-full border border-white/5 inline-block">
                        Active Yield: 6% Monthly
                    </p>
                </motion.div>

                <div className="flex gap-3">
                    <button className="bg-white/5 border border-white/10 text-gray-400 px-5 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-white/10 flex items-center gap-2">
                         <HistoryIcon size={14} /> Stake History
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Staking Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="stake-card glass-panel p-10 rounded-[2.5rem] border border-white/5 bg-[#0A0319]/60 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7b3fe4] rounded-full mix-blend-screen filter blur-[100px] opacity-[0.05] pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#7b3fe4]/10 border border-[#7b3fe4]/20 flex items-center justify-center text-[#a855f7] glow-purple">
                                        <Lock size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold font-heading uppercase tracking-tighter text-white">Initialize New Stake</h2>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Artheron Smart Yield Engine v2.0</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Available</p>
                                    <p className="text-sm font-bold font-mono text-white">{balances.tokenBalance.toLocaleString()} <span className="text-gray-600">ARTH</span></p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        placeholder="0.00" 
                                        value={stakeAmount}
                                        onChange={(e) => setStakeAmount(e.target.value)}
                                        className="w-full bg-[#050814]/50 border border-white/5 rounded-3xl py-12 px-10 text-6xl font-mono text-white outline-none focus:border-[#7b3fe4]/30 transition-all font-bold placeholder:text-gray-800"
                                    />
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-4">
                                        <button 
                                            onClick={() => setStakeAmount(balances.tokenBalance.toString())}
                                            className="text-[10px] font-bold text-[#7b3fe4] uppercase tracking-widest py-2 px-4 bg-[#7b3fe4]/10 rounded-xl border border-[#7b3fe4]/20 hover:bg-[#7b3fe4]/20 transition-all"
                                        >
                                            Max Use
                                        </button>
                                        <div className="flex items-center gap-2 bg-white/5 py-3 px-5 rounded-2xl border border-white/5">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7b3fe4] to-[#22d3ee] flex items-center justify-center text-[10px] font-bold">A</div>
                                            <span className="font-bold text-sm tracking-widest">ARTH</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col justify-between group/comp hover:bg-white/[0.08] transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Auto Compound</span>
                                                <span className="text-xs text-white font-bold">Maximize Yield Efficiency</span>
                                            </div>
                                            <button 
                                                onClick={() => setIsAutoCompound(!isAutoCompound)}
                                                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isAutoCompound ? 'bg-[#22C55E]' : 'bg-gray-700'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${isAutoCompound ? 'left-7' : 'left-1'}`}></div>
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-[#22C55E] font-bold uppercase tracking-widest">
                                            <Zap size={14} /> Efficiency +18.4%
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Monthly ROI</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl font-bold font-mono text-[#a855f7]">6.00%</span>
                                                <div className="bg-[#a855f7]/10 px-2 py-1 rounded-lg border border-[#a855f7]/20 text-[8px] font-bold text-[#a855f7] uppercase tracking-widest">Fixed</div>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-700 font-mono mt-2 uppercase tracking-tight">Approx {dailyROI}% Daily Profit</p>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleStake}
                                    disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}
                                    className="w-full py-6 rounded-3xl bg-gradient-to-r from-[#7b3fe4] to-[#a855f7] text-white font-bold uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(123,63,228,0.3)] hover:shadow-[0_0_60px_rgba(123,63,228,0.5)] transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-30 disabled:hover:scale-100 flex items-center justify-center gap-3 group"
                                >
                                    <span>Execute Staking Protocol</span>
                                    <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="stake-card glass-panel p-8 rounded-[2.5rem] border border-[#a855f7]/20 bg-[#0A0319]/80 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#a855f7] rounded-full mix-blend-screen filter blur-[60px] opacity-[0.1]"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-[#a855f7]/10 border border-[#a855f7]/20 flex items-center justify-center text-[#a855f7]">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold font-heading uppercase tracking-tighter">Yield Status</h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Real-time Stats</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Active Total Staked</p>
                                    <p className="text-3xl font-bold font-mono text-white">{balances.stakeBalance.toLocaleString()} <span className="text-sm text-gray-700">ARTH</span></p>
                                </div>
                                
                                <div className="h-px bg-white/5"></div>
                                
                                {error && (
                                    <div className="flex items-center gap-2 text-red-500 bg-red-500/5 p-3 rounded-xl border border-red-500/10 text-[10px] uppercase font-bold tracking-widest">
                                        <AlertCircle size={14} /> {error}
                                    </div>
                                )}

                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Unclaimed Earnings</p>
                                    <div className="flex justify-between items-end">
                                        <p className="text-3xl font-bold font-mono text-[#22C55E]">{balances.incomeBalance.toLocaleString()} <span className="text-sm text-gray-700">ARTH</span></p>
                                        <button 
                                            onClick={handleClaim}
                                            disabled={balances.incomeBalance <= 0 || isLoading}
                                            className="text-[10px] font-bold text-white uppercase tracking-widest px-4 py-2 bg-white/10 rounded-xl border border-white/10 hover:bg-white/20 transition-all disabled:opacity-20"
                                        >
                                            {isLoading ? '...' : 'Claim'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="stake-card glass-panel p-8 rounded-[2.5rem] border border-red-500/10 bg-red-500/[0.02] hover:bg-red-500/[0.04] transition-all relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                                    <Skull size={20} />
                                </div>
                                <h3 className="text-lg font-bold font-heading uppercase tracking-tighter text-red-500/80">SOS Withdraw</h3>
                            </div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-6 leading-relaxed bg-red-500/5 p-3 rounded-xl border border-red-500/10">
                                Emergency exit allows <span className="text-red-400 font-bold">Instant Liquidation</span>. 
                                A <span className="text-red-400 font-bold">20% Penalty</span> will be deducted from your total stake.
                            </p>
                            <button 
                                onClick={() => setIsSOSModalOpen(true)}
                                disabled={balances.stakeBalance <= 0}
                                className="w-full py-3.5 rounded-2xl border border-red-500/20 text-red-500 font-bold uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-red-500"
                            >
                                Initiate SOS Exit
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* SOS Modal */}
            <AnimatePresence>
                {isSOSModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSOSModalOpen(false)}
                            className="absolute inset-0 bg-[#07010f]/90 backdrop-blur-xl"
                        />
                        
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-lg glass-panel p-10 rounded-[2.5rem] border border-red-500/20 bg-[#0D041A] shadow-[0_0_100px_rgba(239,68,68,0.1)]"
                        >
                            <div className="text-center mb-10">
                                <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                                    <AlertCircle size={40} className="text-red-500" />
                                </div>
                                <h2 className="text-3xl font-bold font-heading mb-2 uppercase tracking-tighter">Emergency Liquidate?</h2>
                                <p className="text-gray-500 text-sm font-light">Confirm heavy penalty execution</p>
                            </div>

                            <div className="space-y-4 mb-10">
                                <div className="flex justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Total Staked</span>
                                    <span className="text-sm font-bold font-mono">{balances.stakeBalance.toLocaleString()} ARTH</span>
                                </div>
                                <div className="flex justify-between p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                                    <span className="text-xs text-red-500/80 uppercase tracking-widest font-bold">SOS Penalty (20%)</span>
                                    <span className="text-sm font-bold font-mono text-red-500">-{(balances.stakeBalance * 0.2).toLocaleString()} ARTH</span>
                                </div>
                                <div className="flex justify-between p-4 bg-[#22C55E]/5 rounded-2xl border border-[#22C55E]/10">
                                    <span className="text-xs text-[#22C55E] uppercase tracking-widest font-bold">Net Return</span>
                                    <span className="text-lg font-bold font-mono text-[#22C55E]">{(balances.stakeBalance * 0.8).toLocaleString()} ARTH</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setIsSOSModalOpen(false)}
                                    className="py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSOSWithdraw}
                                    className="py-4 rounded-2xl bg-red-600 text-white font-bold uppercase tracking-widest text-[10px] shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:bg-red-700 transition-all"
                                >
                                    Liquidate Now
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Staking;
