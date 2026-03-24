'use client'
import React, { useState, useEffect } from 'react';
import {
  Search, Check, X, Clock, AlertCircle, Copy, CheckCircle2,
  ChevronLeft, ChevronRight, IndianRupee, RefreshCw,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

/* ─────────────────────────────────────────────
   STATUS CONFIG
───────────────────────────────────────────── */
const STATUS_META: Record<string, { label: string; dot: string; text: string; bg: string; border: string }> = {
  INITIATED: { label: 'Pending',  dot: '#e67e22', text: '#935116', bg: '#fef5e7', border: '#f5cba7' },
  REFUNDED:  { label: 'Refunded', dot: '#27ae60', text: '#1e8449', bg: '#eafaf1', border: '#a9dfbf' },
  FAILED:    { label: 'Rejected', dot: '#c0392b', text: '#922b21', bg: '#fdecea', border: '#f5b7b1' },
};

const AdminRefundPage = () => {
  const [refunds, setRefunds]         = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState<'pending' | 'completed'>('pending');
  const [searchTerm, setSearchTerm]   = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [copiedId, setCopiedId]       = useState<string | null>(null);
  const [alert, setAlert]             = useState({ show: false, message: '', type: 'success' });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchRefunds = async (status?: string) => {
    setLoading(true);
    try {
      const q = status ? `?status=${status}` : '';
      const res  = await fetch(`${API_BASE_URL}/payment/get/all/refund/request${q}`);
      const data = await res.json();
      if (data.success) setRefunds(data.refunds);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    activeTab === 'pending' ? fetchRefunds('INITIATED') : fetchRefunds();
  }, [activeTab]);

  const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleCopy = async (text: string, id: string) => {
    try { await navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); }
    catch (e) { console.error(e); }
  };

  const handleProcess = async (refundId: string, action: 'APPROVE' | 'REJECT') => {
    setProcessingId(refundId);
    try {
      const res  = await fetch(`${API_BASE_URL}/payment/process/refund/${refundId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        showAlert(data.message || (action === 'APPROVE' ? 'Refund processed successfully!' : 'Refund rejected.'));
        activeTab === 'pending' ? fetchRefunds('INITIATED') : fetchRefunds();
      } else {
        showAlert(data.message || 'Failed to process refund', 'error');
      }
    } catch { showAlert('Error processing refund', 'error'); }
    finally { setProcessingId(null); }
  };

  const filtered = refunds.filter((r: any) => {
    const q = searchTerm.toLowerCase();
    const match = r.id.toLowerCase().includes(q) || r.orderId.toLowerCase().includes(q) ||
                  r.paymentId.toLowerCase().includes(q) || r.reason.toLowerCase().includes(q);
    return match && (activeTab === 'pending' ? r.status === 'INITIATED' : ['REFUNDED', 'FAILED'].includes(r.status));
  });

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  const fmtCurrency = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);

  /* ── Truncate ID for display ── */
  const shortId = (id: string) => id?.slice(0, 12) + '…';

  /* ── Copy button ── */
  const CopyBtn = ({ text, cid }: { text: string; cid: string }) => (
    <button onClick={() => handleCopy(text, cid)} title="Copy" className="ref-copy-btn">
      {copiedId === cid ? <CheckCircle2 size={12} className="text-[#27ae60]" /> : <Copy size={12} />}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .ref-serif { font-family: 'DM Sans', sans-serif; }

        .ref-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }

        /* Inputs */
        .ref-input {
          width: 100%; padding: 9px 12px; font-size: 13px;
          border: 1px solid #e8e4de; border-radius: 2px;
          background: #fff; color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.2s;
        }
        .ref-input:focus { border-color: #1a1a1a; }
        .ref-input::placeholder { color: #ccc; }

        /* Buttons */
        .ref-primary-btn {
          display: inline-flex; align-items: center; gap: 5px;
          background: #1a1a1a; color: #fff; border: none;
          padding: 7px 16px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: background 0.2s;
          font-family: 'DM Sans', sans-serif; white-space: nowrap;
        }
        .ref-primary-btn:hover:not(:disabled) { background: #333; }
        .ref-primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .ref-outline-btn {
          display: inline-flex; align-items: center; gap: 5px;
          background: transparent; color: #888; border: 1px solid #e8e4de;
          padding: 6px 14px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .ref-outline-btn:hover:not(:disabled) { border-color: #1a1a1a; color: #1a1a1a; }
        .ref-outline-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .ref-action-btn {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 5px 12px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          border-radius: 2px; border: 1px solid; cursor: pointer;
          transition: all 0.15s; font-family: 'DM Sans', sans-serif; white-space: nowrap;
        }

        .ref-copy-btn {
          width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;
          border: 1px solid #e8e4de; border-radius: 2px; background: #faf9f7;
          cursor: pointer; color: #aaa; transition: all 0.15s; flex-shrink: 0;
        }
        .ref-copy-btn:hover { border-color: #1a1a1a; color: #1a1a1a; background: #fff; }

        /* Tab */
        .ref-tab {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 20px; font-size: 11px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          border: none; border-bottom: 2px solid transparent;
          background: transparent; cursor: pointer; transition: all 0.18s;
          color: #aaa; font-family: 'DM Sans', sans-serif;
        }
        .ref-tab:hover { color: #555; }
        .ref-tab.active { color: #1a1a1a; border-bottom-color: #1a1a1a; }

        /* Table */
        .ref-th {
          font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
          font-weight: 600; color: #aaa; padding: 10px 16px; text-align: left;
          background: #faf9f7; border-bottom: 1px solid #e8e4de;
        }
        .ref-td { padding: 12px 16px; border-bottom: 1px solid #f0ece6; vertical-align: middle; }
        .ref-tr { transition: background 0.12s; }
        .ref-tr:hover { background: #faf9f7; }
        .ref-tr:last-child .ref-td { border-bottom: none; }

        /* Status badge */
        .ref-status {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 3px 9px;
          border-radius: 2px; border: 1px solid; white-space: nowrap;
        }

        /* Mono ID */
        .ref-mono {
          font-size: 11px; font-family: 'Courier New', monospace;
          color: #444; letter-spacing: 0.02em;
        }

        /* Stat card */
        .ref-stat {
          background: #fff; border: 1px solid #e8e4de; border-radius: 2px;
          padding: 16px 20px; flex: 1; min-width: 0; transition: box-shadow 0.2s;
        }
        .ref-stat:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

        /* Alert */
        .ref-alert {
          display: flex; align-items: center; gap: 8px; padding: 11px 14px;
          border-radius: 2px; border: 1px solid; font-size: 13px; margin-bottom: 20px;
        }
        .ref-alert.success { background: #eafaf1; border-color: #a9dfbf; color: #1e8449; }
        .ref-alert.error   { background: #fdecea; border-color: #f5b7b1; color: #c0392b; }

        /* Skeleton */
        .ref-skel {
          background: linear-gradient(90deg, #f5f3ef 0%, #ece9e3 50%, #f5f3ef 100%);
          background-size: 200% 100%;
          animation: refSkel 1.4s ease-in-out infinite;
          border-radius: 2px;
        }
        @keyframes refSkel {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Mobile card */
        .ref-mobile-card {
          background: #fff; border-bottom: 1px solid #f0ece6; padding: 16px;
          transition: background 0.12s;
        }
        .ref-mobile-card:hover { background: #faf9f7; }
        .ref-mobile-card:last-child { border-bottom: none; }
      `}</style>

      <Navbar />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-[#888] mb-1">Admin · Payments</p>
            <h1 className="ref-serif text-4xl font-light text-[#1a1a1a]">Refund Management</h1>
            <p className="text-sm text-[#888] mt-1.5">Review and manually process customer refund requests.</p>
          </div>
          <button
            className="ref-outline-btn self-start sm:self-auto"
            onClick={() => activeTab === 'pending' ? fetchRefunds('INITIATED') : fetchRefunds()}
          >
            <RefreshCw size={12} /> Refresh
          </button>
        </div>

        <div className="ref-divider mb-8" />

        {/* ── Alert ── */}
        {alert.show && (
          <div className={`ref-alert ${alert.type}`}>
            {alert.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
            {alert.message}
          </div>
        )}

        {/* ── Stat cards ── */}
        <div className="flex gap-4 flex-wrap mb-8">
          {[
            { label: 'Pending',  value: refunds.filter(r => r.status === 'INITIATED').length, color: '#e67e22' },
            { label: 'Refunded', value: refunds.filter(r => r.status === 'REFUNDED').length,  color: '#27ae60' },
            { label: 'Rejected', value: refunds.filter(r => r.status === 'FAILED').length,    color: '#c0392b' },
            { label: 'Total',    value: refunds.length,                                        color: '#1a1a1a' },
          ].map(s => (
            <div key={s.label} className="ref-stat">
              <p className="text-[9px] tracking-[0.18em] uppercase text-[#aaa] font-semibold mb-1">{s.label}</p>
              <p className="ref-serif text-3xl font-light" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Main panel ── */}
        <div className="bg-white border border-[#e8e4de] rounded-sm overflow-hidden">

          {/* Tabs + Search */}
          <div className="border-b border-[#e8e4de]">
            <div className="flex items-center justify-between px-4 flex-wrap gap-2">
              <div className="flex">
                <button className={`ref-tab ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
                  <Clock size={12} /> Pending
                </button>
                <button className={`ref-tab ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>
                  <Check size={12} /> Completed
                </button>
              </div>
              <div className="relative py-2 min-w-[220px] max-w-sm flex-1">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" />
                <input
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by ID or reason…"
                  className="ref-input pl-9 py-2"
                />
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="px-5 py-3 border-b border-[#f0ece6]">
            <p className="text-[10px] tracking-[0.1em] uppercase text-[#aaa]">
              {loading ? 'Loading…' : `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="ref-skel h-12" style={{ animationDelay: `${i * 70}ms` }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <AlertCircle size={36} className="text-[#d4cfc8]" />
              <p className="ref-serif text-2xl font-light text-[#888]">No refunds found</p>
              <p className="text-xs tracking-[0.08em] text-[#bbb]">
                {searchTerm ? 'Try different search terms' : `No ${activeTab} refunds at the moment`}
              </p>
            </div>
          ) : (
            <>
              {/* ── Desktop table ── */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {['Refund ID', 'Order ID', 'Payment ID', 'Amount', 'Reason', 'Date', 'Status', 'Actions'].map(h => (
                        <th key={h} className="ref-th">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r: any) => {
                      const sm = STATUS_META[r.status] || STATUS_META.INITIATED;
                      return (
                        <tr key={r.id} className="ref-tr">
                          <td className="ref-td">
                            <div className="flex items-center gap-1.5">
                              <span className="ref-mono" title={r.id}>{shortId(r.id)}</span>
                              <CopyBtn text={r.id} cid={`ref-${r.id}`} />
                            </div>
                          </td>
                          <td className="ref-td">
                            <div className="flex items-center gap-1.5">
                              <span className="ref-mono" title={r.orderId}>{shortId(r.orderId)}</span>
                              <CopyBtn text={r.orderId} cid={`ord-${r.orderId}`} />
                            </div>
                          </td>
                          <td className="ref-td">
                            <div className="flex items-center gap-1.5">
                              <span className="ref-mono" title={r.paymentId}>{shortId(r.paymentId)}</span>
                              <CopyBtn text={r.paymentId} cid={`pay-${r.paymentId}`} />
                            </div>
                          </td>
                          <td className="ref-td">
                            <span className="ref-serif text-lg font-light text-[#1a1a1a]">{fmtCurrency(r.amount)}</span>
                          </td>
                          <td className="ref-td">
                            <p className="text-xs text-[#555] max-w-[160px] leading-relaxed">{r.reason}</p>
                          </td>
                          <td className="ref-td">
                            <p className="text-[11px] text-[#888] whitespace-nowrap">{fmtDate(r.createdAt)}</p>
                          </td>
                          <td className="ref-td">
                            <span className="ref-status" style={{ color: sm.text, background: sm.bg, borderColor: sm.border }}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: sm.dot }} />
                              {sm.label}
                            </span>
                          </td>
                          <td className="ref-td">
                            <div className="flex items-center gap-2">
                              {r.status === 'INITIATED' && (
                                <>
                                  <button
                                    onClick={() => handleProcess(r.id, 'APPROVE')}
                                    disabled={processingId === r.id}
                                    className="ref-action-btn"
                                    style={{ background: '#eafaf1', color: '#1e8449', borderColor: '#a9dfbf' }}
                                  >
                                    {processingId === r.id
                                      ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                      : <Check size={11} />
                                    }
                                    Refund
                                  </button>
                                  <button
                                    onClick={() => handleProcess(r.id, 'REJECT')}
                                    disabled={processingId === r.id}
                                    className="ref-action-btn"
                                    style={{ background: '#fdecea', color: '#c0392b', borderColor: '#f5b7b1' }}
                                  >
                                    {processingId === r.id
                                      ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                      : <X size={11} />
                                    }
                                    Reject
                                  </button>
                                </>
                              )}
                              {r.status === 'REFUNDED' && (
                                <span className="ref-action-btn" style={{ background: '#eafaf1', color: '#1e8449', borderColor: '#a9dfbf', cursor: 'default' }}>
                                  <CheckCircle2 size={11} /> Done
                                </span>
                              )}
                              {r.status === 'FAILED' && (
                                <span className="ref-action-btn" style={{ background: '#fdecea', color: '#c0392b', borderColor: '#f5b7b1', cursor: 'default' }}>
                                  <X size={11} /> Rejected
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ── Mobile cards ── */}
              <div className="lg:hidden">
                {filtered.map((r: any) => {
                  const sm = STATUS_META[r.status] || STATUS_META.INITIATED;
                  return (
                    <div key={r.id} className="ref-mobile-card">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <span className="ref-status" style={{ color: sm.text, background: sm.bg, borderColor: sm.border }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: sm.dot }} />
                          {sm.label}
                        </span>
                        <p className="text-[11px] text-[#aaa]">{fmtDate(r.createdAt)}</p>
                      </div>

                      <p className="ref-serif text-2xl font-light text-[#1a1a1a] mb-3">{fmtCurrency(r.amount)}</p>

                      <div className="space-y-2 mb-3">
                        {[
                          { label: 'Refund ID', text: r.id, cid: `ref-${r.id}` },
                          { label: 'Order ID',  text: r.orderId, cid: `ord-${r.orderId}` },
                          { label: 'Payment ID',text: r.paymentId, cid: `pay-${r.paymentId}` },
                        ].map(row => (
                          <div key={row.label} className="flex items-center justify-between">
                            <span className="text-[10px] tracking-[0.1em] uppercase text-[#aaa] font-semibold">{row.label}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="ref-mono">{shortId(row.text)}</span>
                              <CopyBtn text={row.text} cid={row.cid} />
                            </div>
                          </div>
                        ))}
                      </div>

                      <p className="text-xs text-[#555] leading-relaxed mb-3">{r.reason}</p>

                      {r.status === 'INITIATED' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleProcess(r.id, 'APPROVE')}
                            disabled={processingId === r.id}
                            className="flex-1 ref-action-btn justify-center"
                            style={{ background: '#eafaf1', color: '#1e8449', borderColor: '#a9dfbf' }}
                          >
                            {processingId === r.id
                              ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              : <Check size={12} />
                            }
                            Refund
                          </button>
                          <button
                            onClick={() => handleProcess(r.id, 'REJECT')}
                            disabled={processingId === r.id}
                            className="flex-1 ref-action-btn justify-center"
                            style={{ background: '#fdecea', color: '#c0392b', borderColor: '#f5b7b1' }}
                          >
                            {processingId === r.id
                              ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              : <X size={12} />
                            }
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRefundPage;