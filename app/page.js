'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Suspense } from 'react';

import Navbar from "@/components/Navbar";
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import Lanyard from '@/components/Lanyard';
import ExperienceSection from '@/components/Experience';
import LoadingWithText from '@/components/Loading';


export default function Home() {

  const [currentSection, setCurrentSection] = useState(0);
  const [hasEnteredAbout, setHasEnteredAbout] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasi loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Sesuaikan dengan waktu loading real

    return () => clearTimeout(timer);
  }, []);

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

  if (isLoading) {
    return (
      <>
        < LoadingWithText />
      </>
    );
  }


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

      {/* Experience Section */}
      <ExperienceSection />

      <section className="bg-white dark:bg-gray-800 min-h-screen py-12 relative overflow-hidden">
        {/* TEKS BACKGROUND BESAR */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10 pointer-events-none select-none">
          <h1 className="text-[15vw] md:text-[12vw] lg:text-[10vw] font-black text-gray-900 dark:text-white whitespace-nowrap uppercase tracking-tighter">
            hire me <br />to wear your<br /> company lanyard
          </h1>
        </div>

        {/* KONTEN UTAMA */}
        <div className="container mx-auto px-4 relative z-10">
          {/* Lanyard Component */}
          <div className="relative w-full h-[600px] md:h-[700px] rounded-2xl overflow-hidden">
            <Lanyard position={[0, 0, 30]} gravity={[0, -40, 0]} fov={20} transparent={true} />
          </div>
        </div>
      </section>
    </>
  );
}