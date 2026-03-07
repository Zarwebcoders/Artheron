import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollProgressBar from '../components/ScrollProgressBar';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useWallet } from '../context/WalletContext';
import { ArrowUpRight, ArrowDownRight, Clock, ShieldCheck, Activity, Wallet, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    const { account, balance } = useWallet();
    const containerRef = useRef(null);

    // State-based counters for maximum stability
    const [displayStats, setDisplayStats] = useState({
        balance: 0,
        staked: 0,
        rewards: 0
    });

    const transactions = [
        { id: '1', type: 'Receive', amount: '+12,500 ARTH', date: '2 hours ago', status: 'Completed', hash: '0xabc...def' },
        { id: '2', type: 'Stake', amount: '-5,000 ARTH', date: 'Yesterday', status: 'Completed', hash: '0x123...456' },
        { id: '3', type: 'Claim', amount: '+250 ARTH', date: '3 days ago', status: 'Completed', hash: '0x789...012' },
    ];

    useEffect(() => {
        if (!account || !containerRef.current) return;

        let ctx = gsap.context(() => {
            // 1. Creative Staggered Entry
            gsap.fromTo(".dash-card",
                { y: 50, opacity: 0, scale: 0.95, rotationX: -10 },
                {
                    y: 0, opacity: 1, scale: 1, rotationX: 0,
                    stagger: 0.15, duration: 1, ease: "back.out(1.2)"
                }
            );

            // 2. Number Counter Animation using State
            const targetBalance = parseFloat(balance.replace(/,/g, '')) || 0;
            const statsObj = { balance: 0, staked: 0, rewards: 0 };

            gsap.to(statsObj, {
                balance: targetBalance,
                staked: 5000,
                rewards: 250,
                duration: 2,
                ease: "power2.out",
                onUpdate: function () {
                    setDisplayStats({
                        balance: statsObj.balance,
                        staked: statsObj.staked,
                        rewards: statsObj.rewards
                    });
                }
            });

            // 3. 3D Hover Tilt Effect
            const cards = gsap.utils.toArray('.dash-card');
            cards.forEach(card => {
                const cardInner = card.querySelector('.card-inner-glow');

                card.addEventListener("mousemove", (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = ((y - centerY) / centerY) * -10;
                    const rotateY = ((x - centerX) / centerX) * 10;

                    gsap.to(card, {
                        rotateX: rotateX,
                        rotateY: rotateY,
                        transformPerspective: 1000,
                        ease: "power2.out",
                        duration: 0.5
                    });

                    if (cardInner) {
                        gsap.to(cardInner, {
                            x: (x - centerX) * 0.2,
                            y: (y - centerY) * 0.2,
                            opacity: 0.3,
                            duration: 0.5,
                            ease: "power2.out"
                        });
                    }
                });

                card.addEventListener("mouseleave", () => {
                    gsap.to(card, {
                        rotateX: 0,
                        rotateY: 0,
                        ease: "elastic.out(1, 0.3)",
                        duration: 1.2
                    });
                    if (cardInner) {
                        gsap.to(cardInner, {
                            x: 0, y: 0, opacity: 0.1, duration: 0.8, ease: "power2.out"
                        });
                    }
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, [account, balance]);

    if (!account) {
        return (
            <div className="relative w-full min-h-screen bg-[#07010f] text-white flex flex-col justify-between overflow-hidden">
                <ScrollProgressBar />
                <Navbar />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7b3fe4] rounded-full mix-blend-screen filter blur-[200px] opacity-[0.05] pointer-events-none"></div>
                <main className="flex-grow flex items-center justify-center relative z-10 px-4 pt-32 pb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center glass-panel p-12 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(123,63,228,0.1)] relative overflow-hidden max-w-lg w-full"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#22d3ee] rounded-full mix-blend-screen filter blur-[60px] opacity-10"></div>
                        <div className="w-20 h-20 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 relative glow-purple">
                            <ShieldCheck size={36} className="text-[#a855f7]" />
                        </div>
                        <h2 className="text-3xl font-bold font-heading mb-4 text-white">Dashboard Locked</h2>
                        <p className="text-gray-400 mb-8 leading-relaxed font-light">Please connect your Web3 wallet to access your personal Artheron dashboard, manage holdings, and view transaction history.</p>
                    </motion.div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="relative w-full min-h-screen bg-[#07010f] text-white flex flex-col overflow-hidden">
            <ScrollProgressBar />
            <Navbar />

            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#22d3ee] rounded-full mix-blend-screen filter blur-[250px] opacity-[0.04] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#7b3fe4] rounded-full mix-blend-screen filter blur-[250px] opacity-[0.04] pointer-events-none"></div>

            <main ref={containerRef} className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-32 mb-20 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-3">My <span className="text-gradient">Portfolio</span></h1>
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-[#22d3ee] glow-blue animate-pulse"></span>
                            <p className="text-gray-400 font-mono text-sm tracking-wider bg-white/5 px-3 py-1 rounded-full border border-white/5">{account}</p>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
                        <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                            <Wallet size={16} /> Deposit
                        </button>
                        <button className="bg-gradient-to-r from-[#7b3fe4] to-[#a855f7] hover:from-[#a855f7] hover:to-[#22d3ee] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-105 active:scale-95 duration-200">
                            Buy ARTH
                        </button>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="dash-card glass-panel p-8 rounded-[2rem] border border-[#22d3ee]/20 relative overflow-hidden group hover:border-[#22d3ee]/40 transition-[border-color] duration-300">
                        <div className="card-inner-glow absolute -top-10 -right-10 w-40 h-40 bg-[#22d3ee] rounded-full mix-blend-screen filter blur-[70px] opacity-[0.15]"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-gray-400 text-sm font-medium">Available Balance</p>
                                <div className="w-8 h-8 rounded-full bg-[#22d3ee]/10 flex items-center justify-center text-[#22d3ee]">
                                    <Wallet size={16} />
                                </div>
                            </div>
                            <h3 className="text-4xl font-bold font-mono tracking-tight text-white mb-2">{Math.ceil(displayStats.balance).toLocaleString()} <span className="text-2xl text-gray-400 font-light">ARTH</span></h3>
                            <p className="text-sm text-[#22d3ee] font-mono tracking-wide">~ ${(displayStats.balance * 0.0452).toFixed(2)} USD</p>
                        </div>
                    </div>

                    <div className="dash-card glass-panel p-8 rounded-[2rem] border border-white/5 relative overflow-hidden hover:border-[#a855f7]/30 transition-[border-color] duration-300 group">
                        <div className="card-inner-glow absolute -bottom-10 -right-10 w-40 h-40 bg-[#a855f7] rounded-full mix-blend-screen filter blur-[70px] opacity-[0.15]"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-gray-400 text-sm font-medium">Total Staked</p>
                                <div className="w-8 h-8 rounded-full bg-[#a855f7]/10 flex items-center justify-center text-[#a855f7]">
                                    <TrendingUp size={16} />
                                </div>
                            </div>
                            <h3 className="text-4xl font-bold font-mono tracking-tight text-white mb-2">{Math.ceil(displayStats.staked).toLocaleString()} <span className="text-2xl text-gray-400 font-light">ARTH</span></h3>
                            <div className="inline-flex items-center gap-2 bg-[#a855f7]/10 px-3 py-1 rounded-md border border-[#a855f7]/20 mt-1">
                                <span className="w-2 h-2 rounded-full bg-[#a855f7] animate-pulse"></span>
                                <p className="text-xs text-[#a855f7] font-bold tracking-wider">EARNING 12% APY</p>
                            </div>
                        </div>
                    </div>

                    <div className="dash-card glass-panel p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group flex flex-col justify-between transition-[border-color] duration-300 hover:border-white/20">
                        <div className="card-inner-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#7b3fe4] rounded-full mix-blend-screen filter blur-[70px] opacity-[0.15]"></div>
                        <div className="relative z-10">
                            <p className="text-gray-400 text-sm font-medium mb-4">Total Rewards Earned</p>
                            <h3 className="text-4xl font-bold font-mono tracking-tight text-white mb-2">{Math.ceil(displayStats.rewards).toLocaleString()} <span className="text-2xl text-gray-400 font-light">ARTH</span></h3>
                        </div>
                        <div className="relative z-10 mt-6 pt-6 border-t border-white/5">
                            <button className="w-full relative px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all text-sm border border-white/10 overflow-hidden group/btn text-white text-center hover:scale-105 active:scale-95 duration-200">
                                <span className="relative z-10">Claim Rewards</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#22d3ee]/20 to-[#a855f7]/20 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="dash-card lg:col-span-2 glass-panel rounded-[2rem] border border-white/5 p-8 relative overflow-hidden bg-white/[0.01]">
                        <div className="card-inner-glow absolute top-0 -left-20 w-64 h-64 bg-[#22d3ee] rounded-full mix-blend-screen filter blur-[100px] opacity-[0.05] pointer-events-none"></div>
                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <h3 className="text-2xl font-bold font-heading">Recent <span className="text-gradient">Activity</span></h3>
                            <button className="text-xs font-medium text-[#22d3ee] hover:text-[#a855f7] uppercase tracking-wider transition-colors flex items-center gap-1 group">
                                View Explorer <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                        </div>
                        <div className="space-y-4 relative z-10">
                            {transactions.map((tx) => {
                                const isPositive = tx.type === 'Receive' || tx.type === 'Claim';
                                return (
                                    <div key={tx.id} className="group/tx flex items-center justify-between p-5 bg-[#0a0319] rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:-translate-y-1">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isPositive ? 'bg-[#22d3ee]/10 text-[#22d3ee] group-hover/tx:bg-[#22d3ee]/20 group-hover/tx:scale-110' : 'bg-[#a855f7]/10 text-[#a855f7] group-hover/tx:bg-[#a855f7]/20 group-hover/tx:scale-110'}`}>
                                                {isPositive ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                                            </div>
                                            <div><p className="font-bold text-white text-lg">{tx.type} <span className="font-light text-gray-400">ARTH</span></p><div className="flex items-center gap-2 text-xs text-gray-500 font-mono mt-1"><Clock size={12} /><span>{tx.date}</span></div></div>
                                        </div>
                                        <div className="text-right"><p className={`font-mono font-bold text-lg ${isPositive ? 'text-[#22d3ee]' : 'text-white'}`}>{tx.amount}</p><div className="flex items-center justify-end gap-1 mt-1 opacity-50 group-hover/tx:opacity-100 transition-opacity"><p className="text-xs text-gray-500 font-mono truncate max-w-[100px]">{tx.hash}</p></div></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="dash-card flex flex-col gap-6">
                        <div className="glass-panel p-8 rounded-[2rem] border border-[#a855f7]/30 text-center relative overflow-hidden group bg-gradient-to-br from-[#0a0319] to-[#12052b] hover:border-[#22d3ee]/40 transition-[border-color] duration-500">
                            <div className="card-inner-glow absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#a855f7]/20 via-[#22d3ee]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-[#0a0319] border border-[#a855f7]/30 flex items-center justify-center mb-6 glow-purple relative transition-transform duration-500 group-hover:scale-110 group-hover:border-[#22d3ee]/40 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                                    <div className="absolute inset-0 rounded-full border border-[#a855f7]/50 group-hover:border-[#22d3ee]/50 animate-[spin_4s_linear_infinite] border-t-transparent transition-colors"></div>
                                    <Activity className="text-[#a855f7] group-hover:text-[#22d3ee] transition-colors" size={32} />
                                </div>
                                <h3 className="text-2xl font-bold font-heading mb-3 text-white">Stake & Earn</h3>
                                <p className="text-sm text-gray-400 mb-8 leading-relaxed font-light">Lock your ARTH tokens to secure the network and earn up to <span className="text-[#a855f7] group-hover:text-[#22d3ee] transition-colors font-bold">12% APY</span> in passive rewards.</p>
                                <a href="/staking" className="block w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 duration-200">Go to Staking</a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;
