"use client";
import React, { useState, useEffect } from "react";
import { ChevronRight, Package, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import FooterPart from "@/components/FooterPart";

const AllCategoriesPage = () => {
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true); setError(null);
      const res  = await fetch(`${API_BASE_URL}/category/get/all/category`);
      const data = await res.json();
      if (data.success) setCategories(data.category);
      else setError(data.message || 'Failed to fetch categories');
    } catch { setError('Error while getting categories, please try again later.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .ac-serif { font-family: 'Cormorant Garamond', serif; }
        .ac-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }
        .ac-card {
          background: #fff;
          border: 1px solid #e8e4de;
          border-radius: 2px;
          padding: 24px;
          cursor: pointer;
          transition: box-shadow 0.22s ease, border-color 0.22s ease, transform 0.22s ease;
        }
        .ac-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.07);
          border-color: #d4cfc8;
          transform: translateY(-2px);
        }
        .ac-card:hover .ac-arrow { transform: translate(3px, -3px); color: #1a1a1a; }
        .ac-arrow { color: #d4cfc8; transition: all 0.2s; }

        .ac-sub-tag {
          font-size: 10px; letter-spacing: 0.06em; font-weight: 600;
          color: #888; background: #f5f3ef; border: 1px solid #e8e4de;
          padding: 2px 8px; border-radius: 2px; white-space: nowrap;
        }
        .ac-skel {
          background: linear-gradient(90deg, #f5f3ef 0%, #ece9e3 50%, #f5f3ef 100%);
          background-size: 200% 100%;
          animation: acSkel 1.4s ease-in-out infinite;
          border-radius: 2px;
        }
        @keyframes acSkel {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <Navbar />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16">

        {/* Header */}
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.26em] uppercase text-[#888] mb-2">Shop by</p>
          <h1 className="ac-serif text-4xl sm:text-5xl font-light text-[#1a1a1a] mb-2">All Categories</h1>
          {!loading && !error && (
            <p className="text-sm text-[#888]">{categories.length} categor{categories.length !== 1 ? 'ies' : 'y'} available</p>
          )}
        </div>

        <div className="ac-divider mb-10" />

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="ac-skel h-32" style={{ animationDelay: `${i * 70}ms` }} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#fdecea] border border-[#f5b7b1] rounded-sm text-sm text-[#c0392b]">
              <AlertCircle size={15} /> {error}
            </div>
            <button
              onClick={fetchCategories}
              className="text-[10px] uppercase tracking-wider font-semibold text-[#1a1a1a] border-b border-[#1a1a1a] hover:opacity-60 transition-opacity"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && categories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Package size={36} className="text-[#d4cfc8]" />
            <p className="ac-serif text-2xl font-light text-[#888]">No categories yet</p>
            <p className="text-xs text-[#bbb]">Check back soon</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat: any, i: number) => (
              <div
                key={cat.id}
                className="ac-card"
                onClick={() => (window.location.href = `/product/category/${cat.id}`)}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h2 className="ac-serif text-2xl font-light text-[#1a1a1a] leading-snug">{cat.name}</h2>
                  <ChevronRight size={18} className="ac-arrow flex-shrink-0 mt-1" />
                </div>

                {cat.children && cat.children.length > 0 && (
                  <div>
                    <p className="text-[9px] tracking-[0.16em] uppercase text-[#aaa] font-semibold mb-2">
                      {cat.children.length} subcategor{cat.children.length !== 1 ? 'ies' : 'y'}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.children.slice(0, 4).map((child: any) => (
                        <span key={child.id} className="ac-sub-tag">{child.name}</span>
                      ))}
                      {cat.children.length > 4 && (
                        <span className="ac-sub-tag">+{cat.children.length - 4} more</span>
                      )}
                    </div>
                  </div>
                )}

                {(!cat.children || cat.children.length === 0) && (
                  <p className="text-[11px] text-[#ccc] tracking-[0.06em]">No subcategories</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ height: 1, background: 'linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent)' }} />
      <FooterPart />
    </div>
  );
};

export default AllCategoriesPage;