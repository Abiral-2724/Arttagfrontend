'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Calendar, User, ArrowLeft, Share2, Clock,
  Twitter, Facebook, Linkedin, X,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const BlogDetail = () => {
  const [blog, setBlog]               = useState<any>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [showShare, setShowShare]     = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied]           = useState(false);
  const params  = useParams();
  const router  = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (params?.id) fetchBlog(params.id as string);
  }, [params?.id]);

  useEffect(() => {
    const h = () => {
      const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(total > 0 ? (document.documentElement.scrollTop / total) * 100 : 0);
    };
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const fetchBlog = async (id: string) => {
    setLoading(true); setError(null);
    try {
      const res  = await fetch(`${API_BASE}/blog/details/blog/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) setBlog(data.data);
      else setError(data.message || 'Blog not found');
    } catch (e: any) { setError(e.message || 'Failed to load blog'); }
    finally { setLoading(false); }
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  const readTime = (content: string) => `${Math.ceil(content.split(/\s+/).length / 200)} min read`;

  const shareOn = (platform: string) => {
    const url = window.location.href;
    const t   = blog?.title || 'Arttag Blog';
    const urls: any = {
      twitter:  `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(t)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    window.open(urls[platform], '_blank', 'width=600,height=400');
    setShowShare(false);
  };

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); }
    catch { /* fallback */ }
    setCopied(true); setTimeout(() => setCopied(false), 2500);
    setShowShare(false);
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center gap-4"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <div className="w-6 h-6 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs tracking-[0.15em] uppercase text-[#888]">Loading story…</p>
        </div>
      </>
    );
  }

  /* ── Error ── */
  if (error || !blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center gap-5 px-4"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <style>{`.bd-serif { font-family: 'Cormorant Garamond', serif; }`}</style>
          <h1 className="bd-serif text-4xl font-light text-[#1a1a1a]">Story Not Found</h1>
          <p className="text-sm text-[#888]">{error || "The story you're looking for doesn't exist."}</p>
          <button onClick={() => router.push('/blog')}
            className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-[10px] tracking-[0.16em] uppercase font-semibold rounded-sm hover:bg-[#333] transition-colors">
            <ArrowLeft size={13} /> Back to Stories
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] relative" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Reading progress */}
      <div className="fixed top-0 left-0 w-full h-0.5 bg-[#f0ece6] z-50">
        <div className="h-full bg-[#1a1a1a] transition-all duration-100" style={{ width: `${scrollProgress}%` }} />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .bd-serif { font-family: 'Cormorant Garamond', serif; }
        .bd-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }

        /* Blog content typography */
        .blog-content h1, .blog-content h2, .blog-content h3 {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          color: #1a1a1a;
          margin-top: 2.5rem;
          margin-bottom: 1.2rem;
          line-height: 1.3;
        }
        .blog-content h1 { font-size: 2.2rem; }
        .blog-content h2 { font-size: 1.75rem; }
        .blog-content h3 { font-size: 1.35rem; }
        .blog-content p {
          font-size: 1.05rem;
          line-height: 1.9;
          color: #444;
          margin-bottom: 1.5rem;
          font-family: 'DM Sans', sans-serif;
        }
        .blog-content strong { color: #1a1a1a; font-weight: 600; }
        .blog-content em { font-style: italic; color: #555; }
        .blog-content ul, .blog-content ol {
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
          color: #444;
          font-size: 1.05rem;
          line-height: 1.9;
        }
        .blog-content li { margin-bottom: 0.5rem; }
        .blog-content blockquote {
          border-left: 2px solid #1a1a1a;
          padding: 1rem 1.5rem;
          margin: 2rem 0;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-style: italic;
          color: #333;
          background: #faf9f7;
        }
        .blog-content a {
          color: #1a1a1a;
          text-decoration: underline;
          text-decoration-color: #d4cfc8;
          text-underline-offset: 3px;
          transition: text-decoration-color 0.2s;
        }
        .blog-content a:hover { text-decoration-color: #1a1a1a; }
        .blog-content img {
          width: 100%;
          border-radius: 2px;
          margin: 2.5rem 0;
          border: 1px solid #e8e4de;
        }
        .blog-content code {
          background: #f5f3ef;
          padding: 0.2rem 0.5rem;
          border-radius: 2px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
          border: 1px solid #e8e4de;
        }
        .blog-content pre {
          background: #f5f3ef;
          padding: 1.25rem;
          border-radius: 2px;
          overflow-x: auto;
          margin: 1.5rem 0;
          border: 1px solid #e8e4de;
        }
      `}</style>

      <Navbar />

      {/* Back */}
      <div className="max-w-[800px] mx-auto px-4 sm:px-8 pt-8 pb-4">
        <button
          onClick={() => router.push('/blog')}
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888] border border-[#e8e4de] px-4 py-2 rounded-sm hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all"
        >
          <ArrowLeft size={12} /> Back to Stories
        </button>
      </div>

      {/* Cover image */}
      {blog.coverImage && (
        <div className="max-w-[800px] mx-auto px-4 sm:px-8 mb-10">
          <div className="overflow-hidden rounded-sm border border-[#e8e4de]" style={{ aspectRatio: '16/9' }}>
            <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Article */}
      <article className="max-w-[720px] mx-auto px-4 sm:px-8 pb-20">

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-[11px] text-[#888]">
          <span className="flex items-center gap-1.5"><User size={11} />{blog.authorName}</span>
          <span className="flex items-center gap-1.5"><Calendar size={11} />{fmtDate(blog.publishedAt)}</span>
          <span className="flex items-center gap-1.5"><Clock size={11} />{readTime(blog.content)}</span>
        </div>

        {/* Title */}
        <h1 className="bd-serif text-4xl sm:text-5xl font-light text-[#1a1a1a] leading-snug mb-6">
          {blog.title}
        </h1>

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="text-lg text-[#666] font-light leading-relaxed border-l-2 border-[#1a1a1a] pl-5 mb-8">
            {blog.excerpt}
          </p>
        )}

        {/* Share */}
        <div className="flex items-center gap-3 mb-10 pb-8 border-b border-[#e8e4de]">
          <div className="relative">
            <button
              onClick={() => setShowShare(!showShare)}
              className="inline-flex items-center gap-2 border border-[#e8e4de] text-[#555] px-4 py-2 text-[10px] tracking-[0.12em] uppercase font-semibold rounded-sm hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all"
            >
              <Share2 size={12} /> Share
            </button>

            {showShare && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowShare(false)} />
                <div className="absolute top-full mt-2 left-0 bg-white border border-[#e8e4de] rounded-sm shadow-lg z-50 w-48 overflow-hidden">
                  <p className="text-[9px] tracking-[0.16em] uppercase text-[#aaa] font-semibold px-4 pt-3 pb-1">Share via</p>
                  {[
                    { id: 'twitter',  label: 'Twitter',  icon: Twitter },
                    { id: 'facebook', label: 'Facebook', icon: Facebook },
                    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
                  ].map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => shareOn(id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#555] hover:bg-[#faf9f7] transition-colors text-left">
                      <Icon size={14} className="text-[#888]" /> {label}
                    </button>
                  ))}
                  <div className="h-px bg-[#f0ece6] mx-4" />
                  <button onClick={copyLink}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#555] hover:bg-[#faf9f7] transition-colors text-left">
                    <Share2 size={14} className="text-[#888]" />
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} />

        {/* Author card */}
        <div className="mt-16 border border-[#e8e4de] rounded-sm p-6 bg-white flex items-start gap-5">
          <div className="w-12 h-12 bg-[#1a1a1a] rounded-sm flex items-center justify-center text-white text-lg font-semibold flex-shrink-0">
            {blog.authorName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-[#1a1a1a]">{blog.authorName}</p>
              <span className="text-[9px] tracking-[0.12em] uppercase text-[#aaa] border border-[#e8e4de] px-2 py-0.5 rounded-sm">Author</span>
            </div>
            <p className="text-xs text-[#888] leading-relaxed">
              Passionate about the intersection of art and technology, bringing creative stories to life at Arttag.
            </p>
          </div>
        </div>

        {/* Continue reading */}
        <div className="mt-12">
          <div className="bd-divider mb-8" />
          <button
            onClick={() => router.push('/blog')}
            className="w-full flex items-center justify-center gap-3 border border-[#e8e4de] bg-white text-[#555] py-4 text-[10px] tracking-[0.16em] uppercase font-semibold rounded-sm hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all group"
          >
            Explore More Stories
            <ArrowLeft size={12} className="rotate-180 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </article>

      <div style={{ height: 1, background: 'linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent)' }} />
      <Footer />
    </div>
  );
};

export default BlogDetail;