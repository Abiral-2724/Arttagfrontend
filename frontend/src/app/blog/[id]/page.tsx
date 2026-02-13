'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Calendar, 
  User, 
  ArrowLeft,
  Share2,
  Clock,
  Tag,
  Heart,
  BookmarkPlus,
  Twitter,
  Facebook,
  Linkedin,
  Eye,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const params = useParams();
  const router = useRouter();
  const contentRef = useRef(null);
  
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    setIsVisible(true);
    if (params?.id) {
      fetchBlogDetails(params.id);
    }
  }, [params?.id]);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;
      setScrollProgress(scroll);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchBlogDetails = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/blog/details/blog/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setBlog(data.data);
      } else {
        setError(data.message || 'Blog not found');
      }
    } catch (error) {
      console.error('Error fetching blog details:', error);
      setError(error.message || 'Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const shareOnSocial = (platform) => {
    const url = window.location.href;
    const title = blog?.title || 'Arttag Blog';
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = window.location.href;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    const notification = document.createElement('div');
    notification.textContent = '✓ Link copied to clipboard!';
    notification.style.cssText = 'position:fixed;top:96px;right:24px;background:#7c3aed;color:white;padding:12px 24px;border-radius:12px;box-shadow:0 10px 25px rgba(124,58,237,0.25);z-index:9999;font-family:sans-serif;font-size:14px;font-weight:600;animation:slideInRight 0.3s ease-out;';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-32">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-violet-100 border-t-violet-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-pink-100 border-b-pink-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-gray-500 text-lg mt-8 animate-pulse">Loading your story...</p>
          <div className="flex gap-2 mt-4">
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6">
          <div className="text-center max-w-md">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-violet-100 to-pink-100 rounded-full flex items-center justify-center">
              <Sparkles size={48} className="text-violet-500" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              Story Not Found
            </h1>
            <p className="text-gray-500 mb-8 text-lg">{error || "The story you are looking for doesn't exist in our collection."}</p>
            <button
              onClick={() => router.push('/blog')}
              className="group px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-500 hover:to-pink-400 text-white rounded-xl transition-all font-semibold shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:scale-105 transform duration-300"
            >
              <span className="flex items-center gap-2">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Explore Our Stories
              </span>
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
        <div 
          className="h-full bg-gradient-to-r from-violet-500 via-pink-500 to-violet-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Newsreader:wght@300;400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .blog-content h1, .blog-content h2, .blog-content h3 {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          color: #111827;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          line-height: 1.3;
        }
        .blog-content h1 { font-size: 2.5rem; }
        .blog-content h2 { font-size: 2rem; }
        .blog-content h3 { font-size: 1.5rem; }
        .blog-content p {
          font-family: 'Newsreader', serif;
          font-size: 1.25rem;
          line-height: 2;
          color: #374151;
          margin-bottom: 1.75rem;
          font-weight: 300;
        }
        .blog-content strong { font-weight: 600; color: #111827; }
        .blog-content em {
          font-family: 'Crimson Text', serif;
          font-style: italic;
          color: #7c3aed;
        }
        .blog-content ul, .blog-content ol {
          font-family: 'Newsreader', serif;
          font-size: 1.25rem;
          line-height: 2;
          color: #374151;
          margin-bottom: 1.75rem;
          padding-left: 2rem;
        }
        .blog-content li { margin-bottom: 0.75rem; position: relative; }
        .blog-content ul li::before { content: '→'; position: absolute; left: -1.5rem; color: #7c3aed; }
        .blog-content blockquote {
          border-left: 4px solid #7c3aed;
          padding: 1.5rem 2rem;
          margin: 2.5rem 0;
          font-family: 'Crimson Text', serif;
          font-size: 1.5rem;
          font-style: italic;
          color: #6d28d9;
          background: rgba(124, 58, 237, 0.04);
          border-radius: 0.5rem;
        }
        .blog-content a {
          color: #7c3aed;
          text-decoration: none;
          border-bottom: 2px solid rgba(124, 58, 237, 0.3);
          transition: all 0.3s;
          padding-bottom: 2px;
        }
        .blog-content a:hover { color: #5b21b6; border-bottom-color: #5b21b6; }
        .blog-content img {
          width: 100%;
          border-radius: 1.5rem;
          margin: 3rem 0;
          box-shadow: 0 25px 50px -12px rgba(124, 58, 237, 0.15);
        }
        .blog-content code {
          background: rgba(124, 58, 237, 0.08);
          padding: 0.3rem 0.6rem;
          border-radius: 0.375rem;
          font-family: 'Courier New', monospace;
          color: #6d28d9;
          border: 1px solid rgba(124, 58, 237, 0.2);
        }
        .blog-content pre {
          background: rgba(124, 58, 237, 0.05);
          padding: 1.5rem;
          border-radius: 1rem;
          overflow-x: auto;
          margin: 2rem 0;
          border: 1px solid rgba(124, 58, 237, 0.15);
        }
      `}</style>

      <Navbar />

      {/* Back Button */}
      <div className={`max-w-7xl mx-auto px-6 pt-24 pb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <button
          onClick={() => router.push('/blog')}
          className="group flex items-center gap-3 text-gray-500 hover:text-violet-700 transition-all bg-white hover:bg-violet-50 px-6 py-3 rounded-full border border-gray-200 hover:border-violet-300 shadow-sm"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Stories</span>
        </button>
      </div>

      {/* Hero Cover Image */}
      {blog.coverImage && (
        <div className={`max-w-7xl mx-auto px-6 mb-16 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="relative h-[600px] rounded-3xl overflow-hidden group shadow-2xl shadow-gray-200">
            <img 
              src={blog.coverImage} 
              alt={blog.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            <div className="absolute top-6 right-6 flex gap-3">
              <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full border border-white/60 text-gray-800 text-sm font-semibold flex items-center gap-2 shadow-sm">
                <Eye size={16} className="text-violet-500" />
                <span>Featured</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article */}
      <article className="max-w-4xl mx-auto px-6 pb-24" ref={contentRef}>

        {/* Meta Info */}
        <div className={`flex flex-wrap items-center gap-6 mb-10 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center gap-3 px-4 py-2 bg-violet-50 rounded-full border border-violet-200">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {blog.authorName.charAt(0)}
            </div>
            <span className="font-semibold text-gray-800">{blog.authorName}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar size={18} className="text-violet-500" />
            <span>{formatDate(blog.publishedAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Clock size={18} className="text-pink-500" />
            <span>{calculateReadTime(blog.content)}</span>
          </div>
        </div>

        {/* Title */}
        <h1
          className={`text-5xl md:text-7xl font-black mb-8 leading-tight text-gray-900 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {blog.title}
        </h1>

        {/* Excerpt */}
        {blog.excerpt && (
          <div className={`relative mb-12 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 to-pink-400 rounded-full"></div>
            <p className="text-2xl text-gray-600 font-light leading-relaxed pl-8" style={{ fontFamily: "'Newsreader', serif" }}>
              {blog.excerpt}
            </p>
          </div>
        )}

        {/* Share Button */}
        <div className={`flex flex-wrap items-center gap-4 mb-16 pb-12 border-b border-gray-200 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="relative">
            <button 
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-500 hover:to-pink-400 rounded-xl transition-all text-white font-semibold shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:scale-105 transform"
            >
              <Share2 size={20} className="group-hover:rotate-12 transition-transform" />
              <span>Share</span>
            </button>

            {showShareMenu && (
              <>
                <div
                  className="fixed inset-0 z-0"
                  onClick={() => setShowShareMenu(false)}
                />
                <div className="absolute top-full mt-3 left-0 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl p-3 z-10 animate-slide-in">
                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3 px-2">Share this story</div>
                  <button
                    onClick={() => shareOnSocial('twitter')}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-all text-left text-gray-600 hover:text-gray-900"
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Twitter size={18} className="text-blue-400" />
                    </div>
                    <span className="font-medium">Twitter</span>
                  </button>
                  <button
                    onClick={() => shareOnSocial('facebook')}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-all text-left text-gray-600 hover:text-gray-900"
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Facebook size={18} className="text-blue-600" />
                    </div>
                    <span className="font-medium">Facebook</span>
                  </button>
                  <button
                    onClick={() => shareOnSocial('linkedin')}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-all text-left text-gray-600 hover:text-gray-900"
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Linkedin size={18} className="text-blue-500" />
                    </div>
                    <span className="font-medium">LinkedIn</span>
                  </button>
                  <div className="h-px bg-gray-100 my-3"></div>
                  <button
                    onClick={copyLink}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-all text-left text-gray-600 hover:text-gray-900"
                  >
                    <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
                      <Share2 size={18} className="text-violet-500" />
                    </div>
                    <span className="font-medium">Copy Link</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Blog Content */}
        <div 
          className={`blog-content transition-all duration-700 delay-600 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Author Card */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-100/60 to-pink-100/60 rounded-3xl blur-xl"></div>
          <div className="relative p-8 bg-gradient-to-br from-violet-50 to-pink-50 border border-violet-200 rounded-3xl overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-100/40 to-pink-100/40 rounded-full blur-3xl"></div>
            <div className="relative">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-violet-200 flex-shrink-0">
                  {blog.authorName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {blog.authorName}
                    </h3>
                    <span className="px-3 py-1 bg-violet-100 border border-violet-200 rounded-full text-xs text-violet-700 font-semibold">
                      Author
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg" style={{ fontFamily: "'Newsreader', serif" }}>
                    Passionate about the intersection of art and technology, bringing creative stories to life at Arttag.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Reading */}
        <div className="mt-20">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="text-violet-500" size={24} />
            <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Continue Reading
            </h2>
          </div>
          <button
            onClick={() => router.push('/blog')}
            className="w-full group px-8 py-6 bg-gradient-to-r from-violet-50 to-pink-50 hover:from-violet-100 hover:to-pink-100 border border-violet-200 hover:border-violet-400 rounded-2xl transition-all text-gray-800 font-semibold text-lg flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
          >
            <span>Explore More Stories</span>
            <ArrowLeft size={20} className="rotate-180 group-hover:translate-x-1 transition-transform text-violet-500" />
          </button>
        </div>
      </article>

      <Separator className="bg-gray-200" />
      <Footer />
    </div>
  );
};

export default BlogDetail;