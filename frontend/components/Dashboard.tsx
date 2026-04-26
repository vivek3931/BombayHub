import React from 'react';
import { getWeather, getAQI } from '@/lib/api';
import { getMumbaiNews } from '@/lib/rss';
import { CloudRain, Sun, Wind, Newspaper, Activity, ArrowRight } from 'lucide-react';
import { NewsCard } from './NewsCard';
import Link from 'next/link';

export const Dashboard = async () => {
    const weather = await getWeather();
    const aqi = await getAQI();
    const news = await getMumbaiNews();

    // Helper to format temp
    const temp = weather ? weather.temp : '--';
    const humidity = weather ? weather.humidity : '--';
    const condition = weather ? weather.condition : 'Unknown';

    const aqiValue = aqi ? aqi.aqi : '--';
    const pm25 = aqi ? aqi.pm25 : '--';

    // Colors based on US AQI
    const getAQIColor = (val: number | string) => {
        if (val === '--') return 'text-gray-500';
        if (typeof val === 'number') {
            if (val <= 50) return 'text-green-400';
            if (val <= 100) return 'text-yellow-400';
            return 'text-red-500';
        }
        return 'text-gray-500';
    }

    return (
        <section className="relative z-20 py-20 px-6 max-w-7xl mx-auto">
            <h2 className="text-4xl font-heading mb-10 text-white border-b border-white/10 pb-4 inline-block">
                THE LIVE <span className="text-taxi-yellow">PULSE</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Weather Card - Spans 1 */}
                <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-taxi-yellow/50 transition-colors overflow-hidden self-start min-h-[220px]">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Sun className="w-24 h-24 text-taxi-yellow" />
                    </div>
                    <h3 className="text-sm font-medium text-white/60 mb-2 flex items-center gap-2">
                        <CloudRain className="w-4 h-4" /> CURRENT WEATHER
                    </h3>
                    <div className="mt-4">
                        <span className="text-6xl font-heading text-white">{temp}°C</span>
                        <p className="text-sm text-white/80 mt-1 flex gap-4">
                            <span>Humidity: {humidity}%</span>
                            <span>{condition}</span>
                        </p>
                    </div>
                </div>

                {/* AQI Card - Spans 1 */}
                <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-taxi-yellow/50 transition-colors self-start min-h-[220px]">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Wind className="w-24 h-24 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-medium text-white/60 mb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> AIR QUALITY
                    </h3>
                    <div className="mt-4">
                        <span className={`text-6xl font-heading ${getAQIColor(aqiValue)}`}>
                            AQI {aqiValue}
                        </span>
                        <p className="text-sm text-white/80 mt-1">
                            PM2.5: {pm25} µg/m³
                        </p>
                    </div>
                </div>

                {/* News Section - Spans 2 cols on desktop */}
                <div className="md:col-span-2 flex flex-col h-full">
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="text-sm font-medium text-white/60 flex items-center gap-2">
                            <Newspaper className="w-4 h-4" /> MUMBAI TODAY
                        </h3>
                        <Link href="/news" className="text-xs text-taxi-yellow hover:underline flex items-center gap-1">
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
                        {news.slice(0, 4).map((item, i) => (
                            <NewsCard key={i} item={item} compact={true} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
