'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, User, Globe, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/ui/Navbar';
import Footer from '../../../components/ui/Footer';
import { fetchAPI } from '../../../lib/api/client';

export default function ContactPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLoggedIn) {
            router.push('/login');
            return;
        }

        setStatus('loading');
        try {
            const res = await fetchAPI('/contact', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            setStatus('success');
            setMessage(res.message);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        } catch (error: any) {
            console.error(error);
            setStatus('error');
            setMessage(error.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <main className="min-h-screen bg-cinema-black text-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-cinema-black to-transparent" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="z-10 text-center space-y-4"
                >
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white">Contact <span className="text-gold-gradient">Us</span></h1>
                    <p className="text-gray-400 uppercase tracking-[0.3em] text-sm">We're here to help you</p>
                </motion.div>
            </section>

            <section className="container mx-auto px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

                    {/* Info Side */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-4xl font-serif font-bold text-white">Get in Touch</h2>
                            <p className="text-gray-400 font-light leading-relaxed text-lg max-w-lg">
                                Have a question about a screening, a private event, or our VIP services? Our concierge team is available 24/7 to assist you.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {[
                                { icon: MapPin, title: 'Our Location', detail: 'Beirut Souks, Downtown, Beirut, Lebanon', color: 'text-blue-500' },
                                { icon: Mail, title: 'Email Us', detail: 'concierge@cinemacity.beirut', color: 'text-gold-500' },
                                { icon: Phone, title: 'Call Us', detail: '+961 1 999 000', color: 'text-green-500' },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-6 group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-gold-500 transition-colors shadow-xl">
                                        <item.icon className={`w-6 h-6 ${item.color}`} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">{item.title}</h4>
                                        <p className="text-gray-500">{item.detail}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Social Links */}
                        <div className="pt-10 border-t border-white/5">
                            <p className="text-xs uppercase tracking-widest text-gray-500 mb-6 font-bold">Follow Our Journey</p>
                            <div className="flex gap-4">
                                {['Facebook', 'Instagram', 'Twitter'].map((s) => (
                                    <a key={s} href="#" className="px-6 py-2 rounded-full border border-white/10 text-sm text-gray-400 hover:text-gold-500 hover:border-gold-500 transition-all uppercase tracking-widest font-bold">
                                        {s}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl relative"
                    >
                        {!isLoggedIn ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20">
                                <div className="w-20 h-20 bg-gold-500/10 text-gold-500 rounded-full flex items-center justify-center">
                                    <Lock className="w-10 h-10" />
                                </div>
                                <h3 className="text-3xl font-serif font-bold text-white">Guest Access Restricted</h3>
                                <p className="text-gray-400 max-w-xs mx-auto">Please sign in to your account to send us a message or inquiry.</p>
                                <button
                                    onClick={() => router.push('/login')}
                                    className="px-10 py-4 bg-gold-600 hover:bg-gold-500 text-black font-bold rounded-xl uppercase tracking-widest text-sm transition-all"
                                >
                                    Sign In Now
                                </button>
                            </div>
                        ) : status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20"
                            >
                                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                                    <Send className="w-10 h-10" />
                                </div>
                                <h3 className="text-3xl font-serif font-bold text-white">Message Sent!</h3>
                                <p className="text-gray-400 max-w-xs mx-auto">{message}</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="text-gold-500 hover:underline font-bold uppercase tracking-widest text-sm"
                                >
                                    Send another message
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1">Your Name</label>
                                        <div className="relative group">
                                            <input
                                                required
                                                type="text"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-12 py-4 outline-none focus:border-gold-500 transition-all"
                                                placeholder="John Doe"
                                            />
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                                        <div className="relative group">
                                            <input
                                                required
                                                type="email"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-12 py-4 outline-none focus:border-gold-500 transition-all"
                                                placeholder="john@example.com"
                                            />
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 ml-1">Subject (Optional)</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-12 py-4 outline-none focus:border-gold-500 transition-all"
                                            placeholder="VIP Inquiry..."
                                        />
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 ml-1">Your Message</label>
                                    <div className="relative group">
                                        <textarea
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-12 py-4 outline-none focus:border-gold-500 transition-all resize-none"
                                            placeholder="Tell us how we can help..."
                                        />
                                        <MessageSquare className="absolute left-4 top-6 w-5 h-5 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                                    </div>
                                </div>

                                {status === 'error' && <p className="text-red-500 text-sm text-center">{message}</p>}

                                <button
                                    disabled={status === 'loading'}
                                    className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-black font-bold rounded-xl flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {status === 'loading' ? (
                                        <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
