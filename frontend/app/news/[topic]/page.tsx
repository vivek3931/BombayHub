import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getMumbaiNews } from '@/lib/rss';
import { NewsCard } from '@/components/NewsCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const TOPICS = ['All', 'Traffic', 'Weather', 'Civic', 'Politics', 'Crime'];

// Pre-generate standard topic paths
export function generateStaticParams() {
    return TOPICS.filter(t => t !== 'All').map(topic => ({
        topic: topic.toLowerCase()
    }));
}

export default async function TopicNewsPage({ params }: { params: Promise<{ topic: string }> }) {
    const { topic } = await params;

    // Validate topic simple check
    const normalizedTopic = TOPICS.find(t => t.toLowerCase() === topic.toLowerCase());
    if (!normalizedTopic) {
        // Allow it but just show empty or try to fetch dynamic? 
        // For strictness we could 404, but let's try to fetch dynamic.
    }

    const news = await getMumbaiNews(topic);

    return (
        <main className="min-h-screen bg-asphalt-black text-white selection:bg-taxi-yellow selection:text-asphalt-black">
            <Navbar />

            <section className="pt-32 pb-10 px-6 max-w-7xl mx-auto">
                <h1 className="text-6xl font-heading mb-4 text-white uppercase">{topic} <span className="text-taxi-yellow">NEWS</span></h1>
                <p className="text-white/60 max-w-2xl mb-10">Live updates for {topic} in Mumbai.</p>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-10 border-b border-white/10 pb-4">
                    {TOPICS.map(t => (
                        <Link
                            key={t}
                            href={t === 'All' ? '/news' : `/news/${t.toLowerCase()}`}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${t.toLowerCase() === topic.toLowerCase() ? 'bg-taxi-yellow text-asphalt-black' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}
                        >
                            {t}
                        </Link>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.length > 0 ? news.map((item, i) => (
                        <NewsCard key={i} item={item} />
                    )) : (
                        <div className="col-span-full text-center py-20 text-white/40">
                            No recent news found for {topic}.
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
