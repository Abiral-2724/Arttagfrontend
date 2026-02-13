'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  User, 
  ArrowRight, 
  Sparkles,
  Palette,
  Zap,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

const ArttagBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  const fetchBlogs = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/blog/get/all/blogs?page=${page}&limit=10`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setBlogs(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogClick = (blogId) => {
    router.push(`/blog/${blogId}`);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Newsreader:wght@300;400;600&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes glow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .blog-card {
          animation: slideUp 0.6s ease-out forwards;
        }
        
        .blog-card:nth-child(1) { animation-delay: 0.1s; }
        .blog-card:nth-child(2) { animation-delay: 0.2s; }
        .blog-card:nth-child(3) { animation-delay: 0.3s; }
        .blog-card:nth-child(4) { animation-delay: 0.4s; }
        .blog-card:nth-child(5) { animation-delay: 0.5s; }
        .blog-card:nth-child(6) { animation-delay: 0.6s; }
      `}</style>
      
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 px-6 bg-gradient-to-b from-violet-50 via-white to-white">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-violet-200/60 to-pink-200/60 rounded-full blur-3xl" style={{ animation: 'glow 4s ease-in-out infinite' }}></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-200/50 to-cyan-200/50 rounded-full blur-3xl" style={{ animation: 'glow 6s ease-in-out infinite' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-orange-100/40 to-rose-100/40 rounded-full blur-3xl" style={{ animation: 'glow 8s ease-in-out infinite' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Decorative Element */}
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-violet-400 to-transparent"></div>
            <Palette className="text-violet-500" size={24} />
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-violet-400 to-transparent"></div>
          </div>

          <h1 className="text-7xl md:text-8xl font-black text-center mb-6 leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="bg-gradient-to-r from-violet-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Welcome to the
            </span>
            <br />
            <span className="text-gray-900 mt-4 block">Arttag Blog</span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-center text-gray-600 mb-4 font-light" style={{ fontFamily: "'Newsreader', serif" }}>
            Where Art Meets Technology
          </p>
          
          <p className="max-w-3xl mx-auto text-center text-gray-500 text-lg leading-relaxed mb-12" style={{ fontFamily: "'Newsreader', serif" }}>
            Arttag Blog ek aisi jagah hai jahan creativity sirf dekhi nahi jaati, balki experience ki jaati hai. 
            Yahan hum baat karte hain art-inspired laptop skins, mobile skins, custom designs, trends, tips aur creative stories ki.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {[
              { icon: <Sparkles size={16} />, text: 'Art & Design' },
              { icon: <Zap size={16} />, text: 'Tech Styling' },
              { icon: <Palette size={16} />, text: 'Creative Stories' },
              { icon: <BookOpen size={16} />, text: 'Guides & Tips' }
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-violet-200 shadow-sm rounded-full text-sm text-gray-600 hover:bg-violet-50 hover:border-violet-400 hover:text-violet-700 transition-all"
              >
                <span className="text-violet-500">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-violet-200 border-t-violet-500 rounded-full animate-spin"></div>
                <Palette className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-500" size={32} />
              </div>
              <p className="text-gray-500 mt-6 text-lg">Loading creative stories...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-32">
              <BookOpen className="mx-auto text-gray-300 mb-6" size={80} />
              <p className="text-3xl font-bold text-gray-700 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                No Stories Yet
              </p>
              <p className="text-gray-400 text-lg">Check back soon for inspiring content!</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog, index) => (
                  <article
                    key={blog.id}
                    onClick={() => handleBlogClick(blog.id)}
                    className="blog-card group cursor-pointer opacity-0"
                  >
                    <div className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl hover:border-violet-300 transition-all duration-500 hover:shadow-xl hover:shadow-violet-100 h-full">
                      {/* Image Section */}
                      <div className="relative h-64 overflow-hidden">
                        {blog.coverImage ? (
                          <img 
                            src={blog.coverImage} 
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-violet-100 via-pink-100 to-orange-100 flex items-center justify-center">
                            <Palette className="text-violet-300" size={80} />
                          </div>
                        )}
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                        
                        {/* Floating Badge */}
                        <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-md border border-white/60 rounded-full shadow-sm">
                          <span className="text-xs font-semibold text-violet-600">Featured</span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6">
                        {/* Meta Info */}
                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-violet-400" />
                            <span>{blog.authorName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-violet-400" />
                            <span>{formatDate(blog.publishedAt)}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-violet-700 transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {blog.title}
                        </h2>

                        {/* Excerpt */}
                        {blog.excerpt && (
                          <p className="text-gray-500 leading-relaxed line-clamp-3 mb-4" style={{ fontFamily: "'Newsreader', serif" }}>
                            {blog.excerpt}
                          </p>
                        )}

                        {/* Read More */}
                        <div className="flex items-center gap-2 text-violet-600 font-semibold group-hover:gap-4 transition-all">
                          <span>Read More</span>
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                      {/* Decorative Corner */}
                      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-violet-50 to-transparent rounded-tl-full"></div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-16">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-semibold shadow-sm"
                  >
                    Previous
                  </button>

                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-12 h-12 rounded-xl font-bold transition-all ${
                          currentPage === i + 1
                            ? 'bg-gradient-to-br from-violet-600 to-pink-500 text-white shadow-lg shadow-violet-300'
                            : 'bg-white border border-gray-200 text-gray-500 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-semibold shadow-sm"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-violet-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Why Follow Arttag Blog?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {[
              { icon: <Sparkles />, title: 'Professionally Curated', desc: 'High-quality content crafted with care' },
              { icon: <Palette />, title: 'Art + Tech Fusion', desc: 'Perfect blend of creativity and innovation' },
              { icon: <Zap />, title: 'Creative Inspiration', desc: 'For artists, designers & entrepreneurs' },
              { icon: <BookOpen />, title: 'Practical Tips', desc: 'No fluff, just actionable insights' }
            ].map((item, index) => (
              <div 
                key={index}
                className="p-6 bg-white border border-gray-200 rounded-2xl hover:border-violet-300 hover:shadow-lg hover:shadow-violet-100 transition-all group"
              >
                <div className="text-violet-500 mb-4 group-hover:scale-110 transition-transform inline-block">
                  {React.cloneElement(item.icon, { size: 32 })}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {item.title}
                </h3>
                <p className="text-gray-500" style={{ fontFamily: "'Newsreader', serif" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-gray-200" />
      <Footer />
    </div>
  );
};

export default ArttagBlog;