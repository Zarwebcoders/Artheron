import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Settings, 
    Activity, 
    ShieldAlert, 
    XCircle, 
    CheckCircle2, 
    RefreshCw
} from 'lucide-react';
import API from '../../api/axios';

const AdminSettings = () => {
    const [tokenPrice, setTokenPrice] = useState('0.010417');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleDistributeROI = async () => {
        setIsProcessing(true);
        try {
            const res = await API.post('/admin/distribute-roi');
            if (res.data.success) {
                alert(res.data.message);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Distribution failed');
        }
        setIsProcessing(false);
    };

    return (
        <div className="p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-500/10 border border-white/10 flex items-center justify-center text-gray-400">
                            <Settings size={16} />
                        </div>
                        <span className="text-gray-500 font-mono text-[10px] font-bold tracking-[0.3em] uppercase">Configuration Core</span>
                    </div>
                    <h1 className="text-4xl font-bold font-heading uppercase tracking-tighter leading-none text-white">
                        SYSTEM <span className="text-gradient">SETTINGS</span>
                    </h1>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Oracle Pricing */}
                <div className="admin-card glass-panel p-10 rounded-[2.5rem] border border-white/5 bg-[#0A0319]/50 space-y-10 relative overflow-hidden group">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#7b3fe4]/10 blur-[100px] pointer-events-none group-hover:bg-[#7b3fe4]/15 transition-all"></div>
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-[#7b3fe4]/10 border border-[#7b3fe4]/20 flex items-center justify-center text-[#7b3fe4]">
                                <Activity size={20} />
                            </div>
                            <h3 className="text-2xl font-bold font-heading uppercase tracking-tight">Market <span className="text-gradient">Oracle</span></h3>
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
                        <button className="w-full py-6 rounded-2xl bg-gradient-to-r from-[#7b3fe4] to-[#a855f7] text-white font-bold uppercase tracking-[0.3em] text-[11px] shadow-[0_15px_30px_rgba(123,63,228,0.3)] hover:shadow-[0_20px_40px_rgba(123,63,228,0.4)] transition-all duration-300 active:scale-95">
                            Push Valuation to Mainframe
                        </button>
                    </div>
                </div>

                {/* Emergency Controls */}
                <div className="admin-card glass-panel p-10 rounded-[2.5rem] border border-white/5 bg-[#0A0319]/50 space-y-10 relative overflow-hidden group">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/10 blur-[100px] pointer-events-none group-hover:bg-red-500/15 transition-all"></div>
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                                <ShieldAlert size={20} />
                            </div>
                            <h3 className="text-2xl font-bold font-heading uppercase tracking-tight text-red-500">Emergency <span className="text-white">Protocols</span></h3>
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-mono leading-relaxed">Direct System Overrides - Authorization Required</p>
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                        <button className="flex items-center justify-between p-7 bg-red-500/5 border border-red-500/10 rounded-2xl group/btn hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300">
                            <div className="text-left">
                                <p className="text-sm font-bold text-white uppercase tracking-tight mb-1 group-hover/btn:text-red-500 transition-colors tracking-widest">Mainframe Lockdown</p>
                                <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest leading-none">Immediate Pause on Node Operations</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover/btn:scale-110 shadow-lg transition-transform"><XCircle size={22} /></div>
                        </button>
                        
                        <button 
                            onClick={handleDistributeROI}
                            disabled={isProcessing}
                            className="w-full flex items-center justify-between p-7 bg-[#22C55E]/5 border border-[#22C55E]/10 rounded-2xl group/btn hover:bg-[#22C55E]/10 hover:border-[#22C55E]/30 transition-all duration-300 disabled:opacity-50"
                        >
                            <div className="text-left">
                                <p className="text-sm font-bold text-white uppercase tracking-tight mb-1 group-hover/btn:text-[#22C55E] transition-colors tracking-widest">Global ROI Distribution</p>
                                <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest leading-none">Manual Batch reward synchronization</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E] group-hover/btn:scale-110 shadow-lg transition-transform">
                                {isProcessing ? <RefreshCw size={22} className="animate-spin" /> : <CheckCircle2 size={22} />}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
