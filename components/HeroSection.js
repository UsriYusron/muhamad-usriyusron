'use client'

import React from 'react'
import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

import FallingText from "@/components/fallingText";

export default function HeroSection() {
    const [isTriggered, setIsTriggered] = useState(false);

    const sectionRef = useRef(null);

    const handleScrollToAbout = useCallback(() => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
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
                <div className="absolute  bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900/50 pointer-events-none" />

                <div className='w-full h-full flex flex-col lg:flex-row items-center justify-center mb-7'>
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
                </div>

                {/* Tombol "Explore" - SELALU MUNCUL dari awal */}
                <motion.button
                    onClick={handleScrollToAbout}
                    className="absolute bottom-20 left-1/2 transform -translate-x-1/2 cursor-pointer z-20 group"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="flex flex-col items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-black/30 px-4 rounded-full backdrop-blur-sm transition-all group-hover:bg-cyan-500/10">
                            Explore
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

                {/* Scroll indicator dots */}
                {/* <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-20">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${currentSection === i ? 'bg-cyan-400 scale-125' : 'bg-gray-300 dark:bg-gray-700'
                                }`}
                            animate={currentSection === i ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                    ))}
                </div> */}
            </section>
        </>
    );
}