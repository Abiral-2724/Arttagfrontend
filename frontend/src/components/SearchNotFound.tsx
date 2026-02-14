'use client'
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchX, ArrowLeft, Home, TrendingUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const trendingSearches = [
  'Arttag bags',
  'Phone Wallet',
  'Apple Phone Cases',
  'Pop Adapter',
  'Wireless Charger',
  'Watch Straps',
  'Charging Cable',
  'Laptop Bags',
  'Tote Bags'
];

export default function SearchNotFoundPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [visible, setVisible] = useState(false);

  // Fade-in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleTrendingClick = (term: string) => {
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col">

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">

          {/* Animated card */}
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col items-center text-center transition-all duration-500"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
              <SearchX className="w-10 h-10 text-red-400" strokeWidth={1.5} />
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              No products found
            </h1>

            {/* Sub-text with highlighted query */}
            <p className="text-gray-500 text-base mb-1">
              We couldn&apos;t find anything matching
            </p>
            <p className="text-gray-900 font-semibold text-lg mb-6 break-all">
              &ldquo;{query}&rdquo;
            </p>

            {/* Suggestions list */}
            <ul className="text-sm text-gray-500 text-left space-y-2 mb-8 w-full max-w-xs">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-gray-300">•</span>
                Check for typos or spelling mistakes
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-gray-300">•</span>
                Try more general or shorter keywords
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-gray-300">•</span>
                Browse our trending categories below
              </li>
            </ul>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => router.push('/search')}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-all text-sm"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>
          </div>

          {/* Trending searches */}
          {/* <div
            className="w-full max-w-lg mt-10 transition-all duration-700"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: '150ms',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                Trending Searches
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleTrendingClick(term)}
                  className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div> */}

        </main>
      </div>
      <Footer />
    </div>
  );
}