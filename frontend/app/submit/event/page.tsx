"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/providers/AuthContext';
import { createEvent } from '@/lib/api';
import { 
    ArrowLeft, Sparkles, Code2, Moon, Wrench, 
    Music, Users, Tent, Palette, Trophy, 
    Laugh, Utensils 
} from 'lucide-react';

// ─── Event categories with their icon, label, and dynamic extra fields ───
const EVENT_TYPES = [
    {
        value: 'hackathon', label: 'Hackathon', icon: Code2,
        color: 'from-blue-500 to-cyan-500',
        extraFields: [
            { name: 'teamSize', label: 'Team Size', type: 'text', placeholder: 'e.g. 2-4 members' },
            { name: 'prizes', label: 'Prizes', type: 'text', placeholder: 'e.g. ₹50,000 cash prize' },
            { name: 'themes', label: 'Themes / Tracks', type: 'text', placeholder: 'e.g. AI, Web3, HealthTech' },
            { name: 'registrationDeadline', label: 'Registration Deadline', type: 'datetime-local', placeholder: '' },
        ],
    },
    {
        value: 'night_show', label: 'Night Show', icon: Moon,
        color: 'from-purple-500 to-pink-500',
        extraFields: [
            { name: 'genre', label: 'Genre', type: 'text', placeholder: 'e.g. EDM, Bollywood, Hip-Hop' },
            { name: 'performers', label: 'Performers / DJs', type: 'text', placeholder: 'e.g. DJ Snake, Nucleya' },
            { name: 'ageRestriction', label: 'Age Restriction', type: 'text', placeholder: 'e.g. 18+ only' },
            { name: 'dressCode', label: 'Dress Code', type: 'text', placeholder: 'e.g. Smart Casual' },
        ],
    },
    {
        value: 'workshop', label: 'Workshop', icon: Wrench,
        color: 'from-green-500 to-emerald-500',
        extraFields: [
            { name: 'skillLevel', label: 'Skill Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'] },
            { name: 'maxParticipants', label: 'Max Participants', type: 'number', placeholder: 'e.g. 30' },
            { name: 'materialsProvided', label: 'Materials Provided', type: 'text', placeholder: 'e.g. Laptop required, materials included' },
            { name: 'instructor', label: 'Instructor', type: 'text', placeholder: 'Instructor name' },
        ],
    },
    {
        value: 'concert', label: 'Concert', icon: Music,
        color: 'from-red-500 to-orange-500',
        extraFields: [
            { name: 'artists', label: 'Artists / Bands', type: 'text', placeholder: 'e.g. Arijit Singh, Prateek Kuhad' },
            { name: 'genre', label: 'Music Genre', type: 'text', placeholder: 'e.g. Indie, Bollywood, Rock' },
            { name: 'ageRestriction', label: 'Age Restriction', type: 'text', placeholder: 'e.g. All ages' },
            { name: 'vipAvailable', label: 'VIP Available', type: 'select', options: ['Yes', 'No'] },
        ],
    },
    {
        value: 'meetup', label: 'Meetup', icon: Users,
        color: 'from-yellow-500 to-amber-500',
        extraFields: [
            { name: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g. AI/ML, Startup Networking' },
            { name: 'speakerName', label: 'Speaker(s)', type: 'text', placeholder: 'Speaker names' },
            { name: 'isRecurring', label: 'Recurring Event?', type: 'select', options: ['Yes', 'No'] },
        ],
    },
    {
        value: 'festival', label: 'Festival', icon: Tent,
        color: 'from-pink-500 to-rose-500',
        extraFields: [
            { name: 'duration', label: 'Duration (days)', type: 'number', placeholder: 'e.g. 3' },
            { name: 'highlights', label: 'Highlights', type: 'text', placeholder: 'e.g. Live music, food stalls, art installations' },
            { name: 'foodAvailable', label: 'Food Available?', type: 'select', options: ['Yes', 'No'] },
        ],
    },
    {
        value: 'exhibition', label: 'Exhibition', icon: Palette,
        color: 'from-indigo-500 to-violet-500',
        extraFields: [
            { name: 'artForm', label: 'Art Form', type: 'text', placeholder: 'e.g. Photography, Painting, Sculpture' },
            { name: 'curator', label: 'Curator', type: 'text', placeholder: 'Curator name' },
            { name: 'featured_artists', label: 'Featured Artists', type: 'text', placeholder: 'e.g. Artist 1, Artist 2' },
        ],
    },
    {
        value: 'sports', label: 'Sports', icon: Trophy,
        color: 'from-teal-500 to-cyan-500',
        extraFields: [
            { name: 'sportType', label: 'Sport', type: 'text', placeholder: 'e.g. Cricket, Football, Marathon' },
            { name: 'teams', label: 'Teams / Participants', type: 'text', placeholder: 'e.g. Mumbai Indians vs CSK' },
            { name: 'registrationOpen', label: 'Registration Open?', type: 'select', options: ['Yes', 'No'] },
        ],
    },
    {
        value: 'comedy_show', label: 'Comedy Show', icon: Laugh,
        color: 'from-amber-500 to-yellow-600',
        extraFields: [
            { name: 'comedian', label: 'Comedian(s)', type: 'text', placeholder: 'e.g. Zakir Khan, Biswa' },
            { name: 'comedyStyle', label: 'Style', type: 'text', placeholder: 'e.g. Stand-up, Improv, Sketch' },
            { name: 'ageRestriction', label: 'Age Restriction', type: 'text', placeholder: 'e.g. 16+' },
        ],
    },
    {
        value: 'food_festival', label: 'Food Festival', icon: Utensils,
        color: 'from-orange-500 to-red-500',
        extraFields: [
            { name: 'cuisines', label: 'Cuisines', type: 'text', placeholder: 'e.g. Street Food, Thai, Italian' },
            { name: 'numberOfStalls', label: 'Number of Stalls', type: 'number', placeholder: 'e.g. 50' },
            { name: 'liveMusic', label: 'Live Music?', type: 'select', options: ['Yes', 'No'] },
        ],
    },
];

// ─── Input styling constants ───
const inputClass = "w-full bg-background/50 border border-foreground/10 rounded-lg p-3 text-foreground placeholder:text-foreground/40 focus:border-taxi-yellow focus:ring-1 focus:ring-taxi-yellow/30 outline-none transition-all";
const labelClass = "block text-sm font-medium text-foreground/60 mb-2";

export default function SubmitEvent() {
    const { token, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    // Step 1: Pick event type, Step 2: Fill form
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [formData, setFormData] = useState<Record<string, any>>({
        title: '',
        description: '',
        date: '',
        endDate: '',
        venue: '',
        address: '',
        city: 'Mumbai',
        imageUrl: '',
        ticketLink: '',
        entryFee: '',
        organizer: '',
        tags: '',
    });
    const [extraData, setExtraData] = useState<Record<string, any>>({});
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
                <Navbar />
                <div className="container mx-auto px-6 py-24 max-w-3xl">
                    <div className="h-10 w-48 bg-gray-200 dark:bg-white/10 rounded mb-3 animate-pulse"></div>
                    <div className="h-4 w-64 bg-gray-200 dark:bg-white/10 rounded mb-10 animate-pulse"></div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-foreground/10 bg-foreground/5">
                                <div className="w-14 h-14 rounded-xl bg-gray-200 dark:bg-white/10 animate-pulse"></div>
                                <div className="h-4 w-20 bg-gray-200 dark:bg-white/10 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }
    if (!isAuthenticated) {
        router.push('/auth');
        return null;
    }

    const activeType = EVENT_TYPES.find(t => t.value === selectedType);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const payload = {
                ...formData,
                category: selectedType,
                tags: formData.tags ? formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
                extraData: Object.keys(extraData).length > 0 ? extraData : undefined,
            };
            await createEvent(payload, token!);
            router.push('/events');
        } catch (err: any) {
            setError(err.message || 'Failed to submit event. Please check all fields and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const setField = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));
    const setExtra = (key: string, value: any) => setExtraData(prev => ({ ...prev, [key]: value }));

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="container mx-auto px-6 py-24 max-w-3xl">

                {/* ─── Step 1: Category Picker ─── */}
                {!selectedType ? (
                    <div>
                        <h1 className="text-3xl font-heading font-bold mb-3">Submit an Event</h1>
                        <p className="text-foreground/60 mb-10">Choose the type of event you want to share with Mumbai</p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {EVENT_TYPES.map(type => {
                                const Icon = type.icon;
                                return (
                                    <button
                                        key={type.value}
                                        onClick={() => setSelectedType(type.value)}
                                        className="group relative flex flex-col items-center gap-3 p-6 rounded-2xl border border-foreground/10 bg-foreground/5 hover:border-taxi-yellow/50 hover:bg-foreground/10 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-taxi-yellow/5"
                                    >
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <span className="font-semibold text-sm text-center text-foreground/80 group-hover:text-taxi-yellow transition-colors">
                                            {type.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* ─── Step 2: Dynamic Form ─── */
                    <div>
                        <button
                            onClick={() => {
                                setSelectedType(null);
                                setExtraData({});
                            }}
                            className="flex items-center gap-2 text-foreground/60 hover:text-taxi-yellow transition-colors mb-6"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Change event type
                        </button>

                        <div className="flex items-center gap-3 mb-8">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activeType?.color} flex items-center justify-center text-white shadow-lg`}>
                                {(() => {
                                    const Icon = activeType?.icon || Sparkles;
                                    return <Icon className="w-6 h-6" />;
                                })()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-heading font-bold">Submit {activeType?.label}</h1>
                                <p className="text-foreground/50 text-sm">Fill in the details below</p>
                            </div>
                        </div>

                        {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-6 border border-red-500/20">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-6 bg-foreground/5 p-8 rounded-2xl border border-foreground/10 backdrop-blur-sm">

                            {/* ── Common Fields ── */}
                            <div className="space-y-5">
                                <h3 className="text-sm font-bold text-taxi-yellow uppercase tracking-wider flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> Event Details
                                </h3>

                                <div>
                                    <label className={labelClass}>Event Title *</label>
                                    <input type="text" required className={inputClass} placeholder="Give your event a catchy name"
                                        value={formData.title} onChange={e => setField('title', e.target.value)} />
                                </div>

                                <div>
                                    <label className={labelClass}>Description *</label>
                                    <textarea required rows={4} className={inputClass} placeholder="Tell people what to expect..."
                                        value={formData.description} onChange={e => setField('description', e.target.value)} />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Start Date & Time *</label>
                                        <input type="datetime-local" required className={inputClass}
                                            value={formData.date} onChange={e => setField('date', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>End Date & Time</label>
                                        <input type="datetime-local" className={inputClass}
                                            value={formData.endDate} onChange={e => setField('endDate', e.target.value)} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Venue *</label>
                                        <input type="text" required className={inputClass} placeholder="e.g. NCPA, Bandra Fort"
                                            value={formData.venue} onChange={e => setField('venue', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Address</label>
                                        <input type="text" className={inputClass} placeholder="Full address"
                                            value={formData.address} onChange={e => setField('address', e.target.value)} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Organizer *</label>
                                        <input type="text" required className={inputClass} placeholder="Organizing body / person"
                                            value={formData.organizer} onChange={e => setField('organizer', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>City</label>
                                        <input type="text" className={inputClass}
                                            value={formData.city} onChange={e => setField('city', e.target.value)} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Entry Fee</label>
                                        <input type="text" className={inputClass} placeholder="e.g. Free, ₹500, ₹1000-2000"
                                            value={formData.entryFee} onChange={e => setField('entryFee', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Ticket / Registration Link</label>
                                        <input type="url" className={inputClass} placeholder="https://..."
                                            value={formData.ticketLink} onChange={e => setField('ticketLink', e.target.value)} />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>Image URL</label>
                                    <input type="url" className={inputClass} placeholder="Link to event poster or banner"
                                        value={formData.imageUrl} onChange={e => setField('imageUrl', e.target.value)} />
                                </div>

                                <div>
                                    <label className={labelClass}>Tags</label>
                                    <input type="text" className={inputClass} placeholder="Comma-separated, e.g. tech, free, outdoor"
                                        value={formData.tags} onChange={e => setField('tags', e.target.value)} />
                                </div>
                            </div>

                            {/* ── Dynamic Extra Fields ── */}
                            {activeType && activeType.extraFields.length > 0 && (
                                <div className="space-y-5 pt-4 border-t border-foreground/10">
                                    <h3 className="text-sm font-bold text-taxi-yellow uppercase tracking-wider flex items-center gap-2">
                                        {(() => {
                                            const Icon = activeType.icon || Sparkles;
                                            return <Icon className="w-4 h-4" />;
                                        })()}
                                        {activeType.label} Details
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {activeType.extraFields.map(field => (
                                            <div key={field.name}>
                                                <label className={labelClass}>{field.label}</label>
                                                {field.type === 'select' ? (
                                                    <select
                                                        className={inputClass}
                                                        value={extraData[field.name] || ''}
                                                        onChange={e => setExtra(field.name, e.target.value)}
                                                    >
                                                        <option value="">Select...</option>
                                                        {field.options?.map(opt => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type={field.type}
                                                        className={inputClass}
                                                        placeholder={field.placeholder}
                                                        value={extraData[field.name] || ''}
                                                        onChange={e => setExtra(field.name, e.target.value)}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-taxi-yellow text-black font-bold py-3.5 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                            >
                                {submitting ? 'Submitting...' : `Submit ${activeType?.label}`}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}
