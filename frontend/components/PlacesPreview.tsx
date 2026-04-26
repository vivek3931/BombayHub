"use client";
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { useLocation } from './LocationProvider';
import { getPlaces } from '@/lib/api';

export const PlacesPreview = () => {
    const { location } = useLocation();
    const [places, setPlaces] = useState<any[]>([]);

    useEffect(() => {
        getPlaces(location)
            .then(data => setPlaces(data.slice(0, 3))) // Show top 3
            .catch(err => console.error("Failed to fetch places", err));
    }, [location]);

    return (
        <section className="py-24 px-6 bg-background relative overflow-hidden transition-colors duration-300">
            {/* Background Map Effect */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/b/bd/Mumbai_OpenStreetMap.svg')] bg-cover bg-center grayscale contrast-200 dark:invert-0 invert" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-16 items-center">

                <div className="md:w-1/2">
                    <span className="text-taxi-yellow font-bold tracking-widest uppercase text-sm mb-4 block">Discover Local Gems</span>
                    <h2 className="text-5xl md:text-7xl font-heading text-foreground mb-6 leading-none">
                        WHERE TO <br /> <span className="text-transparent stroke-text stroke-black dark:stroke-white">HANG OUT</span>
                    </h2>
                    <p className="text-foreground/70 mb-8 text-lg leading-relaxed max-w-md">
                        From hidden libraries in Fort to artisanal cafes in Bandra. Find the perfect spot for your next meeting, date, or solitude session.
                    </p>
                    <Link href="/places" className="inline-block bg-foreground text-background font-bold px-8 py-4 rounded-xl hover:bg-taxi-yellow hover:text-asphalt-black transition-colors uppercase tracking-wide">
                        Explore Map
                    </Link>
                </div>

                <div className="md:w-1/2 grid grid-cols-1 gap-6">
                    {places.map((item, idx) => (
                        <div key={item.id || idx} className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 p-4 rounded-xl flex items-center gap-4 hover:bg-white/90 dark:hover:bg-white/10 transition-colors cursor-pointer shadow-sm dark:shadow-none">
                            <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                                <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24'} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground dark:text-white">{item.name}</h3>
                                <p className="text-foreground/60 dark:text-white/60 text-sm">{item.location}</p>
                            </div>
                            <div className="ml-auto text-taxi-yellow font-bold text-lg">
                                ★ {item.rating}
                            </div>
                        </div>
                    ))}
                    {places.length === 0 && (
                        <div className="text-foreground/50 dark:text-white/50 italic">No places found in {location}.</div>
                    )}
                </div>

            </div>

        </section>
    );
};
