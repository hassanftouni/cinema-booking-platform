'use client';

import Navbar from '../../../components/ui/Navbar';
import MovieCard from '../../../components/ui/MovieCard';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchAPI, Movie } from '../../../lib/api/client';
import { getEcho } from '../../../lib/echo';

export default function MoviesPage() {
    const [search, setSearch] = useState('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const data = await fetchAPI('/movies');
                setMovies(data.data || []);
            } catch (error) {
                console.error("Failed to fetch movies", error);
            } finally {
                setLoading(false);
            }
        };
        loadMovies();

        // Real-time Listener
        const echo = getEcho();
        if (echo) {
            echo.channel('movies')
                .listen('.movie.published', (e: any) => {
                    console.log('Movie Published:', e.movie);
                    setMovies(prev => [e.movie, ...prev]);
                });
        }

        return () => {
            if (echo) echo.leave('movies');
        };
    }, []);

    return (
        <main className="min-h-screen bg-cinema-black selection:bg-gold-500 selection:text-black pb-20">
            <Navbar />

            {/* Header & Filters */}
            <section className="pt-32 pb-12 px-6 container mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl text-white font-serif font-bold mb-2">Explore Movies</h1>
                        <p className="text-gray-400">Discover the latest blockbusters and exclusive screenings.</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search movies..."
                                className="w-full bg-cinema-gray border border-white/10 rounded-full py-3 pl-12 pr-6 text-white text-sm focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all"
                            />
                        </div>
                        <button className="p-3 bg-cinema-gray border border-white/10 rounded-full hover:border-gold-500 hover:text-gold-500 text-white transition-all">
                            <SlidersHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Filter Chips (Mock) */}
                <div className="flex flex-wrap gap-3 mb-12">
                    {['All', 'Action', 'Sci-Fi', 'Drama', 'Comedy', 'Horror', 'Family'].map((genre, i) => (
                        <button
                            key={genre}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${i === 0 ? 'bg-gold-500 text-black' : 'bg-cinema-gray text-gray-300 hover:text-white border border-white/5 hover:border-white/20'}`}
                        >
                            {genre}
                        </button>
                    ))}
                </div>

                {/* Movie Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {movies.filter(m => m.title.toLowerCase().includes(search.toLowerCase())).map((movie, index) => (
                            <motion.div
                                key={movie.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <MovieCard movie={{
                                    title: movie.title,
                                    poster: movie.poster_url,
                                    rating: movie.rating.toString(),
                                    genre: movie.genre[0] || 'Unknown',
                                    duration: `${movie.duration_minutes}m`,
                                    format: '2D', // Placeholder
                                    contentRating: movie.content_rating
                                }} />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Load More Trigger (Infinite Scroll Placeholder) */}
                {!loading && (
                    <div className="mt-20 flex justify-center">
                        <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
                    </div>
                )}
            </section>
        </main>
    );
}
