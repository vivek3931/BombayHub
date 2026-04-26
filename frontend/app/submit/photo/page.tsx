
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';

export default function SubmitPhoto() {
    const { token, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        tags: ''
    });
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded animate-pulse"></div>
                            <div className="h-12 w-full bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded animate-pulse"></div>
                            <div className="h-12 w-full bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"></div>
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
        if (!file) {
            setError('Please select an image file to upload.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const formDataObj = new FormData();
            formDataObj.append('title', formData.title);
            formDataObj.append('location', formData.location);
            formDataObj.append('tags', formData.tags);
            formDataObj.append('file', file);

            const res = await fetch('http://localhost:4000/photos', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataObj,
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => null);
                throw new Error(errorData?.message || `HTTP error! status: ${res.status}`);
            }
            router.push('/photos');
        } catch (err: any) {
            setError(err.message || 'Failed to submit photo. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="container mx-auto px-6 py-24 max-w-2xl">
                <h1 className="text-3xl font-heading font-bold mb-8">Upload Photo</h1>
                {error && <div className="bg-red-500/10 text-red-500 p-4 rounded mb-6">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6 bg-foreground/5 p-8 rounded-2xl border border-foreground/10 backdrop-blur-sm">
                    <div>
                        <label className="block text-sm font-medium text-foreground/60 mb-2">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-background/50 border border-foreground/10 rounded-lg p-3 text-foreground focus:border-taxi-yellow outline-none"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground/60 mb-2">Image File</label>
                        <input
                            type="file"
                            accept="image/*"
                            required
                            className="w-full bg-background/50 border border-foreground/10 rounded-lg p-3 text-foreground focus:border-taxi-yellow outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-taxi-yellow file:text-black hover:file:bg-yellow-400"
                            onChange={e => setFile(e.target.files?.[0] || null)}
                        />
                    </div>
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
                        <label className="block text-sm font-medium text-foreground/60 mb-2">Tags (comma separated)</label>
                        <input
                            type="text"
                            placeholder="sunset, marine drive, architecture"
                            className="w-full bg-background/50 border border-foreground/10 rounded-lg p-3 text-foreground focus:border-taxi-yellow outline-none"
                            value={formData.tags}
                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                        />
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full bg-taxi-yellow text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50">
                        {isSubmitting ? 'Uploading...' : 'Upload Photo'}
                    </button>
                </form>
            </div>
        </main>
    );
}
