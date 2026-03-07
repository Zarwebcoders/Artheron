import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustedBy from '../components/TrustedBy';
import Features from '../components/Features';
import WalletSection from '../components/WalletSection';
import Security from '../components/Security';
import LiveStats from '../components/LiveStats';
import Tokenomics from '../components/Tokenomics';
import Roadmap from '../components/Roadmap';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import ScrollProgressBar from '../components/ScrollProgressBar';

const Home = () => {
    return (
        <div className="relative w-full bg-[#07010f] min-h-screen text-white overflow-hidden">
            <ScrollProgressBar />
            <Navbar />
            <main>
                <Hero />
                <TrustedBy />
                <Features />
                <WalletSection />
                <Security />
                <LiveStats />
                <Tokenomics />
                <Roadmap />
                <CTASection />
            </main>
            <Footer />
        </div>
    )
}

export default Home;
