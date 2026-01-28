'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Info, Armchair, X, MapPin, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../../../../components/ui/Navbar';
import { fetchAPI } from '../../../../../lib/api/client';

const SEAT_TYPES = {
    'Standard': { price: 10, color: 'bg-cinema-gray border-white/20', glow: '' },
    'VIP': { price: 15, color: 'bg-gold-900/40 border-gold-500', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.4)]' },
};

export default function SeatSelectionPage({ params }: { params: Promise<{ showtimeId: string }> }) {
    const { showtimeId } = use(params);
    const router = useRouter();

    const [showtime, setShowtime] = useState<any>(null);
    const [bookedSeats, setBookedSeats] = useState<string[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchAPI(`/showtimes/${showtimeId}`);
                setShowtime(data.showtime);
                setBookedSeats(data.booked_seats || []);
            } catch (error) {
                console.error("Failed to load showtime", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [showtimeId]);

    const toggleSeat = (seatId: string) => {
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(prev => prev.filter(id => id !== seatId));
        } else {
            if (selectedSeats.length >= 10) {
                alert("You can select up to 10 seats.");
                return;
            }
            setSelectedSeats(prev => [...prev, seatId]);
        }
    };

    const handleBooking = async () => {
        if (selectedSeats.length === 0) return;

        setIsSubmitting(true);
        try {
            await fetchAPI('/bookings', {
                method: 'POST',
                body: JSON.stringify({
                    showtime_id: showtimeId,
                    seat_ids: selectedSeats
                })
            });
            alert("Booking Successful!");
            router.push('/');
        } catch (error: any) {
            console.error("Booking failed", error);
            alert(error.message || "Booking failed. Some seats might have been taken.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-cinema-black flex items-center justify-center text-white">Loading Screen...</div>;
    if (!showtime) return <div className="min-h-screen bg-cinema-black flex items-center justify-center text-white">Showtime not found</div>;

    const basePrice = showtime.price_matrix?.base || 10;
    const totalPrice = selectedSeats.length * basePrice;

    return (
        <main className="min-h-screen bg-cinema-black text-white flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col lg:flex-row pt-24 h-full relative overflow-hidden">
                {/* Ambient Background Glow */}
                <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-gold-500/5 blur-[150px] rounded-full pointer-events-none" />

                {/* Left: Seat Map */}
                <div className="flex-1 p-8 overflow-hidden relative flex flex-col items-center justify-center">

                    {/* Screen with Light Reflection */}
                    <div className="w-full max-w-3xl mb-20 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5 }}
                            className="w-full h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent shadow-[0_0_30px_rgba(234,179,8,0.8)] mb-4"
                        />
                        <div className="w-full h-32 bg-gradient-to-b from-gold-500/10 to-transparent rounded-[50%] blur-3xl mb-8 relative flex items-center justify-center">
                            <span className="text-[10px] tracking-[2em] text-gray-600 uppercase font-black opacity-50">Immersion Area</span>
                        </div>
                    </div>

                    {/* Seats Grid Container */}
                    <div className="w-full overflow-x-auto pb-12 flex justify-center scrollbar-hide">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="p-12 bg-white/5 rounded-[3rem] border border-white/5 shadow-2xl min-w-max backdrop-blur-sm"
                        >
                            <div
                                className="grid gap-4"
                                style={{
                                    gridTemplateColumns: `repeat(${showtime.hall?.seat_layout?.cols || 1}, minmax(0, 1fr))`
                                }}
                            >
                                {showtime.hall?.seats?.map((seat: any, i: number) => {
                                    const isSelected = selectedSeats.includes(seat.id);
                                    const isBooked = bookedSeats.includes(seat.id);
                                    const typeName = seat.seat_type?.name || 'Standard';
                                    const config = (SEAT_TYPES as any)[typeName] || SEAT_TYPES.Standard;

                                    return (
                                        <motion.button
                                            key={seat.id}
                                            disabled={isBooked}
                                            onClick={() => toggleSeat(seat.id)}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.005 * i }}
                                            whileHover={!isBooked ? { scale: 1.25, rotate: isSelected ? 0 : 5, zIndex: 10 } : {}}
                                            whileTap={!isBooked ? { scale: 0.85 } : {}}
                                            className={`
                                                w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 relative group
                                                ${isBooked ? 'bg-white/5 border-white/5 opacity-10 cursor-not-allowed' : 'cursor-pointer'}
                                                ${isSelected ? 'bg-gold-500 border-gold-400 text-black shadow-[0_0_25px_rgba(234,179,8,0.8)]' : 'bg-cinema-gray/40 border-white/5'}
                                                ${!isSelected && !isBooked && typeName === 'VIP' ? 'border-gold-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : ''}
                                            `}
                                        >
                                            {isBooked ? (
                                                <X className="w-3 h-3 text-white/20" />
                                            ) : isSelected ? (
                                                <Armchair className="w-5 h-5" />
                                            ) : (
                                                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${typeName === 'VIP' ? 'bg-gold-500' : 'bg-white/20 group-hover:bg-white'}`} />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>

                    {/* Legend */}
                    <div className="flex gap-8 mt-12 px-8 py-4 bg-white/5 rounded-full border border-white/5 backdrop-blur-md text-[10px] uppercase font-black tracking-widest text-gray-500">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-cinema-gray border border-white/20" /> Standard</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded border border-gold-500/50 shadow-[0_0_10px_rgba(234,179,8,0.3)]" /> VIP LUXE</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-gold-500" /> Selected</div>
                        <div className="flex items-center gap-2 opacity-50"><div className="w-3 h-3 rounded bg-white/5" /> Booked</div>
                    </div>
                </div>

                {/* Right: Booking Summary */}
                <div className="w-full lg:w-[450px] bg-white/5 border-l border-white/5 p-12 backdrop-blur-3xl flex flex-col z-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-[100px] rounded-full -mr-32 -mt-32" />

                    <h2 className="text-4xl font-serif font-black text-white mb-10 uppercase tracking-tighter">Your Journey</h2>

                    <div className="space-y-10 flex-1 relative">
                        <div className="flex items-start gap-6">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="w-24 h-36 bg-gray-800 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 shadow-2xl"
                            >
                                <img src={showtime.movie?.poster_url} className="w-full h-full object-cover" alt="" />
                            </motion.div>
                            <div className="space-y-2">
                                <span className="text-[10px] font-black text-gold-500 uppercase tracking-widest">Selected Movie</span>
                                <h3 className="text-2xl font-serif font-black text-white leading-tight">{showtime.movie?.title}</h3>
                                <div className="text-gray-400 text-sm font-medium">
                                    {new Date(showtime.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(showtime.start_time).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-gold-500">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-white font-bold leading-none mb-1">{showtime.hall?.cinema?.name}</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black">{showtime.hall?.name}</div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-white/5 pt-8">
                            <h3 className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4">Seats ({selectedSeats.length})</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedSeats.length === 0 && <span className="text-gray-600 italic text-sm">Select seats on the map...</span>}
                                {selectedSeats.map(id => {
                                    const s = showtime.hall?.seats.find((se: any) => se.id === id);
                                    return (
                                        <motion.span
                                            key={id}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="px-4 py-2 bg-gold-500 text-black rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-gold-500/20"
                                        >
                                            {s?.row}{s?.number}
                                        </motion.span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-10 mt-10 space-y-6">
                        <div className="flex justify-between items-end">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Total Investment</span>
                                <span className="text-4xl font-serif font-black text-gold-500 tracking-tighter">${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleBooking}
                            disabled={selectedSeats.length === 0 || isSubmitting}
                            className="group w-full py-6 bg-gold-600 hover:bg-gold-500 text-black font-black uppercase tracking-[0.3em] text-[12px] rounded-2xl shadow-2xl shadow-gold-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Confirm Experience</span>
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </main>
    );
}
