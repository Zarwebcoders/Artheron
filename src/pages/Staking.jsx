import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollProgressBar from '../components/ScrollProgressBar';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useWallet } from '../context/WalletContext';
import { ShieldCheck, Info, TrendingUp, Lock, RefreshCw, AlertCircle } from 'lucide-react';

const Staking = () => {
    const { account, balance } = useWallet();
    const [stakeAmount, setStakeAmount] = useState('');
    const [activeTab, setActiveTab] = useState('stake');
    const containerRef = useRef(null);

    // State-based counters for maximum stability
    const [displayStats, setDisplayStats] = useState({
        tvl: 0,
        totalStaked: 0,
        participants: 0,
        userStake: 0
    });

    const apy = 12.5;

    useEffect(() => {
        if (!containerRef.current) return;

        let ctx = gsap.context(() => {
            // 1. Staggered Card Entry
            gsap.fromTo(".stake-card",
                { y: 50, opacity: 0, scale: 0.95, rotationX: -10 },
                { y: 0, opacity: 1, scale: 1, rotationX: 0, stagger: 0.15, duration: 1, ease: "back.out(1.2)" }
            );

            // 2. Number Animators using State
            const statsObj = { tvl: 0, totalStaked: 0, participants: 0, userStake: 0 };

            gsap.to(statsObj, {
                tvl: 4200000,
                totalStaked: 92450000,
                participants: 4281,
                userStake: account ? 5000 : 0,
                duration: 2.5,
                ease: "power3.out",
                onUpdate: function () {
                    setDisplayStats({
                        tvl: statsObj.tvl,
                        totalStaked: statsObj.totalStaked,
                        participants: statsObj.participants,
                        userStake: statsObj.userStake
                    });
                }
            });

            // 3. 3D Parallax Hover
            const cards = gsap.utils.toArray('.hover-3d');
            cards.forEach(card => {
                const cardInner = card.querySelector('.card-inner-glow');
                card.addEventListener("mousemove", (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -8;
                    const rotateY = ((x - centerX) / centerX) * 8;
                    gsap.to(card, {
                        rotateX: rotateX,
                        rotateY: rotateY,
                        transformPerspective: 1200,
                        ease: "power2.out",
                        duration: 0.5
                    });
                    if (cardInner) {
                        gsap.to(cardInner, {
                            x: (x - centerX) * 0.3,
                            y: (y - centerY) * 0.3,
                            opacity: 0.4,
                            duration: 0.5,
                            ease: "power2.out",
                            scale: 1.2
                        });
                    }
                });

                card.addEventListener("mouseleave", () => {
                    gsap.to(card, {
                        rotateX: 0,
                        rotateY: 0,
                        ease: "elastic.out(1, 0.4)",
                        duration: 1.5
                    });
                    if (cardInner) {
                        gsap.to(cardInner, {
                            x: 0, y: 0, opacity: 0.15, duration: 1, ease: "power2.out", scale: 1
                        });
                    }
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, [account]);

    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        setStakeAmount('');
    };

    return (
        <div className="relative w-full min-h-screen bg-[#07010f] text-white flex flex-col overflow-hidden">
            <ScrollProgressBar />
            <Navbar />

            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#a855f7] rounded-full mix-blend-screen filter blur-[250px] opacity-[0.03] pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-[#22d3ee] rounded-full mix-blend-screen filter blur-[250px] opacity-[0.03] pointer-events-none"></div>

            <main ref={containerRef} className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-32 mb-20 relative z-10">

                <div className="text-center mb-16">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest mb-6">
                        <ShieldCheck size={14} className="text-[#a855f7]" /> Secure Network
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 tracking-tight">
                        Stake <span className="text-gradient">ARTH</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Lock your tokens to secure the network, participate in governance, and earn up to <span className="text-[#a855f7] font-bold">12.5% APY</span> in passive rewards.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7">
                        <div className="stake-card hover-3d glass-panel p-8 md:p-10 rounded-[2rem] border border-white/10 relative overflow-hidden bg-[#0A0319] shadow-[0_0_50px_rgba(168,85,247,0.05)] transition-[border-color] duration-500 hover:border-[#a855f7]/30">
                            <div className="card-inner-glow absolute top-0 right-0 w-80 h-80 bg-[#a855f7] rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>

                            <div className="flex bg-[#050814] rounded-xl p-1.5 mb-8 border border-white/5 relative z-10">
                                <button onClick={() => handleTabSwitch('stake')} className={`relative flex-1 py-3 text-center rounded-lg font-bold transition-all duration-300 text-sm tracking-wider uppercase z-10 ${activeTab === 'stake' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                                    {activeTab === 'stake' && <motion.div layoutId="activeTab" className="absolute inset-0 bg-white/10 rounded-lg shadow-sm border border-white/10" />}
                                    <span className="relative z-20">Stake</span>
                                </button>
                                <button onClick={() => handleTabSwitch('unstake')} className={`relative flex-1 py-3 text-center rounded-lg font-bold transition-all duration-300 text-sm tracking-wider uppercase z-10 ${activeTab === 'unstake' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                                    {activeTab === 'unstake' && <motion.div layoutId="activeTab" className="absolute inset-0 bg-white/10 rounded-lg shadow-sm border border-white/10" />}
                                    <span className="relative z-20">Unstake</span>
                                </button>
                            </div>

                            <div className="mb-8 relative z-10">
                                <div className="flex justify-between items-end mb-3 px-1">
                                    <span className="text-gray-400 font-medium text-sm">Amount Format</span>
                                    <span className="text-xs text-gray-400 tracking-wider">AVAILABLE: <span className="text-white font-mono font-bold text-sm tracking-normal">{account ? (activeTab === 'stake' ? balance : '5,000.00') : '0.00'}</span></span>
                                </div>
                                <div className={`bg-[#050814] border transition-colors duration-300 rounded-2xl p-4 md:p-6 flex justify-between items-center group relative overflow-hidden ${stakeAmount ? 'border-[#a855f7]/50 shadow-[0_0_20px_rgba(168,85,247,0.15)] bg-gradient-to-r from-[#050814] to-[#12052b]' : 'border-white/10 hover:border-white/30'}`}>
                                    <input type="number" placeholder="0.00" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} className="bg-transparent text-3xl md:text-5xl font-mono text-white outline-none w-2/3 placeholder:text-white/20 transition-all focus:scale-[1.02]" />
                                    <div className="flex flex-col items-end gap-3 lg:flex-row lg:items-center">
                                        <button onClick={() => setStakeAmount(activeTab === 'stake' ? balance.replace(/,/g, '') : '5000')} className="text-xs font-bold text-[#22d3ee] bg-[#22d3ee]/10 px-3 py-1.5 rounded border border-[#22d3ee]/20 hover:bg-[#22d3ee]/20 transition-colors uppercase tracking-widest hover:scale-105 active:scale-95">Max</button>
                                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"><div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#22d3ee] to-[#7b3fe4] animate-[spin_4s_linear_infinite]"></div><span className="font-bold text-sm">ARTH</span></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#050814] rounded-2xl p-6 mb-8 border border-white/5 relative z-10 transition-colors duration-300 hover:border-white/10 hover:bg-white/[0.02]">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center"><span className="text-gray-400 text-sm flex items-center gap-2"><TrendingUp size={16} className="text-[#a855f7]" /> Current APY</span><div className="inline-flex items-center gap-2 bg-[#a855f7]/10 px-3 py-1 rounded-md border border-[#a855f7]/20"><span className="w-2 h-2 rounded-full bg-[#a855f7] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></span><span className="text-[#a855f7] font-bold font-mono tracking-wide">{apy}%</span></div></div>
                                    <div className="flex justify-between items-center"><span className="text-gray-400 text-sm flex items-center gap-2"><Lock size={16} /> Lock Period</span><span className="text-white font-mono bg-white/5 px-3 py-1 rounded-md border border-white/5 text-sm">14 Days</span></div>
                                </div>
                                <AnimatePresence>
                                    {stakeAmount && parseFloat(stakeAmount) > 0 && (
                                        <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 16 }} exit={{ opacity: 0, height: 0, marginTop: 0 }} className="border-t border-[#22d3ee]/20 pt-4 overflow-hidden">
                                            <div className="flex justify-between items-center text-sm"><span className="text-gray-400 flex items-center gap-2"><RefreshCw size={14} className="text-[#22d3ee] animate-spin-slow" /> Est. Monthly Earnings</span><span className="text-[#22d3ee] font-bold font-mono text-lg tracking-tight drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">+ {((parseFloat(stakeAmount) * apy) / 100 / 12).toFixed(2)} ARTH</span></div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="relative z-10 group/btnwrap">
                                {!account ? (
                                    <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-bold uppercase tracking-wider cursor-not-allowed text-sm flex items-center justify-center gap-2"><AlertCircle size={18} /> Connect Wallet to Proceed</button>
                                ) : (
                                    <button className="w-full py-4 rounded-xl bg-gradient-to-r from-[#7b3fe4] to-[#a855f7] text-white font-bold uppercase tracking-widest transition-all relative overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover/btnwrap:shadow-[0_0_40px_rgba(34,211,238,0.4)] transform group-hover/btnwrap:-translate-y-1 active:translate-y-0 active:scale-95 duration-200">
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#a855f7] to-[#22d3ee] opacity-0 group-hover/btnwrap:opacity-100 transition-opacity duration-500"></div>
                                        <span className="relative z-10 drop-shadow-md">{activeTab === 'stake' ? 'Confirm Stake' : 'Confirm Unstake'}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        {account && (
                            <div className="stake-card hover-3d glass-panel p-8 rounded-[2rem] border border-[#22d3ee]/20 relative overflow-hidden bg-[#0A0319]/90 backdrop-blur-md shadow-[0_0_30px_rgba(34,211,238,0.05)] transition-[border-color] duration-500 hover:border-[#22d3ee]/40">
                                <div className="card-inner-glow absolute top-0 right-0 w-40 h-40 bg-[#22d3ee] rounded-full mix-blend-screen filter blur-[60px] opacity-[0.15]"></div>
                                <div className="flex items-center gap-4 mb-6 relative z-10"><div className="w-12 h-12 rounded-xl bg-[#22d3ee]/10 flex items-center justify-center text-[#22d3ee] border border-[#22d3ee]/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]"><Lock size={20} /></div><div><h3 className="text-xl font-bold font-heading text-white">Your Position</h3><p className="text-xs text-gray-400 uppercase tracking-widest">Active Staking</p></div></div>
                                <div className="space-y-6 relative z-10">
                                    <div className="p-5 bg-[#050814] rounded-xl border border-white/5 transition-colors duration-300 hover:bg-white/[0.02] hover:border-white/10">
                                        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Staked Amount</p>
                                        <div className="flex items-end gap-2"><p className="text-3xl font-mono font-bold text-white tracking-tight">{Math.ceil(displayStats.userStake).toLocaleString()}.00</p><span className="text-sm text-gray-500 font-bold mb-1">ARTH</span></div>
                                    </div>
                                    <div className="p-5 bg-gradient-to-br from-[#a855f7]/10 to-transparent rounded-xl border border-[#a855f7]/20 group/claim hover:border-[#a855f7]/40 transition-[border-color] duration-300">
                                        <p className="text-[#a855f7] text-xs uppercase tracking-widest mb-2 font-bold">Unclaimed Rewards</p>
                                        <div className="flex justify-between items-center"><div className="flex items-end gap-2"><p className="text-3xl font-mono font-bold text-[#22d3ee] tracking-tight drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">250.00</p><span className="text-sm text-[#22d3ee]/50 font-bold mb-1">ARTH</span></div><button className="bg-[#a855f7]/20 hover:bg-[#a855f7] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] px-5 py-2.5 rounded-lg text-sm font-bold border border-[#a855f7]/50 transition-all duration-300 text-white uppercase tracking-wider hover:scale-105 active:scale-95">Claim</button></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="stake-card hover-3d glass-panel p-8 rounded-[2rem] border border-white/5 relative overflow-hidden bg-white/[0.02] transition-[border-color] duration-500 hover:border-white/10">
                            <div className="card-inner-glow absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full mix-blend-screen filter blur-[70px] opacity-[0.05]"></div>
                            <div className="flex items-center gap-4 mb-8 relative z-10"><div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 border border-white/10"><Info size={18} /></div><h3 className="text-lg font-bold font-heading text-white">Global Stats</h3></div>
                            <div className="space-y-6 relative z-10">
                                <div className="flex flex-col gap-1 transition-transform duration-300 hover:translate-x-1"><span className="text-gray-500 text-xs uppercase tracking-widest">Total Value Locked (TVL)</span><span className="font-mono font-bold text-white text-xl">${(displayStats.tvl / 1000000).toFixed(1)}M <span className="text-gray-600 text-sm">USD</span></span></div>
                                <div className="w-full h-px bg-gradient-to-r from-white/10 to-transparent"></div>
                                <div className="flex flex-col gap-1 transition-transform duration-300 hover:translate-x-1"><span className="text-gray-500 text-xs uppercase tracking-widest">Total Artheron Staked</span><span className="font-mono font-bold text-[#a855f7] text-xl">{Math.ceil(displayStats.totalStaked).toLocaleString()} <span className="text-[#a855f7]/50 text-sm">ARTH</span></span></div>
                                <div className="w-full h-px bg-gradient-to-r from-white/10 to-transparent"></div>
                                <div className="flex flex-col gap-1 transition-transform duration-300 hover:translate-x-1"><span className="text-gray-500 text-xs uppercase tracking-widest">Staking Participants</span><span className="font-mono font-bold text-white text-xl">{Math.ceil(displayStats.participants).toLocaleString()} <span className="text-gray-600 text-sm">Wallets</span></span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Staking;
