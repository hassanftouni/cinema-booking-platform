'use client';

import { useState, useEffect } from 'react';
import { fetchAPI, Offer } from '../../../lib/api/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, Edit2, Trash2, X, Check, Save,
    Image as ImageIcon, Tag, Calendar, Layout,
    ArrowLeft, Home, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { AlertModal, ConfirmModal } from '../../../components/ui/Modal';

export default function AdminOffersPage() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState<Partial<Offer> | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Alert Modal State
    const [alertState, setAlertState] = useState<{ isOpen: boolean; message: string; type: 'success' | 'error' | 'info' }>({
        isOpen: false,
        message: '',
        type: 'info'
    });

    // Confirm Modal State
    const [confirmState, setConfirmState] = useState<{ isOpen: boolean; message: string; title: string; onConfirm: () => void; type: 'danger' | 'warning' | 'info' }>({
        isOpen: false,
        message: '',
        title: '',
        onConfirm: () => { },
        type: 'warning'
    });

    useEffect(() => {
        loadOffers();
    }, []);

    const loadOffers = async () => {
        try {
            const data = await fetchAPI('/admin/offers');
            setOffers(data.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = new FormData();

            // Append all fields to FormData
            if (editingOffer?.title) formData.append('title', editingOffer.title);
            if (editingOffer?.description) formData.append('description', editingOffer.description);
            if (editingOffer?.discount_code) formData.append('discount_code', editingOffer.discount_code);
            if (editingOffer?.discount_percentage) formData.append('discount_percentage', editingOffer.discount_percentage.toString());
            if (editingOffer?.expires_at) formData.append('expires_at', editingOffer.expires_at);
            formData.append('is_active', (editingOffer?.is_active ?? true).toString());

            if (imageFile) {
                formData.append('image', imageFile);
            }

            const isUpdate = !!editingOffer?.id;
            const endpoint = isUpdate ? `/admin/offers/${editingOffer.id}` : '/admin/offers';

            if (isUpdate) {
                formData.append('_method', 'PUT');
            }

            await fetchAPI(endpoint, {
                method: 'POST',
                body: formData
            });

            setIsModalOpen(false);
            setEditingOffer(null);
            setImageFile(null);
            loadOffers();
        } catch (error) {
            console.error(error);
            setAlertState({
                isOpen: true,
                message: "Failed to save offer.",
                type: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        setConfirmState({
            isOpen: true,
            title: 'Delete Offer',
            message: 'Are you sure you want to delete this offer? This action cannot be undone.',
            type: 'danger',
            onConfirm: async () => {
                try {
                    await fetchAPI(`/admin/offers/${id}`, { method: 'DELETE' });
                    setAlertState({
                        isOpen: true,
                        message: "Offer deleted successfully",
                        type: 'success'
                    });
                    loadOffers();
                } catch (error) {
                    console.error(error);
                    setAlertState({
                        isOpen: true,
                        message: "Failed to delete offer",
                        type: 'error'
                    });
                }
            }
        });
    };

    const filteredOffers = offers.filter(o =>
        o.title.toLowerCase().includes(search.toLowerCase()) ||
        o.discount_code?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/movies" className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-gold-500">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-gold-500">
                            <Home className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold font-serif text-gold-500 tracking-tight">Campaign Manager</h1>
                            <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Dynamic Offers & Rewards</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search campaigns..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-gold-500/50 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => { setEditingOffer({ is_active: true }); setIsModalOpen(true); }}
                            className="bg-gold-600 hover:bg-gold-500 text-black font-bold px-6 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-gold-600/20"
                        >
                            <Plus className="w-5 h-5" />
                            New Offer
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [1, 2, 3].map(i => <div key={i} className="h-64 bg-white/5 animate-pulse rounded-3xl" />)
                    ) : filteredOffers.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-gray-500">No campaigns found.</div>
                    ) : (
                        filteredOffers.map((offer) => (
                            <motion.div
                                key={offer.id}
                                layoutId={`offer-${offer.id}`}
                                className={`bg-white/5 border border-white/10 rounded-3xl p-6 overflow-hidden relative group ${!offer.is_active ? 'opacity-50 grayscale' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${offer.is_active ? 'bg-gold-500/10 text-gold-500' : 'bg-gray-500/10 text-gray-500'}`}>
                                        <Tag className="w-6 h-6" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setEditingOffer(offer); setIsModalOpen(true); }}
                                            className="p-2 hover:bg-gold-500/10 text-gray-400 hover:text-gold-500 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(offer.id)}
                                            className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-2 group-hover:text-gold-500 transition-colors uppercase tracking-tight">{offer.title}</h3>
                                <p className="text-gray-400 text-sm line-clamp-2 mb-6 font-light">{offer.description}</p>

                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Status</span>
                                        <span className={`text-xs font-bold ${offer.is_active ? 'text-green-500' : 'text-gray-500'}`}>
                                            {offer.is_active ? 'LIVE' : 'INACTIVE'}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Discount</span>
                                        <p className="text-lg font-black text-gold-500">-{offer.discount_percentage || 0}%</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsModalOpen(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative bg-neutral-900 border border-white/10 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl"
                            >
                                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-serif font-bold text-white">
                                            {editingOffer?.id ? 'Edit Campaign' : 'Launch New Campaign'}
                                        </h2>
                                        <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Fill in the details below</p>
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-gray-500">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Offer Title</label>
                                                <div className="relative">
                                                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                    <input
                                                        required
                                                        value={editingOffer?.title || ''}
                                                        onChange={e => setEditingOffer({ ...editingOffer, title: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-gold-500/50 transition-all"
                                                        placeholder="Summer Blockbuster Deal"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Offer Image</label>
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={e => setImageFile(e.target.files?.[0] || null)}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold-500/50 transition-all text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-gold-500 file:text-black hover:file:bg-gold-400"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Campaign Description</label>
                                            <textarea
                                                required
                                                rows={4}
                                                value={editingOffer?.description || ''}
                                                onChange={e => setEditingOffer({ ...editingOffer, description: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold-500/50 transition-all resize-none"
                                                placeholder="Tell customers what they get..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Promo Code</label>
                                                <input
                                                    value={editingOffer?.discount_code || ''}
                                                    onChange={e => setEditingOffer({ ...editingOffer, discount_code: e.target.value.toUpperCase() })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold-500/50 transition-all uppercase tracking-widest"
                                                    placeholder="GOLD25"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Discount %</label>
                                                <input
                                                    type="number"
                                                    value={editingOffer?.discount_percentage || ''}
                                                    onChange={e => setEditingOffer({ ...editingOffer, discount_percentage: parseInt(e.target.value) })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold-500/50 transition-all"
                                                    placeholder="25"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Expiry Date</label>
                                                <input
                                                    type="datetime-local"
                                                    value={editingOffer?.expires_at ? new Date(editingOffer.expires_at).toISOString().slice(0, 16) : ''}
                                                    onChange={e => setEditingOffer({ ...editingOffer, expires_at: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold-500/50 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => setEditingOffer({ ...editingOffer, is_active: !editingOffer?.is_active })}
                                                className={`w-12 h-6 rounded-full transition-all relative ${editingOffer?.is_active ? 'bg-gold-500' : 'bg-gray-700'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editingOffer?.is_active ? 'left-7' : 'left-1'}`} />
                                            </button>
                                            <span className="text-sm font-bold text-gray-400">Campaign is currently {editingOffer?.is_active ? 'Active' : 'Draft'}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            disabled={isSubmitting}
                                            type="submit"
                                            className="flex-1 px-8 py-4 bg-gold-600 hover:bg-gold-500 text-black font-bold rounded-2xl transition-all shadow-lg shadow-gold-600/20 flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                                            {editingOffer?.id ? 'Update Campaign' : 'Launch Campaign'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>

            {/* Global Modals */}
            <AlertModal
                isOpen={alertState.isOpen}
                onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
                message={alertState.message}
                type={alertState.type}
            />

            <ConfirmModal
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmState.onConfirm}
                title={confirmState.title}
                message={confirmState.message}
                type={confirmState.type}
                confirmText="Delete Offer"
            />
        </div>
    );
}
