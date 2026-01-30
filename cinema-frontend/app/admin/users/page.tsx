'use client';

import { useState, useEffect } from 'react';
import { fetchAPI } from '../../../lib/api/client';
import { motion } from 'framer-motion';
import { Trash, User, ArrowLeft, Mail, Calendar, Home, Shield, ShieldOff, Check, X, Edit2 } from 'lucide-react';
import Link from 'next/link';

import { AlertModal, ConfirmModal } from '../../../components/ui/Modal';

interface UserData {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    created_at: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ name: '', email: '' });

    const [alertState, setAlertState] = useState<{ isOpen: boolean; message: string; type: 'success' | 'error' | 'info' }>({
        isOpen: false,
        message: '',
        type: 'info'
    });

    const [confirmState, setConfirmState] = useState<{ isOpen: boolean; message: string; title: string; onConfirm: () => void }>({
        isOpen: false,
        message: '',
        title: '',
        onConfirm: () => { }
    });

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await fetchAPI('/admin/users');
                setUsers(data.data || []);
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    const handleToggleAdmin = async (user: UserData) => {
        // Prevent demoting self (assuming user email can be checked)
        const currentUserStr = localStorage.getItem('user');
        if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            if (currentUser.id === user.id && user.is_admin) {
                setAlertState({
                    isOpen: true,
                    message: "You cannot demote yourself!",
                    type: 'error'
                });
                return;
            }
        }

        try {
            const updated = await fetchAPI(`/admin/users/${user.id}`, {
                method: 'PUT',
                body: JSON.stringify({ is_admin: !user.is_admin })
            });
            setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
        } catch (error) {
            console.error("Failed to update role", error);
        }
    };

    const startEditing = (user: UserData) => {
        setEditingId(user.id);
        setEditForm({ name: user.name, email: user.email });
    };

    const handleUpdateUser = async (id: number) => {
        try {
            const updated = await fetchAPI(`/admin/users/${id}`, {
                method: 'PUT',
                body: JSON.stringify(editForm)
            });
            setUsers(prev => prev.map(u => u.id === id ? updated : u));
            setEditingId(null);
        } catch (error) {
            console.error("Failed to update user", error);
            setAlertState({
                isOpen: true,
                message: "Failed to update user. Check if email is already taken.",
                type: 'error'
            });
        }
    };

    const handleDelete = async (id: number) => {
        setConfirmState({
            isOpen: true,
            title: 'Delete User',
            message: 'Are you sure you want to delete this user? This action cannot be undone.',
            onConfirm: async () => {
                try {
                    await fetchAPI(`/admin/users/${id}`, { method: 'DELETE' });
                    setUsers(prev => prev.filter(u => u.id !== id));
                    setAlertState({
                        isOpen: true,
                        message: "User deleted successfully",
                        type: 'success'
                    });
                } catch (error) {
                    console.error("Failed to delete user", error);
                    setAlertState({
                        isOpen: true,
                        message: 'Failed to delete user',
                        type: 'error'
                    });
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 gap-6 md:gap-0">
                    <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
                        <Link href="/admin/movies" className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Back to Movies">
                            <ArrowLeft className="w-6 h-6 text-gray-400" />
                        </Link>
                        <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-gold-500" title="Back to Site">
                            <Home className="w-6 h-6" />
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-bold font-serif text-gold-500">User Management</h1>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">Loading...</div>
                ) : (
                    <div className="space-y-4">
                        {users.map((user) => (
                            <motion.div
                                key={user.id}
                                layout
                                className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between hover:bg-white/10 transition-colors gap-6"
                            >
                                <div className="flex flex-col md:flex-row items-center gap-6 flex-1 text-center md:text-left">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                                        {user.is_admin ? <Shield className="w-6 h-6 text-gold-500" /> : <User className="w-6 h-6 text-gray-400" />}
                                    </div>

                                    {editingId === user.id ? (
                                        <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
                                            <input
                                                value={editForm.name}
                                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                className="bg-black/30 border border-white/10 rounded px-3 py-1 text-sm outline-none focus:border-gold-500 w-full"
                                                placeholder="Name"
                                            />
                                            <input
                                                value={editForm.email}
                                                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                                className="bg-black/30 border border-white/10 rounded px-3 py-1 text-sm outline-none focus:border-gold-500 w-full"
                                                placeholder="Email"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full">
                                            <h3 className="text-lg font-bold text-white mb-2 md:mb-1 flex flex-col md:flex-row items-center gap-2 justify-center md:justify-start">
                                                {user.name}
                                                {user.is_admin && <span className="text-[10px] bg-gold-600/20 text-gold-500 px-2 py-0.5 rounded-full uppercase tracking-tighter border border-gold-500/20">Admin</span>}
                                            </h3>
                                            <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-sm text-gray-400 items-center md:items-start">
                                                <div className="flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {user.email}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    Joined {new Date(user.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {editingId === user.id ? (
                                        <>
                                            <button
                                                onClick={() => handleUpdateUser(user.id)}
                                                className="p-2 bg-green-900/20 hover:bg-green-900/40 rounded-lg text-green-500 transition-colors border border-green-500/20"
                                            >
                                                <Check className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors border border-white/10"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleToggleAdmin(user)}
                                                className={`p-2 rounded-lg transition-colors border flex items-center gap-2 text-sm font-medium ${user.is_admin ? 'bg-orange-900/20 text-orange-400 border-orange-500/20 hover:bg-orange-900/40' : 'bg-gold-900/10 text-gold-500 border-gold-500/10 hover:bg-gold-900/20'}`}
                                            >
                                                {user.is_admin ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                                                {user.is_admin ? 'Demote' : 'Make Admin'}
                                            </button>
                                            <button
                                                onClick={() => startEditing(user)}
                                                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-blue-400 transition-colors border border-white/10"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 bg-red-900/20 hover:bg-red-900/40 rounded-lg text-red-500 transition-colors border border-red-500/20"
                                            >
                                                <Trash className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
            {/* Global Modals */}
            <AlertModal
                isOpen={alertState.isOpen}
                onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
                message={alertState.message}
                type={alertState.type}
            />

            <ConfirmModal
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmState.onConfirm}
                title={confirmState.title}
                message={confirmState.message}
                type="danger"
                confirmText="Delete User"
            />
        </div>
    );
}
