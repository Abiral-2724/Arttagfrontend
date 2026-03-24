"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Plus, FolderTree, ChevronRight, ImageIcon,
  AlertCircle, Package, X, CheckCircle2, Upload,
  ShoppingBag, LayoutGrid, Edit2, Trash2,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FooterPart from '@/components/FooterPart';
import Link from 'next/link';

/* ─────────────────────────────────────────────
   MODAL
───────────────────────────────────────────── */
const Modal = ({ open, onClose, title, eyebrow, children }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-white border border-[#e8e4de] rounded-sm w-full max-w-md"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#e8e4de]">
          <div>
            {eyebrow && <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-0.5">{eyebrow}</p>}
            <h2 className="cat-serif text-2xl font-light text-[#1a1a1a]">{title}</h2>
          </div>
          <button onClick={onClose} className="cat-icon-btn mt-0.5"><X size={14} /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   FIELD
───────────────────────────────────────────── */
const Field = ({ label, required = false, children }: any) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888]">
      {label}{required && <span className="text-[#c0392b] ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
const CategoryManagement = () => {
  const { userId } = useParams();
  const router = useRouter();

  const [categories, setCategories]   = useState<any[]>([]);
  const [loading, setLoading]         = useState(false);
  const [isChecking, setIsChecking]   = useState(true);
  const [alert, setAlert]             = useState({ show: false, message: '', type: 'success' });

  // Category dialog
  const [catDialogOpen, setCatDialogOpen]   = useState(false);
  const [catName, setCatName]               = useState('');
  const [catLoading, setCatLoading]         = useState(false);

  // Subcategory dialog
  const [subDialogOpen, setSubDialogOpen]   = useState(false);
  const [subName, setSubName]               = useState('');
  const [subImage, setSubImage]             = useState<File | null>(null);
  const [subImagePreview, setSubImagePreview] = useState<string | null>(null);
  const [selectedParentId, setSelectedParentId] = useState('');
  const [subLoading, setSubLoading]         = useState(false);

  // Expand state
  const [expanded, setExpanded]           = useState<Set<string>>(new Set());
  const [subsData, setSubsData]           = useState<Record<string, any[]>>({});
  const [subsLoading, setSubsLoading]     = useState<Record<string, boolean>>({});

  // Edit subcategory
  const [editSubDialogOpen, setEditSubDialogOpen] = useState(false);
  const [editingSub, setEditingSub]               = useState<any>(null);
  const [editSubName, setEditSubName]             = useState('');
  const [editSubImage, setEditSubImage]           = useState<File | null>(null);
  const [editSubImagePreview, setEditSubImagePreview] = useState<string | null>(null);
  const [editSubLoading, setEditSubLoading]       = useState(false);

  // Delete confirm
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem]         = useState<any>(null); // { id, name, parentId }
  const [deleteLoading, setDeleteLoading]       = useState(false);

  // Edit category
  const [editCatDialogOpen, setEditCatDialogOpen] = useState(false);
  const [editingCat, setEditingCat]               = useState<any>(null);
  const [editCatName, setEditCatName]             = useState('');
  const [editCatLoading, setEditCatLoading]       = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  /* ── Auth ── */
  useEffect(() => {
    const check = async () => {
      try {
        const uid = localStorage.getItem('arttagUserId');
        const tok = localStorage.getItem('arttagtoken');
        if (!uid || !tok || uid !== userId) { router.replace('/login'); return; }
        const res = await axios.get(`${API_BASE_URL}/user/${userId}/get/profile`);
        if (!res.data.success || res.data.user.role !== 'ADMIN') { router.replace('/login'); return; }
      } catch { router.replace('/login'); }
      finally { setIsChecking(false); }
    };
    if (userId) check();
  }, [userId, router]);

  useEffect(() => { fetchCategories(); }, []);

  const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/category/get/all/category`);
      if (res.data.success) setCategories(res.data.category);
    } catch (e: any) { showAlert(e.response?.data?.message || 'Failed to fetch categories', 'error'); }
    finally { setLoading(false); }
  };

  const fetchSubcategories = async (catId: string) => {
    setSubsLoading(p => ({ ...p, [catId]: true }));
    try {
      const res = await axios.get(`${API_BASE_URL}/category/get/${catId}/all/subcategory`);
      const subs = (res.data.subcategories || []).sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setSubsData(p => ({ ...p, [catId]: subs }));
    } catch (e: any) {
      const msg = e.response?.data?.message || '';
      if (e.response?.status === 404 || msg.includes('No subcategory')) {
        setSubsData(p => ({ ...p, [catId]: [] }));
      } else { showAlert('Failed to load subcategories', 'error'); }
    } finally { setSubsLoading(p => ({ ...p, [catId]: false })); }
  };

  const toggleCategory = async (catId: string) => {
    const next = new Set(expanded);
    if (next.has(catId)) { next.delete(catId); }
    else { next.add(catId); await fetchSubcategories(catId); }
    setExpanded(next);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/category/${userId}/add/category/or/subcategory`, { name: catName });
      if (res.data.success) {
        showAlert('Category created successfully!');
        setCatName(''); setCatDialogOpen(false); fetchCategories();
      }
    } catch (e: any) { showAlert(e.response?.data?.message || 'Failed to create category', 'error'); }
    finally { setCatLoading(false); }
  };

  const handleSubcategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subImage) { showAlert('Please select an image', 'error'); return; }
    setSubLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', subName);
      fd.append('parentId', selectedParentId);
      fd.append('image', subImage);
      const res = await axios.post(`${API_BASE_URL}/category/${userId}/add/category/or/subcategory`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        showAlert('Subcategory created successfully!');
        setSubName(''); setSubImage(null); setSubImagePreview(null);
        await fetchSubcategories(selectedParentId);
        setExpanded(p => new Set([...p, selectedParentId]));
        setSelectedParentId(''); setSubDialogOpen(false); fetchCategories();
      }
    } catch (e: any) { showAlert(e.response?.data?.message || 'Failed to create subcategory', 'error'); }
    finally { setSubLoading(false); }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setSubImage(f);
    const r = new FileReader();
    r.onloadend = () => setSubImagePreview(r.result as string);
    r.readAsDataURL(f);
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setEditSubImage(f);
    const r = new FileReader();
    r.onloadend = () => setEditSubImagePreview(r.result as string);
    r.readAsDataURL(f);
  };

  const openEditSubDialog = (sub: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSub(sub);
    setEditSubName(sub.name);
    setEditSubImagePreview(sub.imageUrl || null);
    setEditSubImage(null);
    setEditSubDialogOpen(true);
  };

  const openEditCatDialog = (cat: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCat(cat);
    setEditCatName(cat.name);
    setEditCatDialogOpen(true);
  };

  const openDeleteDialog = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingItem(item);
    setDeleteDialogOpen(true);
  };

  const handleEditCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat || !editCatName.trim()) return;
    setEditCatLoading(true);
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/category/update/${userId}/${editingCat.id}`,
        { name: editCatName }
      );
      if (res.data.success) {
        showAlert('Category updated successfully!');
        setEditCatDialogOpen(false); setEditingCat(null); setEditCatName('');
        fetchCategories();
      }
    } catch (e: any) { showAlert(e.response?.data?.message || 'Failed to update category', 'error'); }
    finally { setEditCatLoading(false); }
  };

  const handleEditSubcategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub || !editSubName.trim()) return;
    setEditSubLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', editSubName);
      if (editSubImage) fd.append('image', editSubImage);
      const res = await axios.patch(
        `${API_BASE_URL}/category/update/${userId}/${editingSub.id}`,
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (res.data.success) {
        showAlert('Subcategory updated successfully!');
        setEditSubDialogOpen(false); setEditingSub(null);
        setEditSubName(''); setEditSubImage(null); setEditSubImagePreview(null);
        // Refresh the parent's subs
        if (editingSub.parentId) await fetchSubcategories(editingSub.parentId);
      }
    } catch (e: any) { showAlert(e.response?.data?.message || 'Failed to update subcategory', 'error'); }
    finally { setEditSubLoading(false); }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleteLoading(true);
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/category/delete/${userId}/${deletingItem.id}`
      );
      if (res.data.success) {
        showAlert(res.data.message || 'Deleted successfully!');
        setDeleteDialogOpen(false); setDeletingItem(null);
        if (deletingItem.parentId) {
          // It's a subcategory — refresh parent's sub list
          await fetchSubcategories(deletingItem.parentId);
        } else {
          fetchCategories();
        }
      }
    } catch (e: any) { showAlert(e.response?.data?.message || 'Failed to delete', 'error'); }
    finally { setDeleteLoading(false); }
  };

  /* ── Loading screen ── */
  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center gap-4"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap'); .cat-serif { font-family: 'Cormorant Garamond', serif; }`}</style>
        <Link href="/"><span className="cat-serif text-3xl font-light tracking-[0.2em] text-[#1a1a1a]">ARTTAG</span></Link>
        <div className="w-7 h-7 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs tracking-[0.15em] uppercase text-[#888]">Verifying access…</p>
      </div>
    );
  }

  /* ── Stat counts ── */
  const totalSubs = categories.reduce((s: number, c: any) => s + (subsData[c.id]?.length ?? c.children?.length ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .cat-serif { font-family: 'DM Sans', sans-serif; }

        .cat-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }

        /* Inputs */
        .cat-input {
          width: 100%; padding: 9px 12px; font-size: 13px;
          border: 1px solid #e8e4de; border-radius: 2px;
          background: #fff; color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.2s;
        }
        .cat-input:focus { border-color: #1a1a1a; }
        .cat-input::placeholder { color: #ccc; }

        /* Buttons */
        .cat-primary-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: #1a1a1a; color: #fff; border: none;
          padding: 9px 18px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: background 0.2s;
          font-family: 'DM Sans', sans-serif; white-space: nowrap;
        }
        .cat-primary-btn:hover:not(:disabled) { background: #333; }
        .cat-primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .cat-outline-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent; color: #888; border: 1px solid #e8e4de;
          padding: 8px 16px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .cat-outline-btn:hover { border-color: #1a1a1a; color: #1a1a1a; }

        .cat-add-sub-btn {
          display: inline-flex; align-items: center; gap: 5px;
          background: #faf9f7; color: #555; border: 1px solid #e8e4de;
          padding: 5px 12px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: all 0.15s;
          font-family: 'DM Sans', sans-serif; white-space: nowrap; flex-shrink: 0;
        }
        .cat-add-sub-btn:hover { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }

        .cat-icon-btn {
          width: 28px; height: 28px; border-radius: 2px;
          border: 1px solid #e8e4de; background: #faf9f7;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #888; transition: all 0.15s; flex-shrink: 0;
        }
        .cat-icon-btn:hover { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }

        /* Category row */
        .cat-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px; cursor: pointer;
          transition: background 0.12s; border-bottom: 1px solid #f0ece6;
          gap: 12px;
        }
        .cat-row:hover { background: #faf9f7; }
        .cat-row:last-of-type { border-bottom: none; }

        /* Sub card */
        .sub-card {
          display: flex; align-items: center; gap: 12px;
          background: #fff; border: 1px solid #e8e4de; border-radius: 2px;
          padding: 10px 14px; transition: all 0.2s;
        }
        .sub-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); border-color: #d4cfc8; }

        /* Stat card */
        .cat-stat {
          background: #fff; border: 1px solid #e8e4de; border-radius: 2px;
          padding: 16px 20px; flex: 1; min-width: 0;
        }

        /* Alert */
        .cat-alert {
          display: flex; align-items: center; gap: 8px; padding: 11px 14px;
          border-radius: 2px; border: 1px solid; font-size: 13px; margin-bottom: 20px;
        }
        .cat-alert.success { background: #eafaf1; border-color: #a9dfbf; color: #1e8449; }
        .cat-alert.error   { background: #fdecea; border-color: #f5b7b1; color: #c0392b; }

        /* Skeleton */
        .cat-skel {
          background: linear-gradient(90deg, #f5f3ef 0%, #ece9e3 50%, #f5f3ef 100%);
          background-size: 200% 100%;
          animation: catSkel 1.4s ease-in-out infinite;
          border-radius: 2px;
        }
        @keyframes catSkel {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Count badge */
        .cat-count {
          font-size: 10px; letter-spacing: 0.06em; font-weight: 600;
          color: #888; background: #f5f3ef; border: 1px solid #e8e4de;
          padding: 2px 8px; border-radius: 2px; white-space: nowrap;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cat-expand { animation: fade-in 0.2s ease; }
      `}</style>

      <Navbar />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-[#888] mb-1">Admin · Catalogue</p>
            <h1 className="cat-serif text-4xl font-light text-[#1a1a1a]">Category Management</h1>
            <p className="text-sm text-[#888] mt-1.5">Organise your store catalogue with categories and subcategories.</p>
          </div>
          <div className="flex flex-wrap gap-3 self-start sm:self-auto">
            <button className="cat-outline-btn" onClick={() => router.push(`/${userId}/admin/product`)}>
              <Package size={13} /> Products
            </button>
            <button className="cat-outline-btn" onClick={() => router.push(`/${userId}/admin/orders`)}>
              <ShoppingBag size={13} /> Orders
            </button>
            <button className="cat-primary-btn" onClick={() => setCatDialogOpen(true)}>
              <Plus size={14} /> Add Category
            </button>
          </div>
        </div>

        <div className="cat-divider mb-8" />

        {/* ── Alert ── */}
        {alert.show && (
          <div className={`cat-alert ${alert.type}`}>
            {alert.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
            {alert.message}
          </div>
        )}

        {/* ── Stat cards ── */}
        <div className="flex gap-4 flex-wrap mb-8">
          <div className="cat-stat">
            <p className="text-[9px] tracking-[0.18em] uppercase text-[#aaa] font-semibold mb-1">Categories</p>
            <p className="cat-serif text-3xl font-light text-[#1a1a1a]">{categories.length}</p>
          </div>
          <div className="cat-stat">
            <p className="text-[9px] tracking-[0.18em] uppercase text-[#aaa] font-semibold mb-1">Subcategories</p>
            <p className="cat-serif text-3xl font-light text-[#1a1a1a]">{totalSubs}</p>
          </div>
        </div>

        {/* ── Category list ── */}
        <div className="bg-white border border-[#e8e4de] rounded-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e4de]">
            <div>
              <h2 className="cat-serif text-xl font-light text-[#1a1a1a]">All Categories</h2>
              <p className="text-[10px] tracking-[0.1em] uppercase text-[#aaa] mt-0.5">
                {loading ? 'Loading…' : `${categories.length} categor${categories.length !== 1 ? 'ies' : 'y'} · click to expand`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="cat-skel h-12" style={{ animationDelay: `${i * 70}ms` }} />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <FolderTree size={40} className="text-[#d4cfc8]" />
              <p className="cat-serif text-2xl font-light text-[#888]">No categories yet</p>
              <p className="text-xs tracking-[0.08em] text-[#bbb]">Create your first category to get started</p>
              <button className="cat-primary-btn mt-2" onClick={() => setCatDialogOpen(true)}>
                <Plus size={13} /> Add Category
              </button>
            </div>
          ) : (
            <div>
              {categories.map((cat: any, idx: number) => {
                const isOpen   = expanded.has(cat.id);
                const subCount = subsData[cat.id]?.length ?? cat.children?.length ?? 0;
                const isLoading = subsLoading[cat.id];
                return (
                  <div key={cat.id} style={{ borderBottom: idx < categories.length - 1 ? '1px solid #f0ece6' : 'none' }}>
                    {/* Category row */}
                    <div className="cat-row" onClick={() => toggleCategory(cat.id)}>
                      <div className="flex items-center gap-3 min-w-0">
                        <ChevronRight
                          size={16}
                          className="text-[#aaa] flex-shrink-0 transition-transform duration-200"
                          style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                        />
                        <div className="w-8 h-8 bg-[#f5f3ef] border border-[#e8e4de] rounded-sm flex items-center justify-center flex-shrink-0">
                          <LayoutGrid size={14} className="text-[#888]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#1a1a1a]">{cat.name}</p>
                          <p className="text-[10px] text-[#aaa] mt-0.5 tracking-[0.06em]">
                            {subCount} subcategor{subCount !== 1 ? 'ies' : 'y'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          className="cat-add-sub-btn"
                          onClick={e => { e.stopPropagation(); setSelectedParentId(cat.id); setSubDialogOpen(true); }}
                        >
                          <Plus size={11} /> Add Sub
                        </button>
                        <button
                          className="cat-icon-btn"
                          title="Edit category"
                          onClick={e => openEditCatDialog(cat, e)}
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          className="cat-icon-btn"
                          title="Delete category"
                          style={{ '--hover-bg': '#fdecea', '--hover-border': '#f5b7b1', '--hover-color': '#c0392b' } as any}
                          onClick={e => openDeleteDialog({ ...cat, parentId: null }, e)}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = '#fdecea';
                            (e.currentTarget as HTMLElement).style.borderColor = '#f5b7b1';
                            (e.currentTarget as HTMLElement).style.color = '#c0392b';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = '#faf9f7';
                            (e.currentTarget as HTMLElement).style.borderColor = '#e8e4de';
                            (e.currentTarget as HTMLElement).style.color = '#888';
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Subcategory panel */}
                    {isOpen && (
                      <div className="cat-expand bg-[#faf9f7] border-t border-[#f0ece6] px-5 py-5">
                        {isLoading ? (
                          <div className="flex items-center gap-3 py-4 justify-center">
                            <div className="w-4 h-4 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs tracking-[0.1em] uppercase text-[#888]">Loading subcategories…</p>
                          </div>
                        ) : subsData[cat.id]?.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {subsData[cat.id].map((sub: any) => (
                              <div key={sub.id} className="sub-card">
                                {sub.imageUrl ? (
                                  <img
                                    src={sub.imageUrl}
                                    alt={sub.name}
                                    className="w-12 h-12 rounded-sm object-cover border border-[#e8e4de] flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-[#f5f3ef] border border-[#e8e4de] rounded-sm flex items-center justify-center flex-shrink-0">
                                    <ImageIcon size={16} className="text-[#ccc]" />
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-[#1a1a1a] truncate">{sub.name}</p>
                                  <p className="text-[10px] text-[#aaa] mt-0.5 font-mono tracking-[0.04em]">
                                    {sub.id.slice(0, 10)}…
                                  </p>
                                </div>
                                <div className="flex gap-1.5 flex-shrink-0">
                                  <button
                                    className="cat-icon-btn"
                                    title="Edit subcategory"
                                    onClick={e => openEditSubDialog({ ...sub, parentId: cat.id }, e)}
                                  >
                                    <Edit2 size={12} />
                                  </button>
                                  <button
                                    className="cat-icon-btn"
                                    title="Delete subcategory"
                                    onClick={e => openDeleteDialog({ ...sub, parentId: cat.id }, e)}
                                    onMouseEnter={e => {
                                      (e.currentTarget as HTMLElement).style.background = '#fdecea';
                                      (e.currentTarget as HTMLElement).style.borderColor = '#f5b7b1';
                                      (e.currentTarget as HTMLElement).style.color = '#c0392b';
                                    }}
                                    onMouseLeave={e => {
                                      (e.currentTarget as HTMLElement).style.background = '#faf9f7';
                                      (e.currentTarget as HTMLElement).style.borderColor = '#e8e4de';
                                      (e.currentTarget as HTMLElement).style.color = '#888';
                                    }}
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8 gap-2 bg-white border border-dashed border-[#d4cfc8] rounded-sm">
                            <Package size={24} className="text-[#d4cfc8]" />
                            <p className="text-sm font-light text-[#888]">No subcategories yet</p>
                            <button
                              className="cat-add-sub-btn mt-1"
                              onClick={e => { e.stopPropagation(); setSelectedParentId(cat.id); setSubDialogOpen(true); }}
                            >
                              <Plus size={11} /> Add Subcategory
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ════════ ADD CATEGORY MODAL ════════ */}
      <Modal open={catDialogOpen} onClose={() => { setCatDialogOpen(false); setCatName(''); }} title="Add Category" eyebrow="New">
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <Field label="Category Name" required>
            <input
              value={catName}
              onChange={e => setCatName(e.target.value)}
              placeholder="e.g. Bags & Wallets"
              className="cat-input"
              required
            />
          </Field>
          <div className="cat-divider" />
          <div className="flex justify-end gap-3">
            <button type="button" className="cat-outline-btn" onClick={() => { setCatDialogOpen(false); setCatName(''); }}>Cancel</button>
            <button type="submit" disabled={catLoading || !catName.trim()} className="cat-primary-btn">
              {catLoading
                ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating…</>
                : <><Plus size={13} />Create Category</>
              }
            </button>
          </div>
        </form>
      </Modal>

      {/* ════════ ADD SUBCATEGORY MODAL ════════ */}
      <Modal open={subDialogOpen} onClose={() => { setSubDialogOpen(false); setSubName(''); setSubImage(null); setSubImagePreview(null); }} title="Add Subcategory" eyebrow="New">
        <form onSubmit={handleSubcategorySubmit} className="space-y-4">
          <Field label="Subcategory Name" required>
            <input
              value={subName}
              onChange={e => setSubName(e.target.value)}
              placeholder="e.g. Laptop Backpacks"
              className="cat-input"
              required
            />
          </Field>

          <Field label="Image" required>
            {subImagePreview ? (
              <div className="relative group">
                <img src={subImagePreview} alt="Preview" className="w-full h-36 object-cover rounded-sm border border-[#e8e4de]" />
                <button
                  type="button"
                  onClick={() => { setSubImage(null); setSubImagePreview(null); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-[#c0392b] text-white rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-[#d4cfc8] rounded-sm cursor-pointer hover:border-[#1a1a1a] transition-colors bg-[#faf9f7]">
                <Upload size={18} className="text-[#ccc] mb-2" />
                <p className="text-xs text-[#888]"><span className="font-medium text-[#1a1a1a]">Click to upload</span></p>
                <p className="text-[11px] text-[#aaa] mt-0.5">PNG, JPG up to 5MB</p>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </Field>

          <div className="cat-divider" />
          <div className="flex justify-end gap-3">
            <button type="button" className="cat-outline-btn" onClick={() => { setSubDialogOpen(false); setSubName(''); setSubImage(null); setSubImagePreview(null); }}>Cancel</button>
            <button type="submit" disabled={subLoading || !subName.trim() || !subImage} className="cat-primary-btn">
              {subLoading
                ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating…</>
                : <><Plus size={13} />Create Subcategory</>
              }
            </button>
          </div>
        </form>
      </Modal>

      {/* ════════ EDIT CATEGORY MODAL ════════ */}
      <Modal open={editCatDialogOpen} onClose={() => { setEditCatDialogOpen(false); setEditingCat(null); setEditCatName(''); }} title="Edit Category" eyebrow="Update">
        <form onSubmit={handleEditCategorySubmit} className="space-y-4">
          <Field label="Category Name" required>
            <input
              value={editCatName}
              onChange={e => setEditCatName(e.target.value)}
              placeholder="e.g. Bags & Wallets"
              className="cat-input"
              required
            />
          </Field>
          <div className="cat-divider" />
          <div className="flex justify-end gap-3">
            <button type="button" className="cat-outline-btn" onClick={() => { setEditCatDialogOpen(false); setEditingCat(null); setEditCatName(''); }}>Cancel</button>
            <button type="submit" disabled={editCatLoading || !editCatName.trim()} className="cat-primary-btn">
              {editCatLoading
                ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</>
                : <><Edit2 size={13} />Save Changes</>
              }
            </button>
          </div>
        </form>
      </Modal>

      {/* ════════ EDIT SUBCATEGORY MODAL ════════ */}
      <Modal open={editSubDialogOpen} onClose={() => { setEditSubDialogOpen(false); setEditingSub(null); setEditSubName(''); setEditSubImage(null); setEditSubImagePreview(null); }} title="Edit Subcategory" eyebrow="Update">
        <form onSubmit={handleEditSubcategorySubmit} className="space-y-4">
          <Field label="Subcategory Name" required>
            <input
              value={editSubName}
              onChange={e => setEditSubName(e.target.value)}
              placeholder="e.g. Laptop Backpacks"
              className="cat-input"
              required
            />
          </Field>

          <Field label="Image (optional — upload to replace)">
            {editSubImagePreview ? (
              <div className="relative group">
                <img src={editSubImagePreview} alt="Preview" className="w-full h-36 object-cover rounded-sm border border-[#e8e4de]" />
                <button
                  type="button"
                  onClick={() => { setEditSubImage(null); setEditSubImagePreview(editingSub?.imageUrl || null); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-[#c0392b] text-white rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
                {!editSubImage && <p className="text-[10px] text-[#aaa] mt-1.5">Current image · upload a new file to replace it</p>}
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-[#d4cfc8] rounded-sm cursor-pointer hover:border-[#1a1a1a] transition-colors bg-[#faf9f7]">
                <Upload size={18} className="text-[#ccc] mb-2" />
                <p className="text-xs text-[#888]"><span className="font-medium text-[#1a1a1a]">Click to upload new image</span></p>
                <p className="text-[11px] text-[#aaa] mt-0.5">PNG, JPG up to 5MB</p>
                <input type="file" accept="image/*" className="hidden" onChange={handleEditImageChange} />
              </label>
            )}
          </Field>

          <div className="cat-divider" />
          <div className="flex justify-end gap-3">
            <button type="button" className="cat-outline-btn" onClick={() => { setEditSubDialogOpen(false); setEditingSub(null); setEditSubName(''); setEditSubImage(null); setEditSubImagePreview(null); }}>Cancel</button>
            <button type="submit" disabled={editSubLoading || !editSubName.trim()} className="cat-primary-btn">
              {editSubLoading
                ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</>
                : <><Edit2 size={13} />Save Changes</>
              }
            </button>
          </div>
        </form>
      </Modal>

      {/* ════════ DELETE CONFIRM MODAL ════════ */}
      <Modal open={deleteDialogOpen} onClose={() => { setDeleteDialogOpen(false); setDeletingItem(null); }} title="Delete?" eyebrow="Confirm Action">
        <p className="text-sm text-[#666] mb-2 leading-relaxed">
          <strong className="text-[#1a1a1a]">"{deletingItem?.name}"</strong> will be permanently removed.
        </p>
        {!deletingItem?.parentId && (
          <p className="text-xs text-[#e67e22] mb-5">Note: Deletion will fail if this category still has subcategories.</p>
        )}
        {deletingItem?.parentId && (
          <p className="text-xs text-[#aaa] mb-5">This subcategory will be removed from its parent category.</p>
        )}
        <div className="flex gap-3">
          <button className="cat-outline-btn flex-1" onClick={() => { setDeleteDialogOpen(false); setDeletingItem(null); }}>Cancel</button>
          <button
            disabled={deleteLoading}
            onClick={handleDelete}
            className="flex-1 py-2 bg-[#c0392b] text-white text-[10px] tracking-[0.14em] uppercase font-semibold rounded-sm hover:bg-[#a93226] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {deleteLoading
              ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Deleting…</>
              : <><Trash2 size={12} />Delete</>
            }
          </button>
        </div>
      </Modal>

      <div className="cat-divider" />
      <FooterPart />
    </div>
  );
};

export default CategoryManagement;