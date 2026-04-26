"use client";
import React, { useRef } from 'react';
import { useLocation } from './LocationProvider';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';
import { CITY_REGIONS } from '@/constants/cityData';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const { location, setLocation } = useLocation();

    const router = useRouter();

    const handleSearch = (query: string) => {
        if (!query) return;
        const lowerQuery = query.toLowerCase().trim();

        // 1. Direct Page Match (Region or Sub-City)
        for (const [slug, region] of Object.entries(CITY_REGIONS)) {
            // Check Region Name
            if (region.name.toLowerCase().includes(lowerQuery) || slug.replace('-', ' ').includes(lowerQuery)) {
                router.push(`/explorer/${slug}`);
                return;
            }
            // Check Sub-Areas
            for (const sub of region.subAreas) {
                if (sub.name.toLowerCase().includes(lowerQuery) || sub.slug.replace('-', ' ').includes(lowerQuery)) {
                    router.push(`/explorer/${slug}/${sub.slug}`);
                    return;
                }
            }
        }

        // 2. Fallback to Generic Explorer Search
        router.push(`/explorer?q=${encodeURIComponent(query)}&location=${location}`);
    };

    useGSAP(() => {
        gsap.from(textRef.current, {
            y: 100,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out",
        });

        gsap.to(textRef.current, {
            color: "#FFD600",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            }
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-center text-center px-4 pt-24 pb-12">
            <video
                autoPlay
                muted
                loop
                playsInline
                className="fixed top-0 left-0 w-full h-full object-cover opacity-75 z-0"
            >
                {/* Placeholder video - using a free stock footage URL if available or local */}
                <source src="/videos/hero_video.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-gradient-to-t from-asphalt-black via-black/30 to-black/40" />

            <div className="relative z-10 flex flex-col items-center gap-8 max-w-5xl">
                <h1 ref={textRef} className="text-4xl md:text-8xl font-heading font-bold text-transparent stroke-text-lg tracking-tighter leading-[0.9]">
                    MUMBAI’S LOCAL <br /> OPPORTUNITIES & <span className="text-taxi-yellow">CULTURE HUB</span>
                </h1>

                {/* Search & Location Container */}
                {/* Unified Search & Location Container */}
                <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 p-2 md:p-3 rounded-2xl md:rounded-full flex flex-col md:flex-row gap-4 shadow-2xl mt-8 md:mt-12 transition-all hover:bg-white/15 hover:border-white/30 hover:shadow-taxi-yellow/20">

                    {/* Location Selector */}
                    <div className="relative md:w-[200px] group border-b md:border-b-0 md:border-r border-white/10 md:pr-2">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-taxi-yellow">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                        </div>
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full h-12 md:h-14 bg-transparent text-white pl-12 pr-8 rounded-xl md:rounded-l-full border-none focus:ring-0 appearance-none cursor-pointer font-medium text-lg outline-none hover:text-taxi-yellow transition-colors"
                        >
                            <option className="bg-asphalt-black text-white">All Mumbai</option>
                            <option className="bg-asphalt-black text-white">South Mumbai</option>
                            <option className="bg-asphalt-black text-white">Western Suburbs</option>
                            <option className="bg-asphalt-black text-white">Navi Mumbai</option>
                            <option className="bg-asphalt-black text-white">Thane</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50 group-hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>

                    {/* Global Search */}
                    <div className="relative w-full md:w-auto md:flex-1">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search Colaba, Bandra, Juhu..."
                            className="w-full h-12 md:h-14 bg-transparent text-white pl-12 pr-4 rounded-xl md:rounded-none focus:outline-none font-medium placeholder:text-white/40 text-lg"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch((e.target as HTMLInputElement).value);
                                }
                            }}
                        />
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={() => {
                            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                            handleSearch(input?.value || '');
                        }}
                        className="h-12 md:h-14 px-8 bg-taxi-yellow hover:bg-[#FFC000] text-asphalt-black font-extrabold tracking-wider rounded-xl md:rounded-full transition-all uppercase whitespace-nowrap shadow-lg hover:shadow-taxi-yellow/50 active:scale-95 flex items-center justify-center gap-2">
                        <span>Search</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </button>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mt-8 opacity-80 text-sm font-medium tracking-widest uppercase text-white/70">
                    <span className="text-taxi-yellow">#Trending:</span>
                    <span className="cursor-pointer hover:text-white transition-colors">Photographer Meetup</span>
                    <span className="text-white/40">•</span>
                    <span className="cursor-pointer hover:text-white transition-colors">Tech Jobs</span>
                    <span className="text-white/40">•</span>
                    <span className="cursor-pointer hover:text-white transition-colors">Hidden Cafes</span>
                </div>
            </div>

            <div className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2">
                <span className="text-xs uppercase tracking-[0.2em] text-white/70">Scroll to Explore</span>
                <div className="w-[2px] h-12 bg-white/20 overflow-hidden">
                    <div className="w-full h-1/2 bg-taxi-yellow animate-scroll-down" />
                </div>
            </div>

        </section>
    );
};
