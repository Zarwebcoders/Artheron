import React, { useState, useEffect } from 'react';
import { Menu, X, Wallet, ChevronDown, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { account, balance, isConnecting, connectWallet, disconnectWallet } = useWallet();

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
        { name: 'Dashboard', href: '/dashboard', isRoute: true },
        { name: 'Earn', href: '/staking', isRoute: true },
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
                            Artheron
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <NavItem key={link.name} link={link} />
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center space-x-4">
                        <Link to="/buy">
                            <button className="text-sm font-medium text-white hover:text-white hover:text-shadow-[0_0_10px_#22d3ee] transition-all py-2 px-4 shadow-none">
                                Trade Crypto
                            </button>
                        </Link>

                        {account ? (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-xl font-medium transition-all text-sm"
                                >
                                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#7b3fe4] to-[#22d3ee]"></div>
                                    {formatAddress(account)}
                                    <ChevronDown size={14} className="text-gray-400" />
                                </button>

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-3 w-56 glass-panel border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                                        >
                                            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                                                <p className="text-xs text-gray-400 mb-1">Total Balance</p>
                                                <p className="text-lg font-bold font-mono text-white">{balance} ARTH</p>
                                            </div>
                                            <div className="p-2">
                                                <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                                    Portfolio
                                                </Link>
                                                <Link to="/admin" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                                    Admin Settings
                                                </Link>
                                            </div>
                                            <div className="p-2 border-t border-white/5">
                                                <button
                                                    onClick={() => { disconnectWallet(); setDropdownOpen(false); }}
                                                    className="w-full text-left px-4 py-2 text-sm text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors"
                                                >
                                                    Disconnect
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <button
                                onClick={connectWallet}
                                disabled={isConnecting}
                                className="flex items-center gap-2 bg-white text-black hover:bg-gray-100 px-6 py-2.5 rounded-xl font-medium transition-all transform hover:scale-[1.02] text-sm disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                            >
                                <Wallet size={16} />
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
