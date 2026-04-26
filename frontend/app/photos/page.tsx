"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { getPhotos } from '@/lib/api';
import { useAuth } from '@/providers/AuthContext';
import Image from 'next/image';
import { Loader, X, Share2, Download, Lock } from 'lucide-react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';


export default function PhotosPage() {
    const [photos, setPhotos] = useState<any[]>([]);
    const [filteredPhotos, setFilteredPhotos] = useState<any[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    // Filters
    const [tagFilter, setTagFilter] = useState('All');
    const [locationFilter, setLocationFilter] = useState('All');


    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth');
        }
    }, [isLoading, isAuthenticated, router]);



    useEffect(() => {
        // Only fetch if authenticated to avoid unnecessary calls if we are redirecting
        if (isAuthenticated) {
            getPhotos().then(data => {
                setPhotos(data);
                setFilteredPhotos(data);
                // Extract unique tags
                const allTags = Array.from(new Set(data.flatMap((photo: any) => photo.tags || []))) as string[];
                setTags(allTags);
            }).catch(console.error);
        }
    }, [isAuthenticated]);

    // Apply filters
    useEffect(() => {
        let result = photos;
        if (tagFilter !== 'All') {
            result = result.filter(photo => photo.tags?.includes(tagFilter));
        }
        if (locationFilter !== 'All') {
            result = result.filter(photo => photo.location?.toLowerCase().includes(locationFilter.toLowerCase()));
        }
        setFilteredPhotos(result);
    }, [tagFilter, locationFilter, photos]);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-24">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                        <div>
                            <div className="h-10 bg-gray-200 dark:bg-white/10 rounded w-64 mb-4 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-48 animate-pulse"></div>
                        </div>
                        <div className="w-32 h-12 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse"></div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-8">
                        <div className="w-32 h-10 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"></div>
                        <div className="w-48 h-10 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"></div>
                    </div>

                    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className={`relative break-inside-avoid mb-4 md:mb-6 rounded-xl bg-gray-200 dark:bg-white/10 animate-pulse ${['aspect-square', 'aspect-[4/5]', 'aspect-[3/4]', 'aspect-[2/3]', 'aspect-[4/3]'][i % 5]}`}>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (!isAuthenticated) return null; // Avoid flash of content before redirect

    return (
        <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-heading font-bold mb-2">Mumbai Gallery</h1>
                        <p className="text-gray-500 dark:text-gray-400">The city through your lens</p>
                    </div>
                    <Link href="/submit/photo" className="bg-taxi-yellow text-black font-bold px-6 py-3 rounded-full hover:bg-yellow-400 transition-colors">
                        Upload Photo
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <select
                        value={tagFilter}
                        onChange={(e) => setTagFilter(e.target.value)}
                        className="bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-taxi-yellow shadow-sm dark:shadow-none"
                    >
                        <option value="All" className="bg-background text-foreground">All Tags</option>
                        {tags.map(tag => (
                            <option key={tag} value={tag} className="bg-background text-foreground">{tag}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Filter by Location..."
                        value={locationFilter === 'All' ? '' : locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value || 'All')}
                        className="bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-taxi-yellow shadow-sm dark:shadow-none"
                    />
                </div>

                {filteredPhotos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-300 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-white/5">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 text-4xl">
                            📷
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Photos Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                            {photos.length === 0
                                ? "We couldn't find any photos at the moment. Be the first to upload one!"
                                : "No photos match your current filters. Try adjusting them."}
                        </p>
                        {photos.length === 0 && (
                            <Link href="/submit/photo" className="text-taxi-yellow hover:underline">
                                Upload a Photo Now
                            </Link>
                        )}
                    </div>
                ) : (
                    <PhotoProvider
                        speed={() => 300}
                        maskOpacity={0.9}
                        bannerVisible={false}
                        onVisibleChange={(visible) => {
                            if (visible) {
                                window.lenis?.stop();
                            } else {
                                window.lenis?.start();
                            }
                        }}
                        overlayRender={({ index, onClose }) => {
                            const photo = filteredPhotos[index];
                            if (!photo) return null;
                            return (
                                <>
                                    <button
                                        onClick={onClose}
                                        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-[101] pointer-events-auto"
                                    >
                                        <X size={24} />
                                    </button>

                                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent text-white pointer-events-none z-50 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 overflow-hidden">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <h2 className="text-2xl font-bold font-heading truncate pb-1">{photo.title}</h2>
                                            {photo.location && <p className="text-white/70 mt-1 truncate">{photo.location}</p>}
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {photo.tags?.map((tag: string) => (
                                                    <span key={tag} className="px-2 py-1 bg-white/10 text-white/80 rounded-full text-xs">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-3 md:mt-0 w-full md:w-auto shrink-0 pointer-events-auto">
                                            <button
                                                onClick={() => {
                                                    if (navigator.share) {
                                                        navigator.share({
                                                            title: photo.title,
                                                            url: photo.url,
                                                        }).catch(console.error);
                                                    } else {
                                                        navigator.clipboard.writeText(photo.url);
                                                        alert('Link copied to clipboard!');
                                                    }
                                                }}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors font-medium"
                                            >
                                                <Share2 size={18} />
                                                <span>Share</span>
                                            </button>

                                            {isAuthenticated ? (
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            const response = await fetch(photo.url);
                                                            const blob = await response.blob();
                                                            const url = window.URL.createObjectURL(blob);
                                                            const a = document.createElement('a');
                                                            a.href = url;
                                                            a.download = `${photo.title.replace(/\s+/g, '-').toLowerCase()}-bombayhub.jpg`;
                                                            document.body.appendChild(a);
                                                            a.click();
                                                            window.URL.revokeObjectURL(url);
                                                            document.body.removeChild(a);
                                                        } catch (error) {
                                                            console.error('Error downloading image', error);
                                                            window.open(photo.url, '_blank');
                                                        }
                                                    }}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-taxi-yellow text-black hover:bg-yellow-400 rounded-full transition-colors font-bold"
                                                >
                                                    <Download size={18} />
                                                    <span>Download</span>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        alert('Please sign in to download photos.');
                                                        router.push('/auth');
                                                    }}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white/50 cursor-pointer hover:bg-white/10 rounded-full font-medium transition-colors"
                                                    title="Sign in to download"
                                                >
                                                    <Lock size={18} />
                                                    <span>Download</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            );
                        }}
                    >
                        <div className="columns-2 md:columns-3 lg:columns-4 gap-2 md:gap-6 space-y-2 md:space-y-6">
                            {filteredPhotos.map((photo, i) => (
                                <PhotoView key={photo.id} src={photo.url}>
                                    <div
                                        className="relative group break-inside-avoid overflow-hidden rounded-lg md:rounded-xl bg-gray-100 dark:bg-white/5 cursor-pointer isolate ring-1 ring-black/5 dark:ring-white/5 hover:ring-taxi-yellow/50 transition-all duration-300 shadow-sm"
                                    >
                                        <div className={`relative w-full ${[
                                            'aspect-square', 
                                            'aspect-[4/5]', 
                                            'aspect-[3/4]', 
                                            'aspect-[2/3]', 
                                            'aspect-[4/3]'
                                        ][i % 5]}`}>
                                            <Image
                                                src={photo.url}
                                                alt={photo.title}
                                                fill
                                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            {/* Gradient Overlay - Always visible on mobile, hover on desktop */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3 md:p-5">
                                                <h3 className="text-[10px] md:text-lg font-bold text-white uppercase tracking-tight md:tracking-normal leading-tight mb-0.5 md:mb-1 translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-transform duration-500">
                                                    {photo.title}
                                                </h3>
                                                {photo.location && (
                                                    <p className="text-[8px] md:text-xs text-taxi-yellow font-bold uppercase tracking-wider translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-transform duration-500 md:delay-75 mb-1 md:mb-2">
                                                        {photo.location}
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap gap-1 mt-1 hidden md:flex translate-y-2 md:group-hover:translate-y-0 transition-transform duration-500 md:delay-100">
                                                    {photo.tags?.slice(0, 3).map((tag: string) => (
                                                        <span key={tag} className="text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 bg-white/10 backdrop-blur-md rounded-full text-white/90">#{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </PhotoView>
                            ))}
                        </div>
                    </PhotoProvider>
                )}
            </div>

        </main>
    );
}
