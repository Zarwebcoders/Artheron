import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "What makes Artheron different from other DEXs?",
            answer: "Artheron utilizes a proprietary cross-chain liquidity routing algorithm that guarantees the lowest slippage across 15+ networks. Combined with our institutional-grade security architecture audited by CertiK, it provides unmatched efficiency and safety."
        },
        {
            question: "How does the ARTH token staking work?",
            answer: "Users can lock their ARTH tokens in our smart contracts to participate in network validation. In return, stakers receive protocol revenue share (up to 12.5% APY) and governance voting power proportional to their staked amount and lock duration."
        },
        {
            question: "Is the Artheron protocol fully decentralized?",
            answer: "Yes. All smart contracts are immutable and open-source. Protocol upgrades, fee structures, and treasury allocations are completely controlled by the Artheron DAO, ensuring no single entity has control over user funds or network rules."
        },
        {
            question: "What are the fees for trading on Artheron?",
            answer: "Artheron charges a flat 0.1% fee on standard swaps, which is distributed entirely to liquidity providers and ARTH stakers. There are zero hidden fees or withdrawal charges."
        },
        {
            question: "How is the Artheron team ensuring long-term project viability?",
            answer: "Our tokenomics model locks team tokens for 4 years with a 1-year cliff. Furthermore, 5% of all supplies are strictly reserved in an emergency treasury, and we continuously fund bug bounties to ensure maximum security."
        }
    ];

    return (
        <section id="faq" className="py-24 relative bg-gradient-premium border-t border-white/5">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider mb-6">
                        <HelpCircle size={14} className="text-[#3B82F6]" /> Support
                    </div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold font-heading mb-4"
                    >
                        Common <span className="text-gradient">Questions</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-400 font-light"
                    >
                        Everything you need to know about the Artheron ecosystem.
                    </motion.p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-panel rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/10 bg-white/[0.02]"
                        >
                            <button
                                className="w-full px-6 py-6 text-left flex justify-between items-center focus:outline-none"
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                            >
                                <span className={`font-bold text-lg md:text-xl font-heading transition-colors pr-8 ${activeIndex === index ? 'text-white' : 'text-gray-300'}`}>
                                    {faq.question}
                                </span>
                                <div className={`w-8 h-8 rounded-full flex justify-center items-center transition-colors flex-shrink-0 ${activeIndex === index ? 'bg-white/10 text-white' : 'bg-transparent text-gray-500'}`}>
                                    {activeIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                                </div>
                            </button>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <div className="px-6 pb-6 pt-0 text-gray-400 text-base leading-relaxed border-t border-white/5 mt-2 pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FAQ;
