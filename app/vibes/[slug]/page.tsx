import { VIBES } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';

export function generateStaticParams() {
    return VIBES.map((vibe) => ({
        slug: vibe.id,
    }));
}

export default async function VibePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const vibe = VIBES.find((v) => v.id === slug);

    if (!vibe) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-asphalt-black text-white selection:bg-taxi-yellow selection:text-asphalt-black">
            <Navbar />

            {/* Hero Header */}
            <section className="relative h-[70vh] w-full overflow-hidden">
                <Image
                    src={vibe.src}
                    alt={vibe.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-asphalt-black via-asphalt-black/50 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-20">
                    <div className="max-w-5xl mx-auto">
                        <Link href="/#vibes" className="inline-flex items-center gap-2 text-taxi-yellow hover:text-white transition-colors mb-6 uppercase tracking-widest text-sm font-bold">
                            <ArrowLeft className="w-4 h-4" /> Back to Grid
                        </Link>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {vibe.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs uppercase tracking-wider text-white border border-white/20">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-6xl md:text-8xl font-heading text-white mb-4 leading-none">
                            {vibe.title}
                        </h1>
                        <p className="flex items-center gap-2 text-white/70 font-mono text-sm max-w-xl">
                            <MapPin className="w-4 h-4 text-taxi-yellow" />
                            {vibe.location}
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="relative z-10 -mt-20 pb-20 px-6 md:px-20">
                <div className="max-w-4xl mx-auto bg-asphalt-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-16 shadow-2xl">
                    <div
                        className="prose prose-lg prose-invert text-white/80 font-light leading-relaxed first-letter:text-5xl first-letter:font-heading first-letter:text-taxi-yellow first-letter:mr-3 first-letter:float-left"
                        dangerouslySetInnerHTML={{ __html: vibe.longContent }}
                    />
                </div>
            </section>

            <Footer />
        </main>
    );
}
