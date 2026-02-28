'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from "next/image";

import Navbar from "@/components/Navbar";
import FallingText from "@/components/fallingText";
import TiltedCard from '@/components/TitledCard';
import TrueFocus from '@/components/TrueFocus';

export default function Home() {
  const [canScroll, setCanScroll] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [hasEnteredAbout, setHasEnteredAbout] = useState(false);

  const sectionRef = useRef(null);
  const timeoutRef = useRef(null);
  const lastScrollYRef = useRef(0);

  // 🔥 FUNGSI UTAMA: Block scroll ke hero section (setelah masuk about)
  const preventScrollToHero = useCallback((e) => {
    // Hanya aktif jika sudah masuk about section
    if (!hasEnteredAbout) return;

    const delta = e.deltaY;
    const currentScrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Deteksi scroll ke atas menuju hero (scrollY < windowHeight)
    const tryingToScrollToHero = delta < 0 && currentScrollY < windowHeight * 0.9;

    if (tryingToScrollToHero) {
      e.preventDefault();
      e.stopPropagation();

      // Tampilkan warning
      setShowWarning(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowWarning(false), 1500);

      // Paksa tetap di about section
      window.scrollTo({
        top: windowHeight,
        behavior: 'smooth'
      });

      return false;
    }
  }, [hasEnteredAbout]);

  // 🔥 FUNGSI: Block semua scroll di hero section (sebelum tombol diklik)
  const blockAllScrollInHero = useCallback((e) => {
    // Jika sudah bisa scroll, lewati
    if (canScroll) return;

    // Jika sudah masuk about section, biarkan handler lain yang bekerja
    if (hasEnteredAbout) return;

    const rect = sectionRef.current?.getBoundingClientRect();
    const isHeroVisible = rect && rect.top <= 50 && rect.bottom >= 50;

    // Jika masih di hero section, block semua scroll
    if (isHeroVisible) {
      e.preventDefault();
      e.stopPropagation();

      // Tampilkan hint untuk klik tombol
      setShowWarning(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowWarning(false), 1500);
    }
  }, [canScroll, hasEnteredAbout]);

  // 🔥 Handle wheel event untuk block scroll di hero
  useEffect(() => {
    // Tambahkan event listener untuk block scroll di hero
    window.addEventListener('wheel', blockAllScrollInHero, { passive: false });

    return () => {
      window.removeEventListener('wheel', blockAllScrollInHero);
    };
  }, [blockAllScrollInHero]);

  // 🔥 Handle wheel event untuk prevent scroll ke hero
  useEffect(() => {
    if (!hasEnteredAbout) return;

    window.addEventListener('wheel', preventScrollToHero, { passive: false });

    return () => {
      window.removeEventListener('wheel', preventScrollToHero);
    };
  }, [hasEnteredAbout, preventScrollToHero]);

  // 🔥 Handle touch move untuk mobile (block di hero)
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      // Jika sudah bisa scroll, lewati
      if (canScroll) return;

      // Jika sudah masuk about section, biarkan handler lain yang bekerja
      if (hasEnteredAbout) return;

      const rect = sectionRef.current?.getBoundingClientRect();
      const isHeroVisible = rect && rect.top <= 50 && rect.bottom >= 50;

      if (isHeroVisible) {
        e.preventDefault();
        e.stopPropagation();

        setShowWarning(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setShowWarning(false), 1500);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [canScroll, hasEnteredAbout]);

  // 🔥 Handle touch move untuk mobile (prevent scroll ke hero)
  useEffect(() => {
    if (!hasEnteredAbout) return;

    let touchStartY = 0;
    let touchStartScrollY = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartScrollY = window.scrollY;
    };

    const handleTouchMove = (e) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchY - touchStartY;
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Jika scroll up (deltaY positif) dan mencoba ke hero
      if (deltaY > 0 && currentScrollY < windowHeight * 0.9) {
        e.preventDefault();
        e.stopPropagation();

        setShowWarning(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setShowWarning(false), 1500);

        window.scrollTo({
          top: windowHeight,
          behavior: 'smooth'
        });
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [hasEnteredAbout]);

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

      // Update last scroll position
      lastScrollYRef.current = scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasEnteredAbout]);

  // 🔥 Lock scroll di hero section (sebelum tombol diklik)
  useEffect(() => {
    // Selama belum bisa scroll dan belum masuk about section
    if (!canScroll && !hasEnteredAbout) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overscrollBehavior = 'none';
    } else {
      // Setelah bisa scroll atau sudah masuk about, unlock
      const scrollY = document.body.style.top ? parseInt(document.body.style.top || '0') * -1 : 0;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overscrollBehavior = '';

      if (scrollY) window.scrollTo(0, scrollY);
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overscrollBehavior = '';
    };
  }, [canScroll, hasEnteredAbout]);

  const handleUnlockScroll = useCallback(() => {
    setCanScroll(true);

    // Scroll ke about section
    setTimeout(() => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Set flag bahwa sudah masuk about
        setHasEnteredAbout(true);
      }
    }, 100);
  }, []);

  const handleFallingTextTrigger = useCallback(() => {
    setIsTriggered(true);
  }, []);

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
      <section
        ref={sectionRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900/50 pointer-events-none" />

        <FallingText
          text={`This site is made as attractive as possible so that you feel comfortable and stay on it for a long time. You can click here and drag anywhere!`}
          highlightWords={["attractive", "possible", "comfortable", "drag"]}
          highlightClass="highlighted"
          trigger="click"
          backgroundColor="transparent"
          wireframes={false}
          gravity={0.56}
          fontSize="clamp(2rem, 6vw, 4rem)"
          mouseConstraintStiffness={0.1}
          onTrigger={handleFallingTextTrigger}
        />

        {/* Tombol "Click to Start" - SELALU MUNCUL dari awal */}
        <motion.button
          onClick={handleUnlockScroll}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-20 group"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm transition-all group-hover:bg-cyan-500/10">
              Click to Start ↓
            </span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7m14-6l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
        </motion.button>

        {/* Warning Toast */}
        <AnimatePresence>
          {showWarning && (
            <motion.div
              initial={{ opacity: 0, y: -50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -50, x: '-50%' }}
              className="fixed top-4 left-1/2 z-50"
            >
              <div className="bg-red-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
                <span className="text-xl">🚫</span>
                <span className="font-medium">
                  {!canScroll && !hasEnteredAbout
                    ? "Klik 'Click to Start' untuk melanjutkan!"
                    : "Tidak bisa kembali ke atas"}
                </span>
                <span className="text-xl">⬇️</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll indicator dots */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-20">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${currentSection === i ? 'bg-cyan-400 scale-125' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              animate={currentSection === i ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 min-h-screen w-full">
        <div className="flex flex-col md:flex-row w-full">

          {/* KIRI */}
          <section className="w-full md:w-1/2 flex-col justify-center bg-white dark:bg-black px-6 py-36 md:px-16 md:py-32">
          <div className='text-center'>
            <TrueFocus
              sentence="Muhamad Usri Yusron"
              manualMode={false}
              blurAmount={5}
              borderColor="#5227FF"
              animationDuration={0.5}
              pauseBetweenAnimations={1}
            />
            </div>


            <div className="flex flex-col items-center md:items-start gap-6 text-center md:text-left">

              <div className="space-y-4 text-base md:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-xl">
                <p>
                  Hi! I&apos;m Muhamad Usri Yusron, a Full Stack Developer with a passion for creating
                  seamless digital experiences. My journey into tech started from curiosity—how
                  can lines of code transform into something people love to use?
                </p>

                {/* <p>
                  Over the past 5 years, I've had the privilege of working with amazing startups
                  and companies, turning complex problems into elegant solutions. I believe that
                  great software isn't just about functionality—it's about the feeling it gives
                  when you use it.
                </p>

                <p className="font-medium text-black dark:text-zinc-300">
                  ⚡ Currently specializing in React, Next.js, and Node.js, while always staying
                  curious about emerging technologies.
                </p> */}
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-4">
                {[
                  { icon: '📍', label: 'Based in', value: 'Jakarta, ID' },
                  { icon: '🎯', label: 'Role', value: 'Full Stack Dev' },
                  { icon: '🎓', label: 'Education', value: 'CS Degree' },
                  { icon: '⚡', label: 'Projects', value: '3+ Delivered' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.icon} {item.label}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Tech stack sebagai visual credibility */}
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Tech stack I work with:</p>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind', 'MongoDB', 'GraphQL'].map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* <div className="mt-8 flex flex-col sm:flex-row gap-4 font-medium">
              <a
                href="payload.json"
                download="NewPayload.json"
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                <Image
                  className="dark:invert"
                  src="/vercel.svg"
                  alt="Vercel logomark"
                  width={16}
                  height={16}
                />
                See a File
              </a>
            </div> */}
          </section>

          {/* KANAN */}
          <section className="flex w-full md:w-1/2 items-center justify-center bg-white dark:bg-black px-6 py-16 md:px-16 md:py-32">
            <TiltedCard
              imageSrc="https://i.imgur.com/XTrZl3g.jpeg"
              altText="Muhamad Usri Yusron"
              captionText="Muhamad Usri Yusron"
              containerHeight="300px"
              containerWidth="500px"
              imageHeight="350px"
              imageWidth="300px"
              rotateAmplitude={30}
              scaleOnHover={1.3}
              showMobileWarning={false}
              showTooltip
              displayOverlayContent
            />
          </section>

        </div>
      </section>

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