import React from 'react';
import { Twitter, Disc, Github, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#07010f] pt-20 pb-10 border-t border-white/5 relative overflow-hidden">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

                    {/* Brand Col */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2 group mb-6 cursor-pointer inline-flex">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22d3ee] to-[#7b3fe4] flex items-center justify-center group-hover:glow-purple transition-all">
                                <Rocket size={18} className="text-white" />
                            </div>
                            <span className="text-xl font-bold font-heading text-white tracking-tight">
                                Artheron Pay
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
                            The premier crypto payment gateway. Accept, store, and manage digital assets seamlessly with institutional-grade security.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:scale-105"><Twitter size={18} /></a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:scale-105"><Disc size={18} /></a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:scale-105"><Github size={18} /></a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="font-bold font-heading text-white mb-6 uppercase tracking-wider text-sm">Products</h4>
                        <ul className="space-y-4">
                            <li><Link to="/buy" className="text-gray-400 hover:text-[#22d3ee] text-sm transition-colors">Individuals</Link></li>
                            <li><Link to="/buy" className="text-gray-400 hover:text-[#22d3ee] text-sm transition-colors">Businesses</Link></li>
                            <li><Link to="/dashboard" className="text-gray-400 hover:text-[#22d3ee] text-sm transition-colors">Global Wallet</Link></li>
                            <li><Link to="/staking" className="text-gray-400 hover:text-[#22d3ee] text-sm transition-colors">Yield Connect</Link></li>
                        </ul>
                    </div>

                    {/* Developers */}
                    <div>
                        <h4 className="font-bold font-heading text-white mb-6 uppercase tracking-wider text-sm">Developers</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-400 hover:text-[#22d3ee] text-sm transition-colors">Documentation</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-[#22d3ee] text-sm transition-colors">API Reference</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-[#22d3ee] text-sm transition-colors">SDKs & Libraries</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-[#22d3ee] text-sm transition-colors">System Status</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-bold font-heading text-white mb-6 uppercase tracking-wider text-sm">Legal</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-400 hover:text-[#22d3ee] text-sm transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-[#22d3ee] text-sm transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-[#22d3ee] text-sm transition-colors">Cookie Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-[#22d3ee] text-sm transition-colors">Licenses</a></li>
                        </ul>
                    </div>

                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col items-center">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Artheron Pay. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
