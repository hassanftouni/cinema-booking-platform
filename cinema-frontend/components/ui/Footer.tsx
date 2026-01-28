'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Ticket } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-cinema-black border-t border-white/5 pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 border-2 border-gold-500 rounded-full flex items-center justify-center border-dashed">
                                <Ticket className="w-5 h-5 text-gold-500" />
                            </div>
                            <span className="text-2xl font-serif font-bold text-white tracking-wide">
                                BEIRUT SOUKS <span className="text-gold-gradient">CINEMACITY</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed font-light">
                            Experience the pinnacle of cinematic luxury. From IMAX to VIP Lounges, we redefine what it means to go to the movies.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-gold-500 hover:border-gold-500 transition-all">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Quick Links</h4>
                        <ul className="space-y-4">
                            {['Movies', 'Cinemas', 'Experiences', 'Offers', 'About Us', 'Contact'].map((link) => (
                                <li key={link}>
                                    <Link href={link === 'Contact' ? '/contact' : `/${link.toLowerCase()}`} className="text-gray-400 hover:text-gold-500 transition-colors">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Legal & Support</h4>
                        <ul className="space-y-4">
                            {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Refund Policy', 'FAQ'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Get In Touch</h4>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-gold-500" />
                                </div>
                                <span className="text-gray-400 text-sm">Beirut Souks, Downtown,<br />Beirut, Lebanon</span>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-5 h-5 text-gold-500" />
                                </div>
                                <span className="text-gray-400 text-sm">+961 1 999 000</span>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 text-gold-500" />
                                </div>
                                <span className="text-gray-400 text-sm">info@cinemacity.beirut</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-xs uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} Beirut Souks Cinemacity. All Rights Reserved.
                    </p>
                    <div className="flex gap-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
