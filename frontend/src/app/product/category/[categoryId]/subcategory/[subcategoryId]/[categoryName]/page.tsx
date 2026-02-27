'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Heart, X, AlertCircle, SlidersHorizontal, ChevronRight, Search, ArrowUpDown, Sparkles, TrendingUp, Tag, ArrowDownUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');

      :root {
        --accent: #0D9488;
        --accent-light: #CCFBF1;
        --accent-dark: #0F766E;
        --ink: #111827;
        --muted: #6B7280;
        --surface: #FAFAFA;
        --card-bg: #FFFFFF;
        --border: #F3F4F6;
      }

      * { box-sizing: border-box; }

      .sc-page { font-family: 'Outfit', sans-serif; background: var(--surface); min-height: 100vh; }

      /* Scrollbar hide */
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

      /* Hero */
      .hero-section {
        background: #fff;
        border-bottom: 1px solid var(--border);
        position: relative;
        overflow: hidden;
      }
      .hero-section::before {
        content: '';
        position: absolute;
        top: -60px; right: -60px;
        width: 280px; height: 280px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(13,148,136,0.07) 0%, transparent 70%);
        pointer-events: none;
      }
      .hero-section::after {
        content: '';
        position: absolute;
        bottom: -40px; left: -40px;
        width: 200px; height: 200px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(13,148,136,0.05) 0%, transparent 70%);
        pointer-events: none;
      }

      .hero-title {
        font-family: 'Cormorant Garamond', serif;
        font-weight: 600;
        font-size: clamp(2rem, 5vw, 3.25rem);
        letter-spacing: -0.02em;
        color: var(--ink);
        line-height: 1.1;
      }

      .hero-underline {
        display: inline-block;
        position: relative;
      }
      .hero-underline::after {
        content: '';
        position: absolute;
        bottom: -4px; left: 0; right: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--accent), transparent);
        border-radius: 2px;
      }

      /* Type Filter Pills */
      .type-rail {
        background: #fff;
        border-bottom: 1px solid var(--border);
        position: sticky;
        top: 0;
        z-index: 30;
        box-shadow: 0 1px 8px rgba(0,0,0,0.04);
      }

      .type-pill {
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border-radius: 100px;
        font-size: 13px;
        font-weight: 500;
        white-space: nowrap;
        cursor: pointer;
        border: 1.5px solid transparent;
        transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
        color: var(--muted);
        background: var(--surface);
      }
      .type-pill:hover {
        color: var(--ink);
        border-color: #E5E7EB;
        background: #F9FAFB;
        transform: translateY(-1px);
      }
      .type-pill.active {
        background: var(--ink);
        color: #fff;
        border-color: var(--ink);
        box-shadow: 0 4px 14px rgba(17,24,39,0.18);
        transform: translateY(-2px);
      }
      .type-pill.active:hover {
        background: #1F2937;
      }
      .type-pill-img {
        width: 22px; height: 22px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
      }
      .type-pill-count {
        font-size: 10px;
        font-weight: 600;
        padding: 1px 6px;
        border-radius: 100px;
        background: rgba(255,255,255,0.2);
      }
      .type-pill:not(.active) .type-pill-count {
        background: var(--accent-light);
        color: var(--accent-dark);
      }

      /* Sort Bar */
      .sort-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 100px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        border: 1.5px solid #E5E7EB;
        color: var(--muted);
        background: #fff;
        transition: all 0.18s ease;
      }
      .sort-chip:hover { border-color: var(--accent); color: var(--accent); }
      .sort-chip.active { background: var(--accent); color: #fff; border-color: var(--accent); }

      /* Product Cards */
      .pcard {
        background: var(--card-bg);
        border-radius: 20px;
        overflow: hidden;
        border: 1px solid var(--border);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        position: relative;
      }
      .pcard:hover {
        transform: translateY(-8px) scale(1.01);
        box-shadow: 0 24px 48px rgba(0,0,0,0.10), 0 8px 16px rgba(0,0,0,0.06);
        border-color: #E5E7EB;
      }

      .pcard-img-wrap {
        position: relative;
        aspect-ratio: 1;
        overflow: hidden;
        background: #F8F8F8;
      }
      .pcard-img {
        width: 100%; height: 100%;
        object-fit: cover;
        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        display: block;
      }
      .pcard:hover .pcard-img { transform: scale(1.08); }

      .pcard-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 50%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .pcard:hover .pcard-overlay { opacity: 1; }

      /* Quick action bar on hover */
      .pcard-actions {
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%) translateY(16px);
        opacity: 0;
        transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        gap: 8px;
        z-index: 5;
      }
      .pcard:hover .pcard-actions {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
      .pcard-action-btn {
        padding: 8px 16px;
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(8px);
        border-radius: 100px;
        font-size: 12px;
        font-weight: 600;
        color: var(--ink);
        border: none;
        cursor: pointer;
        white-space: nowrap;
        box-shadow: 0 2px 12px rgba(0,0,0,0.15);
        transition: background 0.15s;
      }
      .pcard-action-btn:hover { background: #fff; }

      /* Wishlist btn */
      .wish-btn {
        position: absolute;
        top: 12px; right: 12px;
        z-index: 10;
        width: 36px; height: 36px;
        border-radius: 50%;
        background: rgba(255,255,255,0.92);
        backdrop-filter: blur(6px);
        border: none;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.10);
        transition: all 0.2s ease;
      }
      .wish-btn:hover { transform: scale(1.12); background: #fff; }
      .wish-btn.active { background: #FEE2E2; }

      /* Discount badge */
      .badge-discount {
        position: absolute;
        top: 12px; left: 12px;
        z-index: 10;
        background: linear-gradient(135deg, #EF4444, #DC2626);
        color: #fff;
        font-size: 10px;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 6px;
        letter-spacing: 0.04em;
        box-shadow: 0 2px 8px rgba(239,68,68,0.3);
      }
      .badge-new {
        position: absolute;
        top: 12px; left: 12px;
        z-index: 10;
        background: linear-gradient(135deg, var(--accent), var(--accent-dark));
        color: #fff;
        font-size: 10px;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 6px;
        letter-spacing: 0.04em;
        box-shadow: 0 2px 8px rgba(13,148,136,0.35);
      }

      /* Card content */
      .pcard-body { padding: 16px; }
      .pcard-name {
        font-size: 13px;
        font-weight: 500;
        color: var(--ink);
        line-height: 1.45;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: 10px;
        min-height: 38px;
      }
      .pcard-price-row { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
      .pcard-price {
        font-family: 'Outfit', sans-serif;
        font-size: 17px;
        font-weight: 700;
        color: var(--ink);
        letter-spacing: -0.02em;
      }
      .pcard-og-price {
        font-size: 12px;
        color: #9CA3AF;
        text-decoration: line-through;
      }
      .pcard-save {
        font-size: 10px;
        font-weight: 700;
        color: #16A34A;
        background: #DCFCE7;
        padding: 2px 7px;
        border-radius: 100px;
      }

      /* Sidebar */
      .sidebar-card {
        background: #fff;
        border-radius: 20px;
        border: 1px solid var(--border);
        overflow: hidden;
        position: sticky;
        top: 80px;
      }
      .sidebar-header {
        padding: 20px 20px 16px;
        border-bottom: 1px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sidebar-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 20px;
        font-weight: 600;
        color: var(--ink);
      }
      .sidebar-section { padding: 20px; }
      .sidebar-section-title {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #9CA3AF;
        margin-bottom: 14px;
      }

      /* Radio Sort Options */
      .sort-option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        cursor: pointer;
        transition: background 0.15s;
        border: 1.5px solid transparent;
      }
      .sort-option:hover { background: var(--surface); }
      .sort-option.selected {
        background: var(--accent-light);
        border-color: rgba(13,148,136,0.2);
      }
      .sort-option-icon {
        width: 32px; height: 32px;
        border-radius: 8px;
        background: var(--surface);
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
        transition: background 0.15s;
      }
      .sort-option.selected .sort-option-icon {
        background: rgba(13,148,136,0.15);
      }
      .sort-option-label {
        font-size: 13px;
        font-weight: 500;
        color: var(--ink);
      }

      /* Skeleton */
      .skel {
        background: linear-gradient(90deg, #F3F4F6 0%, #E9EAEC 50%, #F3F4F6 100%);
        background-size: 200% 100%;
        animation: skel-shine 1.6s ease-in-out infinite;
        border-radius: 12px;
      }
      @keyframes skel-shine {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      /* Staggered fade in */
      @keyframes card-in {
        from { opacity: 0; transform: translateY(20px) scale(0.97); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      .card-appear {
        animation: card-in 0.38s cubic-bezier(0.4, 0, 0.2, 1) both;
      }

      /* Empty state */
      .empty-state {
        text-align: center;
        padding: 80px 24px;
      }
      .empty-icon-wrap {
        width: 80px; height: 80px;
        border-radius: 24px;
        background: var(--surface);
        border: 1.5px dashed #D1D5DB;
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 20px;
      }
      .empty-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 24px;
        font-weight: 600;
        color: var(--ink);
        margin-bottom: 8px;
      }

      /* Toolbar */
      .toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
        gap: 12px;
        flex-wrap: wrap;
      }
      .toolbar-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
      .filter-toggle-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 9px 18px;
        border-radius: 100px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        border: 1.5px solid #E5E7EB;
        background: #fff;
        color: var(--ink);
        transition: all 0.2s ease;
        box-shadow: 0 1px 4px rgba(0,0,0,0.04);
      }
      .filter-toggle-btn:hover {
        border-color: var(--accent);
        color: var(--accent);
        box-shadow: 0 2px 12px rgba(13,148,136,0.12);
      }
      .product-count {
        font-size: 13px;
        color: #9CA3AF;
        font-weight: 400;
      }
      .product-count strong { color: var(--ink); font-weight: 600; }

      /* Breadcrumb */
      .breadcrumb {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: #9CA3AF;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        font-weight: 500;
      }
      .breadcrumb a { color: inherit; text-decoration: none; transition: color 0.15s; }
      .breadcrumb a:hover { color: var(--accent); }
      .breadcrumb .current { color: var(--muted); }

      /* Close btn */
      .icon-btn {
        width: 32px; height: 32px;
        border-radius: 8px;
        background: var(--surface);
        border: none;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.15s;
        color: var(--muted);
      }
      .icon-btn:hover { background: #F3F4F6; color: var(--ink); }

      /* Sheet override tweaks */
      [data-radix-popper-content-wrapper] { z-index: 100 !important; }
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

  const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const typeIcons = { 'Paintings': '🎨', 'Sculptures': '🗿', 'Prints': '🖼️', 'Photography': '📷', 'Digital Art': '💻' };

  const filteredProducts = selectedType === 'All' ? products : products.filter((p: any) => p.type === selectedType);

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: <Sparkles size={14} /> },
    { value: 'popularity', label: 'Most Popular', icon: <TrendingUp size={14} /> },
    { value: 'discount', label: 'Best Discount', icon: <Tag size={14} /> },
    { value: 'lowToHigh', label: 'Price: Low → High', icon: <ArrowUpDown size={14} /> },
    { value: 'highToLow', label: 'Price: High → Low', icon: <ArrowDownUp size={14} /> },
  ];

  const FilterContent = () => (
    <div className="sidebar-section">
      <p className="sidebar-section-title">Sort By</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {sortOptions.map((opt) => (
          <div
            key={opt.value}
            className={`sort-option ${selectedSort === opt.value ? 'selected' : ''}`}
            onClick={() => setSelectedSort(opt.value)}
          >
            <div className="sort-option-icon" style={{ color: selectedSort === opt.value ? 'var(--accent)' : 'var(--muted)' }}>
              {opt.icon}
            </div>
            <span className="sort-option-label" style={{ color: selectedSort === opt.value ? 'var(--accent-dark)' : undefined }}>
              {opt.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkeletons = () =>
    Array(8).fill(0).map((_, i) => (
      <div key={i} style={{ borderRadius: 20, overflow: 'hidden', background: '#fff', border: '1px solid var(--border)' }}>
        <div className="skel" style={{ aspectRatio: '1', width: '100%' }} />
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="skel" style={{ height: 13, width: '100%' }} />
          <div className="skel" style={{ height: 13, width: '70%' }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <div className="skel" style={{ height: 20, width: 64 }} />
            <div className="skel" style={{ height: 20, width: 48 }} />
          </div>
        </div>
      </div>
    ));

  return (
    <TooltipProvider>
      <div className="sc-page">
        <Navbar />

        {/* ── Hero Header ─────────────────────────── */}
        <div className="hero-section">
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 24px 32px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <nav className="breadcrumb" style={{ justifyContent: 'center', marginBottom: 16 }}>
              <a href="/">Home</a>
              <ChevronRight size={12} />
              <a href="#">{categoryName || 'Category'}</a>
              <ChevronRight size={12} />
              <span className="current">{subcategoryDetails?.name || 'Products'}</span>
            </nav>

            <h1 className="hero-title">
              <span className="hero-underline">{subcategoryDetails?.name || 'Products'}</span>
            </h1>

            {subcategoryDetails?.description && (
              <p style={{ marginTop: 12, color: 'var(--muted)', fontSize: 14, maxWidth: 520, margin: '12px auto 0', lineHeight: 1.7 }}>
                {subcategoryDetails.description}
              </p>
            )}

            {/* Count pill */}
            {!loading && (
              <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 100, background: 'var(--accent-light)', color: 'var(--accent-dark)', fontSize: 12, fontWeight: 600 }}>
                <Sparkles size={12} />
                {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} available
              </div>
            )}
          </div>
        </div>

        {/* ── Type Filter Rail ─────────────────────── */}
        <div className="type-rail">
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 24px' }}>
            <div
              ref={typeScrollRef}
              className="scrollbar-hide"
              style={{ display: 'flex', gap: 8, overflowX: 'auto', alignItems: 'center', paddingBottom: 2 }}
            >
              {/* ALL */}
              <button
                onClick={() => setSelectedType('All')}
                className={`type-pill ${selectedType === 'All' ? 'active' : ''}`}
              >
                <span style={{ fontSize: 14 }}>✦</span>
                All
                <span className="type-pill-count">{products.length}</span>
              </button>

              {availableTypes.map((typeObj: any) => (
                <button
                  key={typeObj.type}
                  onClick={() => setSelectedType(typeObj.type)}
                  className={`type-pill ${selectedType === typeObj.type ? 'active' : ''}`}
                >
                  {typeObj.image ? (
                    <img src={typeObj.image} alt={typeObj.type} className="type-pill-img"
                      onError={(e: any) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <span style={{ fontSize: 14 }}>{typeIcons[typeObj.type] || '📦'}</span>
                  )}
                  {typeObj.type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Layout ──────────────────────────── */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px', display: 'flex', gap: 28 }}>

          {/* ── Sidebar ── */}
          {showFilters && (
            <aside style={{ width: 240, flexShrink: 0 }} className="hidden lg:block">
              <div className="sidebar-card">
                <div className="sidebar-header">
                  <span className="sidebar-title">Filters</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="icon-btn" onClick={() => setShowFilters(false)}>
                        <X size={15} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Hide sidebar</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FilterContent />
              </div>
            </aside>
          )}

          {/* ── Products Area ── */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Error */}
            {error && (
              <Alert variant="destructive" style={{ marginBottom: 20, borderRadius: 14 }}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Toolbar */}
            <div className="toolbar">
              <div className="toolbar-left">
                {/* Show filters (desktop) */}
                {!showFilters && (
                  <button className="filter-toggle-btn hidden lg:inline-flex" onClick={() => setShowFilters(true)}>
                    <SlidersHorizontal size={14} />
                    Show Filters
                  </button>
                )}

                {/* Mobile filter btn */}
                <button className="filter-toggle-btn lg:hidden" onClick={() => setShowMobileFilters(true)}>
                  <SlidersHorizontal size={14} />
                  Filters & Sort
                </button>

                {/* Quick sort chips — desktop only */}
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {loading ? renderSkeletons() : filteredProducts.map((product: any, idx) => (
                <div
                  key={product.id}
                  className="card-appear"
                  style={{ animationDelay: `${Math.min(idx * 35, 400)}ms` }}
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
                          size={15}
                          style={{
                            fill: wishlist.has(product.id) ? '#EF4444' : 'none',
                            color: wishlist.has(product.id) ? '#EF4444' : '#6B7280',
                            transition: 'all 0.2s'
                          }}
                        />
                      </button>

                      {/* Badge */}
                      {product.originalPrice > product.discountPrice ? (
                        <span className="badge-discount">
                          {Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100)}% OFF
                        </span>
                      ) : product.isNew ? (
                        <span className="badge-new">NEW</span>
                      ) : null}

                      {/* Image */}
                      <div className="pcard-img-wrap">
                        <img
                          className="pcard-img"
                          src={hoveredProduct === product.id && product.images?.[1]?.url ? product.images[1].url : product.images?.[0]?.url || '/api/placeholder/400/400'}
                          alt={product.name}
                          loading="lazy"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/api/placeholder/400/400'; }}
                        />
                        <div className="pcard-overlay" />

                        {/* Quick view on hover */}
                        <div className="pcard-actions">
                          <span className="pcard-action-btn">Quick View →</span>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="pcard-body">
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

            {/* Empty */}
            {!loading && filteredProducts.length === 0 && (
              <div className="empty-state card-appear">
                <div className="empty-icon-wrap">
                  <Search size={28} style={{ color: '#D1D5DB' }} />
                </div>
                <h3 className="empty-title">Nothing here yet</h3>
                <p style={{ color: 'var(--muted)', fontSize: 13, maxWidth: 320, margin: '0 auto 24px', lineHeight: 1.6 }}>
                  Try a different category or explore our full collection.
                </p>
                <button
                  onClick={() => setSelectedType('All')}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 100,
                    background: 'var(--ink)',
                    color: '#fff',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'opacity 0.15s'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Browse All Products
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile Filter Sheet (shadcn) ──────────── */}
        <div >
        <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters} >
          <SheetContent side="bottom" style={{ borderRadius: '24px 24px 0 0', padding: 0, maxHeight: '85vh' ,background:"white" }}>
            <SheetHeader style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)' }}>
              <SheetTitle style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, textAlign: 'left' }}>
                Filters & Sort
              </SheetTitle>
            </SheetHeader>

            <div style={{ overflowY: 'auto', maxHeight: 'calc(85vh - 130px)' }}>
              <div style={{ padding: '8px 0' }}>
                <p style={{ padding: '16px 24px 8px', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF' }}>
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
                      padding: '13px 24px',
                      cursor: 'pointer',
                      background: selectedSort === opt.value ? 'var(--accent-light)' : 'transparent',
                      transition: 'background 0.15s',
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: selectedSort === opt.value ? 'rgba(13,148,136,0.15)' : 'var(--surface)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: selectedSort === opt.value ? 'var(--accent)' : 'var(--muted)',
                      flexShrink: 0,
                    }}>
                      {opt.icon}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 500, color: selectedSort === opt.value ? 'var(--accent-dark)' : 'var(--ink)' }}>
                      {opt.label}
                    </span>
                    {selectedSort === opt.value && (
                      <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => setShowMobileFilters(false)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 100,
                  background: 'var(--ink)',
                  color: '#fff',
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                }}
              >
                Apply
              </button>
            </div>
          </SheetContent>
        </Sheet>
        </div>

        <Separator style={{ borderColor: '#E5E7EB' }} />
        <FooterPart />
      </div>
    </TooltipProvider>
  );
};

export default SubcategoryProductsPage;