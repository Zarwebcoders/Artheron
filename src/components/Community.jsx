import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Twitter, Disc, Users } from 'lucide-react';

const Community = () => {
    const socials = [
        {
            name: 'Discord',
            description: 'Join the daily conversation, get support, and hang out with the team.',
            icon: <Disc size={36} className="text-[#5865F2]" />,
            link: '#',
            color: 'bg-[#5865F2]/10',
            border: 'border-[#5865F2]/30',
            hover: 'hover:border-[#5865F2]',
            members: '124k+'
        },
        {
            name: 'Telegram',
            description: 'Get the latest announcements, updates, and chat with global members.',
            icon: <Send size={36} className="text-[#0088cc]" />,
            link: '#',
            color: 'bg-[#0088cc]/10',
            border: 'border-[#0088cc]/30',
            hover: 'hover:border-[#0088cc]',
            members: '89k+'
        },
        {
            name: 'Twitter',
            description: 'Follow our official alerts, partnerships, and ecosystem developments.',
            icon: <Twitter size={36} className="text-[#1DA1F2]" />,
            link: '#',
            color: 'bg-[#1DA1F2]/10',
            border: 'border-[#1DA1F2]/30',
            hover: 'hover:border-[#1DA1F2]',
            members: '215k+'
        }
    ];

    return (
        <section id="community" className="py-24 relative bg-[#050814] border-t border-white/5">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00F5FF] rounded-full mix-blend-screen filter blur-[200px] opacity-[0.03] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider mb-6">
                        <Users size={14} className="text-[#00F5FF]" /> Global Network
                    </div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold font-heading mb-6"
                    >
                        Join the <span className="text-gradient">Movement</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-400 font-light"
                    >
                        Connect with over 400,000+ Artherians worldwide. Build, govern, and shape the decentralized future with us.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {socials.map((social, index) => (
                        <motion.a
                            href={social.link}
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`glass-panel p-8 rounded-2xl border transition-all duration-300 transform hover:-translate-y-2 group ${social.hover} bg-white/[0.02]`}
                            style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${social.color} border ${social.border} transition-transform group-hover:scale-110`}>
                                    {social.icon}
                                </div>
                                <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-mono text-gray-300">
                                    {social.members}
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold font-heading text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                                {social.name}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {social.description}
                            </p>
                        </motion.a>
                    ))}
                </div>

                {/* Newsletter/Action Box */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 glass-panel p-8 md:p-12 rounded-3xl border border-white/5 bg-gradient-to-br from-[#050814] to-[#0A0F24] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group"
                >
                    {/* Subtle Glow inside box */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-full bg-[#7C3AED] mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity"></div>

                    <div className="max-w-xl relative z-10 text-center md:text-left">
                        <h3 className="text-2xl font-bold font-heading text-white mb-2">Never miss an update</h3>
                        <p className="text-gray-400">Subscribe for major protocol upgrades, governance votes, and community drops.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 relative z-10">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full sm:w-64 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00F5FF]/50 focus:ring-1 focus:ring-[#00F5FF]/50 transition-all font-mono text-sm"
                        />
                        <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                            Subscribe
                        </button>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default Community;
