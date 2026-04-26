"use client";
import React, { useState, useEffect } from 'react';
import { Zap, User, LogOut, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === '/';
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, setTheme } = useTheme();

    useEffect(() => setMounted(true), []);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Simple implementation: close if click is anywhere
            // In a real app we'd check refs, but for now scrolling/clicking elsewhere closes it
            const target = event.target as HTMLElement;
            if (!target.closest('.profile-dropdown-container')) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center transition-all duration-500 ${isScrolled || isMenuOpen
                    ? 'bg-background/90 backdrop-blur-xl border-b border-black/10 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/20'
                    : 'bg-transparent border-transparent py-6'
                    }`}
            >
                <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative w-32 h-12 md:w-36 md:h-12 transition-transform duration-300 group-hover:scale-105">
                            <Image
                                src="/bombayhub_logo.png"
                                alt="Bombay Hub"
                                fill
                                className="object-contain dark:invert transition-all duration-300"
                                priority
                            />
                        </div>
                    </Link>

                    <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide items-center">
                        {['HOME', 'EXPLORER', 'JOBS', 'PHOTOS', 'EVENTS'].map((item) => {
                            // Logic for text color:
                            // Scrolled: always use foreground (black in light, white in dark)
                            // Not scrolled + Home: always white (due to hero image)
                            // Not scrolled + Not Home: use foreground (black in light, white in dark)
                            const textColorClass = isScrolled || !isHome ? 'text-foreground' : 'text-white/90';

                            return (
                                <Link
                                    key={item}
                                    href={item === 'HOME' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                                    className={`relative hover:text-taxi-yellow transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-taxi-yellow after:transition-all after:duration-300 hover:after:w-full ${textColorClass}`}
                                >
                                    {item}
                                </Link>
                            );
                        })}
                        {/* Theme Toggle */}
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-taxi-yellow/20 border hover:border-taxi-yellow/50 transition-all duration-300 ${isScrolled || !isHome ? 'bg-foreground/10 border-foreground/30 text-foreground' : 'bg-white/10 border-white/20 text-white'}`}
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? (
                                    <Sun className="w-5 h-5 text-taxi-yellow" />
                                ) : (
                                    <Moon className="w-5 h-5" /> // Color is inherited from parent button text color
                                )}
                            </button>
                        )}
                        {isAuthenticated ? (
                            <div className="relative profile-dropdown-container">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsProfileOpen(!isProfileOpen);
                                    }}
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-taxi-yellow to-yellow-600 flex items-center justify-center text-black font-bold text-lg hover:scale-105 transition-transform border border-foreground/20 shadow-lg shadow-taxi-yellow/20"
                                >
                                    {user?.name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
                                </button>

                                {/* Dropdown Menu */}
                                <div className={`absolute right-0 top-full mt-4 w-56 bg-white dark:bg-asphalt-black/95 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl py-2 transform transition-all duration-200 origin-top-right ${isProfileOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'}`}>
                                    <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 mb-2">
                                        <p className="text-xs text-foreground/50 uppercase tracking-wider font-bold mb-1">Signed in as</p>
                                        <p className="text-sm font-bold text-foreground truncate">{user?.name || 'User'}</p>
                                        <p className="text-xs text-foreground/40 truncate">{user?.email}</p>
                                    </div>
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 text-sm text-foreground/70 hover:bg-foreground/10 hover:text-taxi-yellow transition-colors"
                                    >
                                        Profile
                                    </Link>
                                    {user?.role === 'ADMIN' && (
                                        <Link
                                            href="/bombayhub-admin-portal-2026"
                                            className="block px-4 py-2 text-sm text-orange-500 font-bold hover:bg-foreground/10 transition-colors"
                                        >
                                            Admin Panel
                                        </Link>
                                    )}
                                    <Link
                                        href="/settings"
                                        className="block px-4 py-2 text-sm text-foreground/70 hover:bg-foreground/10 hover:text-taxi-yellow transition-colors"
                                    >
                                        Settings
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-foreground/10 hover:text-red-400 dark:hover:text-red-300 transition-colors flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/auth"
                                className={`hover:bg-taxi-yellow hover:text-black hover:border-taxi-yellow px-5 py-2 rounded-full transition-all duration-300 ${isScrolled || !isHome ? 'bg-foreground/10 border border-foreground/30 text-foreground' : 'bg-white/10 border border-white/20 text-white'}`}
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`md:hidden z-50 hover:text-taxi-yellow transition-colors focus:outline-none ${isScrolled || !isHome ? 'text-foreground' : 'text-white'}`}
                        aria-label="Toggle Menu"
                    >
                        <div className="space-y-1.5 w-8">
                            <span className={`block h-0.5 bg-current transition-all duration-300 ease-in-out ${isMenuOpen ? 'w-8 rotate-45 translate-y-2' : 'w-8'}`}></span>
                            <span className={`block h-0.5 bg-current transition-all duration-300 ease-in-out ml-auto ${isMenuOpen ? 'w-0 opacity-0' : 'w-6'}`}></span>
                            <span className={`block h-0.5 bg-current transition-all duration-300 ease-in-out ${isMenuOpen ? 'w-8 -rotate-45 -translate-y-2' : 'w-8'}`}></span>
                        </div>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            < div className={`fixed inset-0 z-40 bg-background/98 backdrop-blur-2xl md:hidden transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`
            }>
                <div className="flex flex-col items-center justify-center h-full gap-8">
                    {['HOME', 'EXPLORER', 'JOBS', 'PHOTOS', 'EVENTS'].map((item, i) => (
                        <Link
                            key={item}
                            href={item === 'HOME' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                            className="text-4xl font-heading text-foreground hover:text-taxi-yellow transition-colors"
                            style={{ transitionDelay: `${i * 100}ms` }}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item}
                        </Link>
                    ))}
                    {/* Mobile Theme Toggle */}
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="w-14 h-14 rounded-full flex items-center justify-center bg-foreground/10 hover:bg-taxi-yellow/20 border border-foreground/10 hover:border-taxi-yellow/50 transition-all duration-300 mt-2"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-7 h-7 text-taxi-yellow" />
                            ) : (
                                <Moon className="w-7 h-7 text-foreground" />
                            )}
                        </button>
                    )}
                    {isAuthenticated ? (
                        <div className="flex flex-col items-center gap-6 mt-4">
                            <span className="text-xl text-foreground/60">
                                Protected by Bombay Hub
                            </span>
                            {user?.role === 'ADMIN' && (
                                <Link
                                    href="/bombayhub-admin-portal-2026"
                                    className="text-2xl font-heading text-orange-500 border border-orange-500 px-6 py-2 rounded-full hover:bg-orange-500 hover:text-white transition-all"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Admin Panel
                                </Link>
                            )}
                            <button
                                onClick={() => {
                                    logout();
                                    setIsMenuOpen(false);
                                }}
                                className="text-2xl font-heading text-red-500 border border-red-500 px-6 py-2 rounded-full hover:bg-red-500 hover:text-white transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/auth"
                            className="text-2xl font-heading text-taxi-yellow border border-taxi-yellow px-6 py-2 rounded-full hover:bg-taxi-yellow hover:text-black transition-all"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div >
        </>
    );
};
