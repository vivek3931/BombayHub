"use client";

import { Navbar } from '@/components/Navbar';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getWeather, getAQI } from '@/lib/api';
import { RegionData, SubArea } from '@/constants/cityData';
import { ArrowLeft } from 'lucide-react';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { ssr: false });

interface CityPageTemplateProps {
    data: RegionData | SubArea;
    isSubCity?: boolean;
    parentRegion?: RegionData;
    regionSlug?: string;
}

export default function CityPageTemplate({ data, isSubCity = false, parentRegion, regionSlug }: CityPageTemplateProps) {
    const [liveWeather, setLiveWeather] = useState<{ temp: number, condition: string, humidity: number } | null>(null);
    const [liveAQI, setLiveAQI] = useState<{ aqi: number, pm25: number } | null>(null);

    // Type guard or safe access for subAreas since SubArea doesn't have it
    const subAreas = (data as RegionData).subAreas;

    useEffect(() => {
        if (data) {
            getWeather(data.coordinates[0], data.coordinates[1]).then(setLiveWeather);
            getAQI(data.coordinates[0], data.coordinates[1]).then(setLiveAQI);
        }
    }, [data]);

    if (!data) {
        return <div className="min-h-screen bg-asphalt-black text-white flex items-center justify-center">Location not found</div>;
    }

    // Determine hero image
    // If it's a SubArea, it has 'image', RegionData has 'heroImage'
    const heroImage = (data as RegionData).heroImage || (data as SubArea).image;

    return (
        <main className="min-h-screen bg-asphalt-black text-stone-100 font-sans selection:bg-taxi-yellow selection:text-black">
            <Navbar />

            {/* 1. Hero Section */}
            <section className="relative h-[80vh] w-full overflow-hidden flex items-end">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-105"
                    style={{ backgroundImage: `url(${heroImage})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-asphalt-black via-black/40 to-transparent" />
                </div>

                <div className="relative z-10 p-8 md:p-16 max-w-7xl mx-auto w-full">
                    {/* Back Link for Sub-Cities */}
                    {isSubCity && parentRegion && regionSlug && (
                        <Link
                            href={`/explorer/${regionSlug}`}
                            className="inline-flex items-center gap-2 text-taxi-yellow hover:underline mb-6 text-sm font-mono tracking-wider"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to {parentRegion.name}
                        </Link>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-heading font-bold mb-4 tracking-tighter text-white">
                            {data.name}
                        </h1>
                        <p className="text-xl md:text-2xl font-serif italic text-stone-300 mb-6 max-w-2xl">
                            "{data.tagline || (data as SubArea).vibe}"
                        </p>

                        <div className="flex items-center space-x-6 text-sm md:text-base font-mono tracking-widest uppercase opacity-80">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Live
                            </span>
                            {liveWeather ? (
                                <span>{liveWeather.temp}°C {liveWeather.condition}</span>
                            ) : <span>Loading Weather...</span>}

                            {liveAQI ? (
                                <span>AQI {liveAQI.aqi}</span>
                            ) : <span>Loading AQI...</span>}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. City Pulse Strip */}
            <section className="border-y border-white/10 bg-black/40 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto flex flex-nowrap overflow-x-auto divide-x divide-white/10 no-scrollbar">
                    <div className="flex-none w-1/3 md:w-auto px-8 py-6 flex flex-col justify-center min-w-[200px]">
                        <span className="text-xs text-stone-500 uppercase tracking-widest mb-1">Local Train</span>
                        <span className="text-lg font-bold text-taxi-yellow">{data.pulse?.trainStatus || "Normal"}</span>
                    </div>
                    <div className="flex-none w-1/3 md:w-auto px-8 py-6 flex flex-col justify-center min-w-[200px]">
                        <span className="text-xs text-stone-500 uppercase tracking-widest mb-1">Traffic Jam</span>
                        <span className="text-lg font-bold text-white">{data.pulse?.traffic || "Moderate"}</span>
                    </div>
                    <div className="flex-none w-1/3 md:w-auto px-8 py-6 flex flex-col justify-center min-w-[200px]">
                        <span className="text-xs text-stone-500 uppercase tracking-widest mb-1">City Mood</span>
                        <span className="text-lg font-bold text-blue-400">{data.pulse?.mood || "Alive"}</span>
                    </div>
                    <div className="flex-none w-1/3 md:w-auto px-8 py-6 flex flex-col justify-center min-w-[200px]">
                        <span className="text-xs text-stone-500 uppercase tracking-widest mb-1">Time</span>
                        <span className="text-lg font-bold text-stone-300">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">

                {/* 3. Sub-City / Area Explorer & Content */}
                <div className="lg:col-span-7 p-6 md:p-12 lg:p-20 border-r border-white/5 space-y-24">

                    {/* Description */}
                    <div className="prose prose-invert max-w-none">
                        <p className="text-xl leading-relaxed text-stone-200 font-serif first-letter:text-7xl first-letter:font-bold first-letter:text-taxi-yellow first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]">
                            {data.description}
                        </p>
                    </div>

                    {/* Sub-Areas Grid (Only if not a sub-city) */}
                    {!isSubCity && subAreas && (
                        <div>
                            <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-8 flex items-center gap-4">
                                <span className="w-12 h-[1px] bg-stone-700"></span>
                                Neighborhoods
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                {subAreas.map((area, idx) => (
                                    <Link href={`/explorer/${(data as RegionData).slug}/${area.slug}`} key={idx} className="block group">
                                        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-taxi-yellow/50 transition-all duration-300 h-full flex flex-col">
                                            <div
                                                className="h-48 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                                style={{ backgroundImage: `url(${area.image})` }}
                                            />
                                            <div className="p-6 flex-grow ">
                                                <h3 className="text-2xl font-heading text-white mb-2 group-hover:text-taxi-yellow transition-colors">
                                                    {area.name}
                                                </h3>
                                                <p className="text-taxi-yellow/80 text-sm font-bold tracking-wider mb-2 uppercase">
                                                    {area.vibe}
                                                </p>
                                                <p className="text-stone-400 text-sm leading-relaxed line-clamp-3 mb-4">
                                                    {area.description}
                                                </p>
                                                <div className="text-taxi-yellow text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                                                    Read More <span className="text-lg">→</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Rich Data Sections (Attractions, Dining, Hotels) */}
                    <div className="space-y-16">
                        {/* Attractions */}
                        {data.attractions && data.attractions.length > 0 && (
                            <div>
                                <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-6 flex items-center gap-4">
                                    <span className="w-12 h-[1px] bg-stone-700"></span>
                                    Top Attractions
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {data.attractions.map((item: any, idx: number) => (
                                        <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-xl hover:bg-white/10 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-heading text-white">{item.name}</h3>
                                                <span className="text-[10px] uppercase tracking-wider text-taxi-yellow bg-taxi-yellow/10 px-2 py-1 rounded">{item.type}</span>
                                            </div>
                                            <p className="text-stone-400 text-sm leading-relaxed">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Dining */}
                        {data.dining && data.dining.length > 0 && (
                            <div>
                                <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-6 flex items-center gap-4">
                                    <span className="w-12 h-[1px] bg-stone-700"></span>
                                    Iconic Dining
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {data.dining.map((item: any, idx: number) => (
                                        <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-xl hover:bg-white/10 transition-colors">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                                            </div>
                                            <p className="text-taxi-yellow text-xs font-medium mb-2">{item.cuisine}</p>
                                            <p className="text-stone-400 text-sm font-serif italic">"{item.vibe}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Hotels */}
                        {data.hotels && data.hotels.length > 0 && (
                            <div>
                                <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-6 flex items-center gap-4">
                                    <span className="w-12 h-[1px] bg-stone-700"></span>
                                    Luxury Stays
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {data.hotels.map((item: any, idx: number) => (
                                        <div key={idx} className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-5 rounded-xl flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="text-lg font-bold text-white pr-4">{item.name}</h3>
                                                    <div className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold">
                                                        ★ {item.rating}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                                                <span className="text-xs text-stone-500 uppercase tracking-widest">Starting at</span>
                                                <span className="text-taxi-yellow font-bold">{item.priceRange}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Living Blocks */}
                    {data.livingData && (
                        <div>
                            <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-6 flex items-center gap-4">
                                <span className="w-12 h-[1px] bg-stone-700"></span>
                                Living Stats
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-taxi-yellow/50 transition-colors">
                                    <span className="text-2xl mb-3 block">🚆</span>
                                    <span className="text-xs uppercase tracking-widest text-stone-500 block mb-1">Connectivity</span>
                                    <div className="font-bold text-sm text-white">{data.livingData.connectivity}</div>
                                </div>
                                <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-taxi-yellow/50 transition-colors">
                                    <span className="text-2xl mb-3 block">🏠</span>
                                    <span className="text-xs uppercase tracking-widest text-stone-500 block mb-1">Avg. Monthly Rent</span>
                                    <div className="font-bold text-sm text-white">{data.livingData.rent}</div>
                                </div>
                                <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-taxi-yellow/50 transition-colors">
                                    <span className="text-2xl mb-3 block">🌟</span>
                                    <span className="text-xs uppercase tracking-widest text-stone-500 block mb-1">Vibe Score</span>
                                    <div className="font-bold text-sm text-white">{data.livingData.vibeScore}</div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* 4. Map & Sidebar */}
                <div className="lg:col-span-5 sticky top-0 h-screen hidden lg:block bg-stone-900 border-l border-white/5 relative">
                    <div className="absolute inset-0 z-0 opacity-60">
                        <LeafletMap coordinates={data.coordinates} zoom={isSubCity ? 15 : 13} />
                    </div>
                    <div className="absolute bottom-8 left-8 z-10 bg-black/80 backdrop-blur-md p-6 border border-white/10 max-w-sm rounded-sm">
                        <p className="font-serif text-lg italic text-stone-300">"{data.poeticLine}"</p>
                        <p className="text-xs text-stone-500 mt-2 uppercase tracking-widest font-mono">— BombayHub</p>
                    </div>
                </div>
            </div>

            {/* 5. City Gallery Link / Footer */}
            <footer className="py-24 border-t border-white/10 text-center">
                <h3 className="text-3xl font-heading mb-8">Captured by Locals</h3>
                <Link href="/photos" className="inline-block border border-white/20 px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all uppercase tracking-widest text-sm font-bold">
                    View Gallery
                </Link>
            </footer>

        </main>
    );
}
