import React from 'react';
import { motion } from 'framer-motion';

const LiveStats = () => {
    const stats = [
        { label: 'Registered Users', value: '+14M', prefix: '' },
        { label: 'Quarterly Volume', value: '207', prefix: '$', suffix: 'B+' },
        { label: 'Transactions Processed', value: '890', prefix: '', suffix: 'M+' },
    ];

    return (
        <section className="py-24 relative bg-[#07010f] overflow-hidden">

            {/* Decorative gradient beam connecting stats */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#22d3ee] to-transparent opacity-30 transform -translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid md:grid-cols-3 gap-12 text-center md:divide-x md:divide-white/10">

                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="px-6 relative group"
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#7b3fe4] rounded-full mix-blend-screen filter blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"></div>

                            <h3 className="text-gray-400 font-mono text-sm tracking-widest uppercase mb-4 relative z-10">
                                {stat.label}
                            </h3>

                            <div className="flex items-center justify-center font-bold font-heading relative z-10">
                                <span className="text-4xl md:text-5xl lg:text-6xl text-white">
                                    {stat.prefix}{stat.value}
                                </span>
                                <span className="text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] to-[#7b3fe4] ml-1">
                                    {stat.suffix}
                                </span>
                            </div>
                        </motion.div>
                    ))}

                </div>
            </div>
        </section>
    );
};

export default LiveStats;
