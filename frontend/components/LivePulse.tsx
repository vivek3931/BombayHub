"use client";
import { MapPin, Briefcase, Activity } from 'lucide-react';

import { useEffect, useState } from 'react';
import { useLocation } from './LocationProvider';
import { getJobs, getPlaces, getNews } from '@/lib/api';

const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
};

export const LivePulse = () => {
    const { location } = useLocation();
    const [latestPlace, setLatestPlace] = useState<any>(null);
    const [latestJob, setLatestJob] = useState<any>(null);
    const [latestNews, setLatestNews] = useState<any[]>([]);
    const [updates, setUpdates] = useState<any[]>([]);

    useEffect(() => {
        Promise.all([
            getPlaces(location),
            getJobs(location),
            getNews(3)
        ]).then(([places, jobs, news]) => {
            if (places.length > 0) setLatestPlace(places[0]);
            if (jobs.length > 0) setLatestJob(jobs[0]);
            setLatestNews(news);

            // Create specific "updates" from real data
            const recentActivity = [
                ...places.slice(0, 3).map((p: any) => ({ text: `New place explored: ${p.name}`, type: 'place' })),
                ...jobs.slice(0, 3).map((j: any) => ({ text: `New job posted: ${j.title} at ${j.company}`, type: 'job' })),
                ...news.slice(0, 3).map((n: any) => ({ text: `News update: ${n.title}`, type: 'news' }))
            ].sort(() => 0.5 - Math.random()).slice(0, 4);

            setUpdates(recentActivity);
        }).catch(err => console.error(err));
    }, [location]);

    return (
        <section className="py-20 px-6 bg-background relative z-10 border-t border-black/5 dark:border-white/5 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8 items-stretch">

                    {/* Latest Place Widget */}
                    <div className="md:w-1/3 bg-gradient-to-br from-sea-blue to-black dark:to-asphalt-black p-8 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <MapPin className="w-32 h-32 text-white" />
                        </div>
                        <h3 className="text-white/60 text-sm font-bold tracking-widest uppercase mb-1">Newest Discovery</h3>
                        {latestPlace ? (
                            <>
                                <div className="text-3xl font-heading text-white mb-2 leading-tight">{latestPlace.name}</div>
                                <p className="text-white/80">{latestPlace.category} • {latestPlace.location}</p>
                                <div className="mt-8 flex items-center gap-2 text-taxi-yellow text-sm font-bold">
                                    <span>★ {latestPlace.rating} Rated</span>
                                </div>
                            </>
                        ) : (
                            <div className="text-white/50 mt-4 italic">No places yet</div>
                        )}
                    </div>

                    {/* Latest Job Widget */}
                    <div className="md:w-1/3 bg-black/5 dark:bg-white/5 p-8 rounded-2xl border border-black/10 dark:border-white/10 group hover:border-taxi-yellow/50 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-rose-500 group-hover:opacity-20 transition-opacity">
                            <Briefcase className="w-32 h-32" />
                        </div>
                        <h3 className="text-gray-500 dark:text-white/60 text-sm font-bold tracking-widest uppercase mb-1">Latest Opportunity</h3>
                        {latestJob ? (
                            <>
                                <div className="text-3xl font-heading text-rose-500 mb-2 leading-tight">{latestJob.title}</div>
                                <p className="text-foreground/80 dark:text-white/80">{latestJob.company} • {latestJob.type}</p>
                                <div className="mt-8 w-full bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                                    <div className="w-[60%] h-full bg-rose-500 animate-pulse" />
                                </div>
                            </>
                        ) : (
                            <div className="text-foreground/50 dark:text-white/50 mt-4 italic">No jobs found</div>
                        )}
                    </div>

                    {/* Mumbai Today News */}
                    <div className="md:w-1/3 bg-black/5 dark:bg-white/5 p-8 rounded-2xl border border-black/10 dark:border-white/10 flex flex-col">
                        <div className="flex items-center gap-2 mb-6 text-taxi-yellow">
                            <Activity className="w-5 h-5" />
                            <h3 className="text-foreground dark:text-white font-bold tracking-wide">MUMBAI TODAY</h3>
                        </div>

                        <div className="space-y-6 flex-1">
                            {latestNews.length > 0 ? latestNews.map((news, i) => (
                                <div key={news.id} className="group cursor-pointer">
                                    <p className="text-foreground/90 dark:text-white/90 font-medium hover:text-taxi-yellow transition-colors leading-snug mb-2">
                                        {news.title}
                                    </p>
                                    <div className="flex justify-between items-center text-xs text-foreground/40 dark:text-white/40">
                                        <span>{news.source}</span>
                                        <span>{formatTimeAgo(news.createdAt)}</span>
                                    </div>
                                    <div className="h-[1px] bg-black/5 dark:bg-white/5 mt-4 group-last:hidden" />
                                </div>
                            )) : (
                                <div className="text-foreground/50 dark:text-white/50 italic">No news updates today.</div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
