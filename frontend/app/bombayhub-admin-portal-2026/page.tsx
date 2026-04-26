'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface DashboardStats {
    totalUsers: number;
    totalJobs: number;
    totalPlaces: number;
    totalEvents: number;
    totalPhotos: number;
    pendingReports: number;
    totalPendingApprovals: number;
}

// Module-level cache to prevent refetch on tab switch
let cachedStats: DashboardStats | null = null;

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(cachedStats);
    const [loading, setLoading] = useState(!cachedStats);
    const { token } = useAuth();
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (!token || fetchedRef.current) return;
        fetchedRef.current = true;

        const fetchStats = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                cachedStats = response.data;
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        // If we have cached data, show it immediately but still refresh in background
        if (cachedStats) {
            setLoading(false);
            fetchStats(); // silent background refresh
        } else {
            fetchStats();
        }
    }, [token]);

    if (loading || !stats) {
        return (
            <div className="animate-pulse">
                <div className="h-8 w-48 bg-gray-200 dark:bg-white/10 rounded mb-6" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="rounded-xl bg-gray-100 dark:bg-white/5 h-[72px]" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-100 dark:bg-white/5 rounded-xl h-64 lg:col-span-2" />
                    <div className="bg-gray-100 dark:bg-white/5 rounded-xl h-64" />
                </div>
                <div className="bg-gray-100 dark:bg-white/5 rounded-xl h-20" />
            </div>
        );
    }

    const statCards = [
        { label: "Total Users", value: stats.totalUsers, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Total Jobs", value: stats.totalJobs, color: "text-green-500", bg: "bg-green-500/10" },
        { label: "Total Places", value: stats.totalPlaces, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Total Events", value: stats.totalEvents, color: "text-pink-500", bg: "bg-pink-500/10" },
        { label: "Total Photos", value: stats.totalPhotos, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        { label: "Pending Approvals", value: stats.totalPendingApprovals, color: "text-orange-500", bg: "bg-orange-500/10", border: 'border border-orange-500/50' },
        { label: "Pending Reports", value: stats.pendingReports, color: "text-red-500", bg: "bg-red-500/10", border: 'border border-red-500/50' },
    ];

    const barData = [
        { name: 'Users', count: stats.totalUsers },
        { name: 'Jobs', count: stats.totalJobs },
        { name: 'Places', count: stats.totalPlaces },
        { name: 'Events', count: stats.totalEvents },
        { name: 'Photos', count: stats.totalPhotos },
    ];

    const pieData = [
        { name: 'Pending Approvals', value: stats.totalPendingApprovals },
        { name: 'Pending Reports', value: stats.pendingReports },
    ];
    const COLORS = ['#f97316', '#ef4444'];
    const hasPendingTasks = stats.totalPendingApprovals > 0 || stats.pendingReports > 0;

    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Admin Dashboard</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-3 mb-6">
                {statCards.map((card, idx) => (
                    <div key={idx} className={`rounded-xl p-3 md:p-4 flex flex-col items-start justify-center ${card.bg} ${card.border || ''}`}>
                        <p className={`text-xl md:text-2xl font-bold mb-0.5 ${card.color}`}>{card.value}</p>
                        <p className="text-gray-400 text-[10px] md:text-xs font-medium uppercase tracking-wider leading-tight">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl p-4 md:p-6 lg:col-span-2 overflow-hidden shadow-sm dark:shadow-none">
                    <h2 className="text-lg md:text-xl font-bold mb-4 text-foreground">Platform Content Overview</h2>
                    <div className="w-full" style={{ height: '250px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: '#ffffff10' }} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px', fontSize: '12px' }} />
                                <Bar dataKey="count" fill="#eab308" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl p-4 md:p-6 overflow-hidden shadow-sm dark:shadow-none">
                    <h2 className="text-lg md:text-xl font-bold mb-1 text-foreground">Pending Action</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">Tasks needing admin review.</p>
                    <div className="w-full" style={{ height: '220px' }}>
                        {hasPendingTasks ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="45%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px', fontSize: '12px' }} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="w-14 h-14 bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center text-2xl mb-3">🎉</div>
                                <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">All caught up!</p>
                                <p className="text-gray-500 text-xs mt-1">No pending approvals or reports.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl p-4 md:p-6 shadow-sm dark:shadow-none">
                <h2 className="text-lg md:text-xl font-bold mb-3">Quick Actions</h2>
                <div className="flex gap-3 flex-wrap">
                    {stats.totalPendingApprovals > 0 && (
                        <a href="/bombayhub-admin-portal-2026/jobs" className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm transition-colors">Review Pending Content</a>
                    )}
                    {stats.pendingReports > 0 && (
                        <a href="/bombayhub-admin-portal-2026/reports" className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors">Review User Reports</a>
                    )}
                    {!hasPendingTasks && <p className="text-gray-400 text-sm">Nothing urgent needing your attention right now.</p>}
                </div>
            </div>
        </div>
    );
}
