import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { resetPassword } = useAuth();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || !confirmPassword) return setError('Please fill in all fields.');
        if (password !== confirmPassword) return setError('Passwords do not match.');
        if (password.length < 6) return setError('Password must be at least 6 characters.');
        
        setIsSubmitting(true);
        setError('');

        const result = await resetPassword(token, password);
        
        if (result.success) {
            setIsSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);
        } else {
            setError(result.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="relative w-full min-h-screen bg-[#07010f] text-white flex flex-col overflow-hidden">
            <Navbar />
            
            <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-[#7b3fe4] rounded-full mix-blend-screen filter blur-[250px] opacity-[0.03] pointer-events-none"></div>
            
            <main className="flex-grow flex items-center justify-center px-4 py-32 relative z-10">
                <div className="w-full max-w-md glass-panel p-10 rounded-[2.5rem] border border-white/10 bg-[#0A0319]/80 backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#7b3fe4] rounded-full mix-blend-screen filter blur-[60px] opacity-10 pointer-events-none"></div>

                    <div className="text-center mb-10">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#7b3fe4]/10 border border-[#7b3fe4]/20 flex items-center justify-center mb-6 glow-purple">
                            <Lock size={32} className="text-[#a855f7]" />
                        </div>
                        <h1 className="text-3xl font-bold font-heading mb-2">Set New <span className="text-gradient">Password</span></h1>
                        <p className="text-gray-500 text-sm font-light px-4">Create a strong, unique password for your account</p>
                    </div>

                    {isSuccess ? (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 py-4">
                            <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                                <CheckCircle2 size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">Password Reset!</h3>
                                <p className="text-gray-500 text-xs px-6">Your security credentials have been updated. Redirecting to your console...</p>
                            </div>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                                    <div className="relative group">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#7b3fe4] transition-colors" />
                                        <input 
                                            type={showPassword ? 'text' : 'password'} 
                                            placeholder="••••••••" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-[#050814] border border-white/5 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-[#7b3fe4]/50 transition-all font-light placeholder:text-gray-700 text-sm" 
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-500 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                                    <div className="relative group">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#7b3fe4] transition-colors" />
                                        <input 
                                            type={showPassword ? 'text' : 'password'} 
                                            placeholder="••••••••" 
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-[#050814] border border-white/5 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-[#7b3fe4]/50 transition-all font-light placeholder:text-gray-700 text-sm" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-red-400 text-xs bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                                    <AlertCircle size={14} /> {error}
                                </motion.div>
                            )}

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#22d3ee] to-[#7b3fe4] text-white font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <span>Update Recovery Key</span>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ResetPassword;
