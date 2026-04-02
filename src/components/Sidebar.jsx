import React, { useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Coins, 
    Lock, 
    History, 
    User, 
    ShieldCheck, 
    LogOut, 
    ChevronRight,
    ArrowUpRight,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const sidebarRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = isAdmin 
        ? [
            { name: 'Admin Panel', path: '/admin', icon: <ShieldCheck size={20} className="text-[#EF4444]" /> },
            { name: 'Profile', path: '/profile', icon: <User size={20} /> },
        ]
        : [
            { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
            { name: 'Buy ARTH', path: '/buy', icon: <Coins size={20} /> },
            { name: 'Staking', path: '/staking', icon: <Lock size={20} /> },
            { name: 'Withdraw', path: '/withdraw', icon: <ArrowUpRight size={20} /> },
            { name: 'History', path: '/history', icon: <History size={20} /> },
            { name: 'Profile', path: '/profile', icon: <User size={20} /> },
        ];

    return (
        <>
            {/* Mobile Overlay */}
            <div 
                className={`fixed inset-0 bg-[#07010f]/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            <aside 
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-full w-72 bg-[#0A0319] border-r border-white/5 z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="h-full flex flex-col p-6">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7b3fe4] to-[#22d3ee] flex items-center justify-center shadow-[0_0_20px_rgba(123,63,228,0.3)]">
                            <span className="font-bold text-white">A</span>
                        </div>
                        <span className="text-xl font-bold font-heading tracking-tight">ARTHERON <span className="text-[#22d3ee] text-[10px] align-top ml-1">PRO</span></span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-grow space-y-2">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) => `
                                    group flex items-center justify-between p-4 rounded-2xl transition-all duration-300
                                    ${isActive 
                                        ? 'bg-[#7b3fe4]/10 border border-[#7b3fe4]/30 text-white shadow-[0_0_20px_rgba(123,63,228,0.1)]' 
                                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="transition-transform group-hover:scale-110">{item.icon}</span>
                                    <span className="font-medium text-sm tracking-wide">{item.name}</span>
                                </div>
                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Profile Hook */}
                    <div className="mt-6 pt-6 border-t border-white/5">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mb-4">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#22d3ee] to-[#7b3fe4] p-0.5">
                                    <div className="w-full h-full rounded-full bg-[#0A0319] flex items-center justify-center text-[10px] font-bold">
                                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                </div>
                                <div className="truncate">
                                    <p className="text-xs font-bold text-white truncate">{user?.email || 'Guest User'}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{user?.role || 'User'}</p>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 p-4 text-gray-500 hover:text-[#EF4444] hover:bg-red-500/5 rounded-2xl transition-all duration-300 border border-transparent hover:border-red-500/20"
                        >
                            <LogOut size={20} />
                            <span className="font-medium text-sm tracking-wide">Secure Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
