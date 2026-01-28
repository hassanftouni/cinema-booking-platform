'use client';

import { useState, useEffect } from 'react';
import { fetchAPI } from '../../../lib/api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Clock, CheckCircle, Circle, ArrowLeft, Home, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { getEcho } from '../../../lib/echo';

interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: 'unread' | 'read' | 'replied';
    created_at: string;
}

export default function AdminContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    useEffect(() => {
        const loadContacts = async () => {
            try {
                const data = await fetchAPI('/admin/contacts');
                setContacts(data.data || []);
            } catch (error) {
                console.error("Failed to fetch contacts", error);
            } finally {
                setLoading(false);
            }
        };
        loadContacts();

        // Real-time listener for new inquiries
        const echo = getEcho();
        if (echo) {
            echo.channel('admin')
                .listen('.contact.submitted', (e: any) => {
                    console.log('New Contact Inquiry:', e.contact);
                    setContacts(prev => [e.contact, ...prev]);
                    // Optional: Show a sound or browser notification here
                    if (Notification.permission === 'granted') {
                        new Notification("New Cinema Inquiry", { body: `From: ${e.contact.name}` });
                    }
                });
        }

        return () => {
            // No-op: We keep the admin channel open for the Navbar notifications
        };
    }, []);

    const updateStatus = async (id: number, status: string) => {
        try {
            await fetchAPI(`/admin/contacts/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status })
            });
            setContacts(prev => prev.map(c => c.id === id ? { ...c, status: status as any } : c));
            if (selectedContact?.id === id) {
                setSelectedContact(prev => prev ? { ...prev, status: status as any } : null);
            }
            // Notify navbar to sync
            window.dispatchEvent(new Event('sync-unread-count'));
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleSelectContact = (contact: Contact) => {
        setSelectedContact(contact);
        if (contact.status === 'unread') {
            updateStatus(contact.id, 'read');
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/movies" className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-gold-500">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-gold-500">
                            <Home className="w-6 h-6" />
                        </Link>
                        <h1 className="text-3xl font-bold font-serif text-gold-500 tracking-tight">Customer Inquiries</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* List Side */}
                    <div className="lg:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
                        {loading ? (
                            <div className="text-center py-20 text-gray-500">Loading inquiries...</div>
                        ) : contacts.length === 0 ? (
                            <div className="text-center py-20 text-gray-500 bg-white/5 rounded-2xl border border-white/5">No inquiries yet.</div>
                        ) : (
                            contacts.map((contact) => (
                                <motion.div
                                    key={contact.id}
                                    layoutId={`contact-${contact.id}`}
                                    onClick={() => handleSelectContact(contact)}
                                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedContact?.id === contact.id
                                        ? 'bg-gold-500/10 border-gold-500 shadow-lg'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        } ${contact.status === 'unread' ? 'ring-1 ring-gold-500/50' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg truncate flex-1">{contact.name}</h3>
                                        {contact.status === 'unread' && (
                                            <span className="w-2 h-2 bg-gold-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,1)]" />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-400 mb-3 truncate font-light italic">"{contact.subject || 'No Subject'}"</p>
                                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                                        <span>{new Date(contact.created_at).toLocaleDateString()}</span>
                                        <span className={contact.status === 'unread' ? 'text-gold-500' : 'text-gray-600'}>{contact.status}</span>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Detail Side */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {selectedContact ? (
                                <motion.div
                                    key={selectedContact.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl h-full flex flex-col"
                                >
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h2 className="text-3xl font-serif font-bold text-white mb-1">{selectedContact.name}</h2>
                                            <p className="text-gold-500 text-sm">{selectedContact.subject || 'General Inquiry'}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateStatus(selectedContact.id, 'replied')}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase transition-all ${selectedContact.status === 'replied'
                                                    ? 'bg-green-500/20 border-green-500 text-green-500'
                                                    : 'border-white/10 text-gray-400 hover:border-green-500 hover:text-green-500'
                                                    }`}
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                {selectedContact.status === 'replied' ? 'Marked as Replied' : 'Mark as Replied'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 pb-10 border-b border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Email</p>
                                                <a href={`mailto:${selectedContact.email}`} className="text-sm font-medium hover:text-gold-500 transition-colors">{selectedContact.email}</a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Phone</p>
                                                <a href={`tel:${selectedContact.phone}`} className="text-sm font-medium hover:text-gold-500 transition-colors">{selectedContact.phone || 'N/A'}</a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Received</p>
                                                <p className="text-sm font-medium">{new Date(selectedContact.created_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <MessageCircle className="w-4 h-4" />
                                            Message Content
                                        </h4>
                                        <div className="bg-black/20 rounded-2xl p-6 border border-white/5 min-h-[200px] text-lg font-light leading-relaxed">
                                            {selectedContact.message}
                                        </div>
                                    </div>

                                    <div className="mt-10 pt-10 border-t border-white/5">
                                        <div className="flex gap-4">
                                            <a
                                                href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                                                className="px-8 py-3 bg-gold-600 hover:bg-gold-500 text-black font-bold rounded-xl transition-all shadow-lg shadow-gold-600/20"
                                            >
                                                Reply via Email
                                            </a>
                                            {selectedContact.phone && (
                                                <a
                                                    href={`tel:${selectedContact.phone}`}
                                                    className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold rounded-xl transition-all"
                                                >
                                                    Call Customer
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-white/5 rounded-3xl p-20">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                        <Mail className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-xl font-medium">Select an inquiry to view details</h3>
                                    <p className="text-sm max-w-xs text-center mt-2">View customers' messages and contact them directly via email or phone.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </div>
    );
}
