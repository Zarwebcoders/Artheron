import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const { forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return setError('Please enter your email address.');
        
        setIsSubmitting(true);
        setError('');

        const result = await forgotPassword(email);
        
        if (result.success) {
            setIsSuccess(true);
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

                    <Link to="/login" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest mb-10 group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </Link>

                    <div className="text-center mb-10">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#7b3fe4]/10 border border-[#7b3fe4]/20 flex items-center justify-center mb-6 glow-purple">
                            <Mail size={32} className="text-[#a855f7]" />
                        </div>
                        <h1 className="text-3xl font-bold font-heading mb-2">Recover <span className="text-gradient">Password</span></h1>
                        <p className="text-gray-500 text-sm font-light px-4">Enter your email to receive a secure reset link</p>
                    </div>

                    {isSuccess ? (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 py-4">
                            <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                                <CheckCircle2 size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">Check your Inbox</h3>
                                <p className="text-gray-500 text-xs px-6">We've sent a recovery link to <strong>{email}</strong>. It will expire in 30 minutes.</p>
                            </div>
                            <button 
                                onClick={() => setIsSuccess(false)}
                                className="text-[#22d3ee] text-[10px] font-bold uppercase tracking-widest hover:underline"
                            >
                                Try another email
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Registered Email</label>
                                <div className="relative group">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#7b3fe4] transition-colors" />
                                    <input 
                                        type="email" 
                                        placeholder="user@example.com" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#050814] border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#7b3fe4]/50 transition-all font-light placeholder:text-gray-700 text-sm" 
                                    />
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
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#7b3fe4] to-[#a855f7] text-white font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(123,63,228,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span>Send Recovery Link</span>
                                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ForgotPassword;
