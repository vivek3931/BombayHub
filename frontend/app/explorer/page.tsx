"use client";
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { CITY_REGIONS } from '@/constants/cityData';
import { motion } from 'framer-motion';

export default function ExplorerPage() {
    return (
        <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Navbar />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <header className="mb-20 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-heading font-bold mb-6"
                    >
                        Explore the City
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-stone-400 font-serif italic max-w-2xl mx-auto"
                    >
                        "Bombay is not a city, it is an emotion. Choose a region to start your journey."
                    </motion.p>
                </header>

                <div className="grid md:grid-cols-2 gap-4">
                    {Object.values(CITY_REGIONS).map((region, idx) => (
                        <Link href={`/explorer/${region.slug}`} key={region.slug}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative h-[400px] overflow-hidden rounded-sm cursor-pointer"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] group-hover:scale-110"
                                    style={{ backgroundImage: `url(${region.heroImage})` }}
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                                <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/90 to-transparent">
                                    <h2 className="text-3xl font-heading font-bold mb-2 group-hover:translate-x-2 transition-transform">{region.name}</h2>
                                    <p className="text-stone-300 font-serif italic opacity-80 group-hover:opacity-100 transition-opacity">
                                        {region.tagline}
                                    </p>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>

            <Footer />
        </main>
    );
}
