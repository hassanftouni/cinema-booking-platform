'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, User, Menu, X, Ticket } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { fetchAPI } from '../../lib/api/client';
import { getEcho } from '../../lib/echo';

export default function Navbar() {
    const pathname = usePathname();
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        // Don't hide navbar if mobile menu is open
        if (latest > previous && latest > 150 && !mobileMenuOpen) {
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
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        const checkAdmin = (userObj: any) => {
            if (userObj && (userObj.is_admin || userObj.email === 'hassan.ftounne@gmail.com')) {
                setIsAdmin(true);
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
    }, [pathname]);

    return (
        <>
            <motion.nav
                variants={{
                    visible: { y: 0 },
                    hidden: { y: -100 },
                }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || mobileMenuOpen
                    ? 'bg-cinema-black/70 backdrop-blur-2xl border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
                    : 'bg-transparent'
                    }`}
            >
                <div className={`${scrolled && !mobileMenuOpen ? 'py-4' : 'py-6'} transition-all duration-500`}>
                    {userName && !mobileMenuOpen && (
                        <div className="py-1.5 mb-2 hidden md:block">
                            <div className="container mx-auto px-6">
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-[10px] font-black text-gold-500/80 uppercase tracking-[0.4em] text-center md:text-left truncate"
                                >
                                    Hi, <span className="text-white">{userName}</span> — Welcome Back
                                </motion.p>
                            </div>
                        </div>
                    )}
                    <div className="container mx-auto px-6 flex items-center justify-between">
                        {/* Logo - Hidden on mobile when menu open */}
                        <Link href="/" className={`${mobileMenuOpen ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible'} flex items-center gap-2 group z-[70] relative transition-all duration-300`}>
                            <img src="/logo.png" className="w-10 h-10 md:w-12 md:h-12 object-contain" alt="Cinemacity Logo" />
                            <span className="text-xl md:text-2xl font-serif font-bold text-white tracking-wide">
                                BEIRUT SOUKS <span className="text-gold-gradient">CINEMACITY</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
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
                            {/* Search - Hidden on mobile when menu open */}
                            <button className={`${mobileMenuOpen ? 'opacity-0 invisible' : 'opacity-100 visible'} text-white hover:text-gold-500 transition-all duration-300`}>
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Sign In / User - Desktop only */}
                            <div className="hidden md:flex items-center gap-4">
                                {isLoggedIn ? (
                                    <div className="flex items-center gap-4">
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
                                    <Link href="/login" className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 hover:border-gold-500 hover:bg-gold-500/10 transition-all text-sm font-medium text-white group">
                                        <User className="w-4 h-4 group-hover:text-gold-500 transition-colors" />
                                        <span>Sign In</span>
                                    </Link>
                                )}
                            </div>

                            {/* Mobile Toggle Button - Forced z-80 to be above overlay */}
                            <button
                                className="md:hidden text-white z-[80] relative p-3 -mr-2"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle Menu"
                            >
                                {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay - Outside motion.nav for perfect centering */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-neutral-950/98 backdrop-blur-3xl z-[60] md:hidden flex flex-col items-center justify-center px-6"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="absolute top-6 right-6 text-white hover:text-gold-500 transition-colors z-[70] p-2"
                            aria-label="Close Menu"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-sm flex flex-col items-center space-y-6"
                        >
                            {['Movies', 'Cinemas', 'Experiences', 'Offers', 'Contact'].map((item, i) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    className="w-full text-center"
                                >
                                    <Link
                                        href={item === 'Contact' ? '/contact' : `/${item.toLowerCase()}`}
                                        className="text-4xl font-serif font-bold text-white hover:text-gold-500 transition-colors py-2 block"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item}
                                    </Link>
                                </motion.div>
                            ))}

                            <div className="w-1/3 h-px bg-white/20 my-2" />

                            {isLoggedIn ? (
                                <div className="space-y-4 w-full">
                                    {isAdmin && (
                                        <div className="flex flex-col gap-3 w-full">
                                            <Link href="/admin/movies" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-gray-400 hover:text-gold-500 transition-colors text-center">
                                                Admin Movies
                                            </Link>
                                            <Link href="/admin/cinemas" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-gray-400 hover:text-gold-500 transition-colors text-center">
                                                Admin Cinemas
                                            </Link>
                                            <Link href="/admin/offers" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-gray-400 hover:text-gold-500 transition-colors text-center">
                                                Admin Offers
                                            </Link>
                                            <Link href="/admin/contacts" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-gray-400 hover:text-gold-500 transition-colors text-center">
                                                Inquiries
                                            </Link>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full py-3 rounded-xl border border-red-500/30 text-red-500 font-bold uppercase tracking-[0.2em] text-[10px] bg-red-500/5 hover:bg-red-500/10 transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="pt-2 w-full">
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-full block py-4 rounded-xl bg-gold-600 text-black font-bold text-center uppercase tracking-widest text-[12px] shadow-lg hover:bg-gold-500 transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
