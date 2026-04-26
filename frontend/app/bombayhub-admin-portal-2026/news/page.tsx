'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Plus, Trash2, ExternalLink, Loader2 } from 'lucide-react';

interface NewsItem {
    id: string;
    title: string;
    description: string;
    source: string;
    category: string;
    createdAt: string;
}

export default function AdminNewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const { token } = useAuth();

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        source: '',
        category: 'General'
    });

    const fetchNews = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/news`);
            setNews(res.data);
        } catch (error) {
            console.error('Failed to fetch news', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/news`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNews([res.data, ...news]);
            setShowModal(false);
            setFormData({ title: '', description: '', source: '', category: 'General' });
        } catch (error) {
            alert('Failed to create news');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/news/sync`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`Successfully synced ${res.data.count} articles!`);
            fetchNews();
        } catch (error) {
            alert('Failed to sync news');
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-heading font-bold">News Management</h1>
                <div className="flex gap-4">
                    <button 
                        onClick={handleSync}
                        disabled={syncing}
                        className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-foreground px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                        {syncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ExternalLink className="w-5 h-5" />}
                        Sync from Mumbai Today
                    </button>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="bg-taxi-yellow text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-400 transition-all shadow-lg shadow-taxi-yellow/20"
                    >
                        <Plus className="w-5 h-5" />
                        Add News Article
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-taxi-yellow" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm relative group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-taxi-yellow bg-taxi-yellow/10 px-2 py-1 rounded">
                                    {item.category}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold mb-2 line-clamp-2">{item.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">{item.description}</p>
                            <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                                <span className="text-xs font-medium text-gray-500">{item.source}</span>
                                <button className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative w-full max-w-lg bg-white dark:bg-asphalt-black rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-white/10 animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-heading font-bold mb-6">Create New Article</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5 opacity-60">Headline</label>
                                <input 
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-taxi-yellow/20 focus:border-taxi-yellow outline-none transition-all"
                                    placeholder="Enter news title..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 opacity-60">Source</label>
                                    <input 
                                        required
                                        value={formData.source}
                                        onChange={e => setFormData({...formData, source: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none"
                                        placeholder="e.g. Mumbai Mirror"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5 opacity-60">Category</label>
                                    <select 
                                        value={formData.category}
                                        onChange={e => setFormData({...formData, category: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none"
                                    >
                                        <option>General</option>
                                        <option>Traffic</option>
                                        <option>Events</option>
                                        <option>Weather</option>
                                        <option>Infrastructure</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5 opacity-60">Brief Description</label>
                                <textarea 
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none"
                                    placeholder="What's happening in Mumbai?"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    disabled={submitting}
                                    className="flex-1 bg-taxi-yellow text-black font-bold py-3 rounded-xl hover:bg-yellow-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Publish Article
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
