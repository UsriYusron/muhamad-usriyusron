'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from "next/image";

import Navbar from "@/components/Navbar";

import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';

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
      <HeroSection/>

      {/* About Section */}
      <AboutSection/>

      {/* Section tambahan untuk testing */}
      <section className="py-20 bg-white dark:bg-gray-800 min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Skills & Portfolio</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Scroll ke bawah untuk melihat lebih banyak
          </p>
        </div>
      </section>
    </>
  );
}