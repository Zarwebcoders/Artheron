import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { 
    Clock, 
    ArrowUpRight, 
    ArrowDownRight, 
    Zap, 
    CheckCircle2, 
    Search,
    Filter,
    Calendar
} from 'lucide-react';

const History = () => {
    const [filter, setFilter] = useState('all');

    const transactions = [
        { id: '1', type: 'STAKE', amount: '+15,000 ARTH', date: '2026-03-18 14:22', status: 'Confirmed', method: 'Smart Vault', color: '#a855f7' },
        { id: '2', type: 'PURCHASE', amount: '+5,000 ARTH', date: '2026-03-17 09:12', status: 'Confirmed', method: 'USDT (BEP20)', color: '#22d3ee' },
        { id: '3', type: 'ROI', amount: '+82.50 ARTH', date: '2026-03-16 00:01', status: 'Settled', method: 'System Yield', color: '#22C55E' },
        { id: '4', type: 'SOS_EXIT', amount: '-12,000 ARTH', date: '2026-03-15 18:45', status: 'Confirmed', method: 'Penalty Applied', color: '#EF4444' },
    ];

    useEffect(() => {
        gsap.fromTo(".history-item", 
            { opacity: 0, x: -10 },
            { opacity: 1, x: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" }
        );
    }, []);

    return (
        <div className="p-6 lg:p-10 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold font-heading mb-1 uppercase tracking-tight">
                        TRANSACTION <span className="text-gradient">LEDGER</span>
                    </h1>
                    <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase bg-white/5 py-1 px-3 rounded-full border border-white/5 inline-block">
                        Immutable Protocol History
                    </p>
                </motion.div>

                <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
                    {['all', 'stake', 'earnings'].map((f) => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="glass-panel rounded-[2.5rem] border border-white/5 bg-[#0A0319]/50 overflow-hidden">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:max-w-xs">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input type="text" placeholder="TX Hash Search..." className="w-full bg-[#050814] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-[10px] font-mono outline-none focus:border-[#22d3ee]/30" />
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <Filter size={14} /> Sort By: <span className="text-white cursor-pointer hover:underline">Newest</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.02] border-b border-white/5">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Type</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Method / Source</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Timestamp</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="history-item hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/5 text-xs font-bold" style={{ backgroundColor: tx.color + '10', color: tx.color }}>
                                                {tx.type.charAt(0)}
                                            </div>
                                            <span className="text-xs font-bold text-white uppercase tracking-tighter">{tx.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-mono font-bold text-sm text-white">{tx.amount}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{tx.method}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-[10px] text-gray-600 font-mono">
                                            <Calendar size={12} /> {tx.date}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                            <span className="text-[10px] font-bold text-green-500/80 uppercase tracking-widest">{tx.status}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 bg-white/[0.01] border-t border-white/5 text-center">
                    <p className="text-[10px] text-gray-700 uppercase tracking-[0.3em] font-bold">End of Transmission Ledger</p>
                </div>
            </div>
        </div>
    );
};

export default History;
