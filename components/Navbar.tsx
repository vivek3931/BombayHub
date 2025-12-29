"use client";
import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

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
                    ? 'bg-asphalt-black/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
                    : 'bg-transparent border-transparent py-6'
                    }`}
            >
                <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative w-30 h-12 md:w-34 md:h-12 transition-transform duration-300 group-hover:scale-105">
                        <Image
                            src="/bombayhub_logo.png"
                            alt="Bombay Hub"
                            fill
                            className="object-contain  w-34 h-auto md:w-24 md:h-12"
                            priority
                        />
                    </div>
                </Link>

                <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide">
                    {['HOME', 'NEWS', 'EXPLORER', 'HERITAGE'].map((item) => (
                        <Link
                            key={item}
                            href={item === 'HOME' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                            className="relative text-white/80 hover:text-taxi-yellow transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-taxi-yellow after:transition-all after:duration-300 hover:after:w-full"
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden z-50 text-white hover:text-taxi-yellow transition-colors focus:outline-none"
                    aria-label="Toggle Menu"
                >
                    <div className="space-y-1.5 w-8">
                        <span className={`block h-0.5 bg-current transition-all duration-300 ease-in-out ${isMenuOpen ? 'w-8 rotate-45 translate-y-2' : 'w-8'}`}></span>
                        <span className={`block h-0.5 bg-current transition-all duration-300 ease-in-out ml-auto ${isMenuOpen ? 'w-0 opacity-0' : 'w-6'}`}></span>
                        <span className={`block h-0.5 bg-current transition-all duration-300 ease-in-out ${isMenuOpen ? 'w-8 -rotate-45 -translate-y-2' : 'w-8'}`}></span>
                    </div>
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-40 bg-asphalt-black/98 backdrop-blur-2xl md:hidden transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col items-center justify-center h-full gap-8">
                    {['HOME', 'NEWS', 'EXPLORER', 'HERITAGE'].map((item, i) => (
                        <Link
                            key={item}
                            href={item === 'HOME' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                            className="text-4xl font-heading text-white hover:text-taxi-yellow transition-colors"
                            style={{ transitionDelay: `${i * 100}ms` }}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};
