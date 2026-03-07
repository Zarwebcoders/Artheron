import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Server, CheckCircle2 } from 'lucide-react';

const Security = () => {
    const features = [
        {
            title: "Multi-layer Encryption",
            description: "Industrial-grade end-to-end encryption securing your assets and data in transit and at rest.",
            icon: <ShieldCheck size={32} className="text-[#a855f7]" />,
            glow: "glow-purple"
        },
        {
            title: "98% Cold Storage",
            description: "The vast majority of digital assets are stored offline in geographically distributed, air-gapped hardware.",
            icon: <Lock size={32} className="text-[#22d3ee]" />,
            glow: "glow-blue"
        },
        {
            title: "Decentralized Verification",
            description: "No single point of failure. Consensus mechanisms validate every transaction globally.",
            icon: <Server size={32} className="text-[#7b3fe4]" />,
            glow: "glow-purple"
        }
    ];

    return (
        <section id="security" className="py-24 relative bg-[#0c0218]">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-bl from-[#7b3fe4]/10 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider mb-6">
                            <ShieldCheck size={14} className="text-[#22d3ee]" /> Bank-Grade Security
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 leading-tight text-white">
                            Uncompromising <br />
                            <span className="text-gradient">Protection.</span>
                        </h2>
                        <p className="text-xl text-gray-400 font-light mb-10">
                            We deploy military-grade architecture, rigorous independent audits, and constant threat monitoring to ensure your peace of mind.
                        </p>

                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all"
                                >
                                    <div className={`w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 ${feature.glow}`}>
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-1">{feature.title}</h4>
                                        <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative h-[600px] hidden lg:block"
                    >
                        {/* Visual representation of security shield/lock */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[300px] h-[400px] rounded-[40px] border-2 border-[#7b3fe4]/30 bg-gradient-to-b from-[#07010f] to-[#0c0218] p-1 shadow-[0_0_80px_rgba(123,63,228,0.2)] flex flex-col items-center justify-center relative overflow-hidden">
                                {/* Glows */}
                                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-[#22d3ee] to-transparent opacity-50"></div>

                                <ShieldCheck size={120} className="text-[#7b3fe4] mb-8 opacity-80" strokeWidth={1} />
                                <div className="text-center space-y-4 px-6">
                                    <div className="flex items-center justify-center gap-2 text-[#10B981] font-mono text-sm bg-[#10B981]/10 px-3 py-1 rounded-full w-full">
                                        <CheckCircle2 size={16} /> Systems Nominal
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-r from-[#22d3ee] to-[#7b3fe4] rounded-full"></div>
                                    </div>
                                </div>

                                {/* Scanning line */}
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#22d3ee] shadow-[0_0_15px_#22d3ee] animate-[scan_3s_ease-in-out_infinite]"></div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0%, 100% { top: 0; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    50% { top: 100%; opacity: 1; }
                }
            `}</style>
        </section>
    );
};

export default Security;
