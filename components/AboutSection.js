'use client'

import React from 'react'
import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import TiltedCard from '@/components/TitledCard';
import TrueFocus from '@/components/TrueFocus';

export default function AboutSection() {

    return (
        <>
            <section id="about" className="relative flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 min-h-screen w-full">
                <div className="flex flex-col lg:flex-row w-full h-full">

                    {/* KIRI - Text Content */}
                    <section className="w-full lg:w-1/2 flex flex-col justify-center bg-white dark:bg-black px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
                        <div className="max-w-2xl mx-auto lg:mx-0 w-full">

                            {/* Nama dengan TrueFocus - Responsif */}
                            <div className='text-center lg:text-left'>
                                <TrueFocus
                                    sentence="Muhamad Usri Yusron"
                                    manualMode={false}
                                    blurAmount={5}
                                    borderColor="#5227FF"
                                    animationDuration={0.5}
                                    pauseBetweenAnimations={1}
                                />
                            </div>

                            {/* Bio Text */}
                            <div className="flex flex-col items-center lg:items-start gap-4 sm:gap-6 text-center lg:text-left">
                                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                                    <p>
                                        Hi! I&apos;m Muhamad Usri Yusron, a Full Stack Developer with a passion for creating
                                        seamless digital experiences. My journey into tech started from curiosity—how
                                        can lines of code transform into something people love to use?
                                    </p>
                                </div>

                                {/* Quick Facts Grid - Responsif */}
                                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 w-full mt-2 sm:mt-4">
                                    {[
                                        { icon: '📍', label: 'Based in', value: 'Jakarta, ID' },
                                        { icon: '🎯', label: 'Role', value: 'Full Stack Dev' },
                                        { icon: '🎓', label: 'Education', value: 'CS Degree' },
                                        { icon: '⚡', label: 'Projects', value: '20+ Delivered' }
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-col p-2 sm:p-2.5 md:p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-cyan-500/50 transition-colors"
                                        >
                                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                <span className="text-base">{item.icon}</span>
                                                <span className="hidden xs:inline">{item.label}</span>
                                            </span>
                                            <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Tech Stack - Responsif */}
                                <div className="mt-4 sm:mt-6 w-full">
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">
                                        Tech stack I work with:
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                        {['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind', 'MongoDB', 'GraphQL'].map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-2 sm:px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>

                    {/* KANAN - Foto dengan efek tilt */}
                    <section className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-black px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 lg:py-0">
                        <div className="relative w-full max-w-md mx-auto lg:mx-0">
                            {/* Container untuk TiltedCard dengan ukuran responsif */}
                            <div className="transform scale-90 sm:scale-95 md:scale-100 origin-center">
                                <TiltedCard
                                    imageSrc="https://i.imgur.com/XTrZl3g.jpeg"
                                    altText="Muhamad Usri Yusron"
                                    captionText="Muhamad Usri Yusron"
                                    containerHeight="250px"
                                    containerWidth="100%"
                                    imageHeight="550px"
                                    imageWidth="100%"
                                    rotateAmplitude={20}
                                    scaleOnHover={1.2}
                                    showMobileWarning={false}
                                    showTooltip
                                    displayOverlayContent
                                />
                            </div>

                            {/* Decorative elements - Responsif */}
                            <div className="absolute -bottom-4 -right-4 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-2xl -z-10" />
                            <div className="absolute -top-4 -left-4 w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl -z-10" />

                            {/* Floating badge untuk layar besar */}
                            <div className="hidden lg:block absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    ✦ 5+ Years Experience
                                </span>
                            </div>
                        </div>
                    </section>

                </div>
            </section>

            {/* CSS Kustom untuk breakpoint tambahan */}
            <style jsx>{`
                @media (min-width: 400px) {
                    .xs\\:inline {
                        display: inline;
                    }
                    .xs\\:flex-row {
                        flex-direction: row;
                    }
                    .xs\\:w-auto {
                        width: auto;
                    }
                }
            `}</style>
        </>
    );
}