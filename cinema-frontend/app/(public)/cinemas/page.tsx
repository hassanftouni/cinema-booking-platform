'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Info, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Navbar from '../../../components/ui/Navbar';
import Footer from '../../../components/ui/Footer';
import TiltCard from '../../../components/ui/TiltCard';
import { fetchAPI } from '../../../lib/api/client';

export default function CinemasPage() {
    const [cinemas, setCinemas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAPI('/cinemas')
            .then(data => setCinemas(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="min-h-screen bg-cinema-black text-white selection:bg-gold-500 selection:text-black">
            <Navbar />

            {/* Hero */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 grayscale" />
                <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/40 to-transparent" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="z-10 text-center space-y-4 px-6"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-500 text-[10px] uppercase font-black tracking-[0.2em]"
                    >
                        <MapPin className="w-3 h-3" />
                        Our Locations
                    </motion.div>
                    <h1 className="text-6xl md:text-8xl font-serif font-black text-white tracking-tighter uppercase">
                        Cinema <span className="text-gold-gradient">City</span> Hubs
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto font-light leading-relaxed tracking-wide">
                        State-of-the-art cinematic spaces designed for the ultimate movie-goer. Find your nearest theater and enter the magic.
                    </p>
                </motion.div>
            </section>

            {/* Cinemas Grid */}
            <section className="container mx-auto px-6 py-24">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {[1, 2].map(i => <div key={i} className="h-80 bg-white/5 animate-pulse rounded-[3rem]" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {cinemas.map((cinema, i) => (
                            <motion.div
                                key={cinema.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <TiltCard className="relative group rounded-[3.5rem] overflow-hidden bg-white/5 border border-white/5 hover:border-gold-500/30 transition-all duration-700 shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-transparent to-transparent" />

                                    <div className="p-12 space-y-8 relative">
                                        <div className="flex justify-between items-start">
                                            <div className="w-20 h-20 rounded-3xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-black transition-all duration-500">
                                                <MapPin className="w-10 h-10" />
                                            </div>
                                            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black tracking-widest text-gray-400 group-hover:text-gold-500 group-hover:border-gold-500/30 transition-all">
                                                {cinema.halls?.length || 0} PREMIUM HALLS
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            <h2 className="text-5xl font-serif font-black text-white uppercase tracking-tighter leading-none">{cinema.name}</h2>
                                            <p className="text-gray-400 text-lg font-light flex items-center gap-2">
                                                <Info className="w-4 h-4 text-gold-500" />
                                                {cinema.location}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Contact Info</span>
                                                <p className="text-sm font-medium text-white flex items-center gap-2">
                                                    <Mail className="w-3 h-3 text-gold-500" />
                                                    {cinema.contact_email}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Opening Hours</span>
                                                <p className="text-sm font-medium text-white flex items-center gap-2">
                                                    <Clock className="w-3 h-3 text-gold-500" />
                                                    10:00 AM - 12:00 AM
                                                </p>
                                            </div>
                                        </div>

                                        <motion.button
                                            whileHover={{ x: 15 }}
                                            className="pt-6 flex items-center gap-4 text-gold-500 font-black uppercase tracking-[0.4em] text-[10px]"
                                        >
                                            Explore This Theater <ArrowRight className="w-4 h-4" />
                                        </motion.button>
                                    </div>

                                    {/* Ambient Glow Reflector */}
                                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold-500/5 blur-[100px] rounded-full -mr-32 -mb-32 group-hover:bg-gold-500/10 transition-all duration-700" />
                                </TiltCard>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}
