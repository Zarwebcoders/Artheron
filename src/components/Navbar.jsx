import React, { useState, useEffect } from 'react';
import { Menu, X, Wallet, ChevronDown, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { account, balance, isConnecting, connectWallet, disconnectWallet } = useWallet();
    const { user, logout } = useAuth();

    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (href) => {
        setIsOpen(false);
        if (!isHome && href.startsWith('#')) {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(href.substring(1));
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    const navLinks = [
        { name: 'Products', href: '#features', isRoute: false },
        { name: 'Tokenomics', href: '#tokenomics', isRoute: false },
        { name: 'Company', href: '#roadmap', isRoute: false },
    ];

    const formatAddress = (address) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    const NavItem = ({ link }) => {
        if (link.isRoute) {
            return (
                <Link
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium transition-colors ${location.pathname === link.href ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    {link.name}
                </Link>
            );
        }

        // Hash link
        return (
            <a
                href={isHome ? link.href : '/'}
                onClick={(e) => {
                    if (isHome && link.href.startsWith('#')) {
                        e.preventDefault();
                        document.getElementById(link.href.substring(1))?.scrollIntoView({ behavior: 'smooth' });
                    } else if (!isHome) {
                        e.preventDefault();
                        handleNavClick(link.href);
                    }
                }}
                className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
                {link.name}
            </a>
        );
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-panel border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center cursor-pointer gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22d3ee] to-[#7b3fe4] flex items-center justify-center group-hover:glow-purple transition-all">
                            <Rocket size={18} className="text-white" />
                        </div>
                        <span className="text-xl font-bold font-heading text-white tracking-tight">
                            Artheron <span className="text-[#22d3ee] text-[10px] align-top ml-1 drop-shadow-[0_0_5px_#22d3ee]">PRO</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <NavItem key={link.name} link={link} />
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center space-x-6">
                        {account ? (
                            <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl px-4 py-2 hover:bg-white/10 transition-all">
                                <div className="text-right">
                                    <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest leading-none mb-1">Balance</p>
                                    <p className="text-[10px] font-mono font-bold text-white leading-none whitespace-nowrap">{parseFloat(balance).toLocaleString()} ARTH</p>
                                </div>
                                <div className="h-6 w-px bg-white/10"></div>
                                <button 
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 group"
                                >
                                    <span className="text-xs font-mono text-gray-400 group-hover:text-white transition-colors">{formatAddress(account)}</span>
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#7b3fe4] to-[#22d3ee] p-[1px]">
                                        <div className="w-full h-full bg-[#0A0319] rounded-full flex items-center justify-center text-white">
                                            <Wallet size={14} />
                                        </div>
                                    </div>
                                </button>
                                
                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-[-1]" onClick={() => setDropdownOpen(false)}></div>
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full right-0 mt-2 w-48 glass-panel border border-white/10 rounded-2xl p-2 shadow-2xl overflow-hidden"
                                            >
                                                <button 
                                                    onClick={() => { disconnectWallet(); setDropdownOpen(false); }}
                                                    className="w-full text-left px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-all flex items-center gap-3 uppercase tracking-widest"
                                                >
                                                    <X size={14} /> Disconnect
                                                </button>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            !user && (
                                <>
                                    <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-[0.1em]">
                                        Login
                                    </Link>
                                    <Link to="/register">
                                        <button className="bg-white text-black hover:bg-gray-100 px-6 py-2.5 rounded-xl font-bold transition-all transform hover:scale-[1.05] text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95">
                                            Join Artheron
                                        </button>
                                    </Link>
                                </>
                            )
                        )}
                        {!account && (
                            <button 
                                onClick={connectWallet}
                                disabled={isConnecting}
                                className="bg-[#22d3ee]/10 border border-[#22d3ee]/20 text-[#22d3ee] px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:bg-[#22d3ee]/20 hover:scale-105 active:scale-95 flex items-center gap-2 group"
                            >
                                <Wallet size={16} className="group-hover:rotate-12 transition-transform" />
                                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center gap-4">
                        {account && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#7b3fe4] to-[#22d3ee]"></div>
                        )}
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden glass-panel mt-4 mx-4 rounded-2xl overflow-hidden border border-white/10"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <div key={link.name} className="block">
                                    <NavItem link={link} />
                                </div>
                            ))}

                            <div className="pt-6 border-t border-white/5 space-y-4">
                                <Link to="/buy" onClick={() => setIsOpen(false)} className="block w-full text-center text-sm font-medium text-white hover:text-shadow-[0_0_10px_#22d3ee] transition-all py-2">
                                    Trade Crypto
                                </Link>

                                {account ? (
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                        <p className="text-xs text-gray-400 mb-1">Connected</p>
                                        <p className="text-sm font-mono text-white mb-3">{formatAddress(account)}</p>
                                        <p className="text-xs text-gray-400 mb-1">Balance</p>
                                        <p className="text-base font-bold font-mono text-white mb-4">{balance} ARTH</p>

                                        <button
                                            onClick={() => { disconnectWallet(); setIsOpen(false); }}
                                            className="w-full text-center border border-[#EF4444]/30 text-[#EF4444] px-4 py-2.5 rounded-lg text-sm font-medium"
                                        >
                                            Disconnect
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => { connectWallet(); setTimeout(() => setIsOpen(false), 1000); }}
                                        disabled={isConnecting}
                                        className="w-full flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-medium text-sm disabled:opacity-70"
                                    >
                                        <Wallet size={18} />
                                        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
