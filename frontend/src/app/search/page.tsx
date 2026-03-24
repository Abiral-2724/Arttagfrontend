'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Search, Package, Folder, Tag, X, Clock, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface SearchResult {
  type: 'category' | 'subcategory' | 'product';
  id: string;
  name: string;
  categoryId?: string;
  subcategoryId?: string;
  url: string;
}
interface SearchResponse { results: SearchResult[]; query: string; }
interface Subcategory { id: string; name: string; imageUrl: string; parentId: string; createdAt: string; }
interface SubcategoriesResponse { success: boolean; message: string; subcategories: Subcategory[]; }

const trendingSearches = [
  'Arttag bags', 'Phone Wallet', 'Apple Phone Cases', 'Pop Adapter',
  'Wireless Charger', 'Watch Straps', 'Charging Cable', 'Laptop Bags', 'Tote Bags',
];

const TYPE_META: Record<string, { icon: any; label: string; dot: string }> = {
  product:     { icon: Package, label: 'Product',     dot: '#2980b9' },
  category:    { icon: Folder,  label: 'Category',    dot: '#27ae60' },
  subcategory: { icon: Tag,     label: 'Subcategory', dot: '#8e44ad' },
};

export default function EnhancedSearchPage() {
  const router   = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [query, setQuery]             = useState('');
  const [results, setResults]         = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading]     = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [subcategories, setSubcategories]   = useState<Subcategory[]>([]);
  const [isLoadingCats, setIsLoadingCats]   = useState(true);
  const [isEnterLoading, setIsEnterLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const saved = sessionStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    setIsLoadingCats(true);
    try {
      const res  = await fetch(`${API_BASE}/category/get/all/subcategory`);
      const data: SubcategoriesResponse = await res.json();
      if (data.success) setSubcategories(data.subcategories);
    } catch { console.error('Failed to fetch subcategories'); }
    finally { setIsLoadingCats(false); }
  };

  useEffect(() => {
    if (!query.trim()) { setResults([]); setShowResults(false); return; }
    const t = setTimeout(() => performSearch(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const performSearch = async (q: string) => {
    setIsLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/product/search/product?q=${encodeURIComponent(q)}`);
      const data: SearchResponse = await res.json();
      setResults(data.results || []); setShowResults(true);
    } catch { setResults([]); }
    finally { setIsLoading(false); }
  };

  const saveRecent = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    sessionStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const removeRecent = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== term);
    setRecentSearches(updated);
    sessionStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleResultClick = (r: SearchResult) => {
    saveRecent(r.name); window.location.href = r.url; setShowResults(false); setQuery('');
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || !query.trim()) return;
    const trimmed = query.trim();
    saveRecent(trimmed); setShowResults(false);
    let fresh = results;
    if (fresh.length === 0) {
      setIsEnterLoading(true);
      try {
        const res  = await fetch(`${API_BASE}/product/search/product?q=${encodeURIComponent(trimmed)}`);
        const data: SearchResponse = await res.json();
        fresh = data.results || [];
      } catch { fresh = []; }
      finally { setIsEnterLoading(false); }
    }
    if (fresh.length > 0) window.location.href = fresh[0].url;
    else router.push(`/search/not-found?q=${encodeURIComponent(trimmed)}`);
  };

  const handleCategoryClick = (sub: Subcategory) => {
    window.location.href = `/product/category/${sub.parentId}/subcategory/${sub.id}/${sub.name.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const scroll = (dir: 'left' | 'right') => {
    if (sliderRef.current) sliderRef.current.scrollTo({ left: sliderRef.current.scrollLeft + (dir === 'left' ? -300 : 300), behavior: 'smooth' });
  };

  const grouped = {
    categories:    results.filter(r => r.type === 'category'),
    subcategories: results.filter(r => r.type === 'subcategory'),
    products:      results.filter(r => r.type === 'product'),
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .sp-serif { font-family: 'Cormorant Garamond', serif; }
        .sp-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }

        /* Search input */
        .sp-input-wrap { position: relative; }
        .sp-input {
          width: 100%; padding: 13px 44px 13px 44px;
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          border: 1px solid #e8e4de; border-radius: 2px;
          background: #fff; color: #1a1a1a;
          outline: none; transition: border-color 0.2s;
        }
        .sp-input:focus { border-color: #1a1a1a; }
        .sp-input::placeholder { color: #ccc; }

        /* Dropdown */
        .sp-dropdown {
          position: absolute; top: calc(100% + 6px); left: 0; right: 0;
          background: #fff; border: 1px solid #e8e4de; border-radius: 2px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.1);
          max-height: 400px; overflow-y: auto; z-index: 50;
          animation: spDrop 0.15s ease;
        }
        @keyframes spDrop {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sp-dd-group-label {
          padding: 8px 16px 4px;
          font-size: 9px; font-weight: 600; letter-spacing: 0.18em;
          text-transform: uppercase; color: #aaa;
          border-top: 1px solid #f0ece6;
        }
        .sp-dd-group-label:first-child { border-top: none; }
        .sp-dd-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 16px; cursor: pointer;
          transition: background 0.1s;
          width: 100%; text-align: left; border: none; background: transparent;
          font-family: 'DM Sans', sans-serif;
        }
        .sp-dd-item:hover { background: #faf9f7; }
        .sp-dd-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
        }

        /* Trending pill */
        .sp-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 14px;
          font-size: 11px; font-weight: 500; color: #555;
          border: 1px solid #e8e4de; border-radius: 2px;
          background: #fff; cursor: pointer; transition: all 0.15s;
        }
        .sp-pill:hover { border-color: #1a1a1a; color: #1a1a1a; background: #faf9f7; }

        /* Recent row */
        .sp-recent-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 9px 12px; cursor: pointer; border-radius: 2px;
          transition: background 0.12s;
        }
        .sp-recent-row:hover { background: #faf9f7; }

        /* Category card */
        .sp-cat-card {
          flex-shrink: 0; width: 148px; display: flex; flex-direction: column;
          align-items: center; gap: 14px; cursor: pointer; padding: 6px 0;
        }
        .sp-cat-ring {
          width: 148px; height: 148px; border-radius: 50%;
          border: 1px solid #e8e4de; background: #fff;
          overflow: hidden; display: flex; align-items: center; justify-content: center;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .sp-cat-card:hover .sp-cat-ring {
          border-color: #1a1a1a;
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        }
        .sp-cat-ring img { width: 88%; height: 88%; object-fit: contain; transition: transform 0.35s; }
        .sp-cat-card:hover .sp-cat-ring img { transform: scale(1.08); }
        .sp-cat-name {
          font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: #888; text-align: center;
          line-height: 1.4; transition: color 0.15s; max-width: 120px;
        }
        .sp-cat-card:hover .sp-cat-name { color: #1a1a1a; }

        /* Skeleton */
        .sp-skel {
          background: linear-gradient(90deg, #f5f3ef 0%, #ece9e3 50%, #f5f3ef 100%);
          background-size: 200% 100%;
          animation: spSkel 1.4s ease-in-out infinite;
          border-radius: 50%;
        }
        @keyframes spSkel { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        /* Slider arrows */
        .sp-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 32px; height: 32px; border-radius: 2px;
          border: 1px solid #e8e4de; background: #fff;
          display: flex; align-items: center; justify-content: center;
          color: #888; cursor: pointer; opacity: 0; transition: opacity 0.15s, border-color 0.15s;
          z-index: 10;
        }
        .sp-arrow:hover { border-color: #1a1a1a; color: #1a1a1a; }
        .sp-slider-wrap:hover .sp-arrow { opacity: 1; }
        .sp-arrow-left  { left: -16px; }
        .sp-arrow-right { right: -16px; }
      `}</style>

      <Navbar />

      {/* ── Search bar ── */}
      <div className="bg-white border-b border-[#e8e4de] py-8">
        <div className="max-w-[640px] mx-auto px-4">
          <p className="text-[10px] tracking-[0.28em] uppercase text-[#aaa] text-center mb-4">Discover</p>
          <div ref={searchRef} className="relative">
            <div className="sp-input-wrap">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa] pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => { if (query.trim()) setShowResults(true); }}
                placeholder="Search products, bags, accessories…"
                className="sp-input"
                autoFocus
              />
              {isEnterLoading ? (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
              ) : query ? (
                <button onClick={() => { setQuery(''); setResults([]); setShowResults(false); inputRef.current?.focus(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#1a1a1a] transition-colors">
                  <X size={15} />
                </button>
              ) : null}
            </div>

            {/* ── Dropdown ── */}
            {showResults && query.trim() && (
              <div className="sp-dropdown">
                {isLoading ? (
                  <div className="flex items-center gap-3 px-5 py-4">
                    <div className="w-4 h-4 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    <p className="text-sm text-[#888]">Searching…</p>
                  </div>
                ) : results.length === 0 ? (
                  <div className="flex flex-col items-center py-8 gap-2">
                    <Search size={24} className="text-[#d4cfc8]" />
                    <p className="text-sm text-[#888]">No results for "{query}"</p>
                  </div>
                ) : (
                  <>
                    {(['categories', 'subcategories', 'products'] as const).map(group => {
                      const items = grouped[group];
                      if (!items.length) return null;
                      const label = group.charAt(0).toUpperCase() + group.slice(1);
                      return (
                        <div key={group}>
                          <p className="sp-dd-group-label">{label}</p>
                          {items.map(r => {
                            const meta = TYPE_META[r.type];
                            const Icon = meta.icon;
                            return (
                              <button key={r.id} onClick={() => handleResultClick(r)} className="sp-dd-item">
                                <span className="sp-dd-dot" style={{ background: meta.dot }} />
                                <span className="text-sm text-[#1a1a1a] flex-1 text-left">{r.name}</span>
                                <span className="text-[10px] text-[#aaa] tracking-[0.08em] uppercase">{meta.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Recent + Trending ── */}
      <div className="bg-white border-b border-[#e8e4de]">
        <div className="max-w-[640px] mx-auto px-4 py-7 space-y-7">

          {recentSearches.length > 0 && (
            <div>
              <p className="text-[9px] tracking-[0.22em] uppercase text-[#aaa] font-semibold mb-3">Recently Searched</p>
              <div className="space-y-0.5">
                {recentSearches.map((term, i) => (
                  <div key={i} className="sp-recent-row" onClick={() => { setQuery(term); inputRef.current?.focus(); }}>
                    <div className="flex items-center gap-3">
                      <Clock size={13} className="text-[#ccc] flex-shrink-0" />
                      <span className="text-sm text-[#555]">{term}</span>
                    </div>
                    <button onClick={e => removeRecent(term, e)} className="text-[#d4cfc8] hover:text-[#c0392b] transition-colors">
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={12} className="text-[#aaa]" />
              <p className="text-[9px] tracking-[0.22em] uppercase text-[#aaa] font-semibold">Trending Searches</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((term, i) => (
                <button key={i} onClick={() => { setQuery(term); saveRecent(term); inputRef.current?.focus(); }} className="sp-pill">
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Top Categories ── */}
     

      {/* ── Top Categories ── */}
<div className="bg-white py-16 md:py-24">
  <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">

    <div className="mb-10">
      <p className="text-[10px] tracking-[0.22em] uppercase text-[#888] mb-1.5">Browse by</p>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }}
        className="text-3xl md:text-4xl font-light text-[#1a1a1a]">
        Top Categories
      </h2>
    </div>

    <div className="h-px bg-gradient-to-r from-transparent via-[#e8e4de] to-transparent mb-10" />

    {isLoadingCats ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[3/4] rounded-sm"
              style={{
                background: 'linear-gradient(90deg,#f5f3ef 0%,#ece9e3 50%,#f5f3ef 100%)',
                backgroundSize: '200% 100%',
                animation: `shimmer 1.4s ease-in-out infinite`,
                animationDelay: `${i * 70}ms`,
              }} />
            <div className="h-2.5 w-3/4 rounded" style={{ background: '#f0ece6' }} />
            <div className="h-2.5 w-1/2 rounded" style={{ background: '#f0ece6' }} />
          </div>
        ))}
      </div>
    ) : (
      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent className="-ml-4">
          {subcategories.map((category) => (
            <CarouselItem
              key={category.id}
              className="pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4"
            >
              <div
                onClick={() => handleCategoryClick(category)}
                className="cursor-pointer group"
              >
                {/* Image — identical to similar-card */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f3ef] rounded-sm mb-3">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80';
                    }}
                  />
                </div>

                {/* Label */}
                <div className="space-y-1 px-0.5">
                  <h3 className="text-sm font-medium text-[#1a1a1a] line-clamp-2 group-hover:opacity-60 transition-opacity">
                    {category.name}
                  </h3>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="
          -left-4 w-8 h-8 rounded-sm border border-[#e8e4de]
          bg-white text-[#888] shadow-none
          hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a]
          transition-all duration-150" />
        <CarouselNext className="
          -right-4 w-8 h-8 rounded-sm border border-[#e8e4de]
          bg-white text-[#888] shadow-none
          hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a]
          transition-all duration-150" />
      </Carousel>
    )}
  </div>
</div>

      <div className="sp-divider" />
      <Footer />
    </div>
  );
}