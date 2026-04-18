import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
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

const Dashboard = () => {
    const { balances, user, updateBalances } = useAuth();
    const navigate = useNavigate();

    // Smooth counter state
    const [counts, setCounts] = useState({
        token: 0,
        stake: 0,
        income: 0,
        locked: 0
    });

    // Dynamic Chart Data based on real staking
    const chartData = useMemo(() => {
        const dailyROI = balances.stakeBalance * 0.002; // 0.2% daily
        const base = balances.incomeBalance - (dailyROI * 6); // Rough estimate of 7 days ago
        
        return [
            { name: 'Mon', income: Math.max(0, base + dailyROI).toFixed(2) },
            { name: 'Tue', income: Math.max(0, base + dailyROI * 2).toFixed(2) },
            { name: 'Wed', income: Math.max(0, base + dailyROI * 3).toFixed(2) },
            { name: 'Thu', income: Math.max(0, base + dailyROI * 4).toFixed(2) },
            { name: 'Fri', income: Math.max(0, base + dailyROI * 5).toFixed(2) },
            { name: 'Sat', income: Math.max(0, base + dailyROI * 6).toFixed(2) },
            { name: 'Sun', income: balances.incomeBalance.toFixed(2) },
        ];
    }, [balances.stakeBalance, balances.incomeBalance]);

    useEffect(() => {
        updateBalances();
    }, []);

    useEffect(() => {
        const statsObj = { token: 0, stake: 0, income: 0, locked: 0 };

        gsap.to(statsObj, {
            token: balances.tokenBalance,
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
        { label: 'Token Balance', value: counts.token, color: '#22d3ee', icon: <Coins size={20} />, sub: 'Available ARTH', path: '/buy' },
        { label: 'Active Stake', value: counts.stake, color: '#a855f7', icon: <Lock size={20} />, sub: 'Staked ARTH', path: '/staking' },
        { label: 'Income Balance', value: counts.income, color: '#22C55E', icon: <TrendingUp size={20} />, sub: 'Earned Profit', path: '/history' }
    ];

    return (
        <div className="p-6 lg:p-10 space-y-10">
            <div className="flex justify-end mb-4">
                <button className="bg-[#7b3fe4]/10 border border-[#7b3fe4]/20 text-[#a855f7] px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all hover:bg-[#7b3fe4]/20 hover:scale-105 active:scale-95 flex items-center gap-2">
                    <BarChart3 size={16} /> Analytics
                </button>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div 
                        key={i} 
                        onClick={() => stat.path && navigate(stat.path)}
                        className="dash-card glass-panel p-4 rounded-[2rem] border border-white/40! relative overflow-hidden group hover:border-[#7b3fe4]! transition-all duration-300 bg-[#0A0319]/50 shadow-2xl cursor-pointer"
                    >
                        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full mix-blend-screen filter blur-[60px] opacity-10 transition-opacity duration-500 group-hover:opacity-20" style={{ backgroundColor: stat.color }}></div>

                        <div className="relative z-10 flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-all shrink-0 shadow-inner" style={{ color: stat.color }}>
                                {React.cloneElement(stat.icon, { size: 28 })}
                            </div>

                            <div className="flex-1">
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-bold font-mono tracking-tighter text-white leading-none">
                                    {Math.floor(stat.value).toLocaleString()}
                                    <span className="text-lg text-gray-400 font-bold ml-2 uppercase">ARTH</span>
                                </h3>
                                <p className="text-xs text-gray-500 font-mono mt-2 uppercase tracking-widest leading-none">{stat.sub}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics & Activity Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Income Analytics */}
                <div className="dash-card xl:col-span-2 glass-panel p-6 rounded-[2.5rem] border border-white/40! bg-[#0A0319]/50 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-bold font-heading uppercase tracking-tight">Earnings <span className="text-[#22C55E]">Projection</span></h3>
                            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em]">Weekly ROI Yield Analysis</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="text-right">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Yield</p>
                                <p className="text-xl font-bold font-mono text-white text-gradient">+{balances.incomeBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ARTH</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7b3fe4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#7b3fe4" stopOpacity={0} />
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
                    <div className="dash-card glass-panel p-6 rounded-[2.5rem] border border-[#a855f7]/40! bg-gradient-to-br from-[#12052b] to-[#0A0319] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#a855f7] rounded-full mix-blend-screen filter blur-[80px] opacity-[0.1] group-hover:opacity-[0.2] transition-opacity"></div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-14 h-14 rounded-2xl bg-[#a855f7]/10 flex items-center justify-center text-[#a855f7] mb-6 border border-[#a855f7]/20 glow-purple">
                                <TrendingUp size={28} />
                            </div>
                            <h3 className="text-2xl font-bold font-heading mb-2 uppercase tracking-tighter">Fixed <span className="text-[#a855f7]">ROI Protocol</span></h3>
                            <p className="text-xs text-gray-400 mb-8 leading-relaxed font-light">Earn stable <span className="text-white font-bold">6% monthly yield</span> on your ARTH holdings with Artheron PRO smart engine.</p>

                            <button 
                                onClick={() => navigate('/staking')}
                                className="mt-auto w-full py-4 rounded-2xl bg-white text-black font-bold uppercase tracking-widest text-[10px] shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
                            >
                                <span>Activate Staking</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
