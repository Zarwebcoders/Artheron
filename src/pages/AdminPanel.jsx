import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollProgressBar from '../components/ScrollProgressBar';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useWallet } from '../context/WalletContext';
import { ShieldAlert, Users, Database, Activity, AlertCircle, Lock, ShieldCheck, ChevronRight, Zap, Globe } from 'lucide-react';

const AdminPanel = () => {
    const { account, connectWallet } = useWallet();
    const containerRef = useRef(null);
    const [displayStats, setDisplayStats] = useState({
        holders: 0,
        mcap: 0,
        liquidity: 0,
        staked: 0
    });

    // IMPROVED: For development, we allow access if account exists.
    // In production, this would be a signature-based challenge or contract owner check.
    const isAdmin = !!account;

    useEffect(() => {
        if (!isAdmin || !containerRef.current) return;

        let ctx = gsap.context(() => {
            // 1. Creative Staggered Entry
            gsap.fromTo(".admin-card",
                { y: 30, opacity: 0, scale: 0.98 },
                { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.8, ease: "power3.out" }
            );

            // 2. Number Counter Animation using State
            const statsObj = { holders: 0, mcap: 0, liquidity: 0, staked: 0 };
            gsap.to(statsObj, {
                holders: 12450,
                mcap: 19.8,
                liquidity: 2.4,
                staked: 21,
                duration: 2,
                ease: "power2.out",
                onUpdate: function () {
                    setDisplayStats({
                        holders: statsObj.holders,
                        mcap: statsObj.mcap,
                        liquidity: statsObj.liquidity,
                        staked: statsObj.staked
                    });
                }
            });

            // 3. 3D Hover Tilt Effect
            const cards = gsap.utils.toArray('.hover-3d');
            cards.forEach(card => {
                const cardInner = card.querySelector('.card-inner-glow');
                card.addEventListener("mousemove", (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -5;
                    const rotateY = ((x - centerX) / centerX) * 5;

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
                        ease: "power2.out",
                        duration: 0.8
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
    }, [isAdmin]);

    if (!account) {
        return (
            <div className="relative w-full min-h-screen bg-[#07010f] text-white flex flex-col items-center justify-center overflow-hidden">
                <Navbar />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7b3fe4] rounded-full mix-blend-screen filter blur-[200px] opacity-[0.05] pointer-events-none"></div>
                <main className="relative z-10 px-4 text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-12 rounded-[2.5rem] border border-white/10 max-w-lg w-full bg-[#0A0319]/80 backdrop-blur-xl">
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-[#7b3fe4]/10 border border-[#7b3fe4]/30 flex items-center justify-center mb-8 glow-purple">
                            <Lock size={36} className="text-[#a855f7]" />
                        </div>
                        <h2 className="text-3xl font-bold font-heading mb-4">Authentication Required</h2>
                        <p className="text-gray-400 mb-10 leading-relaxed font-light">The Artheron Master Kernel is locked. Connect an authorized administrator wallet to proceed.</p>
                        <button onClick={connectWallet} className="w-full py-4 rounded-xl bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 duration-200">Connect Admin Wallet</button>
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

            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#EF4444] rounded-full mix-blend-screen filter blur-[300px] opacity-[0.04] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#7b3fe4] rounded-full mix-blend-screen filter blur-[250px] opacity-[0.03] pointer-events-none"></div>

            <main ref={containerRef} className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-32 mb-20 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#EF4444]/20 border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444] animate-pulse">
                                <ShieldAlert size={18} />
                            </div>
                            <span className="text-[#EF4444] font-mono text-xs font-bold tracking-[0.2em] uppercase">Security Level 4: Master Kernel</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold font-heading">Admin <span className="text-gradient">Console</span></h1>
                    </motion.div>

                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md">
                        <div className="text-right">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Administrator</p>
                            <p className="text-sm font-mono text-white font-bold">{account.substring(0, 10)}...{account.slice(-8)}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EF4444] to-[#7b3fe4] p-0.5">
                            <div className="w-full h-full rounded-full bg-[#07010f] flex items-center justify-center">
                                <Users size={16} className="text-[#EF4444]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { title: 'Total Holders', value: Math.ceil(displayStats.holders).toLocaleString(), change: '+342', icon: <Users />, color: '#00F5FF' },
                        { title: 'Market Cap', value: `$${displayStats.mcap.toFixed(1)}M`, change: '+12%', icon: <Activity />, color: '#22C55E' },
                        { title: 'Liquidity Pool', value: `$${displayStats.liquidity.toFixed(1)}M`, change: '+1.5%', icon: <Database />, color: '#F59E0B' },
                        { title: 'Staked Supply', value: `${Math.ceil(displayStats.staked)}%`, change: '+0.5%', icon: <Zap />, color: '#7C3AED' }
                    ].map((stat, i) => (
                        <div key={i} className="admin-card hover-3d glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.01] relative overflow-hidden transition-all hover:border-white/20">
                            <div className="card-inner-glow absolute -top-10 -right-10 w-32 h-32 rounded-full mix-blend-screen filter blur-[50px] opacity-[0.08]" style={{ backgroundColor: stat.color }}></div>
                            <div className="relative z-10 flex justify-between items-start mb-6">
                                <div className="p-3 rounded-xl bg-white/5 text-white/70 border border-white/10 transition-transform group-hover:scale-110" style={{ color: stat.color }}>
                                    {React.cloneElement(stat.icon, { size: 20 })}
                                </div>
                                <span className="text-[10px] font-bold px-2 py-1 rounded-md border border-white/5 bg-white/5 text-white/50">{stat.change} 24H</span>
                            </div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-bold">{stat.title}</p>
                            <h3 className="text-3xl font-bold font-mono text-white tracking-tighter">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                {/* Main Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Smart Contracts */}
                    <div className="lg:col-span-8 admin-card glass-panel rounded-3xl border border-white/5 p-8 relative overflow-hidden bg-white/[0.01]">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-bold font-heading flex items-center gap-3">
                                <Database className="text-[#EF4444]" /> Active <span className="text-gradient">Contracts</span>
                            </h3>
                            <div className="flex gap-2">
                                <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"><Activity size={14} /></button>
                                <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"><Globe size={14} /></button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { name: 'Main Token Contract', addr: '0x1234...ABCD', status: 'Unpaused', color: '#22C55E' },
                                { name: 'Staking Pool V1', addr: '0x8888...9999', status: 'Active', color: '#22C55E' },
                                { name: 'Team Vesting Lock', addr: '0x4444...5555', status: 'Locked (340 days)', color: '#F59E0B' }
                            ].map((contract, i) => (
                                <div key={i} className="group/item flex items-center justify-between p-5 bg-[#0a0319] rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 font-mono text-xs font-bold border border-white/10 group-hover/item:border-[#EF4444]/30 group-hover/item:text-[#EF4444] transition-colors">{i + 1}</div>
                                        <div>
                                            <p className="font-bold text-white mb-0.5">{contract.name}</p>
                                            <p className="text-xs text-gray-500 font-mono tracking-wider">{contract.addr}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase border" style={{ backgroundColor: contract.color + '10', color: contract.color, borderColor: contract.color + '30' }}>{contract.status}</span>
                                        <ChevronRight size={16} className="text-gray-700 group-hover/item:text-white transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 pt-8 border-t border-white/5">
                            <button className="relative px-8 py-3 bg-[#EF4444]/10 hover:bg-[#EF4444] text-[#EF4444] hover:text-white border border-[#EF4444]/40 rounded-xl font-bold transition-all text-xs tracking-widest uppercase overflow-hidden group/btn shadow-[0_0_20px_rgba(239,68,68,0.1)] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                                Emergency System Pause
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="admin-card glass-panel p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent relative overflow-hidden group transition-all hover:border-[#7b3fe4]/30">
                            <div className="card-inner-glow absolute -bottom-10 -right-10 w-32 h-32 bg-[#7b3fe4] rounded-full mix-blend-screen filter blur-[60px] opacity-10"></div>
                            <h3 className="text-lg font-bold font-heading mb-6 flex items-center gap-2 text-white">
                                <Zap size={18} className="text-[#a855f7]" /> Fast Controls
                            </h3>
                            <div className="space-y-4">
                                <button className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-left transition-all hover:-translate-y-1 group/btn">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-[#22d3ee] tracking-widest uppercase">Messaging</span>
                                        <Activity size={14} className="text-gray-700 group-hover/btn:text-[#22d3ee] transition-colors" />
                                    </div>
                                    <h4 className="font-bold text-sm text-white mb-1">Update Announcements</h4>
                                    <p className="text-[10px] text-gray-500 leading-tight">Push global banner alerts to landing.</p>
                                </button>
                                <button className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-left transition-all hover:-translate-y-1 group/btn">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-[#a855f7] tracking-widest uppercase">Liquidity</span>
                                        <Database size={14} className="text-gray-700 group-hover/btn:text-[#a855f7] transition-colors" />
                                    </div>
                                    <h4 className="font-bold text-sm text-white mb-1">Inject Reserves</h4>
                                    <p className="text-[10px] text-gray-500 leading-tight">Rebalance liquidity across pools.</p>
                                </button>
                            </div>
                        </div>

                        <div className="admin-card glass-panel p-8 rounded-3xl border border-[#EF4444]/20 bg-[#EF4444]/5 relative overflow-hidden text-center group transition-all hover:bg-[#EF4444]/10">
                            <div className="w-16 h-16 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center mb-6 mx-auto text-[#EF4444] transition-transform duration-500 group-hover:scale-110">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="text-lg font-bold font-heading mb-2 text-white">Kernel Integrity</h3>
                            <p className="text-xs text-gray-500 leading-relaxed mb-6">System health is at <span className="text-[#22C55E] font-bold">99.9%</span>. No security vulnerabilities detected in the last scan.</p>
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors text-white">Refresh Analytics</button>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AdminPanel;
