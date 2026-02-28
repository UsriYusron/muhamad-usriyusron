'use client'

import React from 'react'
import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import FallingText from "@/components/fallingText";

export default function HeroSection() {
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
        </>
    );
}