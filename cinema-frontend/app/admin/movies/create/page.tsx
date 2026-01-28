'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '../../../../lib/api/client';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import Link from 'next/link';

export default function CreateMoviePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        poster_url: '',
        trailer_url: '',
        duration_minutes: '',
        rating: '',
        genre: [] as string[],
        release_date: '',
        director: '',
        writers: '',
        status: 'now_showing',
        content_rating: ''
    });

    const [genreInput, setGenreInput] = useState('');

    const handleGenreAdd = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && genreInput.trim()) {
            e.preventDefault();
            if (!formData.genre.includes(genreInput.trim())) {
                setFormData(prev => ({ ...prev, genre: [...prev.genre, genreInput.trim()] }));
            }
            setGenreInput('');
        }
    };

    const handleGenreRemove = (genre: string) => {
        setFormData(prev => ({ ...prev, genre: prev.genre.filter(g => g !== genre) }));
    };

    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPosterFile(file);
            setPosterPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const finalGenres = [...formData.genre];
        if (genreInput.trim() && !finalGenres.includes(genreInput.trim())) {
            finalGenres.push(genreInput.trim());
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('duration_minutes', formData.duration_minutes);
        data.append('rating', formData.rating);
        data.append('release_date', formData.release_date);
        data.append('status', formData.status);
        if (formData.director) data.append('director', formData.director);
        if (formData.writers) data.append('writers', formData.writers);
        if (formData.trailer_url) data.append('trailer_url', formData.trailer_url);
        data.append('content_rating', formData.content_rating);

        finalGenres.forEach(g => data.append('genre[]', g));
        if (posterFile) {
            data.append('poster', posterFile);
        } else if (formData.poster_url) {
            data.append('poster_url', formData.poster_url);
        }

        try {
            await fetchAPI('/admin/movies', {
                method: 'POST',
                body: data
            });
            router.push('/admin/movies');
        } catch (err: any) {
            console.error('Submission Failed:', err);
            if (err.body && err.body.errors) {
                const messages = Object.values(err.body.errors).flat().join(', ');
                setError(messages);
            } else {
                setError(err.message || 'Failed to create movie');
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-8">
            <div className="max-w-3xl mx-auto">
                <Link href="/admin/movies" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Movies
                </Link>

                <h1 className="text-3xl font-bold font-serif text-gold-500 mb-8">Add New Movie</h1>

                <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 border border-white/10 p-8 rounded-xl">
                    {error && (
                        <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-400 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Title</label>
                            <input
                                required
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:border-gold-500 outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Release Date</label>
                            <input
                                required
                                type="date"
                                value={formData.release_date}
                                onChange={e => setFormData({ ...formData, release_date: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:border-gold-500 outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Director</label>
                            <input
                                type="text"
                                value={formData.director}
                                onChange={e => setFormData({ ...formData, director: e.target.value })}
                                placeholder="e.g. Denis Villeneuve"
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:border-gold-500 outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Writers</label>
                            <input
                                type="text"
                                value={formData.writers}
                                onChange={e => setFormData({ ...formData, writers: e.target.value })}
                                placeholder="e.g. Jon Spaihts, Denis Villeneuve"
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:border-gold-500 outline-none"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-300">Description</label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:border-gold-500 outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Movie Poster</label>
                            <div className="flex flex-col gap-4">
                                {posterPreview ? (
                                    <div className="relative w-32 h-48 rounded-lg overflow-hidden border border-white/20">
                                        <img src={posterPreview} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => { setPosterFile(null); setPosterPreview(null); }}
                                            className="absolute top-1 right-1 bg-black/50 p-1 rounded-full hover:bg-black"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="w-full h-48 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gold-500/50 hover:bg-white/5 transition-all">
                                        <Upload className="w-8 h-8 text-gray-500 mb-2" />
                                        <span className="text-sm text-gray-400">Upload Poster Image</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                )}
                                <div className="text-xs text-gray-500 text-center">OR</div>
                                <input
                                    type="url"
                                    value={formData.poster_url}
                                    onChange={e => setFormData({ ...formData, poster_url: e.target.value })}
                                    placeholder="Paste Image URL instead..."
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:border-gold-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Trailer URL (Optional)</label>
                            <input
                                type="url"
                                value={formData.trailer_url}
                                onChange={e => setFormData({ ...formData, trailer_url: e.target.value })}
                                placeholder="https://..."
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:border-gold-500 outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Duration (mins)</label>
                            <input
                                required
                                type="number"
                                value={formData.duration_minutes}
                                onChange={e => setFormData({ ...formData, duration_minutes: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:border-gold-500 outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Rating (0-10)</label>
                            <input
                                required
                                type="number"
                                step="0.1"
                                max="10"
                                value={formData.rating}
                                onChange={e => setFormData({ ...formData, rating: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:border-gold-500 outline-none"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-300">Genres (Press Enter to add)</label>
                            <input
                                type="text"
                                value={genreInput}
                                onChange={e => setGenreInput(e.target.value)}
                                onKeyDown={handleGenreAdd}
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:border-gold-500 outline-none"
                                placeholder="Sci-Fi, Action..."
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.genre.map(g => (
                                    <span key={g} className="px-2 py-1 bg-gold-900/40 text-gold-500 rounded text-sm flex items-center gap-1">
                                        {g}
                                        <button type="button" onClick={() => handleGenreRemove(g)} className="hover:text-white"><X className="w-3 h-3" /></button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Status</label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:border-gold-500 outline-none text-white"
                            >
                                <option value="draft">Draft</option>
                                <option value="now_showing">Now Selling</option>
                                <option value="coming_soon">Coming Soon</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Content Rating Badge</label>
                            <select
                                value={formData.content_rating}
                                onChange={e => setFormData({ ...formData, content_rating: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:border-gold-500 outline-none text-white"
                            >
                                <option value="">None</option>
                                <option value="+18">+18 (Adults Only)</option>
                                <option value="+16">+16 (Mature)</option>
                                <option value="PG-13">PG-13</option>
                                <option value="Family">Family Friendly</option>
                                <option value="Couples">Ideal for Couples</option>
                                <option value="Kids">Kids</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-white/10">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gold-600 hover:bg-gold-500 text-black font-bold px-8 py-3 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Movie</>}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}
