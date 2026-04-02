import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import { motion } from 'framer-motion';
import { ArrowRight, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const ParticleField = (props) => {
    const pointsRef = useRef();
    const groupRef = useRef();
    const sphere = random.inSphere(new Float32Array(5000), { radius: 1.5 });

    useEffect(() => {
        const handleMouseMove = (event) => {
            if (!groupRef.current) return;
            const x = (event.clientX / window.innerWidth - 0.5) * 2;
            const y = (event.clientY / window.innerHeight - 0.5) * 2;

            gsap.to(groupRef.current.rotation, {
                x: y * 0.5,
                y: x * 0.5,
                duration: 2,
                ease: "power2.out"
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame((state, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.x -= delta / 10;
            pointsRef.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group ref={groupRef} rotation={[0, 0, Math.PI / 4]}>
            <Points ref={pointsRef} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#00F5FF"
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
};

const Hero = () => {
    return (
        <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-premium">
            {/* 3D Background */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 1] }}>
                    <ParticleField />
                </Canvas>
            </div>

            {/* Decorative Glows */}
            <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#3B82F6] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#7C3AED] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8"
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-[#00F5FF] text-xs font-bold font-mono tracking-wider mb-6">
                        WELCOME TO WEB3
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading leading-tight tracking-tight mb-6">
                        The Future of <br className="hidden md:block" />
                        <span className="text-gradient">Decentralized Finance</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400 font-light">
                        A premium, high-performance ecosystem designed for the next generation of digital asset investors. Secure, fast, and completely decentralized.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row gap-4 mt-8"
                >
                    <Link to="/login">
                        <button className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-xl font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            Start Trading <ArrowRight size={18} />
                        </button>
                    </Link>
                    <a href="#features">
                        <button className="w-full sm:w-auto px-8 py-4 glass-panel-light text-white rounded-xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            Explore Ecosystem
                        </button>
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-16 flex items-center gap-8 text-gray-500 text-sm font-mono"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        Network Live
                    </div>
                    <div className="hidden sm:block w-px h-4 bg-white/10"></div>
                    <div className="hidden sm:block">Built on BNB Chain</div>
                </motion.div>
            </div>

            {/* Embedded gradient floor */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050814] to-transparent z-10 pointer-events-none"></div>
        </div>
    );
};

export default Hero;
