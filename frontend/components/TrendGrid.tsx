
"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getJobs, getPhotos } from '@/lib/api';

export const TrendGrid = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [photos, setPhotos] = useState<any[]>([]);

    useEffect(() => {
        // Fetch only recent 3 items for preview
        getJobs().then(data => setJobs(data.slice(0, 3))).catch(console.error);
        getPhotos().then(data => setPhotos(data.slice(0, 3))).catch(console.error);
    }, []);

    return (
        <section className="py-24 px-6 bg-background relative z-10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Jobs Section */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-foreground">
                            <span className="text-taxi-yellow">#</span>WORK
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md">Trending opportunities in the financial capital.</p>
                    </div>
                    <Link href="/jobs" className="text-taxi-yellow hover:text-foreground transition-colors text-sm font-bold tracking-widest uppercase border-b border-taxi-yellow pb-1">
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                    {jobs.map((job) => (
                        <div key={job.id} className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 hover:border-taxi-yellow/50 transition-all group">
                            <h3 className="text-xl font-bold group-hover:text-taxi-yellow transition-colors mb-2 text-foreground">{job.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{job.company} • {job.location}</p>
                            <div className="flex gap-2">
                                <span className="text-xs bg-black/10 dark:bg-white/10 px-2 py-1 rounded-full text-foreground/70">{job.type}</span>
                            </div>
                        </div>
                    ))}
                    {jobs.length === 0 && <p className="text-gray-500 italic">No jobs trending right now.</p>}
                </div>

                {/* Photos Section */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-foreground">
                            <span className="text-taxi-yellow">#</span>VIBE
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md">Latest captures from the community.</p>
                    </div>
                    <Link href="/photos" className="text-taxi-yellow hover:text-foreground transition-colors text-sm font-bold tracking-widest uppercase border-b border-taxi-yellow pb-1">
                        View Gallery
                    </Link>
                </div>

                <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible pb-8 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                    {photos.map((photo, i) => (
                        <div key={photo.id} className="min-w-[85vw] md:min-w-0 snap-center relative group overflow-hidden rounded-xl border border-black/5 dark:border-white/10 bg-gray-100 dark:bg-white/5 aspect-square">
                            <Image
                                src={photo.url}
                                alt={photo.title}
                                fill
                                sizes="(max-width: 768px) 85vw, 33vw"
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            {/* Overlay - visible on mobile, hover on desktop */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
                                <h3 className="font-bold text-sm md:text-lg text-white uppercase tracking-tight md:tracking-normal line-clamp-1 leading-tight">{photo.title}</h3>
                                {photo.photographer?.name && (
                                    <p className="text-taxi-yellow text-[10px] md:text-sm mt-0.5 font-bold uppercase tracking-wider">@{photo.photographer.name}</p>
                                )}
                            </div>
                        </div>
                    ))}
                    {photos.length === 0 && <p className="text-gray-500 italic col-span-2 md:col-span-3">No photos trending right now.</p>}
                </div>
            </div>
        </section>
    );
};
