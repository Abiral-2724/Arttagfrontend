'use client'
import React, { useState, useEffect, useRef } from 'react';
import {
  Heart, X, AlertCircle, SlidersHorizontal, ChevronRight,
  Search, ArrowUpDown, Sparkles, TrendingUp, Tag, ArrowDownUp
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import FooterPart from '@/components/FooterPart';

const SubcategoryProductsPage = () => {
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { subcategoryId, categoryId, categoryName } = useParams();
  const typeScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

      :root {
        --ink: #1a1a1a;
        --ink-soft: #444;
        --muted: #888;
        --faint: #aaa;
        --cream: #faf9f7;
        --cream-dark: #f5f3ef;
        --border: #e8e4de;
        --border-light: #f0ece6;
        --white: #ffffff;
      }

      * { box-sizing: border-box; }

      .sc-page {
        font-family: 'DM Sans', sans-serif;
        background: var(--cream);
        min-height: 100vh;
        color: var(--ink);
      }

      /* ── Scrollbar hide ── */
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

      /* ── Divider ── */
      .art-divider {
        height: 1px;
        background: linear-gradient(to right, transparent, var(--border) 30%, var(--border) 70%, transparent);
      }

      /* ── Hero ── */
      .hero-section {
        background: var(--white);
        border-bottom: 1px solid var(--border);
        padding: 48px 0 40px;
      }
      .hero-eyebrow {
        font-size: 10px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: var(--muted);
        font-weight: 500;
        margin-bottom: 12px;
      }
      .hero-title {
        font-family: 'Cormorant Garamond', serif;
        font-weight: 400;
        font-size: clamp(2.4rem, 5vw, 3.6rem);
        color: var(--ink);
        line-height: 1.05;
        letter-spacing: -0.01em;
      }
      .hero-desc {
        margin-top: 14px;
        color: var(--muted);
        font-size: 13px;
        max-width: 480px;
        line-height: 1.75;
      }
      .hero-count-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-top: 20px;
        padding: 5px 14px;
        border-radius: 2px;
        border: 1px solid var(--border);
        background: var(--cream);
        color: var(--muted);
        font-size: 11px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-weight: 500;
      }

      /* ── Breadcrumb ── */
      .breadcrumb {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 11px;
        color: var(--faint);
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-weight: 500;
        margin-bottom: 18px;
      }
      .breadcrumb a { color: inherit; text-decoration: none; transition: color 0.15s; }
      .breadcrumb a:hover { color: var(--ink); }

      /* ── Type Rail ── */
      .type-rail {
        background: var(--white);
        border-bottom: 1px solid var(--border);
        position: sticky;
        top: 0;
        z-index: 30;
        box-shadow: 0 2px 12px rgba(0,0,0,0.04);
      }
      .type-pill {
        position: relative;
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 7px 16px;
        border-radius: 2px;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        white-space: nowrap;
        cursor: pointer;
        border: 1px solid transparent;
        transition: all 0.2s ease;
        color: var(--muted);
        background: transparent;
      }
      .type-pill:hover {
        color: var(--ink);
        border-color: var(--border);
        background: var(--cream);
      }
      .type-pill.active {
        background: var(--ink);
        color: var(--white);
        border-color: var(--ink);
      }
      .type-pill-img {
        width: 20px; height: 20px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
        opacity: 0.85;
      }
      .type-pill.active .type-pill-img { opacity: 1; filter: brightness(0) invert(1); }
      .type-pill-count {
        font-size: 9px;
        font-weight: 600;
        padding: 1px 6px;
        border-radius: 2px;
        background: rgba(255,255,255,0.18);
        letter-spacing: 0.05em;
      }
      .type-pill:not(.active) .type-pill-count {
        background: var(--cream-dark);
        color: var(--ink);
      }

      /* ── Sidebar ── */
      .sidebar-card {
        background: var(--white);
        border: 1px solid var(--border);
        border-radius: 2px;
        position: sticky;
        top: 68px;
        overflow: hidden;
      }
      .sidebar-header {
        padding: 18px 20px 14px;
        border-bottom: 1px solid var(--border-light);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sidebar-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 18px;
        font-weight: 400;
        color: var(--ink);
        letter-spacing: 0.02em;
      }
      .sidebar-section { padding: 18px 20px; }
      .sidebar-section-label {
        font-size: 9px;
        font-weight: 600;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--faint);
        margin-bottom: 12px;
      }
      .sort-option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 9px 10px;
        border-radius: 2px;
        cursor: pointer;
        transition: background 0.15s;
        border: 1px solid transparent;
        margin-bottom: 2px;
      }
      .sort-option:hover { background: var(--cream); }
      .sort-option.selected {
        background: var(--cream-dark);
        border-color: var(--border);
      }
      .sort-option-icon {
        width: 28px; height: 28px;
        border-radius: 2px;
        background: var(--cream);
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
        color: var(--muted);
        transition: all 0.15s;
      }
      .sort-option.selected .sort-option-icon {
        background: var(--ink);
        color: var(--white);
      }
      .sort-option-label {
        font-size: 12px;
        font-weight: 400;
        color: var(--ink-soft);
        letter-spacing: 0.02em;
      }
      .sort-option.selected .sort-option-label { color: var(--ink); font-weight: 500; }

      /* ── Toolbar ── */
      .toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
        gap: 12px;
        flex-wrap: wrap;
      }
      .toolbar-left { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
      .filter-toggle-btn {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 8px 16px;
        border-radius: 2px;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        cursor: pointer;
        border: 1px solid var(--border);
        background: var(--white);
        color: var(--ink-soft);
        transition: all 0.2s ease;
      }
      .filter-toggle-btn:hover { border-color: var(--ink); color: var(--ink); }
      .sort-chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 6px 12px;
        border-radius: 2px;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
        border: 1px solid var(--border);
        color: var(--muted);
        background: var(--white);
        transition: all 0.18s ease;
      }
      .sort-chip:hover { border-color: var(--ink); color: var(--ink); }
      .sort-chip.active { background: var(--ink); color: var(--white); border-color: var(--ink); }
      .product-count {
        font-size: 12px;
        color: var(--muted);
        font-weight: 400;
        letter-spacing: 0.05em;
      }
      .product-count strong { color: var(--ink); font-weight: 600; }

      /* ── Product Cards ── */
      .pcard {
        background: var(--white);
        border-radius: 2px;
        overflow: hidden;
        border: 1px solid var(--border);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        position: relative;
      }
      .pcard:hover {
        transform: translateY(-4px);
        box-shadow: 0 16px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04);
        border-color: #d4cfc8;
      }

      /* ── KEY FIX: image never crops ── */
      .pcard-img-wrap {
        position: relative;
        width: 100%;
        /* aspect-ratio keeps a square placeholder, but the image itself
           uses object-fit: contain so the entire product is always visible */
        aspect-ratio: 4 / 5;
        overflow: hidden;
        background: var(--cream-dark);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .pcard-img {
        width: 100%;
        height: 100%;
        /* contain = shows full image, never crops */
        object-fit: contain;
        object-position: center;
        transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
        display: block;
        padding: 8px;          /* small breathing room around the product */
      }
      .pcard:hover .pcard-img { transform: scale(1.04); }

      .pcard-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(26,26,26,0.12) 0%, transparent 55%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }
      .pcard:hover .pcard-overlay { opacity: 1; }

      /* Quick view label on hover */
      .pcard-quick {
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%) translateY(12px);
        opacity: 0;
        transition: all 0.26s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 5;
        pointer-events: none;
        white-space: nowrap;
        background: rgba(255,255,255,0.94);
        backdrop-filter: blur(8px);
        border-radius: 2px;
        padding: 6px 14px;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--ink);
        border: 1px solid var(--border);
      }
      .pcard:hover .pcard-quick {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }

      /* Wishlist btn */
      .wish-btn {
        position: absolute;
        top: 10px; right: 10px;
        z-index: 10;
        width: 32px; height: 32px;
        border-radius: 50%;
        background: rgba(255,255,255,0.9);
        backdrop-filter: blur(6px);
        border: 1px solid var(--border);
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        transition: all 0.2s ease;
      }
      .wish-btn:hover { transform: scale(1.1); background: var(--white); }
      .wish-btn.active { background: #fdecea; border-color: #f5c6c6; }

      /* Badges */
      .badge-discount {
        position: absolute;
        top: 10px; left: 10px;
        z-index: 10;
        background: var(--ink);
        color: var(--white);
        font-size: 9px;
        font-weight: 600;
        padding: 3px 8px;
        border-radius: 2px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }
      .badge-new {
        position: absolute;
        top: 10px; left: 10px;
        z-index: 10;
        background: var(--cream-dark);
        color: var(--ink);
        border: 1px solid var(--border);
        font-size: 9px;
        font-weight: 600;
        padding: 3px 8px;
        border-radius: 2px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      /* Card body */
      .pcard-body { padding: 12px 14px 14px; }
      .pcard-type {
        font-size: 9px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--faint);
        font-weight: 500;
        margin-bottom: 4px;
      }
      .pcard-name {
        font-family: 'Cormorant Garamond', serif;
        font-size: 15px;
        font-weight: 400;
        color: var(--ink);
        line-height: 1.35;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: 8px;
        min-height: 40px;
      }
      .pcard-price-row { display: flex; align-items: baseline; gap: 7px; flex-wrap: wrap; }
      .pcard-price {
        font-size: 15px;
        font-weight: 600;
        color: var(--ink);
        letter-spacing: -0.01em;
      }
      .pcard-og-price {
        font-size: 12px;
        color: var(--faint);
        text-decoration: line-through;
      }
      .pcard-save {
        font-size: 9px;
        font-weight: 600;
        color: #27ae60;
        background: #eafaf1;
        padding: 2px 6px;
        border-radius: 2px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      /* Product Grid */
      .product-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }
      @media (min-width: 480px) {
        .product-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      }
      @media (min-width: 640px) {
        .product-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; }
      }
      @media (min-width: 1024px) {
        .product-grid { grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 16px; }
      }

      /* Mobile card tweaks */
      @media (max-width: 479px) {
        .pcard-body { padding: 9px 10px 11px; }
        .pcard-name { font-size: 13px; min-height: 34px; }
        .pcard-price { font-size: 13px; }
        .wish-btn { width: 28px; height: 28px; top: 7px; right: 7px; }
        .badge-discount, .badge-new { font-size: 8px; padding: 2px 6px; }
      }

      /* Skeleton */
      .skel {
        background: linear-gradient(90deg, var(--cream-dark) 0%, var(--border-light) 50%, var(--cream-dark) 100%);
        background-size: 200% 100%;
        animation: skel-shine 1.6s ease-in-out infinite;
        border-radius: 2px;
      }
      @keyframes skel-shine {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      /* Card entrance */
      @keyframes card-in {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .card-appear { animation: card-in 0.35s cubic-bezier(0.4, 0, 0.2, 1) both; }

      /* Empty state */
      .empty-state { text-align: center; padding: 80px 24px; }
      .empty-icon-wrap {
        width: 72px; height: 72px;
        border-radius: 2px;
        background: var(--cream-dark);
        border: 1px solid var(--border);
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 20px;
      }
      .empty-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 26px;
        font-weight: 300;
        color: var(--ink);
        margin-bottom: 8px;
      }

      /* Icon btn */
      .icon-btn {
        width: 30px; height: 30px;
        border-radius: 2px;
        background: var(--cream);
        border: 1px solid var(--border);
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.15s;
        color: var(--muted);
      }
      .icon-btn:hover { background: var(--ink); color: var(--white); border-color: var(--ink); }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]: any = useState(null);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSort, setSelectedSort] = useState('popularity');
  const [wishlist, setWishlist] = useState(new Set());
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [subcategoryDetails, setSubcategoryDetails]: any = useState(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? window.localStorage?.getItem("arttagtoken") : null;
    const storedUserId: any = typeof window !== 'undefined' ? window.localStorage?.getItem("arttagUserId") : null;
    if (storedUserId && token) { setUserId(storedUserId); setIsAuthenticated(true); }
    else { setIsAuthenticated(false); setUserId(null); }
  }, []);

  useEffect(() => {
    fetchTypesAndDetails();
    fetchProducts();
    if (isAuthenticated && userId) fetchWishlist();
  }, [subcategoryId, isAuthenticated, userId]);

  useEffect(() => { fetchProducts(); }, [selectedType, selectedSort]);

  const fetchTypesAndDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/product/get/product/subcategory/all/type/${subcategoryId}`);
      if (response.data.success) {
        setAvailableTypes(response.data.types || []);
        setSubcategoryDetails(response.data.subcategorydetail);
      }
    } catch (error) { console.error('Error:', error); setError('Failed to load product types.'); }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true); setError(null);
      let sortParam = '';
      if (selectedSort === 'lowToHigh') sortParam = 'lowToHigh';
      if (selectedSort === 'highToLow') sortParam = 'highToLow';
      const typeParam = selectedType !== 'All' ? `type=${selectedType}` : '';
      const sortQuery = sortParam ? `sort=${sortParam}` : '';
      const queryString = [typeParam, sortQuery].filter(Boolean).join('&');
      const response = await axios.get(`${API_BASE_URL}/product/get/product/bytype/${subcategoryId}?${queryString}`);
      if (response.data.success) setProducts(response.data.products);
      else setProducts([]);
    } catch (error: any) {
      if (error.response?.status === 404) setProducts([]);
      else { console.error('Error:', error); setError(error.response?.data?.message || 'Failed to load products.'); }
    } finally { setLoading(false); }
  };

  const fetchWishlist = async () => {
    if (!isAuthenticated || !userId) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/wishlist/${userId}/get/all/items/wishlist`);
      if (response.data.success) {
        const ids = new Set(response.data.wishlist.map(item => item.productId));
        setWishlist(ids);
      }
    } catch (error) { console.error('Wishlist error:', error); }
  };

  const handleWishlistToggle = async (productId, e) => {
    e.preventDefault(); e.stopPropagation();
    if (!isAuthenticated || !userId) { router.push('/login'); return; }
    try {
      if (wishlist.has(productId)) {
        await axios.delete(`${API_BASE_URL}/wishlist/delete/item/user/wishlist`, { data: { userId, productId } });
        setWishlist(prev => { const s = new Set(prev); s.delete(productId); return s; });
      } else {
        const res = await axios.post(`${API_BASE_URL}/wishlist/add/product/user/wishlist`, { userId, productId });
        if (res.data.success) setWishlist(prev => new Set([...prev, productId]));
      }
    } catch (error) { console.error('Wishlist toggle error:', error); }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const filteredProducts = selectedType === 'All' ? products : products.filter((p: any) => p.type === selectedType);

  const sortOptions = [
    { value: 'newest',     label: 'Newest First',       icon: <Sparkles size={13} /> },
    { value: 'popularity', label: 'Most Popular',        icon: <TrendingUp size={13} /> },
    { value: 'discount',   label: 'Best Discount',       icon: <Tag size={13} /> },
    { value: 'lowToHigh',  label: 'Price: Low → High',   icon: <ArrowUpDown size={13} /> },
    { value: 'highToLow',  label: 'Price: High → Low',   icon: <ArrowDownUp size={13} /> },
  ];

  const FilterContent = () => (
    <div className="sidebar-section">
      <p className="sidebar-section-label">Sort By</p>
      <div>
        {sortOptions.map((opt) => (
          <div
            key={opt.value}
            className={`sort-option ${selectedSort === opt.value ? 'selected' : ''}`}
            onClick={() => setSelectedSort(opt.value)}
          >
            <div className="sort-option-icon">{opt.icon}</div>
            <span className="sort-option-label">{opt.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkeletons = () =>
    Array(8).fill(0).map((_, i) => (
      <div key={i} style={{ borderRadius: 2, overflow: 'hidden', background: '#fff', border: '1px solid var(--border)' }}>
        <div className="skel" style={{ aspectRatio: '4/5', width: '100%' }} />
        <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="skel" style={{ height: 10, width: '60%' }} />
          <div className="skel" style={{ height: 14, width: '100%' }} />
          <div className="skel" style={{ height: 14, width: '75%' }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <div className="skel" style={{ height: 18, width: 56 }} />
            <div className="skel" style={{ height: 18, width: 42 }} />
          </div>
        </div>
      </div>
    ));

  return (
    <TooltipProvider>
      <div className="sc-page">
        <Navbar />

        {/* ── Hero ── */}
        <div className="hero-section">
          <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
            <nav className="breadcrumb">
              <Link href="/">Home</Link>
              <ChevronRight size={10} />
              <span style={{ color: 'var(--ink)' }}>{subcategoryDetails?.name || 'Products'}</span>
            </nav>

            {/* Thin rule */}
            <div style={{ height: 1, background: 'linear-gradient(to right, var(--ink) 40px, transparent 40px)', marginBottom: 14, opacity: 0.18 }} />

            <h1 className="hero-title">{subcategoryDetails?.name || 'Products'}</h1>

            {subcategoryDetails?.description && (
              <p className="hero-desc">{subcategoryDetails.description}</p>
            )}

            {!loading && (
              <div className="hero-count-pill">
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--ink)', display: 'inline-block', opacity: 0.5 }} />
                {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
              </div>
            )}
          </div>
        </div>

        {/* ── Type Rail ── */}
        <div className="type-rail">
          <div style={{ maxWidth: 1400, margin: '0 auto', padding: '12px 24px' }}>
            <div
              ref={typeScrollRef}
              className="scrollbar-hide"
              style={{ display: 'flex', gap: 6, overflowX: 'auto', alignItems: 'center' }}
            >
              <button
                onClick={() => setSelectedType('All')}
                className={`type-pill ${selectedType === 'All' ? 'active' : ''}`}
              >
                <span style={{ fontSize: 11, opacity: 0.7 }}>✦</span>
                All
                <span className="type-pill-count">{products.length}</span>
              </button>

              {availableTypes.map((typeObj: any) => (
                <button
                  key={typeObj.type}
                  onClick={() => setSelectedType(typeObj.type)}
                  className={`type-pill ${selectedType === typeObj.type ? 'active' : ''}`}
                >
                  {typeObj.image && (
                    <img
                      src={typeObj.image}
                      alt={typeObj.type}
                      className="type-pill-img"
                      onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                  {typeObj.type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Layout ── */}
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px', display: 'flex', gap: 24 }}>

          {/* Sidebar */}
          {showFilters && (
            <aside style={{ width: 220, flexShrink: 0 }} className="hidden lg:block">
              <div className="sidebar-card">
                <div className="sidebar-header">
                  <span className="sidebar-title">Filters</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="icon-btn" onClick={() => setShowFilters(false)}>
                        <X size={13} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right"><p>Hide sidebar</p></TooltipContent>
                  </Tooltip>
                </div>
                <FilterContent />
              </div>
            </aside>
          )}

          {/* Products area */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {error && (
              <Alert variant="destructive" style={{ marginBottom: 20, borderRadius: 2 }}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Toolbar */}
            <div className="toolbar">
              <div className="toolbar-left">
                {!showFilters && (
                  <button className="filter-toggle-btn hidden lg:inline-flex" onClick={() => setShowFilters(true)}>
                    <SlidersHorizontal size={13} />
                    Show Filters
                  </button>
                )}
                <button className="filter-toggle-btn lg:hidden" onClick={() => setShowMobileFilters(true)}>
                  <SlidersHorizontal size={13} />
                  Filters & Sort
                </button>
                <div className="hidden md:flex items-center gap-2">
                  {sortOptions.slice(0, 3).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedSort(opt.value)}
                      className={`sort-chip ${selectedSort === opt.value ? 'active' : ''}`}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="product-count">
                {loading ? 'Loading…' : <><strong>{filteredProducts.length}</strong> products</>}
              </p>
            </div>

            {/* Grid */}
            <div className="product-grid">
              {loading ? renderSkeletons() : filteredProducts.map((product: any, idx) => (
                <div
                  key={product.id}
                  className="card-appear"
                  style={{ animationDelay: `${Math.min(idx * 30, 350)}ms` }}
                >
                  <Link href={`/product/category/${categoryId}/subcategory/${subcategoryId}/${categoryName}/${product.id}`}>
                    <div
                      className="pcard"
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      {/* Wishlist */}
                      <button
                        className={`wish-btn ${wishlist.has(product.id) ? 'active' : ''}`}
                        onClick={(e) => handleWishlistToggle(product.id, e)}
                        aria-label="Toggle wishlist"
                      >
                        <Heart
                          size={14}
                          style={{
                            fill: wishlist.has(product.id) ? '#c0392b' : 'none',
                            color: wishlist.has(product.id) ? '#c0392b' : 'var(--muted)',
                            transition: 'all 0.2s',
                          }}
                        />
                      </button>

                      {/* Badge */}
                      {product.originalPrice > product.discountPrice ? (
                        <span className="badge-discount">
                          −{Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100)}%
                        </span>
                      ) : product.isNew ? (
                        <span className="badge-new">New</span>
                      ) : null}

                      {/* Image — full product always visible, never cropped */}
                      <div className="pcard-img-wrap">
                        <img
                          className="pcard-img"
                          src={
                            hoveredProduct === product.id && product.primaryImage2
                              ? product.primaryImage2
                              : product.primaryImage1 || product.images?.[0]?.url || '/api/placeholder/400/500'
                          }
                          alt={product.name}
                          loading="lazy"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/api/placeholder/400/500'; }}
                        />
                        <div className="pcard-overlay" />
                        <span className="pcard-quick">View Product →</span>
                      </div>

                      {/* Body */}
                      <div className="pcard-body">
                        {product.type && <p className="pcard-type">{product.type}</p>}
                        <p className="pcard-name">{product.name}</p>
                        <div className="pcard-price-row">
                          <span className="pcard-price">{formatPrice(product.discountPrice)}</span>
                          {product.originalPrice > product.discountPrice && (
                            <>
                              <span className="pcard-og-price">{formatPrice(product.originalPrice)}</span>
                              <span className="pcard-save">
                                Save {formatPrice(product.originalPrice - product.discountPrice)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {!loading && filteredProducts.length === 0 && (
              <div className="empty-state card-appear">
                <div className="empty-icon-wrap">
                  <Search size={24} style={{ color: 'var(--faint)' }} />
                </div>
                <h3 className="empty-title">Nothing here yet</h3>
                <p style={{ color: 'var(--muted)', fontSize: 13, maxWidth: 300, margin: '0 auto 24px', lineHeight: 1.7 }}>
                  Try a different category or browse our full collection.
                </p>
                <button
                  onClick={() => setSelectedType('All')}
                  style={{
                    padding: '10px 28px',
                    borderRadius: 2,
                    background: 'var(--ink)',
                    color: '#fff',
                    border: 'none',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'opacity 0.15s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = '0.75')}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Browse All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile Filter Sheet ── */}
        <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
          <SheetContent
            side="bottom"
            style={{
              borderRadius: '16px 16px 0 0',
              padding: 0,
              maxHeight: '85vh',
              background: 'var(--cream)',
            }}
          >
            <SheetHeader style={{ padding: '20px 24px 14px', borderBottom: '1px solid var(--border)' }}>
              <SheetTitle style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, textAlign: 'left' }}>
                Filters & Sort
              </SheetTitle>
            </SheetHeader>

            <div style={{ overflowY: 'auto', maxHeight: 'calc(85vh - 130px)', padding: '8px 0' }}>
              <p style={{ padding: '14px 24px 8px', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--faint)' }}>
                Sort By
              </p>
              {sortOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => setSelectedSort(opt.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '12px 24px',
                    cursor: 'pointer',
                    background: selectedSort === opt.value ? 'var(--cream-dark)' : 'transparent',
                    borderLeft: selectedSort === opt.value ? '2px solid var(--ink)' : '2px solid transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{
                    width: 32, height: 32,
                    borderRadius: 2,
                    background: selectedSort === opt.value ? 'var(--ink)' : 'var(--cream-dark)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: selectedSort === opt.value ? '#fff' : 'var(--muted)',
                    flexShrink: 0,
                  }}>
                    {opt.icon}
                  </div>
                  <span style={{
                    fontSize: 13,
                    fontWeight: selectedSort === opt.value ? 600 : 400,
                    color: selectedSort === opt.value ? 'var(--ink)' : 'var(--ink-soft)',
                    letterSpacing: '0.02em',
                  }}>
                    {opt.label}
                  </span>
                  {selectedSort === opt.value && (
                    <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--ink)' }} />
                  )}
                </div>
              ))}
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => setShowMobileFilters(false)}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: 2,
                  background: 'var(--ink)',
                  color: '#fff',
                  border: 'none',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Apply
              </button>
            </div>
          </SheetContent>
        </Sheet>

        <div className="art-divider" style={{ margin: '0 24px' }} />
        <FooterPart />
      </div>
    </TooltipProvider>
  );
};

export default SubcategoryProductsPage;