'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Film, Star } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { fetchAPI } from '../../../lib/api/client';

import { AlertModal } from '../../../components/ui/Modal';

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [alertState, setAlertState] = useState<{ isOpen: boolean; message: string; type: 'success' | 'error' | 'info' }>({
        isOpen: false,
        message: '',
        type: 'info'
    });

    const [isRegistered, setIsRegistered] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (password !== confirmPassword) {
            setAlertState({
                isOpen: true,
                message: "Passwords do not match. Please try again.",
                type: 'error'
            });
            setIsLoading(false);
            return;
        }

        try {
            const data = await fetchAPI('/register', {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    password_confirmation: confirmPassword
                })
            });

            // Handle immediate login
            if (data.access_token) {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/';
            } else {
                setIsRegistered(true);
            }
        } catch (err: any) {
            console.error(err);
            setAlertState({
                isOpen: true,
                message: err.message || 'Registration failed. Please try again.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    return (
        <div className="min-h-screen flex bg-cinema-black overflow-hidden relative">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gold-600/5 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-red-900/10 blur-[100px]" />
            </div>

            {/* Left Section - Visuals (Order swapped on mobile via flex-col-reverse if needed, but hidden lg:flex handles desktop) */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12"
            >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517604931442-710c8ef555c9?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-r from-cinema-black via-transparent to-cinema-black/90" />

                <div className="z-10 text-center space-y-6 max-w-lg">
                    <motion.div
                        initial={{ scale: 0.8, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ duration: 1, type: "spring" }}
                        className="w-24 h-24 mx-auto border-2 border-gold-500/30 rounded-full flex items-center justify-center border-dashed mb-8 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl shadow-gold-500/20"
                    >
                        <img src="/logo.png" className="w-16 h-16 object-contain" alt="BEIRUT SOUKS CINEMACITY" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h1 className="text-5xl font-serif font-bold text-white mb-4">
                            Join the <span className="text-gold-gradient">Elite</span>
                        </h1>
                    </motion.div>

                    <p className="text-xl text-gray-300 leading-relaxed font-light">
                        Create an account to unlock exclusive screenings, earn loyalty rewards, and book the best seats in the house.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="glass-panel p-4 rounded-xl text-center">
                            <div className="text-2xl font-bold text-gold-500 mb-1">VIP</div>
                            <div className="text-xs text-gray-400">Access Level</div>
                        </div>
                        <div className="glass-panel p-4 rounded-xl text-center">
                            <div className="text-2xl font-bold text-gold-500 mb-1">0%</div>
                            <div className="text-xs text-gray-400">Booking Fees</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Right Section - Form */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative"
            >
                <div className="w-full max-w-md space-y-8">
                    {!isRegistered ? (
                        <>
                            <div className="text-center lg:text-left">
                                <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                                <p className="text-gray-400">Begin your premium cinema journey.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <motion.div variants={fadeInUp} initial="initial" animate="animate">
                                    <label className="block text-sm font-medium text-gold-100/80 mb-2 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 focus:bg-white/10 transition-all outline-none"
                                            placeholder="John Doe"
                                        />
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gold-500 transition-colors" />
                                    </div>
                                </motion.div>

                                <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.1 }}>
                                    <label className="block text-sm font-medium text-gold-100/80 mb-2 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 focus:bg-white/10 transition-all outline-none"
                                            placeholder="name@example.com"
                                        />
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gold-500 transition-colors" />
                                    </div>
                                </motion.div>

                                <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
                                    <label className="block text-sm font-medium text-gold-100/80 mb-2 ml-1">Password</label>
                                    <div className="relative group">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 focus:bg-white/10 transition-all outline-none"
                                            placeholder="••••••••"
                                        />
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gold-500 transition-colors" />
                                    </div>
                                </motion.div>

                                <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.3 }}>
                                    <label className="block text-sm font-medium text-gold-100/80 mb-2 ml-1">Confirm Password</label>
                                    <div className="relative group">
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 focus:bg-white/10 transition-all outline-none"
                                            placeholder="••••••••"
                                        />
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gold-500 transition-colors" />
                                    </div>
                                </motion.div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gradient-to-r from-gold-600 to-gold-500 text-black font-bold py-4 rounded-xl shadow-lg shadow-gold-900/20 hover:shadow-gold-500/30 hover:brightness-110 transition-all flex items-center justify-center gap-2 group mt-4"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Register
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            <p className="text-center text-gray-500">
                                Already have an account?{' '}
                                <Link href="/login" className="text-gold-500 hover:text-gold-400 font-medium hover:underline transition-all">
                                    Sign In
                                </Link>
                            </p>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-8 p-12 glass-panel rounded-[2rem] border border-white/10 shadow-2xl relative"
                        >
                            <div className="absolute top-0 right-0 p-4">
                                <Film className="w-12 h-12 text-white/5" />
                            </div>

                            <div className="w-20 h-20 bg-gold-500/10 border border-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-10 h-10 text-gold-500" />
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-3xl font-serif font-black text-white tracking-tight uppercase">Check Your Email</h2>
                                <p className="text-gray-300 font-light leading-relaxed">
                                    We've sent a verification link to <span className="text-gold-500 font-bold">{email}</span>.
                                    Please click the link to activate your account.
                                </p>
                            </div>

                            <div className="pt-4 space-y-4">
                                <Link href="/login" className="block">
                                    <button className="w-full bg-gold-gradient text-black font-bold py-4 rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 group">
                                        Back to Login
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                                <p className="text-xs text-gray-500 font-medium">
                                    Didn't receive the email? Check your spam folder or try again later.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
            {/* Global Alert Modal */}
            <AlertModal
                isOpen={alertState.isOpen}
                onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
                message={alertState.message}
                type={alertState.type}
            />
        </div>
    );
}
