'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/ui/Navbar';
import HeroSlider from '../components/ui/HeroSlider';
import MovieCarousel from '../components/ui/MovieCarousel';
import Footer from '../components/ui/Footer';
import { fetchAPI, Movie } from '../lib/api/client';
import { getEcho } from '../lib/echo';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchAPI('/movies');
        setMovies(data.data || []);
      } catch (error) {
        console.error("Failed to fetch movies", error);
      }
    };
    loadMovies();

    // Real-time Listener
    const echo = getEcho();
    if (echo) {
      echo.channel('movies')
        .listen('.movie.published', (e: any) => {
          console.log('Movie Published (Home):', e.movie);
          // Add new movie to the top of the list
          setMovies(prev => [e.movie, ...prev]);
        });
    }


    return () => {
      if (echo) echo.leave('movies');
    };
  }, []);

  const nowShowing = movies.filter(m => m.status === 'now_showing');
  const comingSoon = movies.filter(m => m.status === 'coming_soon');

  return (
    <main className="min-h-screen bg-cinema-black selection:bg-gold-500 selection:text-black">
      <Navbar />


      <div className="relative z-0">
        <HeroSlider movies={nowShowing} />
      </div>

      {nowShowing.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0 }}
          className="pt-24" // Extra padding to separate from hero if needed
        >
          <MovieCarousel movies={nowShowing} title="Now Selling" />
        </motion.section>
      )}

      {comingSoon.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="mt-[-80px]" // Subtle overlap for cinematic feel
        >
          <MovieCarousel movies={comingSoon} title="Upcoming Soon" />
        </motion.section>
      )}

      <Footer />
    </main>
  );
}
