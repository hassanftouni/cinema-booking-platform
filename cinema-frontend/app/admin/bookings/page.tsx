'use client';

import { useState, useEffect } from 'react';
import { fetchAPI } from '../../../lib/api/client';
import { Trash2, User, Film, Calendar, MapPin, DollarSign, Home } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertModal, ConfirmModal } from '../../../components/ui/Modal';

interface Booking {
    id: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    showtime: {
        id: string;
        start_time: string;
        movie: {
            id: string;
            title: string;
            poster_url: string;
        };
    };
    tickets: Array<{
        id: string;
        seat: {
            id: string;
            row: string;
            number: number;
        };
        price: number;
    }>;
    total_price: number;
    status: string;
    created_at: string;
}

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [alertModal, setAlertModal] = useState({ isOpen: false, message: '', type: 'info' as 'success' | 'error' | 'info' });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, bookingId: '' });

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const data = await fetchAPI('/admin/bookings');
            setBookings(data.data || []);
        } catch (error) {
            console.error('Failed to load bookings', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setConfirmModal({ isOpen: true, bookingId: id });
    };

    const confirmDelete = async () => {
        const id = confirmModal.bookingId;
        try {
            await fetchAPI(`/admin/bookings/${id}`, { method: 'DELETE' });
            setBookings(prev => prev.filter(b => b.id !== id));
            setAlertModal({ isOpen: true, message: 'Booking cancelled successfully!', type: 'success' });
        } catch (error: any) {
            console.error('Failed to cancel booking', error);
            const errorMessage = error?.body?.message || 'Failed to cancel booking';
            setAlertModal({ isOpen: true, message: errorMessage, type: 'error' });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-900 text-white p-8 flex justify-center items-center">
                <div className="text-xl">Loading bookings...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-gold-500" title="Back to Site">
                            <Home className="w-6 h-6" />
                        </Link>
                        <h1 className="text-2xl md:text-4xl font-bold font-serif text-gold-500">Manage Bookings</h1>
                    </div>
                    <div className="text-sm text-gray-400">
                        Total Bookings: <span className="text-white font-bold">{bookings.length}</span>
                    </div>
                </div>

                {bookings.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No bookings found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking, index) => (
                            <motion.div
                                key={booking.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 hover:bg-white/10 transition-all"
                            >
                                <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                                    {/* Movie Poster */}
                                    <img
                                        src={booking.showtime.movie.poster_url}
                                        alt={booking.showtime.movie.title}
                                        className="w-20 h-28 md:w-24 md:h-36 object-cover rounded-lg mx-auto md:mx-0"
                                    />

                                    {/* Booking Details */}
                                    <div className="flex-1 space-y-3 w-full">
                                        <div className="flex flex-col md:flex-row items-start justify-between gap-3">
                                            <div className="w-full md:w-auto">
                                                <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                                                    {booking.showtime.movie.title}
                                                </h3>
                                                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-sm text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4" />
                                                        <span>{booking.user.name}</span>
                                                    </div>
                                                    <span className="hidden md:inline text-gray-600">•</span>
                                                    <span className="ml-6 md:ml-0">{booking.user.email}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(booking.id)}
                                                className="p-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all self-end md:self-start"
                                                title="Cancel Booking"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-gold-500 flex-shrink-0" />
                                                <span className="text-gray-300">
                                                    {new Date(booking.showtime.start_time).toLocaleString()}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0" />
                                                <span className="text-gray-300 truncate">
                                                    Seats: {booking.tickets.map(t => `${t.seat.row}${t.seat.number}`).join(', ')}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm">
                                                <DollarSign className="w-4 h-4 text-gold-500 flex-shrink-0" />
                                                <span className="text-white font-bold">
                                                    ${Number(booking.total_price || 0).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${booking.status === 'confirmed'
                                                ? 'bg-green-600/20 text-green-400'
                                                : 'bg-gray-600/20 text-gray-400'
                                                }`}>
                                                {booking.status}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Booked: {new Date(booking.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
                message={alertModal.message}
                type={alertModal.type}
            />
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmDelete}
                message="Are you sure you want to cancel this booking? This action cannot be undone."
                confirmText="Cancel Booking"
                type="danger"
            />
        </div>
    );
}
