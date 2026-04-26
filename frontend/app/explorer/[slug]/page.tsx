"use client";

import { useParams } from 'next/navigation';
import { CITY_REGIONS } from '@/constants/cityData';
import { Navbar } from '@/components/Navbar';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getWeather, getAQI } from '@/lib/api';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { ssr: false });

export default function RegionExplorer() {
    const params = useParams();
    const slug = params?.slug as string;
    const region = CITY_REGIONS[slug];
    const [liveWeather, setLiveWeather] = useState<{ temp: number, condition: string, humidity: number } | null>(null);
    const [liveAQI, setLiveAQI] = useState<{ aqi: number, pm25: number } | null>(null);

    useEffect(() => {
        if (region) {
            getWeather(region.coordinates[0], region.coordinates[1]).then(setLiveWeather);
            getAQI(region.coordinates[0], region.coordinates[1]).then(setLiveAQI);
        }
    }, [region]);

    if (!region) {
        return <div className="min-h-screen bg-asphalt-black text-white flex items-center justify-center">Region not found</div>;
    }

    return (
        <main className="min-h-screen bg-asphalt-black text-stone-100 font-sans selection:bg-taxi-yellow selection:text-black">
            <Navbar />

            {/* 1. Hero Section */}
            <section className="relative h-[80vh] w-full overflow-hidden flex items-end">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-105"
                    style={{ backgroundImage: `url(${region.heroImage})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-asphalt-black via-black/40 to-transparent" />
                </div>

                <div className="relative z-10 p-8 md:p-16 max-w-7xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-heading font-bold mb-4 tracking-tighter text-white">
                            {region.name}
                        </h1>
                        <p className="text-xl md:text-2xl font-serif italic text-stone-300 mb-6 max-w-2xl">
                            "{region.tagline}"
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
                        <span className="text-lg font-bold text-taxi-yellow">{region.pulse.trainStatus}</span>
                    </div>
                    <div className="flex-none w-1/3 md:w-auto px-8 py-6 flex flex-col justify-center min-w-[200px]">
                        <span className="text-xs text-stone-500 uppercase tracking-widest mb-1">Traffic Jam</span>
                        <span className="text-lg font-bold text-white">{region.pulse.traffic}</span>
                    </div>
                    <div className="flex-none w-1/3 md:w-auto px-8 py-6 flex flex-col justify-center min-w-[200px]">
                        <span className="text-xs text-stone-500 uppercase tracking-widest mb-1">City Mood</span>
                        <span className="text-lg font-bold text-blue-400">{region.pulse.mood}</span>
                    </div>
                    <div className="flex-none w-1/3 md:w-auto px-8 py-6 flex flex-col justify-center min-w-[200px]">
                        <span className="text-xs text-stone-500 uppercase tracking-widest mb-1">Time</span>
                        <span className="text-lg font-bold text-stone-300">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen max-w-7xl mx-auto">

                {/* 3. Sub-City / Area Explorer & Content */}
                <div className="lg:col-span-7 p-6 md:p-12 lg:p-20 border-r border-white/5 space-y-24">

                    {/* Region Description */}
                    <div className="prose prose-invert prose-lg">
                        <p className="text-2xl md:text-3xl leading-relaxed text-stone-200 font-serif">
                            {region.description}
                        </p>
                    </div>

                    {/* Sub-Areas Grid */}
                    <div>
                        <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-8 flex items-center gap-4">
                            <span className="w-12 h-[1px] bg-stone-700"></span>
                            Neighborhoods
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {region.subAreas.map((area, idx) => (
                                <Link href={`/explorer/${slug}/${area.slug}`} key={idx} className="block group">
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
                                            <p className="text-stone-400 text-sm leading-relaxed">
                                                {area.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}</div>

                        {/* Living Blocks */}
                        <div className="grid grid-cols-3 gap-4 mt-12 ">
                            <div className="bg-white/5 p-6 rounded-sm border border-white/5">
                                <span className="text-2xl mb-2 block">🚆</span>
                                <span className="text-xs uppercase tracking-widest text-stone-500">Connectivity</span>
                                <div className="mt-1 font-bold">Excellent</div>
                            </div>
                            <div className="bg-white/5 p-6 rounded-sm border border-white/5">
                                <span className="text-2xl mb-2 block">🏠</span>
                                <span className="text-xs uppercase tracking-widest text-stone-500">Rent</span>
                                <div className="mt-1 font-bold">₹40k - 1.5L</div>
                            </div>
                            <div className="bg-white/5 p-6 rounded-sm border border-white/5">
                                <span className="text-2xl mb-2 block">🌟</span>
                                <span className="text-xs uppercase tracking-widest text-stone-500">Vibe Score</span>
                                <div className="mt-1 font-bold">9.2/10</div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 4. Map & Sidebar */}
                <div className="lg:col-span-5 sticky top-0 h-screen hidden lg:block bg-stone-900 border-l border-white/5 relative">
                    <div className="absolute inset-0 z-0 opacity-60">
                        <LeafletMap coordinates={region.coordinates} zoom={13} />
                    </div>
                    <div className="absolute bottom-8 left-8 z-10 bg-black/80 backdrop-blur-md p-6 border border-white/10 max-w-sm rounded-sm">
                        <p className="font-serif text-lg italic text-stone-300">"{region.poeticLine}"</p>
                        <p className="text-xs text-stone-500 mt-2 uppercase tracking-widest font-mono">— BombayHub</p>
                    </div>
                </div>
            </div>

            {/* 5. City Gallery Link / Footer */}
            <footer className="py-24 border-t border-white/10 text-center">
                <h3 className="text-3xl font-heading mb-8">Captured by Locals</h3>
                <Link href="/browse" className="inline-block border border-white/20 px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all uppercase tracking-widest text-sm font-bold">
                    View Gallery
                </Link>
            </footer>

        </main>
    );
}
