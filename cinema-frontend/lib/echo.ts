'use client';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Define global interface for Echo - using 'reverb' as the argument
declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo<'reverb'>;
    }
}

// Explicitly type the instance as Echo<'reverb'>
let echoInstance: Echo<'reverb'> | null = null;

export const getEcho = (): Echo<'reverb'> | null => {
    if (typeof window === 'undefined') return null;

    if (!echoInstance) {
        window.Pusher = Pusher;

        echoInstance = new Echo({
            broadcaster: 'reverb',
            key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
            wsPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT ?? '80'),
            wssPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT ?? '443'),
            forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
        });
    }

    return echoInstance;
};
