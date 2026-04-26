import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { Heart, Zap, Users, MapPin, Camera, Briefcase, Calendar, ArrowUpRight } from 'lucide-react';

const stats = [
    { value: '20+', label: 'Neighbourhoods Covered' },
    { value: '1000+', label: 'Places Listed' },
    { value: '500+', label: 'Jobs Posted' },
    { value: '10K+', label: 'Mumbaikars' },
];

const values = [
    {
        icon: Heart,
        title: 'Built with Love for Mumbai',
        description: 'Every feature, every pixel is crafted with the spirit of this city — chaotic, vibrant, and unstoppable.',
        color: 'from-red-500 to-pink-600',
    },
    {
        icon: Zap,
        title: 'Real-Time & Relevant',
        description: 'Live weather, trending spots, local jobs — we keep you plugged into the pulse of the Maximum City.',
        color: 'from-taxi-yellow to-yellow-600',
    },
    {
        icon: Users,
        title: 'Community First',
        description: 'BombayHub is shaped by Mumbaikars. Submit events, share photos, post jobs — this platform is yours.',
        color: 'from-blue-500 to-indigo-600',
    },
    {
        icon: MapPin,
        title: 'Hyperlocal Focus',
        description: 'From Colaba to Kandivali, we go deep into every neighbourhood — not just the tourist trail.',
        color: 'from-green-500 to-emerald-600',
    },
];

const team = [
    { name: 'Vivek Singh', role: 'Founder & Developer', emoji: '⚡', bio: 'A Mumbaikar who believed the city deserved a real digital home.' },
];

const features = [
    { icon: MapPin, label: 'Explorer', desc: 'Discover every corner of Mumbai', href: '/explorer' },
    { icon: Briefcase, label: 'Jobs', desc: 'Find & post career opportunities', href: '/jobs' },
    { icon: Camera, label: 'Photos', desc: 'Mumbai through your lens', href: '/photos' },
    { icon: Calendar, label: 'Events', desc: 'Hackathons, concerts & more', href: '/events' },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-taxi-yellow/10 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-taxi-yellow/10 border border-taxi-yellow/30 text-taxi-yellow text-xs font-bold uppercase tracking-widest mb-6">
                        Our Story
                    </span>
                    <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
                        We Are <span className="text-taxi-yellow">Bombay</span> Hub
                    </h1>
                    <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
                        A digital twin of the Maximum City — built for Mumbaikars, by a Mumbaikar.
                        Real-time pulse. Hyperlocal discovery. Community-driven culture.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="px-6 pb-20">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl p-6 text-center hover:border-taxi-yellow/50 transition-all">
                            <p className="text-4xl font-heading font-bold text-taxi-yellow mb-1">{stat.value}</p>
                            <p className="text-sm text-foreground/50">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission */}
            <section className="px-6 py-20 bg-gray-50 dark:bg-white/[0.02] border-y border-gray-200 dark:border-white/5">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Our Mission</h2>
                    <p className="text-foreground/60 text-lg leading-relaxed mb-6">
                        Mumbai doesn't sleep — and neither should its digital home. BombayHub exists to be the go-to
                        platform for everything happening in this city: jobs, culture, hidden gems, local talent, and
                        the everyday heartbeat of its 21 million residents.
                    </p>
                    <p className="text-foreground/60 text-lg leading-relaxed">
                        We believe a city as alive as Mumbai deserves a platform that's just as dynamic — one that
                        celebrates its neighbourhoods, amplifies its voices, and connects its people.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section className="px-6 py-20">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">What We Stand For</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {values.map((v) => (
                            <div key={v.title} className="bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl p-6 hover:border-taxi-yellow/30 transition-all group">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <v.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold mb-2 group-hover:text-taxi-yellow transition-colors">{v.title}</h3>
                                <p className="text-foreground/60 text-sm leading-relaxed">{v.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What We Offer */}
            <section className="px-6 py-20 bg-gray-50 dark:bg-white/[0.02] border-y border-gray-200 dark:border-white/5">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">Everything Mumbai in One Place</h2>
                    <p className="text-foreground/50 text-center mb-12 max-w-xl mx-auto">From job hunting to neighbourhood exploration — we've got you covered.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {features.map((f) => (
                            <Link
                                key={f.label}
                                href={f.href}
                                className="group bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl p-6 hover:border-taxi-yellow/50 hover:shadow-lg hover:shadow-taxi-yellow/5 transition-all"
                            >
                                <f.icon className="w-8 h-8 text-taxi-yellow mb-4" />
                                <h3 className="font-bold text-lg mb-1 group-hover:text-taxi-yellow transition-colors flex items-center gap-1">
                                    {f.label}
                                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </h3>
                                <p className="text-sm text-foreground/50">{f.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="px-6 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">The People Behind It</h2>
                    <p className="text-foreground/50 mb-12">A small team with a big love for this city.</p>
                    <div className="flex justify-center">
                        {team.map((member) => (
                            <div key={member.name} className="bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl p-8 max-w-sm hover:border-taxi-yellow/40 transition-all">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-taxi-yellow to-yellow-600 flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg shadow-taxi-yellow/20">
                                    {member.emoji}
                                </div>
                                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                <p className="text-taxi-yellow text-sm font-medium mb-3">{member.role}</p>
                                <p className="text-foreground/50 text-sm leading-relaxed">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 py-20 border-t border-gray-200 dark:border-white/5">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Join the Movement</h2>
                    <p className="text-foreground/50 mb-8">Help us make BombayHub the ultimate platform for the city we love.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/auth" className="bg-taxi-yellow text-black font-bold px-8 py-3 rounded-full hover:bg-yellow-400 transition-colors">
                            Get Started
                        </Link>
                        <Link href="/submit/event" className="bg-foreground/10 border border-foreground/20 text-foreground font-bold px-8 py-3 rounded-full hover:border-taxi-yellow/50 transition-colors">
                            Submit an Event
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
