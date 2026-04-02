import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
    User, 
    Mail, 
    ShieldCheck, 
    Lock, 
    Bell, 
    ChevronRight, 
    Power,
    Activity,
    QrCode
} from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();

    const sections = [
        { id: 'account', label: 'Security & Access', icon: <Lock size={18} />, items: ['Two-Factor Auth (2FA)', 'Change Password', 'Login Activity'] },
        { id: 'prefs', label: 'Preferences', icon: <Bell size={18} />, items: ['Email Notifications', 'Dynamic ROI Alerts', 'System Updates'] },
        { id: 'kyc', label: 'Verification (KYC)', icon: <ShieldCheck size={18} />, items: ['Identity Verification', 'Contact Proof', 'Tax Documents'] },
    ];

    return (
        <div className="h-[calc(100vh-80px)] p-6 lg:p-10 space-y-10 flex flex-col overflow-hidden">
            {/* Header */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-3xl font-bold font-heading mb-1 uppercase tracking-tight">
                    OPERATOR <span className="text-gradient">PROFILE</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase bg-white/5 py-1 px-3 rounded-full border border-white/5 inline-block">
                    PRO Core Console
                </p>
            </motion.div>
 
            <div className="grid lg:grid-cols-3 gap-8 flex-1 min-h-0 overflow-hidden px-1">
                {/* User Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-[#0A0319]/50 relative overflow-hidden text-center group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#22d3ee] rounded-full mix-blend-screen filter blur-[60px] opacity-[0.05]"></div>
                        
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-[#7b3fe4] to-[#22d3ee] p-[2px] mb-6">
                            <div className="w-full h-full rounded-full bg-[#07010f] flex items-center justify-center">
                                <User size={40} className="text-white" />
                            </div>
                        </div>
 
                        <h3 className="text-xl font-bold text-white mb-1 uppercase tracking-tighter truncate px-4">{user?.email || 'Operator'}</h3>
                        <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-8">Artheron {user?.role || 'User'} #0{Date.now().toString().slice(-4)}</p>
 
                        <div className="flex justify-center gap-4 border-t border-white/5 pt-8">
                             <div className="text-center">
                                 <p className="text-[8px] text-gray-600 uppercase tracking-widest mb-1">Status</p>
                                 <p className="text-[10px] font-bold text-[#22C55E] uppercase">Verified</p>
                             </div>
                             <div className="w-px h-8 bg-white/5"></div>
                             <div className="text-center">
                                 <p className="text-[8px] text-gray-600 uppercase tracking-widest mb-1">Level</p>
                                 <p className="text-[10px] font-bold text-[#22d3ee] uppercase">Tier 4 PRO</p>
                             </div>
                        </div>
                    </div>
 
                    <button 
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all group"
                    >
                        <Power size={14} className="group-hover:rotate-90 transition-transform" />
                        Safe Deauth Pulse
                    </button>
                </div>
 
                {/* Settings Sections - Scrollable */}
                <div className="lg:col-span-2 space-y-8 overflow-y-auto pr-2 py-1">
                    <div className="space-y-8 pb-10">
                        {sections.map((section) => (
                            <div key={section.id} className="glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-[#0A0319]/50 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                                        {section.icon}
                                    </div>
                                    <h3 className="text-lg font-bold font-heading uppercase tracking-tighter">{section.label}</h3>
                                </div>
 
                                <div className="space-y-3">
                                    {section.items.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-[#050814] rounded-2xl border border-white/5 hover:border-white/10 transition-all group cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-800 group-hover:bg-[#22d3ee] transition-colors"></div>
                                                <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{item}</span>
                                            </div>
                                            <ChevronRight size={14} className="text-gray-800 group-hover:text-white transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        
                        <div className="p-8 rounded-[2rem] bg-gradient-to-br from-[#12052b] to-[#0A0319] border border-white/5 flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                                     <QrCode size={24} />
                                 </div>
                                 <div>
                                     <p className="text-xs font-bold text-white uppercase tracking-tight">Referral Protocol</p>
                                     <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">Invite code: ARTH_PRO_XT92</p>
                                 </div>
                             </div>
                             <button className="text-[10px] font-bold text-[#22d3ee] uppercase tracking-widest px-6 py-2 bg-[#22d3ee]/10 rounded-xl border border-[#22d3ee]/20 hover:bg-[#22d3ee]/20 transition-all">Copy Link</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
