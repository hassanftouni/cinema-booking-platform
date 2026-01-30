'use client';

import { useState, useEffect } from 'react';
import { fetchAPI } from '../../../lib/api/client';
import { Plus, Trash2, MapPin, Monitor, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertModal, ConfirmModal } from '../../../components/ui/Modal';

interface Cinema {
    id: string;
    name: string;
    location: string;
    contact_email?: string;
    created_at: string;
}

interface Hall {
    id: string;
    name: string;
    capacity: number;
    cinema_id: string;
    cinema?: Cinema;
}

export default function CinemasPage() {
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [halls, setHalls] = useState<Hall[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal States
    const [showCinemaModal, setShowCinemaModal] = useState(false);
    const [showHallModal, setShowHallModal] = useState(false);

    // Alert Modal State
    const [alertState, setAlertState] = useState<{ isOpen: boolean; message: string; type: 'success' | 'error' | 'info' }>({
        isOpen: false,
        message: '',
        type: 'info'
    });

    // Confirm Modal State
    const [confirmState, setConfirmState] = useState<{ isOpen: boolean; message: string; title: string; onConfirm: () => void; type: 'danger' | 'warning' | 'info' }>({
        isOpen: false,
        message: '',
        title: '',
        onConfirm: () => { },
        type: 'warning'
    });

    // Form States
    const [cinemaForm, setCinemaForm] = useState({ name: '', location: '', contact_email: '' });
    const [hallForm, setHallForm] = useState({ cinema_id: '', name: '', rows: '10', cols: '15' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [cinemasData, hallsData] = await Promise.all([
                fetchAPI('/admin/cinemas'),
                fetchAPI('/admin/halls')
            ]);
            setCinemas(cinemasData);
            setHalls(hallsData);
        } catch (err: any) {
            setError(err.message || 'Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCinema = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetchAPI('/admin/cinemas', {
                method: 'POST',
                body: JSON.stringify(cinemaForm)
            });
            setShowCinemaModal(false);
            setCinemaForm({ name: '', location: '', contact_email: '' });
            loadData();
        } catch (err: any) {
            setAlertState({
                isOpen: true,
                message: err.message || 'Failed to create cinema',
                type: 'error'
            });
        }
    };

    const handleCreateHall = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetchAPI('/admin/halls', {
                method: 'POST',
                body: JSON.stringify(hallForm)
            });
            setShowHallModal(false);
            setHallForm({ cinema_id: '', name: '', rows: '10', cols: '15' });
            loadData();
        } catch (err: any) {
            setAlertState({
                isOpen: true,
                message: err.message || 'Failed to create hall',
                type: 'error'
            });
        }
    };

    const handleDeleteCinema = async (id: string) => {
        setConfirmState({
            isOpen: true,
            title: 'Delete Cinema',
            message: 'Are you sure? This will delete all halls and showtimes associated with this cinema!',
            type: 'danger',
            onConfirm: async () => {
                try {
                    await fetchAPI(`/admin/cinemas/${id}`, { method: 'DELETE' });
                    loadData();
                    setAlertState({
                        isOpen: true,
                        message: 'Cinema deleted successfully',
                        type: 'success'
                    });
                } catch (err: any) {
                    setAlertState({
                        isOpen: true,
                        message: err.message,
                        type: 'error'
                    });
                }
            }
        });
    };

    const handleDeleteHall = async (id: string) => {
        setConfirmState({
            isOpen: true,
            title: 'Delete Hall',
            message: 'Are you sure? This will delete all showtimes and bookings for this hall!',
            type: 'danger',
            onConfirm: async () => {
                try {
                    await fetchAPI(`/admin/halls/${id}`, { method: 'DELETE' });
                    loadData();
                    setAlertState({
                        isOpen: true,
                        message: 'Hall deleted successfully',
                        type: 'success'
                    });
                } catch (err: any) {
                    setAlertState({
                        isOpen: true,
                        message: err.message,
                        type: 'error'
                    });
                }
            }
        });
    };

    if (isLoading) return <div className="text-white p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/movies" className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white" title="Back to Movies">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-gold-500" title="Back to Site">
                    <Home className="w-6 h-6" />
                </Link>
                <h1 className="text-3xl font-bold font-serif text-gold-500">Cinemas & Halls Management</h1>
            </div>

            {error && <div className="bg-red-900/50 p-4 rounded mb-8 text-red-200">{error}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cinemas Section */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <MapPin className="text-gold-500" /> Cinemas
                        </h2>
                        <button
                            onClick={() => setShowCinemaModal(true)}
                            className="bg-gold-500 hover:bg-gold-400 text-black px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" /> Add Cinema
                        </button>
                    </div>

                    <div className="space-y-4">
                        {cinemas.length === 0 && <p className="text-gray-500 italic">No cinemas found.</p>}
                        {cinemas.map(cinema => (
                            <div key={cinema.id} className="bg-black/30 p-4 rounded-lg border border-white/5 flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{cinema.name}</h3>
                                    <p className="text-sm text-gray-400">{cinema.location}</p>
                                </div>
                                <button onClick={() => handleDeleteCinema(cinema.id)} className="text-red-500 hover:text-red-400">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Halls Section */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Monitor className="text-gold-500" /> Halls
                        </h2>
                        <button
                            onClick={() => {
                                if (cinemas.length === 0) {
                                    setAlertState({
                                        isOpen: true,
                                        message: 'Please create a cinema first.',
                                        type: 'info'
                                    });
                                    return;
                                }
                                setHallForm(prev => ({ ...prev, cinema_id: cinemas[0].id }));
                                setShowHallModal(true);
                            }}
                            className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 border border-white/10"
                        >
                            <Plus className="w-4 h-4" /> Add Hall
                        </button>
                    </div>

                    <div className="space-y-4">
                        {halls.length === 0 && <p className="text-gray-500 italic">No halls found.</p>}
                        {halls.map(hall => (
                            <div key={hall.id} className="bg-black/30 p-4 rounded-lg border border-white/5 flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{hall.name}</h3>
                                    <p className="text-sm text-gray-400">
                                        {hall.cinema?.name} • {hall.capacity} Seats
                                    </p>
                                </div>
                                <button onClick={() => handleDeleteHall(hall.id)} className="text-red-500 hover:text-red-400">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Create Cinema Modal */}
            {showCinemaModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-neutral-800 p-6 rounded-xl border border-white/10 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Add New Cinema</h3>
                        <form onSubmit={handleCreateCinema} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Name</label>
                                <input
                                    required
                                    value={cinemaForm.name}
                                    onChange={e => setCinemaForm({ ...cinemaForm, name: e.target.value })}
                                    className="w-full bg-black/50 border border-white/20 rounded p-2 focus:border-gold-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Location</label>
                                <input
                                    required
                                    value={cinemaForm.location}
                                    onChange={e => setCinemaForm({ ...cinemaForm, location: e.target.value })}
                                    className="w-full bg-black/50 border border-white/20 rounded p-2 focus:border-gold-500 outline-none"
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setShowCinemaModal(false)} className="px-4 py-2 hover:bg-white/5 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-gold-500 text-black font-bold rounded hover:bg-gold-400">Create</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Create Hall Modal */}
            {showHallModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-neutral-800 p-6 rounded-xl border border-white/10 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Add New Hall</h3>
                        <form onSubmit={handleCreateHall} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">In Cinema</label>
                                <select
                                    required
                                    value={hallForm.cinema_id}
                                    onChange={e => setHallForm({ ...hallForm, cinema_id: e.target.value })}
                                    className="w-full bg-black/50 border border-white/20 rounded p-2 focus:border-gold-500 outline-none"
                                >
                                    {cinemas.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Hall Name</label>
                                <input
                                    required
                                    value={hallForm.name}
                                    onChange={e => setHallForm({ ...hallForm, name: e.target.value })}
                                    placeholder="e.g. IMAX Hall 1"
                                    className="w-full bg-black/50 border border-white/20 rounded p-2 focus:border-gold-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Rows</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={hallForm.rows}
                                        onChange={e => setHallForm({ ...hallForm, rows: e.target.value })}
                                        className="w-full bg-black/50 border border-white/20 rounded p-2 focus:border-gold-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Cols / Seats per Row</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={hallForm.cols}
                                        onChange={e => setHallForm({ ...hallForm, cols: e.target.value })}
                                        className="w-full bg-black/50 border border-white/20 rounded p-2 focus:border-gold-500 outline-none"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">
                                This will auto-generate {parseInt(hallForm.rows) * parseInt(hallForm.cols)} seats.
                                You can customize them later (future feature).
                            </p>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setShowHallModal(false)} className="px-4 py-2 hover:bg-white/5 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-gold-500 text-black font-bold rounded hover:bg-gold-400">Create Hall</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
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
                type={confirmState.type}
                confirmText="Confirm"
            />
        </div>
    );
}
