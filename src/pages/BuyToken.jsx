import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollProgressBar from '../components/ScrollProgressBar';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ArrowDown, Settings, Clock, Activity, Wallet, ShieldCheck, TrendingUp } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const BuyToken = () => {
    const { account, balance, isConnecting, connectWallet } = useWallet();
    const [bnbAmount, setBnbAmount] = useState('');
    const [arthAmount, setArthAmount] = useState('');
    const [displayPrice, setDisplayPrice] = useState(0); // State-based counter for stability
    const containerRef = useRef(null);

    const exchangeRate = 12500; // 1 BNB = 12500 ARTH mock rate
    const bnbBalance = 2.45; // Mock BNB balance

    useEffect(() => {
        if (!containerRef.current) return;

        let ctx = gsap.context(() => {
            // 1. Staggered Entry Animation
            gsap.fromTo(".buy-card",
                { y: 50, opacity: 0, scale: 0.95, rotationX: -10 },
                { y: 0, opacity: 1, scale: 1, rotationX: 0, stagger: 0.15, duration: 1, ease: "back.out(1.2)" }
            );

            // 2. Price Counter Animation using State (Zero DOM Ref needed)
            // This architecture handles component re-mounts safely.
            const ticker = { val: 0 };
            gsap.to(ticker, {
                val: 0.0452,
                duration: 2,
                ease: "power2.out",
                onUpdate: function () {
                    setDisplayPrice(ticker.val);
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
                        ease: "elastic.out(1, 0.4)",
                        duration: 1.5
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
    }, []);

    const handleBnbChange = (e) => {
        const val = e.target.value;
        setBnbAmount(val);
        if (val && !isNaN(val)) {
            setArthAmount((parseFloat(val) * exchangeRate).toFixed(2));
        } else {
            setArthAmount('');
        }
    };

    return (
        <div className="relative w-full min-h-screen bg-[#07010f] text-white flex flex-col overflow-hidden">
            <ScrollProgressBar />
            <Navbar />

            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#22d3ee] rounded-full mix-blend-screen filter blur-[250px] opacity-[0.03] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#7b3fe4] rounded-full mix-blend-screen filter blur-[250px] opacity-[0.03] pointer-events-none"></div>

            <main ref={containerRef} className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-32 mb-20 relative z-10">

                <div className="flex flex-col lg:flex-row gap-12 items-start">

                    <div className="lg:col-span-4 w-full lg:max-w-md space-y-6">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 tracking-tight">Buy <span className="text-gradient">ARTH</span></h1>
                            <p className="text-gray-400 font-light leading-relaxed">Secure your position in the future of decentralized payments. Trade BNB for ARTH instantly with zero extra fees.</p>
                        </motion.div>

                        <div className="buy-card hover-3d glass-panel p-8 rounded-[2rem] border border-white/10 relative overflow-hidden bg-[#0A0319]/80 backdrop-blur-md transition-[border-color] duration-500 hover:border-[#22d3ee]/30">
                            <div className="card-inner-glow absolute top-0 right-0 w-40 h-40 bg-[#22d3ee] rounded-full mix-blend-screen filter blur-[60px] opacity-10"></div>

                            <div className="flex justify-between items-center mb-8 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7b3fe4] to-[#22d3ee] flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(123,63,228,0.3)]">
                                        <span className="text-xl">AR</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">ARTH/BNB</h3>
                                        <p className="text-xs text-gray-500 font-mono tracking-wider">PANCAKESWAP V2</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[#22C55E] font-bold font-mono">+12.4%</span>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">24H High</span>
                                </div>
                            </div>

                            <div className="mb-10 relative z-10">
                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold opacity-70">Current Market Price</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xs text-gray-400 font-mono italic">$</span>
                                    <span className="text-4xl md:text-5xl font-bold font-mono tracking-tighter text-white">{displayPrice.toFixed(4)}</span>
                                    <span className="text-sm text-gray-400 font-medium">USD</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                {[
                                    { label: "Market Cap", value: "$19.8M" },
                                    { label: "24h Volume", value: "$1.2M" },
                                    { label: "Holders", value: "12,450" },
                                    { label: "Circulating", value: "110M" }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-[#050814] rounded-2xl p-4 border border-white/5 transition-colors hover:border-white/10">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">{stat.label}</p>
                                        <p className="font-bold text-white font-mono">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="glass-panel p-5 rounded-2xl border border-[#F3BA2F]/20 flex items-start gap-4 bg-gradient-to-r from-[#F3BA2F]/5 to-transparent"
                        >
                            <div className="w-10 h-10 rounded-lg bg-[#F3BA2F]/10 flex items-center justify-center text-[#F3BA2F] flex-shrink-0 animate-pulse">
                                <Activity size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[#F3BA2F] mb-1">Trading is Live</h4>
                                <p className="text-xs text-gray-400 leading-relaxed font-light">Swap is active on PancakeSwap. Please maintain at least <span className="text-white font-bold">0.01 BNB</span> for blockchain gas fees.</p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-8 w-full flex justify-center">
                        <div className="buy-card hover-3d w-full max-w-lg glass-panel rounded-[2.5rem] p-8 md:p-10 border border-white/10 shadow-[0_0_80px_rgba(123,63,228,0.1)] relative overflow-hidden bg-[#0A0319]">
                            <div className="card-inner-glow absolute top-0 right-0 w-[500px] h-[500px] bg-[#a855f7] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.08] pointer-events-none"></div>

                            <div className="flex justify-between items-center mb-10 relative z-10">
                                <h2 className="font-bold font-heading text-2xl text-white tracking-tight">Swap <span className="text-gradient">Tokens</span></h2>
                                <div className="flex gap-4">
                                    <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Settings size={20} /></button>
                                    <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Clock size={20} /></button>
                                </div>
                            </div>

                            <div className="bg-[#050814] rounded-3xl p-6 mb-2 border border-white/10 hover:border-white/20 transition-all group relative z-10">
                                <div className="flex justify-between mb-4 px-1">
                                    <span className="text-sm text-gray-400 font-medium">You Pay</span>
                                    {account && <span className="text-xs text-gray-500 font-mono tracking-wide">BALANCE: {bnbBalance} BNB</span>}
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={bnbAmount}
                                        onChange={handleBnbChange}
                                        className="bg-transparent text-4xl md:text-5xl font-mono text-white outline-none w-full placeholder:text-white/10"
                                    />
                                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-2xl border border-white/10 shadow-sm">
                                        <img src="https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=025" alt="BNB" className="w-6 h-6 animate-pulse" />
                                        <span className="font-bold text-white">BNB</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative h-4 flex justify-center items-center z-20">
                                <div className="w-12 h-12 bg-[#0A0319] border-4 border-[#07010f] rounded-2xl flex items-center justify-center text-[#22d3ee] shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
                                    <ArrowDown size={22} className="animate-bounce mt-1" />
                                </div>
                            </div>

                            <div className="bg-[#050814] rounded-3xl p-6 mt-2 mb-10 border border-white/10 hover:border-white/20 transition-all group relative z-10">
                                <div className="flex justify-between mb-4 px-1">
                                    <span className="text-sm text-gray-400 font-medium">You Receive</span>
                                    {account && <span className="text-xs text-gray-500 font-mono tracking-wide">BALANCE: {balance} ARTH</span>}
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <input
                                        type="text"
                                        placeholder="0.00"
                                        value={arthAmount}
                                        readOnly
                                        className="bg-transparent text-4xl md:text-5xl font-mono text-white outline-none w-full placeholder:text-white/10"
                                    />
                                    <div className="flex items-center gap-3 bg-gradient-to-r from-[#7b3fe4]/20 to-[#22d3ee]/20 border border-[#22d3ee]/30 px-4 py-2.5 rounded-2xl shadow-lg">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7b3fe4] to-[#22d3ee] animate-spin-slow"></div>
                                        <span className="font-bold text-white">ARTH</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 group/btnwrap">
                                {!account ? (
                                    <button
                                        onClick={connectWallet}
                                        className="w-full py-5 rounded-2xl bg-white text-black font-bold text-center text-lg uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-95 duration-200"
                                    >
                                        Connect Wallet
                                    </button>
                                ) : (
                                    <button
                                        disabled={!bnbAmount || parseFloat(bnbAmount) <= 0 || parseFloat(bnbAmount) > bnbBalance}
                                        className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#7b3fe4] to-[#a855f7] text-white font-bold text-center text-lg uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(34,211,238,0.4)] hover:from-[#a855f7] hover:to-[#22d3ee] disabled:opacity-30 disabled:cursor-not-allowed disabled:grayscale disabled:scale-100 hover:scale-[1.02] active:scale-95 duration-200"
                                    >
                                        {!bnbAmount || parseFloat(bnbAmount) <= 0
                                            ? 'Enter Amount'
                                            : parseFloat(bnbAmount) > bnbBalance
                                                ? 'Insufficient BNB'
                                                : 'Swap Tokens'}
                                    </button>
                                )}
                            </div>

                            <AnimatePresence>
                                {bnbAmount && parseFloat(bnbAmount) > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-8 px-2 space-y-3"
                                    >
                                        <div className="flex justify-between items-center text-xs text-gray-500 font-mono">
                                            <span>Current Rate</span>
                                            <span className="text-white">1 BNB = {exchangeRate.toLocaleString()} ARTH</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-gray-500 font-mono">
                                            <span>Slippage Tolerance</span>
                                            <span className="text-[#22d3ee]">0.5%</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BuyToken;
