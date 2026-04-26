"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Camera, Save, Edit2, Loader } from 'lucide-react';

export default function ProfilePage() {
    const { user, token, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);
    const [profileData, setProfileData] = useState<any>(null);
    const [photoUploading, setPhotoUploading] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth');
        } else if (isAuthenticated && token) {
            // Fetch fresh profile data
            fetch('http://localhost:4000/users/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    setProfileData(data);
                    setName(data.name || '');
                })
                .catch(console.error);
        }
    }, [isLoading, isAuthenticated, token, router]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const res = await fetch(`http://localhost:4000/users/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name }),
            });

            if (res.ok) {
                window.location.reload();
            } else {
                const errData = await res.json().catch(() => ({}));
                alert(errData?.message || 'Failed to update profile');
            }
        } catch (e: any) {
            console.error(e);
            alert(e.message || 'Error updating profile');
        } finally {
            setSaving(false);
            setIsEditing(false);
        }
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-24">
                    <div className="h-10 w-48 bg-gray-200 dark:bg-white/10 rounded mb-8 animate-pulse"></div>

                    <div className="max-w-3xl mx-auto bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse"></div>
                            <div className="flex-1 space-y-4 w-full text-center md:text-left">
                                <div className="h-8 bg-gray-200 dark:bg-white/10 rounded w-1/2 mx-auto md:mx-0 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-2/3 mx-auto md:mx-0 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/4 mx-auto md:mx-0 animate-pulse"></div>
                            </div>
                            <div className="w-32 h-10 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-black/10 dark:border-white/10 pt-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-black/5 dark:bg-white/5 rounded-xl p-4 flex flex-col items-center gap-2">
                                    <div className="h-8 w-12 bg-gray-200 dark:bg-white/10 rounded animate-pulse"></div>
                                    <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!user) return null;

    return (
        <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-24">
                <h1 className="text-3xl font-heading font-bold mb-8">My Profile</h1>

                <div className="max-w-3xl mx-auto bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-taxi-yellow to-yellow-600 flex items-center justify-center text-asphalt-black text-5xl font-bold shadow-2xl relative">
                                {profileData?.profileImage ? (
                                    <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user.name?.charAt(0).toUpperCase() || <User className="w-12 h-12" />
                                )}
                                {photoUploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Loader className="w-6 h-6 text-white animate-spin" />
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-2 bg-asphalt-black border border-white/20 rounded-full text-white hover:text-taxi-yellow transition-colors cursor-pointer">
                                <Camera className="w-4 h-4" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={photoUploading}
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setPhotoUploading(true);
                                        const formData = new FormData();
                                        formData.append('file', file);
                                        try {
                                            const res = await fetch(`http://localhost:4000/users/me/photo`, {
                                                method: 'POST',
                                                headers: { 'Authorization': `Bearer ${token}` },
                                                body: formData
                                            });
                                            if (res.ok) {
                                                const updatedUser = await res.json();
                                                setProfileData(updatedUser);
                                            } else {
                                                alert('Failed to upload profile photo');
                                            }
                                        } catch (error) {
                                            console.error(error);
                                            alert('Error uploading photo');
                                        } finally {
                                            setPhotoUploading(false);
                                        }
                                    }}
                                />
                            </label>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="bg-white/50 dark:bg-asphalt-black/50 border border-black/20 dark:border-white/20 rounded-lg px-4 py-2 text-foreground dark:text-white w-full max-w-sm focus:outline-none focus:border-taxi-yellow"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold mb-1 text-foreground">{user.name || 'Anonymous User'}</h2>
                                    <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2">
                                        <Mail className="w-4 h-4" /> {user.email}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 uppercase tracking-widest">{user.role}</p>
                                </>
                            )}
                        </div>

                        <div>
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setName(user.name || '');
                                        }}
                                        className="px-4 py-2 rounded-lg border border-black/20 dark:border-white/20 text-gray-500 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 rounded-lg bg-taxi-yellow text-black font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2"
                                        disabled={saving}
                                    >
                                        {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 rounded-lg border border-black/20 dark:border-white/20 text-taxi-yellow hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>


                    {/* Stats or other info could go here */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-black/10 dark:border-white/10 pt-8">
                        <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 text-center cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                            <span className="block text-2xl font-bold text-foreground dark:text-white">{profileData?._count?.jobs || 0}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Jobs Posted</span>
                        </div>
                        <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 text-center cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                            <span className="block text-2xl font-bold text-foreground dark:text-white">{profileData?._count?.photos || 0}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Photos Shared</span>
                        </div>
                        <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 text-center cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                            <span className="block text-2xl font-bold text-foreground dark:text-white">{profileData?._count?.places || 0}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Places Added</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
