'use client'
import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Edit, Trash2, X, FileText, User,
  Calendar, Upload, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

/* ─────────────────────────────────────────────
   MODAL
───────────────────────────────────────────── */
const Modal = ({ open, onClose, title, eyebrow, children }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-white border border-[#e8e4de] rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="sticky top-0 bg-white z-10 flex items-start justify-between px-6 pt-6 pb-4 border-b border-[#e8e4de]">
          <div>
            {eyebrow && <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-0.5">{eyebrow}</p>}
            <h2 className="blog-serif text-2xl font-light text-[#1a1a1a]">{title}</h2>
          </div>
          <button onClick={onClose} className="blog-icon-btn mt-1 flex-shrink-0"><X size={14} /></button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   FIELD
───────────────────────────────────────────── */
const Field = ({ label, required = false, error = '', hint = '', children }: any) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888]">
      {label}{required && <span className="text-[#c0392b] ml-0.5">*</span>}
    </label>
    {children}
    {hint  && !error && <p className="text-[11px] text-[#aaa]">{hint}</p>}
    {error && <p className="text-[11px] text-[#c0392b]">{error}</p>}
  </div>
);

/* ─────────────────────────────────────────────
   BLOG FORM
───────────────────────────────────────────── */
const BlogForm = ({
  formData, setFormData, coverImagePreview, setCoverImagePreview,
  setCoverImageFile, formErrors, handleImageChange,
  onSubmit, onCancel, submitLoading, isEdit,
}: any) => (
  <form onSubmit={e => { e.preventDefault(); onSubmit(); }} className="space-y-6">

    {/* Cover image */}
    <Field label="Cover Image">
      {coverImagePreview ? (
        <div className="relative group">
          <img src={coverImagePreview} alt="Preview" className="w-full h-44 object-cover rounded-sm border border-[#e8e4de]" />
          <button
            type="button"
            onClick={() => { setCoverImageFile(null); setCoverImagePreview(null); }}
            className="absolute top-2 right-2 w-8 h-8 bg-[#c0392b] text-white rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-36 border border-dashed border-[#d4cfc8] rounded-sm cursor-pointer hover:border-[#1a1a1a] transition-colors bg-[#faf9f7]">
          <Upload size={20} className="text-[#ccc] mb-2" />
          <p className="text-sm text-[#888]"><span className="font-medium text-[#1a1a1a]">Click to upload</span></p>
          <p className="text-xs text-[#aaa] mt-0.5">PNG, JPG up to 5MB</p>
          <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
        </label>
      )}
    </Field>

    <div className="blog-divider" />

    {/* Core fields */}
    <div className="space-y-4">
      <p className="text-[10px] tracking-[0.18em] uppercase font-semibold text-[#aaa]">Post Details</p>
      <Field label="Title" required error={formErrors.title}>
        <input
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter blog title"
          className={`blog-input ${formErrors.title ? 'error' : ''}`}
        />
      </Field>
      <Field label="Author Name" required error={formErrors.authorName}>
        <input
          value={formData.authorName}
          onChange={e => setFormData({ ...formData, authorName: e.target.value })}
          placeholder="e.g. Abhiraj Jain"
          className={`blog-input ${formErrors.authorName ? 'error' : ''}`}
        />
      </Field>
      <Field label="Excerpt" hint="Brief summary shown in blog cards">
        <textarea
          value={formData.excerpt}
          onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
          placeholder="Short description of the post…"
          rows={3}
          className="blog-input"
          style={{ resize: 'none' }}
        />
      </Field>
      <Field label="Content" required error={formErrors.content} hint="HTML is supported">
        <textarea
          value={formData.content}
          onChange={e => setFormData({ ...formData, content: e.target.value })}
          placeholder="Write your blog content here…"
          rows={10}
          className={`blog-input ${formErrors.content ? 'error' : ''}`}
          style={{ resize: 'vertical' }}
        />
      </Field>
    </div>

    <div className="blog-divider" />

    {/* SEO */}
    <div className="space-y-4">
      <p className="text-[10px] tracking-[0.18em] uppercase font-semibold text-[#aaa]">SEO Settings (optional)</p>
      <Field label="Meta Title" hint="Defaults to blog title">
        <input
          value={formData.metaTitle}
          onChange={e => setFormData({ ...formData, metaTitle: e.target.value })}
          placeholder="SEO page title"
          className="blog-input"
        />
      </Field>
      <Field label="Meta Description" hint="Defaults to excerpt">
        <textarea
          value={formData.metaDescription}
          onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
          placeholder="SEO description…"
          rows={3}
          className="blog-input"
          style={{ resize: 'none' }}
        />
      </Field>
    </div>

    {/* Actions */}
    <div className="flex justify-end gap-3 pt-4 border-t border-[#e8e4de]">
      <button type="button" onClick={onCancel} className="blog-outline-btn" disabled={submitLoading}>Cancel</button>
      <button type="submit" disabled={submitLoading} className="blog-primary-btn">
        {submitLoading
          ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />{isEdit ? 'Updating…' : 'Publishing…'}</>
          : isEdit ? 'Update Post' : 'Publish Post'
        }
      </button>
    </div>
  </form>
);

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const AdminBlogPage = () => {
  const [blogs, setBlogs]           = useState<any[]>([]);
  const [loading, setLoading]       = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [totalBlogs, setTotalBlogs]   = useState(0);
  const [filterPublished, setFilterPublished] = useState('all');

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen]     = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '', content: '', excerpt: '', authorName: '', metaTitle: '', metaDescription: '',
  });
  const [coverImageFile, setCoverImageFile]       = useState<any>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<any>(null);
  const [formErrors, setFormErrors]   = useState<any>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  /* ── Effects ── */
  useEffect(() => {
    const t = setTimeout(() => { if (searchTerm.trim()) setCurrentPage(1); }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => { setCurrentPage(1); }, [filterPublished, searchTerm]);

  useEffect(() => {
    searchTerm.trim() ? searchBlogs() : fetchBlogs();
  }, [currentPage, filterPublished, searchTerm]);

  /* ── Data ── */
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page: String(currentPage), limit: '9' });
      if (filterPublished !== 'all') p.append('published', filterPublished);
      const res  = await fetch(`${API_BASE}/blog/get/all/blogs?${p}`);
      const data = await res.json();
      if (data.success) { setBlogs(data.data); setTotalPages(data.pagination.totalPages); setTotalBlogs(data.pagination.total); }
    } catch { showAlert('Failed to fetch blogs', 'error'); }
    finally { setLoading(false); }
  };

  const searchBlogs = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/blog/search/blog?search=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      if (data.success) { setBlogs(data.data); setTotalPages(1); setTotalBlogs(data.count); }
      else { setBlogs([]); }
    } catch { showAlert('Search failed', 'error'); }
    finally { setLoading(false); }
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showAlert('Image must be under 5MB', 'error'); return; }
    setCoverImageFile(file);
    const r = new FileReader();
    r.onloadend = () => setCoverImagePreview(r.result);
    r.readAsDataURL(file);
  };

  const validate = () => {
    const e: any = {};
    if (!formData.title.trim())      e.title      = 'Required';
    if (!formData.content.trim())    e.content    = 'Required';
    if (!formData.authorName.trim()) e.authorName = 'Required';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', excerpt: '', authorName: '', metaTitle: '', metaDescription: '' });
    setCoverImageFile(null); setCoverImagePreview(null); setFormErrors({});
  };

  const buildFD = (extra: any = {}) => {
    const fd = new FormData();
    Object.entries({ ...formData, metaTitle: formData.metaTitle || formData.title, metaDescription: formData.metaDescription || formData.excerpt, ...extra }).forEach(([k, v]) => fd.append(k, v as string));
    if (coverImageFile) fd.append('coverImage', coverImageFile);
    return fd;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    setSubmitLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/blog/add/blog`, { method: 'POST', body: buildFD() });
      const data = await res.json();
      if (data.success) { showAlert('Blog published successfully!'); setCreateOpen(false); resetForm(); fetchBlogs(); }
      else { showAlert(data.message || 'Failed to create blog', 'error'); }
    } catch { showAlert('Failed to create blog', 'error'); }
    finally { setSubmitLoading(false); }
  };

  const handleEdit = async () => {
    if (!validate()) return;
    setSubmitLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/blog/edit/blog`, { method: 'PATCH', body: buildFD({ id: selectedBlog.id }) });
      const data = await res.json();
      if (data.success) { showAlert('Blog updated successfully!'); setEditOpen(false); resetForm(); setSelectedBlog(null); fetchBlogs(); }
      else { showAlert(data.message || 'Failed to update blog', 'error'); }
    } catch { showAlert('Failed to update blog', 'error'); }
    finally { setSubmitLoading(false); }
  };

  const handleDelete = async () => {
    setSubmitLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/blog/delete/blog`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selectedBlog.id }) });
      const data = await res.json();
      if (data.success) { showAlert('Blog deleted successfully!'); setDeleteOpen(false); setSelectedBlog(null); fetchBlogs(); }
      else { showAlert(data.message || 'Failed to delete blog', 'error'); }
    } catch { showAlert('Failed to delete blog', 'error'); }
    finally { setSubmitLoading(false); }
  };

  const openEditDialog = (blog: any) => {
    setSelectedBlog(blog);
    setFormData({ title: blog.title, content: blog.content, excerpt: blog.excerpt || '', authorName: blog.authorName, metaTitle: blog.metaTitle || '', metaDescription: blog.metaDescription || '' });
    setCoverImagePreview(blog.coverImage); setCoverImageFile(null); setFormErrors({});
    setEditOpen(true);
  };

  const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 5000);
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

  const formProps = { formData, setFormData, coverImagePreview, setCoverImagePreview, setCoverImageFile, formErrors, handleImageChange, submitLoading };

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .blog-serif { font-family: 'DM Sans', sans-serif; }

        .blog-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }

        .blog-input {
          width: 100%; padding: 9px 12px; font-size: 13px;
          border: 1px solid #e8e4de; border-radius: 2px;
          background: #fff; color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.2s;
        }
        .blog-input:focus { border-color: #1a1a1a; }
        .blog-input::placeholder { color: #ccc; }
        .blog-input.error { border-color: #f5b7b1; }

        .blog-primary-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: #1a1a1a; color: #fff; border: none;
          padding: 9px 20px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: background 0.2s;
          font-family: 'DM Sans', sans-serif; white-space: nowrap;
        }
        .blog-primary-btn:hover:not(:disabled) { background: #333; }
        .blog-primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .blog-outline-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent; color: #888; border: 1px solid #e8e4de;
          padding: 8px 16px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .blog-outline-btn:hover:not(:disabled) { border-color: #1a1a1a; color: #1a1a1a; }
        .blog-outline-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .blog-icon-btn {
          width: 30px; height: 30px; border-radius: 2px;
          border: 1px solid #e8e4de; background: #faf9f7;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #888; transition: all 0.15s;
        }
        .blog-icon-btn:hover { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
        .blog-icon-btn.danger:hover { background: #c0392b; border-color: #c0392b; }

        /* Blog card */
        .blog-card {
          background: #fff; border: 1px solid #e8e4de; border-radius: 2px;
          overflow: hidden; transition: box-shadow 0.25s, border-color 0.25s;
        }
        .blog-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); border-color: #d4cfc8; }

        .blog-card-img {
          width: 100%; aspect-ratio: 16/9;
          object-fit: cover; display: block;
          transition: transform 0.5s ease;
        }
        .blog-card:hover .blog-card-img { transform: scale(1.03); }

        /* Skeleton */
        .blog-skel {
          background: linear-gradient(90deg, #f5f3ef 0%, #ece9e3 50%, #f5f3ef 100%);
          background-size: 200% 100%;
          animation: bSkel 1.4s ease-in-out infinite;
          border-radius: 2px;
        }
        @keyframes bSkel {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Pagination */
        .pg-btn {
          width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
          border-radius: 2px; border: 1px solid #e8e4de; background: #fff;
          font-size: 11px; font-weight: 600; color: #888; cursor: pointer; transition: all 0.15s;
        }
        .pg-btn:hover:not(:disabled) { border-color: #1a1a1a; color: #1a1a1a; }
        .pg-btn.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
        .pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Blog-specific select */
        .blog-select {
          padding: 8px 30px 8px 12px; font-size: 11px; letter-spacing: 0.06em;
          border: 1px solid #e8e4de; border-radius: 2px; background: #fff; color: #1a1a1a;
          font-family: 'DM Sans', sans-serif; outline: none; appearance: none; cursor: pointer;
        }
        .blog-select:focus { border-color: #1a1a1a; }

        /* Alert */
        .blog-alert {
          display: flex; align-items: center; gap: 8px; padding: 11px 14px;
          border-radius: 2px; border: 1px solid; font-size: 13px; margin-bottom: 20px;
        }
        .blog-alert.success { background: #eafaf1; border-color: #a9dfbf; color: #1e8449; }
        .blog-alert.error   { background: #fdecea; border-color: #f5b7b1; color: #c0392b; }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .blog-fade { animation: fade-up 0.3s ease both; }
      `}</style>

      <Navbar />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-[#888] mb-1">Admin · Content</p>
            <h1 className="blog-serif text-4xl font-light text-[#1a1a1a]">Blog Management</h1>
            <p className="text-sm text-[#888] mt-1.5">Create, edit and publish blog posts.</p>
          </div>
          <button className="blog-primary-btn self-start sm:self-auto" onClick={() => { resetForm(); setCreateOpen(true); }}>
            <Plus size={14} /> New Post
          </button>
        </div>

        <div className="blog-divider mb-8" />

        {/* ── Alert ── */}
        {alert.show && (
          <div className={`blog-alert ${alert.type} blog-fade`}>
            {alert.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
            {alert.message}
          </div>
        )}

        {/* ── Controls ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" />
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by title…"
              className="blog-input pl-9"
            />
          </div>

          {/* Filter */}
          <div className="relative flex-shrink-0">
            <select value={filterPublished} onChange={e => setFilterPublished(e.target.value)} className="blog-select">
              <option value="all">All Posts</option>
              <option value="true">Published</option>
              <option value="false">Drafts</option>
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#aaa]" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>

          <button
            onClick={() => { setSearchTerm(''); setFilterPublished('all'); setCurrentPage(1); }}
            className="blog-outline-btn flex-shrink-0"
          >
            Clear
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-white border border-[#e8e4de] rounded-sm px-5 py-3">
            <p className="text-[9px] tracking-[0.18em] uppercase text-[#aaa] font-semibold mb-0.5">Total Posts</p>
            <p className="blog-serif text-2xl font-light text-[#1a1a1a]">{totalBlogs}</p>
          </div>
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white border border-[#e8e4de] rounded-sm overflow-hidden" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="blog-skel" style={{ height: 180 }} />
                <div className="p-4 space-y-2.5">
                  <div className="blog-skel h-4 w-4/5" />
                  <div className="blog-skel h-3 w-3/5" />
                  <div className="blog-skel h-3 w-2/5" />
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white border border-[#e8e4de] rounded-sm">
            <FileText size={40} className="text-[#d4cfc8]" />
            <p className="blog-serif text-2xl font-light text-[#888]">
              {searchTerm ? 'No posts match your search' : 'No blog posts yet'}
            </p>
            <p className="text-xs tracking-[0.08em] text-[#bbb]">
              {searchTerm ? 'Try different keywords' : 'Publish your first post'}
            </p>
            {!searchTerm && (
              <button className="blog-primary-btn mt-2" onClick={() => { resetForm(); setCreateOpen(true); }}>
                <Plus size={13} /> New Post
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {blogs.map((blog: any, i) => (
              <div key={blog.id} className="blog-card blog-fade" style={{ animationDelay: `${Math.min(i * 40, 280)}ms` }}>
                {/* Image */}
                <div className="overflow-hidden" style={{ aspectRatio: '16/9', background: '#f5f3ef' }}>
                  {blog.coverImage
                    ? <img src={blog.coverImage} alt={blog.title} className="blog-card-img" />
                    : <div className="w-full h-full flex items-center justify-center"><FileText size={28} className="text-[#d4cfc8]" /></div>
                  }
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="blog-serif text-lg font-light text-[#1a1a1a] line-clamp-2 leading-tight flex-1">
                      {blog.title}
                    </h3>
                    {/* Status dot */}
                    <span
                      className="flex-shrink-0 mt-1 w-2 h-2 rounded-full"
                      style={{ background: blog.publishedAt ? '#27ae60' : '#e67e22' }}
                      title={blog.publishedAt ? 'Published' : 'Draft'}
                    />
                  </div>

                  {blog.excerpt && (
                    <p className="text-xs text-[#888] line-clamp-2 leading-relaxed mb-4">{blog.excerpt}</p>
                  )}

                  <div className="flex flex-col gap-1.5 mb-4">
                    <p className="text-[11px] text-[#aaa] flex items-center gap-1.5">
                      <User size={11} className="flex-shrink-0" />{blog.authorName}
                    </p>
                    <p className="text-[11px] text-[#aaa] flex items-center gap-1.5">
                      <Calendar size={11} className="flex-shrink-0" />
                      {fmtDate(blog.publishedAt || blog.createdAt)}
                    </p>
                  </div>

                  <div className="blog-divider mb-4" />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditDialog(blog)}
                      className="blog-icon-btn flex-1 w-auto rounded-sm"
                      style={{ width: 'auto', padding: '0 12px', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, gap: 5 }}
                    >
                      <Edit size={12} /> Edit
                    </button>
                    <button
                      onClick={() => { setSelectedBlog(blog); setDeleteOpen(true); }}
                      className="blog-icon-btn danger flex-1 w-auto rounded-sm"
                      style={{ width: 'auto', padding: '0 12px', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, gap: 5 }}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <p className="text-xs text-[#888]">
              Page <strong className="text-[#1a1a1a]">{currentPage}</strong> of <strong className="text-[#1a1a1a]">{totalPages}</strong>
            </p>
            <div className="flex items-center gap-1.5">
              <button className="pg-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                <ChevronLeft size={14} />
              </button>
              {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                const page = totalPages <= 7 ? i + 1
                  : currentPage <= 4 ? i + 1
                  : currentPage >= totalPages - 3 ? totalPages - 6 + i
                  : currentPage - 3 + i;
                return (
                  <button key={page} className={`pg-btn ${currentPage === page ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>
                    {page}
                  </button>
                );
              })}
              <button className="pg-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ════════ CREATE MODAL ════════ */}
      <Modal open={createOpen} onClose={() => { setCreateOpen(false); resetForm(); }} title="New Blog Post" eyebrow="Create">
        <BlogForm {...formProps} isEdit={false} onSubmit={handleCreate} onCancel={() => { setCreateOpen(false); resetForm(); }} />
      </Modal>

      {/* ════════ EDIT MODAL ════════ */}
      <Modal open={editOpen} onClose={() => { setEditOpen(false); resetForm(); setSelectedBlog(null); }} title="Edit Blog Post" eyebrow="Update">
        <BlogForm {...formProps} isEdit onSubmit={handleEdit} onCancel={() => { setEditOpen(false); resetForm(); setSelectedBlog(null); }} />
      </Modal>

      {/* ════════ DELETE MODAL ════════ */}
      <Modal open={deleteOpen} onClose={() => { setDeleteOpen(false); setSelectedBlog(null); }} title="Delete Post?" eyebrow="Confirm Action">
        <p className="text-sm text-[#666] mb-6 leading-relaxed">
          "<strong className="text-[#1a1a1a]">{selectedBlog?.title}</strong>" will be permanently removed. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button className="blog-outline-btn flex-1" onClick={() => { setDeleteOpen(false); setSelectedBlog(null); }}>Cancel</button>
          <button
            disabled={submitLoading}
            onClick={handleDelete}
            className="flex-1 py-2 bg-[#c0392b] text-white text-[10px] tracking-[0.14em] uppercase font-semibold rounded-sm hover:bg-[#a93226] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitLoading
              ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Deleting…</>
              : <><Trash2 size={12} />Delete Post</>
            }
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminBlogPage;