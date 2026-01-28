const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const isFormData = options.body instanceof FormData;

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        const error = new Error(errorBody.message || `API Error: ${res.statusText}`);
        (error as any).response = res; // Attach raw response if needed
        (error as any).body = errorBody; // Attach parsed body
        throw error;
    }

    return res.json();
}

export interface Movie {
    id: string;
    title: string;
    poster_url: string;
    rating: number;
    genre: string[];
    duration_minutes: number;
    description?: string;
    tagline?: string;
    backdrop?: string;
    trailer_url?: string;
    director?: string;
    writers?: string;
    status?: string;
    content_rating?: string;
    release_date?: string;
    showtimes?: any[];
}

export interface Offer {
    id: string;
    title: string;
    slug: string;
    description: string;
    image_url: string;
    discount_code?: string;
    discount_percentage?: number;
    expires_at?: string;
    is_active: boolean;
    created_at: string;
}
