'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface Photo {
    id: string;
    title: string;
    url: string;
    status: string;
    isBlurred: boolean;
    createdAt: string;
    photographer: { name: string; email: string };
}

const PhotoSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden animate-pulse shadow-sm dark:shadow-none">
                <div className="aspect-square bg-gray-200 dark:bg-white/5" />
                <div className="p-4 space-y-2">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded" />
                    <div className="h-3 w-20 bg-gray-200 dark:bg-white/10 rounded" />
                    <div className="flex gap-2 mt-3">
                        <div className="h-7 flex-1 bg-gray-200 dark:bg-white/10 rounded" />
                        <div className="h-7 w-10 bg-gray-200 dark:bg-white/10 rounded" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default function AdminPhotosPage() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const fetchedRef = useRef(false);
    const [filterMode, setFilterMode] = useState<'ALL' | 'PENDING'>('ALL');

    const fetchPhotos = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/photos`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPhotos(res.data);
        } catch (error) {
            console.error('Failed to fetch photos', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token || fetchedRef.current) return;
        fetchedRef.current = true;
        fetchPhotos();
    }, [token]);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/photos/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPhotos(photos.map(p => p.id === id ? { ...p, status: newStatus } : p));
        } catch (error) {
            console.error('Failed to update photo status', error);
            alert('Failed to update status');
        }
    };

    const toggleBlur = async (id: string, currentBlurred: boolean) => {
        try {
            const photo = photos.find(p => p.id === id);
            if (!photo) return;
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/photos/${id}/status`,
                { status: photo.status, isBlurred: !currentBlurred },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPhotos(photos.map(p => p.id === id ? { ...p, isBlurred: !currentBlurred } : p));
        } catch (error) {
            console.error('Failed to toggle blur', error);
            alert('Failed to toggle photo blur');
        }
    };

    const deletePhoto = async (id: string) => {
        if (!confirm('Are you sure you want to delete this photo entirely?')) return;
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/photos/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPhotos(photos.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to delete photo', error);
            alert('Failed to delete photo');
        }
    };

    const filteredPhotos = filterMode === 'PENDING' ? photos.filter(p => p.status === 'PENDING') : photos;

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold">Photo Moderation</h1>
                <div className="flex gap-2">
                    <button className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterMode === 'ALL' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900 dark:bg-[#222] dark:text-gray-400 dark:hover:text-white'}`} onClick={() => setFilterMode('ALL')}>All Photos</button>
                    <button className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterMode === 'PENDING' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900 dark:bg-[#222] dark:text-gray-400 dark:hover:text-white'}`} onClick={() => setFilterMode('PENDING')}>Pending</button>
                </div>
            </div>

            {loading ? <PhotoSkeleton /> : filteredPhotos.length === 0 ? (
                <div className="p-12 text-center text-gray-500 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm dark:shadow-none">No photos found.</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredPhotos.map(photo => (
                        <div key={photo.id} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex flex-col shadow-sm dark:shadow-none">
                            <div className="relative aspect-square">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={photo.url}
                                    alt={photo.title}
                                    className={`w-full h-full object-cover transition-all ${photo.isBlurred ? 'blur-md hover:blur-none' : ''}`}
                                />
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded shadow-lg backdrop-blur bg-black/50 ${photo.status === 'APPROVED' ? 'text-green-500' : photo.status === 'REJECTED' ? 'text-red-500' : 'text-orange-500'}`}>
                                        {photo.status}
                                    </span>
                                    {photo.isBlurred && (
                                        <span className="px-2 py-1 text-[10px] font-bold uppercase rounded shadow-lg backdrop-blur bg-black/50 text-blue-400">NSFW</span>
                                    )}
                                </div>
                            </div>
                            <div className="p-3 flex-1 flex flex-col">
                                <h3 className="font-semibold text-sm line-clamp-1 text-gray-900 dark:text-white" title={photo.title}>{photo.title}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">By {photo.photographer.name}</p>
                                <div className="mt-auto pt-3 flex flex-wrap gap-2">
                                    <button onClick={() => toggleBlur(photo.id, photo.isBlurred)}
                                        className={`flex-1 py-1.5 rounded text-xs transition ${photo.isBlurred ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#222] dark:text-gray-400 dark:hover:text-white'}`}>
                                        {photo.isBlurred ? 'Unblur' : 'Blur'}
                                    </button>
                                    <button onClick={() => deletePhoto(photo.id)} className="px-3 py-1.5 rounded bg-red-50 hover:bg-red-100 text-red-600 dark:bg-[#222] dark:hover:bg-red-600/40 dark:text-red-500 transition text-xs">Del</button>
                                </div>
                                <div className="mt-2 flex gap-2">
                                    {photo.status !== 'APPROVED' && (
                                        <button onClick={() => updateStatus(photo.id, 'APPROVED')} className="flex-1 py-1.5 rounded bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/20 dark:text-green-500 dark:hover:bg-green-500/30 transition text-xs font-semibold">Approve</button>
                                    )}
                                    {photo.status !== 'REJECTED' && (
                                        <button onClick={() => updateStatus(photo.id, 'REJECTED')} className="flex-1 py-1.5 rounded bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-500 dark:hover:bg-red-500/30 transition text-xs font-semibold">Reject</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
