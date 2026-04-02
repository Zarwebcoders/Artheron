import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import { 
    ArrowUpRight, 
    ArrowDownRight, 
    Clock, 
    Activity, 
    Wallet, 
    TrendingUp, 
    Coins, 
    Lock, 
    BarChart3,
    ArrowRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { useWallet } from '../context/WalletContext';

const Dashboard = () => {
    const { balances, user } = useAuth();
    const { balance } = useWallet();
    
    // Smooth counter state
    const [counts, setCounts] = useState({
        token: 0,
        stake: 0,
        income: 0,
        locked: 0
    });

    const chartData = [
        { name: 'Mon', income: 45 },
        { name: 'Tue', income: 52 },
        { name: 'Wed', income: 48 },
        { name: 'Thu', income: 61 },
        { name: 'Fri', income: 55 },
        { name: 'Sat', income: 67 },
        { name: 'Sun', income: 72 },
    ];

    useEffect(() => {
        const statsObj = { token: 0, stake: 0, income: 0, locked: 0 };
        
        gsap.to(statsObj, {
            token: parseFloat(balance) || 0,
            stake: balances.stakeBalance,
            income: balances.incomeBalance,
            locked: balances.lockedBalance,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => setCounts({ ...statsObj })
        });

        gsap.fromTo(".dash-card", 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power2.out" }
        );
    }, [balances]);

    const stats = [
        { label: 'Token Balance', value: counts.token, color: '#22d3ee', icon: <Coins size={20} />, sub: 'Available ARTH' },
        { label: 'Active Stake', value: counts.stake, color: '#a855f7', icon: <Lock size={20} />, sub: 'Staked ARTH' },
        { label: 'Income Balance', value: counts.income, color: '#22C55E', icon: <TrendingUp size={20} />, sub: 'Earned Profit' },
        { label: 'Locked Assets', value: counts.locked, color: '#F43F5E', icon: <Activity size={20} />, sub: 'Maturity Pending' }
    ];

    return (
        <div className="p-6 lg:p-10 space-y-10">
            {/* Header / Welcome */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold font-heading mb-1 uppercase tracking-tight">
                        PROTOCOL <span className="text-gradient">CONSOLE</span>
                    </h1>
                    <p className="text-xs text-gray-500 font-mono tracking-widest bg-white/5 py-1 px-3 rounded-full border border-white/5 inline-block capitalize">
                        Welcome back, {user?.email?.split('@')[0] || 'Operator'}
                    </p>
                </motion.div>

                <div className="flex gap-3">
                    <button className="bg-[#7b3fe4]/10 border border-[#7b3fe4]/20 text-[#a855f7] px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all hover:bg-[#7b3fe4]/20 hover:scale-105 active:scale-95 flex items-center gap-2">
                         <BarChart3 size={16} /> Analytics
                    </button>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="dash-card glass-panel p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors bg-[#0A0319]/50">
                        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full mix-blend-screen filter blur-[60px] opacity-10 transition-opacity duration-500 group-hover:opacity-20" style={{ backgroundColor: stat.color }}></div>
                        
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors" style={{ color: stat.color }}>
                                    {stat.icon}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest py-1 px-2 rounded-lg bg-white/5 border border-white/5`} style={{ color: stat.color }}>+12.5%</span>
                            </div>
                            
                            <div>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-bold font-mono tracking-tighter text-white">
                                    {Math.floor(stat.value).toLocaleString()}
                                    <span className="text-sm text-gray-600 font-light ml-2">ARTH</span>
                                </h3>
                                <p className="text-[10px] text-gray-700 font-mono mt-1 uppercase tracking-wider">{stat.sub}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics & Activity Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Income Analytics */}
                <div className="dash-card xl:col-span-2 glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-[#0A0319]/50 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-bold font-heading uppercase tracking-tight">Earnings <span className="text-[#22C55E]">Projection</span></h3>
                            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em]">Weekly ROI Yield Analysis</p>
                        </div>
                        <div className="flex gap-2">
                             <div className="text-right">
                                 <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Yield</p>
                                 <p className="text-sm font-bold font-mono text-white text-gradient">+$1,452.80</p>
                             </div>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7b3fe4" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#7b3fe4" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 'bold' }} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 'bold' }} 
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0A0319', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="income" stroke="#7b3fe4" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Stake / SOS Section */}
                <div className="flex flex-col gap-6">
                    <div className="dash-card glass-panel p-8 rounded-[2.5rem] border border-[#a855f7]/20 bg-gradient-to-br from-[#12052b] to-[#0A0319] relative overflow-hidden group">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-[#a855f7] rounded-full mix-blend-screen filter blur-[80px] opacity-[0.1] group-hover:opacity-[0.2] transition-opacity"></div>
                         
                         <div className="relative z-10 flex flex-col h-full">
                             <div className="w-14 h-14 rounded-2xl bg-[#a855f7]/10 flex items-center justify-center text-[#a855f7] mb-6 border border-[#a855f7]/20 glow-purple">
                                 <TrendingUp size={28} />
                             </div>
                             <h3 className="text-2xl font-bold font-heading mb-2 uppercase tracking-tighter">Fixed <span className="text-[#a855f7]">ROI Protocol</span></h3>
                             <p className="text-xs text-gray-400 mb-8 leading-relaxed font-light">Earn stable <span className="text-white font-bold">6% monthly yield</span> on your ARTH holdings with Artheron PRO smart engine.</p>
                             
                             <button className="mt-auto w-full py-4 rounded-2xl bg-white text-black font-bold uppercase tracking-widest text-[10px] shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group">
                                 <span>Activate Staking</span>
                                 <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                             </button>
                         </div>
                    </div>

                    <div className="dash-card glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
                         <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                                 <Activity size={20} />
                             </div>
                             <div>
                                 <p className="text-xs font-bold text-white uppercase tracking-tight">SOS Emergency</p>
                                 <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">20% Penalty Apply</p>
                             </div>
                         </div>
                         <button className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:underline px-4 py-2 bg-red-500/5 rounded-lg border border-red-500/10">Withdraw</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
