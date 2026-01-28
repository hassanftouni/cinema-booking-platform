'use client';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Define global interface for Echo
declare global {
    interface Window {
        Pusher: any;
        Echo: any;
    }
}

let echoInstance: Echo | null = null;

export const getEcho = () => {
    if (typeof window === 'undefined') return null;

    if (!echoInstance) {
        window.Pusher = Pusher;

        echoInstance = new Echo({
            broadcaster: 'reverb',
            key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
            wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 80,
            wssPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 443,
            forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
        });
    }

    return echoInstance;
};
