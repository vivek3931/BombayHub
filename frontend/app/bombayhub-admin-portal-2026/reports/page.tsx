'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface Report {
    id: string;
    reason: string;
    targetId: string;
    targetType: string;
    status: string;
    createdAt: string;
    reporter: { name: string; email: string };
}

const SkeletonRows = () => (
    <>
        {[...Array(5)].map((_, i) => (
            <tr key={i} className="border-b border-gray-100 dark:border-gray-800/50">
                <td className="p-4"><div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                <td className="p-4"><div className="h-5 w-16 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                <td className="p-4"><div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                <td className="p-4"><div className="h-4 w-40 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                <td className="p-4"><div className="h-4 w-20 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                <td className="p-4"><div className="h-5 w-16 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                <td className="p-4"><div className="h-8 w-16 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
            </tr>
        ))}
    </>
);

export default function AdminReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const fetchedRef = useRef(false);
    const [filterMode, setFilterMode] = useState<'ALL' | 'PENDING'>('PENDING');

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/reports`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReports(res.data);
        } catch (error) {
            console.error('Failed to fetch reports', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token || fetchedRef.current) return;
        fetchedRef.current = true;
        fetchReports();
    }, [token]);

    const resolveReport = async (id: string) => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/reports/${id}/resolve`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setReports(reports.map(r => r.id === id ? { ...r, status: 'RESOLVED' } : r));
        } catch (error) {
            console.error('Failed to resolve report', error);
            alert('Failed to resolve report');
        }
    };

    const filteredReports = filterMode === 'PENDING' ? reports.filter(r => r.status === 'PENDING') : reports;

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold">Reports & Complaints</h1>
                <div className="flex gap-2">
                    <button className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterMode === 'ALL' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900 dark:bg-[#222] dark:text-gray-400 dark:hover:text-white'}`} onClick={() => setFilterMode('ALL')}>All Reports</button>
                    <button className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterMode === 'PENDING' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900 dark:bg-[#222] dark:text-gray-400 dark:hover:text-white'}`} onClick={() => setFilterMode('PENDING')}>Pending Action</button>
                </div>
            </div>

            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl overflow-x-auto shadow-sm dark:shadow-none">
                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Reporter</th>
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Target Type</th>
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Target ID</th>
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Reason</th>
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Date</th>
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Status</th>
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <SkeletonRows /> : filteredReports.length === 0 ? (
                            <tr><td colSpan={7} className="p-8 text-center text-gray-500">No reports found.</td></tr>
                        ) : filteredReports.map(report => (
                            <tr key={report.id} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td className="p-4 text-sm whitespace-nowrap">
                                    <p className="text-gray-900 dark:text-white">{report.reporter.name}</p>
                                    <p className="text-gray-500 text-xs">{report.reporter.email}</p>
                                </td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-gray-100 dark:bg-[#222] rounded text-xs font-semibold text-gray-600 dark:text-gray-300">{report.targetType}</span>
                                </td>
                                <td className="p-4 text-sm text-gray-500 font-mono whitespace-nowrap">{report.targetId.substring(0, 12)}...</td>
                                <td className="p-4 max-w-[250px]">
                                    <p className="text-sm truncate text-gray-900 dark:text-gray-300" title={report.reason}>{report.reason}</p>
                                </td>
                                <td className="p-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{new Date(report.createdAt).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${report.status === 'RESOLVED' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-500' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-500'}`}>{report.status}</span>
                                </td>
                                <td className="p-4">
                                    {report.status === 'PENDING' && (
                                        <button onClick={() => resolveReport(report.id)} className="px-3 py-1.5 rounded bg-orange-600 hover:bg-orange-700 text-white transition text-xs whitespace-nowrap">Resolve</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 bg-gray-50 border border-gray-200 dark:bg-[#111]/50 dark:border-gray-800 rounded-xl p-4 md:p-6 text-sm text-gray-600 dark:text-gray-400 shadow-sm dark:shadow-none">
                <h4 className="font-semibold text-gray-900 dark:text-gray-300 mb-2">How to handle reports:</h4>
                <p>1. Copy the <b>Target ID</b> explicitly.</p>
                <p>2. Locate the target item in the respective management page.</p>
                <p>3. Review the item, delete or reject it if it violates guidelines.</p>
                <p>4. Return here to click <b>Resolve</b>.</p>
            </div>
        </div>
    );
}
