
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/providers/AuthContext';

export default function SubmitPlace() {
    const { token, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        category: 'Landmark',
        address: '',
        images: ''
    });
    const [error, setError] = useState('');

    if (isLoading) {
        return (
            <main className="min-h-screen bg-asphalt-black text-white transition-colors duration-300">
                <Navbar />
                <div className="container mx-auto px-6 py-24 max-w-2xl">
                    <div className="h-10 w-48 bg-gray-200/20 dark:bg-white/10 rounded mb-8 animate-pulse"></div>
                    <div className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10">
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200/20 dark:bg-white/10 rounded animate-pulse"></div>
                            <div className="h-12 w-full bg-gray-200/20 dark:bg-white/10 rounded-lg animate-pulse"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200/20 dark:bg-white/10 rounded animate-pulse"></div>
                            <div className="h-12 w-full bg-gray-200/20 dark:bg-white/10 rounded-lg animate-pulse"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200/20 dark:bg-white/10 rounded animate-pulse"></div>
                            <div className="h-12 w-full bg-gray-200/20 dark:bg-white/10 rounded-lg animate-pulse"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200/20 dark:bg-white/10 rounded animate-pulse"></div>
                            <div className="h-12 w-full bg-gray-200/20 dark:bg-white/10 rounded-lg animate-pulse"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200/20 dark:bg-white/10 rounded animate-pulse"></div>
                            <div className="h-12 w-full bg-gray-200/20 dark:bg-white/10 rounded-lg animate-pulse"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200/20 dark:bg-white/10 rounded animate-pulse"></div>
                            <div className="h-32 w-full bg-gray-200/20 dark:bg-white/10 rounded-lg animate-pulse"></div>
                        </div>
                        <div className="h-12 w-full bg-gray-200/20 dark:bg-white/10 rounded-lg animate-pulse mt-4"></div>
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
        try {
            const res = await fetch('http://localhost:4000/places', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    images: formData.images.split(',').map(i => i.trim()).filter(i => i)
                }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData?.message || 'Failed to post place');
            }
            router.push('/explorer');
        } catch (err: any) {
            setError(err.message || 'Failed to submit place. Please try again.');
        }
    };

    return (
        <main className="min-h-screen bg-asphalt-black text-white">
            <Navbar />
            <div className="container mx-auto px-6 py-24 max-w-2xl">
                <h1 className="text-3xl font-heading font-bold mb-8">Add a Place</h1>
                {error && <div className="bg-red-500/10 text-red-500 p-4 rounded mb-6">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-asphalt-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-taxi-yellow outline-none"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                        <select
                            className="w-full bg-asphalt-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-taxi-yellow outline-none"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="Landmark">Landmark</option>
                            <option value="Food">Food</option>
                            <option value="Hidden Gem">Hidden Gem</option>
                            <option value="Heritage">Heritage</option>
                            <option value="Nature">Nature</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Location (Area)</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Bandra West"
                            className="w-full bg-asphalt-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-taxi-yellow outline-none"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Full Address</label>
                        <input
                            type="text"
                            className="w-full bg-asphalt-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-taxi-yellow outline-none"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Images (comma separated URLs)</label>
                        <input
                            type="text"
                            className="w-full bg-asphalt-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-taxi-yellow outline-none"
                            value={formData.images}
                            onChange={e => setFormData({ ...formData, images: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full bg-asphalt-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-taxi-yellow outline-none"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="w-full bg-taxi-yellow text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors">
                        Add Place
                    </button>
                </form>
            </div>
        </main>
    );
}
