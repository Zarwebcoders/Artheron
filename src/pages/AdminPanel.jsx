import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import { 
    ShieldAlert, 
    Users, 
    Database, 
    Activity, 
    Zap, 
    Search, 
    Edit3, 
    Trash2, 
    CheckCircle2, 
    XCircle,
    TrendingUp,
    Settings,
    ArrowRight,
    Flame,
    Share2,
    RefreshCw
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { ethers } from 'ethers';

const AdminPanel = () => {
    const { user } = useAuth();
    const { account, isOwner, contract, balance, refreshBalance } = useWallet();
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [tokenPrice, setTokenPrice] = useState('0.045');
    
    // Token Management State
    const [burnAmount, setBurnAmount] = useState('');
    const [newOwnerAddress, setNewOwnerAddress] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [txHash, setTxHash] = useState(null);

    const handleBurn = async () => {
        if (!contract || !burnAmount) return;
        setIsProcessing(true);
        setTxHash(null);
        try {
            const amount = ethers.parseUnits(burnAmount, 18);
            const tx = await contract.burn(amount);
            setTxHash(tx.hash);
            await tx.wait();
            alert("Tokens burned successfully!");
            setBurnAmount('');
            refreshBalance();
        } catch (error) {
            console.error("Burn failed:", error);
            alert("Transaction failed: " + (error.reason || error.message));
        } finally {
            setIsProcessing(false);
        }
    };

    const handleTransferOwnership = async () => {
        if (!contract || !newOwnerAddress) return;
        if (!ethers.isAddress(newOwnerAddress)) {
            alert("Invalid address!");
            return;
        }
        setIsProcessing(true);
        setTxHash(null);
        try {
            const tx = await contract.transferOwnership(newOwnerAddress);
            setTxHash(tx.hash);
            await tx.wait();
            alert("Ownership transferred successfully!");
            setNewOwnerAddress('');
            window.location.reload(); 
        } catch (error) {
            console.error("Transfer failed:", error);
            alert("Transaction failed: " + (error.reason || error.message));
        } finally {
            setIsProcessing(false);
        }
    };
    
    // Mock Users Data
    const [users, setUsers] = useState([
        { id: 1, email: 'user@example.com', tokens: 12500, staked: 5000, income: 250, status: 'active' },
        { id: 2, email: 'alpha@artheron.io', tokens: 82000, staked: 12000, income: 1400, status: 'active' },
        { id: 3, email: 'beta@artheron.io', tokens: 4500, staked: 0, income: 0, status: 'pending' },
        { id: 4, email: 'gamma@artheron.io', tokens: 1200, staked: 15000, income: 890, status: 'active' },
    ]);

    useEffect(() => {
        gsap.fromTo(".admin-card", 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power2.out" }
        );
    }, [activeTab]);

    const filteredUsers = users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-6 lg:p-10 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                            <ShieldAlert size={16} />
                        </div>
                        <span className="text-red-500/80 font-mono text-[10px] font-bold tracking-[0.3em] uppercase ">System Core Command</span>
                    </div>
                    <h1 className="text-4xl font-bold font-heading uppercase tracking-tighter  leading-none">
                        ADMIN <span className="text-gradient">CONSOLE</span>
                    </h1>
                </motion.div>

                <div className="relative flex bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
                    <div 
                        className="absolute h-[calc(100%-8px)] rounded-xl bg-white/10 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300 ease-out"
                        style={{
                            width: `calc(${100 / 3}% - 4px)`,
                            left: `calc(${(['overview', 'users', 'settings'].indexOf(activeTab)) * (100 / 3)}% + 4px)`
                        }}
                    />
                    {['overview', 'users', 'settings', ...(isOwner ? ['token'] : [])].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative z-10 px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div 
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-10"
                    >
                        {/* Summary Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Users', value: '4,281', icon: <Users size={20} />, color: '#7b3fe4', trend: '+12' },
                                { label: 'Total ARTH Minted', value: '110.4M', icon: <Database size={20} />, color: '#22d3ee', trend: '+2M' },
                                { label: 'Active Staked', value: '18.2M', icon: <Zap size={20} />, color: '#a855f7', trend: '+450K' },
                                { label: 'System ROI', value: '6.0%', icon: <TrendingUp size={20} />, color: '#22C55E', trend: 'Stable' },
                            ].map((stat, i) => (
                                <motion.div 
                                    key={i} 
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
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${stat.trend.includes('+') ? 'text-[#22C55E] border-[#22C55E]/20 bg-[#22C55E]/5' : 'text-white/60 border-white/10 bg-white/5'}`}>
                                                    {stat.trend}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-1 ml-0.5">{stat.label}</p>
                                        <h3 className="text-4xl font-bold font-heading text-white tracking-tight ">{stat.value}</h3>
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }}></div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Activity Mini-List */}
                        <div className="admin-card glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-[#0A0319]/50 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] pointer-events-none"></div>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold font-heading uppercase  tracking-tight">System <span className="text-red-500">Integrity</span> Feed</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                    <span className="text-[10px] font-bold text-red-500/80 uppercase tracking-widest">Live Monitoring</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { type: 'AUTH', desc: 'New user registration from 192.168.1.1', time: '2 mins ago', color: '#22d3ee', icon: <ShieldAlert size={14} /> },
                                    { type: 'STAKE', desc: 'User alpha@artheron.io staked 15,000 ARTH', time: '14 mins ago', color: '#a855f7', icon: <Zap size={14} /> },
                                    { type: 'PAYMENT', desc: 'USDT Settlement confirmed for #TX_8812', time: '1 hour ago', color: '#22C55E', icon: <CheckCircle2 size={14} /> },
                                    { type: 'SOS', desc: 'Emergency exit triggered by #UID_992', time: '3 hours ago', color: '#EF4444', icon: <ShieldAlert size={14} /> },
                                ].map((item, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ opacity: 0, x: -10 }} 
                                        animate={{ opacity: 1, x: 0 }} 
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-default group"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform" style={{ color: item.color }}>
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-white group-hover:text-white transition-colors">{item.desc}</p>
                                                <p className="text-[10px] text-gray-500 font-mono uppercase mt-0.5">{item.time}</p>
                                            </div>
                                        </div>
                                        <span className="text-[8px] font-bold px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-gray-500 uppercase tracking-[0.2em] group-hover:border-white/10 transition-all">{item.type}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'users' && (
                    <motion.div 
                        key="users"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-2">
                            <div className="relative w-full md:max-w-lg group">
                                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#7b3fe4] transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="Search by operator email, node UID or wallet address..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-[#050814]/80 border border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-[#7b3fe4]/40 focus:bg-[#050814] transition-all text-sm h-16 shadow-inner"
                                />
                            </div>
                            <button className="w-full md:w-auto px-10 py-4 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-gray-200 active:scale-95 transition-all shadow-[0_10px_20px_rgba(255,255,255,0.1)]">
                                Export Node Data
                            </button>
                        </div>

                        <div className="glass-panel rounded-[2.5rem] border border-white/5 bg-[#0A0319]/50 overflow-hidden overflow-x-auto shadow-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white/[0.03] border-b border-white/5">
                                    <tr>
                                        <th className="px-10 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Operator Profile</th>
                                        <th className="px-10 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">ARTH Holding</th>
                                        <th className="px-10 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Nodes Staked</th>
                                        <th className="px-10 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Net Income</th>
                                        <th className="px-10 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-10 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Controls</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.02]">
                                    {filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-white/[0.03] transition-colors group">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/5 text-gray-400 group-hover:border-[#7b3fe4]/30 transition-all">
                                                        <Users size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white mb-0.5 group-hover:text-white transition-colors">{u.email}</p>
                                                        <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest  flex items-center gap-1.5">
                                                            <div className="w-1 h-1 rounded-full bg-green-500"></div>
                                                            NODE_0x{u.id.toString().padStart(4, '0')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-mono font-bold text-white text-sm tracking-tight">{u.tokens.toLocaleString()}</span>
                                                    <span className="text-[9px] text-gray-600 uppercase font-bold tracking-widest mt-0.5">ARTH ASSETS</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-mono font-bold text-[#a855f7] text-sm tracking-tight">{u.staked.toLocaleString()}</span>
                                                    <span className="text-[9px] text-[#a855f7]/50 uppercase font-bold tracking-widest mt-0.5">LOCKED</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-mono font-bold text-[#22C55E] text-sm tracking-tight">${u.income.toLocaleString()}</span>
                                                    <span className="text-[9px] text-[#22C55E]/50 uppercase font-bold tracking-widest mt-0.5">REALIZED</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[8px] font-bold uppercase tracking-[0.2em] border ${u.status === 'active' ? 'bg-[#22C55E]/5 text-[#22C55E] border-[#22C55E]/20' : 'bg-yellow-500/5 text-yellow-500 border-yellow-500/20'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-[#22C55E] shadow-[0_0_8px_#22C55E]' : 'bg-yellow-500 shadow-[0_0_8px_#EAB308]'}`}></div>
                                                    {u.status}
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-[#22d3ee] hover:bg-[#22d3ee]/10 hover:border-[#22d3ee]/30 transition-all"><Edit3 size={14} /></button>
                                                    <button className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'settings' && (
                    <motion.div 
                        key="settings"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        <div className="admin-card glass-panel p-10 rounded-[2.5rem] border border-white/5 bg-[#0A0319]/50 space-y-10 relative overflow-hidden group">
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#7b3fe4]/10 blur-[100px] pointer-events-none group-hover:bg-[#7b3fe4]/15 transition-all"></div>
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#7b3fe4]/10 border border-[#7b3fe4]/20 flex items-center justify-center text-[#7b3fe4]">
                                        <Activity size={20} />
                                    </div>
                                    <h3 className="text-2xl font-bold font-heading uppercase  tracking-tight">Market <span className="text-gradient">Oracle</span></h3>
                                </div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-mono leading-relaxed">System-wide ARTH/USDT Valuation Protocol Layer 1</p>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end px-1">
                                        <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Injectable ARTH Price ($)</label>
                                        <span className="text-[9px] text-[#22d3ee] font-mono font-bold animate-pulse">VALUATION STABLE</span>
                                    </div>
                                    <div className="relative group/input">
                                        <input 
                                            type="text" 
                                            value={tokenPrice}
                                            onChange={(e) => setTokenPrice(e.target.value)}
                                            className="w-full bg-[#050814]/80 border border-white/5 rounded-2xl py-6 px-10 text-4xl font-mono text-white outline-none focus:border-[#7b3fe4]/40 focus:bg-[#050814] transition-all font-bold shadow-inner"
                                        />
                                        <div className="absolute right-10 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#22d3ee]/10 border border-[#22d3ee]/20 rounded-md text-[#22d3ee] font-mono font-bold uppercase tracking-widest text-[9px]">MANUAL OVERRIDE</div>
                                    </div>
                                </div>
                                <button className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#7b3fe4] to-[#a855f7] text-white font-bold uppercase tracking-[0.3em] text-[10px] shadow-[0_15px_30px_rgba(123,63,228,0.3)] hover:shadow-[0_20px_40px_rgba(123,63,228,0.4)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300">
                                    Push Valuation to Mainframe
                                </button>
                            </div>
                        </div>

                        <div className="admin-card glass-panel p-10 rounded-[2.5rem] border border-white/5 bg-[#0A0319]/50 space-y-10 relative overflow-hidden group">
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/10 blur-[100px] pointer-events-none group-hover:bg-red-500/15 transition-all"></div>
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                                        <ShieldAlert size={20} />
                                    </div>
                                    <h3 className="text-2xl font-bold font-heading uppercase  tracking-tight text-red-500">Emergency <span className="text-white">Protocols</span></h3>
                                </div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-mono leading-relaxed">Direct System Overrides - Authorization Required</p>
                            </div>

                            <div className="grid grid-cols-1 gap-5">
                                <button className="flex items-center justify-between p-6 bg-red-500/5 border border-red-500/10 rounded-2xl group/btn hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300">
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-white uppercase tracking-tight mb-1 group-hover/btn:text-red-500 transition-colors">Mainframe Lockdown</p>
                                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Immediate Pause on Node Operations</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover/btn:scale-110 shadow-lg transition-transform"><XCircle size={22} /></div>
                                </button>
                                <button className="flex items-center justify-between p-6 bg-[#22C55E]/5 border border-[#22C55E]/10 rounded-2xl group/btn hover:bg-[#22C55E]/10 hover:border-[#22C55E]/30 transition-all duration-300">
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-white uppercase tracking-tight mb-1 group-hover/btn:text-[#22C55E] transition-colors">Global ROI Distribution</p>
                                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Manual Batch reward synchronization</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E] group-hover/btn:scale-110 shadow-lg transition-transform"><CheckCircle2 size={22} /></div>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'token' && isOwner && (
                    <motion.div 
                        key="token"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {/* Burn Section */}
                        <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 bg-[#0A0319]/50 space-y-8 relative overflow-hidden group">
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 blur-[100px] pointer-events-none group-hover:bg-orange-500/15 transition-all"></div>
                            
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                                    <Flame size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold font-heading uppercase text-white tracking-tight">Supply <span className="text-orange-500">Reduction</span></h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Permanent Token Incineration Protocol</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between px-1">
                                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Amount to Burn (ARTH)</label>
                                        <span className="text-[10px] text-gray-400 font-mono">BAL: {parseFloat(balance).toLocaleString()}</span>
                                    </div>
                                    <input 
                                        type="number"
                                        value={burnAmount}
                                        onChange={(e) => setBurnAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-[#050814] border border-white/5 rounded-2xl py-5 px-6 text-2xl font-mono text-white outline-none focus:border-orange-500/30 transition-all font-bold"
                                    />
                                </div>

                                <button 
                                    onClick={handleBurn}
                                    disabled={isProcessing || !burnAmount}
                                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold uppercase tracking-[0.3em] text-[10px] shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <RefreshCw size={14} className="animate-spin" />
                                            Commencing Burn...
                                        </div>
                                    ) : 'Initialize Burn Sequence'}
                                </button>
                            </div>
                        </div>

                        {/* Ownership Section */}
                        <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 bg-[#0A0319]/50 space-y-8 relative overflow-hidden group">
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none group-hover:bg-cyan-500/15 transition-all"></div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
                                    <Share2 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold font-heading uppercase text-white tracking-tight">Authority <span className="text-cyan-500">Handoff</span></h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Contract Sovereignty Transfer Protocol</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest px-1">New Authority Address</label>
                                    <input 
                                        type="text"
                                        value={newOwnerAddress}
                                        onChange={(e) => setNewOwnerAddress(e.target.value)}
                                        placeholder="0x..."
                                        className="w-full bg-[#050814] border border-white/5 rounded-2xl py-5 px-6 text-sm font-mono text-white outline-none focus:border-cyan-500/30 transition-all"
                                    />
                                </div>

                                <button 
                                    onClick={handleTransferOwnership}
                                    disabled={isProcessing || !newOwnerAddress}
                                    className="w-full py-5 rounded-2xl bg-white text-black font-bold uppercase tracking-[0.3em] text-[10px] shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <RefreshCw size={14} className="animate-spin" />
                                            Transferring Command...
                                        </div>
                                    ) : 'Execute Authority Transfer'}
                                </button>

                                {txHash && (
                                    <div className="pt-4 border-t border-white/5">
                                        <p className="text-[8px] text-gray-500 uppercase tracking-widest mb-2 font-mono">Last Transaction Hash</p>
                                        <p className="text-[10px] font-mono text-cyan-500/80 truncate bg-white/5 p-2 rounded-lg border border-white/5">{txHash}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPanel;
