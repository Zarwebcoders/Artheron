import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Mail, 
    Lock, 
    Wallet, 
    ArrowRight, 
    ShieldCheck, 
    AlertCircle,
    Eye,
    EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import gsap from 'gsap';
import Navbar from '../components/Navbar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const { login } = useAuth();
    const { account, connectWallet } = useWallet();
    const navigate = useNavigate();
    const formRef = useRef(null);

    useEffect(() => {
        // Simple GSAP entry
        gsap.fromTo(".login-card", 
            { y: 30, opacity: 0, scale: 0.98 },
            { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
        );
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return setError('Please fill in all fields.');
        
        setIsLoggingIn(true);
        setError('');

        const result = await login(email, password);
        
        if (result.success) {
            if (result.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(result.message);
        }
        setIsLoggingIn(false);
    };

    const handleWalletLogin = async () => {
        const connected = await connectWallet();
        if (connected) {
            setIsLoggingIn(true);
            setTimeout(() => {
                login({ 
                    email: `${connected.substring(0, 6)}...${connected.slice(-4)}@wallet.io`, 
                    role: 'user', 
                    id: connected,
                    wallet: connected 
                });
                navigate('/dashboard');
                setIsLoggingIn(false);
            }, 1000);
        }
    };

    return (
        <div className="relative w-full min-h-screen bg-[#07010f] text-white flex flex-col overflow-hidden">
            <Navbar />
            
            {/* Background Glows */}
            <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-[#7b3fe4] rounded-full mix-blend-screen filter blur-[250px] opacity-[0.03] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[#22d3ee] rounded-full mix-blend-screen filter blur-[250px] opacity-[0.03] pointer-events-none"></div>

            <main className="flex-grow flex items-center justify-center px-4 py-32 relative z-10">
                <div className="login-card w-full max-w-md glass-panel p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden bg-[#0A0319]/80 backdrop-blur-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#7b3fe4] rounded-full mix-blend-screen filter blur-[60px] opacity-10 pointer-events-none"></div>

                    <div className="text-center mb-10">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#7b3fe4]/10 border border-[#7b3fe4]/20 flex items-center justify-center mb-6 glow-purple">
                            <ShieldCheck size={32} className="text-[#a855f7]" />
                        </div>
                        <h1 className="text-3xl font-bold font-heading mb-2">Welcome <span className="text-gradient">Back</span></h1>
                        <p className="text-gray-500 text-sm font-light">Access your Artheron PRO console</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#7b3fe4] transition-colors" />
                                <input 
                                    type="email" 
                                    placeholder="name@example.com" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#050814] border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#7b3fe4]/50 transition-all font-light placeholder:text-gray-700" 
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Secure Password</label>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#7b3fe4] transition-colors" />
                                <input 
                                    type={showPassword ? 'text' : 'password'} 
                                    placeholder="••••••••" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#050814] border border-white/5 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-[#7b3fe4]/50 transition-all font-light placeholder:text-gray-700" 
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

                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-red-400 text-xs bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                                <AlertCircle size={14} /> {error}
                            </motion.div>
                        )}

                        <button 
                            type="submit" 
                            disabled={isLoggingIn}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#7b3fe4] to-[#a855f7] text-white font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(123,63,228,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group"
                        >
                            {isLoggingIn ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Continue to Dashboard</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0A0319] px-4 text-gray-500 font-bold tracking-widest">Or login with</span></div>
                    </div>

                    <button 
                        onClick={handleWalletLogin}
                        className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest transition-all hover:bg-white/10 hover:border-white/20 flex items-center justify-center gap-3 active:scale-95"
                    >
                        <Wallet size={20} className="text-[#22d3ee]" />
                        <span>Web3 Wallet</span>
                    </button>

                    <p className="text-center mt-10 text-gray-500 text-sm font-light">
                        Don't have an account? <Link to="/register" className="text-[#a855f7] font-bold hover:underline">Sign up for PRO</Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Login;
