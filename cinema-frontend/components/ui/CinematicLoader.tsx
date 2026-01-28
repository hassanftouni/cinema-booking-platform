'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Ticket } from 'lucide-react';

export default function CinematicLoader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Only show loader once per session
        const hasLoaded = sessionStorage.getItem('cinema_loaded');
        if (hasLoaded) {
            setLoading(false);
            return;
        }

        const timer = setTimeout(() => {
            setLoading(false);
            sessionStorage.setItem('cinema_loaded', 'true');
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] bg-cinema-black flex items-center justify-center overflow-hidden"
                >
                    {/* Background Ambient Glow */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 blur-[150px] rounded-full" />
                    </div>

                    <div className="relative flex flex-col items-center gap-10">
                        {/* Logo Animation */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, rotateY: 180 }}
                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                            transition={{ duration: 1.2, ease: "circOut" }}
                            className="relative"
                        >
                            <div className="w-24 h-24 border-2 border-gold-500 rounded-full flex items-center justify-center border-dashed animate-[spin_12s_linear_infinite]">
                                <Ticket className="w-12 h-12 text-gold-500" />
                            </div>

                            {/* Inner Ring */}
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 border border-gold-400 rounded-full"
                            />
                        </motion.div>

                        {/* Branding */}
                        <div className="text-center space-y-2">
                            <motion.h1
                                initial={{ opacity: 0, letterSpacing: "1em" }}
                                animate={{ opacity: 1, letterSpacing: "0.3em" }}
                                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                                className="text-3xl md:text-4xl font-serif font-black text-white ml-4"
                            >
                                CINEMA <span className="text-gold-gradient">CITY</span>
                            </motion.h1>

                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "100%", opacity: 1 }}
                                transition={{ delay: 1, duration: 0.8 }}
                                className="h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent w-full"
                            />

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 }}
                                className="text-[10px] text-gray-500 uppercase tracking-[0.5em] font-bold"
                            >
                                Purely Immersive
                            </motion.p>
                        </div>

                        {/* Loading Line */}
                        <div className="w-48 h-[2px] bg-white/5 rounded-full overflow-hidden mt-4">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                                className="h-full w-full bg-gold-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
