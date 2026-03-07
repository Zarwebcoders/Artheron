import React from 'react';
import { motion } from 'framer-motion';
import { Link2, Share2, Wallet } from 'lucide-react';

const Features = () => {
    const steps = [
        {
            title: "Create Payment Link",
            description: "Generate a universal checkout link in seconds. No coding required. Select your accepted currencies and set the price.",
            icon: <Link2 size={32} className="text-[#22d3ee]" />,
            gradient: "from-[#22d3ee]/20 to-transparent",
            glow: "glow-blue"
        },
        {
            title: "Share the Link",
            description: "Send your custom link to clients, embed it on your website, or share it on social media. Global reach instantly.",
            icon: <Share2 size={32} className="text-[#a855f7]" />,
            gradient: "from-[#a855f7]/20 to-transparent",
            glow: "glow-purple"
        },
        {
            title: "Get Paid",
            description: "Receive funds directly into your secure wallet. Instant settlement with zero chargebacks. Convert to fiat anytime.",
            icon: <Wallet size={32} className="text-[#7b3fe4]" />,
            gradient: "from-[#7b3fe4]/20 to-transparent",
            glow: "glow-purple"
        }
    ];

    return (
        <section id="features" className="py-24 relative bg-[#07010f]">
            {/* Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7b3fe4] rounded-full mix-blend-screen filter blur-[200px] opacity-[0.05] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="text-center max-w-3xl mx-auto mb-20 text-white">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold font-heading mb-6"
                    >
                        Payments Made <span className="text-gradient">Effortless</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-400 font-light"
                    >
                        A streamlined infrastructure designed to process global transactions with absolute security.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 text-white">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="glass-panel p-8 rounded-3xl border border-white/5 relative group overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-[#22d3ee]/30"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                            <div className="relative z-10">
                                <div className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 relative ${step.glow}`}>
                                    {step.icon}
                                </div>

                                <h3 className="text-2xl font-bold font-heading mb-4 text-white">
                                    {step.title}
                                </h3>

                                <p className="text-gray-400 leading-relaxed font-light">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
