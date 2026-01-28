'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Film, Star } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { fetchAPI } from '../../../lib/api/client';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await fetchAPI('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      // Store token and user details
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Redirect
      router.push('/');
    } catch (err: any) {
      console.error(err);
      setError('Invalid credentials');
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
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold-600/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-red-900/10 blur-[100px]" />
      </div>

      {/* Left Section - Visuals */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-black via-transparent to-cinema-black/80" />

        <div className="z-10 text-center space-y-6 max-w-lg">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 mx-auto border-2 border-gold-500 rounded-full flex items-center justify-center border-dashed mb-8"
          >
            <Film className="w-10 h-10 text-gold-500" />
          </motion.div>

          <h1 className="text-5xl font-serif font-bold text-white mb-4">
            Welcome to <span className="text-gold-gradient">Beirut Souks Cinemacity</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light">
            Experience the magic of cinema in unrivaled luxury.
            Join our exclusive community for VIP access, early screenings, and more.
          </p>

          <div className="flex justify-center gap-2 mt-8">
            {[1, 2, 3, 4, 5].map((star, i) => (
              <motion.div
                key={star}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
              >
                <Star className="w-5 h-5 text-gold-500 fill-gold-500" />
              </motion.div>
            ))}
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
        <div className="w-full max-w-md space-y-10">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-gray-400">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}
            <motion.div variants={fadeInUp} initial="initial" animate="animate">
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

            <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.1 }}>
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-white/5 checked:bg-gold-500 checked:border-gold-500 focus:ring-gold-500/30 transition-all" />
                <span className="text-gray-400 group-hover:text-gold-200 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-gold-500 hover:text-gold-400 transition-colors font-medium">Forgot password?</a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-gold-600 to-gold-500 text-black font-bold py-4 rounded-xl shadow-lg shadow-gold-900/20 hover:shadow-gold-500/30 hover:brightness-110 transition-all flex items-center justify-center gap-2 group"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-gray-500">
            Don't have an account?{' '}
            <Link href="/register" className="text-gold-500 hover:text-gold-400 font-medium hover:underline transition-all">
              Create Account
            </Link>
          </p>
        </div>

        {/* Floating Abstract Element */}
        <div className="absolute bottom-10 right-10 text-xs text-gray-700 font-mono">
          SECURE SYSTEM v2.0
        </div>
      </motion.div>
    </div>
  );
}
