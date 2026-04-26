"use client";
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getAllNews } from '@/lib/api';

const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
};

export default function NewsPage() {
    const [newsList, setNewsList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllNews()
            .then(data => setNewsList(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Navbar />
            <div className="pt-24 px-6 max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-heading font-bold mb-8 text-taxi-yellow">THE MUMBAI MINUTE</h1>
                <p className="text-xl text-foreground/70 mb-12 max-w-2xl">
                    Latest updates, traffic alerts, and community stories from across the 7 islands.
                </p>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-black/5 dark:bg-white/5 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : newsList.length === 0 ? (
                    <div className="py-20 text-center border border-dashed border-foreground/10 rounded-xl">
                        <p className="text-foreground/50 italic">No news stories available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {newsList.map((news) => (
                            <div key={news.id} className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-6 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors group">
                                <span className="text-xs font-bold text-taxi-yellow uppercase tracking-widest mb-2 block">{news.category}</span>
                                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-taxi-yellow transition-colors">{news.title}</h3>
                                <p className="text-foreground/60 text-sm mb-4 line-clamp-3">{news.description}</p>
                                <div className="flex justify-between items-center text-foreground/40 text-xs">
                                    <span>{news.source}</span>
                                    <span>{formatTimeAgo(news.createdAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="mt-20">
                <Footer />
            </div>
        </main>
    );
}
