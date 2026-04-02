import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Mail, 
    Lock, 
    User, 
    ArrowRight, 
    Rocket, 
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';
import Navbar from '../components/Navbar';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        gsap.fromTo(".register-card", 
            { y: 30, opacity: 0, scale: 0.98 },
            { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
        );
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, password, confirmPassword } = formData;

        if (!name || !email || !password) return setError('All fields are required.');
        if (password !== confirmPassword) return setError('Passwords do not match.');
        if (password.length < 6) return setError('Password must be at least 6 characters.');

        setIsLoading(true);
        setError('');

        // Mock registration flow
        setTimeout(() => {
            setIsSuccess(true);
            setIsLoading(false);
            
            // Auto login after 2 seconds
            setTimeout(() => {
                login({ email, name, role: 'user', id: 'user_' + Date.now() });
                navigate('/dashboard');
            }, 2000);
        }, 1500);
    };

    return (
        <div className="relative w-full min-h-screen bg-[#07010f] text-white flex flex-col overflow-hidden">
            <Navbar />
            
            {/* Background Glows */}
            <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#7b3fe4] rounded-full mix-blend-screen filter blur-[250px] opacity-[0.03] pointer-events-none"></div>

            <main className="flex-grow flex items-center justify-center px-4 py-32 relative z-10">
                <div className="register-card w-full max-w-md glass-panel p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden bg-[#0A0319]/80 backdrop-blur-xl">
                    
                    <AnimatePresence mode="wait">
                        {!isSuccess ? (
                            <motion.div 
                                key="form"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <div className="text-center mb-10">
                                    <div className="w-16 h-16 mx-auto rounded-2xl bg-[#22d3ee]/10 border border-[#22d3ee]/20 flex items-center justify-center mb-6 glow-blue">
                                        <Rocket size={32} className="text-[#22d3ee]" />
                                    </div>
                                    <h1 className="text-3xl font-bold font-heading mb-2">Create <span className="text-gradient">Account</span></h1>
                                    <p className="text-gray-500 text-sm font-light">Join the Artheron PRO ecosystem</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative group">
                                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#22d3ee] transition-colors" />
                                            <input 
                                                type="text" 
                                                name="name"
                                                placeholder="John Doe" 
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full bg-[#050814] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-[#22d3ee]/50 transition-all font-light placeholder:text-gray-700" 
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                        <div className="relative group">
                                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#22d3ee] transition-colors" />
                                            <input 
                                                type="email" 
                                                name="email"
                                                placeholder="name@example.com" 
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full bg-[#050814] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-[#22d3ee]/50 transition-all font-light placeholder:text-gray-700" 
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                                        <div className="relative group">
                                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#22d3ee] transition-colors" />
                                            <input 
                                                type="password" 
                                                name="password"
                                                placeholder="••••••••" 
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="w-full bg-[#050814] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-[#22d3ee]/50 transition-all font-light placeholder:text-gray-700" 
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm Password</label>
                                        <div className="relative group">
                                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#22d3ee] transition-colors" />
                                            <input 
                                                type="password" 
                                                name="confirmPassword"
                                                placeholder="••••••••" 
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className="w-full bg-[#050814] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-[#22d3ee]/50 transition-all font-light placeholder:text-gray-700" 
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
                                        disabled={isLoading}
                                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#22d3ee] to-[#7b3fe4] text-white font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(123,63,228,0.4)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <span>Initialize Account</span>
                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <p className="text-center mt-10 text-gray-500 text-sm font-light">
                                    Already have an account? <Link to="/login" className="text-[#22d3ee] font-bold hover:underline">Sign in</Link>
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-10"
                            >
                                <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                                    <CheckCircle2 size={40} className="text-green-500" />
                                </div>
                                <h2 className="text-3xl font-bold font-heading mb-4 text-white">Registration <span className="text-green-500">Successful</span></h2>
                                <p className="text-gray-400 mb-8 font-light">Welcome to the future of staking. Redirecting you to your secure dashboard...</p>
                                <div className="flex justify-center">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0s' }}></div>
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default Register;
