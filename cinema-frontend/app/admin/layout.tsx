'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
            router.push('/login');
            return;
        }

        try {
            const user = JSON.parse(userStr);
            if (!user.is_admin && user.email !== 'hassan.ftounne@gmail.com') {
                router.push('/');
                return;
            }
            setAuthorized(true);
        } catch (e) {
            router.push('/login');
        }
    }, [router]);

    if (!authorized) {
        return (
            <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">
                Verifying Admin Authorization...
            </div>
        );
    }

    return <>{children}</>;
}
