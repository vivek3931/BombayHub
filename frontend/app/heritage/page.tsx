
"use client";
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';
import { getPlaces } from '@/lib/api';

export default function HeritagePage() {
    const [heritageSites, setHeritageSites] = useState<any[]>([]);

    useEffect(() => {
        // Fetch all places and filter for Heritage or similar
        // Since our API currently just gets by location, we might get everything and filter client side
        // or add category support to API client. 
        // For now, let's fetch 'All Mumbai' and filter.
        getPlaces('All Mumbai').then(places => {
            // Filter logic (mocking if category not strictly 'Heritage' in data)
            const heritage = places.filter((p: any) => p.category === 'Heritage' || p.category === 'Landmark');
            setHeritageSites(heritage);
        }).catch(console.error);
    }, []);

    return (
        <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Navbar />
            <div className="pt-32 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-taxi-yellow font-bold tracking-widest uppercase mb-4 block">Preserving History</span>
                    <h1 className="text-5xl md:text-7xl font-heading font-bold text-foreground mb-6">MUMBAI HERITAGE</h1>
                    <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
                        A walk through the colonial past and architectural marvels of the Maximum City.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {heritageSites.length > 0 ? heritageSites.map((site, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="aspect-video relative overflow-hidden rounded-2xl mb-6">
                                <img
                                    src={site.images?.[0] || 'https://images.unsplash.com/photo-1566552881560-0be862a7c445'}
                                    alt={site.name}
                                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                            </div>
                            <h3 className="text-3xl font-heading font-bold mb-2 group-hover:text-taxi-yellow transition-colors text-foreground">{site.name}</h3>
                            <p className="text-foreground/60 leading-relaxed mb-4">{site.description}</p>
                            <div className="flex items-center gap-4 text-sm font-bold text-taxi-yellow tracking-widest uppercase">
                                <span>{site.location}</span>
                                <span className="w-1 h-1 bg-taxi-yellow rounded-full" />
                                <span>{site.category}</span>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-2 text-center text-foreground/50 italic py-20">
                            Loading heritage sites...
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
