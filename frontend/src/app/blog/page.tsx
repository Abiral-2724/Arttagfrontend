'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, User, ArrowRight, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ArttagBlog = () => {
  const [blogs, setBlogs]           = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => { fetchBlogs(currentPage); }, [currentPage]);

  const fetchBlogs = async (page: number) => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/blog/get/all/blogs?page=${page}&limit=9`);
      const data = await res.json();
      if (data.success) { setBlogs(data.data); setTotalPages(data.pagination.totalPages); }
    } catch { console.error('Blog fetch failed'); }
    finally { setLoading(false); }
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

  const changePage = (p: number) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .bl-serif { font-family: 'Cormorant Garamond', serif; }
        .bl-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }
        .bl-card {
          background: #fff;
          border: 1px solid #e8e4de;
          border-radius: 2px;
          overflow: hidden;
          cursor: pointer;
          transition: box-shadow 0.25s, border-color 0.25s, transform 0.25s;
        }
        .bl-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
          border-color: #d4cfc8;
          transform: translateY(-3px);
        }
        .bl-card img { transition: transform 0.6s ease; }
        .bl-card:hover img { transform: scale(1.05); }
        .bl-card:hover .bl-read-more { gap: 10px; }
        .bl-read-more { display: flex; align-items: center; gap: 6px; transition: gap 0.2s; }

        .bl-skel {
          background: linear-gradient(90deg, #f5f3ef 0%, #ece9e3 50%, #f5f3ef 100%);
          background-size: 200% 100%;
          animation: blSkel 1.4s ease-in-out infinite;
          border-radius: 2px;
        }
        @keyframes blSkel {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .bl-pg-btn {
          width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;
          border-radius: 2px; border: 1px solid #e8e4de; background: #fff;
          font-size: 12px; font-weight: 600; color: #888; cursor: pointer; transition: all 0.15s;
        }
        .bl-pg-btn:hover:not(:disabled) { border-color: #1a1a1a; color: #1a1a1a; }
        .bl-pg-btn.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
        .bl-pg-btn:disabled { opacity: 0.3; cursor: not-allowed; }
      `}</style>

      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-[#1a1a1a] py-16 sm:py-24 px-4 text-center">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#555] mb-3">Arttag</p>
        <h1 className="bl-serif text-5xl sm:text-7xl font-light text-white mb-4 leading-tight">
          Our Stories
        </h1>
        <p className="text-[#888] text-base sm:text-lg font-light max-w-xl mx-auto">
          Art, design, technology, and the creative lives we lead.
        </p>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12 py-14">

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white border border-[#e8e4de] rounded-sm overflow-hidden" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="bl-skel" style={{ height: 200 }} />
                <div className="p-5 space-y-2.5">
                  <div className="bl-skel h-4 w-4/5" />
                  <div className="bl-skel h-3 w-3/5" />
                  <div className="bl-skel h-3 w-2/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && blogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <FileText size={40} className="text-[#d4cfc8]" />
            <p className="bl-serif text-3xl font-light text-[#888]">No stories yet</p>
            <p className="text-xs text-[#bbb]">Check back soon for inspiring content</p>
          </div>
        )}

        {/* Grid */}
        {!loading && blogs.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {blogs.map((blog: any, i: number) => (
                <article key={blog.id} className="bl-card" onClick={() => router.push(`/blog/${blog.id}`)}>
                  {/* Image */}
                  <div className="overflow-hidden" style={{ aspectRatio: '16/10', background: '#f5f3ef' }}>
                    {blog.coverImage
                      ? <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><FileText size={32} className="text-[#d4cfc8]" /></div>
                    }
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-4 mb-3 text-[11px] text-[#aaa]">
                      <span className="flex items-center gap-1.5"><User size={11} />{blog.authorName}</span>
                      <span className="flex items-center gap-1.5"><Calendar size={11} />{fmtDate(blog.publishedAt)}</span>
                    </div>
                    <h2 className="bl-serif text-xl font-light text-[#1a1a1a] line-clamp-2 leading-snug mb-2">
                      {blog.title}
                    </h2>
                    {blog.excerpt && (
                      <p className="text-xs text-[#888] line-clamp-2 leading-relaxed mb-4">{blog.excerpt}</p>
                    )}
                    <div className="bl-read-more text-[10px] tracking-[0.12em] uppercase font-semibold text-[#1a1a1a]">
                      Read more <ArrowRight size={12} />
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-12">
                <button className="bl-pg-btn" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
                  <ChevronLeft size={14} />
                </button>
                {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                  const page = totalPages <= 7 ? i + 1
                    : currentPage <= 4 ? i + 1
                    : currentPage >= totalPages - 3 ? totalPages - 6 + i
                    : currentPage - 3 + i;
                  return (
                    <button key={page} className={`bl-pg-btn ${currentPage === page ? 'active' : ''}`} onClick={() => changePage(page)}>
                      {page}
                    </button>
                  );
                })}
                <button className="bl-pg-btn" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="bl-divider" />
      <Footer />
    </div>
  );
};

export default ArttagBlog;