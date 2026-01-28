'use client';

import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';

function Counter({ value, suffix = "" }: { value: number, suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 30,
        stiffness: 100,
    });
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.floor(latest).toLocaleString() + suffix;
            }
        });
    }, [springValue, suffix]);

    return <span ref={ref} className="text-5xl md:text-6xl font-bold text-gold-500 font-serif" />;
}

export default function FeaturedCounters() {
    return (
        <section className="py-20 bg-cinema-black relative z-20 border-b border-white/5">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
                    <div className="p-4">
                        <Counter value={25} suffix="+" />
                        <p className="text-gray-400 mt-2 uppercase tracking-widest text-sm">Premium Locations</p>
                    </div>
                    <div className="p-4">
                        <Counter value={140} />
                        <p className="text-gray-400 mt-2 uppercase tracking-widest text-sm">Movies Screening</p>
                    </div>
                    <div className="p-4">
                        <Counter value={500} suffix="k+" />
                        <p className="text-gray-400 mt-2 uppercase tracking-widest text-sm">Happy Customers</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
