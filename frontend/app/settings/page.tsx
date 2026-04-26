"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/providers/AuthContext';
import { User, Bell, Moon, Sun, Shield, Info, ChevronRight, LogOut, Loader } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
    const { isAuthenticated, isLoading, logout } = useAuth();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 py-24">
                    <div className="h-10 w-48 bg-gray-200 dark:bg-white/10 rounded mb-8 animate-pulse"></div>

                    <div className="max-w-2xl mx-auto space-y-8">
                        {[1, 2].map((section) => (
                            <div key={section} className="bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden">
                                <div className="px-6 py-4 bg-black/5 dark:bg-white/5">
                                    <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded animate-pulse"></div>
                                </div>
                                <div className="divide-y divide-black/10 dark:divide-white/10">
                                    <div className="flex items-center justify-between px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-white/10 animate-pulse"></div>
                                            <div className="h-5 w-32 bg-gray-200 dark:bg-white/10 rounded animate-pulse"></div>
                                        </div>
                                        <div className="w-4 h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-24">
                <h1 className="text-3xl font-heading font-bold mb-8">Settings</h1>

                <div className="max-w-2xl mx-auto space-y-8">

                    {/* Account Section */}
                    <div className="bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden">
                        <h3 className="px-6 py-4 bg-black/5 dark:bg-white/5 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Account
                        </h3>
                        <div className="divide-y divide-black/10 dark:divide-white/10">
                            <Link
                                href="/profile"
                                className="flex items-center justify-between px-6 py-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-blue-500/10">
                                        <User className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <span className="font-medium">Profile Information</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Link>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div className="bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden">
                        <h3 className="px-6 py-4 bg-black/5 dark:bg-white/5 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Preferences
                        </h3>
                        <div className="divide-y divide-black/10 dark:divide-white/10">
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="w-full flex items-center justify-between px-6 py-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-purple-500/10">
                                        {mounted && theme === 'dark' ? (
                                            <Moon className="w-5 h-5 text-purple-500" />
                                        ) : (
                                            <Sun className="w-5 h-5 text-orange-500" />
                                        )}
                                    </div>
                                    <span className="font-medium">Theme</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-400">
                                    <span className="text-sm capitalize">{mounted ? theme : 'System'}</span>
                                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full bg-red-500/10 border border-red-500/20 text-red-500 font-bold py-4 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-5 h-5" />
                        Log Out
                    </button>

                    <p className="text-center text-gray-500 text-sm pt-4">
                        Bombay Hub v1.0.0
                    </p>
                </div>
            </div>
        </main>
    );
}
