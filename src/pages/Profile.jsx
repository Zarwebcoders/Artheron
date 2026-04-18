import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    const { user, logout, toggle2FA, updatePassword } = useAuth();
    const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
    const [currentPassword, setCurrentPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [error, setError] = React.useState('');

    const sections = [
        { id: 'account', label: 'Security & Access', icon: <Lock size={18} />, items: ['Two-Factor Auth (2FA)', 'Change Password'] },
        { id: 'kyc', label: 'Verification (KYC)', icon: <ShieldCheck size={18} />, isKyC: true },
    ];

    return (
        <div className="p-6 lg:p-6 space-y-0">
            {/* Header Spacer */}
            <div className="h-6"></div>
 
            <div className="grid lg:grid-cols-3 gap-8 px-1">
                {/* User Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-panel p-6 rounded-[1rem] border border-white/50! bg-[#0A0319]/50 relative overflow-hidden text-center group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#22d3ee] rounded-full mix-blend-screen filter blur-[60px] opacity-[0.05]"></div>
                        
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-[#7b3fe4] to-[#22d3ee] p-[2px] mb-6">
                            <div className="w-full h-full rounded-full bg-[#07010f] flex items-center justify-center">
                                <User size={40} className="text-white" />
                            </div>
                        </div>
 
                        <h3 className="text-xl font-bold text-white mb-1 uppercase tracking-tighter truncate px-4">{user?.email || 'Operator'}</h3>
                        <p className="text-xs text-gray-500 font-mono tracking-widest uppercase mb-6">Artheron {user?.role || 'User'} #0{Date.now().toString().slice(-4)}</p>
 
                        <div className="mb-8 p-4 bg-white/10! rounded-2xl border border-white/50! shadow-inner group/ref hover:border-[#22d3ee]/30 transition-all">
                            <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em] mb-3 font-black">Your Referral Link</p>
                            <div className="flex items-center gap-4">
                                <input 
                                    readOnly 
                                    value={`https://artheron.com/reg?ref=${user?.id?.slice(-6) || 'PRO_XT92'}`}
                                    className="bg-transparent border-none text-xs text-[#22d3ee] font-mono outline-none w-full font-bold"
                                />
                                <button 
                                    onClick={() => navigator.clipboard.writeText(`https://artheron.com/reg?ref=${user?.id?.slice(-6) || 'PRO_XT92'}`)}
                                    className="p-2 rounded-lg bg-white/5 text-white hover:text-[#22d3ee] hover:bg-white/10 transition-all shadow-lg"
                                >
                                    <QrCode size={16} />
                                </button>
                            </div>
                        </div>
 
                        <div className="flex justify-center gap-8 border-t border-white/50! pt-10">
                             <div className="text-center">
                                 <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-2 font-bold">Status</p>
                                 <p className="text-sm font-black text-[#22C55E] uppercase tracking-wider">Verified</p>
                             </div>
                             <div className="w-px h-10 bg-white/50"></div>
                             <div className="text-center">
                                 <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-2 font-bold">Level</p>
                                 <p className="text-sm font-black text-[#22d3ee] uppercase tracking-wider">Tier 4 PRO</p>
                             </div>
                        </div>
                    </div>
                </div>
 
                {/* Settings Sections */}
                <div className="lg:col-span-2 space-y-8 py-1">
                    <div className="space-y-8 pb-10">
                        {sections.map((section) => (
                            <div key={section.id} className="glass-panel p-6 rounded-[1rem] border border-white/50! bg-[#0A0319]/50 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                                        {section.icon}
                                    </div>
                                    <h3 className="text-lg font-bold font-heading uppercase tracking-tighter">{section.label}</h3>
                                </div>
 
                                <div className="space-y-3">
                                    {section.isKyC ? (
                                        <div className="flex items-center justify-center p-6 bg-[#050814] rounded-2xl border border-white/50! border-dashed">
                                            <p className="text-[12px] text-gray-600 uppercase tracking-[0.4em] font-bold animate-pulse">Coming Soon</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {section.items.map((item, i) => (
                                                <div 
                                                    key={i} 
                                                    onClick={() => item === 'Change Password' && setIsPasswordModalOpen(true)}
                                                    className={`flex items-center justify-between p-4 bg-[#050814] rounded-xl border border-white/50! hover:border-white/10 transition-all group ${item === 'Change Password' ? 'cursor-pointer active:scale-95' : ''}`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${item === 'Two-Factor Auth (2FA)' && user?.is2FAEnabled ? 'bg-[#22d3ee] shadow-[0_0_8px_#22d3ee]' : 'bg-gray-800'} transition-colors`}></div>
                                                        <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{item}</span>
                                                    </div>
                                                    
                                                    {item === 'Two-Factor Auth (2FA)' ? (
                                                        <div className="flex items-center gap-3">
                                                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${user?.is2FAEnabled ? 'text-[#22d3ee]' : 'text-gray-700'}`}>
                                                                {user?.is2FAEnabled ? 'Active' : 'Disabled'}
                                                            </span>
                                                            <button 
                                                                onClick={async (e) => {
                                                                    e.stopPropagation();
                                                                    const res = await toggle2FA();
                                                                    if (res.success) alert(`Security Update: 2FA ${res.is2FAEnabled ? 'Activated' : 'Deactivated'}`);
                                                                }}
                                                                className={`relative w-14 h-7 rounded-full transition-all duration-300 border ${user?.is2FAEnabled ? 'bg-[#22d3ee]/20 border-[#22d3ee]/50 shadow-[inset_0_0_10px_rgba(34,211,238,0.2)]' : 'bg-black/40 border-white/5 shadow-inner'}`}
                                                            >
                                                                <div className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full transition-all duration-500 cubic-bezier(0.68, -0.55, 0.27, 1.55) ${user?.is2FAEnabled ? 'left-8 bg-[#22d3ee] shadow-[0_0_15px_#22d3ee]' : 'left-1 bg-gray-600 shadow-md'}`}></div>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <ChevronRight 
                                                            size={14} 
                                                            className="text-gray-800 group-hover:text-[#7b3fe4] transition-colors" 
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        

                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            <AnimatePresence>
                {isPasswordModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07010f]/80 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-md glass-panel p-8 rounded-[2rem] border border-white/10 bg-[#0A0319] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7b3fe4] rounded-full mix-blend-screen filter blur-[60px] opacity-10 pointer-events-none"></div>

                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Secure <span className="text-gradient">Registry</span></h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Credential Protocol Update</p>
                                </div>
                                <button 
                                    onClick={() => setIsPasswordModalOpen(false)}
                                    className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white transition-colors"
                                >
                                    <Activity size={18} className="rotate-45" />
                                </button>
                            </div>

                            <form className="space-y-6" onSubmit={async (e) => {
                                e.preventDefault();
                                if (!currentPassword || !newPassword || !confirmPassword) return setError('All fields are mandatory.');
                                if (newPassword !== confirmPassword) return setError('Credential mismatch detected.');
                                
                                setIsUpdating(true);
                                setError('');
                                const res = await updatePassword(currentPassword, newPassword, confirmPassword);
                                if (res.success) {
                                    alert('Security protocol updated successfully.');
                                    setIsPasswordModalOpen(false);
                                    setCurrentPassword('');
                                    setNewPassword('');
                                    setConfirmPassword('');
                                } else {
                                    setError(res.message);
                                }
                                setIsUpdating(false);
                            }}>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black ml-1">Current Protocol Key</label>
                                    <input 
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-[#050814] border border-white/5 rounded-2xl py-4 px-5 outline-none focus:border-[#7b3fe4]/30 transition-all text-sm font-mono text-white placeholder:text-gray-800"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black ml-1">New Terminal Access Key</label>
                                        <input 
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-[#050814] border border-white/5 rounded-2xl py-4 px-5 outline-none focus:border-[#7b3fe4]/30 transition-all text-sm font-mono text-white placeholder:text-gray-800"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black ml-1">Confirm Access Key</label>
                                        <input 
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-[#050814] border border-white/5 rounded-2xl py-4 px-5 outline-none focus:border-[#7b3fe4]/30 transition-all text-sm font-mono text-white placeholder:text-gray-800"
                                        />
                                    </div>
                                </div>

                                {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center">{error}</p>}

                                <button 
                                    disabled={isUpdating}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#7b3fe4] to-[#a855f7] text-white font-black uppercase tracking-widest text-[10px] hover:shadow-[0_0_30px_rgba(123,63,228,0.3)] active:scale-95 transition-all disabled:opacity-30"
                                >
                                    {isUpdating ? 'Synchronizing...' : 'Authorize Update'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
