import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    ShieldAlert, 
    Users, 
    Database, 
    Zap, 
    TrendingUp, 
    CheckCircle2,
    RefreshCw
} from 'lucide-react';
import API from '../../api/axios';

const AdminOverview = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalStaked: 0, totalPendingBuy: 0 });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [statsRes, txRes] = await Promise.all([
                API.get('/admin/stats'),
                API.get('/admin/tx-history')
            ]);
            
            if (statsRes.data.success) setStats(statsRes.data.data);
            if (txRes.data.success) {
                // Filter top 6 most recent
                setRecentTransactions(txRes.data.data.slice(0, 6));
            }
        } catch (err) {
            console.error("Dashboard fetch failed", err);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " mins ago";
        return Math.floor(seconds) + " seconds ago";
    };

    const getIntegrityIcon = (type) => {
        switch(type) {
            case 'buy': return <Database size={14} />;
            case 'stake': return <Zap size={14} />;
            case 'claim': return <TrendingUp size={14} />;
            case 'sos': return <ShieldAlert size={14} />;
            case 'withdraw': return <CheckCircle2 size={14} />;
            default: return <ShieldAlert size={14} />;
        }
    };

    const getIntegrityColor = (type) => {
        switch(type) {
            case 'buy': return '#22d3ee';
            case 'stake': return '#a855f7';
            case 'claim': return '#22C55E';
            case 'sos': return '#EF4444';
            case 'withdraw': return '#F59E0B';
            default: return '#7b3fe4';
        }
    };

    return (
        <div className="p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                            <ShieldAlert size={16} />
                        </div>
                        <span className="text-red-500/80 font-mono text-[10px] font-bold tracking-[0.3em] uppercase">System Core Command</span>
                    </div>
                    <h1 className="text-4xl font-bold font-heading uppercase tracking-tighter leading-none">
                        ADMIN <span className="text-gradient">OVERVIEW</span>
                    </h1>
                </motion.div>
                <button 
                    onClick={fetchData}
                    className="p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all active:rotate-180 duration-500"
                >
                    <RefreshCw className={isLoading ? 'animate-spin' : ''} size={18} />
                </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Users', value: stats.totalUsers, icon: <Users size={20} />, color: '#7b3fe4', trend: 'Live' },
                    { label: 'Pending Buy', value: `ARTH ${stats.totalPendingBuy.toLocaleString()}`, icon: <Database size={20} />, color: '#22d3ee', trend: 'Waiting' },
                    { label: 'Total Staked', value: `ARTH ${stats.totalStaked.toLocaleString()}`, icon: <Zap size={20} />, color: '#a855f7', trend: 'Active' },
                    { label: 'System ROI', value: '6.0%', icon: <TrendingUp size={20} />, color: '#22C55E', trend: 'Stable' },
                ].map((stat, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="admin-card glass-panel p-6 rounded-[2rem] border border-white/5 bg-[#0A0319]/50 relative overflow-hidden group transition-all duration-300 hover:border-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                    >
                        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full mix-blend-screen filter blur-[80px] opacity-[0.07] group-hover:opacity-[0.12] transition-opacity" style={{ backgroundColor: stat.color }}></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-white/10 transition-all duration-500 shadow-inner" style={{ color: stat.color }}>
                                    {stat.icon}
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Trend</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border text-white/60 border-white/10 bg-white/5`}>
                                        {stat.trend}
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-1 ml-0.5">{stat.label}</p>
                            <h3 className="text-4xl font-bold font-heading text-white tracking-tight">{isLoading ? '...' : stat.value}</h3>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }}></div>
                    </motion.div>
                ))}
            </div>

            {/* feed */}
            <div className="admin-card glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-[#0A0319]/50 overflow-hidden relative min-h-[400px]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] pointer-events-none"></div>
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold font-heading uppercase tracking-tight">System <span className="text-red-500">Integrity</span> Feed</h3>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-red-500/80 uppercase tracking-widest">Live Monitoring</span>
                    </div>
                </div>
                <div className="space-y-3">
                    {recentTransactions.length > 0 ? (
                        recentTransactions.map((tx, i) => (
                            <motion.div 
                                key={tx._id} 
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-default group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform" style={{ color: getIntegrityColor(tx.type) }}>
                                        {getIntegrityIcon(tx.type)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white group-hover:text-white transition-colors capitalize">
                                            {tx.type} by <span className="text-gray-400">{tx.user?.email}</span>
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-[10px] text-[#22d3ee] font-mono font-bold">{tx.amount.toLocaleString()} {tx.currency || 'ARTH'}</p>
                                            <span className="text-gray-700">•</span>
                                            <p className="text-[10px] text-gray-500 font-mono uppercase">{timeAgo(tx.timestamp)}</p>
                                        </div>
                                    </div>
                                </div>
                                <span className={`text-[8px] font-bold px-3 py-1 bg-white/5 border border-white/5 rounded-lg uppercase tracking-[0.2em] group-hover:border-white/10 transition-all ${tx.status === 'completed' ? 'text-green-500' : 'text-orange-500'}`}>{tx.status}</span>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-20 text-center text-gray-600 font-mono text-[10px] uppercase tracking-widest italic">
                            {isLoading ? 'Decrypting system logs...' : 'Standby: No recent protocol events detected'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
