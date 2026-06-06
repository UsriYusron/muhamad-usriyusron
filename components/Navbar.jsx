"use client";

import Link from 'next/link';
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State untuk menu mobile
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State untuk dropdown desktop
  const { data: session } = useSession();

  return (
    <nav className="w-full fixed top-0 z-50 border-b border-solid border-black/[.08] bg-white/80 backdrop-blur dark:border-white/[.145] dark:bg-black/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center">
          <span className="text-2xl font-extrabold tracking-tighter text-black dark:text-white font-sans select-none">
            Usri Yusron
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex md:items-center md:gap-4">
          <Link href="/" className="flex-shrink-0 px-4 py-2 text-sm font-medium text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
            No navbar here, you have to scroll until the end of the page to see it
          </Link>

          {session ? (
            <div className="relative">
              {/* User Avatar Button (Click to Toggle Dropdown) */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 cursor-pointer"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                aria-label="Menu pengguna"
              >
                {session.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? "Avatar"}
                    className="w-8 h-8 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 flex items-center justify-center font-bold text-sm">
                    {session.user?.name ? session.user.name[0].toUpperCase() : 'U'}
                  </div>
                )}
              </button>

              {/* Dropdown Menu (Desktop) */}
              {isDropdownOpen && (
                <>
                  {/* Overlay background to close on click outside */}
                  <div
                    className="fixed inset-0 z-10 cursor-default"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-2 shadow-xl z-20">
                    {/* User profile info header */}
                    <div className="px-4 py-2.5 border-b border-neutral-100 dark:border-neutral-800">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {session.user?.name}
                      </p>
                      <p className="text-[10px] text-neutral-500 truncate">
                        {session.user?.email}
                      </p>
                      <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${session.user?.role === 'admin'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20'
                        }`}>
                        {session.user?.role === 'admin' ? 'Administrator' : 'Writer'}
                      </span>
                    </div>

                    {/* Navigation links inside dropdown */}
                    <div className="py-1">
                      <Link
                        href="/blog/new"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex w-full px-4 py-2 text-xs text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        Tulis Artikel
                      </Link>
                      {session.user?.role === 'admin' && (
                        <Link
                          href="/admin/approve"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex w-full px-4 py-2 text-xs font-semibold text-amber-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          Persetujuan Admin
                        </Link>
                      )}
                    </div>

                    {/* Separator */}
                    <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />

                    {/* Logout Button */}
                    <div className="px-2 py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="flex w-full items-center justify-start rounded-lg px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 rounded-md transition-colors">
              Login
            </Link>
          )}
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

      {/* Mobile Menu Slideout */}
      <div
        className={`
          fixed inset-x-0 top-16 transform bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800
          transition-all duration-300 ease-in-out md:hidden
          ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}
        `}
      >
        <div className="flex flex-col p-4 space-y-2">
          <Link href="/" onClick={() => setIsOpen(false)} className="flex-shrink-0 px-4 py-2 text-sm font-medium text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
            No navbar here, you have to scroll until the end of the page to see it
          </Link>

          {session ? (
            <>
              {/* User profile info header on mobile */}
              <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
                {session.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? "Avatar"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 flex items-center justify-center font-bold text-base">
                    {session.user?.name ? session.user.name[0].toUpperCase() : 'U'}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {session.user?.email}
                  </p>
                </div>
              </div>

              {/* Navigation links for mobile */}
              <Link href="/blog/new" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                Tulis Artikel
              </Link>
              {session.user?.role === 'admin' && (
                <Link href="/admin/approve" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-semibold text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                  Persetujuan Admin
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="text-left px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 rounded-md transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
}