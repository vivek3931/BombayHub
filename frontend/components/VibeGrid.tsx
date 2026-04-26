"use client";
import React, { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VIBES } from '@/lib/data';
import Link from 'next/link';
import { MapPin, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const VibeGrid = () => {
    const sectionRef = useRef(null);

    useGSAP(() => {
        const cards = gsap.utils.toArray('.vibe-card');

        // Slightly different animation for mobile (less stagger)
        const isMobile = window.innerWidth < 768;

        gsap.from(cards, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: isMobile ? 0.05 : 0.1, // Faster stagger on mobile
            ease: "power3.out",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 85%", // Trigger slightly earlier
            }
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} id="vibes" className="py-16 md:py-24 px-4 md:px-6 max-w-7xl mx-auto">
            {/* Mobile: Centered header. Desktop: Right-aligned */}
            <h2 className="text-3xl md:text-5xl font-heading mb-8 md:mb-16 text-white text-center md:text-right border-b border-white/10 pb-4 w-full md:w-auto md:inline-block md:float-right">
                THE <span className="text-taxi-yellow">VIBE</span> CHECK
            </h2>
            <div className="clearfix" />

            {/* 
               Mobile: Full-width grid with single column.
               Desktop: Masonry layout using CSS columns.
            */}
            <div className="columns-2 lg:columns-3 gap-2 md:gap-6 space-y-2 md:space-y-6">
                {VIBES.map((vibe) => (
                    <Link key={vibe.id} href={`/vibes/${vibe.id}`} className="block w-full break-inside-avoid focus:outline-none focus:ring-2 focus:ring-taxi-yellow rounded-xl md:rounded-3xl active:scale-[0.98] transition-transform duration-300">
                        <div className={`vibe-card relative group overflow-hidden rounded-xl md:rounded-3xl border border-white/10 bg-asphalt-black cursor-pointer shadow-lg shadow-black/50`}>

                            {/* Image Container */}
                            <div className={`relative w-full ${vibe.aspect} transition-all duration-700`}>
                                {/* Mobile: Full Color. Desktop: Grayscale -> Color on hover */}
                                <div className="absolute inset-0 z-10 transition-all duration-700 bg-transparent md:bg-asphalt-black/20 md:backdrop-grayscale md:group-hover:backdrop-grayscale-0 md:group-hover:bg-transparent" />

                                <Image
                                    src={vibe.src}
                                    alt={vibe.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
                                />

                                {/* Tags - Mobile/Desktop: Top Left */}
                                <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20 flex flex-wrap gap-1 md:gap-2">
                                    {vibe.tags.slice(0, 1).map((tag, i) => (
                                        <span key={i} className="text-[7px] md:text-[10px] uppercase tracking-wider font-bold text-white bg-black/40 backdrop-blur-md px-1.5 py-0.5 md:px-3 md:py-1.5 rounded-full border border-white/10 shadow-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Gradient Overlay & Content */}
                            <div className="absolute inset-x-0 bottom-0 z-20 pt-8 md:pt-20 pb-3 md:pb-6 px-3 md:px-6 bg-gradient-to-t from-black via-black/80 to-transparent 
                                            opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 
                                            md:translate-y-4 md:group-hover:translate-y-0">

                                {/* Location */}
                                <div className="flex items-center gap-1 text-white/60 mb-1 md:mb-2 transform md:translate-y-2 md:group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                    <MapPin className="w-2.5 md:w-3.5 h-2.5 md:h-3.5" />
                                    <span className="text-[8px] md:text-xs uppercase tracking-wide font-medium truncate max-w-[80px] md:max-w-[200px]">{vibe.location}</span>
                                </div>

                                <span className="text-[10px] md:text-2xl font-heading text-taxi-yellow block mb-0.5 md:mb-2 drop-shadow-md tracking-wide leading-tight uppercase">
                                    {vibe.title}
                                </span>

                                <p className="text-[8px] md:text-xs text-white/80 line-clamp-1 md:line-clamp-2 leading-relaxed drop-shadow-sm font-light mb-2 md:mb-0">
                                    {vibe.description}
                                </p>

                                {/* Mobile CTA - Hidden */}
                                <div className="hidden flex items-center justify-between mt-2 border-t border-white/10 pt-2">
                                    <span className="text-[8px] font-bold text-white uppercase tracking-widest">More</span>
                                    <div className="bg-taxi-yellow text-black rounded-full p-1">
                                        <ArrowUpRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};
