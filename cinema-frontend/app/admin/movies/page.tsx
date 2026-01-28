'use client';

import { useState, useEffect } from 'react';
import { fetchAPI, Movie } from '../../../lib/api/client';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash, CheckCircle, User, Home } from 'lucide-react';
import Link from 'next/link';

export default function AdminMoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const data = await fetchAPI('/admin/movies');
                setMovies(data.data || []);
            } catch (error) {
                console.error("Failed to fetch movies", error);
            } finally {
                setLoading(false);
            }
        };
        loadMovies();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this movie?')) return;

        try {
            await fetchAPI(`/admin/movies/${id}`, { method: 'DELETE' });
            setMovies(prev => prev.filter(m => m.id !== id));
        } catch (error) {
            console.error("Failed to delete movie", error);
            alert('Failed to delete movie');
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-gold-500" title="Back to Site">
                            <Home className="w-6 h-6" />
                        </Link>
                        <h1 className="text-3xl font-bold font-serif text-gold-500">Movie Management</h1>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/admin/users">
                            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-lg transition-transform hover:scale-105">
                                <User className="w-5 h-5" />
                                Manage Users
                            </button>
                        </Link>
                        <Link href="/admin/movies/create">
                            <button className="flex items-center gap-2 bg-gold-600 hover:bg-gold-500 text-black font-bold px-6 py-3 rounded-lg transition-transform hover:scale-105">
                                <Plus className="w-5 h-5" />
                                Add New Movie
                            </button>
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {movies.map((movie) => (
                            <motion.div
                                key={movie.id}
                                layout
                                className="bg-white/5 border border-white/10 p-6 rounded-xl flex items-center gap-6 hover:bg-white/10 transition-colors"
                            >
                                <div className="w-16 h-24 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-1">{movie.title}</h3>
                                    <div className="flex gap-4 text-sm text-gray-400">
                                        <span>
                                            {movie.status === 'now_showing' ? (
                                                <span className="text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Now Selling</span>
                                            ) : movie.status === 'coming_soon' ? (
                                                <span className="text-blue-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Coming Soon</span>
                                            ) : (
                                                <span className="text-gray-500">Draft</span>
                                            )}
                                        </span>
                                        <span>•</span>
                                        <span>{movie.duration_minutes} min</span>
                                        <span>•</span>
                                        <span>{movie.rating} Rating</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Link href={`/admin/movies/${movie.id}/edit`}>
                                        <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-blue-400 transition-colors">
                                            <Edit className="w-5 h-5" />
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(movie.id)}
                                        className="p-2 bg-white/10 hover:bg-red-900/40 rounded-lg text-red-500 transition-colors"
                                    >
                                        <Trash className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
