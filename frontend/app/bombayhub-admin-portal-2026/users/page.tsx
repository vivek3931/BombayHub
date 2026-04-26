'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isBlocked: boolean;
    createdAt: string;
}

const SkeletonRows = () => (
    <>
        {[...Array(6)].map((_, i) => (
            <tr key={i} className="border-b border-gray-100 dark:border-gray-800/50">
                <td className="p-4"><div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                <td className="p-4"><div className="h-4 w-40 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                <td className="p-4"><div className="h-5 w-16 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                <td className="p-4"><div className="h-4 w-20 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                <td className="p-4"><div className="h-5 w-16 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
                <td className="p-4"><div className="h-8 w-24 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
            </tr>
        ))}
    </>
);

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const fetchedRef = useRef(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token || fetchedRef.current) return;
        fetchedRef.current = true;
        fetchUsers();
    }, [token]);

    const toggleBlockStatus = async (id: string, currentStatus: boolean) => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}/block`,
                { isBlocked: !currentStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(users.map(u => u.id === id ? { ...u, isBlocked: !currentStatus } : u));
        } catch (error) {
            console.error('Failed to update block status', error);
            alert('Failed to update user block status');
        }
    };

    const deleteUser = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u.id !== id));
        } catch (error) {
            console.error('Failed to delete user', error);
            alert('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold">User Management</h1>
                <input
                    type="text"
                    placeholder="Search users..."
                    className="bg-white dark:bg-[#222] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 w-full sm:w-64 focus:outline-none focus:border-orange-500 text-gray-900 dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl overflow-x-auto shadow-sm dark:shadow-none">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Name</th>
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Email</th>
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Role</th>
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Joined</th>
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Status</th>
                            <th className="p-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <SkeletonRows /> : filteredUsers.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">No users found.</td></tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="p-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{user.name || 'N/A'}</td>
                                    <td className="p-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-500' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-500'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.isBlocked ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-500' : 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-500'}`}>
                                            {user.isBlocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2 whitespace-nowrap">
                                            <button
                                                onClick={() => toggleBlockStatus(user.id, user.isBlocked)}
                                                className={`px-3 py-1.5 rounded transition text-sm ${user.isBlocked ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-600/20 dark:text-green-500 dark:hover:bg-green-600/30' : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-600/20 dark:text-red-500 dark:hover:bg-red-600/30'}`}
                                            >
                                                {user.isBlocked ? 'Unblock' : 'Block'}
                                            </button>
                                            {user.role !== 'ADMIN' && (
                                                <button
                                                    onClick={() => deleteUser(user.id)}
                                                    className="px-3 py-1.5 rounded bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-700 dark:bg-gray-700/50 dark:hover:bg-red-600/40 dark:text-gray-300 dark:hover:text-white transition text-sm"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
