'use client';

import Navbar from '../../../components/ui/Navbar';
import Footer from '../../../components/ui/Footer';
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

    const [selectedGenre, setSelectedGenre] = useState('All');
    const [viewMode, setViewMode] = useState<'now_showing' | 'coming_soon'>('now_showing');

    const filteredMovies = movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase());
        const matchesGenre = selectedGenre === 'All' || movie.genre.some(g => g.toLowerCase() === selectedGenre.toLowerCase());

        // Status logic: strictly follow the status set in admin
        const matchesStatus = movie.status === viewMode;

        return matchesSearch && matchesGenre && matchesStatus;
    });

    return (
        <main className="min-h-screen bg-cinema-black selection:bg-gold-500 selection:text-black pb-20">
            <Navbar />

            {/* Header & Filters */}
            <section className="pt-32 pb-12 px-6 container mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
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
                    </div>
                </div>

                {/* Status Toggles (Now Showing / Coming Soon) */}
                <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-4">
                    <button
                        onClick={() => setViewMode('now_showing')}
                        className={`text-lg font-bold uppercase tracking-widest transition-colors relative ${viewMode === 'now_showing' ? 'text-gold-500' : 'text-gray-500 hover:text-white'}`}
                    >
                        Now Selling
                        {viewMode === 'now_showing' && <motion.div layoutId="activeTab" className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-gold-500" />}
                    </button>
                    <button
                        onClick={() => setViewMode('coming_soon')}
                        className={`text-lg font-bold uppercase tracking-widest transition-colors relative ${viewMode === 'coming_soon' ? 'text-gold-500' : 'text-gray-500 hover:text-white'}`}
                    >
                        Coming Soon
                        {viewMode === 'coming_soon' && <motion.div layoutId="activeTab" className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-gold-500" />}
                    </button>
                </div>

                {/* Genre Filter Chips */}
                <div className="flex flex-wrap gap-3 mb-12">
                    {['All', 'Action', 'Sci-Fi', 'Drama', 'Comedy', 'Horror', 'Family'].map((genre, i) => (
                        <button
                            key={genre}
                            onClick={() => setSelectedGenre(genre)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedGenre === genre ? 'bg-gold-500 text-black' : 'bg-cinema-gray text-gray-300 hover:text-white border border-white/5 hover:border-white/20'}`}
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
                        {filteredMovies.length > 0 ? (
                            filteredMovies.map((movie, index) => (
                                <motion.div
                                    key={movie.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <MovieCard movie={{
                                        id: movie.id,
                                        title: movie.title,
                                        poster: movie.poster_url,
                                        rating: movie.rating.toString(),
                                        genre: movie.genre || [],
                                        duration: `${movie.duration_minutes}m`,
                                        format: '2D', // Placeholder
                                        contentRating: movie.content_rating
                                    }} />
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center text-gray-500">
                                <p className="text-xl">No movies found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Load More Trigger (Infinite Scroll Placeholder) */}
                {/* Pending implementation of pagination */}
            </section>

            <Footer />
        </main>
    );
}
