'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import Navbar from "@/components/Navbar";

import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import Lanyard from '@/components/Lanyard';


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


  // Data untuk berbagai timeline
  const timelines = {
    career: {
      title: {
        text: {
          headline: "Perjalanan Karir",
          text: "<p>Timeline perjalanan karir saya dari awal sampai sekarang</p>"
        }
      },
      events: [
        {
          start_date: { year: "2018" },
          text: {
            headline: "Mulai Bekerja",
            text: "Memulai karir sebagai junior developer"
          }
        },
        {
          start_date: { year: "2020" },
          text: {
            headline: "Promosi",
            text: "Naik jabatan menjadi middle developer"
          }
        },
        {
          start_date: { year: "2023" },
          text: {
            headline: "Sekarang",
            text: "Bekerja sebagai senior developer"
          }
        }
      ]
    },
    education: {
      title: {
        text: {
          headline: "Riwayat Pendidikan",
          text: "<p>Perjalanan pendidikan dari SD sampai kuliah</p>"
        }
      },
      events: [
        {
          start_date: { year: "2012" },
          end_date: { year: "2018" },
          text: {
            headline: "Sekolah Dasar",
            text: "SD Negeri 1 Jakarta"
          }
        },
        {
          start_date: { year: "2018" },
          end_date: { year: "2021" },
          text: {
            headline: "SMP",
            text: "SMP Negeri 2 Jakarta"
          }
        },
        {
          start_date: { year: "2021" },
          end_date: { year: "2024" },
          text: {
            headline: "SMA",
            text: "SMA Negeri 3 Jakarta"
          }
        }
      ]
    }
  };

  // Opsi timeline
  const timelineOptions = {
    timenav_position: "bottom", // posisi navigasi waktu
    scale_factor: 2, // faktor zoom
    initial_zoom: 1, // zoom awal
    debug: false, // mode debug
    language: 'id', // bahasa Indonesia
    hash_bookmark: true, // bookmark berdasarkan hash
  };

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

      {/* Section dengan layout yang lebih terstruktur */}
      {/* Section tambahan untuk testing */}
      <section className="bg-white dark:bg-gray-800 min-h-screen py-12">
        <div className="container mx-auto px-4">

          {/* Header Section */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              internship, freelance and laboratory assistant experience
            </p>
          </div>

          {/* Container untuk Timeline dengan efek PixelTrail */}
          <div className="relative w-full rounded-lg overflow-hidden">

            {/* Iframe Timeline dengan atribut yang benar */}
            <div className="relative z-10">
              <iframe
                src='https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=v2%3A2PACX-1vR9Ww9WUkrzxxWnq-zaI9JG68wTLiV8FVTvsmjCGyioiTog8enF1afXs0W151XVskf8Y0MJETZ5K6HF&font=Default&lang=en&initial_zoom=2&width=100%25&height=650'
                width="100%"
                height="650"
                // Vendor prefixes sebagai string
                webkitallowfullscreen="true"
                mozallowfullscreen="true"
                // React camelCase untuk atribut standar
                allowFullScreen
                frameBorder="0"
                // Atribut lainnya
                title="Experience Timeline"
                className="rounded-lg shadow-lg"
                loading="lazy" // Tambahkan lazy loading untuk performa
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms" // Sesuaikan kebutuhan
              />
            </div>
          </div>
        </div>
      </section>

<section className="bg-white dark:bg-gray-800 min-h-screen py-12 relative overflow-hidden">
  {/* TEKS BACKGROUND BESAR */}
  <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10 pointer-events-none select-none">
    <h1 className="text-[15vw] md:text-[12vw] lg:text-[10vw] font-black text-gray-900 dark:text-white whitespace-nowrap uppercase tracking-tighter">
      hire me <br/>to wear your<br/> company lanyard
    </h1>
  </div>
  
  {/* TEKS BACKGROUND KEDUA (OPSIONAL) */}
  <div className="absolute inset-0 flex items-end justify-end opacity-5 dark:opacity-10 pointer-events-none select-none">
    <h1 className="text-[10vw] md:text-[8vw] font-black text-gray-900 dark:text-white rotate-12 translate-x-10 translate-y-10">
      2024
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