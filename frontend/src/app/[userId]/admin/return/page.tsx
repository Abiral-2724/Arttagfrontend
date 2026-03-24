'use client'
import React, { useState, useEffect } from 'react';
import {
  Package, CheckCircle2, XCircle, AlertCircle, Clock,
  RefreshCw, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Mail, Phone, X, IndianRupee,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const STATUS: Record<string, { label: string; dot: string; text: string; bg: string; border: string }> = {
  REQUESTED: { label: 'Requested', dot: '#e67e22', text: '#935116', bg: '#fef5e7', border: '#f5cba7' },
  APPROVED:  { label: 'Approved',  dot: '#27ae60', text: '#1e8449', bg: '#eafaf1', border: '#a9dfbf' },
  REJECTED:  { label: 'Rejected',  dot: '#c0392b', text: '#922b21', bg: '#fdecea', border: '#f5b7b1' },
  PICKED:    { label: 'Picked',    dot: '#2980b9', text: '#1a5276', bg: '#ebf5fb', border: '#a9cce3' },
  REFUNDED:  { label: 'Refunded',  dot: '#7d3c98', text: '#6c3483', bg: '#f5eef8', border: '#d2b4de' },
};

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
            <h2 className="ret-serif text-xl font-light text-[#1a1a1a]">{title}</h2>
          </div>
          <button onClick={onClose} className="ret-icon-btn mt-0.5 flex-shrink-0"><X size={13} /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

const ReturnManagementPage = () => {
  const [returns, setReturns]       = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter]   = useState('');
  const [approveModal, setApproveModal]   = useState<string | null>(null);
  const [rejectModal, setRejectModal]     = useState<string | null>(null);
  const [adminNote, setAdminNote]         = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => { fetchReturns(); }, [pagination.page, statusFilter]);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const sp = statusFilter ? `&status=${statusFilter}` : '';
      const res = await fetch(`${API}/return/get/all/return/?page=${pagination.page}&limit=${pagination.limit}${sp}`);
      if (!res.ok) throw new Error('Failed to fetch returns');
      const data = await res.json();
      setReturns(data.returns); setPagination(data.pagination);
    } catch (e: any) { showAlert(e.message, 'error'); }
    finally { setLoading(false); }
  };

  const showAlert = (msg: string, type: 'success' | 'error' = 'success') => {
    setAlert({ show: true, message: msg, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 4000);
  };

  const patch = async (url: string, body: any, msg: string) => {
    const res = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Request failed'); }
    showAlert(msg); fetchReturns();
  };

  const handleApprove = async (id: string) => {
    try { setActionLoading(id); await patch(`${API}/return/update/return/request/${id}`, { status: 'APPROVED', adminNote: adminNote || undefined }, 'Return approved!'); setApproveModal(null); setAdminNote(''); }
    catch (e: any) { showAlert(e.message, 'error'); } finally { setActionLoading(null); }
  };

  const handleReject = async (id: string) => {
    if (!adminNote.trim()) { showAlert('Rejection reason is required', 'error'); return; }
    try { setActionLoading(id); await patch(`${API}/return/update/return/request/${id}`, { status: 'REJECTED', adminNote }, 'Return rejected.'); setRejectModal(null); setAdminNote(''); }
    catch (e: any) { showAlert(e.message, 'error'); } finally { setActionLoading(null); }
  };

  const handleMarkPicked = async (id: string) => {
    try { setActionLoading(id); await patch(`${API}/return/update/product/picked/${id}`, {}, 'Marked as picked!'); }
    catch (e: any) { showAlert(e.message, 'error'); } finally { setActionLoading(null); }
  };

  const handleRefund = async (id: string, method: string) => {
    if (method === 'COD') { showAlert('No refund needed for COD orders', 'error'); return; }
    try {
      setActionLoading(id);
      const res = await fetch(`${API}/return/initiate/refund/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to initiate refund'); }
      showAlert('Refund initiated!'); fetchReturns();
    } catch (e: any) { showAlert(e.message, 'error'); } finally { setActionLoading(null); }
  };

  const fmtCur  = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const requested = returns.filter(r => r.status === 'REQUESTED').length;
  const approved  = returns.filter(r => r.status === 'APPROVED').length;
  const refunded  = returns.filter(r => r.status === 'REFUNDED').length;

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .ret-serif { font-family: 'DM Sans', sans-serif; }
        .ret-divider { height:1px; background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent); }
        .ret-input { width:100%; padding:9px 12px; font-size:13px; border:1px solid #e8e4de; border-radius:2px; background:#fff; color:#1a1a1a; font-family:'DM Sans',sans-serif; outline:none; transition:border-color 0.2s; resize:none; }
        .ret-input:focus { border-color:#1a1a1a; }
        .ret-input::placeholder { color:#ccc; }
        .ret-outline-btn { display:inline-flex; align-items:center; gap:5px; background:transparent; color:#888; border:1px solid #e8e4de; padding:7px 14px; font-size:10px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; border-radius:2px; cursor:pointer; transition:all 0.2s; font-family:'DM Sans',sans-serif; white-space:nowrap; }
        .ret-outline-btn:hover:not(:disabled) { border-color:#1a1a1a; color:#1a1a1a; }
        .ret-outline-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .ret-icon-btn { width:28px; height:28px; border-radius:2px; border:1px solid #e8e4de; background:#faf9f7; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#888; transition:all 0.15s; }
        .ret-icon-btn:hover { background:#1a1a1a; color:#fff; border-color:#1a1a1a; }
        .ret-card { background:#fff; border:1px solid #e8e4de; border-radius:2px; overflow:hidden; transition:box-shadow 0.2s, border-color 0.2s; }
        .ret-card:hover { box-shadow:0 4px 20px rgba(0,0,0,0.06); border-color:#d4cfc8; }
        .ret-status { display:inline-flex; align-items:center; gap:5px; font-size:10px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; padding:3px 10px; border-radius:2px; border:1px solid; white-space:nowrap; }
        .ret-action { display:inline-flex; align-items:center; gap:5px; padding:6px 14px; font-size:10px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; border-radius:2px; cursor:pointer; transition:all 0.15s; font-family:'DM Sans',sans-serif; white-space:nowrap; border:1px solid; background:transparent; }
        .ret-action:disabled { opacity:0.5; cursor:not-allowed; }
        .ret-alert { display:flex; align-items:center; gap:8px; padding:11px 14px; border-radius:2px; border:1px solid; font-size:13px; margin-bottom:20px; }
        .ret-alert.success { background:#eafaf1; border-color:#a9dfbf; color:#1e8449; }
        .ret-alert.error   { background:#fdecea; border-color:#f5b7b1; color:#c0392b; }
        .ret-select { padding:8px 30px 8px 12px; font-size:11px; letter-spacing:0.06em; border:1px solid #e8e4de; border-radius:2px; background:#fff; color:#1a1a1a; font-family:'DM Sans',sans-serif; outline:none; appearance:none; cursor:pointer; }
        .ret-select:focus { border-color:#1a1a1a; }
        .ret-skel { background:linear-gradient(90deg,#f5f3ef 0%,#ece9e3 50%,#f5f3ef 100%); background-size:200% 100%; animation:retS 1.4s ease-in-out infinite; border-radius:2px; }
        @keyframes retS { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .pg-btn { width:32px; height:32px; display:flex; align-items:center; justify-content:center; border-radius:2px; border:1px solid #e8e4de; background:#fff; font-size:11px; font-weight:600; color:#888; cursor:pointer; transition:all 0.15s; }
        .pg-btn:hover:not(:disabled) { border-color:#1a1a1a; color:#1a1a1a; }
        .pg-btn:disabled { opacity:0.4; cursor:not-allowed; }
      `}</style>

      <Navbar />

      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-[#888] mb-1">Admin · Operations</p>
            <h1 className="ret-serif text-4xl font-light text-[#1a1a1a]">Return Requests</h1>
            <p className="text-sm text-[#888] mt-1.5">Review, approve, and process product return requests.</p>
          </div>
          <button className="ret-outline-btn self-start sm:self-auto" onClick={fetchReturns}>
            <RefreshCw size={12} /> Refresh
          </button>
        </div>

        <div className="ret-divider mb-8" />

        {/* Alert */}
        {alert.show && (
          <div className={`ret-alert ${alert.type}`}>
            {alert.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
            {alert.message}
          </div>
        )}

        {/* Stat cards */}
        <div className="flex flex-wrap gap-4 mb-8">
          {[
            { label: 'Total',    value: pagination.total, color: '#1a1a1a' },
            { label: 'Pending',  value: requested,        color: '#e67e22' },
            { label: 'Approved', value: approved,         color: '#27ae60' },
            { label: 'Refunded', value: refunded,         color: '#7d3c98' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-[#e8e4de] rounded-sm px-5 py-3">
              <p className="text-[9px] tracking-[0.18em] uppercase text-[#aaa] font-semibold mb-0.5">{s.label}</p>
              <p className="ret-serif text-2xl font-light" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="bg-white border border-[#e8e4de] rounded-sm px-4 py-3 mb-6 flex items-center gap-3 flex-wrap">
          <p className="text-[10px] tracking-[0.12em] uppercase font-semibold text-[#aaa]">Status</p>
          <div className="relative">
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })); }} className="ret-select">
              <option value="">All</option>
              <option value="REQUESTED">Requested</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="PICKED">Picked</option>
              <option value="REFUNDED">Refunded</option>
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#aaa]" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white border border-[#e8e4de] rounded-sm p-6 space-y-3">
                <div className="ret-skel h-4 w-1/3" />
                <div className="ret-skel h-3 w-1/2" />
                <div className="ret-skel h-3 w-1/4" />
              </div>
            ))}
          </div>
        ) : returns.length === 0 ? (
          <div className="bg-white border border-[#e8e4de] rounded-sm flex flex-col items-center justify-center py-20 gap-3">
            <Package size={40} className="text-[#d4cfc8]" />
            <p className="ret-serif text-2xl font-light text-[#888]">No return requests</p>
            <p className="text-xs tracking-[0.08em] text-[#bbb]">No requests match your current filter</p>
          </div>
        ) : (
          <div className="space-y-4">
            {returns.map((r: any) => {
              const sm = STATUS[r.status] || STATUS.REQUESTED;
              const isExpanded = expandedId === r.id;
              const isActing   = actionLoading === r.id;

              return (
                <div key={r.id} className="ret-card">
                  <div className="p-5 sm:p-6">

                    {/* Top row */}
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-1.5">
                          <p className="text-sm font-semibold text-[#1a1a1a] tracking-wide">
                            Return #{r.id.slice(0, 8).toUpperCase()}
                          </p>
                          <span className="ret-status" style={{ color: sm.text, background: sm.bg, borderColor: sm.border }}>
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sm.dot }} />
                            {sm.label}
                          </span>
                        </div>
                        <p className="text-xs text-[#888]">Order: <span className="font-medium text-[#555]">{r.orderId.slice(0, 8).toUpperCase()}</span></p>
                        <p className="text-xs text-[#aaa] mt-0.5">{fmtDate(r.createdAt)}</p>
                      </div>
                      <button onClick={() => setExpandedId(isExpanded ? null : r.id)} className="ret-icon-btn flex-shrink-0">
                        {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                    </div>

                    {/* Info grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                      <div>
                        <p className="text-[9px] tracking-[0.16em] uppercase text-[#aaa] font-semibold mb-1.5">Customer</p>
                        <p className="text-sm font-semibold text-[#1a1a1a]">{r.order?.user?.name || '—'}</p>
                        {r.order?.user?.email && <p className="text-[11px] text-[#888] flex items-center gap-1 mt-0.5"><Mail size={10} />{r.order.user.email}</p>}
                        {r.order?.user?.phoneNumber && <p className="text-[11px] text-[#888] flex items-center gap-1 mt-0.5"><Phone size={10} />{r.order.user.phoneNumber}</p>}
                      </div>
                      <div>
                        <p className="text-[9px] tracking-[0.16em] uppercase text-[#aaa] font-semibold mb-1.5">Return Amount</p>
                        <p className="ret-serif text-2xl font-light text-[#1a1a1a]">{fmtCur(r.amount)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] tracking-[0.16em] uppercase text-[#aaa] font-semibold mb-1.5">Payment</p>
                        <span className="text-xs font-semibold tracking-[0.06em] uppercase text-[#555] bg-[#f5f3ef] border border-[#e8e4de] px-2.5 py-1 rounded-sm">
                          {r.order?.paymentMethod || '—'}
                        </span>
                      </div>
                    </div>

                    {/* Expanded */}
                    {isExpanded && (
                      <div className="border-t border-[#f0ece6] pt-4 mb-5 space-y-3">
                        <div>
                          <p className="text-[9px] tracking-[0.16em] uppercase text-[#aaa] font-semibold mb-1">Reason</p>
                          <p className="text-sm text-[#444] leading-relaxed">{r.reason}</p>
                        </div>
                        {r.description && (
                          <div>
                            <p className="text-[9px] tracking-[0.16em] uppercase text-[#aaa] font-semibold mb-1">Additional Details</p>
                            <p className="text-sm text-[#444] leading-relaxed">{r.description}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {r.status === 'REQUESTED' && (
                        <>
                          <button className="ret-action" style={{ color: '#1e8449', borderColor: '#a9dfbf', background: '#eafaf1' }} onClick={() => { setApproveModal(r.id); setAdminNote(''); }}>
                            <CheckCircle2 size={12} /> Approve
                          </button>
                          <button className="ret-action" style={{ color: '#922b21', borderColor: '#f5b7b1', background: '#fdecea' }} onClick={() => { setRejectModal(r.id); setAdminNote(''); }}>
                            <XCircle size={12} /> Reject
                          </button>
                        </>
                      )}
                      {r.status === 'APPROVED' && (
                        <button disabled={isActing} className="ret-action" style={{ color: '#1a5276', borderColor: '#a9cce3', background: '#ebf5fb' }} onClick={() => handleMarkPicked(r.id)}>
                          {isActing ? <><div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />Processing…</> : <><Package size={12} />Mark Picked</>}
                        </button>
                      )}
                      {r.status === 'PICKED' && r.order?.paymentMethod !== 'COD' && (
                        <button disabled={isActing} className="ret-action" style={{ color: '#6c3483', borderColor: '#d2b4de', background: '#f5eef8' }} onClick={() => handleRefund(r.id, r.order.paymentMethod)}>
                          {isActing ? <><div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />Processing…</> : <><IndianRupee size={12} />Initiate Refund</>}
                        </button>
                      )}
                      {r.status === 'PICKED' && r.order?.paymentMethod === 'COD' && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#faf9f7] border border-[#e8e4de] rounded-sm text-[10px] text-[#888] tracking-[0.08em] uppercase font-semibold">
                          <Clock size={11} /> No refund — COD
                        </div>
                      )}
                      {r.status === 'REJECTED' && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[10px] font-semibold tracking-[0.08em] uppercase" style={{ color: '#922b21', background: '#fdecea', border: '1px solid #f5b7b1' }}>
                          <XCircle size={11} /> Rejected
                        </div>
                      )}
                      {r.status === 'REFUNDED' && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[10px] font-semibold tracking-[0.08em] uppercase" style={{ color: '#1e8449', background: '#eafaf1', border: '1px solid #a9dfbf' }}>
                          <CheckCircle2 size={11} /> Refund Completed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <p className="text-xs text-[#888]">Page <strong className="text-[#1a1a1a]">{pagination.page}</strong> of <strong className="text-[#1a1a1a]">{pagination.totalPages}</strong></p>
            <div className="flex items-center gap-1.5">
              <button className="pg-btn" disabled={pagination.page === 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}><ChevronLeft size={14} /></button>
              <button className="pg-btn" disabled={pagination.page === pagination.totalPages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}><ChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Approve Modal */}
      <Modal open={!!approveModal} onClose={() => { setApproveModal(null); setAdminNote(''); }} title="Approve Return" eyebrow="Confirm Action">
        <p className="text-sm text-[#666] mb-4 leading-relaxed">Approve this return and notify the customer to arrange pickup.</p>
        <div className="space-y-1.5 mb-5">
          <label className="block text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888]">Admin Note <span className="text-[#aaa] normal-case tracking-normal font-normal">(optional)</span></label>
          <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)} placeholder="Any notes for this approval…" rows={3} className="ret-input" />
        </div>
        <div className="flex gap-3">
          <button className="ret-outline-btn flex-1" disabled={!!actionLoading} onClick={() => { setApproveModal(null); setAdminNote(''); }}>Cancel</button>
          <button disabled={actionLoading === approveModal} onClick={() => approveModal && handleApprove(approveModal)}
            className="flex-1 py-2 bg-[#27ae60] text-white text-[10px] tracking-[0.14em] uppercase font-semibold rounded-sm hover:bg-[#229954] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {actionLoading === approveModal ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing…</> : <><CheckCircle2 size={12} />Approve</>}
          </button>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal open={!!rejectModal} onClose={() => { setRejectModal(null); setAdminNote(''); }} title="Reject Return" eyebrow="Confirm Action">
        <p className="text-sm text-[#666] mb-4 leading-relaxed">Please provide a reason. This will be shared with the customer.</p>
        <div className="space-y-1.5 mb-5">
          <label className="block text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888]">Rejection Reason <span className="text-[#c0392b] ml-0.5">*</span></label>
          <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)} placeholder="Explain why this return is being rejected…" rows={4} className="ret-input" />
        </div>
        <div className="flex gap-3">
          <button className="ret-outline-btn flex-1" disabled={!!actionLoading} onClick={() => { setRejectModal(null); setAdminNote(''); }}>Cancel</button>
          <button disabled={actionLoading === rejectModal || !adminNote.trim()} onClick={() => rejectModal && handleReject(rejectModal)}
            className="flex-1 py-2 bg-[#c0392b] text-white text-[10px] tracking-[0.14em] uppercase font-semibold rounded-sm hover:bg-[#a93226] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {actionLoading === rejectModal ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing…</> : <><XCircle size={12} />Reject</>}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ReturnManagementPage;