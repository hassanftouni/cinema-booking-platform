'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Search, User, Menu, Ticket, Bell } from 'lucide-react';
import { fetchAPI } from '../../lib/api/client';
import { getEcho } from '../../lib/echo';

export default function Navbar() {
    const pathname = usePathname();
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
        setScrolled(latest > 50);
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [unreadInquiries, setUnreadInquiries] = useState(0);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUserName(null);
        setIsAdmin(false);
        window.location.href = '/';
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        const checkAdmin = (userObj: any) => {
            if (userObj && (userObj.is_admin || userObj.email === 'hassan.ftounne@gmail.com')) {
                setIsAdmin(true);
                // Fetch unread count if admin
                fetchAPI('/admin/contacts/unread-count')
                    .then(data => setUnreadInquiries(data.count))
                    .catch(e => console.error("Failed to fetch unread count", e));
            } else {
                setIsAdmin(false);
            }
        };

        if (token) {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    setUserName(user.name);
                    checkAdmin(user);
                } catch (e) { }
            }

            fetchAPI('/user')
                .then(user => {
                    localStorage.setItem('user', JSON.stringify(user));
                    setUserName(user.name);
                    checkAdmin(user);

                    if (user.is_admin || user.email === 'hassan.ftounne@gmail.com') {
                        const echo = getEcho();
                        if (echo) {
                            echo.channel('admin')
                                .listen('.contact.submitted', (e: any) => {
                                    alert(`New customer inquiry from ${e.contact.name}!`);
                                    setUnreadInquiries(prev => prev + 1);
                                });
                        }
                    }
                })
                .catch(err => {
                    console.error("Failed to sync user", err);
                    if (err.response?.status === 401) {
                        handleLogout();
                    }
                });
        }

        const handleSync = () => {
            fetchAPI('/admin/contacts/unread-count')
                .then(data => setUnreadInquiries(data.count))
                .catch(e => console.error("Failed to sync unread count", e));
        };

        window.addEventListener('sync-unread-count', handleSync);
        return () => {
            window.removeEventListener('sync-unread-count', handleSync);
        };
    }, [pathname]);

    return (
        <motion.nav
            variants={{
                visible: { y: 0 },
                hidden: { y: -100 },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-cinema-black/70 backdrop-blur-2xl border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
                : 'bg-transparent'
                }`}
        >
            <div className={`${scrolled ? 'py-4' : 'py-6'} transition-all duration-500`}>
                {userName && (
                    <div className="py-1.5 mb-2">
                        <div className="container mx-auto px-6">
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-[10px] font-black text-gold-500/80 uppercase tracking-[0.4em] text-center md:text-left"
                            >
                                Hi, <span className="text-white">{userName}</span> — Welcome Back
                            </motion.p>
                        </div>
                    </div>
                )}
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 border-2 border-gold-500 rounded-full flex items-center justify-center border-dashed group-hover:rotate-180 transition-transform duration-700">
                            <Ticket className="w-5 h-5 text-gold-500" />
                        </div>
                        <span className="text-2xl font-serif font-bold text-white tracking-wide">
                            BEIRUT SOUKS <span className="text-gold-gradient">CINEMACITY</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {['Movies', 'Cinemas', 'Experiences', 'Offers', 'Contact'].map((item) => {
                            const isActive = pathname === `/${item.toLowerCase()}` || (item === 'Contact' && pathname === '/contact');
                            return (
                                <Link
                                    key={item}
                                    href={item === 'Contact' ? '/contact' : `/${item.toLowerCase()}`}
                                    className={`text-xs font-bold transition-all uppercase tracking-[0.2em] relative group ${isActive ? 'text-gold-500' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {item}
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-active"
                                            className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gold-500 shadow-[0_0_10px_rgba(234,179,8,0.7)]"
                                        />
                                    )}
                                    {!isActive && (
                                        <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-white group-hover:w-full group-hover:left-0 transition-all duration-300" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="text-white hover:text-gold-500 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>

                        {isLoggedIn ? (
                            <div className="hidden md:flex items-center gap-4">
                                {isAdmin && (
                                    <>
                                        <Link href="/admin/movies" className="text-sm font-medium text-gray-300 hover:text-gold-400">Admin</Link>
                                        <Link href="/admin/offers" className="text-sm font-medium text-gray-300 hover:text-gold-400">Offers</Link>
                                        <Link href="/admin/contacts" className="text-sm font-medium text-gray-300 hover:text-gold-400 relative">
                                            Inquiries
                                            {unreadInquiries > 0 && (
                                                <span className="absolute -top-2 -right-4 bg-gold-500 text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-black animate-pulse">
                                                    {unreadInquiries}
                                                </span>
                                            )}
                                        </Link>
                                    </>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-5 py-2 rounded-full border border-red-500/20 hover:border-red-500 hover:bg-red-500/10 transition-all text-sm font-medium text-white group"
                                >
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 hover:border-gold-500 hover:bg-gold-500/10 transition-all text-sm font-medium text-white group">
                                <User className="w-4 h-4 group-hover:text-gold-500 transition-colors" />
                                <span>Sign In</span>
                            </Link>
                        )}

                        <button className="md:hidden text-white">
                            <Menu className="w-6 h-6" />
                        </button>

                        {isLoggedIn && (
                            <div className="md:hidden flex items-center gap-2">
                                {isAdmin && <Link href="/admin/movies" className="text-xs text-gold-500 border border-gold-500/30 px-2 py-1 rounded">Admin</Link>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
