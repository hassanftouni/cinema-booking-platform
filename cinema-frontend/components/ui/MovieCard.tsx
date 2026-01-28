'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Play, Star, Clock, Info } from 'lucide-react';
import { useState } from 'react';

interface MovieProps {
    title: string;
    poster: string;
    rating: string;
    genre: string;
    duration: string;
    format: string; // IMAX, 3D, etc.
    contentRating?: string;
}

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

export default function MovieCard({ movie }: { movie: MovieProps }) {
    const [isHovered, setIsHovered] = useState(false);

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x);
    const mouseY = useSpring(y);

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseXPct = (e.clientX - rect.left) / width - 0.5;
        const mouseYPct = (e.clientY - rect.top) / height - 0.5;

        x.set(mouseXPct);
        y.set(mouseYPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="relative w-full aspect-[2/3] rounded-xl bg-cinema-gray shadow-xl cursor-pointer group perspective-1000"
        >
            {/* Poster Image */}
            <div className="absolute inset-0 rounded-xl overflow-hidden bg-cinema-gray">
                <img
                    src={movie.poster}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-125"
                />
                <img
                    src={movie.poster}
                    alt={movie.title}
                    className="absolute inset-0 z-10 w-full h-full object-contain"
                />
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 z-20 bg-gradient-to-t from-black via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-90' : 'opacity-60'}`} />
            </div>

            {/* Format Badge */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
                <span className="px-2 py-1 text-xs font-bold text-black bg-gold-500 rounded shadow-lg shadow-gold-500/20">
                    {movie.format}
                </span>
                {movie.contentRating && (
                    <span className={`px-2 py-1 text-[10px] font-black text-white rounded border border-white/10 shadow-lg uppercase tracking-wider ${getBadgeColor(movie.contentRating)}`}>
                        {movie.contentRating}
                    </span>
                )}
            </div>

            {/* Hover Content - Trailer Preview Placeholder */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
            >
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
            </motion.div>

            {/* Info Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 transform translate-z-20">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-gold-400 transition-colors">
                    {movie.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-gray-300 mb-3">
                    <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-gold-500 fill-gold-500" />
                        <span>{movie.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{movie.duration}</span>
                    </div>
                    <span className="px-2 py-0.5 border border-white/20 rounded-full text-[10px] uppercase">
                        {movie.genre}
                    </span>
                </div>

                <motion.button
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
                    className="w-full bg-gold-600 text-black font-bold py-2 rounded-lg text-sm mt-2 overflow-hidden"
                >
                    Book Now
                </motion.button>
            </div>
        </motion.div>
    );
}
