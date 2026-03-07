import React from 'react';
import { motion } from 'framer-motion';

const exchanges = [
    { name: 'PancakeSwap', tier: 'Phase 1 - Live', color: '#1FC7D4' },
    { name: 'Uniswap', tier: 'Phase 1 - Live', color: '#FF007A' },
    { name: 'MEXC', tier: 'Phase 2 - Upcoming', color: '#16B979' },
    { name: 'Gate.io', tier: 'Phase 2 - Upcoming', color: '#00D1FF' },
    { name: 'BitMart', tier: 'Phase 2 - Upcoming', color: '#FFFFFF' },
    { name: 'KuCoin', tier: 'Phase 3 - Future', color: '#23AF91' },
    { name: 'Bybit', tier: 'Phase 3 - Future', color: '#F7A600' },
    { name: 'OKX', tier: 'Phase 3 - Future', color: '#FFFFFF' }
];

const Exchanges = () => {
    return (
        <section id="exchanges" className="py-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent via-[#00F5FF]/5 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
                        Supported <span className="text-gradient">Exchanges</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Where to buy, trade, and hold Artheron ARTH tokens.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {exchanges.map((exchange, index) => {
                        const isLive = exchange.tier.includes('Live');
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center group cursor-pointer border ${isLive ? 'border-[#00F5FF]/30' : 'border-white/5'} hover:border-[${exchange.color}]/50 transition-all duration-300 hover:-translate-y-2`}
                            >
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-4 bg-gray-800 group-hover:bg-opacity-80 transition-all duration-300"
                                    style={{ color: exchange.color, boxShadow: `inset 0 0 20px ${exchange.color}20` }}
                                >
                                    {exchange.name.charAt(0)}
                                </div>
                                <h3 className="text-lg font-bold font-heading mb-2 group-hover:text-white transition-colors text-gray-200">{exchange.name}</h3>
                                <span className={`text-xs px-3 py-1 rounded-full ${isLive ? 'bg-[#00F5FF]/10 text-[#00F5FF]' : 'bg-gray-800 text-gray-400'}`}>
                                    {exchange.tier}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Exchanges;
