import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Coins, Droplets, Globe } from 'lucide-react';

const features = [
    {
        title: 'Fast Transactions',
        description: 'Lightning-fast block times ensure your transactions settle in seconds, not minutes.',
        icon: <Zap className="w-8 h-8 text-[#00F5FF]" />,
        delay: 0.1
    },
    {
        title: 'Low Fees',
        description: 'Negligible gas fees mean more of your investment goes towards actual value.',
        icon: <Coins className="w-8 h-8 text-[#7C3AED]" />,
        delay: 0.2
    },
    {
        title: 'High Liquidity',
        description: 'Deep liquidity pools ensure minimum slippage and easy entry/exit.',
        icon: <Droplets className="w-8 h-8 text-[#22C55E]" />,
        delay: 0.3
    },
    {
        title: 'Massive Ecosystem',
        description: 'Access to the largest retail user base and DeFi ecosystem in Web3.',
        icon: <Globe className="w-8 h-8 text-[#00F5FF]" />,
        delay: 0.4
    }
];

const Blockchain = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full border border-[#F3BA2F]/30 bg-[#F3BA2F]/10 mb-6"
                    >
                        <span className="text-sm font-medium text-[#F3BA2F]">Binance Smart Chain</span>
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
                        Powered by <span className="text-[#F3BA2F]">BNB Chain</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Artheron leverages the power of BNB Chain to provide an optimal experience for all users.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: feature.delay, duration: 0.5 }}
                            className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-[#F3BA2F]/50 transition-colors group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#F3BA2F]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-xl bg-gray-800/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold font-heading mb-3 text-white">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Blockchain;
