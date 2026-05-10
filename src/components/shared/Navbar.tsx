'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getIconComponent } from '@/lib/iconMapper';
import { navItems } from '@/routes/navitems.route';
import { CartModal } from '../Cartmodel';
import ProfileCard from './ProfileCard';

interface NavbarProps {
  user?: any | null;
}

export default function Navbar({ user }: NavbarProps) {
  console.log(user,'userdata')
  const [darkMode, setDarkMode] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  // Handle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // ESC to close mobile
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    if (mobileOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <nav
          className="flex h-16 w-full items-center"
          aria-label="Main Navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="Go to homepage"
            className="flex items-center gap-4 rounded-xl group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            tabIndex={0}
          >
            <div className="flex items-center justify-center relative h-10 w-10">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
                <img
                  src="https://res.cloudinary.com/dcbgdaiod/image/upload/v1778025830/logo_exurh0.png"
                  alt="bitebase"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300 bg-zinc-100 dark:bg-zinc-950"
                  style={{ display: "block" }}
                  onError={e => {
                    e.currentTarget.style.display = "none";
                    const fallback = document.createElement("div");
                    fallback.className =
                      "flex items-center justify-center h-full w-full bg-zinc-100 text-zinc-400 font-semibold text-lg select-none dark:bg-zinc-950 dark:text-zinc-600";
                    fallback.innerText = "No Image";
                    e.currentTarget.parentNode?.appendChild(fallback);
                  }}
                />
              </div>
            </div>
            <span className="hidden sm:inline font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-100 transition-colors group-hover:text-indigo-600 select-none">
              bitebase
            </span>
          </Link>

          {/* Center Nav (Desktop) */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <ul className="flex items-center gap-5">
              {navItems.map(item => {
                if (item.authRequired && !user) return null;
                if (item.roles && (!user || !item.roles.includes(user.role)))
                  return null;
                const Icon = item.icon ? getIconComponent(item.icon) : null;

                return (
                  <li key={item.to}>
                    <Link
                      href={item.to}
                      className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                        ${
                          isActive(item.to)
                            ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm dark:bg-zinc-900/50 dark:text-indigo-300'
                            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/40'
                        }
                      `}
                      aria-current={isActive(item.to) ? "page" : undefined}
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right actions: Theme + Cart + Auth */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            {/* Theme + Cart */}
            <div className="flex items-center gap-2">
              {/* Theme Switch */}
              <button
                aria-label="Toggle color scheme"
                type="button"
                tabIndex={0}
                onClick={() => setDarkMode(v => !v)}
                className="rounded-xl p-2 transition-all duration-300 text-lg text-zinc-500 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <span className="sr-only">Toggle theme</span>
                {darkMode ? '🌙' : '☀️'}
              </button>
              <CartModal />
            </div>
            {/* Auth/Profile */}
           
            {user ? (
              <div className="flex items-center gap-3">
                 <ProfileCard profile={user}/>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" tabIndex={0}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium text-zinc-900 transition-all hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/register" tabIndex={0}>
                  <Button
                    size="sm"
                    className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-indigo-500 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden ml-auto flex items-center rounded-xl p-3 transition-all duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label={mobileOpen ? 'Close main menu' : 'Open main menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            tabIndex={0}
            onClick={() => setMobileOpen(open => !open)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="absolute left-0 top-0 w-full z-50 md:hidden"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
          >
            <div className="border-b border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
              <div className="px-4 pt-5 pb-8 sm:px-6 flex flex-col gap-6">
                {/* Nav links */}
                <ul className="flex flex-col gap-4">
                  {navItems.map(item => {
                    if (item.authRequired && !user) return null;
                    if (item.roles && (!user || !item.roles.includes(user.role))) return null;
                    const Icon = item.icon ? getIconComponent(item.icon) : null;
                    return (
                      <li key={item.to}>
                        <Link
                          href={item.to}
                          tabIndex={0}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                            ${
                              isActive(item.to)
                                ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-zinc-900/50 dark:text-indigo-300'
                                : 'text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900/40'
                            }
                          `}
                          aria-current={isActive(item.to) ? "page" : undefined}
                        >
                          {Icon && <Icon className="w-5 h-5" />}
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                {/* Mobile Auth Actions */}
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-4">
                  {user ? (
                    <div>
                      <ProfileCard profile={user}/>
                    </div>
                  ) : (
                    <>
                      <Link href="/login" tabIndex={0}>
                        <Button
                          variant="outline"
                          className="w-full inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium text-zinc-900 transition-all hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        >
                          Log in
                        </Button>
                      </Link>
                      <Link href="/register" tabIndex={0}>
                        <Button
                          className="w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-indigo-500 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        >
                          Sign up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}