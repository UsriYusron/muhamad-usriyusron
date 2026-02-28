"use client";

import Image from "next/image";
import Link from 'next/link'
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full fixed top-0 z-50 border-b border-solid border-black/[.08] bg-white/80 backdrop-blur dark:border-white/[.145] dark:bg-black/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" rel="noopener noreferrer" className="flex-shrink-0">
          <Image
            src="/next.svg"
            alt="Next.js Logo"
            width={100}
            height={24}
            priority
            className="dark:invert"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex md:items-center md:gap-2">
          <Link href="/" rel="noopener noreferrer" className="flex-shrink-0 px-4 py-2 text-sm font-medium text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
            No navbar here, you have to scroll until the end of the page to see it
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            className={`h-6 w-6 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          fixed inset-x-0 top-16 transform bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800
          transition-all duration-300 ease-in-out md:hidden
          ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}
        `}
      >
        <div className="flex flex-col p-4 space-y-2">
         <Link href="/" rel="noopener noreferrer" className="flex-shrink-0 px-4 py-2 text-sm font-medium text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
            No navbar here, you have to scroll until the end of the page to see it
          </Link>
        </div>
      </div>

      {/* Backdrop untuk mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
}