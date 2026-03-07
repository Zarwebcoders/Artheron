import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Image, ArrowRightLeft, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductShowcase = () => {
    const [activeTab, setActiveTab] = useState('wallet');

    const products = {
        wallet: {
            id: 'wallet',
            icon: <Wallet className="text-[#00F5FF]" size={24} />,
            title: 'Artheron Wallet',
            description: 'Your secure portal to Web3. Manage thousands of tokens and NFTs across 15+ networks natively in one beautifully designed interface.',
            stats: { primary: '2M+', label: 'Active Devices' },
            action: 'Download Extension',
            image: (
                <div className="w-full h-full bg-gradient-to-br from-[#050814] to-[#111827] rounded-2xl border border-white/10 p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#00F5FF] rounded-full mix-blend-screen filter blur-[80px] opacity-20"></div>
                    <div className="flex justify-between items-center z-10">
                        <span className="text-white font-bold font-mono">My Portfolio</span>
                        <span className="text-xs text-[#00F5FF] bg-[#00F5FF]/10 px-2 py-1 rounded-full border border-[#00F5FF]/20">+14.2%</span>
                    </div>
                    <div className="my-8 z-10">
                        <h4 className="text-5xl font-mono text-white tracking-tighter">$14,295.50</h4>
                    </div>
                    <div className="flex gap-4 z-10">
                        <button className="flex-1 py-3 rounded-xl bg-[#00F5FF] text-black font-bold">Send</button>
                        <button className="flex-1 py-3 rounded-xl bg-white/10 text-white font-bold border border-white/10">Receive</button>
                    </div>
                </div>
            )
        },
        dex: {
            id: 'dex',
            icon: <ArrowRightLeft className="text-[#7C3AED]" size={24} />,
            title: 'Decentralized Exchange',
            description: 'Swap assets with near-zero slippage. Our advanced routing algorithm aggregates liquidity across 50 DEXs to give you the absolute best price.',
            stats: { primary: '$4.2B', label: '24h Volume' },
            action: 'Launch DEX',
            link: '/buy',
            image: (
                <div className="w-full h-full bg-gradient-to-br from-[#050814] to-[#111827] rounded-2xl border border-white/10 p-6 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#7C3AED] rounded-full mix-blend-screen filter blur-[80px] opacity-20"></div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mb-2 z-10">
                        <p className="text-xs text-gray-400 mb-2">You Pay</p>
                        <div className="flex justify-between text-2xl font-mono">
                            <span>1,000</span>
                            <span className="text-[#00F5FF]">USDC</span>
                        </div>
                    </div>
                    <div className="flex justify-center z-10 -my-3">
                        <div className="w-8 h-8 rounded-full bg-gray-800 border-4 border-[#050814] flex items-center justify-center text-gray-400">↓</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mt-2 z-10">
                        <p className="text-xs text-gray-400 mb-2">You Receive</p>
                        <div className="flex justify-between text-2xl font-mono">
                            <span>22,123.4</span>
                            <span className="text-[#7C3AED]">ARTH</span>
                        </div>
                    </div>
                    <button className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#00F5FF] text-white font-bold z-10">Confirm Swap</button>
                </div>
            )
        },
        earn: {
            id: 'earn',
            icon: <Activity className="text-[#10B981]" size={24} />,
            title: 'Staking & Earn',
            description: 'Put your crypto to work. Stake ARTH to secure the network and earn attractive APYs, all executed automatically via audited smart contracts.',
            stats: { primary: '12.5%', label: 'Current APY' },
            action: 'Start Earning',
            link: '/staking',
            image: (
                <div className="w-full h-full bg-gradient-to-br from-[#050814] to-[#111827] rounded-2xl border border-white/10 p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -bottom-20 right-0 w-64 h-64 bg-[#10B981] rounded-full mix-blend-screen filter blur-[80px] opacity-20"></div>
                    <div className="z-10">
                        <p className="text-gray-400 text-sm mb-1">Total Value Locked</p>
                        <h4 className="text-4xl font-mono text-white mb-6">$1.45B</h4>
                        <div className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                                <div>
                                    <p className="text-white font-bold">ARTH Staking</p>
                                    <p className="text-xs text-gray-400">Lock for 14 days</p>
                                </div>
                                <span className="text-[#10B981] font-mono font-bold">12.5% APY</span>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                                <div>
                                    <p className="text-white font-bold">USDT / USDC LP</p>
                                    <p className="text-xs text-gray-400">Stable liquidity</p>
                                </div>
                                <span className="text-[#00F5FF] font-mono font-bold">8.4% APY</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    };

    return (
        <section id="products" className="py-32 relative bg-gradient-premium border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="max-w-xl">
                        <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
                            A complete <span className="text-gradient">DeFi Stack</span>
                        </h2>
                        <p className="text-xl text-gray-400 font-light">
                            Everything you need to navigate the decentralized web, perfectly integrated into one powerful ecosystem.
                        </p>
                    </div>

                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 self-start">
                        {Object.values(products).map((product) => (
                            <button
                                key={product.id}
                                onClick={() => setActiveTab(product.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === product.id
                                    ? 'bg-white/10 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <span className="hidden sm:block">{product.icon}</span>
                                {product.title.split(' ')[0]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="glass-panel rounded-3xl p-2 h-[600px] md:h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.4 }}
                            className="h-full w-full grid md:grid-cols-2 gap-2"
                        >
                            {/* Product Details (Left) */}
                            <div className="bg-[#050814]/80 rounded-2xl p-8 md:p-12 flex flex-col justify-center">
                                <div className="mb-6 p-4 bg-white/5 rounded-2xl inline-flex border border-white/10 w-fit">
                                    {products[activeTab].icon}
                                </div>
                                <h3 className="text-3xl font-bold font-heading mb-4 text-white">
                                    {products[activeTab].title}
                                </h3>
                                <p className="text-lg text-gray-400 leading-relaxed mb-8">
                                    {products[activeTab].description}
                                </p>

                                <div className="flex items-center gap-8 mb-10">
                                    <div>
                                        <h4 className="text-3xl font-mono font-bold text-white">{products[activeTab].stats.primary}</h4>
                                        <p className="text-sm text-gray-500 uppercase tracking-wider mt-1">{products[activeTab].stats.label}</p>
                                    </div>
                                </div>

                                {products[activeTab].link ? (
                                    <Link to={products[activeTab].link}>
                                        <button className="px-8 py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition-colors w-fit">
                                            {products[activeTab].action}
                                        </button>
                                    </Link>
                                ) : (
                                    <button className="px-8 py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition-colors w-fit">
                                        {products[activeTab].action}
                                    </button>
                                )}
                            </div>

                            {/* Product Visual (Right) */}
                            <div className="rounded-2xl overflow-hidden h-full">
                                {products[activeTab].image}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
};

export default ProductShowcase;
