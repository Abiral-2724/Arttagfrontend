'use client'
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchX, ArrowLeft, Home, TrendingUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const trendingSearches = [
  'Arttag bags', 'Phone Wallet', 'Apple Phone Cases', 'Pop Adapter',
  'Wireless Charger', 'Watch Straps', 'Charging Cable', 'Laptop Bags', 'Tote Bags',
];

export default function SearchNotFoundPage() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const query        = searchParams.get('q') || '';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .snf-serif { font-family: 'Cormorant Garamond', serif; }
        .snf-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }
        .snf-pill {
          display: inline-flex; align-items: center;
          padding: 5px 14px; font-size: 11px; font-weight: 500; color: #555;
          border: 1px solid #e8e4de; border-radius: 2px;
          background: #fff; cursor: pointer; transition: all 0.15s;
        }
        .snf-pill:hover { border-color: #1a1a1a; color: #1a1a1a; background: #faf9f7; }
        .snf-btn-outline {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 11px 20px; border: 1px solid #e8e4de; border-radius: 2px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
          color: #888; background: #fff; cursor: pointer; transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .snf-btn-outline:hover { border-color: #1a1a1a; color: #1a1a1a; }
        .snf-btn-primary {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 11px 20px; border: 1px solid #1a1a1a; border-radius: 2px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
          color: #fff; background: #1a1a1a; cursor: pointer; transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .snf-btn-primary:hover { background: #333; border-color: #333; }
        .snf-dot { width: 4px; height: 4px; border-radius: 50%; background: #ccc; flex-shrink: 0; margin-top: 7px; }
      `}</style>

      <Navbar />

      <main className="flex flex-col items-center justify-center px-4 py-20 sm:py-28">

        {/* ── Main card ── */}
        <div
          className="w-full max-w-[480px] bg-white border border-[#e8e4de] rounded-sm p-8 sm:p-10 flex flex-col items-center text-center transition-all duration-500"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}
        >
          {/* Icon */}
          <div className="w-14 h-14 border border-[#e8e4de] rounded-sm bg-[#faf9f7] flex items-center justify-center mb-6">
            <SearchX size={22} className="text-[#888]" strokeWidth={1.5} />
          </div>

          {/* Heading */}
          <p className="text-[10px] tracking-[0.24em] uppercase text-[#aaa] mb-2">Search</p>
          <h1 className="snf-serif text-4xl font-light text-[#1a1a1a] mb-3 leading-snug">
            No Results Found
          </h1>

          {/* Query */}
          {query && (
            <p className="text-sm text-[#888] mb-6 leading-relaxed">
              Nothing matched <span className="text-[#1a1a1a] font-medium">"{query}"</span>
            </p>
          )}

          <div className="snf-divider w-full mb-6" />

          {/* Suggestions */}
          <ul className="w-full text-left space-y-2.5 mb-8">
            {[
              'Check for typos or spelling mistakes',
              'Try more general or shorter keywords',
              'Browse our trending categories below',
            ].map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#555] leading-relaxed">
                <div className="snf-dot" />
                {s}
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex gap-3 w-full">
            <button className="snf-btn-outline" onClick={() => router.push('/search')}>
              <ArrowLeft size={12} /> Try Again
            </button>
            <button className="snf-btn-primary" onClick={() => router.push('/')}>
              <Home size={12} /> Go Home
            </button>
          </div>
        </div>

        {/* ── Trending searches ── */}
        <div
          className="w-full max-w-[480px] mt-8 transition-all duration-500"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)', transitionDelay: '120ms' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={12} className="text-[#aaa]" />
            <p className="text-[9px] tracking-[0.22em] uppercase text-[#aaa] font-semibold">Trending Searches</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((term, i) => (
              <button key={i} className="snf-pill"
                onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}>
                {term}
              </button>
            ))}
          </div>
        </div>

      </main>

      <div className="snf-divider" />
      <Footer />
    </div>
  );
}