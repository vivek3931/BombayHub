"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import Leaflet map to avoid SSR issues
const LeafletMap = dynamic(() => import('./LeafletMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-asphalt-black text-white/50">
            <Loader2 className="w-8 h-8 animate-spin text-taxi-yellow" />
        </div>
    )
});

export const ExplorerMap = () => {
    return (
        <section className="relative h-[80vh] w-full bg-asphalt-black border-y border-white/10">
            <h2 className="absolute top-8 left-8 z-10 text-4xl font-heading text-white bg-asphalt-black/80 px-4 py-2 backdrop-blur-md border border-white/10 rounded-lg">
                MUMBAI <span className="text-taxi-yellow">EXPLORER</span>
            </h2>
            <LeafletMap />
        </section>
    );
};
