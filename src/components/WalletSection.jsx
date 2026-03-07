import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WalletSection = () => {
    const containerRef = useRef(null);
    const coinsRef = useRef([]);
    const parallaxRefs = useRef([]);
    const platformRef = useRef(null);

    const coins = [
        { name: 'BTC', label: 'Bitcoin', color: '#F59E0B', x: -140, y: -60, size: 'w-16 h-16', icon: '₿', z: 3 },
        { name: 'ETH', label: 'Ethereum', color: '#7b3fe4', x: 120, y: -90, size: 'w-20 h-20', icon: 'Ξ', z: 5 },
        { name: 'SOL', label: 'Solana', color: '#22d3ee', x: -80, y: -150, size: 'w-14 h-14', icon: 'S', z: 2 },
        { name: 'USDC', label: 'USD Coin', color: '#2775CA', x: 150, y: 10, size: 'w-12 h-12', icon: '$', z: 4 },
        { name: 'BNB', label: 'BNB', color: '#F3BA2F', x: -180, y: 40, size: 'w-14 h-14', icon: 'B', z: 1 },
    ];

    useEffect(() => {
        // 1. Initial explosion animation (from center)
        coinsRef.current.forEach((coin, i) => {
            if (!coin) return;

            // Start clustered in the center bottom
            gsap.set(coin, {
                x: 0,
                y: 100,
                scale: 0,
                opacity: 0,
                rotation: -180
            });

            // The target coordinates
            const targetX = coins[i].x;
            const targetY = coins[i].y;

            // Intro animation creating an explosion effect
            gsap.to(coin, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top center",
                },
                x: targetX,
                y: targetY,
                scale: 1,
                opacity: 1,
                rotation: 0,
                duration: 1.5,
                delay: i * 0.15,
                ease: "elastic.out(1, 0.5)",
                onComplete: () => {
                    // Add infinite floating motion
                    gsap.to(coin, {
                        y: targetY - 25,
                        x: targetX + (i % 2 === 0 ? 15 : -15),
                        rotation: i % 2 === 0 ? 10 : -10,
                        duration: 3 + i * 0.5,
                        yoyo: true,
                        repeat: -1,
                        ease: "sine.inOut"
                    });
                }
            });
        });

        // 2. Mouse Parallax Effect (applied to outer wrappers)
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 2;
            const yPos = (clientY / window.innerHeight - 0.5) * 2;

            parallaxRefs.current.forEach((wrap, i) => {
                if (!wrap) return;
                // The larger the z index, the closer it feels = more movement
                const depth = coins[i].z * 15;

                gsap.to(wrap, {
                    x: xPos * depth,
                    y: yPos * depth,
                    duration: 1.5,
                    ease: "power2.out"
                });
            });

            if (platformRef.current) {
                gsap.to(platformRef.current, {
                    x: -xPos * 20,
                    y: -yPos * 20,
                    duration: 2,
                    ease: "power2.out"
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section ref={containerRef} className="py-32 relative bg-gradient-premium overflow-hidden">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-white"
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-[#a855f7]/30 text-[#a855f7] text-xs font-bold font-mono tracking-wider mb-6 glow-purple">
                            UNIVERSAL SUPPORT
                        </span>
                        <h2 className="text-5xl md:text-6xl font-bold font-heading mb-6 leading-tight">
                            2,300+ Coins. <br />
                            <span className="text-gradient">One Wallet.</span>
                        </h2>
                        <p className="text-lg text-gray-400 font-light mb-8 max-w-lg leading-relaxed">
                            Store, swap, and manage thousands of digital assets seamlessly across multiple blockchains without ever leaving the platform.
                        </p>

                        <div className="flex gap-4">
                            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                                View All Assets
                            </button>
                        </div>
                    </motion.div>

                    {/* Visual Side */}
                    <div className="relative h-[400px] flex items-center justify-center mt-12 lg:mt-0">
                        {/* The Platform/Base */}
                        <div ref={platformRef} className="absolute bottom-10 w-[300px] h-[60px] md:w-[400px] md:h-[80px] flex items-center justify-center">
                            <div className="absolute inset-0 bg-[#7b3fe4]/20 rounded-[100%] filter blur-[20px] shadow-[0_0_100px_rgba(34,211,238,0.5)]"></div>
                            <div className="absolute inset-4 bg-gradient-to-r from-[#7b3fe4] to-[#22d3ee] rounded-[100%] opacity-40"></div>
                        </div>

                        {/* Floating Coins */}
                        <div className="absolute inset-0">
                            {coins.map((coin, index) => (
                                <div
                                    key={index}
                                    ref={el => parallaxRefs.current[index] = el}
                                    className="absolute top-1/2 left-1/2 pointer-events-none"
                                    style={{ zIndex: coin.z * 10 }} // Stacking context
                                >
                                    <div
                                        ref={el => coinsRef.current[index] = el}
                                        className={`absolute rounded-full flex flex-col items-center justify-center shadow-2xl glass-panel-light`}
                                        style={{
                                            marginLeft: '-50%',
                                            marginTop: '-50%',
                                            borderColor: `${coin.color}50`
                                        }}
                                    >
                                        <div className={`${coin.size} rounded-full flex items-center justify-center relative group`}>
                                            {/* Glow behind icon */}
                                            <div className="absolute inset-0 rounded-full opacity-50 blur-md" style={{ backgroundColor: coin.color }}></div>
                                            <span className="text-2xl md:text-3xl font-bold drop-shadow-md relative z-10" style={{ color: coin.color }}>
                                                {coin.icon}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default WalletSection;
