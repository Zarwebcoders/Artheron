import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Tokenomics = () => {
    const containerRef = useRef(null);
    const centerCoinRef = useRef(null);
    const ringsRef = useRef([]);
    const cardsRef = useRef([]);

    const allocations = [
        { name: "Community & Liquidity", percent: "40%", description: "Fueling the ecosystem and ensuring deep liquidity.", color: "#22d3ee" }, // Electric Blue
        { name: "Development & Ecosystem", percent: "20%", description: "Protocol upgrades and ecosystem grants.", color: "#a855f7" }, // Neon Purple
        { name: "Team (Locked)", percent: "15%", description: "Vested over 4 years to align long-term incentives.", color: "#7b3fe4" }, // Deep Purple
        { name: "Marketing & Partnerships", percent: "10%", description: "Global expansion and strategic alliances.", color: "#F59E0B" }, // Amber/Orange
        { name: "Staking / Rewards", percent: "10%", description: "Yield for long-term holders and delegators.", color: "#10B981" }, // Emerald Green
        { name: "Reserve / Emergency", percent: "5%", description: "Safeguard against unforeseen market conditions.", color: "#F43F5E" } // Rose / Red
    ];

    useEffect(() => {
        let ctx = gsap.context(() => {

            // Central Coin Intro
            gsap.fromTo(centerCoinRef.current,
                { scale: 0, rotation: -180, opacity: 0 },
                {
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    duration: 1.5,
                    ease: "back.out(1.5)",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 60%",
                    }
                }
            );

            // Continually float central coin
            gsap.to(centerCoinRef.current, {
                y: -15,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            // Rings animation
            ringsRef.current.forEach((ring, index) => {
                if (!ring) return;

                // Explode out
                gsap.fromTo(ring,
                    { scale: 0, opacity: 0 },
                    {
                        scale: 1 + (index * 0.25), // varied sizes
                        opacity: 0.15,
                        duration: 1.5,
                        delay: 0.2 + (index * 0.1),
                        ease: "elastic.out(1, 0.7)",
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: "top 60%",
                        }
                    }
                );

                // Rotate infinitely
                gsap.to(ring, {
                    rotation: index % 2 === 0 ? 360 : -360,
                    duration: 20 + (index * 5),
                    repeat: -1,
                    ease: "none"
                });
            });

            // Cards stagger in
            gsap.fromTo(cardsRef.current,
                { y: 50, opacity: 0, scale: 0.9 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 50%",
                    }
                }
            );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="tokenomics" ref={containerRef} className="py-24 relative bg-[#07010f] overflow-hidden border-t border-white/5">

            {/* Visual Background / Interactive Graphic */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-30 md:opacity-100">
                {/* Center SVG Coin */}
                <div
                    ref={centerCoinRef}
                    className="relative z-10 w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-[#7b3fe4] to-[#22d3ee] flex items-center justify-center shadow-[0_0_100px_rgba(34,211,238,0.4)] border border-white/20"
                >
                    <div className="absolute inset-2 bg-[#050814] rounded-full flex items-center justify-center border border-white/10">
                        <span className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                            ARTH
                        </span>
                    </div>
                </div>

                {/* Orbit Rings */}
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        ref={el => ringsRef.current[i] = el}
                        className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border border-dashed border-[#a855f7] flex items-center justify-center"
                        style={{ borderStyle: i % 2 === 0 ? 'dashed' : 'solid' }}
                    >
                        {/* Orbiting Planets/Nodes */}
                        <div className="absolute -top-3 w-6 h-6 rounded-full bg-[#22d3ee] shadow-[0_0_20px_#22d3ee]"></div>
                        {i % 2 !== 0 && (
                            <div className="absolute -bottom-2 w-4 h-4 rounded-full bg-[#a855f7] shadow-[0_0_20px_#a855f7]"></div>
                        )}
                    </div>
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                <div className="text-center max-w-3xl mx-auto mb-24 md:mb-40">
                    <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white">
                        Transparent <span className="text-gradient">Tokenomics</span>
                    </h2>
                    <p className="text-xl text-gray-400 font-light">
                        Engineered for long-term sustainability, ecosystem growth, and community rewards. Total Supply: 440,000,000 ARTH.
                    </p>
                </div>

                {/* Data Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-[20vh] md:mt-0">
                    {allocations.map((item, index) => (
                        <div
                            key={index}
                            ref={el => cardsRef.current[index] = el}
                            className="glass-panel p-8 rounded-2xl border border-white/5 relative group hover:-translate-y-2 transition-transform duration-300 overflow-hidden bg-[#0A0319]/80 backdrop-blur-md"
                        >
                            {/* Hover Gradient Overlay */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                                style={{ background: `linear-gradient(135deg, ${item.color}, transparent)` }}
                            ></div>

                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-lg font-bold text-white max-w-[70%] leading-tight">{item.name}</h3>
                                <div className="text-3xl font-bold font-mono" style={{ color: item.color, textShadow: `0 0 20px ${item.color}80` }}>
                                    {item.percent}
                                </div>
                            </div>

                            <div className="w-full h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{
                                        width: item.percent,
                                        backgroundColor: item.color,
                                        boxShadow: `0 0 10px ${item.color}`
                                    }}
                                ></div>
                            </div>

                            <p className="text-gray-400 text-sm font-light leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Tokenomics;
