'use client'
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import FooterPart from '@/components/FooterPart';
import Link from 'next/link';
import { Package, AlertCircle, ChevronRight } from 'lucide-react';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const router = useRouter();

  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading]             = useState(true);
  const [categoryName, setCategoryName]   = useState('');
  const [error, setError]                 = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;
    const fetch = async () => {
      try {
        setLoading(true); setError(null);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/get/${categoryId}/all/subcategory`
        );
        if (res.data.success) {
          setCategoryName(res.data.parentCategory?.name || '');
          setSubcategories(res.data.subcategories || []);
        }
      } catch {
        setError('Failed to load subcategories. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [categoryId]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap');`}</style>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="w-6 h-6 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#888]">Loading…</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <AlertCircle size={36} className="text-[#d4cfc8]" />
          <p className="text-sm text-[#c0392b]">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-[10px] tracking-[0.14em] uppercase font-semibold text-[#1a1a1a] border-b border-[#1a1a1a] hover:opacity-60 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .cp-serif { font-family: 'Cormorant Garamond', serif; }
        .cp-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }

        /* Sub card */
        .cp-sub-card {
          display: flex; flex-direction: column; align-items: center;
          cursor: pointer; padding: 20px 12px;
          border: 1px solid transparent; border-radius: 2px;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          text-align: center;
        }
        .cp-sub-card:hover {
          border-color: #e8e4de;
          background: #fff;
          box-shadow: 0 6px 20px rgba(0,0,0,0.06);
        }

        /* Image ring */
        .cp-img-ring {
          width: 100px; height: 100px;
          border-radius: 50%;
          border: 1px solid #e8e4de;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
          flex-shrink: 0;
          margin-bottom: 14px;
        }
        .cp-sub-card:hover .cp-img-ring {
          border-color: #1a1a1a;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }
        @media (min-width: 640px) {
          .cp-img-ring { width: 120px; height: 120px; }
        }
        @media (min-width: 768px) {
          .cp-img-ring { width: 140px; height: 140px; }
        }

        .cp-sub-card img {
          width: 72%; height: 72%;
          object-fit: contain;
          transition: transform 0.35s ease;
        }
        .cp-sub-card:hover img { transform: scale(1.08); }

        /* Sub name */
        .cp-sub-name {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #555;
          line-height: 1.4;
          transition: color 0.15s;
        }
        .cp-sub-card:hover .cp-sub-name { color: #1a1a1a; }

        /* Skeleton */
        .cp-skel {
          background: linear-gradient(90deg, #f5f3ef 0%, #ece9e3 50%, #f5f3ef 100%);
          background-size: 200% 100%;
          animation: cpSkel 1.4s ease-in-out infinite;
          border-radius: 50%;
        }
        @keyframes cpSkel {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <Navbar />

      {/* ── Header ── */}
      <div className="border-b border-[#e8e4de] bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] tracking-[0.12em] uppercase text-[#aaa] mb-5">
            <Link href="/" className="hover:text-[#555] transition-colors">Home</Link>
            <ChevronRight size={11} />
            <Link href="/allcategory" className="hover:text-[#555] transition-colors">Categories</Link>
            {categoryName && (
              <>
                <ChevronRight size={11} />
                <span className="text-[#1a1a1a]">{categoryName}</span>
              </>
            )}
          </nav>

          <h1 className="cp-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#1a1a1a]">
            {categoryName || 'Category'}
          </h1>
          {subcategories.length > 0 && (
            <p className="text-[10px] tracking-[0.14em] uppercase text-[#aaa] mt-3">
              {subcategories.length} subcategor{subcategories.length !== 1 ? 'ies' : 'y'}
            </p>
          )}
        </div>
      </div>

      {/* ── Subcategory grid ── */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-8 lg:px-12 py-14 sm:py-20">

        {subcategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Package size={40} className="text-[#d4cfc8]" />
            <p className="cp-serif text-2xl font-light text-[#888]">No subcategories yet</p>
            <p className="text-xs text-[#bbb]">Check back soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {subcategories.map((sub: any) => (
              <button
                key={sub.id}
                onClick={() => router.push(`${categoryId}/subcategory/${sub.id}/${categoryName}`)}
                className="cp-sub-card"
              >
                <div className="cp-img-ring">
                  <img
                    src={sub.imageUrl}
                    alt={sub.name}
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80';
                    }}
                  />
                </div>
                <span className="cp-sub-name">{sub.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="cp-divider" />
      <FooterPart />
    </div>
  );
};

export default CategoryPage;