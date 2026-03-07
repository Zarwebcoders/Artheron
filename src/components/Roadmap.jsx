import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flag, Rocket, Repeat, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Roadmap = () => {
    const containerRef = useRef(null);
    const lineRef = useRef(null);
    const nodesRef = useRef([]);
    const cardsRef = useRef([]);

    const phases = [
        {
            id: 1,
            title: "Foundation & Launch",
            status: "Completed",
            icon: <Flag size={20} className="text-[#22d3ee] relative z-10" />,
            color: "#22d3ee",
            items: [
                "Core Smart Contract Development & Audits",
                "Initial Dex Offering (IDO) on PancakeSwap",
                "CoinMarketCap & CoinGecko Listings",
                "Community Building (Discord & Telegram)"
            ]
        },
        {
            id: 2,
            title: "Ecosystem Expansion",
            status: "In Progress",
            icon: <Rocket size={20} className="text-[#a855f7] relative z-10" />,
            color: "#a855f7",
            items: [
                "Release of Web3 Staking Dashboard",
                "Artheron Wallet Mobile Beta",
                "Strategic Marketing & Exchange Tier-2 Listings",
                "Cross-Chain Bridge Integration (Ethereum & Polygon)"
            ]
        },
        {
            id: 3,
            title: "Protocol Maturation",
            status: "Upcoming",
            icon: <Repeat size={20} className="text-[#7b3fe4] relative z-10" />,
            color: "#7b3fe4",
            items: [
                "Launch of Artheron NFT Marketplace",
                "DAO Governance Implementation",
                "Tier-1 Centralized Exchange Listings",
                "Institutional Liquidity Partnerships"
            ]
        },
        {
            id: 4,
            title: "Global Adoption",
            status: "Future",
            icon: <Globe size={20} className="text-[#22d3ee] relative z-10" />,
            color: "#22d3ee",
            items: [
                "Artheron Layer-2 Testnet",
                "DeFi Synthetic Assets Platform",
                "Real World Asset (RWA) Tokenization",
                "Mainstream Brand Integrations"
            ]
        }
    ];

    useEffect(() => {
        let ctx = gsap.context(() => {
            // 1. Line Drawing Animation
            gsap.fromTo(lineRef.current,
                { scaleY: 0, transformOrigin: "top center" },
                {
                    scaleY: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top center",
                        end: "bottom center",
                        scrub: 1.5,
                    }
                }
            );

            // 2. Nodes and Cards Pop-in as the line reaches them
            cardsRef.current.forEach((card, i) => {
                if (!card) return;
                const node = nodesRef.current[i];

                // Initial states
                gsap.set(card, { opacity: 0, x: i % 2 === 0 ? 50 : -50, scale: 0.9 });
                gsap.set(node, { scale: 0, rotation: -180 });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: "top 70%", // Trigger when card is 70% down the viewport
                        toggleActions: "play none none reverse"
                    }
                });

                // Node pop
                tl.to(node, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.6,
                    ease: "back.out(2)"
                });

                // Card slide in
                tl.to(card, {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: "power3.out"
                }, "-=0.4");
            });

            // 3. Hover effects on cards
            cardsRef.current.forEach((card, i) => {
                if (!card) return;
                const node = nodesRef.current[i];

                card.addEventListener('mouseenter', () => {
                    gsap.to(node, {
                        scale: 1.2,
                        boxShadow: `0 0 20px ${phases[i].color}80`,
                        duration: 0.3
                    });
                    gsap.to(card, {
                        y: -10,
                        borderColor: phases[i].color,
                        boxShadow: `0 10px 30px -10px ${phases[i].color}40`,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(node, {
                        scale: 1,
                        boxShadow: `0 0 0px ${phases[i].color}00`,
                        duration: 0.3
                    });
                    gsap.to(card, {
                        y: 0,
                        borderColor: "rgba(255,255,255,0.05)",
                        boxShadow: "none",
                        duration: 0.4,
                        ease: "power2.out"
                    });
                });
            });

        }, containerRef); // Scope to container

        return () => ctx.revert(); // Cleanup
    }, []);

    return (
        <section id="roadmap" ref={containerRef} className="py-24 relative bg-gradient-premium overflow-hidden">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20 text-white">
                    <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
                        The Path <span className="text-gradient">Forward</span>
                    </h2>
                    <p className="text-xl text-gray-400 font-light">
                        Our strategic vision to build the most comprehensive decentralized financial ecosystem.
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Background Line (Dim) */}
                    <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-white/[0.03] transform md:-translate-x-1/2 rounded-full hidden md:block"></div>

                    {/* Animated Fill Line */}
                    <div
                        ref={lineRef}
                        className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#22d3ee] via-[#a855f7] to-[#7b3fe4] transform md:-translate-x-1/2 shadow-[0_0_15px_rgba(168,85,247,0.5)] z-0 rounded-full hidden md:block"
                    ></div>

                    <div className="space-y-24">
                        {phases.map((phase, index) => (
                            <div key={phase.id} className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                                {/* Timeline Node */}
                                <div
                                    ref={el => nodesRef.current[index] = el}
                                    className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-2xl bg-[#050814] border-2 flex items-center justify-center z-20 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
                                    style={{ borderColor: phase.color }}
                                >
                                    {/* Inner Node Glow */}
                                    <div className="absolute inset-0 rounded-2xl opacity-20 filter blur-sm" style={{ backgroundColor: phase.color }}></div>
                                    {phase.icon}
                                </div>

                                {/* Content Box */}
                                <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pl-20' : 'md:pr-20'} w-full`}>
                                    <div
                                        ref={el => cardsRef.current[index] = el}
                                        className="p-8 rounded-[2rem] border transition-colors relative bg-[#0a0319] overflow-hidden"
                                        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                                    >
                                        {/* Subtle corner glow fixed to card */}
                                        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full mix-blend-screen filter blur-[60px] opacity-[0.15] pointer-events-none" style={{ backgroundColor: phase.color }}></div>

                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                                            <span className="text-sm font-bold font-mono tracking-[0.2em] relative z-10" style={{ color: phase.color }}>
                                                PHASE {phase.id}
                                            </span>
                                            <span className="text-xs bg-white/5 px-3 py-1.5 rounded-full border border-white/10 text-gray-400 font-medium whitespace-nowrap inline-flex self-start sm:self-auto relative z-10">
                                                {phase.status}
                                            </span>
                                        </div>

                                        <h3 className="text-3xl font-bold font-heading text-white mb-6 tracking-tight relative z-10">
                                            {phase.title}
                                        </h3>

                                        <ul className="space-y-4 relative z-10">
                                            {phase.items.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 group">
                                                    <div className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 transition-transform group-hover:scale-150" style={{ backgroundColor: phase.color }}></div>
                                                    <span className="text-gray-400 text-base font-light leading-relaxed group-hover:text-gray-300 transition-colors">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Roadmap;
