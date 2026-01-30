'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAPI, Hall, Showtime } from '../../../../../lib/api/client';
import { ArrowLeft, Save, X, Upload } from 'lucide-react';
import Link from 'next/link';

export default function EditMoviePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState('');
    const [hallError, setHallError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        poster_url: '',
        background_image_url: '',
        trailer_url: '',
        duration_minutes: '',
        rating: '',
        genre: [] as string[],
        release_date: '',
        director: '',
        writers: '',
        status: 'draft',
        content_rating: '',
        tagline: ''
    });

    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);
    const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
    const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);

    // Showtime State
    const [halls, setHalls] = useState<Hall[]>([]);
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [scheduleForm, setScheduleForm] = useState({
        hall_id: '',
        date: '',
        time: '',
        end_time: ''
    });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Fetch Movie
                const data = await fetchAPI(`/admin/movies/${id}`);
                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    poster_url: data.poster_url || '',
                    background_image_url: data.background_image_url || '',
                    trailer_url: data.trailer_url || '',
                    duration_minutes: data.duration_minutes !== undefined && data.duration_minutes !== null ? String(data.duration_minutes) : '',
                    rating: data.rating !== undefined && data.rating !== null ? String(data.rating) : '',
                    genre: data.genre || [],
                    release_date: data.release_date ? data.release_date.split('T')[0] : '', // Extract YYYY-MM-DD
                    director: data.director || '',
                    writers: data.writers || '',
                    status: data.status || 'draft',
                    content_rating: data.content_rating || '',
                    tagline: data.tagline || ''
                });

                if (data.showtimes) {
                    setShowtimes(data.showtimes.map((st: any) => ({
                        id: st.id,
                        hall_id: st.hall_id,
                        start_time: st.start_time,
                        end_time: st.end_time,
                        price_matrix: st.price_matrix
                    })));
                }

                // Fetch Halls
                const hallsData = await fetchAPI('/admin/halls');
                if (Array.isArray(hallsData)) {
                    setHalls(hallsData);
                } else {
                    console.error("Halls API returned unexpected format:", hallsData);
                    setHallError('Failed to load halls: Invalid response');
                }

            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Failed to load movie/halls');
                if (err.message && err.message.includes('hall')) {
                    setHallError(err.message);
                }
            } finally {
                setIsFetching(false);
            }
        };
        loadInitialData();
    }, [id]);

    const addShowtime = () => {
        if (!scheduleForm.hall_id || !scheduleForm.date || !scheduleForm.time || !scheduleForm.end_time) {
            setError('Please fill in all showtime fields (Hall, Date, Start Time, and End Time) before adding.');
            return;
        }

        const start_time = `${scheduleForm.date}T${scheduleForm.time}:00`;
        const end_time = `${scheduleForm.date}T${scheduleForm.end_time}:00`;

        // Clear any previous error if showtime is valid
        setError('');

        setShowtimes([...showtimes, {
            hall_id: scheduleForm.hall_id,
            start_time,
            end_time
        }]);
        setScheduleForm(prev => ({ ...prev, time: '', end_time: '' }));
    };

    // Auto-calculate end time when start time changes
    useEffect(() => {
        if (scheduleForm.time && formData.duration_minutes) {
            try {
                const [hours, minutes] = scheduleForm.time.split(':').map(Number);
                const duration = parseInt(formData.duration_minutes);

                if (!isNaN(hours) && !isNaN(minutes) && !isNaN(duration)) {
                    const date = new Date();
                    date.setHours(hours, minutes, 0);

                    // Add duration + 15 mins buffer
                    date.setMinutes(date.getMinutes() + duration + 15);

                    const endHours = String(date.getHours()).padStart(2, '0');
                    const endMinutes = String(date.getMinutes()).padStart(2, '0');

                    setScheduleForm(prev => ({
                        ...prev,
                        end_time: `${endHours}:${endMinutes}`
                    }));
                }
            } catch (err) {
                console.error("Failed to calculate end time", err);
            }
        }
    }, [scheduleForm.time, formData.duration_minutes]);

    const removeShowtime = (index: number) => {
        setShowtimes(showtimes.filter((_, i) => i !== index));
    };

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

        const data = new FormData();
        data.append('_method', 'PUT'); // Laravel requires _method for file uploads via PUT
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
        if (formData.tagline) data.append('tagline', formData.tagline);
        // Note: For Update, we are sending current state of showtimes to sync
        showtimes.forEach((st, index) => {
            if (st.id) data.append(`showtimes[${index}][id]`, st.id);
            data.append(`showtimes[${index}][hall_id]`, st.hall_id);
            data.append(`showtimes[${index}][start_time]`, st.start_time);
            if (st.end_time) data.append(`showtimes[${index}][end_time]`, st.end_time);
        });

        finalGenres.forEach(g => data.append('genre[]', g));
        if (posterFile) {
            data.append('poster', posterFile);
        } else {
            data.append('poster_url', formData.poster_url);
        }

        if (backgroundFile) {
            data.append('background_image', backgroundFile);
        } else {
            data.append('background_image_url', formData.background_image_url);
        }

        try {
            await fetchAPI(`/admin/movies/${id}`, {
                method: 'POST', // Use POST with _method=PUT for multipart/form-data
                body: data
            });
            router.push('/admin/movies');
        } catch (err: any) {
            console.error('Update Failed:', err);
            if (err.body && err.body.errors) {
                const messages = Object.values(err.body.errors).flat().join(', ');
                setError(messages);
            } else {
                setError(err.message || 'Failed to update movie');
            }
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="min-h-screen bg-neutral-900 text-white p-8 flex justify-center items-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-8">
            <div className="max-w-3xl mx-auto">
                <Link href="/admin/movies" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Movies
                </Link>

                <h1 className="text-3xl font-bold font-serif text-gold-500 mb-8">Edit Movie</h1>

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
                                {(posterPreview || formData.poster_url) ? (
                                    <div className="relative w-32 h-48 rounded-lg overflow-hidden border border-white/20">
                                        <img
                                            src={posterPreview || formData.poster_url}
                                            alt="Poster preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://via.placeholder.com/300x450?text=Invalid+Image';
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPosterFile(null);
                                                setPosterPreview(null);
                                                setFormData({ ...formData, poster_url: '' });
                                            }}
                                            className="absolute top-1 right-1 bg-black/50 p-1 rounded-full hover:bg-black"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="w-full h-48 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gold-500/50 hover:bg-white/5 transition-all">
                                        <Upload className="w-8 h-8 text-gray-500 mb-2" />
                                        <span className="text-sm text-gray-400">Upload Poster Image</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setPosterFile(file);
                                                    setPosterPreview(URL.createObjectURL(file));
                                                    setFormData({ ...formData, poster_url: '' }); // Clear URL when file is uploaded
                                                }
                                            }}
                                        />
                                    </label>
                                )}
                                <div className="text-xs text-gray-500 text-center">OR</div>
                                <input
                                    type="url"
                                    value={formData.poster_url}
                                    onChange={e => {
                                        setFormData({ ...formData, poster_url: e.target.value });
                                        // Clear file upload when URL is entered
                                        if (e.target.value) {
                                            setPosterFile(null);
                                            setPosterPreview(null);
                                        }
                                    }}
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
                            <label className="text-sm font-medium text-gray-300">Background Image (Details Page Backdrop)</label>
                            <div className="flex flex-col gap-4">
                                {(backgroundPreview || formData.background_image_url) ? (
                                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-white/20">
                                        <img
                                            src={backgroundPreview || formData.background_image_url}
                                            alt="Background preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://via.placeholder.com/600x200?text=Invalid+Image';
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setBackgroundFile(null);
                                                setBackgroundPreview(null);
                                                setFormData({ ...formData, background_image_url: '' });
                                            }}
                                            className="absolute top-1 right-1 bg-black/50 p-1 rounded-full hover:bg-black"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="w-full h-32 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gold-500/50 hover:bg-white/5 transition-all">
                                        <Upload className="w-6 h-6 text-gray-500 mb-2" />
                                        <span className="text-sm text-gray-400">Upload Background Image</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setBackgroundFile(file);
                                                    setBackgroundPreview(URL.createObjectURL(file));
                                                    setFormData({ ...formData, background_image_url: '' });
                                                }
                                            }}
                                        />
                                    </label>
                                )}
                                <div className="text-xs text-gray-500 text-center">OR</div>
                                <input
                                    type="url"
                                    value={formData.background_image_url}
                                    onChange={e => {
                                        setFormData({ ...formData, background_image_url: e.target.value });
                                        if (e.target.value) {
                                            setBackgroundFile(null);
                                            setBackgroundPreview(null);
                                        }
                                    }}
                                    placeholder="Paste Background URL instead..."
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:border-gold-500 outline-none"
                                />
                            </div>
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
                            <label className="text-sm font-medium text-gray-300">Genres</label>
                            <div className="flex flex-wrap gap-3">
                                {['Action', 'Sci-Fi', 'Drama', 'Comedy', 'Horror', 'Family'].map((genre) => {
                                    const isSelected = formData.genre.includes(genre);
                                    return (
                                        <button
                                            key={genre}
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => {
                                                    const newGenres = isSelected
                                                        ? prev.genre.filter(g => g !== genre)
                                                        : [...prev.genre, genre];
                                                    return { ...prev, genre: newGenres };
                                                });
                                            }}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isSelected
                                                ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20'
                                                : 'bg-black/30 text-gray-400 border border-white/10 hover:border-gold-500/50 hover:text-white'
                                                }`}
                                        >
                                            {genre}
                                        </button>
                                    );
                                })}
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

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Experience Category</label>
                            <select
                                value={formData.tagline} // Storing in tagline
                                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 focus:border-gold-500 outline-none text-white"
                            >
                                <option value="">Select Experience</option>
                                <option value="Master Image 3D">Master Image 3D</option>
                                <option value="Plus Laser Theater">Plus Laser Theater</option>
                                <option value="STUDIO15">STUDIO15</option>
                                <option value="VIP Theatre">VIP Theatre</option>
                            </select>
                        </div>
                    </div>

                    {/* Showtime Scheduler Section */}
                    <div className="pt-8 border-t border-white/10">
                        <h2 className="text-xl font-bold text-white mb-4">Showtime Schedule</h2>

                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4 items-end bg-black/20 p-4 rounded-xl border border-white/5">
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-xs text-gray-400">Select Hall</label>
                                {hallError ? (
                                    <div className="text-red-500 text-xs p-2 bg-red-900/20 border border-red-500/50 rounded">{hallError}</div>
                                ) : (
                                    <select
                                        value={scheduleForm.hall_id}
                                        onChange={e => setScheduleForm({ ...scheduleForm, hall_id: e.target.value })}
                                        className="w-full bg-black/40 border border-white/20 rounded-lg p-2 text-sm focus:border-gold-500 outline-none"
                                    >
                                        <option value="">Select Hall...</option>
                                        {halls.map(hall => (
                                            <option key={hall.id} value={hall.id}>
                                                {hall.cinema?.name} - {hall.name} ({hall.capacity} seats)
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400">Date</label>
                                <input
                                    type="date"
                                    value={scheduleForm.date}
                                    onChange={e => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                                    className="w-full bg-black/40 border border-white/20 rounded-lg p-2 text-sm focus:border-gold-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400">Start Time</label>
                                <input
                                    type="time"
                                    value={scheduleForm.time}
                                    onChange={e => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                                    className="w-full bg-black/40 border border-white/20 rounded-lg p-2 text-sm focus:border-gold-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400">End Time</label>
                                <input
                                    type="time"
                                    value={scheduleForm.end_time}
                                    onChange={e => setScheduleForm({ ...scheduleForm, end_time: e.target.value })}
                                    className="w-full bg-black/40 border border-white/20 rounded-lg p-2 text-sm focus:border-gold-500 outline-none"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={addShowtime}
                                className="bg-gold-500 hover:bg-gold-400 text-black font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                            >
                                + Add Show
                            </button>
                        </div>

                        {/* Scheduled Showtimes List */}
                        <div className="space-y-2">
                            {showtimes.length === 0 && <p className="text-gray-500 italic text-sm">No showtimes added yet.</p>}
                            {showtimes.map((st, i) => {
                                const hall = halls.find(h => h.id === st.hall_id);
                                const date = new Date(st.start_time);
                                return (
                                    <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="px-3 py-1 bg-white/10 rounded text-xs text-gold-500 font-bold uppercase tracking-wider">
                                                {hall?.name || 'Unknown Hall'}
                                            </div>
                                            <div className="text-sm">
                                                <span className="text-white font-medium">
                                                    {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                </span>
                                                <span className="mx-2 text-gray-600">|</span>
                                                <span className="text-gray-300">
                                                    {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                                    {st.end_time && ` - ${new Date(st.end_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeShowtime(i)}
                                            className="text-red-500 hover:text-red-400 p-1"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-white/10">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gold-600 hover:bg-gold-500 text-black font-bold px-8 py-3 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
