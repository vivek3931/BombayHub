'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@/providers/AuthContext';

interface Event {
    id: string;
    title: string;
    category: string;
    date: string;
    status: string;
    isFeatured: boolean;
    isTrending: boolean;
    createdAt: string;
    submitter: { name: string; email: string };
}

const SkeletonRows = () => (
    <>
        {[...Array(5)].map((_, i) => (
            <tr key={i} className="border-b border-gray-100 dark:border-gray-800/50">
                <td className="p-4"><div className="h-4 w-32 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                <td className="p-4"><div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                <td className="p-4"><div className="h-4 w-28 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                <td className="p-4"><div className="h-5 w-20 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                <td className="p-4"><div className="h-6 w-24 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                <td className="p-4"><div className="h-8 w-28 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
            </tr>
        ))}
    </>
);

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const fetchedRef = useRef(false);
    const [filterMode, setFilterMode] = useState<'ALL' | 'PENDING'>('ALL');

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/events`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(res.data);
        } catch (error) {
            console.error('Failed to fetch events', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token || fetchedRef.current) return;
        fetchedRef.current = true;
        fetchEvents();
    }, [token]);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/events/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEvents(events.map(e => e.id === id ? { ...e, status: newStatus } : e));
        } catch (error) {
            console.error('Failed to update event status', error);
            alert('Failed to update status');
        }
    };

    const toggleToggleable = async (id: string, field: 'isFeatured' | 'isTrending', currentValue: boolean) => {
        try {
            const event = events.find(e => e.id === id);
            if (!event) return;
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/events/${id}/status`,
                { status: event.status, [field]: !currentValue },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEvents(events.map(e => e.id === id ? { ...e, [field]: !currentValue } : e));
        } catch (error) {
            console.error(`Failed to update ${field}`, error);
            alert(`Failed to update ${field}`);
        }
    };

    const deleteEvent = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/events/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(events.filter(e => e.id !== id));
        } catch (error) {
            console.error('Failed to delete event', error);
            alert('Failed to delete event');
        }
    };

    const filteredEvents = filterMode === 'PENDING' ? events.filter(e => e.status === 'PENDING') : events;

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold">Event Management</h1>
                <div className="flex gap-2">
                    <button className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterMode === 'ALL' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900 dark:bg-[#222] dark:text-gray-400 dark:hover:text-white'}`} onClick={() => setFilterMode('ALL')}>All Events</button>
                    <button className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterMode === 'PENDING' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900 dark:bg-[#222] dark:text-gray-400 dark:hover:text-white'}`} onClick={() => setFilterMode('PENDING')}>Pending</button>
                </div>
            </div>

            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl overflow-x-auto shadow-sm dark:shadow-none">
                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Event Title</th>
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Date & Category</th>
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Poster</th>
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Status</th>
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Tags</th>
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <SkeletonRows /> : filteredEvents.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">No events found.</td></tr>
                        ) : filteredEvents.map(evt => (
                            <tr key={evt.id} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">{evt.title}</td>
                                <td className="p-4 text-sm whitespace-nowrap">
                                    <p className="text-gray-900 dark:text-gray-300">{new Date(evt.date).toLocaleDateString()}</p>
                                    <p className="text-gray-500 text-xs capitalize">{evt.category.replace('_', ' ')}</p>
                                </td>
                                <td className="p-4 text-sm whitespace-nowrap">
                                    <p className="text-gray-900 dark:text-white">{evt.submitter.name}</p>
                                    <p className="text-gray-500 text-xs">{evt.submitter.email}</p>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${evt.status === 'APPROVED' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-500' : evt.status === 'REJECTED' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-500' : 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-500'}`}>
                                        {evt.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-1 whitespace-nowrap">
                                        <button onClick={() => toggleToggleable(evt.id, 'isFeatured', evt.isFeatured)}
                                            className={`px-2 py-1 text-xs rounded border transition ${evt.isFeatured ? 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-500 dark:border-yellow-500/50' : 'bg-transparent text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:hover:text-white'}`}>
                                            ★ Featured
                                        </button>
                                        <button onClick={() => toggleToggleable(evt.id, 'isTrending', evt.isTrending)}
                                            className={`px-2 py-1 text-xs rounded border transition ${evt.isTrending ? 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-500/20 dark:text-pink-500 dark:border-pink-500/50' : 'bg-transparent text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:hover:text-white'}`}>
                                            🔥 Trending
                                        </button>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2 whitespace-nowrap">
                                        {evt.status === 'PENDING' && (
                                            <>
                                                <button onClick={() => updateStatus(evt.id, 'APPROVED')} className="px-3 py-1.5 rounded bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/20 dark:text-green-500 dark:hover:bg-green-500/30 transition text-sm">Approve</button>
                                                <button onClick={() => updateStatus(evt.id, 'REJECTED')} className="px-3 py-1.5 rounded bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-500 dark:hover:bg-red-500/30 transition text-sm">Reject</button>
                                            </>
                                        )}
                                        {evt.status === 'REJECTED' && <button onClick={() => updateStatus(evt.id, 'PENDING')} className="px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white transition text-sm">Reset</button>}
                                        {evt.status === 'APPROVED' && <button onClick={() => updateStatus(evt.id, 'REJECTED')} className="px-3 py-1.5 rounded bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-500/20 dark:text-orange-500 dark:hover:bg-orange-500/30 transition text-sm">Revoke</button>}
                                        <button onClick={() => deleteEvent(evt.id)} className="px-3 py-1.5 rounded bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-700 dark:bg-gray-700/50 dark:hover:bg-red-600/40 dark:text-gray-300 dark:hover:text-white transition text-sm">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
