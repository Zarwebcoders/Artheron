import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    Search, 
    Edit3, 
    Trash2,
    X,
    Shield,
    Wallet,
    TrendingUp,
    RefreshCw,
    AlertTriangle
} from 'lucide-react';
import API from '../../api/axios';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        role: '',
        balances: {
            tokenBalance: 0,
            stakeBalance: 0,
            incomeBalance: 0
        }
    });

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await API.get('/admin/users');
            if (res.data.success) setUsers(res.data.data);
        } catch (err) {
            console.error("Users fetch failed", err);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (user) => {
        setSelectedUser(user);
        setEditForm({
            name: user.name || '',
            email: user.email || '',
            role: user.role || 'user',
            balances: {
                tokenBalance: user.balances?.tokenBalance || 0,
                stakeBalance: user.balances?.stakeBalance || 0,
                incomeBalance: user.balances?.incomeBalance || 0
            }
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            const res = await API.put(`/admin/users/${selectedUser._id}`, editForm);
            if (res.data.success) {
                alert('User updated successfully');
                setIsEditModalOpen(false);
                fetchUsers();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        }
        setIsProcessing(false);
    };

    const handleDelete = async (id, email) => {
        if (window.confirm(`Are you absolutely sure you want to delete ${email}? This action is permanent and will wipe all node data.`)) {
            setIsProcessing(true);
            try {
                const res = await API.delete(`/admin/users/${id}`);
                if (res.data.success) {
                    alert('User deleted from mainframe');
                    fetchUsers();
                }
            } catch (err) {
                alert(err.response?.data?.message || 'Deletion failed');
            }
            setIsProcessing(false);
        }
    };

    const filteredUsers = users.filter(u => 
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 lg:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-[#7b3fe4]/10 border border-[#7b3fe4]/20 flex items-center justify-center text-[#7b3fe4]">
                            <Users size={16} />
                        </div>
                        <span className="text-gray-500 font-mono text-[10px] font-bold tracking-[0.3em] uppercase">Operator Directory</span>
                    </div>
                    <h1 className="text-4xl font-bold font-heading uppercase tracking-tighter leading-none text-white">
                        USER <span className="text-gradient">DATABASE</span>
                    </h1>
                </motion.div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="relative w-full md:max-w-lg group">
                    <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#7b3fe4] transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search by operator email or role..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#050814]/80 border border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-[#7b3fe4]/40 focus:bg-[#050814] transition-all text-sm h-16 shadow-inner"
                    />
                </div>
                <button className="w-full md:w-auto px-10 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-gray-200 active:scale-95 transition-all shadow-[0_10px_20px_rgba(255,255,255,0.1)]">
                    Export User Data
                </button>
            </div>

            <div className="glass-panel rounded-[2.5rem] border border-white/5 bg-[#0A0319]/50 overflow-hidden overflow-x-auto shadow-2xl relative">
                {isProcessing && <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-10 flex items-center justify-center"><RefreshCw className="animate-spin text-[#7b3fe4]" size={32} /></div>}
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
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="px-10 py-10 text-center">
                                     <div className="w-8 h-8 border-2 border-[#7b3fe4] border-t-transparent rounded-full animate-spin mx-auto"></div>
                                </td>
                            </tr>
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map((u) => (
                                <tr key={u._id} className="hover:bg-white/[0.03] transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/5 text-gray-400 group-hover:border-[#7b3fe4]/30 transition-all">
                                                <Users size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white mb-0.5 group-hover:text-white transition-colors">{u.email}</p>
                                                <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest flex items-center gap-1.5">
                                                    <div className={`w-1 h-1 rounded-full ${u.role === 'admin' ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]' : 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]'}`}></div>
                                                    {u.role.toUpperCase()}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-mono font-bold text-white text-sm tracking-tight">{u.balances?.tokenBalance?.toLocaleString() || 0}</span>
                                            <span className="text-[9px] text-gray-600 uppercase font-bold tracking-widest mt-0.5">ARTH ASSETS</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-mono font-bold text-[#a855f7] text-sm tracking-tight">{u.balances?.stakeBalance?.toLocaleString() || 0}</span>
                                            <span className="text-[9px] text-[#a855f7]/50 uppercase font-bold tracking-widest mt-0.5">LOCKED</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-mono font-bold text-[#22C55E] text-sm tracking-tight">${u.balances?.incomeBalance?.toLocaleString() || 0}</span>
                                            <span className="text-[9px] text-[#22C55E]/50 uppercase font-bold tracking-widest mt-0.5">REALIZED</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[8px] font-bold uppercase tracking-[0.2em] border ${u.role === 'user' ? 'bg-[#22C55E]/5 text-[#22C55E] border-[#22C55E]/20' : 'bg-red-500/5 text-red-500 border-red-500/20'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${u.role === 'user' ? 'bg-[#22C55E] shadow-[0_0_8px_#22C55E]' : 'bg-red-500 shadow-[0_0_8_#EF4444]'}`}></div>
                                            {u.role.toUpperCase()}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleEdit(u)}
                                                className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-[#22d3ee] hover:bg-[#22d3ee]/10 hover:border-[#22d3ee]/30 transition-all font-bold"
                                            >
                                                <Edit3 size={14} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(u._id, u.email)}
                                                className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all font-bold"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-10 py-10 text-center text-gray-500 uppercase tracking-widest text-[10px] font-bold">No operators found on the network</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit User Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-[#07010f]/80 backdrop-blur-xl"
                        ></motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#0A0319] border border-white/10 rounded-[3rem] p-10 shadow-[0_0_50px_rgba(123,63,228,0.2)] overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7b3fe4]/10 blur-[100px] pointer-events-none"></div>
                            
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#22d3ee]/10 border border-[#22d3ee]/20 flex items-center justify-center text-[#22d3ee]">
                                        <Edit3 size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold font-heading uppercase text-white tracking-tight">Override <span className="text-gradient">Operator</span></h3>
                                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Protocol Authority Elevated</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] text-gray-500 uppercase tracking-widest font-bold ml-1">Operator Name</label>
                                        <input 
                                            type="text" 
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-[#7b3fe4]/40 transition-all font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] text-gray-500 uppercase tracking-widest font-bold ml-1">Protocol Role</label>
                                        <div className="relative">
                                            <select 
                                                value={editForm.role}
                                                onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-[#7b3fe4]/40 transition-all font-bold appearance-none cursor-pointer"
                                            >
                                                <option value="user" className="bg-[#0A0319] text-white">USER NODE</option>
                                                <option value="admin" className="bg-[#0A0319] text-white">ADMIN STATUS</option>
                                            </select>
                                            <Shield size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-[#22d3ee]/10 flex items-center justify-center text-[#22d3ee]">
                                            <Wallet size={16} />
                                        </div>
                                        <span className="text-[10px] text-[#22d3ee] uppercase font-bold tracking-widest">Asset Calibration</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[8px] text-gray-600 uppercase font-bold tracking-[0.2em] ml-1">ARTH Holdings</label>
                                            <input 
                                                type="number" 
                                                value={editForm.balances.tokenBalance}
                                                onChange={(e) => setEditForm({...editForm, balances: {...editForm.balances, tokenBalance: parseFloat(e.target.value)}})}
                                                className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-xs font-mono text-white outline-none focus:border-[#22d3ee]/30 transition-all font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[8px] text-gray-600 uppercase font-bold tracking-[0.2em] ml-1">Staking Core</label>
                                            <input 
                                                type="number" 
                                                value={editForm.balances.stakeBalance}
                                                onChange={(e) => setEditForm({...editForm, balances: {...editForm.balances, stakeBalance: parseFloat(e.target.value)}})}
                                                className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-xs font-mono text-white outline-none focus:border-[#a855f7]/30 transition-all font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[8px] text-gray-600 uppercase font-bold tracking-[0.2em] ml-1">Realized $</label>
                                            <input 
                                                type="number" 
                                                value={editForm.balances.incomeBalance}
                                                onChange={(e) => setEditForm({...editForm, balances: {...editForm.balances, incomeBalance: parseFloat(e.target.value)}})}
                                                className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-xs font-mono text-white outline-none focus:border-[#22C55E]/30 transition-all font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="flex-1 py-5 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 hover:text-white transition-all shadow-inner"
                                    >Cancel</button>
                                    <button 
                                        type="submit"
                                        disabled={isProcessing}
                                        className="flex-[2] py-5 rounded-2xl bg-gradient-to-r from-[#7b3fe4] to-[#22d3ee] text-white font-bold uppercase tracking-widest text-[10px] shadow-[0_10px_30px_rgba(123,63,228,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isProcessing ? <RefreshCw size={14} className="animate-spin" /> : <><TrendingUp size={16} /> <span>Apply System Override</span></>}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUsers;

