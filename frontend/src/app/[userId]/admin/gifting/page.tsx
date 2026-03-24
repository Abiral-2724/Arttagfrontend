'use client'
import React, { useState, useEffect, useRef } from 'react';
import {
  Search, ChevronLeft, ChevronRight, Check, X, Clock,
  Mail, Building2, Phone, Package, Calendar, RefreshCw,
  MoreVertical, Download, ChevronDown, TrendingUp, CheckCircle2, AlertCircle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const STATUS_META: Record<string, { label: string; dot: string; text: string; bg: string; border: string }> = {
  APPROVED: { label: 'Approved', dot: '#27ae60', text: '#1e8449', bg: '#eafaf1', border: '#a9dfbf' },
  REJECTED: { label: 'Rejected', dot: '#c0392b', text: '#922b21', bg: '#fdecea', border: '#f5b7b1' },
  PENDING:  { label: 'Pending',  dot: '#e67e22', text: '#935116', bg: '#fef5e7', border: '#f5cba7' },
};

const CorporateGiftingAdmin = () => {
  const [requests, setRequests]           = useState<any[]>([]);
  const [loading, setLoading]             = useState(true);
  const [searchTerm, setSearchTerm]       = useState('');
  const [statusFilter, setStatusFilter]   = useState('ALL');
  const [currentPage, setCurrentPage]     = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [total, setTotal]                 = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMsg, setExpandedMsg]     = useState<string | null>(null);
  const [sortBy]                          = useState('createdAt');
  const [sortOrder]                       = useState('desc');
  const [isSearching, setIsSearching]     = useState(false);
  const [updatingId, setUpdatingId]       = useState<string | null>(null);
  const dropdownRef                       = useRef<HTMLDivElement>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const LIMIT    = 10;

  /* ── Fetch ── */
  const fetchRequests = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(), limit: LIMIT.toString(), sortBy, sortOrder,
      });
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      const res  = await fetch(`${API_BASE}/corporate/get/all/request?${params}`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
        setCurrentPage(page);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) { fetchRequests(1); setIsSearching(false); return; }
    setLoading(true); setIsSearching(true);
    try {
      const res  = await fetch(`${API_BASE}/corporate/search?search=${encodeURIComponent(searchTerm.trim())}`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
        setTotal(data.count);
        setTotalPages(1); setCurrentPage(1);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${API_BASE}/corporate/update/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      }
    } catch (e) { console.error(e); }
    finally { setUpdatingId(null); setActiveDropdown(null); }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Company', 'Email', 'Contact', 'Quantity', 'Status', 'Date', 'Message'];
    const rows = requests.map(r => [
      r.name, r.companyName, r.companyEmail, r.contact,
      r.quantity, r.status,
      new Date(r.createdAt).toLocaleDateString(),
      r.askAnything || '',
    ]);
    const csv = [headers, ...rows].map(row => row.map(c => `"${c}"`).join(',')).join('\n');
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: `corporate-${new Date().toISOString().split('T')[0]}.csv`,
    });
    a.click();
  };

  useEffect(() => { fetchRequests(1); }, [statusFilter, sortBy, sortOrder]);

  /* close dropdown on outside click */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  /* ── Derived stats ── */
  const pendingCount  = requests.filter(r => r.status === 'PENDING').length;
  const approvedCount = requests.filter(r => r.status === 'APPROVED').length;
  const rejectedCount = requests.filter(r => r.status === 'REJECTED').length;

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .corp-serif { font-family: 'DM Sans', sans-serif; }

        .corp-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }

        /* Inputs */
        .corp-input {
          padding: 9px 12px;
          font-size: 13px;
          border: 1px solid #e8e4de;
          border-radius: 2px;
          background: #fff;
          color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .corp-input:focus { border-color: #1a1a1a; }
        .corp-input::placeholder { color: #ccc; }

        /* Select */
        .corp-select {
          padding: 9px 32px 9px 12px;
          font-size: 12px;
          letter-spacing: 0.05em;
          border: 1px solid #e8e4de;
          border-radius: 2px;
          background: #fff;
          color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          appearance: none;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .corp-select:focus { border-color: #1a1a1a; }

        /* Buttons */
        .corp-primary-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: #1a1a1a; color: #fff; border: none;
          padding: 9px 18px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer;
          transition: background 0.2s;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }
        .corp-primary-btn:hover { background: #333; }

        .corp-outline-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent; color: #888; border: 1px solid #e8e4de;
          padding: 8px 14px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }
        .corp-outline-btn:hover { border-color: #1a1a1a; color: #1a1a1a; }

        /* Table */
        .corp-table { width: 100%; border-collapse: collapse; }
        .corp-th {
          font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
          font-weight: 600; color: #aaa; padding: 10px 16px;
          text-align: left; background: #faf9f7;
          border-bottom: 1px solid #e8e4de;
        }
        .corp-td { padding: 14px 16px; border-bottom: 1px solid #f0ece6; vertical-align: top; }
        .corp-tr { transition: background 0.15s; }
        .corp-tr:hover { background: #faf9f7; }
        .corp-tr:last-child .corp-td { border-bottom: none; }

        /* Status badge */
        .corp-status {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 3px 10px;
          border-radius: 2px; border: 1px solid; white-space: nowrap;
        }

        /* Action dropdown */
        .corp-dropdown {
          position: absolute; right: 0; top: 100%; margin-top: 4px;
          background: #fff; border: 1px solid #e8e4de; border-radius: 2px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          z-index: 50; min-width: 160px; overflow: hidden;
        }
        .corp-dropdown-item {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px; font-size: 11px; font-weight: 500;
          letter-spacing: 0.06em; text-transform: uppercase;
          cursor: pointer; transition: background 0.12s;
          font-family: 'DM Sans', sans-serif;
          border: none; background: transparent; width: 100%; text-align: left;
        }

        /* Stat card */
        .corp-stat {
          background: #fff; border: 1px solid #e8e4de; border-radius: 2px;
          padding: 16px 20px; flex: 1; min-width: 0;
          transition: box-shadow 0.2s;
        }
        .corp-stat:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

        /* Message panel */
        .corp-msg-panel {
          background: #faf9f7; border: 1px solid #e8e4de; border-radius: 2px;
          margin-top: 6px; padding: 10px 12px;
          font-size: 13px; color: #555; line-height: 1.65;
        }

        /* Skeleton */
        .corp-skel {
          background: linear-gradient(90deg, #f5f3ef 0%, #ece9e3 50%, #f5f3ef 100%);
          background-size: 200% 100%;
          animation: corpSkel 1.4s ease-in-out infinite;
          border-radius: 2px;
        }
        @keyframes corpSkel {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Pagination btn */
        .corp-page-btn {
          width: 32px; height: 32px; display: flex;
          align-items: center; justify-content: center;
          border-radius: 2px; border: 1px solid #e8e4de;
          background: #fff; font-size: 12px; font-weight: 600;
          color: #888; cursor: pointer; transition: all 0.15s;
        }
        .corp-page-btn:hover:not(:disabled) { border-color: #1a1a1a; color: #1a1a1a; }
        .corp-page-btn.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
        .corp-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      <Navbar />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-10">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-[#888] mb-1">Admin · Enquiries</p>
            <h1 className="corp-serif text-4xl font-light text-[#1a1a1a]">Corporate Gifting</h1>
            <p className="text-sm text-[#888] mt-1.5">Manage and respond to all corporate gifting requests.</p>
          </div>
          <button className="corp-outline-btn self-start sm:self-auto" onClick={exportToCSV} title="Export CSV">
            <Download size={13} /> Export CSV
          </button>
        </div>

        <div className="corp-divider mb-8" />

        {/* ── Stat cards ── */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {[
            { label: 'Total',    value: total,         color: '#1a1a1a' },
            { label: 'Pending',  value: pendingCount,  color: '#e67e22' },
            { label: 'Approved', value: approvedCount, color: '#27ae60' },
            { label: 'Rejected', value: rejectedCount, color: '#c0392b' },
          ].map(s => (
            <div key={s.label} className="corp-stat">
              <p className="text-[9px] tracking-[0.18em] uppercase text-[#aaa] font-semibold mb-1">{s.label}</p>
              <p className="corp-serif text-3xl font-light" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Controls bar ── */}
        <div className="bg-white border border-[#e8e4de] rounded-sm p-4 mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" />
            <input
              type="text"
              placeholder="Search by company or email…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="corp-input pl-9"
            />
          </div>

          {/* Status filter */}
          <div className="relative flex-shrink-0">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="corp-select">
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] pointer-events-none" />
          </div>

          <button onClick={handleSearch} className="corp-primary-btn flex-shrink-0">
            <Search size={13} /> Search
          </button>
          <button
            onClick={() => { setSearchTerm(''); setIsSearching(false); fetchRequests(1); }}
            className="corp-outline-btn flex-shrink-0"
          >
            <RefreshCw size={13} /> Reset
          </button>
        </div>

        {/* ── Table ── */}
        <div className="bg-white border border-[#e8e4de] rounded-sm overflow-hidden">

          {/* Table header label */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e4de]">
            <div>
              <h2 className="corp-serif text-xl font-light text-[#1a1a1a]">All Requests</h2>
              <p className="text-[10px] tracking-[0.1em] uppercase text-[#aaa] mt-0.5">
                {loading ? 'Loading…' : `${total} request${total !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="corp-skel h-14" style={{ animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Package size={40} className="text-[#d4cfc8]" />
              <p className="corp-serif text-2xl font-light text-[#888]">No requests found</p>
              <p className="text-xs tracking-[0.08em] text-[#bbb]">Try adjusting your filters or search</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="corp-table">
                <thead>
                  <tr>
                    {['Contact', 'Company', 'Qty', 'Message', 'Status', 'Date', ''].map(h => (
                      <th key={h} className="corp-th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req: any) => {
                    const sm = STATUS_META[req.status] || STATUS_META.PENDING;
                    const isUpdating = updatingId === req.id;
                    return (
                      <tr key={req.id} className="corp-tr">
                        {/* Contact */}
                        <td className="corp-td">
                          <p className="text-sm font-semibold text-[#1a1a1a] mb-1">{req.name}</p>
                          <p className="text-xs text-[#888] flex items-center gap-1.5 mb-0.5">
                            <Mail size={11} className="flex-shrink-0" />{req.companyEmail}
                          </p>
                          <p className="text-xs text-[#888] flex items-center gap-1.5">
                            <Phone size={11} className="flex-shrink-0" />{req.contact}
                          </p>
                        </td>

                        {/* Company */}
                        <td className="corp-td">
                          <div className="flex items-center gap-2">
                            <Building2 size={14} className="text-[#aaa] flex-shrink-0" />
                            <span className="text-sm font-medium text-[#1a1a1a]">{req.companyName}</span>
                          </div>
                        </td>

                        {/* Quantity */}
                        <td className="corp-td">
                          <div className="flex items-center gap-1.5">
                            <Package size={13} className="text-[#aaa]" />
                            <span className="text-sm font-semibold text-[#1a1a1a]">{req.quantity}</span>
                          </div>
                        </td>

                        {/* Message toggle */}
                        <td className="corp-td max-w-[200px]">
                          {req.askAnything ? (
                            <div>
                              <button
                                onClick={() => setExpandedMsg(expandedMsg === req.id ? null : req.id)}
                                className="text-[10px] tracking-[0.1em] uppercase font-semibold text-[#888] flex items-center gap-1 hover:text-[#1a1a1a] transition-colors"
                              >
                                {expandedMsg === req.id ? 'Hide' : 'Show'} message
                                <ChevronDown size={11} className={`transition-transform ${expandedMsg === req.id ? 'rotate-180' : ''}`} />
                              </button>
                              {expandedMsg === req.id && (
                                <div className="corp-msg-panel mt-2">{req.askAnything}</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-[#ccc] italic">No message</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="corp-td">
                          <span
                            className="corp-status"
                            style={{ color: sm.text, background: sm.bg, borderColor: sm.border }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sm.dot }} />
                            {sm.label}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="corp-td">
                          <div className="flex items-center gap-1.5 text-xs text-[#888]">
                            <Calendar size={11} />
                            {new Date(req.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric', month: 'short', day: 'numeric',
                            })}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="corp-td">
                          <div className="relative" ref={activeDropdown === req.id ? dropdownRef : null}>
                            <button
                              onClick={() => setActiveDropdown(activeDropdown === req.id ? null : req.id)}
                              disabled={isUpdating}
                              className="w-8 h-8 flex items-center justify-center border border-[#e8e4de] bg-[#faf9f7] rounded-sm text-[#888] hover:border-[#1a1a1a] hover:text-[#1a1a1a] hover:bg-white transition-all"
                            >
                              {isUpdating
                                ? <div className="w-3 h-3 border-2 border-[#888] border-t-transparent rounded-full animate-spin" />
                                : <MoreVertical size={14} />
                              }
                            </button>

                            {activeDropdown === req.id && (
                              <div className="corp-dropdown">
                                <p className="text-[9px] tracking-[0.15em] uppercase text-[#aaa] px-3 pt-3 pb-1 font-semibold">Set Status</p>
                                {[
                                  { status: 'PENDING',  icon: <Clock size={12} />,  label: 'Mark Pending',  col: '#e67e22' },
                                  { status: 'APPROVED', icon: <Check size={12} />,  label: 'Approve',       col: '#27ae60' },
                                  { status: 'REJECTED', icon: <X size={12} />,      label: 'Reject',        col: '#c0392b' },
                                ].map(opt => (
                                  <button
                                    key={opt.status}
                                    onClick={() => updateStatus(req.id, opt.status)}
                                    className="corp-dropdown-item"
                                    style={{ color: opt.col }}
                                  >
                                    {opt.icon} {opt.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Pagination ── */}
          {!loading && !isSearching && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#e8e4de] bg-[#faf9f7]">
              <p className="text-xs text-[#888]">
                Showing <strong className="text-[#1a1a1a]">{((currentPage - 1) * LIMIT) + 1}</strong> – <strong className="text-[#1a1a1a]">{Math.min(currentPage * LIMIT, total)}</strong> of <strong className="text-[#1a1a1a]">{total}</strong>
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  className="corp-page-btn"
                  disabled={currentPage === 1}
                  onClick={() => fetchRequests(currentPage - 1)}
                >
                  <ChevronLeft size={14} />
                </button>
                {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                  const page = totalPages <= 7 ? i + 1
                    : currentPage <= 4 ? i + 1
                    : currentPage >= totalPages - 3 ? totalPages - 6 + i
                    : currentPage - 3 + i;
                  return (
                    <button
                      key={page}
                      className={`corp-page-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => fetchRequests(page)}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  className="corp-page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => fetchRequests(currentPage + 1)}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdown on outside click */}
      {activeDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
      )}
    </div>
  );
};

export default CorporateGiftingAdmin;