"use client";
import Link from 'next/link';

import { ArrowRight, Briefcase, Camera, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getJobs, getPhotos, getPlaces } from '@/lib/api';

export const CoreValues = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [photos, setPhotos] = useState<any[]>([]);
    const [places, setPlaces] = useState<any[]>([]);

    useEffect(() => {
        getJobs('All Mumbai').then(data => setJobs(data.slice(0, 3))).catch(console.error);
        getPhotos('All Mumbai').then(data => setPhotos(data.slice(0, 3))).catch(console.error);
        getPlaces('All Mumbai').then(data => setPlaces(data.slice(0, 3))).catch(console.error);
    }, []);

    const sections = [
        {
            title: "Latest Mumbai Jobs",
            icon: <Briefcase className="w-6 h-6 text-taxi-yellow" />,
            description: "Find your next career move in the city.",
            links: jobs.map(j => `${j.title} @ ${j.location}`),
            cta: "View all jobs",
            href: "/jobs"
        },
        {
            title: "Trending Gallery",
            icon: <Camera className="w-6 h-6 text-taxi-yellow" />,
            description: "See what Mumbai looked like today.",
            links: photos.map(p => p.title),
            cta: "Explore Photos",
            href: "/gallery"
        },
        {
            title: "Top Local Places",
            icon: <MapPin className="w-6 h-6 text-taxi-yellow" />,
            description: "Hidden gems towards the suburbs.",
            links: places.map(p => `${p.name}, ${p.category}`),
            cta: "Discover Places",
            href: "/places"
        }
    ];

    return (
        <section className="py-24 px-6 bg-background relative z-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {sections.map((item, idx) => (
                        <div key={idx} className="group border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="mb-6 bg-white dark:bg-white/10 w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm dark:shadow-none">
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-heading tracking-wide mb-3 text-foreground">{item.title}</h3>
                            <p className="text-foreground/60 mb-6 text-sm leading-relaxed">{item.description}</p>

                            <ul className="space-y-3 mb-8">
                                {item.links.length > 0 ? item.links.map((link, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-foreground/80 hover:text-taxi-yellow cursor-pointer transition-colors border-b border-dashed border-black/10 dark:border-white/10 pb-2 last:border-0 last:pb-0">
                                        <div className="w-1.5 h-1.5 bg-taxi-yellow rounded-full" />
                                        {link}
                                    </li>
                                )) : (
                                    <li className="text-foreground/40 italic text-sm">Loading updates...</li>
                                )}
                            </ul>

                            <Link href={item.href} className="inline-flex items-center gap-2 text-taxi-yellow font-bold text-sm tracking-wider uppercase group-hover:gap-4 transition-all">
                                {item.cta} <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
