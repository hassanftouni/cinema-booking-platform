'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Movie } from '../../lib/api/client';

export default function HeroSlider({ movies = [] }: { movies?: Movie[] }) {
    const router = useRouter();
    const [index, setIndex] = useState(0);

    const slides = movies.map(m => ({
        id: m.id,
        title: m.title,
        tagline: m.description?.substring(0, 100) + "..." || "Experience the magic",
        background: m.background_image_url || m.poster_url,
        poster: m.poster_url,
        genre: m.genre?.join(' / ') || 'Cinema',
        trailer_url: m.trailer_url
    }));

    useEffect(() => {
        if (slides.length <= 1) return;

        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    // Reset index if slides change (e.g. new movie added)
    useEffect(() => {
        setIndex(0);
    }, [slides.length]);

    if (movies.length === 0) {
        return (
            <div className="relative h-screen w-full overflow-hidden bg-cinema-black">
                <div className="absolute inset-0 bg-neutral-900 animate-pulse" />
                <div className="absolute inset-0 z-10 container mx-auto px-6 flex flex-col justify-center h-full">
                    <div className="max-w-2xl space-y-6">
                        <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                        <div className="h-20 w-3/4 bg-white/10 rounded animate-pulse" />
                        <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    const handleAction = (e: React.MouseEvent, href?: string) => {
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

    const currentSlide = slides[index];

    return (
        <div className="relative h-screen w-full overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${currentSlide.id}-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Background Layer - High quality cover */}
                    <div className="absolute inset-0 bg-cinema-black">
                        <motion.div
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.8 }}
                            transition={{ duration: 6, ease: "easeOut" }}
                            className="absolute inset-0"
                        >
                            <img
                                src={currentSlide.background}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070';
                                }}
                            />
                        </motion.div>
                    </div>

                    {/* Overlay Gradients - Made much subtler to prevent "black half" look */}
                    <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/20 to-transparent opacity-60" />
                </motion.div>
            </AnimatePresence>

            {/* Content Container */}
            <div className="absolute inset-0 z-10 container mx-auto px-6 h-full flex items-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${currentSlide.id}-${index}-content`}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.8 }}
                        className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-20"
                    >
                        {/* Poster Card - Shows "all of it" */}
                        <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                transition={{ duration: 1, delay: 0.3 }}
                                className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group"
                            >
                                <img
                                    src={currentSlide.poster}
                                    alt={currentSlide.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </motion.div>
                        </div>

                        {/* Text Content */}
                        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                            <div className="flex items-center gap-3 text-gold-400 font-medium tracking-wider text-sm uppercase">
                                <span className="px-2 py-1 border border-gold-500/30 rounded">IMAX</span>
                                <span>{currentSlide.genre}</span>
                            </div>

                            <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-black text-white leading-none tracking-tighter uppercase drop-shadow-2xl">
                                {currentSlide.title}
                            </h1>

                            <p className="text-base md:text-xl text-gray-300 font-light max-w-2xl leading-relaxed tracking-wide line-clamp-3 md:line-clamp-none drop-shadow-md">
                                {currentSlide.tagline}
                            </p>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                                {currentSlide.trailer_url ? (
                                    <a
                                        href={currentSlide.trailer_url}
                                        onClick={(e) => handleAction(e)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-3 md:px-8 md:py-4 bg-gold-600 hover:bg-gold-500 text-black font-bold text-sm md:text-lg rounded-full flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-gold-600/20"
                                    >
                                        <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                                        Watch Trailer
                                    </a>
                                ) : (
                                    <button className="px-6 py-3 md:px-8 md:py-4 bg-gold-600/50 cursor-not-allowed text-black font-bold text-sm md:text-lg rounded-full flex items-center justify-center gap-2 transition-all">
                                        <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                                        No Trailer
                                    </button>
                                )}
                                <button
                                    onClick={(e) => handleAction(e, `/movies/${currentSlide.id}`)}
                                    className="px-6 py-3 md:px-8 md:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-sm md:text-lg rounded-full flex items-center justify-center gap-2 transition-all"
                                >
                                    <Info className="w-4 h-4 md:w-5 md:h-5" />
                                    More Details
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress Indicators */}
            {
                slides.length > 1 && (
                    <div className="absolute bottom-12 left-12 flex items-center gap-6 z-20">
                        <div className="flex gap-2">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setIndex(i)}
                                    className="group p-2 relative"
                                >
                                    <div className={`h-[2px] rounded-full transition-all duration-700 ${i === index ? 'w-8 bg-gold-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'w-4 bg-white/20 group-hover:bg-white/50'}`} />
                                </button>
                            ))}
                        </div>
                        <div className="h-[1px] w-24 bg-white/10 hidden md:block" />
                    </div>
                )
            }
        </div>
    );
}
