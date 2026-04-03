import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Flame, 
    Share2, 
    RefreshCw, 
    ShieldCheck
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { ethers } from 'ethers';

const AdminToken = () => {
    const { balance, contract, refreshBalance, isOwner } = useWallet();
    const [burnAmount, setBurnAmount] = useState('');
    const [newOwnerAddress, setNewOwnerAddress] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [txHash, setTxHash] = useState(null);

    const handleBurn = async () => {
        if (!contract || !burnAmount) return;
        setIsProcessing(true);
        setTxHash(null);
        try {
            const amount = ethers.parseUnits(burnAmount, 18);
            const tx = await contract.burn(amount);
            setTxHash(tx.hash);
            await tx.wait();
            alert("Tokens burned successfully!");
            setBurnAmount('');
            refreshBalance();
        } catch (error) {
            console.error("Burn failed:", error);
            alert("Transaction failed: " + (error.reason || error.message));
        } finally {
            setIsProcessing(false);
        }
    };

    const handleTransferOwnership = async () => {
        if (!contract || !newOwnerAddress) return;
        if (!ethers.isAddress(newOwnerAddress)) {
            alert("Invalid address!");
            return;
        }
        setIsProcessing(true);
        setTxHash(null);
        try {
            const tx = await contract.transferOwnership(newOwnerAddress);
            setTxHash(tx.hash);
            await tx.wait();
            alert("Ownership transferred successfully!");
            setNewOwnerAddress('');
            window.location.reload(); 
        } catch (error) {
            console.error("Transfer failed:", error);
            alert("Transaction failed: " + (error.reason || error.message));
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isOwner) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 text-center">
                 <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6">
                    <ShieldCheck size={32} />
                 </div>
                 <h2 className="text-2xl font-bold font-heading uppercase text-white mb-2">Access Restricted</h2>
                 <p className="text-gray-500 text-xs font-mono uppercase tracking-widest max-w-sm">This terminal is reserved for the Contract Sovereign. Your credentials do not matching the owner signature.</p>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                            <Flame size={16} />
                        </div>
                        <span className="text-gray-500 font-mono text-[10px] font-bold tracking-[0.3em] uppercase">Token Genesis Control</span>
                    </div>
                    <h1 className="text-4xl font-bold font-heading uppercase tracking-tighter leading-none text-white">
                        SMART <span className="text-gradient">CONTRACT</span>
                    </h1>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Burn Section */}
                <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 bg-[#0A0319]/50 space-y-8 relative overflow-hidden group">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 blur-[100px] pointer-events-none group-hover:bg-orange-500/15 transition-all"></div>
                    
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                            <Flame size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold font-heading uppercase text-white tracking-tight">Supply <span className="text-orange-500">Reduction</span></h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Permanent Token Incineration Protocol</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between px-1">
                                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Amount to Burn (ARTH)</label>
                                <span className="text-[10px] text-gray-400 font-mono">BAL: {parseFloat(balance).toLocaleString()}</span>
                            </div>
                            <input 
                                type="number"
                                value={burnAmount}
                                onChange={(e) => setBurnAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-[#050814] border border-white/5 rounded-2xl py-6 px-6 text-2xl font-mono text-white outline-none focus:border-orange-500/30 transition-all font-bold shadow-inner"
                            />
                        </div>

                        <button 
                            onClick={handleBurn}
                            disabled={isProcessing || !burnAmount}
                            className="w-full py-5 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold uppercase tracking-[0.3em] text-[10px] shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                        >
                            {isProcessing ? (
                                <div className="flex items-center justify-center gap-3">
                                    <RefreshCw size={14} className="animate-spin" />
                                    Commencing Burn...
                                </div>
                            ) : 'Initialize Burn Sequence'}
                        </button>
                    </div>
                </div>

                {/* Ownership Section */}
                <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 bg-[#0A0319]/50 space-y-8 relative overflow-hidden group">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none group-hover:bg-cyan-500/15 transition-all"></div>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
                            <Share2 size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold font-heading uppercase text-white tracking-tight">Authority <span className="text-cyan-500">Handoff</span></h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Contract Sovereignty Transfer Protocol</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest px-1">New Authority Address</label>
                            <input 
                                type="text"
                                value={newOwnerAddress}
                                onChange={(e) => setNewOwnerAddress(e.target.value)}
                                placeholder="0x..."
                                className="w-full bg-[#050814] border border-white/5 rounded-2xl py-6 px-6 text-sm font-mono text-white outline-none focus:border-cyan-500/30 transition-all shadow-inner"
                            />
                        </div>

                        <button 
                            onClick={handleTransferOwnership}
                            disabled={isProcessing || !newOwnerAddress}
                            className="w-full py-5 rounded-2xl bg-white text-black font-bold uppercase tracking-[0.3em] text-[10px] shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {isProcessing ? (
                                <div className="flex items-center justify-center gap-3">
                                    <RefreshCw size={14} className="animate-spin" />
                                    Transferring Command...
                                </div>
                            ) : 'Execute Authority Transfer'}
                        </button>

                        {txHash && (
                            <div className="pt-4 border-t border-white/5">
                                <p className="text-[8px] text-gray-500 uppercase tracking-widest mb-2 font-mono">Blockchain Signature</p>
                                <p className="text-[10px] font-mono text-cyan-500/80 truncate bg-white/5 p-3 rounded-lg border border-white/5">{txHash}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminToken;
