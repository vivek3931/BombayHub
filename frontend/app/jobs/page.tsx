"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { getJobs } from '@/lib/api';
import { useAuth } from '@/providers/AuthContext';
import { Loader } from 'lucide-react';

export default function JobsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    // Filters
    const [typeFilter, setTypeFilter] = useState('All');
    const [locationFilter, setLocationFilter] = useState('All');

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth');
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            getJobs()
                .then(data => {
                    console.log('Fetched jobs:', data);
                    setJobs(data);
                    setFilteredJobs(data);
                })
                .catch(err => {
                    console.error('Error fetching jobs:', err);
                });
        }
    }, [isAuthenticated]);

    // Apply filters
    useEffect(() => {
        let result = jobs;
        if (typeFilter !== 'All') {
            result = result.filter(job => job.type === typeFilter);
        }
        if (locationFilter !== 'All') {
            result = result.filter(job => job.location.includes(locationFilter));
        }
        setFilteredJobs(result);
    }, [typeFilter, locationFilter, jobs]);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-24">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                        <div>
                            <div className="h-10 bg-gray-200 dark:bg-white/10 rounded w-64 mb-4 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-48 animate-pulse"></div>
                        </div>
                        <div className="w-32 h-12 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse"></div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-8">
                        <div className="w-32 h-10 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"></div>
                        <div className="w-48 h-10 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"></div>
                    </div>

                    <div className="grid gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl p-6">
                                <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-1/3 mb-4 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/4 mb-6 animate-pulse"></div>
                                <div className="flex gap-2 mb-4">
                                    <div className="w-20 h-6 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse"></div>
                                    <div className="w-24 h-6 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse"></div>
                                </div>
                                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-full mb-2 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-2/3 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-heading font-bold mb-2">Career Opportunities</h1>
                        <p className="text-foreground/60">Discover roles shaping the future of Mumbai</p>
                    </div>
                    <Link href="/submit/job" className="bg-taxi-yellow text-black font-bold px-6 py-3 rounded-full hover:bg-yellow-400 transition-colors">
                        Post a Job
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-taxi-yellow shadow-sm dark:shadow-none"
                    >
                        <option value="All" className="bg-background text-foreground">All Types</option>
                        <option value="Full-time" className="bg-background text-foreground">Full-time</option>
                        <option value="Part-time" className="bg-background text-foreground">Part-time</option>
                        <option value="Contract" className="bg-background text-foreground">Contract</option>
                        <option value="Freelance" className="bg-background text-foreground">Freelance</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Filter by Location..."
                        value={locationFilter === 'All' ? '' : locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value || 'All')}
                        className="bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-taxi-yellow shadow-sm dark:shadow-none"
                    />
                </div>

                {filteredJobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-300 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-white/5">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 text-4xl">
                            💼
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Jobs Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                            {jobs.length === 0
                                ? "We couldn't find any job listings at the moment. Check back later or be the first to post one!"
                                : "No jobs match your current filters. Try adjusting them."}
                        </p>
                        {jobs.length === 0 && (
                            <Link href="/submit/job" className="text-taxi-yellow hover:underline">
                                Post a Job Now
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredJobs.map((job) => (
                            <div key={job.id} className="bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl p-6 hover:border-taxi-yellow/50 transition-all group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold group-hover:text-taxi-yellow transition-colors text-foreground">{job.title}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 mb-2">{job.company} • {job.location}</p>
                                        <div className="flex gap-2 mb-4">
                                            <span className="bg-gray-200 dark:bg-white/10 px-3 py-1 rounded-full text-xs text-foreground/80 dark:text-white/80">{job.type}</span>
                                            {job.salaryRange && <span className="bg-gray-200 dark:bg-white/10 px-3 py-1 rounded-full text-xs text-foreground/80 dark:text-white/80">{job.salaryRange}</span>}
                                        </div>
                                        <p className="text-sm text-foreground/70 dark:text-gray-300 line-clamp-2">{job.description}</p>
                                    </div>
                                    {job.applyLink && (
                                        <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="bg-foreground text-background dark:bg-white dark:text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-black/80 dark:hover:bg-gray-200 transition-colors">
                                            Apply Now
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
