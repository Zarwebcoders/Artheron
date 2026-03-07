import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
    SiBinance,
    SiCoinbase,
    SiChainlink,
    SiSolana,
    SiEthereum,
    SiPolygon
} from 'react-icons/si';

const MagneticPartner = ({ partner, index }) => {
    const itemRef = useRef(null);
    const textRef = useRef(null);
    const glowRef = useRef(null);
    const iconRef = useRef(null);

    useEffect(() => {
        const el = itemRef.current;
        const text = textRef.current;
        const glow = glowRef.current;
        const icon = iconRef.current;

        if (!el || !text || !glow || !icon) return;

        // Ensure initial state
        gsap.set(el, { opacity: 0, y: 30, scale: 0.9 });
        gsap.set(text, { color: 'rgba(255,255,255,0.5)' });
        gsap.set(icon, { color: 'rgba(255,255,255,0.4)', scale: 1 });

        // Intro animation using simple IntersectionObserver
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    delay: index * 0.15,
                    ease: "back.out(1.5)"
                });
                observer.disconnect();
            }
        }, { threshold: 0.1 });

        observer.observe(el);

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = el.getBoundingClientRect();

            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);

            // Magnetic movement
            gsap.to(el, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.6,
                ease: "power3.out"
            });

            // Text color and glow pop
            gsap.to(text, {
                color: '#ffffff',
                textShadow: "0px 0px 25px rgba(34, 211, 238, 0.8)",
                scale: 1.05,
                duration: 0.3
            });

            // Icon highlight
            gsap.to(icon, {
                color: partner.brandColor || '#ffffff',
                scale: 1.2,
                duration: 0.4,
                ease: "power2.out"
            });

            // Backing glow
            gsap.to(glow, {
                opacity: 0.4,
                scale: 1.2,
                duration: 0.4
            });
        };

        const handleMouseLeave = () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)"
            });

            gsap.to(text, {
                color: 'rgba(255,255,255,0.5)',
                textShadow: "0px 0px 0px rgba(34, 211, 238, 0)",
                scale: 1,
                duration: 0.4
            });

            gsap.to(icon, {
                color: 'rgba(255,255,255,0.4)',
                scale: 1,
                duration: 0.4
            });

            gsap.to(glow, {
                opacity: 0,
                scale: 1,
                duration: 0.4
            });
        };

        el.addEventListener("mousemove", handleMouseMove);
        el.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            el.removeEventListener("mousemove", handleMouseMove);
            el.removeEventListener("mouseleave", handleMouseLeave);
            observer.disconnect();
        };
    }, [index, partner.brandColor, partner.Icon]);

    return (
        <div ref={itemRef} className="relative cursor-pointer py-6 px-8 flex items-center justify-center z-10 group">
            {/* Hidden Glow behind */}
            <div ref={glowRef} className="absolute inset-0 bg-gradient-to-r from-[#22d3ee] to-[#7b3fe4] rounded-full filter blur-xl opacity-0 pointer-events-none mix-blend-screen"></div>

            <div className="relative z-10 flex items-center gap-4 pointer-events-none">
                <div ref={iconRef} className="text-3xl md:text-4xl transition-colors duration-300">
                    <partner.Icon />
                </div>
                <span ref={textRef} className="text-xl md:text-2xl font-bold font-heading tracking-widest uppercase opacity-80">
                    {partner.name}
                </span>
            </div>
        </div>
    );
};

const TrustedBy = () => {
    const partners = [
        { name: 'Binance', Icon: SiBinance, brandColor: '#F3BA2F' },
        { name: 'Coinbase', Icon: SiCoinbase, brandColor: '#0052FF' },
        { name: 'Chainlink', Icon: SiChainlink, brandColor: '#2A5ADA' },
        { name: 'Solana', Icon: SiSolana, brandColor: '#14F195' },
        { name: 'Ethereum', Icon: SiEthereum, brandColor: '#627EEA' },
        { name: 'Polygon', Icon: SiPolygon, brandColor: '#8247E5' },
    ];

    return (
        <section className="py-24 bg-[#07010f] border-t border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#7b3fe4]/50 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <p className="text-[#a855f7] font-mono text-sm tracking-[0.3em] uppercase mb-16 glow-purple inline-block">Trusted by industry leaders</p>

                <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-12">
                    {partners.map((partner, index) => (
                        <MagneticPartner key={index} partner={partner} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustedBy;
