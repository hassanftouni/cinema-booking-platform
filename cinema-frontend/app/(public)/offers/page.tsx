'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Sparkles, Clock, ArrowRight, Ticket, Gift } from 'lucide-react';
import Navbar from '../../../components/ui/Navbar';
import Footer from '../../../components/ui/Footer';
import { fetchAPI, Offer } from '../../../lib/api/client';

export default function OffersPage() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAPI('/offers')
            .then(data => setOffers(data))
            .catch(err => console.error("Failed to fetch offers", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="min-h-screen bg-cinema-black text-white selection:bg-gold-500 selection:text-black">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/60 to-transparent" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="z-10 text-center space-y-6 px-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-500 text-xs font-bold uppercase tracking-[0.2em]">
                        <Sparkles className="w-4 h-4" />
                        Exclusive Deals
                    </div>
                    <h1 className="text-6xl md:text-8xl font-serif font-bold text-white tracking-tight">
                        Special <span className="text-gold-gradient">Offers</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto font-light leading-relaxed">
                        Elevate your cinematic experience with our curated selection of exclusive deals and membership perks.
                    </p>
                </motion.div>
            </section>

            <section className="container mx-auto px-6 py-20">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[500px] bg-white/5 animate-pulse rounded-3xl" />
                        ))}
                    </div>
                ) : offers.length === 0 ? (
                    <div className="py-40 text-center space-y-6">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-500">
                            <Ticket className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-serif text-white">No active offers right now</h3>
                        <p className="text-gray-500">Check back soon for new exclusive deals.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {offers.map((offer, i) => (
                            <motion.div
                                key={offer.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-gold-500/50 transition-all duration-500 shadow-2xl"
                            >
                                {/* Image Overlay */}
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src={offer.image_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop'}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt={offer.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                                    {offer.discount_percentage && (
                                        <div className="absolute top-6 left-6 px-4 py-2 bg-gold-600 text-black font-black text-xl rounded-2xl shadow-xl transform -rotate-3 group-hover:rotate-0 transition-transform">
                                            -{offer.discount_percentage}%
                                        </div>
                                    )}
                                </div>

                                <div className="p-8 space-y-6">
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-serif font-bold text-white group-hover:text-gold-500 transition-colors uppercase tracking-tight line-clamp-1">
                                            {offer.title}
                                        </h3>
                                        <p className="text-gray-400 font-light leading-relaxed line-clamp-3">
                                            {offer.description}
                                        </p>
                                    </div>

                                    {offer.discount_code && (
                                        <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between group/code">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-500">
                                                    <Tag className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Promo Code</p>
                                                    <p className="text-sm font-bold text-white tracking-widest uppercase">{offer.discount_code}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(offer.discount_code!);
                                                    alert('Code copied!');
                                                }}
                                                className="text-gold-500 hover:text-white transition-colors text-xs font-bold uppercase"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    )}

                                    <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-widest">
                                            <Clock className="w-4 h-4 text-gold-500" />
                                            {offer.expires_at ? `Exp: ${new Date(offer.expires_at).toLocaleDateString()}` : 'Limited Time'}
                                        </div>
                                        <button className="flex items-center gap-2 text-gold-500 font-bold uppercase tracking-[0.2em] text-[10px] group/btn">
                                            Details
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* Newsletter Call to Action */}
            <section className="container mx-auto px-6 py-20">
                <div className="bg-gold-600 rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col items-center text-center space-y-8">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    <Gift className="w-20 h-20 text-black mb-4 relative" />
                    <h2 className="text-4xl md:text-5xl font-serif font-black text-black leading-tight max-w-2xl relative">
                        NEVER MISS AN EXCLUSIVE EXPERIENCE
                    </h2>
                    <p className="text-black/70 text-lg font-medium max-w-xl relative">
                        Join our VIP list and be the first to know about upcoming screenings, private events, and member-only rewards.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md relative">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 px-8 py-4 bg-white/20 border-2 border-black/10 rounded-full outline-none placeholder:text-black/40 text-black font-bold"
                        />
                        <button className="px-10 py-4 bg-black text-white font-black rounded-full hover:scale-105 transition-transform">
                            JOIN NOW
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
