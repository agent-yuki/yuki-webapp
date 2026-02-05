'use client'

import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import DemoSection from '../components/DemoSection';
import Partners from '../components/Partners';
import CommunitySection from '../components/CommunitySection';
import Footer from '../components/Footer';

export default function Home() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen selection:bg-accent selection:text-accent-foreground bg-background text-foreground">
      {/* Top Banner */}
      {showBanner && (
        <div className="bg-gradient-to-r from-purple-900 via-pink-600 to-orange-500 py-2.5 px-4 text-center text-xs font-bold text-white relative z-[60]">
          Connect. Share. Secure. Earn – Build with $YUKI on the Road to Secure AGI.
          <button className="ml-4 bg-white text-black px-3 py-1 rounded-md text-[10px] hover:bg-gray-200 transition-colors uppercase">
            Visit Campaign
          </button>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      <Navbar />

      <main>
        <Hero />
        <DemoSection />
        <Partners />
        <CommunitySection />
      </main>

      <Footer />
    </div>
  );
}