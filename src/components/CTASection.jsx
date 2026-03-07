import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
    return (
        <section className="py-24 relative bg-[#07010f] overflow-hidden">
            {/* Dynamic Glowing Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#7b3fe4]/20 via-transparent to-[#22d3ee]/20 opacity-50"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#7b3fe4] to-[#22d3ee] filter blur-[150px] opacity-20 pointer-events-none rounded-[100%] mix-blend-screen"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="glass-panel p-12 md:p-16 rounded-[40px] border border-[#a855f7]/20 shadow-[0_0_50px_rgba(123,63,228,0.15)] relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white leading-tight">
                        Ready to transform <br />
                        your digital finances?
                    </h2>

                    <p className="text-xl text-gray-400 font-light mb-10 max-w-2xl mx-auto">
                        Join thousands of businesses and individuals utilizing the most advanced crypto payment gateway in the industry.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                        <Link to="/buy">
                            <button className="px-10 py-5 bg-gradient-to-r from-[#7b3fe4] to-[#a855f7] text-white rounded-2xl font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(123,63,228,0.4)]">
                                Create Free Account <ArrowRight size={20} />
                            </button>
                        </Link>
                        <button className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center">
                            Contact Sales
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
