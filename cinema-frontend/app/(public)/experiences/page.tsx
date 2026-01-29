'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Star, Shield, Coffee, Tv, Music, ArrowRight } from 'lucide-react';
import Navbar from '../../../components/ui/Navbar';
import Footer from '../../../components/ui/Footer';

const experiences = [
    {
        title: "Master Image 3D",
        description: "Ready to be riveted to your seat? Master Image 3D does just that, delivering an entertainment experience that's nothing short of incredible. You'll find yourself immersed in the movie, with 3D so real the action all but leaps off the screen. Colors are more natural, and the picture is so clearly defined, you'll want to reach out and touch it.",
        icon: Sparkles,
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop",
        features: ["More Natural Colors", "Real Action", "Defined Picture"]
    },
    {
        title: "Plus Laser Theater",
        description: "Beirut Souks Cinemacity brings you the FIRST and ONLY laser projection in Lebanon and the Middle East! Bringing you an unprecedented image quality for a premium experience, the laser projector delivers exceptional image quality with outstanding 2D and 3D color brightness, uniformity, contrast and superior color performance.",
        icon: Star,
        image: "https://www.cinemacitybeirut.com/IT-CDN/Themes/_souks/Images/private2.jpg",
        features: ["Laser Projection", "Superior Contrast", "Unprecedented Quality"]
    },
    {
        title: "STUDIO15",
        description: "Bringing you an immersive cinema experience, Studio 15 is the newest addition to our family. With its cozy private lounge and comfortable reclining leather chairs, Studio 15 is the perfect place to have the home theater feel away from home. Whether you’re celebrating a birthday, launching a new product/service, or just wish to have an intimate gathering.",
        icon: Tv,
        image: "https://www.cinemacitybeirut.com/IT-CDN/Themes/_souks/Images/private1.jpg",
        features: ["Private Lounge", "Reclining Chairs", "Intimate Gathering"]
    },
    {
        title: "VIP Theatre",
        description: "Lebanon's most luxurious and innovative VIP cinema experience has arrived. With an exclusive lounge, gourmet dining options, and butler service straight to your seat. Both VIP theaters are equipped with motorized reclining leather seats, each with their own table. Arrive 30 minutes before the movie and prepare to get fully pampered.",
        icon: Shield,
        image: "https://www.cinemacitybeirut.com/IT-CDN/Themes/_souks/Images/private2.jpg",
        features: ["Butler Service", "Gourmet Dining", "Motorized Seats"]
    }
];

export default function ExperiencesPage() {
    const [selectedExperience, setSelectedExperience] = useState<typeof experiences[0] | null>(null);

    return (
        <main className="min-h-screen bg-cinema-black text-white selection:bg-gold-500 selection:text-black">
            <Navbar />

            {/* Experience Detail Modal */}
            {selectedExperience && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedExperience(null)}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="relative bg-neutral-900 border border-gold-500/20 rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-gold-500/10"
                    >
                        <div className="relative h-64 md:h-80">
                            <img src={selectedExperience.image} alt={selectedExperience.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                            <button
                                onClick={() => setSelectedExperience(null)}
                                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-gold-500 hover:text-black transition-colors"
                            >
                                <ArrowRight className="w-6 h-6 rotate-180" />
                            </button>
                        </div>

                        <div className="p-8 md:p-12 space-y-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/10 rounded-full text-gold-500 text-xs font-bold uppercase tracking-widest mb-4">
                                        <selectedExperience.icon className="w-3 h-3" />
                                        Premium Format
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-serif font-black text-white uppercase">{selectedExperience.title}</h2>
                                </div>
                            </div>

                            <p className="text-gray-300 text-lg leading-relaxed font-light">
                                {selectedExperience.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-y border-white/10">
                                {selectedExperience.features.map((feat, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-gold-500 rounded-full" />
                                        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">{feat}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 pt-4">
                                <Link href="/movies" className="flex-1">
                                    <button className="w-full py-4 bg-gold-600 hover:bg-gold-500 text-black font-bold uppercase tracking-widest text-sm rounded-xl transition-all shadow-lg hover:shadow-gold-500/20">
                                        View Showtimes
                                    </button>
                                </Link>
                                <button
                                    onClick={() => setSelectedExperience(null)}
                                    className="px-8 py-4 border border-white/10 hover:bg-white/5 rounded-xl text-white font-bold uppercase tracking-widest text-sm transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Hero */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.cinemacitybeirut.com/IT-CDN/Themes/_souks/Images/private1.jpg')] bg-cover bg-center opacity-40 grayscale" />
                <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/40 to-transparent" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2 }}
                    className="z-10 text-center space-y-4 px-6 pt-20"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-500 text-[10px] uppercase font-black tracking-widest"
                    >
                        <Star className="w-3 h-3" />
                        Beyond The Screen
                    </motion.div>
                    <h1 className="text-4xl md:text-8xl font-serif font-black text-white tracking-tighter uppercase">
                        Unrivaled <span className="text-gold-gradient">Luxury</span>
                    </h1>
                    <p className="text-gray-400 text-sm md:text-lg max-w-xl mx-auto font-light leading-relaxed tracking-wide">
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
                            className="group relative h-auto min-h-[500px] md:h-[600px] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/5 hover:border-gold-500/30 transition-all duration-700 shadow-2xl"
                        >
                            {/* Bg Image */}
                            <img
                                src={exp.image}
                                className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                                alt={exp.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/80 to-transparent" />

                            <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end space-y-4 md:space-y-6">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 mb-2 transform group-hover:rotate-[360deg] transition-transform duration-1000">
                                    <exp.icon className="w-6 h-6 md:w-8 md:h-8" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-serif font-black text-white uppercase tracking-tight">
                                    {exp.title}
                                </h2>
                                <p className="text-gray-400 text-sm md:text-lg max-w-md font-light leading-relaxed line-clamp-4 md:line-clamp-none">
                                    {exp.description}
                                </p>

                                <div className="flex flex-wrap gap-2 md:gap-3 pt-2 md:pt-4">
                                    {exp.features.map((feat, j) => (
                                        <span key={j} className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-gold-500 group-hover:border-gold-500/30 transition-colors">
                                            {feat}
                                        </span>
                                    ))}
                                </div>

                                <Link href="/movies" className="block mt-auto">
                                    <motion.button
                                        whileHover={{ x: 10 }}
                                        className="pt-4 md:pt-8 flex items-center gap-3 text-gold-500 font-bold uppercase tracking-[0.3em] text-[9px] md:text-[10px]"
                                    >
                                        Read More & View Show Times <div className="h-[1px] w-8 md:w-12 bg-gold-500" />
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}
