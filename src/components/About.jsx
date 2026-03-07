import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <section id="about" className="py-24 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-[#7C3AED] rounded-full mix-blend-screen filter blur-[128px] opacity-20 -translate-y-1/2 z-0 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="glass-panel rounded-3xl p-8 md:p-16 border border-white/5 relative overflow-hidden"
                >
                    {/* subtle inner glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00F5FF] rounded-full mix-blend-screen filter blur-[80px] opacity-30 pointer-events-none"></div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
                                What is <span className="text-gradient">Artheron?</span>
                            </h2>
                            <p className="text-xl text-gray-300 leading-relaxed mb-8">
                                Artheron is a decentralized digital asset designed to empower the next generation of Web3 users. Built on the BNB Chain, Artheron offers fast transactions, transparent governance, and community-driven growth.
                            </p>

                            <ul className="space-y-4">
                                {[
                                    "Fast & Secure Transactions",
                                    "Community-Driven Governance",
                                    "Built on BNB Chain",
                                    "Deflationary Mechanics"
                                ].map((item, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        className="flex items-center space-x-3 text-gray-200"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#00F5FF] flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>{item}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative h-full min-h-[300px] flex items-center justify-center">
                            <div className="w-full h-full glass-panel rounded-2xl flex items-center justify-center p-8 glow-purple">
                                {/* Abstract representation of the token network */}
                                <div className="relative w-48 h-48">
                                    <div className="absolute inset-0 border-4 border-[#7C3AED]/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                    <div className="absolute inset-4 border-4 border-[#00F5FF]/40 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                                    <div className="absolute inset-8 border-4 border-[#22C55E]/50 rounded-full animate-[spin_20s_linear_infinite]"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold font-heading text-white">
                                        ARTH
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
