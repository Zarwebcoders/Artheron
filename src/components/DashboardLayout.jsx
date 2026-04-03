import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Wallet, Bell, ChevronDown, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = ({ children }) => {
    const { user, loading, balances, isAdmin } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Redirect to landing if not logged in
    if (loading) return (
        <div className="min-h-screen bg-[#07010f] flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-[#7b3fe4] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Protect admin route
    if (location.pathname.startsWith('/admin') && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    // Redirect admin from user-only pages
    const userOnlyPaths = ['/dashboard', '/buy', '/staking', '/withdraw', '/history'];
    if (isAdmin && userOnlyPaths.includes(location.pathname)) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-[#07010f] text-white flex overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative lg:ml-72">
                {/* Background Ambient Glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7b3fe4] rounded-full mix-blend-screen filter blur-[200px] opacity-[0.03] pointer-events-none"></div>
                
                {/* Header */}
                <header className="h-20 border-b border-white/5 bg-[#07010f]/40 backdrop-blur-md flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
                    <div className="flex items-center gap-4 lg:hidden">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <span className="font-bold font-heading hidden sm:inline">ARTHERON <span className="text-[#22d3ee] text-[10px]">PRO</span></span>
                    </div>

                    <div className="hidden lg:flex items-center gap-8">
                         <div className="flex flex-col">
                             <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">System Status</span>
                             <div className="flex items-center gap-2">
                                 <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
                                 <span className="text-xs text-white font-mono">Kernel Core v4.28 (Global High)</span>
                             </div>
                         </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Token display */}
                        <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                             <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7b3fe4] to-[#22d3ee] flex items-center justify-center text-[10px] font-bold">A</div>
                             <div className="flex flex-col">
                                 <span className="text-[10px] text-gray-500 uppercase tracking-widest leading-none mb-0.5">My ARTH</span>
                                 <span className="text-xs font-mono font-bold leading-none">{balances.tokenBalance.toLocaleString()}</span>
                             </div>
                        </div>

                        {/* Profile action */}
                        <div className="flex items-center gap-3 cursor-pointer group">
                             <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                 <User size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                             </div>
                             <ChevronDown size={14} className="text-gray-600 group-hover:text-white transition-colors" />
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
