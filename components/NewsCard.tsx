import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { NewsItem } from '@/lib/rss';

interface NewsCardProps {
    item: NewsItem;
    compact?: boolean;
}

const CATEGORY_COLORS = {
    'Traffic': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Weather': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Civic': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Crime': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Politics': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'General': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export const NewsCard: React.FC<NewsCardProps> = ({ item, compact }) => {
    return (
        <div className="flex flex-col bg-white/5 border border-white/10 rounded-lg p-5 hover:border-taxi-yellow/50 transition-colors h-full">
            <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider border ${CATEGORY_COLORS[item.category] || CATEGORY_COLORS['General']}`}>
                    {item.category}
                </span>
                <span className="text-xs text-white/40">{item.pubDate}</span>
            </div>

            <h3 className={`font-heading text-white mb-2 ${compact ? 'text-lg leading-tight' : 'text-xl'}`}>
                {item.title}
            </h3>

            {!compact && (
                <p className="text-sm text-white/60 mb-4 line-clamp-2 flex-grow">
                    {item.snippet}
                </p>
            )}

            <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-xs text-white/50">
                <span className="font-medium text-taxi-yellow">{item.source}</span>
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                    Read <ExternalLink className="w-3 h-3" />
                </a>
            </div>
        </div>
    );
};
