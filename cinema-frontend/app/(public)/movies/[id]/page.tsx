'use client';

import { useState, useEffect, use } from 'react';
import Navbar from '../../../../components/ui/Navbar';
import Footer from '../../../../components/ui/Footer';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Star, Calendar, MapPin, ChevronRight, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fetchAPI, Movie } from '../../../../lib/api/client';

export default function MovieDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);

    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);

    const handleProtectedAction = (e: React.MouseEvent, href?: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            e.preventDefault();
            router.push('/login');
            return;
        }
        if (href) {
            router.push(href);
        }
    };

    useEffect(() => {
        const loadMovie = async () => {
            try {
                const data = await fetchAPI(`/movies/${id}`);
                setMovie(data);
            } catch (error) {
                console.error("Failed to load movie", error);
            } finally {
                setLoading(false);
            }
        };
        loadMovie();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-cinema-black flex items-center justify-center text-white">Loading...</div>;
    if (!movie) return <div className="min-h-screen bg-cinema-black flex items-center justify-center text-white">Movie not found</div>;

    return (
        <main className="min-h-screen bg-cinema-black selection:bg-gold-500 selection:text-black pb-24">
            <Navbar />

            {/* Hero Header */}
            <div className="relative h-[85vh] w-full overflow-hidden">
                <motion.div style={{ y: y1 }} className="absolute inset-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${movie.poster_url})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-cinema-black via-transparent to-transparent opacity-80" />
                </motion.div>

                <div className="absolute inset-0 container mx-auto px-6 flex items-end pb-24">
                    <div className="flex flex-col md:flex-row gap-16 items-end w-full">
                        {/* Poster - Animated Reveal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            className="w-72 h-[450px] rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/10 hidden md:block perspective-1000 origin-bottom hover:scale-[1.02] transition-transform duration-700"
                        >
                            <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover" />
                        </motion.div>

                        {/* Info */}
                        <div className="flex-1 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-wrap gap-4"
                            >
                                {movie.genre && movie.genre.map((g: string) => (
                                    <span key={g} className="px-5 py-2 bg-white/5 backdrop-blur-2xl rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white border border-white/5">
                                        {g}
                                    </span>
                                ))}
                                <span className="px-5 py-2 bg-gold-600 text-black rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-gold-600/20">
                                    {movie.rating} RATING
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30, letterSpacing: "-0.05em" }}
                                animate={{ opacity: 1, y: 0, letterSpacing: "-0.02em" }}
                                transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className="text-6xl md:text-[8rem] font-serif font-black text-white leading-[0.85] uppercase"
                            >
                                {movie.title}
                            </motion.h1>

                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "100%" }}
                                transition={{ delay: 0.8, duration: 1 }}
                                className="h-[2px] bg-gradient-to-r from-gold-500 via-transparent to-transparent max-w-xl"
                            />

                            <div className="flex items-center gap-8 pt-4">
                                {movie.trailer_url && (
                                    <a
                                        href={movie.trailer_url}
                                        onClick={(e) => handleProtectedAction(e)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-10 py-5 bg-gold-600 hover:bg-gold-500 text-black font-black uppercase tracking-[0.25em] text-[11px] rounded-full flex items-center gap-4 transition-all hover:scale-105 shadow-xl shadow-gold-600/20 group"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-black text-gold-500 flex items-center justify-center group-hover:rotate-[360deg] transition-transform duration-700">
                                            <Play className="w-3 h-3 fill-current ml-0.5" />
                                        </div>
                                        Watch Trailer
                                    </a>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Released</span>
                                    <span className="text-white font-medium">
                                        {new Date(movie.release_date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Main Content (Left) */}
                <div className="lg:col-span-2 space-y-16">

                    {/* Synopsis */}
                    <section>
                        <h3 className="text-2xl font-serif text-white mb-4">Synopsis</h3>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            {movie.description}
                        </p>
                    </section>

                    {/* Showtimes Timeline */}
                    <section className="bg-white/5 p-12 rounded-[3.5rem] border border-white/5 backdrop-blur-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-[100px] rounded-full -mr-20 -mt-20" />

                        <h3 className="text-4xl font-serif font-black text-white mb-12 flex items-center gap-4 uppercase tracking-tighter">
                            <Calendar className="w-8 h-8 text-gold-500" />
                            Secure Your Seat
                        </h3>

                        <div className="space-y-10">
                            {movie.showtimes && movie.showtimes.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {movie.showtimes.map((show: any, i: number) => (
                                        <motion.div
                                            key={show.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            viewport={{ once: true }}
                                        >
                                            <div
                                                onClick={(e) => handleProtectedAction(e, `/booking/${show.id}/seats`)}
                                                className="group flex items-center justify-between p-8 bg-black/40 border border-white/5 rounded-3xl hover:border-gold-500/50 hover:bg-black/60 transition-all duration-500 cursor-pointer"
                                            >
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse shadow-[0_0_10px_rgba(234,179,8,1)]" />
                                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{show.hall?.cinema?.name}</span>
                                                    </div>
                                                    <div className="text-4xl font-black text-white group-hover:text-gold-500 transition-colors tracking-tighter">
                                                        {new Date(show.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                        <Clock className="w-3 h-3 text-gold-500" />
                                                        {new Date(show.start_time).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-6">
                                                    <span className="px-4 py-2 bg-gold-500/10 text-gold-500 rounded-2xl border border-gold-500/15 text-[10px] font-black uppercase tracking-widest">
                                                        {show.hall?.name}
                                                    </span>
                                                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-black transition-all duration-500">
                                                        <ChevronRight className="w-6 h-6" />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-black/20 rounded-3xl border border-dashed border-white/10">
                                    <p className="text-gray-500 font-medium italic">No upcoming showtimes found for this movie.</p>
                                </div>
                            )}
                        </div>
                    </section>

                </div>

                {/* Sidebar (Right) */}
                <aside className="space-y-8">
                    <div className="p-6 bg-cinema-gray/30 rounded-2xl border border-white/5">
                        <h4 className="text-white font-bold mb-4">Movie Info</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex justify-between">
                                <span className="text-gray-500">Director</span>
                                <span className="text-white">{(movie as any).director || 'N/A'}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-500">Writers</span>
                                <span className="text-white">{(movie as any).writers || 'N/A'}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-500">Release Date</span>
                                <span className="text-white">
                                    {new Date(movie.release_date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </li>
                        </ul>
                    </div>
                </aside>

            </div>
            <Footer />
        </main>
    );
}
