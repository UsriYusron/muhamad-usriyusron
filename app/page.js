'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from "next/image";

import Navbar from "@/components/Navbar";

import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import PixelTrail from '@/components/PixelTrail';

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const [hasEnteredAbout, setHasEnteredAbout] = useState(false);

  // 🔥 Handle scroll untuk tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const section = Math.round(scrollY / windowHeight);

      // Update current section
      setCurrentSection(section);

      // Deteksi jika sudah masuk about section (section >= 1)
      if (section >= 1 && !hasEnteredAbout) {
        setHasEnteredAbout(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasEnteredAbout]);


  return (
    <>
      <Navbar />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 z-50"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: currentSection / 3 }}
        style={{ transformOrigin: '0%' }}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* Section tambahan untuk testing */}
      <section className=" bg-white dark:bg-gray-800 min-h-screen">
        <div className="container mx-auto text-center">
          {/* Container utama harus relative */}
          <div style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>

            {/* 1. Teks diletakkan di atas dengan z-index lebih tinggi */}
            <div className="relative z-10 pointer-events-none mt-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Experience & Portfolio</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Scroll ke bawah untuk melihat lebih banyak
              </p>
            </div>

            {/* 2. PixelTrail diatur agar memenuhi seluruh container sebagai background */}
            <div className="absolute inset-0 z-0">
              <PixelTrail
                gridSize={50}
                trailSize={0.1}
                maxAge={250}
                interpolate={5}
                color="#00ffff"
                gooeyFilter={{ id: "custom-goo-filter", strength: 2 }}
                className="w-full h-full"
              />
            </div>

          </div>
        </div>
      </section>
    </>
  );
}