
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';

export default function SubmitJob() {
    const { token, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: 'Mumbai',
        type: 'Full-time',
        description: '',
        salaryRange: '',
        applyLink: ''
    });
    const [error, setError] = useState('');

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
                <Navbar />
                <div className="container mx-auto px-6 py-24 max-w-2xl">
                    <div className="h-10 w-48 bg-gray-200 dark:bg-white/10 rounded mb-8 animate-pulse"></div>
                    <div className="space-y-6 bg-foreground/5 p-8 rounded-2xl border border-foreground/10">
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded animate-pulse"></div>
                            <div className="h-12 w-full bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded animate-pulse"></div>
                            <div className="h-12 w-full bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded animate-pulse"></div>
                                <div className="h-12 w-full bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded animate-pulse"></div>
                                <div className="h-12 w-full bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded animate-pulse"></div>
                            <div className="h-32 w-full bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"></div>
                        </div>
                        <div className="h-12 w-full bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse mt-4"></div>
                    </div>
                </div>
            </main>
        );
    }
    if (!isAuthenticated) {
        router.push('/auth');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('http://localhost:4000/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error('Your session has expired. Please log in again.');
                }
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || `Server error: ${res.status}`);
            }

            router.push('/jobs'); // Redirect to jobs list
        } catch (err: any) {
            setError(err.message || 'Failed to submit job. Please try again.');
        }
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="container mx-auto px-6 py-24 max-w-2xl">
                <h1 className="text-3xl font-heading font-bold mb-8">Post a Job</h1>
                {error && <div className="bg-red-500/10 text-red-500 p-4 rounded mb-6">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6 bg-foreground/5 p-8 rounded-2xl border border-foreground/10 backdrop-blur-sm">
                    <div>
                        <label className="block text-sm font-medium text-foreground/60 mb-2">Job Title</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-background/50 border border-foreground/10 rounded-lg p-3 text-foreground focus:border-taxi-yellow outline-none"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground/60 mb-2">Company</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-background/50 border border-foreground/10 rounded-lg p-3 text-foreground focus:border-taxi-yellow outline-none"
                            value={formData.company}
                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground/60 mb-2">Location</label>
                            <input
                                type="text"
                                className="w-full bg-background/50 border border-foreground/10 rounded-lg p-3 text-foreground focus:border-taxi-yellow outline-none"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground/60 mb-2">Type</label>
                            <select
                                className="w-full bg-background/50 border border-foreground/10 rounded-lg p-3 text-foreground focus:border-taxi-yellow outline-none"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground/60 mb-2">Description</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full bg-background/50 border border-foreground/10 rounded-lg p-3 text-foreground focus:border-taxi-yellow outline-none"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground/60 mb-2">Apply Link</label>
                        <input
                            type="url"
                            className="w-full bg-background/50 border border-foreground/10 rounded-lg p-3 text-foreground focus:border-taxi-yellow outline-none"
                            value={formData.applyLink}
                            onChange={e => setFormData({ ...formData, applyLink: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="w-full bg-taxi-yellow text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors">
                        Post Job
                    </button>
                </form>
            </div>
        </main>
    );
}
