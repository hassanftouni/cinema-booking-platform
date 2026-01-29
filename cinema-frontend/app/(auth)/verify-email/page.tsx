'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';
import { fetchAPI } from '../../../lib/api/client';

export default function VerifyEmail() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email address...');

    useEffect(() => {
        const verify = async () => {
            const id = searchParams.get('id');
            const hash = searchParams.get('hash');
            const expires = searchParams.get('expires');
            const signature = searchParams.get('signature');

            if (!id || !hash || !signature || !expires) {
                setStatus('error');
                setMessage('Invalid verification link.');
                return;
            }

            try {
                const response = await fetchAPI(`/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`, {
                    method: 'GET',
                });
                setStatus('success');
                setMessage(response.message || 'Email verified successfully!');

                // Update local storage user if exists
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    user.email_verified_at = new Date().toISOString();
                    localStorage.setItem('user', JSON.stringify(user));
                }
            } catch (err: any) {
                console.error(err);
                setStatus('error');
                setMessage(err.message || 'Verification failed. The link may have expired.');
            }
        };

        verify();
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-cinema-black p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full glass-panel p-12 rounded-[2.5rem] text-center border border-white/10 shadow-2xl relative overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-gold-600/10 blur-[80px] rounded-full" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-gold-600/10 blur-[80px] rounded-full" />

                <div className="relative z-10 space-y-8">
                    {status === 'loading' && (
                        <div className="flex flex-col items-center gap-6">
                            <Loader2 className="w-16 h-16 text-gold-500 animate-spin" />
                            <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Verifying...</h1>
                            <p className="text-gray-400 font-light leading-relaxed">Please wait while we secure your account.</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-2">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <h1 className="text-3xl font-serif font-black text-white tracking-tight">Success!</h1>
                            <p className="text-gray-300 font-light leading-relaxed">{message}</p>
                            <Link href="/" className="w-full">
                                <button className="w-full bg-gold-gradient text-black font-bold py-4 rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 group">
                                    Continue to Cinema City
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-2">
                                <XCircle className="w-10 h-10 text-red-500" />
                            </div>
                            <h1 className="text-3xl font-serif font-black text-white tracking-tight">Oops!</h1>
                            <p className="text-gray-300 font-light leading-relaxed">{message}</p>
                            <div className="flex flex-col gap-4 w-full">
                                <Link href="/login" className="w-full">
                                    <button className="w-full bg-white/5 border border-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/10 transition-all">
                                        Back to Login
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
