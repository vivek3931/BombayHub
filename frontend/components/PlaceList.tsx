
"use client";
import Link from 'next/link';

interface PlaceListProps {
    places: any[];
    isLoading?: boolean;
}

export const PlaceList = ({ places, isLoading }: PlaceListProps) => {
    if (isLoading) {
        return <div className="text-white/50 text-center py-10">Loading places...</div>;
    }

    if (!places || places.length === 0) {
        return <div className="text-white/50 text-center py-10">No places found matching your search.</div>;
    }

    return (
        <div className="flex flex-col gap-4 pb-20">
            {places.map((item, idx) => (
                <div key={item.id || idx} className="bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-xl flex gap-4 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-800">
                        <img
                            src={item.images?.[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24'}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-white truncate pr-2">{item.name}</h3>
                            <span className="text-taxi-yellow text-xs font-bold leading-6">★ {item.rating}</span>
                        </div>
                        <p className="text-white/60 text-xs mb-2 truncate">{item.location}</p>
                        <p className="text-white/40 text-xs line-clamp-2">{item.description}</p>
                        <div className="mt-2 flex gap-2">
                            <span className="px-2 py-0.5 bg-white/10 text-[10px] rounded-full text-white/70 uppercase tracking-wider">{item.category}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
