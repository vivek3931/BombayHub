import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Twitter, Instagram, Mail, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black border-t border-white/10 pt-20 pb-10 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">

                {/* Top Section: Logo & Links */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-20">

                    {/* Brand / Logo */}
                    <div className="md:col-span-4 flex flex-col items-start gap-6">
                        <Link href="/" className="block">
                            <div className="relative w-40 h-40 opacity-90 hover:opacity-100 transition-opacity">
                                <Image
                                    src="/bombayhub_logo.png"
                                    alt="Bombay Hub"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                            Curating the chaos, culture, and charm of the Maximum City. Your digital gateway to the soul of Mumbai.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">

                        {/* Column 1 */}
                        <div className="flex flex-col gap-4">
                            <h4 className="font-heading text-taxi-yellow text-lg tracking-wide uppercase mb-2">Explore</h4>
                            {['Vibes', 'Map', 'News', 'History'].map((item) => (
                                <Link key={item} href={`/${item.toLowerCase()}`} className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-1 group">
                                    {item}
                                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-taxi-yellow" />
                                </Link>
                            ))}
                        </div>

                        {/* Column 2 */}
                        <div className="flex flex-col gap-4">
                            <h4 className="font-heading text-taxi-yellow text-lg tracking-wide uppercase mb-2">Connect</h4>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">Twitter / X</a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">Instagram</a>
                            <a href="mailto:hello@bombayhub.com" className="text-white/60 hover:text-white transition-colors text-sm">Contact Us</a>
                        </div>

                        {/* Column 3 - Newsletter */}
                        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
                            <h4 className="font-heading text-taxi-yellow text-lg tracking-wide uppercase mb-2">Updates</h4>
                            <p className="text-white/40 text-xs mb-2">Get the latest vibe check delivered to your inbox.</p>
                            <div className="flex items-center border border-white/20 rounded-full px-4 py-2 bg-white/5 focus-within:border-taxi-yellow transition-colors">
                                <input type="email" placeholder="Email address" className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-white/20" />
                                <button className="text-taxi-yellow hover:text-white transition-colors">
                                    <ArrowUpRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Copyright & Tagline */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light tracking-wide text-white/40">
                    <p>© {currentYear} Bombay Hub. All rights reserved.</p>

                    <div className="flex items-center gap-2">
                        <span>Made with</span>
                        <span className="text-taxi-yellow animate-pulse">Vada Pav</span>
                        <span>& Code in Mumbai.</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
