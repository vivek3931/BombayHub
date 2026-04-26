"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { getEvents } from '@/lib/api';
import { 
    Loader, Calendar, MapPin, Ticket, Clock, 
    LayoutGrid, Code2, Moon, Wrench, Music, 
    Users, Tent, Palette, Trophy, Laugh, Utensils,
    Plus
} from 'lucide-react';

const EVENT_CATEGORIES = [
    { value: 'all', label: 'All Events', icon: LayoutGrid },
    { value: 'hackathon', label: 'Hackathon', icon: Code2 },
    { value: 'night_show', label: 'Night Show', icon: Moon },
    { value: 'workshop', label: 'Workshop', icon: Wrench },
    { value: 'concert', label: 'Concert', icon: Music },
    { value: 'meetup', label: 'Meetup', icon: Users },
    { value: 'festival', label: 'Festival', icon: Tent },
    { value: 'exhibition', label: 'Exhibition', icon: Palette },
    { value: 'sports', label: 'Sports', icon: Trophy },
    { value: 'comedy_show', label: 'Comedy Show', icon: Laugh },
    { value: 'food_festival', label: 'Food Festival', icon: Utensils },
];

function getCategoryLabel(value: string) {
    return EVENT_CATEGORIES.find(c => c.value === value)?.label || value;
}

function getCategoryIcon(value: string) {
    return EVENT_CATEGORIES.find(c => c.value === value)?.icon || LayoutGrid;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
}

function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit'
    });
}

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        setLoading(true);
        getEvents(activeCategory)
            .then(data => {
                setEvents(data);
            })
            .catch(err => {
                console.error('Error fetching events:', err);
            })
            .finally(() => setLoading(false));
    }, [activeCategory]);

    return (
        <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-24">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-heading font-bold mb-2">
                            Mumbai Events
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Discover what's happening across the city — hackathons, shows, meetups & more
                        </p>
                    </div>
                    <Link
                        href="/submit/event"
                        className="bg-taxi-yellow text-black font-bold px-6 py-3 rounded-full hover:bg-yellow-400 transition-colors whitespace-nowrap flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Submit Event
                    </Link>
                </div>

                {/* Category Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                    {EVENT_CATEGORIES.map(cat => {
                        const Icon = cat.icon;
                        return (
                            <button
                                key={cat.value}
                                onClick={() => setActiveCategory(cat.value)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${activeCategory === cat.value
                                    ? 'bg-taxi-yellow text-black border-taxi-yellow shadow-lg shadow-taxi-yellow/20'
                                    : 'bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 text-foreground/70 hover:border-taxi-yellow/50 hover:text-taxi-yellow shadow-sm dark:shadow-none'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${activeCategory === cat.value ? 'text-black' : 'text-taxi-yellow'}`} />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col h-[350px]">
                                <div className="px-6 pt-5 pb-3 flex items-center justify-between">
                                    <div className="w-24 h-6 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse"></div>
                                    <div className="w-16 h-6 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse"></div>
                                </div>
                                <div className="px-6 flex-1 flex flex-col gap-4 mt-2">
                                    <div className="w-3/4 h-6 bg-gray-200 dark:bg-white/10 rounded animate-pulse"></div>
                                    <div className="w-full h-12 bg-gray-200 dark:bg-white/10 rounded animate-pulse"></div>

                                    <div className="space-y-3 mt-auto mb-4">
                                        <div className="w-1/2 h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse"></div>
                                        <div className="w-2/3 h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse"></div>
                                        <div className="w-1/3 h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse"></div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/5 flex gap-3">
                                        <div className="flex-1 h-10 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"></div>
                                        <div className="w-16 h-10 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-300 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-white/5">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <LayoutGrid className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Events Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                            {activeCategory === 'all'
                                ? "No events have been posted yet. Be the first to share what's happening in Mumbai!"
                                : `No ${getCategoryLabel(activeCategory)} events found. Try a different category or submit one!`}
                        </p>
                        <Link href="/submit/event" className="text-taxi-yellow hover:underline font-medium">
                            Submit an Event →
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="group bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl overflow-hidden hover:border-taxi-yellow/50 transition-all duration-300 hover:shadow-xl hover:shadow-taxi-yellow/5 flex flex-col"
                            >
                                {/* Category Badge */}
                                <div className="px-6 pt-5 pb-3 flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-taxi-yellow/10 text-taxi-yellow border border-taxi-yellow/20">
                                        {(() => {
                                            const Icon = getCategoryIcon(event.category);
                                            return <Icon className="w-3.5 h-3.5" />;
                                        })()}
                                        {getCategoryLabel(event.category)}
                                    </span>
                                    {event.entryFee && (
                                        <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                                            {event.entryFee === 'Free' ? '🆓 Free' : `₹${event.entryFee}`}
                                        </span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="px-6 pb-5 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-taxi-yellow transition-colors line-clamp-2">
                                        {event.title}
                                    </h3>
                                    <p className="text-sm text-foreground/60 dark:text-gray-400 line-clamp-2 mb-4">
                                        {event.description}
                                    </p>

                                    <div className="space-y-2 mt-auto">
                                        <div className="flex items-center gap-2 text-sm text-foreground/70 dark:text-gray-300">
                                            <Calendar className="w-4 h-4 text-taxi-yellow flex-shrink-0" />
                                            <span>{formatDate(event.date)}</span>
                                            <Clock className="w-3.5 h-3.5 text-taxi-yellow/60 ml-1" />
                                            <span className="text-foreground/50">{formatTime(event.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-foreground/70 dark:text-gray-300">
                                            <MapPin className="w-4 h-4 text-taxi-yellow flex-shrink-0" />
                                            <span className="line-clamp-1">{event.venue}{event.city ? `, ${event.city}` : ''}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-foreground/50">
                                            <span>by</span>
                                            <span className="font-medium text-foreground/70 dark:text-white/70">{event.organizer}</span>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex gap-3 mt-5 pt-4 border-t border-black/5 dark:border-white/5">
                                        {event.ticketLink && (
                                            <a
                                                href={event.ticketLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-2 bg-taxi-yellow text-black font-bold py-2.5 rounded-lg hover:bg-yellow-400 transition-colors text-sm"
                                            >
                                                <Ticket className="w-4 h-4" />
                                                Get Tickets
                                            </a>
                                        )}
                                        {event.tags && event.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {event.tags.slice(0, 3).map((tag: string, i: number) => (
                                                    <span key={i} className="px-2 py-0.5 bg-black/5 dark:bg-white/10 rounded text-xs text-foreground/50">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
