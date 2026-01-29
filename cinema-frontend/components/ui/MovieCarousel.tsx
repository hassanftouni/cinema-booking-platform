'use client';

import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Movie } from '../../lib/api/client';
import TiltCard from './TiltCard';

const getBadgeColor = (rating: string) => {
    switch (rating.toUpperCase()) {
        case '+18': return 'bg-red-600';
        case '+16': return 'bg-orange-600';
        case 'PG-13': return 'bg-amber-500';
        case 'FAMILY': return 'bg-green-600';
        case 'COUPLES': return 'bg-rose-500';
        case 'KIDS': return 'bg-blue-500';
        default: return 'bg-zinc-700';
    }
};

export default function MovieCarousel({ movies = [], title = "Now Trending" }: { movies?: Movie[], title?: string }) {
    const router = useRouter();
    const [width, setWidth] = useState(0);
    const carousel = useRef<HTMLDivElement>(null);

    const handleAction = (e: React.MouseEvent, movieId: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            e.preventDefault();
            router.push('/login');
            return;
        }
        router.push(`/movies/${movieId}`);
    };

    useEffect(() => {
        if (carousel.current) {
            setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
        }
    }, [movies]); // Recalculate when movies change

    const displayMovies = movies.length > 0 ? movies : [];

    if (displayMovies.length === 0) {
        return null; // Or return loading/empty state
    }

    return (
        <section className="py-24 bg-cinema-black overflow-hidden relative z-20">
            <div className="container mx-auto px-6 mb-12 flex items-end justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl text-white font-serif font-bold mb-2 uppercase tracking-tight">{title}</h2>
                    <div className="h-1 w-20 bg-gold-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                </motion.div>
                <button className="text-gold-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em]">
                    View All Movies
                </button>
            </div>

            <motion.div ref={carousel} className="cursor-grab active:cursor-grabbing overflow-hidden pl-6">
                <motion.div
                    drag="x"
                    dragConstraints={{ right: 0, left: -width }}
                    whileTap={{ cursor: "grabbing" }}
                    className="flex gap-8"
                >
                    {displayMovies.map((movie, i) => (
                        <div
                            key={movie.id}
                            onClick={(e) => handleAction(e, movie.id)}
                            className="cursor-pointer"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <TiltCard className="w-[300px] h-[450px] flex-shrink-0 relative rounded-[2rem] overflow-hidden group shadow-2xl">
                                    <div className="absolute inset-0 overflow-hidden bg-cinema-gray">
                                        <img
                                            src={movie.poster_url}
                                            alt=""
                                            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125"
                                        />
                                        <img
                                            src={movie.poster_url}
                                            alt={movie.title}
                                            className="absolute inset-0 z-10 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                                    <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                                        {/* Format/Experience Badge */}
                                        {movie.tagline && (
                                            <span className="px-2 py-1 text-[10px] font-black text-black bg-gold-500 rounded shadow-lg shadow-gold-500/20 uppercase tracking-wide">
                                                {movie.tagline}
                                            </span>
                                        )}

                                        {movie.content_rating && (
                                            <span className={`px-3 py-1 text-[10px] font-black text-white rounded-full border border-white/10 shadow-xl uppercase tracking-widest ${getBadgeColor(movie.content_rating)}`}>
                                                {movie.content_rating}
                                            </span>
                                        )}
                                        {/* Genre Badges */}
                                        <div className="flex flex-wrap gap-1 justify-end max-w-[150px]">
                                            {movie.genre && movie.genre.map(g => (
                                                <span key={g} className="px-2 py-0.5 border border-white/20 rounded-full text-[9px] font-bold uppercase bg-black/40 backdrop-blur-md text-gray-200">
                                                    {g}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="absolute bottom-0 left-0 p-8 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                        <div className="w-12 h-1 bg-gold-500 mb-4 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 delay-100" />
                                        <h3 className="text-2xl font-serif font-black text-white mb-2 leading-tight uppercase tracking-tight">{movie.title}</h3>
                                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                                            <span className="text-[10px] font-black text-gold-500 uppercase tracking-widest">Book Now</span>
                                            <div className="h-[1px] w-8 bg-gold-500" />
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 border border-white/10 rounded-[2rem] transition-opacity duration-500 pointer-events-none" />
                                </TiltCard>
                            </motion.div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
