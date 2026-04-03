import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Activity, 
    ArrowRight, 
    RefreshCw,
    Filter,
    Clock,
    Search,
    ChevronDown,
    CheckCircle2,
    XCircle,
    RotateCcw
} from 'lucide-react';
import API from '../../api/axios';

const AdminTransactions = () => {
    const [viewMode, setViewMode] = useState('pending'); // 'pending' or 'history'
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const endpoint = viewMode === 'pending' ? '/admin/pending-tx' : '/admin/tx-history';
            const res = await API.get(endpoint);
            if (res.data.success) {
                setTransactions(res.data.data);
            }
        } catch (err) {
            console.error("Data fetch failed", err);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [viewMode]);

    const handleTransaction = async (id, status) => {
        setIsProcessing(true);
        try {
            const res = await API.put(`/admin/tx/${id}`, { status });
            if (res.data.success) {
                alert(`Transaction ${status}`);
                fetchData();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        }
        setIsProcessing(false);
    };

    const filteredTransactions = transactions.filter(tx => {
        const matchesType = typeFilter === 'all' || tx.type.toLowerCase() === typeFilter.toLowerCase();
        const matchesSearch = tx.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             tx.type?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    const getStatusBadge = (status) => {
        switch(status) {
            case 'completed': return <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">Completed</span>;
            case 'rejected': return <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">Rejected</span>;
            case 'pending': return <span className="bg-orange-500/10 text-orange-500 border border-orange-500/20 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">Pending</span>;
            default: return <span className="bg-gray-500/10 text-gray-500 border border-gray-500/20 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">{status}</span>;
        }
    };

    return (
        <div className="p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
                            {viewMode === 'pending' ? <Activity size={16} /> : <Clock size={16} />}
                        </div>
                        <span className="text-gray-500 font-mono text-[10px] font-bold tracking-[0.3em] uppercase">
                            {viewMode === 'pending' ? 'Review Queue' : 'Archive Registry'}
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold font-heading uppercase tracking-tighter leading-none text-white">
                        {viewMode === 'pending' ? 'SETTLEMENT' : 'TX'} <span className="text-gradient">{viewMode === 'pending' ? 'QUEUE' : 'HISTORY'}</span>
                    </h1>
                </motion.div>

                <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/10">
                    <button 
                        onClick={() => setViewMode('pending')}
                        className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'pending' ? 'bg-[#7b3fe4] text-white shadow-lg shadow-[#7b3fe4]/20' : 'text-gray-500 hover:text-white'}`}
                    >Pending Queue</button>
                    <button 
                        onClick={() => setViewMode('history')}
                        className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'history' ? 'bg-[#7b3fe4] text-white shadow-lg shadow-[#7b3fe4]/20' : 'text-gray-500 hover:text-white'}`}
                    >All History</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative group">
                    <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-500 transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search operators..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#050814]/80 border border-white/5 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-cyan-500/30 transition-all text-xs text-white"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'buy', 'stake', 'claim', 'sos', 'withdraw'].map((type) => (
                        <button 
                            key={type}
                            onClick={() => setTypeFilter(type)}
                            className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all ${typeFilter === type ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-500' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
                <div className="flex justify-end">
                    <button 
                        onClick={fetchData}
                        className="p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all active:rotate-180 duration-500"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            <div className="glass-panel rounded-[2.5rem] border border-white/5 bg-[#0A0319]/50 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.03] border-b border-white/5">
                            <tr>
                                <th className="px-10 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Operator</th>
                                <th className="px-10 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Type / Method</th>
                                <th className="px-10 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Amount / Asset</th>
                                <th className="px-10 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Reference / Link</th>
                                {viewMode === 'pending' ? <th className="px-10 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Actions</th> : <th className="px-10 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-20 text-center">
                                         <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    </td>
                                </tr>
                            ) : filteredTransactions.length > 0 ? (
                                filteredTransactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-white/[0.03] transition-colors group">
                                        <td className="px-10 py-6">
                                            <p className="text-sm font-bold text-white mb-0.5 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{tx.user?.name || 'Unknown'}</p>
                                            <p className="text-[10px] text-gray-500 font-mono lowercase">{tx.user?.email || 'N/A'}</p>
                                            <p className="text-[9px] text-gray-700 font-mono uppercase mt-1 tracking-tighter">{new Date(tx.timestamp).toLocaleString()}</p>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${tx.type === 'buy' ? 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]' : tx.type === 'stake' ? 'bg-[#a855f7] shadow-[0_0_8px_#a855f7]' : 'bg-gray-500'}`}></div>
                                                    <span className="text-xs font-bold text-white uppercase tracking-[0.2em]">{tx.type}</span>
                                                </div>
                                                <span className="text-[9px] text-gray-600 font-mono uppercase tracking-widest">{tx.method || tx.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <p className="text-sm font-mono font-bold text-white tracking-widest">{tx.amount.toLocaleString()} <span className="text-[10px] text-gray-600">{tx.currency || 'ARTH'}</span></p>
                                        </td>
                                        <td className="px-10 py-6">
                                            {tx.type === 'buy' && tx.proofUrl ? (
                                                <a 
                                                    href={tx.proofUrl.startsWith('http') ? tx.proofUrl : `https://artheron-backend.vercel.app/${tx.proofUrl}`} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="text-[9px] text-cyan-500 underline uppercase tracking-[0.2em] font-bold flex items-center gap-1 group/link"
                                                >
                                                    Receipt <ArrowRight size={10} className="group-hover/link:translate-x-1 transition-transform" />
                                                </a>
                                            ) : tx.txHash ? (
                                                <p className="text-[9px] text-gray-500 font-mono truncate max-w-[150px] uppercase">{tx.txHash}</p>
                                            ) : (
                                                <span className="text-[9px] text-gray-700 font-mono italic">INTERNAL TRACE</span>
                                            )}
                                        </td>
                                        <td className="px-10 py-6">
                                            {viewMode === 'pending' ? (
                                                <div className="flex items-center gap-3">
                                                    <button 
                                                        disabled={isProcessing}
                                                        onClick={() => handleTransaction(tx._id, 'completed')}
                                                        className="px-6 py-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-green-500/20 active:scale-95 transition-all disabled:opacity-30"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        disabled={isProcessing}
                                                        onClick={() => handleTransaction(tx._id, 'rejected')}
                                                        className="px-6 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-red-500/20 active:scale-95 transition-all disabled:opacity-30"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                getStatusBadge(tx.status)
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-10 py-24 text-center text-gray-600 text-[10px] uppercase tracking-[0.4em] font-bold italic">
                                        Registry sequence clean: No operations found for current filter
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminTransactions;
