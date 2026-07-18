'use client'
import React, { useState } from 'react';
import {
  ShieldCheck, Upload, X, CheckCircle2, AlertCircle, Copy,
  Search, Clock, FileText, Image as ImageIcon, Video, Loader2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

/* ─────────────────────────────────────────────
   STATUS CONFIG — mirrors backend WarrantyStatus enum
───────────────────────────────────────────── */
const STATUS_META: Record<string, { label: string; dot: string; text: string; bg: string; border: string }> = {
  CLAIM_RECEIVED:           { label: 'Claim Received',            dot: '#e67e22', text: '#935116', bg: '#fef5e7', border: '#f5cba7' },
  UNDER_REVIEW:             { label: 'Under Review',              dot: '#e67e22', text: '#935116', bg: '#fef5e7', border: '#f5cba7' },
  ADDITIONAL_INFO_REQUIRED: { label: 'Info Required',             dot: '#c0392b', text: '#922b21', bg: '#fdecea', border: '#f5b7b1' },
  APPROVED:                 { label: 'Approved',                  dot: '#27ae60', text: '#1e8449', bg: '#eafaf1', border: '#a9dfbf' },
  REJECTED:                 { label: 'Rejected',                  dot: '#c0392b', text: '#922b21', bg: '#fdecea', border: '#f5b7b1' },
  PICKUP_SCHEDULED:         { label: 'Pickup Scheduled',          dot: '#2980b9', text: '#21618c', bg: '#eaf2fa', border: '#aed6f1' },
  PRODUCT_RECEIVED:         { label: 'Product Received',          dot: '#2980b9', text: '#21618c', bg: '#eaf2fa', border: '#aed6f1' },
  REPAIR_IN_PROGRESS:       { label: 'Repair in Progress',        dot: '#2980b9', text: '#21618c', bg: '#eaf2fa', border: '#aed6f1' },
  REPLACEMENT_APPROVED:     { label: 'Replacement Approved',      dot: '#27ae60', text: '#1e8449', bg: '#eafaf1', border: '#a9dfbf' },
  REPLACEMENT_SHIPPED:      { label: 'Replacement Shipped',       dot: '#27ae60', text: '#1e8449', bg: '#eafaf1', border: '#a9dfbf' },
  RESOLVED:                 { label: 'Resolved',                  dot: '#1a1a1a', text: '#1a1a1a', bg: '#f0ece6', border: '#d4cfc8' },
};

const PURCHASE_PLATFORMS = [
  { value: '', label: 'Select where you bought it' },
  { value: 'AMAZON', label: 'Amazon' },
  { value: 'FLIPKART', label: 'Flipkart' },
  { value: 'OFFICIAL_WEBSITE', label: 'Official Website' },
  { value: 'MYNTRA', label: 'Myntra' },
  { value: 'OFFLINE', label: 'Offline (Store)' },
];

const EMPTY_FORM = {
  fullName: '', mobileNumber: '', email: '',
  productName: '', productModel: '', orderId: '', purchaseDate: '', purchasedFrom: '', reason: '',
};

const WarrantyClaimPage = () => {
  const [tab, setTab] = useState<'submit' | 'track'>('submit');

  /* ── Submit form state ── */
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [invoice, setInvoice] = useState<File | null>(null);
  const [warrantyCard, setWarrantyCard] = useState<File | null>(null);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [productVideo, setProductVideo] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successClaimId, setSuccessClaimId] = useState('');
  const [copied, setCopied] = useState(false);

  /* ── Track form state ── */
  const [trackId, setTrackId] = useState('');
  const [tracking, setTracking] = useState(false);
  const [trackError, setTrackError] = useState('');
  const [trackedClaim, setTrackedClaim] = useState<any>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const updateField = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const resetForm = () => {
    setForm({ ...EMPTY_FORM });
    setInvoice(null); setWarrantyCard(null); setProductImages([]); setProductVideo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const required = ['fullName', 'mobileNumber', 'email', 'productName', 'productModel', 'purchasedFrom', 'reason'] as const;
    const missing = required.filter((k) => !form[k].trim());
    if (missing.length) {
      setSubmitError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (invoice) fd.append('invoice', invoice);
      if (warrantyCard) fd.append('warrantyCard', warrantyCard);
      productImages.forEach((f) => fd.append('productImages', f));
      if (productVideo) fd.append('productVideo', productVideo);

      // Adjust to `/warranty/${userId}` if the customer is logged in
      const res = await fetch(`${API_BASE_URL}/warranty`, { method: 'POST', body: fd });
      const data = await res.json();

      if (data.success) {
        setSuccessClaimId(data.claimId);
        resetForm();
      } else {
        setSubmitError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');
    setTrackedClaim(null);
    if (!trackId.trim()) return;

    setTracking(true);
    try {
      const res = await fetch(`${API_BASE_URL}/warranty/status/${trackId.trim()}`);
      const data = await res.json();
      if (data.success) setTrackedClaim(data.claim);
      else setTrackError(data.message || 'No claim found with this Claim ID');
    } catch {
      setTrackError('Network error. Please try again.');
    } finally {
      setTracking(false);
    }
  };

  const copyClaimId = async () => {
    try { await navigator.clipboard.writeText(successClaimId); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { /* no-op */ }
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .wc-serif { font-family: 'DM Sans', sans-serif; }

        .wc-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }

        .wc-input, .wc-textarea {
          width: 100%; padding: 10px 12px; font-size: 13px;
          border: 1px solid #e8e4de; border-radius: 2px;
          background: #fff; color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.2s;
        }
        .wc-input:focus, .wc-textarea:focus { border-color: #1a1a1a; }
        .wc-input::placeholder, .wc-textarea::placeholder { color: #ccc; }
        .wc-textarea { resize: vertical; min-height: 90px; }

        .wc-label {
          display: block; font-size: 10px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase; color: #888;
          margin-bottom: 6px;
        }

        .wc-primary-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          background: #1a1a1a; color: #fff; border: none;
          padding: 12px 24px; font-size: 11px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: background 0.2s;
          font-family: 'DM Sans', sans-serif; white-space: nowrap;
        }
        .wc-primary-btn:hover:not(:disabled) { background: #333; }
        .wc-primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .wc-tab {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 12px 22px; font-size: 11px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          border: none; border-bottom: 2px solid transparent;
          background: transparent; cursor: pointer; transition: all 0.18s;
          color: #aaa; font-family: 'DM Sans', sans-serif;
        }
        .wc-tab:hover { color: #555; }
        .wc-tab.active { color: #1a1a1a; border-bottom-color: #1a1a1a; }

        .wc-upload-box {
          border: 1px dashed #d4cfc8; border-radius: 2px; padding: 16px;
          display: flex; align-items: center; gap: 10px; cursor: pointer;
          transition: border-color 0.2s; background: #fff;
        }
        .wc-upload-box:hover { border-color: #1a1a1a; }
        .wc-upload-box input { display: none; }

        .wc-file-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: #f0ece6; border: 1px solid #e8e4de; border-radius: 2px;
          padding: 4px 8px; font-size: 11px; color: #555; margin-top: 6px;
        }
        .wc-file-chip button { color: #aaa; display: flex; }
        .wc-file-chip button:hover { color: #c0392b; }

        .wc-status {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 4px 10px;
          border-radius: 2px; border: 1px solid; white-space: nowrap;
        }

        .wc-alert {
          display: flex; align-items: center; gap: 8px; padding: 11px 14px;
          border-radius: 2px; border: 1px solid; font-size: 13px; margin-bottom: 20px;
        }
        .wc-alert.error { background: #fdecea; border-color: #f5b7b1; color: #c0392b; }

        .wc-timeline-dot {
          width: 8px; height: 8px; border-radius: 50%; background: #1a1a1a; flex-shrink: 0; margin-top: 5px;
        }
      `}</style>

      <Navbar />

      <div className="max-w-[820px] mx-auto px-4 sm:px-8 py-10">

        {/* ── Header ── */}
        <div className="mb-8">
          <p className="text-[10px] tracking-[0.22em] uppercase text-[#888] mb-1 flex items-center gap-2">
            <ShieldCheck size={12} /> Customer Support
          </p>
          <h1 className="wc-serif text-4xl font-light text-[#1a1a1a]">Warranty Claim</h1>
          <p className="text-sm text-[#888] mt-1.5">
            Submit a new claim for a product under warranty, or track an existing one using your Claim ID.
          </p>
        </div>

        <div className="wc-divider mb-8" />

        {/* ── Tabs ── */}
        <div className="bg-white border border-[#e8e4de] rounded-sm overflow-hidden">
          <div className="border-b border-[#e8e4de] flex px-4">
            <button className={`wc-tab ${tab === 'submit' ? 'active' : ''}`} onClick={() => setTab('submit')}>
              <ShieldCheck size={12} /> Submit a Claim
            </button>
            <button className={`wc-tab ${tab === 'track' ? 'active' : ''}`} onClick={() => setTab('track')}>
              <Search size={12} /> Track a Claim
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* ══════════════ SUBMIT TAB ══════════════ */}
            {tab === 'submit' && (
              <>
                {successClaimId ? (
                  <div className="flex flex-col items-center text-center py-10 gap-4">
                    <CheckCircle2 size={44} className="text-[#27ae60]" />
                    <h2 className="wc-serif text-2xl font-light text-[#1a1a1a]">Claim submitted successfully</h2>
                    <p className="text-sm text-[#888] max-w-sm">
                      Save your Claim ID below — you'll need it to track the status of your claim.
                    </p>
                    <div className="flex items-center gap-2 bg-[#faf9f7] border border-[#e8e4de] rounded-sm px-5 py-3">
                      <span className="font-mono text-base text-[#1a1a1a] tracking-wide">{successClaimId}</span>
                      <button onClick={copyClaimId} className="text-[#888] hover:text-[#1a1a1a] transition-colors" title="Copy">
                        {copied ? <CheckCircle2 size={15} className="text-[#27ae60]" /> : <Copy size={15} />}
                      </button>
                    </div>
                    <button className="wc-primary-btn mt-2" onClick={() => setSuccessClaimId('')}>
                      Submit Another Claim
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {submitError && (
                      <div className="wc-alert error"><AlertCircle size={15} /> {submitError}</div>
                    )}

                    <div>
                      <p className="text-[10px] tracking-[0.14em] uppercase text-[#aaa] font-semibold mb-3">Your Details</p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="wc-label">Full Name *</label>
                          <input className="wc-input" value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} placeholder="Enter your full name" />
                        </div>
                        <div>
                          <label className="wc-label">Mobile Number *</label>
                          <input className="wc-input" value={form.mobileNumber} onChange={(e) => updateField('mobileNumber', e.target.value)} placeholder="10-digit mobile number" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="wc-label">Email Address *</label>
                          <input type="email" className="wc-input" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="you@example.com" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] tracking-[0.14em] uppercase text-[#aaa] font-semibold mb-3">Product Details</p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="wc-label">Product Name *</label>
                          <input className="wc-input" value={form.productName} onChange={(e) => updateField('productName', e.target.value)} placeholder="e.g. Wooden Wall Clock" />
                        </div>
                        <div>
                          <label className="wc-label">Product Model *</label>
                          <input className="wc-input" value={form.productModel} onChange={(e) => updateField('productModel', e.target.value)} placeholder="Model / SKU" />
                        </div>
                        <div>
                          <label className="wc-label">Order ID (optional)</label>
                          <input className="wc-input" value={form.orderId} onChange={(e) => updateField('orderId', e.target.value)} placeholder="If purchased online" />
                        </div>
                        <div>
                          <label className="wc-label">Purchase Date (optional)</label>
                          <input type="date" className="wc-input" value={form.purchaseDate} onChange={(e) => updateField('purchaseDate', e.target.value)} />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="wc-label">Where Did You Buy It? *</label>
                          <select className="wc-input" value={form.purchasedFrom} onChange={(e) => updateField('purchasedFrom', e.target.value)}>
                            {PURCHASE_PLATFORMS.map((p) => (
                              <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="wc-label">Reason for Warranty Claim *</label>
                      <textarea className="wc-textarea" value={form.reason} onChange={(e) => updateField('reason', e.target.value)} placeholder="Describe the issue in detail…" />
                    </div>

                    <div>
                      <p className="text-[10px] tracking-[0.14em] uppercase text-[#aaa] font-semibold mb-3">Attachments</p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Invoice */}
                        <div>
                          <label className="wc-label">Invoice / Bill</label>
                          <label className="wc-upload-box">
                            <FileText size={16} className="text-[#aaa]" />
                            <span className="text-xs text-[#888]">Click to upload</span>
                            <input type="file" accept=".pdf,image/*" onChange={(e) => setInvoice(e.target.files?.[0] || null)} />
                          </label>
                          {invoice && (
                            <span className="wc-file-chip">
                              {invoice.name}
                              <button type="button" onClick={() => setInvoice(null)}><X size={11} /></button>
                            </span>
                          )}
                        </div>

                        {/* Warranty card */}
                        <div>
                          <label className="wc-label">Warranty Card</label>
                          <label className="wc-upload-box">
                            <FileText size={16} className="text-[#aaa]" />
                            <span className="text-xs text-[#888]">Click to upload</span>
                            <input type="file" accept=".pdf,image/*" onChange={(e) => setWarrantyCard(e.target.files?.[0] || null)} />
                          </label>
                          {warrantyCard && (
                            <span className="wc-file-chip">
                              {warrantyCard.name}
                              <button type="button" onClick={() => setWarrantyCard(null)}><X size={11} /></button>
                            </span>
                          )}
                        </div>

                        {/* Product images */}
                        <div>
                          <label className="wc-label">Product Images (up to 5)</label>
                          <label className="wc-upload-box">
                            <ImageIcon size={16} className="text-[#aaa]" />
                            <span className="text-xs text-[#888]">Click to upload</span>
                            <input type="file" accept="image/*" multiple onChange={(e) => setProductImages(Array.from(e.target.files || []).slice(0, 5))} />
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {productImages.map((f, i) => (
                              <span key={i} className="wc-file-chip">
                                {f.name}
                                <button type="button" onClick={() => setProductImages((imgs) => imgs.filter((_, idx) => idx !== i))}><X size={11} /></button>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Product video */}
                        <div>
                          <label className="wc-label">Product Video (optional)</label>
                          <label className="wc-upload-box">
                            <Video size={16} className="text-[#aaa]" />
                            <span className="text-xs text-[#888]">Click to upload</span>
                            <input type="file" accept="video/*" onChange={(e) => setProductVideo(e.target.files?.[0] || null)} />
                          </label>
                          {productVideo && (
                            <span className="wc-file-chip">
                              {productVideo.name}
                              <button type="button" onClick={() => setProductVideo(null)}><X size={11} /></button>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="wc-primary-btn w-full sm:w-auto" disabled={submitting}>
                      {submitting ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                      {submitting ? 'Submitting…' : 'Submit Claim'}
                    </button>
                  </form>
                )}
              </>
            )}

            {/* ══════════════ TRACK TAB ══════════════ */}
            {tab === 'track' && (
              <div>
                <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 mb-6">
                  <input
                    className="wc-input flex-1"
                    placeholder="Enter your Claim ID (e.g. WC-7F3K9A2X)"
                    value={trackId}
                    onChange={(e) => setTrackId(e.target.value)}
                  />
                  <button type="submit" className="wc-primary-btn" disabled={tracking}>
                    {tracking ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                    {tracking ? 'Searching…' : 'Track Claim'}
                  </button>
                </form>

                {trackError && <div className="wc-alert error"><AlertCircle size={15} /> {trackError}</div>}

                {trackedClaim && (
                  <div className="border border-[#e8e4de] rounded-sm p-6">
                    <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
                      <div>
                        <p className="text-[10px] tracking-[0.14em] uppercase text-[#aaa] font-semibold mb-1">{trackedClaim.claimId}</p>
                        <h3 className="wc-serif text-xl font-light text-[#1a1a1a]">{trackedClaim.productName}</h3>
                        <p className="text-xs text-[#888]">
                          {trackedClaim.productModel}
                          {trackedClaim.purchasedFrom && ` · Bought on ${PURCHASE_PLATFORMS.find((p) => p.value === trackedClaim.purchasedFrom)?.label || trackedClaim.purchasedFrom}`}
                        </p>
                      </div>
                      {(() => {
                        const sm = STATUS_META[trackedClaim.status] || STATUS_META.CLAIM_RECEIVED;
                        return (
                          <span className="wc-status" style={{ color: sm.text, background: sm.bg, borderColor: sm.border }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: sm.dot }} />
                            {sm.label}
                          </span>
                        );
                      })()}
                    </div>

                    <div className="wc-divider mb-5" />

                    <p className="text-[10px] tracking-[0.14em] uppercase text-[#aaa] font-semibold mb-3 flex items-center gap-1.5">
                      <Clock size={11} /> Status Timeline
                    </p>
                    <div className="space-y-4">
                      {trackedClaim.history?.map((h: any, i: number) => {
                        const sm = STATUS_META[h.status] || STATUS_META.CLAIM_RECEIVED;
                        return (
                          <div key={i} className="flex gap-3">
                            <div className="wc-timeline-dot" style={{ background: sm.dot }} />
                            <div>
                              <p className="text-sm text-[#1a1a1a] font-medium">{sm.label}</p>
                              {h.note && <p className="text-xs text-[#888] mt-0.5">{h.note}</p>}
                              <p className="text-[11px] text-[#bbb] mt-0.5">{fmtDate(h.createdAt)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarrantyClaimPage;