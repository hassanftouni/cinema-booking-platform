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
        image: m.poster_url,
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

    if (slides.length === 0) return null;

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
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Background Image with Parallax Scale */}
                    <motion.div
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 6, ease: "easeOut" }}
                        className="absolute inset-0"
                    >
                        <img
                            src={currentSlide.image}
                            alt={currentSlide.title}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Overlay Gradient - Deeper and richer */}
                    <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-cinema-black via-cinema-black/60 to-transparent" />

                    {/* Subtle Overlay Pattern */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="absolute inset-0 z-10 container mx-auto px-6 flex flex-col justify-center h-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${currentSlide.id}-${index}-text`}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-2xl space-y-6"
                    >
                        <div className="flex items-center gap-3 text-gold-400 font-medium tracking-wider text-sm uppercase">
                            <span className="px-2 py-1 border border-gold-500/30 rounded">IMAX</span>
                            <span>{currentSlide.genre}</span>
                        </div>

                        <h1 className="text-7xl md:text-[9rem] font-serif font-black text-white leading-[0.85] tracking-tighter uppercase whitespace-pre-line">
                            {currentSlide.title.split(' ').map((word: string, i: number) => (
                                <span key={i} className="inline-block overflow-hidden mr-4">
                                    <motion.span
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 * i }}
                                        className="inline-block"
                                    >
                                        {word}
                                    </motion.span>
                                </span>
                            ))}
                        </h1>

                        <p className="text-lg md:text-xl text-gray-400 font-light max-w-xl leading-relaxed tracking-wide">
                            {currentSlide.tagline}
                        </p>

                        <div className="flex items-center gap-4 pt-4">
                            {currentSlide.trailer_url ? (
                                <a
                                    href={currentSlide.trailer_url}
                                    onClick={(e) => handleAction(e)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 bg-gold-600 hover:bg-gold-500 text-black font-bold text-lg rounded-full flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-gold-600/20"
                                >
                                    <Play className="w-5 h-5 fill-current" />
                                    Watch Trailer
                                </a>
                            ) : (
                                <button className="px-8 py-4 bg-gold-600/50 cursor-not-allowed text-black font-bold text-lg rounded-full flex items-center gap-2 transition-all">
                                    <Play className="w-5 h-5 fill-current" />
                                    No Trailer
                                </button>
                            )}
                            <button
                                onClick={(e) => handleAction(e, `/movies/${currentSlide.id}`)}
                                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-lg rounded-full flex items-center gap-2 transition-all"
                            >
                                <Info className="w-5 h-5" />
                                More Details
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress Indicators */}
            {slides.length > 1 && (
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
            )}
        </div>
    );
}
