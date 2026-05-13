'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { TResponseUserData } from '@/types/user.type';
import { toast } from 'react-toastify';
import { userLogout } from '@/actions/auth.actions';
import Image from 'next/image';
import ProfileCard from './ProfileCard';
import { navItems } from '@/routes/navitems.route';
import { getIconComponent } from '@/lib/iconMapper';
import { CartModal } from '../Cartmodel';


interface NavbarProps { user: TResponseUserData | null }

export default function Navbar({ user }: NavbarProps) {
  console.log(user,'suerd')
  const [hash, setHash] = useState(() =>
    typeof window !== "undefined" ? window.location.hash : ""
  );
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      const res = await userLogout();
      router.refresh();
      if (res?.success) {
        toast.update(toastId, {
          render: res.message || "Logged out!",
          type: "success",
          isLoading: false,
          autoClose: 1500,
        });
        router.push("/login");
        router.refresh();
      } else {
        toast.update(toastId, {
          render: res?.message || "Logout failed",
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      }
    } catch (err: any) {
      toast.update(toastId, {
        render: err?.message || "Logout error",
        type: "error",
        isLoading: false,
        autoClose: 1500,
      });
    }
  };

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <header className="sticky top-0 inset-x-0 z-50 border-b border-border bg-background/90 backdrop-blur-2xl">
      <nav className="max-w-[1440px] mx-auto w-full flex items-center h-16 px-4 md:px-8">
        {/* Logo */}
        <Link
          href="/"
          aria-label="bitebase Home"
          className="flex items-center gap-4 group"
        >
          <div className="flex h-10 w-10 items-center justify-center relative">
            <div className="relative bg-card rounded-xl shadow-sm border border-border flex items-center justify-center w-10 h-10 p-1 overflow-hidden">
                        <img
                          src="https://res.cloudinary.com/dcbgdaiod/image/upload/v1778025830/logo_exurh0.png"
                          alt="bitebase"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03] bg-muted"
                          style={{ display: "block" }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const fallback = document.createElement("div");
                            fallback.className = "flex items-center justify-center h-full w-full bg-muted text-muted-foreground font-semibold text-lg select-none";
                            fallback.innerText = "No Image";
                            e.currentTarget.parentNode?.appendChild(fallback);
                          }}
                        />
                
            </div>
          </div>
          <span className="hidden sm:inline font-bold text-lg text-primary transition-colors group-hover:text-primary/80 select-none">
            bitebase
          </span>
        </Link>
        {/* Center navigation (desktop) */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <ul className="flex gap-4">
            {navItems.map(item => {
              if (item.authRequired && !user) return null;
              if (item.roles && (!user || !item.roles.includes(user.role))) return null;
              const Icon = item.icon ? getIconComponent(item.icon) : null;
              return (
                <li key={item.to}>
                  <Link
                    href={item.to}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                      ${isActive(item.to)
                        ? "bg-primary/10 text-primary font-semibold shadow"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"}
                    `}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        {/* Right Section: Theme, Profile, Auth */}
        <div className="hidden md:flex items-center gap-6 ml-auto">
          {/* Theme Switcher */}
          <button
            aria-label="Toggle Theme"
            onClick={() => setDarkMode(!darkMode)}
            className="focus:outline-none rounded-md p-2 transition-colors text-lg text-muted-foreground hover:text-primary"
          >
            <span className="sr-only">Toggle theme</span>
            {darkMode ? "🌙" : "☀️"}
          </button>
          <div>
          <CartModal />
          </div>

          {user?.email ? (
            <div className="flex items-center gap-4">
              
              <ProfileCard profile={user} />
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-md font-medium"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="rounded-md font-medium"
                >
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden ml-auto flex items-center p-2 rounded-md hover:bg-accent focus:outline-none transition-colors"
          aria-label={mobileOpen ? 'Close main menu' : 'Open main menu'}
          onClick={() => setMobileOpen(open => !open)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden absolute w-full left-0 top-16 z-50 shadow-lg"
          >
            <div className="bg-background border-t border-border px-4 py-4">
              <ul className="flex flex-col gap-2">
                {navItems.map(item => {
                  if (item.authRequired && !user) return null;
                  if (item.roles && (!user || !item.roles.includes(user.role))) return null;
                  const Icon = item.icon ? getIconComponent(item.icon) : null;
                  return (
                    <li key={item.to}>
                      <Link
                        href={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200
                          ${isActive(item.to)
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"}
                        `}
                      >
                        {Icon && <Icon className="w-5 h-5" />}
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {/* Auth Section - Mobile */}
              <div className="mt-6 pt-4 border-t border-border flex flex-col gap-3">
                
                {user ? (
                 <ProfileCard profile={user} />
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="outline" className="w-full">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full">
                        Sign up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}