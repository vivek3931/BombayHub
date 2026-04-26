'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface Place {
    id: string;
    name: string;
    category: string;
    location: string;
    status: string;
    isFeatured: boolean;
    createdAt: string;
    submitter: { name: string; email: string };
}

const SkeletonRows = () => (
    <>
        {[...Array(5)].map((_, i) => (
            <tr key={i} className="border-b border-gray-100 dark:border-gray-800/50">
                <td className="p-4"><div className="h-4 w-32 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                <td className="p-4"><div className="h-4 w-20 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                <td className="p-4"><div className="h-4 w-28 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                <td className="p-4"><div className="h-5 w-20 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                <td className="p-4"><div className="h-6 w-6 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                <td className="p-4"><div className="h-8 w-28 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
            </tr>
        ))}
    </>
);

export default function AdminPlacesPage() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const fetchedRef = useRef(false);
    const [filterMode, setFilterMode] = useState<'ALL' | 'PENDING'>('ALL');

    const fetchPlaces = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/places`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlaces(res.data);
        } catch (error) {
            console.error('Failed to fetch places', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token || fetchedRef.current) return;
        fetchedRef.current = true;
        fetchPlaces();
    }, [token]);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/places/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPlaces(places.map(p => p.id === id ? { ...p, status: newStatus } : p));
        } catch (error) {
            console.error('Failed to update place status', error);
            alert('Failed to update status');
        }
    };

    const toggleFeatured = async (id: string, currentFeatured: boolean) => {
        try {
            const place = places.find(p => p.id === id);
            if (!place) return;
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/places/${id}/status`,
                { status: place.status, isFeatured: !currentFeatured },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPlaces(places.map(p => p.id === id ? { ...p, isFeatured: !currentFeatured } : p));
        } catch (error) {
            console.error('Failed to feature place', error);
            alert('Failed to update feature status');
        }
    };

    const deletePlace = async (id: string) => {
        if (!confirm('Are you sure you want to delete this place?')) return;
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/places/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlaces(places.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to delete place', error);
            alert('Failed to delete place');
        }
    };

    const filteredPlaces = filterMode === 'PENDING' ? places.filter(p => p.status === 'PENDING') : places;

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold">Places Management</h1>
                <div className="flex gap-2">
                    <button className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterMode === 'ALL' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900 dark:bg-[#222] dark:text-gray-400 dark:hover:text-white'}`} onClick={() => setFilterMode('ALL')}>All Places</button>
                    <button className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterMode === 'PENDING' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900 dark:bg-[#222] dark:text-gray-400 dark:hover:text-white'}`} onClick={() => setFilterMode('PENDING')}>Pending</button>
                </div>
            </div>

            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl overflow-x-auto shadow-sm dark:shadow-none">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Place Name</th>
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Category</th>
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Submitter</th>
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Status</th>
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Featured</th>
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <SkeletonRows /> : filteredPlaces.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">No places found.</td></tr>
                        ) : filteredPlaces.map(place => (
                            <tr key={place.id} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">{place.name}</td>
                                <td className="p-4 text-gray-500 dark:text-gray-400 capitalize whitespace-nowrap">{place.category.replace('_', ' ')}</td>
                                <td className="p-4 text-sm whitespace-nowrap">
                                    {place.submitter ? (<><p className="text-gray-900 dark:text-white">{place.submitter.name}</p><p className="text-gray-500 text-xs">{place.submitter.email}</p></>) : <span className="text-gray-400 dark:text-gray-600 italic">System</span>}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${place.status === 'APPROVED' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-500' : place.status === 'REJECTED' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-500' : 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-500'}`}>
                                        {place.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button onClick={() => toggleFeatured(place.id, place.isFeatured)}
                                        className={`w-6 h-6 rounded flex items-center justify-center ${place.isFeatured ? 'bg-yellow-100 text-yellow-600 border border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-500 dark:border-yellow-500/50' : 'bg-gray-100 text-gray-400 border border-gray-200 hover:text-gray-600 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700 dark:hover:text-white transition'}`}
                                        title={place.isFeatured ? "Unfeature" : "Feature"}>★</button>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2 whitespace-nowrap">
                                        {place.status === 'PENDING' && (
                                            <>
                                                <button onClick={() => updateStatus(place.id, 'APPROVED')} className="px-3 py-1.5 rounded bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/20 dark:text-green-500 dark:hover:bg-green-500/30 transition text-sm">Approve</button>
                                                <button onClick={() => updateStatus(place.id, 'REJECTED')} className="px-3 py-1.5 rounded bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-500 dark:hover:bg-red-500/30 transition text-sm">Reject</button>
                                            </>
                                        )}
                                        {place.status === 'REJECTED' && <button onClick={() => updateStatus(place.id, 'PENDING')} className="px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white transition text-sm">Reset</button>}
                                        {place.status === 'APPROVED' && <button onClick={() => updateStatus(place.id, 'REJECTED')} className="px-3 py-1.5 rounded bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-500/20 dark:text-orange-500 dark:hover:bg-orange-500/30 transition text-sm">Revoke</button>}
                                        <button onClick={() => deletePlace(place.id)} className="px-3 py-1.5 rounded bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-700 dark:bg-gray-700/50 dark:hover:bg-red-600/40 dark:text-gray-300 dark:hover:text-white transition text-sm">Delete</button>
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
