'use client'
import React, { useState, useEffect } from 'react';
import {
  Search, Check, X, Clock, AlertCircle, Copy, CheckCircle2,
  RefreshCw, FileText, Image as ImageIcon, Video, Download, StickyNote,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

/* ─────────────────────────────────────────────
   STATUS CONFIG
───────────────────────────────────────────── */
const STATUS_META: Record<string, { label: string; dot: string; text: string; bg: string; border: string }> = {
  CLAIM_RECEIVED:           { label: 'Claim Received',       dot: '#e67e22', text: '#935116', bg: '#fef5e7', border: '#f5cba7' },
  UNDER_REVIEW:             { label: 'Under Review',         dot: '#e67e22', text: '#935116', bg: '#fef5e7', border: '#f5cba7' },
  ADDITIONAL_INFO_REQUIRED: { label: 'Info Required',        dot: '#c0392b', text: '#922b21', bg: '#fdecea', border: '#f5b7b1' },
  APPROVED:                 { label: 'Approved',             dot: '#27ae60', text: '#1e8449', bg: '#eafaf1', border: '#a9dfbf' },
  REJECTED:                 { label: 'Rejected',              dot: '#c0392b', text: '#922b21', bg: '#fdecea', border: '#f5b7b1' },
  PICKUP_SCHEDULED:         { label: 'Pickup Scheduled',     dot: '#2980b9', text: '#21618c', bg: '#eaf2fa', border: '#aed6f1' },
  PRODUCT_RECEIVED:         { label: 'Product Received',     dot: '#2980b9', text: '#21618c', bg: '#eaf2fa', border: '#aed6f1' },
  REPAIR_IN_PROGRESS:       { label: 'Repair in Progress',   dot: '#2980b9', text: '#21618c', bg: '#eaf2fa', border: '#aed6f1' },
  REPLACEMENT_APPROVED:     { label: 'Replacement Approved', dot: '#27ae60', text: '#1e8449', bg: '#eafaf1', border: '#a9dfbf' },
  REPLACEMENT_SHIPPED:      { label: 'Replacement Shipped',  dot: '#27ae60', text: '#1e8449', bg: '#eafaf1', border: '#a9dfbf' },
  RESOLVED:                 { label: 'Resolved',              dot: '#1a1a1a', text: '#1a1a1a', bg: '#f0ece6', border: '#d4cfc8' },
};

const ALL_STATUSES = Object.keys(STATUS_META);
const OPEN_STATUSES = ['CLAIM_RECEIVED', 'UNDER_REVIEW', 'ADDITIONAL_INFO_REQUIRED', 'APPROVED', 'PICKUP_SCHEDULED', 'PRODUCT_RECEIVED', 'REPAIR_IN_PROGRESS', 'REPLACEMENT_APPROVED', 'REPLACEMENT_SHIPPED'];
const CLOSED_STATUSES = ['RESOLVED', 'REJECTED'];

// TODO: wire this up to your real admin auth/session
const ADMIN_USER_ID = localStorage.getItem('arttagUserId'); 

const AdminWarrantyPage = () => {
  const [claims, setClaims]           = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState<'open' | 'closed'>('open');
  const [searchTerm, setSearchTerm]   = useState('');
  const [copiedId, setCopiedId]       = useState<string | null>(null);
  const [alert, setAlert]             = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [detailLoading, setDetailLoading]   = useState(false);
  const [statusDraft, setStatusDraft]       = useState('');
  const [noteDraft, setNoteDraft]           = useState('');
  const [statusNote, setStatusNote]         = useState('');
  const [saving, setSaving]                 = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/warranty/admin/${ADMIN_USER_ID}?limit=100`);
      const data = await res.json();
      if (data.success) setClaims(data.claims);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchClaims(); }, []);

  const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleCopy = async (text: string, id: string) => {
    try { await navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); }
    catch (e) { console.error(e); }
  };

  const openDetail = async (claimId: string) => {
    setDetailLoading(true);
    setSelectedClaim({ claimId });
    try {
      const res = await fetch(`${API_BASE_URL}/warranty/admin/${ADMIN_USER_ID}/${claimId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedClaim(data.claim);
        setStatusDraft(data.claim.status);
        setNoteDraft(data.claim.internalNotes || '');
        setStatusNote('');
      } else {
        showAlert(data.message || 'Failed to load claim', 'error');
        setSelectedClaim(null);
      }
    } catch {
      showAlert('Error loading claim', 'error');
      setSelectedClaim(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => setSelectedClaim(null);

  const saveStatus = async () => {
    if (!selectedClaim) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/warranty/admin/${ADMIN_USER_ID}/${selectedClaim.claimId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusDraft, note: statusNote || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        showAlert('Status updated and customer notified');
        setSelectedClaim(data.claim);
        setStatusNote('');
        fetchClaims();
      } else {
        showAlert(data.message || 'Failed to update status', 'error');
      }
    } catch {
      showAlert('Error updating status', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveNote = async () => {
    if (!selectedClaim) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/warranty/admin/${ADMIN_USER_ID}/${selectedClaim.claimId}/note`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internalNotes: noteDraft }),
      });
      const data = await res.json();
      if (data.success) showAlert('Internal note saved');
      else showAlert(data.message || 'Failed to save note', 'error');
    } catch {
      showAlert('Error saving note', 'error');
    } finally {
      setSaving(false);
    }
  };

  const filtered = claims.filter((c: any) => {
    const q = searchTerm.toLowerCase();
    const match =
      c.claimId.toLowerCase().includes(q) ||
      c.fullName.toLowerCase().includes(q) ||
      c.mobileNumber.includes(q) ||
      c.productName.toLowerCase().includes(q);
    const inTab = activeTab === 'open' ? OPEN_STATUSES.includes(c.status) : CLOSED_STATUSES.includes(c.status);
    return match && inTab;
  });

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const attachmentIcon = (type: string) => {
    if (type === 'PRODUCT_VIDEO') return <Video size={13} />;
    if (type === 'PRODUCT_IMAGE') return <ImageIcon size={13} />;
    return <FileText size={13} />;
  };
  const attachmentLabel: Record<string, string> = {
    INVOICE: 'Invoice / Bill', WARRANTY_CARD: 'Warranty Card',
    PRODUCT_IMAGE: 'Product Image', PRODUCT_VIDEO: 'Product Video',
  };
  const platformLabel: Record<string, string> = {
    AMAZON: 'Amazon', FLIPKART: 'Flipkart', OFFICIAL_WEBSITE: 'Official Website',
    MYNTRA: 'Myntra', OFFLINE: 'Offline (Store)',
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .wa-serif { font-family: 'DM Sans', sans-serif; }
        .wa-divider { height: 1px; background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent); }

        .wa-input, .wa-select, .wa-textarea {
          width: 100%; padding: 9px 12px; font-size: 13px;
          border: 1px solid #e8e4de; border-radius: 2px;
          background: #fff; color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.2s;
        }
        .wa-input:focus, .wa-select:focus, .wa-textarea:focus { border-color: #1a1a1a; }
        .wa-textarea { resize: vertical; min-height: 70px; }

        .wa-primary-btn {
          display: inline-flex; align-items: center; gap: 5px;
          background: #1a1a1a; color: #fff; border: none;
          padding: 8px 18px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: background 0.2s;
          font-family: 'DM Sans', sans-serif; white-space: nowrap;
        }
        .wa-primary-btn:hover:not(:disabled) { background: #333; }
        .wa-primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .wa-outline-btn {
          display: inline-flex; align-items: center; gap: 5px;
          background: transparent; color: #888; border: 1px solid #e8e4de;
          padding: 6px 14px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .wa-outline-btn:hover:not(:disabled) { border-color: #1a1a1a; color: #1a1a1a; }

        .wa-copy-btn {
          width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;
          border: 1px solid #e8e4de; border-radius: 2px; background: #faf9f7;
          cursor: pointer; color: #aaa; transition: all 0.15s; flex-shrink: 0;
        }
        .wa-copy-btn:hover { border-color: #1a1a1a; color: #1a1a1a; background: #fff; }

        .wa-tab {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 20px; font-size: 11px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          border: none; border-bottom: 2px solid transparent;
          background: transparent; cursor: pointer; transition: all 0.18s;
          color: #aaa; font-family: 'DM Sans', sans-serif;
        }
        .wa-tab:hover { color: #555; }
        .wa-tab.active { color: #1a1a1a; border-bottom-color: #1a1a1a; }

        .wa-th {
          font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
          font-weight: 600; color: #aaa; padding: 10px 16px; text-align: left;
          background: #faf9f7; border-bottom: 1px solid #e8e4de;
        }
        .wa-td { padding: 12px 16px; border-bottom: 1px solid #f0ece6; vertical-align: middle; }
        .wa-tr { transition: background 0.12s; cursor: pointer; }
        .wa-tr:hover { background: #faf9f7; }
        .wa-tr:last-child .wa-td { border-bottom: none; }

        .wa-status {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 3px 9px;
          border-radius: 2px; border: 1px solid; white-space: nowrap;
        }

        .wa-mono { font-size: 11px; font-family: 'Courier New', monospace; color: #444; letter-spacing: 0.02em; }

        .wa-stat { background: #fff; border: 1px solid #e8e4de; border-radius: 2px; padding: 16px 20px; flex: 1; min-width: 0; transition: box-shadow 0.2s; }
        .wa-stat:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

        .wa-alert { display: flex; align-items: center; gap: 8px; padding: 11px 14px; border-radius: 2px; border: 1px solid; font-size: 13px; margin-bottom: 20px; }
        .wa-alert.success { background: #eafaf1; border-color: #a9dfbf; color: #1e8449; }
        .wa-alert.error   { background: #fdecea; border-color: #f5b7b1; color: #c0392b; }

        .wa-skel { background: linear-gradient(90deg, #f5f3ef 0%, #ece9e3 50%, #f5f3ef 100%); background-size: 200% 100%; animation: waSkel 1.4s ease-in-out infinite; border-radius: 2px; }
        @keyframes waSkel { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .wa-mobile-card { background: #fff; border-bottom: 1px solid #f0ece6; padding: 16px; transition: background 0.12s; cursor: pointer; }
        .wa-mobile-card:hover { background: #faf9f7; }
        .wa-mobile-card:last-child { border-bottom: none; }

        .wa-overlay { position: fixed; inset: 0; background: rgba(26,26,26,0.4); display: flex; align-items: flex-start; justify-content: center; padding: 40px 16px; overflow-y: auto; z-index: 50; }
        .wa-drawer { background: #fff; width: 100%; max-width: 640px; border-radius: 2px; border: 1px solid #e8e4de; }

        .wa-attachment-link {
          display: flex; align-items: center; gap: 8px; padding: 8px 12px;
          border: 1px solid #e8e4de; border-radius: 2px; font-size: 12px; color: #555;
          text-decoration: none; transition: all 0.15s;
        }
        .wa-attachment-link:hover { border-color: #1a1a1a; color: #1a1a1a; background: #faf9f7; }
      `}</style>

      <Navbar />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-[#888] mb-1">Admin · Support</p>
            <h1 className="wa-serif text-4xl font-light text-[#1a1a1a]">Warranty Claims</h1>
            <p className="text-sm text-[#888] mt-1.5">Review, process, and track customer warranty claims.</p>
          </div>
          <button className="wa-outline-btn self-start sm:self-auto" onClick={fetchClaims}>
            <RefreshCw size={12} /> Refresh
          </button>
        </div>

        <div className="wa-divider mb-8" />

        {alert.show && (
          <div className={`wa-alert ${alert.type}`}>
            {alert.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
            {alert.message}
          </div>
        )}

        {/* ── Stat cards ── */}
        <div className="flex gap-4 flex-wrap mb-8">
          {[
            { label: 'Open',      value: claims.filter((c) => OPEN_STATUSES.includes(c.status)).length,   color: '#e67e22' },
            { label: 'Resolved',  value: claims.filter((c) => c.status === 'RESOLVED').length,             color: '#1a1a1a' },
            { label: 'Rejected',  value: claims.filter((c) => c.status === 'REJECTED').length,              color: '#c0392b' },
            { label: 'Total',     value: claims.length,                                                     color: '#1a1a1a' },
          ].map((s) => (
            <div key={s.label} className="wa-stat">
              <p className="text-[9px] tracking-[0.18em] uppercase text-[#aaa] font-semibold mb-1">{s.label}</p>
              <p className="wa-serif text-3xl font-light" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Main panel ── */}
        <div className="bg-white border border-[#e8e4de] rounded-sm overflow-hidden">
          <div className="border-b border-[#e8e4de]">
            <div className="flex items-center justify-between px-4 flex-wrap gap-2">
              <div className="flex">
                <button className={`wa-tab ${activeTab === 'open' ? 'active' : ''}`} onClick={() => setActiveTab('open')}>
                  <Clock size={12} /> Open
                </button>
                <button className={`wa-tab ${activeTab === 'closed' ? 'active' : ''}`} onClick={() => setActiveTab('closed')}>
                  <Check size={12} /> Closed
                </button>
              </div>
              <div className="relative py-2 min-w-[220px] max-w-sm flex-1">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, claim ID, phone…"
                  className="wa-input pl-9 py-2"
                />
              </div>
            </div>
          </div>

          <div className="px-5 py-3 border-b border-[#f0ece6]">
            <p className="text-[10px] tracking-[0.1em] uppercase text-[#aaa]">
              {loading ? 'Loading…' : `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="wa-skel h-12" style={{ animationDelay: `${i * 70}ms` }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <AlertCircle size={36} className="text-[#d4cfc8]" />
              <p className="wa-serif text-2xl font-light text-[#888]">No claims found</p>
              <p className="text-xs tracking-[0.08em] text-[#bbb]">
                {searchTerm ? 'Try different search terms' : `No ${activeTab} claims at the moment`}
              </p>
            </div>
          ) : (
            <>
              {/* ── Desktop table ── */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {['Claim ID', 'Customer', 'Product', 'Model', 'Bought From', 'Submitted', 'Status'].map((h) => (
                        <th key={h} className="wa-th">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c: any) => {
                      const sm = STATUS_META[c.status] || STATUS_META.CLAIM_RECEIVED;
                      return (
                        <tr key={c.claimId} className="wa-tr" onClick={() => openDetail(c.claimId)}>
                          <td className="wa-td">
                            <div className="flex items-center gap-1.5">
                              <span className="wa-mono">{c.claimId}</span>
                              <button
                                className="wa-copy-btn"
                                onClick={(e) => { e.stopPropagation(); handleCopy(c.claimId, c.claimId); }}
                                title="Copy"
                              >
                                {copiedId === c.claimId ? <CheckCircle2 size={12} className="text-[#27ae60]" /> : <Copy size={12} />}
                              </button>
                            </div>
                          </td>
                          <td className="wa-td">
                            <p className="text-sm text-[#1a1a1a]">{c.fullName}</p>
                            <p className="text-[11px] text-[#aaa]">{c.mobileNumber}</p>
                          </td>
                          <td className="wa-td">
                            <p className="text-sm text-[#1a1a1a]">{c.productName}</p>
                          </td>
                          <td className="wa-td">
                            <p className="text-xs text-[#555]">{c.productModel}</p>
                          </td>
                          <td className="wa-td">
                            <p className="text-xs text-[#555]">{platformLabel[c.purchasedFrom] || c.purchasedFrom || '—'}</p>
                          </td>
                          <td className="wa-td">
                            <p className="text-[11px] text-[#888] whitespace-nowrap">{fmtDate(c.createdAt)}</p>
                          </td>
                          <td className="wa-td">
                            <span className="wa-status" style={{ color: sm.text, background: sm.bg, borderColor: sm.border }}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: sm.dot }} />
                              {sm.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ── Mobile cards ── */}
              <div className="lg:hidden">
                {filtered.map((c: any) => {
                  const sm = STATUS_META[c.status] || STATUS_META.CLAIM_RECEIVED;
                  return (
                    <div key={c.claimId} className="wa-mobile-card" onClick={() => openDetail(c.claimId)}>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="wa-mono">{c.claimId}</span>
                        <span className="wa-status" style={{ color: sm.text, background: sm.bg, borderColor: sm.border }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: sm.dot }} />
                          {sm.label}
                        </span>
                      </div>
                      <p className="text-sm text-[#1a1a1a] font-medium">{c.fullName}</p>
                      <p className="text-[11px] text-[#aaa] mb-1">{c.mobileNumber}</p>
                      <p className="text-xs text-[#555]">{c.productName}</p>
                      <p className="text-[11px] text-[#888]">Model: {c.productModel}</p>
                      <p className="text-[11px] text-[#888]">Bought from: {platformLabel[c.purchasedFrom] || c.purchasedFrom || '—'}</p>
                      <p className="text-[11px] text-[#bbb] mt-1">{fmtDate(c.createdAt)}</p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ══════════════ DETAIL DRAWER ══════════════ */}
      {selectedClaim && (
        <div className="wa-overlay" onClick={closeDetail}>
          <div className="wa-drawer" onClick={(e) => e.stopPropagation()}>
            {detailLoading ? (
              <div className="p-8 space-y-3">
                {Array(4).fill(0).map((_, i) => <div key={i} className="wa-skel h-10" />)}
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between p-6 border-b border-[#e8e4de]">
                  <div>
                    <p className="text-[10px] tracking-[0.14em] uppercase text-[#aaa] font-semibold mb-1">{selectedClaim.claimId}</p>
                    <h2 className="wa-serif text-2xl font-light text-[#1a1a1a]">{selectedClaim.fullName}</h2>
                    <p className="text-xs text-[#888]">{selectedClaim.mobileNumber} · {selectedClaim.email}</p>
                  </div>
                  <button onClick={closeDetail} className="wa-copy-btn"><X size={14} /></button>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                  <div>
                    <p className="text-[10px] tracking-[0.14em] uppercase text-[#aaa] font-semibold mb-2">Product</p>
                    <p className="text-sm text-[#1a1a1a]">{selectedClaim.productName} · {selectedClaim.productModel}</p>
                    {selectedClaim.purchasedFrom && (
                      <p className="text-xs text-[#888] mt-1">Bought on: {platformLabel[selectedClaim.purchasedFrom] || selectedClaim.purchasedFrom}</p>
                    )}
                    {selectedClaim.orderId && <p className="text-xs text-[#888] mt-1">Order ID: {selectedClaim.orderId}</p>}
                    {selectedClaim.purchaseDate && <p className="text-xs text-[#888]">Purchased: {fmtDate(selectedClaim.purchaseDate)}</p>}
                  </div>

                  <div>
                    <p className="text-[10px] tracking-[0.14em] uppercase text-[#aaa] font-semibold mb-2">Reason</p>
                    <p className="text-sm text-[#555] leading-relaxed">{selectedClaim.reason}</p>
                  </div>

                  {selectedClaim.attachments?.length > 0 && (
                    <div>
                      <p className="text-[10px] tracking-[0.14em] uppercase text-[#aaa] font-semibold mb-2">Attachments</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {selectedClaim.attachments.map((a: any) => (
                          <a key={a.id} href={a.url} target="_blank" rel="noreferrer" className="wa-attachment-link">
                            {attachmentIcon(a.type)}
                            <span className="flex-1 truncate">{attachmentLabel[a.type] || a.type}</span>
                            <Download size={12} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="wa-divider" />

                  <div>
                    <p className="text-[10px] tracking-[0.14em] uppercase text-[#aaa] font-semibold mb-2">Update Status</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <select className="wa-select flex-1" value={statusDraft} onChange={(e) => setStatusDraft(e.target.value)}>
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>{STATUS_META[s].label}</option>
                        ))}
                      </select>
                      <button className="wa-primary-btn" onClick={saveStatus} disabled={saving || statusDraft === selectedClaim.status}>
                        {saving ? 'Saving…' : 'Update'}
                      </button>
                    </div>
                    <input
                      className="wa-input mt-2"
                      placeholder="Optional note shown to the customer with this status update"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] tracking-[0.14em] uppercase text-[#aaa] font-semibold mb-2 flex items-center gap-1.5">
                      <StickyNote size={11} /> Internal Notes (not visible to customer)
                    </p>
                    <textarea className="wa-textarea" value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} placeholder="Add internal notes for your team…" />
                    <button className="wa-outline-btn mt-2" onClick={saveNote} disabled={saving}>
                      {saving ? 'Saving…' : 'Save Note'}
                    </button>
                  </div>

                  {selectedClaim.history?.length > 0 && (
                    <div>
                      <p className="text-[10px] tracking-[0.14em] uppercase text-[#aaa] font-semibold mb-2">History</p>
                      <div className="space-y-3">
                        {selectedClaim.history.map((h: any, i: number) => {
                          const sm = STATUS_META[h.status] || STATUS_META.CLAIM_RECEIVED;
                          return (
                            <div key={i} className="flex gap-2 items-start">
                              <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: sm.dot }} />
                              <div>
                                <p className="text-xs text-[#1a1a1a] font-medium">{sm.label}</p>
                                {h.note && <p className="text-[11px] text-[#888]">{h.note}</p>}
                                <p className="text-[10px] text-[#bbb]">{fmtDate(h.createdAt)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWarrantyPage;