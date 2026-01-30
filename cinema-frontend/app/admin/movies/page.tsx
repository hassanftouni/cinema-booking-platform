'use client';

import { useState, useEffect } from 'react';
import { fetchAPI, Movie } from '../../../lib/api/client';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash, CheckCircle, User, Home, MapPin } from 'lucide-react';
import Link from 'next/link';
import { AlertModal, ConfirmModal } from '../../../components/ui/Modal';

export default function AdminMoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [alertModal, setAlertModal] = useState({ isOpen: false, message: '', type: 'info' as 'success' | 'error' | 'info' });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, movieId: '' });
    const [activeFilter, setActiveFilter] = useState<'all' | 'now_showing' | 'coming_soon'>('all');

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const data = await fetchAPI('/admin/movies');
                setMovies(data.data || []);
            } catch (error: any) {
                console.error("Failed to fetch movies", error);
                setError(error.message || 'Failed to load movies. Is the backend running?');
            } finally {
                setLoading(false);
            }
        };
        loadMovies();
    }, []);

    const handleDelete = async (id: string) => {
        setConfirmModal({ isOpen: true, movieId: id });
    };

    const confirmDelete = async () => {
        const id = confirmModal.movieId;
        try {
            await fetchAPI(`/admin/movies/${id}`, { method: 'DELETE' });
            setMovies(prev => prev.filter(m => m.id !== id));
            setAlertModal({ isOpen: true, message: 'Movie deleted successfully!', type: 'success' });
        } catch (error: any) {
            console.error("Failed to delete movie", error);
            const errorMessage = error?.body?.message || 'Failed to delete movie';
            setAlertModal({ isOpen: true, message: errorMessage, type: 'error' });
        }
    };

    // Filter movies based on active filter
    const filteredMovies = movies.filter(movie => {
        if (activeFilter === 'all') return true;
        return movie.status === activeFilter;
    });

    const filterCounts = {
        all: movies.length,
        now_showing: movies.filter(m => m.status === 'now_showing').length,
        coming_soon: movies.filter(m => m.status === 'coming_soon').length
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-gold-500" title="Back to Site">
                            <Home className="w-6 h-6" />
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-bold font-serif text-gold-500">Movie Management</h1>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/admin/cinemas">
                            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 md:px-6 py-2 md:py-3 rounded-lg transition-transform hover:scale-105 text-sm md:text-base">
                                <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="hidden sm:inline">Manage Cinemas</span>
                                <span className="sm:hidden">Cinemas</span>
                            </button>
                        </Link>
                        <Link href="/admin/bookings">
                            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 md:px-6 py-2 md:py-3 rounded-lg transition-transform hover:scale-105 text-sm md:text-base">
                                <User className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="hidden sm:inline">Manage Bookings</span>
                                <span className="sm:hidden">Bookings</span>
                            </button>
                        </Link>
                        <Link href="/admin/users">
                            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 md:px-6 py-2 md:py-3 rounded-lg transition-transform hover:scale-105 text-sm md:text-base">
                                <User className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="hidden sm:inline">Manage Users</span>
                                <span className="sm:hidden">Users</span>
                            </button>
                        </Link>
                        <Link href="/admin/movies/create">
                            <button className="flex items-center gap-2 bg-gold-600 hover:bg-gold-500 text-black font-bold px-4 md:px-6 py-2 md:py-3 rounded-lg transition-transform hover:scale-105 text-sm md:text-base">
                                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                                Add Movie
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveFilter('all')}
                        className={`px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${activeFilter === 'all'
                            ? 'bg-gold-600 text-black'
                            : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                    >
                        All Movies ({filterCounts.all})
                    </button>
                    <button
                        onClick={() => setActiveFilter('now_showing')}
                        className={`px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${activeFilter === 'now_showing'
                            ? 'bg-gold-600 text-black'
                            : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                    >
                        Now Selling ({filterCounts.now_showing})
                    </button>
                    <button
                        onClick={() => setActiveFilter('coming_soon')}
                        className={`px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${activeFilter === 'coming_soon'
                            ? 'bg-gold-600 text-black'
                            : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                    >
                        Coming Soon ({filterCounts.coming_soon})
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="text-xl">Loading movies...</div>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <div className="bg-red-900/50 p-6 rounded-xl inline-block border border-red-500/50">
                            <h3 className="text-xl font-bold text-red-200 mb-2">Connection Error</h3>
                            <p className="text-red-300 mb-4">{error}</p>
                            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded font-bold">Retry</button>
                        </div>
                    </div>
                ) : filteredMovies.length === 0 ? (
                    <div className="text-center py-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-md mx-auto"
                        >
                            <div className="text-6xl mb-4">🎬</div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {activeFilter === 'all' ? 'No Movies Yet' : `No ${activeFilter === 'now_showing' ? 'Now Selling' : 'Coming Soon'} Movies`}
                            </h2>
                            <p className="text-gray-400 mb-6">
                                {activeFilter === 'all'
                                    ? 'Get started by adding your first movie to the system.'
                                    : `There are no movies in the "${activeFilter === 'now_showing' ? 'Now Selling' : 'Coming Soon'}" category yet.`
                                }
                            </p>
                            <Link href="/admin/movies/create">
                                <button className="flex items-center gap-2 bg-gold-600 hover:bg-gold-500 text-black font-bold px-8 py-4 rounded-lg transition-transform hover:scale-105 mx-auto">
                                    <Plus className="w-5 h-5" />
                                    Add Your First Movie
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMovies.map((movie, index) => (
                            <motion.div
                                key={movie.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all group"
                            >
                                {/* Movie Poster */}
                                <div className="relative aspect-[2/3] overflow-hidden">
                                    <img
                                        src={movie.poster_url}
                                        alt={movie.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {/* Status Badge */}
                                    <div className="absolute top-3 left-3">
                                        {movie.status === 'now_showing' ? (
                                            <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                                                NOW SELLING
                                            </span>
                                        ) : movie.status === 'coming_soon' ? (
                                            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                                                COMING SOON
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-gray-600 text-white text-xs font-bold rounded-full">
                                                DRAFT
                                            </span>
                                        )}
                                    </div>
                                    {/* Content Rating */}
                                    {movie.content_rating && (
                                        <div className="absolute top-3 right-3">
                                            <span className={`px-2 py-1 rounded text-xs font-bold text-white ${movie.content_rating === '+18' ? 'bg-red-600' :
                                                movie.content_rating === '+16' ? 'bg-orange-600' :
                                                    movie.content_rating === 'PG-13' ? 'bg-amber-500' :
                                                        movie.content_rating === 'Kids' ? 'bg-blue-500' :
                                                            'bg-zinc-600'
                                                }`}>
                                                {movie.content_rating}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Movie Info */}
                                <div className="p-4">
                                    <h3 className="text-lg font-bold mb-2 line-clamp-1">{movie.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                                        <span className="text-gold-500 font-bold">{movie.rating} ★</span>
                                        <span>•</span>
                                        <span>{movie.duration_minutes} min</span>
                                    </div>

                                    {/* Genres */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {movie.genre && movie.genre.slice(0, 3).map(g => (
                                            <span key={g} className="px-2 py-1 border border-white/20 rounded-full text-xs text-gray-300 bg-white/5">
                                                {g}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Link href={`/admin/movies/${movie.id}/edit`} className="flex-1">
                                            <button className="w-full flex items-center justify-center gap-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-blue-400 transition-colors">
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(movie.id)}
                                            className="flex-1 flex items-center justify-center gap-2 p-2 bg-white/10 hover:bg-red-900/40 rounded-lg text-red-500 transition-colors"
                                        >
                                            <Trash className="w-4 h-4" />
                                            Delete
                                        </button>
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
                message="Are you sure you want to delete this movie? This action cannot be undone."
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
}
