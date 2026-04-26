'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/providers/AuthContext';
import { LayoutDashboard, Users, Briefcase, MapPin, Calendar, ImageIcon, Flag, ChevronLeft, ChevronRight, Menu, X, Globe } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            if (!user || user.role !== 'ADMIN') {
                router.replace('/');
            } else {
                setIsAuthorized(true);
            }
            setIsChecking(false);
        }
    }, [user, isLoading, router]);

    // Standard skeleton loader (same pattern as user-side pages)
    if (isLoading || isChecking || !isAuthorized) {
        return (
            <div className="flex bg-background min-h-screen">
                {/* Skeleton sidebar */}
                <div className="hidden md:flex flex-col w-64 bg-gray-50 dark:bg-[#111] border-r border-gray-200 dark:border-gray-800 p-4">
                    <div className="h-10 w-10 bg-white/10 rounded animate-pulse mb-6" />
                    <div className="space-y-3">
                        {[...Array(7)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="h-5 w-5 bg-gray-200 dark:bg-white/10 rounded animate-pulse flex-shrink-0" />
                                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Skeleton content */}
                <div className="flex-1 p-6 md:p-8">
                    <div className="h-8 w-48 bg-gray-200 dark:bg-white/10 rounded animate-pulse mb-6" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
                        ))}
                    </div>
                    <div className="h-64 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
                </div>
            </div>
        );
    }

    const menuItems = [
        { label: 'Dashboard', href: '/bombayhub-admin-portal-2026', icon: LayoutDashboard },
        { label: 'Users', href: '/bombayhub-admin-portal-2026/users', icon: Users },
        { label: 'Jobs', href: '/bombayhub-admin-portal-2026/jobs', icon: Briefcase },
        { label: 'News', href: '/bombayhub-admin-portal-2026/news', icon: Flag },
        { label: 'Places', href: '/bombayhub-admin-portal-2026/places', icon: MapPin },
        { label: 'Events', href: '/bombayhub-admin-portal-2026/events', icon: Calendar },
        { label: 'Photos', href: '/bombayhub-admin-portal-2026/photos', icon: ImageIcon },
        { label: 'Reports', href: '/bombayhub-admin-portal-2026/reports', icon: Flag },
    ];

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
            {/* Mobile Top Bar */}
            <div className="md:hidden sticky top-0 bg-gray-50 dark:bg-[#111] border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between z-50">
                <Image src="/bombayhub_logo.png" alt="BombayHub" width={32} height={32} className="rounded object-contain" />
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-foreground hover:text-taxi-yellow transition-colors"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`
                    fixed md:sticky top-0 h-screen bg-gray-50 dark:bg-[#111] border-r border-gray-200 dark:border-gray-800 flex flex-col z-40
                    transition-[width] duration-300 ease-in-out
                    ${collapsed ? 'md:w-[72px]' : 'md:w-64'}
                    ${mobileOpen ? 'w-64 left-0' : '-left-full md:left-0'}
                `}
            >
                {/* Logo + Toggle (Desktop) */}
                <div className="hidden md:flex items-center border-b border-gray-200 dark:border-gray-800 relative h-[60px] px-4">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                        <Image src="/bombayhub_logo.png" alt="Logo" width={32} height={32} className="rounded object-contain" />
                    </div>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-800 rounded-full p-1 hover:bg-taxi-yellow hover:text-black dark:hover:text-black transition-colors border border-gray-300 dark:border-gray-700 z-50 shadow-lg"
                    >
                        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden scrollbar-hide mt-14 md:mt-0">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center h-11 text-gray-600 dark:text-gray-400 hover:text-foreground hover:bg-gray-200 dark:hover:bg-white/10 transition-colors mx-2 rounded-lg"
                                title={collapsed ? item.label : undefined}
                            >
                                {/* Icon: always same width & position */}
                                <div className="w-[56px] flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-5 h-5" />
                                </div>
                                {/* Label */}
                                <span className={`whitespace-nowrap text-sm transition-opacity duration-200 ${collapsed ? 'md:opacity-0 md:pointer-events-none' : 'opacity-100'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}

                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                        <Link
                            href="/"
                            className="flex items-center h-11 text-taxi-yellow hover:bg-taxi-yellow/10 transition-colors mx-2 rounded-lg group"
                            title={collapsed ? 'Back to Main Site' : undefined}
                        >
                            <div className="w-[56px] flex items-center justify-center flex-shrink-0">
                                <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            </div>
                            <span className={`whitespace-nowrap text-sm font-bold transition-opacity duration-200 ${collapsed ? 'md:opacity-0 md:pointer-events-none' : 'opacity-100'}`}>
                                Main Site
                            </span>
                        </Link>
                    </div>
                </nav>

                {/* User Footer */}
                <div className="border-t border-gray-200 dark:border-gray-800 px-2 py-3">
                    <div className="flex items-center h-10">
                        <div className="w-[56px] flex items-center justify-center flex-shrink-0">
                            <div className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center font-bold text-white text-sm">
                                {user?.name?.[0]?.toUpperCase() || 'A'}
                            </div>
                        </div>
                        <div className={`overflow-hidden transition-opacity duration-200 ${collapsed ? 'md:opacity-0 md:pointer-events-none' : 'opacity-100'}`}>
                            <p className="font-semibold text-foreground text-sm truncate max-w-[140px]">{user?.name}</p>
                            <p className="text-gray-500 text-xs truncate max-w-[140px]">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 w-full p-4 md:p-8 min-w-0">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
