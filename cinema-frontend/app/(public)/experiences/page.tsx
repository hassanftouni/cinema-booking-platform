'use client';

import { motion } from 'framer-motion';
import { Sparkles, Star, Shield, Coffee, Tv, Music } from 'lucide-react';
import Navbar from '../../../components/ui/Navbar';
import Footer from '../../../components/ui/Footer';

const experiences = [
    {
        title: "IMAX Premium",
        description: "The world's most immersive movie experience. Laser projection and 12-channel sound.",
        icon: Sparkles,
        image: "https://images.unsplash.com/photo-1517604401127-d37e256866b0?q=80&w=2070&auto=format&fit=crop",
        features: ["12.1 Sound Channel", "Dual 4K Laser", "Wall-to-wall Screen"]
    },
    {
        title: "Gold Class",
        description: "The ultimate in luxury. Fully reclining leather seats and in-cinema dining service.",
        icon: Star,
        image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop",
        features: ["Wait-on-call Service", "Gourmet Menu", "Reclining Comfort"]
    },
    {
        title: "4DX Immersive",
        description: "Feel the movie. Motion seats, wind, rain, and scent effects that pull you into the scene.",
        icon: Tv,
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop",
        features: ["Motion Feedback", "Environmental Effects", "Scent Technology"]
    },
    {
        title: "VIP Lounge",
        description: "Pre-movie relaxation. Exclusive access to our high-end lounge with drinks and appetizers.",
        icon: Shield,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
        features: ["Private Bar", "Complimentary Snacks", "Early Entry"]
    }
];

export default function ExperiencesPage() {
    return (
        <main className="min-h-screen bg-cinema-black text-white selection:bg-gold-500 selection:text-black">
            <Navbar />

            {/* Hero */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale" />
                <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/40 to-transparent" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2 }}
                    className="z-10 text-center space-y-4 px-6"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-500 text-[10px] uppercase font-black tracking-widest"
                    >
                        <Star className="w-3 h-3" />
                        Beyond The Screen
                    </motion.div>
                    <h1 className="text-6xl md:text-8xl font-serif font-black text-white tracking-tighter uppercase">
                        Unrivaled <span className="text-gold-gradient">Luxury</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto font-light leading-relaxed tracking-wide">
                        Every visit is a journey. Explore our signature formats designed for the ultimate cinematic enthusiast.
                    </p>
                </motion.div>
            </section>

            {/* Grid */}
            <section className="container mx-auto px-6 py-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {experiences.map((exp, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            className="group relative h-[600px] rounded-[3rem] overflow-hidden border border-white/5 hover:border-gold-500/30 transition-all duration-700 shadow-2xl"
                        >
                            {/* Bg Image */}
                            <img
                                src={exp.image}
                                className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                                alt={exp.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/80 to-transparent" />

                            <div className="absolute inset-0 p-12 flex flex-col justify-end space-y-6">
                                <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 mb-2 transform group-hover:rotate-[360deg] transition-transform duration-1000">
                                    <exp.icon className="w-8 h-8" />
                                </div>
                                <h2 className="text-4xl font-serif font-black text-white uppercase tracking-tight">
                                    {exp.title}
                                </h2>
                                <p className="text-gray-400 text-lg max-w-md font-light leading-relaxed">
                                    {exp.description}
                                </p>

                                <div className="flex flex-wrap gap-3 pt-4">
                                    {exp.features.map((feat, j) => (
                                        <span key={j} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-gold-500 group-hover:border-gold-500/30 transition-colors">
                                            {feat}
                                        </span>
                                    ))}
                                </div>

                                <motion.button
                                    whileHover={{ x: 10 }}
                                    className="pt-8 flex items-center gap-3 text-gold-500 font-bold uppercase tracking-[0.3em] text-[10px]"
                                >
                                    Experience More <div className="h-[1px] w-12 bg-gold-500" />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}
