'use client'
import React, { useState, useEffect } from 'react';
import { Plus, Tag, Calendar, Percent, IndianRupee, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';

/* ─────────────────────────────────────────────
   STATUS CONFIG
───────────────────────────────────────────── */
const getCouponStatus = (validFrom: string, validUntil: string, isActive: boolean) => {
  if (!isActive) return { label: 'Inactive', dot: '#aaa',     text: '#666',    bg: '#f5f3ef', border: '#e8e4de' };
  const now = new Date(), start = new Date(validFrom), end = new Date(validUntil);
  if (now < start) return { label: 'Upcoming', dot: '#2980b9', text: '#1a5276', bg: '#eaf3fb', border: '#aed6f1' };
  if (now > end)   return { label: 'Expired',  dot: '#c0392b', text: '#922b21', bg: '#fdecea', border: '#f5b7b1' };
  return             { label: 'Active',   dot: '#27ae60', text: '#1e8449', bg: '#eafaf1', border: '#a9dfbf' };
};

/* ─────────────────────────────────────────────
   MODAL
───────────────────────────────────────────── */
const Modal = ({ open, onClose, children }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-white border border-[#e8e4de] rounded-sm w-full max-w-md"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {children}
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
export default function CouponManagement() {
  const [coupons, setCoupons]       = useState<any[]>([]);
  const [loading, setLoading]       = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData]     = useState({
    code: '', discountPercentage: '', minOrderAmount: '', validFrom: '', validUntil: '',
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { userId }   = useParams();

  useEffect(() => { fetchCoupons(); }, []);

  const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE_URL}/coupen/all/coupens`);
      const data = await res.json();
      if (data.success) setCoupons(data.coupens);
    } catch { showAlert('Failed to fetch coupons', 'error'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res  = await fetch(`${API_BASE_URL}/coupen/add/coupen/code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          code: formData.code,
          discountPercentage: parseInt(formData.discountPercentage),
          minOrderAmount: parseInt(formData.minOrderAmount),
          validFrom: formData.validFrom,
          validUntil: formData.validUntil,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showAlert('Coupon created successfully!');
        setFormData({ code: '', discountPercentage: '', minOrderAmount: '', validFrom: '', validUntil: '' });
        setDialogOpen(false);
        fetchCoupons();
      } else {
        showAlert(data.message || 'Failed to create coupon', 'error');
      }
    } catch { showAlert('Failed to create coupon', 'error'); }
    finally { setSubmitLoading(false); }
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

  /* Stat counts */
  const active   = coupons.filter(c => getCouponStatus(c.validFrom, c.validUntil, c.isActive).label === 'Active').length;
  const upcoming = coupons.filter(c => getCouponStatus(c.validFrom, c.validUntil, c.isActive).label === 'Upcoming').length;
  const expired  = coupons.filter(c => getCouponStatus(c.validFrom, c.validUntil, c.isActive).label === 'Expired').length;

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .cpn-serif { font-family: 'DM Sans', sans-serif; }

        .cpn-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }

        /* Inputs */
        .cpn-input {
          width: 100%; padding: 9px 12px; font-size: 13px;
          border: 1px solid #e8e4de; border-radius: 2px;
          background: #fff; color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.2s;
        }
        .cpn-input:focus { border-color: #1a1a1a; }
        .cpn-input::placeholder { color: #ccc; }

        /* Buttons */
        .cpn-primary-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: #1a1a1a; color: #fff; border: none;
          padding: 9px 20px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: background 0.2s;
          font-family: 'DM Sans', sans-serif; white-space: nowrap;
        }
        .cpn-primary-btn:hover:not(:disabled) { background: #333; }
        .cpn-primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .cpn-outline-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent; color: #888; border: 1px solid #e8e4de;
          padding: 8px 16px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .cpn-outline-btn:hover { border-color: #1a1a1a; color: #1a1a1a; }

        .cpn-icon-btn {
          width: 28px; height: 28px; border-radius: 2px;
          border: 1px solid #e8e4de; background: #faf9f7;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #888; transition: all 0.15s;
        }
        .cpn-icon-btn:hover { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }

        /* Table */
        .cpn-th {
          font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
          font-weight: 600; color: #aaa; padding: 10px 16px; text-align: left;
          background: #faf9f7; border-bottom: 1px solid #e8e4de;
        }
        .cpn-td { padding: 14px 16px; border-bottom: 1px solid #f0ece6; vertical-align: middle; }
        .cpn-tr { transition: background 0.12s; }
        .cpn-tr:hover { background: #faf9f7; }
        .cpn-tr:last-child .cpn-td { border-bottom: none; }

        /* Status badge */
        .cpn-status {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 3px 9px;
          border-radius: 2px; border: 1px solid; white-space: nowrap;
        }

        /* Coupon code chip */
        .cpn-code {
          font-family: 'Courier New', monospace;
          font-size: 13px; font-weight: 700; letter-spacing: 0.08em;
          color: #1a1a1a; background: #f5f3ef;
          border: 1px solid #e8e4de; border-radius: 2px;
          padding: 3px 10px; display: inline-block;
        }

        /* Stat card */
        .cpn-stat {
          background: #fff; border: 1px solid #e8e4de; border-radius: 2px;
          padding: 16px 20px; flex: 1; min-width: 0; transition: box-shadow 0.2s;
        }
        .cpn-stat:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

        /* Alert */
        .cpn-alert {
          display: flex; align-items: center; gap: 8px; padding: 11px 14px;
          border-radius: 2px; border: 1px solid; font-size: 13px; margin-bottom: 20px;
        }
        .cpn-alert.success { background: #eafaf1; border-color: #a9dfbf; color: #1e8449; }
        .cpn-alert.error   { background: #fdecea; border-color: #f5b7b1; color: #c0392b; }

        /* Skeleton */
        .cpn-skel {
          background: linear-gradient(90deg, #f5f3ef 0%, #ece9e3 50%, #f5f3ef 100%);
          background-size: 200% 100%;
          animation: cpnSkel 1.4s ease-in-out infinite;
          border-radius: 2px;
        }
        @keyframes cpnSkel {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cpn-fade { animation: fade-up 0.3s ease both; }
      `}</style>

      <Navbar />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-[#888] mb-1">Admin · Promotions</p>
            <h1 className="cpn-serif text-4xl font-light text-[#1a1a1a]">Coupon Management</h1>
            <p className="text-sm text-[#888] mt-1.5">Create and manage promotional coupon codes.</p>
          </div>
          <button className="cpn-primary-btn self-start sm:self-auto" onClick={() => setDialogOpen(true)}>
            <Plus size={14} /> Add Coupon
          </button>
        </div>

        <div className="cpn-divider mb-8" />

        {/* ── Alert ── */}
        {alert.show && (
          <div className={`cpn-alert ${alert.type} cpn-fade`}>
            {alert.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
            {alert.message}
          </div>
        )}

        {/* ── Stat cards ── */}
        <div className="flex gap-4 flex-wrap mb-8">
          {[
            { label: 'Total',    value: coupons.length, color: '#1a1a1a' },
            { label: 'Active',   value: active,         color: '#27ae60' },
            { label: 'Upcoming', value: upcoming,       color: '#2980b9' },
            { label: 'Expired',  value: expired,        color: '#c0392b' },
          ].map(s => (
            <div key={s.label} className="cpn-stat">
              <p className="text-[9px] tracking-[0.18em] uppercase text-[#aaa] font-semibold mb-1">{s.label}</p>
              <p className="cpn-serif text-3xl font-light" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Table ── */}
        <div className="bg-white border border-[#e8e4de] rounded-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e4de]">
            <div>
              <h2 className="cpn-serif text-xl font-light text-[#1a1a1a]">All Coupons</h2>
              <p className="text-[10px] tracking-[0.1em] uppercase text-[#aaa] mt-0.5">
                {loading ? 'Loading…' : `${coupons.length} coupon${coupons.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="cpn-skel h-12" style={{ animationDelay: `${i * 70}ms` }} />
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Tag size={36} className="text-[#d4cfc8]" />
              <p className="cpn-serif text-2xl font-light text-[#888]">No coupons yet</p>
              <p className="text-xs tracking-[0.08em] text-[#bbb]">Create your first coupon to get started</p>
              <button className="cpn-primary-btn mt-2" onClick={() => setDialogOpen(true)}>
                <Plus size={13} /> Add Coupon
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {['Code', 'Discount', 'Min Order', 'Valid From', 'Valid Until', 'Status'].map(h => (
                      <th key={h} className="cpn-th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c: any, i) => {
                    const s = getCouponStatus(c.validFrom, c.validUntil, c.isActive);
                    return (
                      <tr key={c.id} className="cpn-tr cpn-fade" style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}>
                        <td className="cpn-td">
                          <span className="cpn-code">{c.code}</span>
                        </td>
                        <td className="cpn-td">
                          <div className="flex items-center gap-1.5">
                            <Percent size={13} className="text-[#888]" />
                            <span className="text-sm font-semibold text-[#1a1a1a]">{c.discountPercentage}%</span>
                          </div>
                        </td>
                        <td className="cpn-td">
                          <div className="flex items-center gap-1">
                            <IndianRupee size={12} className="text-[#888]" />
                            <span className="text-sm text-[#444]">{c.minOrderAmount.toLocaleString('en-IN')}</span>
                          </div>
                        </td>
                        <td className="cpn-td">
                          <div className="flex items-center gap-1.5 text-xs text-[#888]">
                            <Calendar size={11} />{fmtDate(c.validFrom)}
                          </div>
                        </td>
                        <td className="cpn-td">
                          <div className="flex items-center gap-1.5 text-xs text-[#888]">
                            <Calendar size={11} />{fmtDate(c.validUntil)}
                          </div>
                        </td>
                        <td className="cpn-td">
                          <span className="cpn-status" style={{ color: s.text, background: s.bg, borderColor: s.border }}>
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ════════ ADD COUPON MODAL ════════ */}
      <Modal open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#e8e4de]">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-0.5">Promotions</p>
            <h2 className="cpn-serif text-2xl font-light text-[#1a1a1a]">Add New Coupon</h2>
          </div>
          <button className="cpn-icon-btn mt-0.5" onClick={() => setDialogOpen(false)}><X size={14} /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <Field label="Coupon Code" required>
            <input
              name="code"
              value={formData.code}
              onChange={e => setFormData(p => ({ ...p, code: e.target.value.toUpperCase() }))}
              placeholder="e.g. SUMMER2025"
              className="cpn-input"
              style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Courier New', monospace" }}
              required
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Discount (%)" required>
              <div className="relative">
                <Percent size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" />
                <input
                  name="discountPercentage"
                  type="number"
                  min="1" max="100"
                  value={formData.discountPercentage}
                  onChange={e => setFormData(p => ({ ...p, discountPercentage: e.target.value }))}
                  placeholder="10"
                  className="cpn-input pl-8"
                  required
                />
              </div>
            </Field>
            <Field label="Min Order (₹)" required>
              <div className="relative">
                <IndianRupee size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" />
                <input
                  name="minOrderAmount"
                  type="number"
                  min="0"
                  value={formData.minOrderAmount}
                  onChange={e => setFormData(p => ({ ...p, minOrderAmount: e.target.value }))}
                  placeholder="500"
                  className="cpn-input pl-8"
                  required
                />
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Valid From" required>
              <input
                name="validFrom"
                type="datetime-local"
                value={formData.validFrom}
                onChange={e => setFormData(p => ({ ...p, validFrom: e.target.value }))}
                className="cpn-input"
                required
              />
            </Field>
            <Field label="Valid Until" required>
              <input
                name="validUntil"
                type="datetime-local"
                value={formData.validUntil}
                onChange={e => setFormData(p => ({ ...p, validUntil: e.target.value }))}
                className="cpn-input"
                required
              />
            </Field>
          </div>

          <div className="cpn-divider" />

          <div className="flex justify-end gap-3 pt-1">
            <button type="button" className="cpn-outline-btn" onClick={() => setDialogOpen(false)}>Cancel</button>
            <button type="submit" disabled={submitLoading} className="cpn-primary-btn">
              {submitLoading
                ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating…</>
                : <><Tag size={13} />Create Coupon</>
              }
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}