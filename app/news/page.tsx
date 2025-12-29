import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getMumbaiNews } from '@/lib/rss';
import { NewsCard } from '@/components/NewsCard';
import Link from 'next/link';

const TOPICS = ['All', 'Traffic', 'Weather', 'Civic', 'Politics', 'Crime'];

export default async function NewsPage() {
    const news = await getMumbaiNews();

    return (
        <main className="min-h-screen bg-asphalt-black text-white selection:bg-taxi-yellow selection:text-asphalt-black">
            <Navbar />

            <section className="pt-32 pb-10 px-6 max-w-7xl mx-auto">
                <h1 className="text-6xl font-heading mb-4 text-white">MUMBAI <span className="text-taxi-yellow">NEWS</span></h1>
                <p className="text-white/60 max-w-2xl mb-10">Latest updates across the city, aggregated from trusted verified sources.</p>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-10 border-b border-white/10 pb-4">
                    {TOPICS.map(topic => (
                        <Link
                            key={topic}
                            href={topic === 'All' ? '/news' : `/news/${topic.toLowerCase()}`}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${topic === 'All' ? 'bg-taxi-yellow text-asphalt-black' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}
                        >
                            {topic}
                        </Link>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item, i) => (
                        <NewsCard key={i} item={item} />
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}
