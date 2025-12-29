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
            <div className="grid grid-cols-1 gap-6 md:block md:columns-2 lg:columns-3 md:gap-6 md:space-y-6">
                {VIBES.map((vibe) => (
                    <Link key={vibe.id} href={`/vibes/${vibe.id}`} className="block w-full md:break-inside-avoid md:mb-6 md:last:mb-0 focus:outline-none focus:ring-2 focus:ring-taxi-yellow rounded-3xl active:scale-[0.98] transition-transform duration-300">
                        <div className={`vibe-card relative group breaks-inside-avoid overflow-hidden rounded-3xl border border-white/10 bg-asphalt-black cursor-pointer shadow-lg shadow-black/50`}>

                            {/* Image Container */}
                            <div className={`relative w-full ${vibe.aspect} transition-all duration-700`}>
                                {/* Mobile: Full Color. Desktop: Grayscale -> Color on hover */}
                                <div className="absolute inset-0 z-10 transition-all duration-700 bg-transparent md:bg-asphalt-black/20 md:backdrop-grayscale md:group-hover:backdrop-grayscale-0 md:group-hover:bg-transparent" />

                                <Image
                                    src={vibe.src}
                                    alt={vibe.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    sizes="(max-width: 768px) 95vw, (max-width: 1200px) 50vw, 33vw"
                                />

                                {/* Tags - Mobile/Desktop: Top Left */}
                                <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                                    {vibe.tags.slice(0, 2).map((tag, i) => (
                                        <span key={i} className="text-[10px] uppercase tracking-wider font-bold text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Gradient Overlay & Content */}
                            {/* Mobile: Taller gradient for better text legibility. */}
                            <div className="absolute inset-x-0 bottom-0 z-20 pt-20 pb-6 px-6 bg-gradient-to-t from-black via-black/80 to-transparent 
                                            opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 
                                            md:translate-y-4 md:group-hover:translate-y-0">

                                {/* Location */}
                                <div className="flex items-center gap-1.5 text-white/60 mb-2 transform md:translate-y-2 md:group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="text-xs uppercase tracking-wide font-medium truncate max-w-[200px]">{vibe.location}</span>
                                </div>

                                <span className="text-2xl md:text-2xl font-heading text-taxi-yellow block mb-2 drop-shadow-md tracking-wide leading-tight">
                                    {vibe.title}
                                </span>

                                <p className="text-sm md:text-xs text-white/80 line-clamp-2 leading-relaxed drop-shadow-sm font-light mb-4 md:mb-0">
                                    {vibe.description}
                                </p>

                                {/* Mobile CTA */}
                                <div className="md:hidden flex items-center justify-between mt-4 border-t border-white/10 pt-4">
                                    <span className="text-xs font-bold text-white uppercase tracking-widest">Read More</span>
                                    <div className="bg-taxi-yellow text-black rounded-full p-1.5">
                                        <ArrowUpRight className="w-4 h-4" />
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
