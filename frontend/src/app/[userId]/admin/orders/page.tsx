'use client'
import React, { useState, useEffect } from 'react';
import {
  Package, Eye, RefreshCw, CheckCircle2, XCircle, Clock,
  Truck, PackageCheck, AlertCircle, Search, ChevronLeft,
  ChevronRight, LayoutGrid, ShoppingBag, X, IndianRupee, MapPin,
} from 'lucide-react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FooterPart from '@/components/FooterPart';
import Link from 'next/link';

/* ─────────────────────────────────────────────
   STATUS CONFIG
───────────────────────────────────────────── */
const STATUS_META: Record<string, { label: string; dot: string; text: string; bg: string; border: string; icon: React.ReactNode }> = {
  CREATED:   { label: 'Created',   dot: '#aaa',    text: '#555',    bg: '#f5f3ef', border: '#e8e4de', icon: <Clock size={12} /> },
  CONFIRMED: { label: 'Confirmed', dot: '#2980b9', text: '#1a5276', bg: '#eaf3fb', border: '#aed6f1', icon: <CheckCircle2 size={12} /> },
  SHIPPED:   { label: 'Shipped',   dot: '#8e44ad', text: '#6c3483', bg: '#f4ecf7', border: '#d2b4de', icon: <Truck size={12} /> },
  DELIVERED: { label: 'Delivered', dot: '#27ae60', text: '#1e8449', bg: '#eafaf1', border: '#a9dfbf', icon: <PackageCheck size={12} /> },
  CANCELLED: { label: 'Cancelled', dot: '#c0392b', text: '#922b21', bg: '#fdecea', border: '#f5b7b1', icon: <XCircle size={12} /> },
};

/* ─────────────────────────────────────────────
   MODAL
───────────────────────────────────────────── */
const Modal = ({ open, onClose, children }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-white border border-[#e8e4de] rounded-sm w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {children}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   ORDER DETAIL DIALOG
───────────────────────────────────────────── */
const OrderDetail = ({ order, onClose, updating, onUpdate }: any) => {
  const [newStatus, setNewStatus]     = useState(order.orderStatus);
  const [deliveryDate, setDeliveryDate] = useState('');

  const fmtCurrency = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);
  const fmtDate = (d: string) => new Date(d).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const sm = STATUS_META[order.orderStatus] || STATUS_META.CREATED;

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#e8e4de]">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-0.5">Order Detail</p>
          <h2 className="ord-serif text-2xl font-light text-[#1a1a1a]">#{order.orderNumber || order.id.slice(0, 8).toUpperCase()}</h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="ord-status" style={{ color: sm.text, background: sm.bg, borderColor: sm.border }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: sm.dot }} />
              {sm.label}
            </span>
            <span className="text-[11px] text-[#aaa]">{fmtDate(order.createdAt)}</span>
          </div>
        </div>
        <button className="ord-icon-btn mt-0.5" onClick={onClose}><X size={14} /></button>
      </div>

      <div className="px-6 py-5 space-y-6">
        {/* Customer + Payment row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#faf9f7] border border-[#e8e4de] rounded-sm p-4">
            <p className="text-[9px] tracking-[0.18em] uppercase text-[#aaa] font-semibold mb-3">Customer</p>
            <p className="text-sm font-semibold text-[#1a1a1a]">{order.user?.name || '—'}</p>
            <p className="text-xs text-[#888] mt-0.5">{order.user?.email || '—'}</p>
            <p className="text-xs text-[#888] mt-0.5">{order.user?.phoneNumber || '—'}</p>
          </div>
          <div className="bg-[#faf9f7] border border-[#e8e4de] rounded-sm p-4">
            <p className="text-[9px] tracking-[0.18em] uppercase text-[#aaa] font-semibold mb-3">Payment</p>
            <p className="text-sm font-semibold text-[#1a1a1a]">{order.paymentMethod}</p>
            <p className="text-xs text-[#888] mt-0.5">Status: {order.payment?.status || 'PENDING'}</p>
            <p className="ord-serif text-xl font-light text-[#1a1a1a] mt-1">{fmtCurrency(order.totalAmount)}</p>
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <p className="text-[9px] tracking-[0.18em] uppercase text-[#aaa] font-semibold mb-3">Shipping Address</p>
          {order.address ? (
            <div className="bg-[#faf9f7] border border-[#e8e4de] rounded-sm p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-[#aaa]"><MapPin size={14} /></span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1a1a1a]">{order.address.fullname}</p>
                  <p className="text-xs text-[#888] mt-0.5">{order.address.mobile} · {order.address.email}</p>
                  <p className="text-xs text-[#555] mt-2 leading-relaxed">
                    {order.address.streetAddress}, {order.address.locality}
                    {order.address.landmark ? `, ${order.address.landmark}` : ''}
                    <br />
                    {order.address.city}, {order.address.state} – {order.address.pincode}
                    <br />
                    {order.address.country}
                  </p>
                  {order.address.GSTIN && (
                    <p className="text-[11px] text-[#aaa] mt-2">GSTIN: {order.address.GSTIN}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-[#fdecea] border border-[#f5b7b1] rounded-sm p-4 text-xs text-[#922b21]">
              <AlertCircle size={14} />
              No address on file for this order
            </div>
          )}
        </div>

        {/* Order items */}
        <div>
          <p className="text-[9px] tracking-[0.18em] uppercase text-[#aaa] font-semibold mb-3">
            Items ({order.items.length})
          </p>
          <div className="border border-[#e8e4de] rounded-sm overflow-hidden">
            {/* Mobile */}
            <div className="sm:hidden divide-y divide-[#f0ece6]">
              {order.items.map((item: any) => (
                <div key={item.id} className="p-4 flex gap-3">
                  <img src={item.product.primaryImage1 || '/placeholder.jpg'} alt={item.product.name}
                    className="w-14 h-14 object-cover rounded-sm border border-[#e8e4de] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1a1a1a] line-clamp-2">{item.product.name}</p>
                    <p className="text-xs text-[#888] mt-0.5">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold text-[#1a1a1a] mt-1">{fmtCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop */}
            <table className="w-full border-collapse hidden sm:table">
              <thead>
                <tr className="bg-[#faf9f7] border-b border-[#e8e4de]">
                  {['Product', 'Price', 'Qty', 'Total'].map(h => (
                    <th key={h} className="ord-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any, idx: number) => (
                  <tr key={item.id} className={`ord-tr ${idx < order.items.length - 1 ? 'border-b border-[#f0ece6]' : ''}`}>
                    <td className="ord-td">
                      <div className="flex items-center gap-3">
                        <img src={item.product.primaryImage1 || '/placeholder.jpg'} alt={item.product.name}
                          className="w-10 h-10 object-cover rounded-sm border border-[#e8e4de] flex-shrink-0" />
                        <span className="text-sm font-medium text-[#1a1a1a] line-clamp-2">{item.product.name}</span>
                      </div>
                    </td>
                    <td className="ord-td text-sm text-[#555]">{fmtCurrency(item.price)}</td>
                    <td className="ord-td text-sm font-semibold text-[#1a1a1a] text-center">{item.quantity}</td>
                    <td className="ord-td text-sm font-semibold text-[#1a1a1a] text-right">{fmtCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delivery date info */}
        {order.deliveryDate && (
          <div className="flex items-center gap-2 px-4 py-3 bg-[#eafaf1] border border-[#a9dfbf] rounded-sm text-sm text-[#1e8449]">
            <PackageCheck size={14} />
            Delivered on {fmtDate(order.deliveryDate)}
          </div>
        )}

        {/* Update status */}
        <div className="border border-[#e8e4de] rounded-sm p-4">
          <p className="text-[9px] tracking-[0.18em] uppercase text-[#aaa] font-semibold mb-4">Update Status</p>
          <div className="space-y-3">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {Object.entries(STATUS_META).map(([key, meta]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setNewStatus(key)}
                  className="flex flex-col items-center gap-1.5 p-2.5 border rounded-sm text-center transition-all"
                  style={{
                    borderColor: newStatus === key ? meta.border : '#e8e4de',
                    background: newStatus === key ? meta.bg : '#fff',
                    color: newStatus === key ? meta.text : '#888',
                  }}
                >
                  <span style={{ color: newStatus === key ? meta.dot : '#ccc' }}>{meta.icon}</span>
                  <span className="text-[9px] tracking-[0.08em] uppercase font-semibold">{meta.label}</span>
                </button>
              ))}
            </div>

            {newStatus === 'DELIVERED' && (
              <div className="space-y-1.5">
                <label className="block text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888]">
                  Delivery Date (optional)
                </label>
                <input
                  type="datetime-local"
                  value={deliveryDate}
                  onChange={e => setDeliveryDate(e.target.value)}
                  className="ord-input"
                />
                <p className="text-[11px] text-[#aaa]">Leave blank to use current date/time</p>
              </div>
            )}

            <button
              onClick={() => onUpdate(order.id, newStatus, deliveryDate || null)}
              disabled={updating || newStatus === order.orderStatus}
              className="ord-primary-btn w-full justify-center disabled:opacity-50"
            >
              {updating
                ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Updating…</>
                : 'Update Status'
              }
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const OrderManagement = () => {
  const userId  = typeof window !== 'undefined' ? localStorage.getItem('arttagUserId') : null;
  const router  = useRouter();
  const { userId: paramUserId } = useParams();

  const [orders, setOrders]               = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading]             = useState(true);
  const [updating, setUpdating]           = useState(false);
  const [isChecking, setIsChecking]       = useState(true);
  const [statusFilter, setStatusFilter]   = useState('ALL');
  const [searchQuery, setSearchQuery]     = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [alert, setAlert]                 = useState({ show: false, type: '', message: '' });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  /* ── Auth ── */
  useEffect(() => {
    const check = async () => {
      try {
        const uid = localStorage.getItem('arttagUserId');
        const tok = localStorage.getItem('arttagtoken');
        if (!uid || !tok) { router.replace('/login'); return; }
        const res = await axios.get(`${API_BASE_URL}/user/${uid}/get/profile`);
        if (!res.data.success || res.data.user.role !== 'ADMIN') { router.replace('/login'); return; }
      } catch { router.replace('/login'); }
      finally { setIsChecking(false); }
    };
    check();
  }, [router]);

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    let f = [...orders];
    if (statusFilter !== 'ALL') f = f.filter((o: any) => o.orderStatus === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      f = f.filter((o: any) =>
        o.id.toLowerCase().includes(q) ||
        (o.orderNumber?.toLowerCase().includes(q)) ||
        (o.user?.name?.toLowerCase().includes(q)) ||
        (o.user?.email?.toLowerCase().includes(q))
      );
    }
    setFilteredOrders(f);
  }, [orders, statusFilter, searchQuery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/payment/get/all/orders`);
      if (res.data.success) setOrders(res.data.orders);
    } catch { showAlert('error', 'Failed to fetch orders'); }
    finally { setLoading(false); }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string, deliveryDate: string | null) => {
    try {
      setUpdating(true);
      const payload: any = { newStatus };
      if (deliveryDate) payload.deliveryDate = deliveryDate;
      const res = await axios.patch(`${API_BASE_URL}/payment/update/order/status/${orderId}`, payload);
      if (res.data.success) { showAlert('success', 'Order status updated!'); fetchOrders(); setSelectedOrder(null); }
    } catch (e: any) { showAlert('error', e.response?.data?.message || 'Failed to update status'); }
    finally { setUpdating(false); }
  };

  const showAlert = (type: string, message: string) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 4000);
  };

  const fmtCurrency = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);
  const fmtDate     = (d: string) => new Date(d).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  /* ── Stat counts ── */
  const stats = Object.entries(STATUS_META).map(([key, meta]) => ({
    label: meta.label,
    value: orders.filter((o: any) => o.orderStatus === key).length,
    color: meta.dot,
  }));

  /* ── Loading / auth check screen ── */
  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center gap-4"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap'); .ord-serif { font-family: 'Cormorant Garamond', serif; }`}</style>
        <Link href="/"><span className="ord-serif text-3xl font-light tracking-[0.2em] text-[#1a1a1a]">ARTTAG</span></Link>
        <div className="w-7 h-7 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs tracking-[0.15em] uppercase text-[#888]">Verifying access…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .ord-serif {font-family: 'DM Sans', sans-serif; }

        .ord-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }

        /* Input */
        .ord-input {
          width: 100%; padding: 9px 12px; font-size: 13px;
          border: 1px solid #e8e4de; border-radius: 2px;
          background: #fff; color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.2s; appearance: none;
        }
        .ord-input:focus { border-color: #1a1a1a; }
        .ord-input::placeholder { color: #ccc; }

        /* Select */
        .ord-select {
          padding: 9px 32px 9px 12px; font-size: 12px; letter-spacing: 0.05em;
          border: 1px solid #e8e4de; border-radius: 2px;
          background: #fff; color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
          outline: none; appearance: none; cursor: pointer;
          transition: border-color 0.2s;
        }
        .ord-select:focus { border-color: #1a1a1a; }

        /* Buttons */
        .ord-primary-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: #1a1a1a; color: #fff; border: none;
          padding: 9px 18px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: background 0.2s;
          font-family: 'DM Sans', sans-serif; white-space: nowrap;
        }
        .ord-primary-btn:hover:not(:disabled) { background: #333; }
        .ord-primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .ord-outline-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent; color: #888; border: 1px solid #e8e4de;
          padding: 8px 16px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .ord-outline-btn:hover { border-color: #1a1a1a; color: #1a1a1a; }

        .ord-view-btn {
          display: inline-flex; align-items: center; gap: 5px;
          background: #faf9f7; color: #555; border: 1px solid #e8e4de;
          padding: 6px 12px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .ord-view-btn:hover { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }

        .ord-icon-btn {
          width: 30px; height: 30px; border-radius: 2px;
          border: 1px solid #e8e4de; background: #faf9f7;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #888; transition: all 0.15s; flex-shrink: 0;
        }
        .ord-icon-btn:hover { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }

        /* Status badge */
        .ord-status {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 3px 9px;
          border-radius: 2px; border: 1px solid; white-space: nowrap;
        }

        /* Stat card */
        .ord-stat {
          background: #fff; border: 1px solid #e8e4de; border-radius: 2px;
          padding: 14px 18px; flex: 1; min-width: 0; transition: box-shadow 0.2s;
        }
        .ord-stat:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

        /* Table */
        .ord-th {
          font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
          font-weight: 600; color: #aaa; padding: 10px 16px; text-align: left;
          background: #faf9f7; border-bottom: 1px solid #e8e4de;
        }
        .ord-td { padding: 14px 16px; vertical-align: middle; }
        .ord-tr { transition: background 0.12s; }
        .ord-tr:hover { background: #faf9f7; }

        /* Alert */
        .ord-alert {
          display: flex; align-items: center; gap: 8px; padding: 11px 14px;
          border-radius: 2px; border: 1px solid; font-size: 13px; margin-bottom: 20px;
        }
        .ord-alert.success { background: #eafaf1; border-color: #a9dfbf; color: #1e8449; }
        .ord-alert.error   { background: #fdecea; border-color: #f5b7b1; color: #c0392b; }

        /* Skeleton */
        .ord-skel {
          background: linear-gradient(90deg, #f5f3ef 0%, #ece9e3 50%, #f5f3ef 100%);
          background-size: 200% 100%;
          animation: ordSkel 1.4s ease-in-out infinite;
          border-radius: 2px;
        }
        @keyframes ordSkel {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <Navbar />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-[#888] mb-1">Admin · Commerce</p>
            <h1 className="ord-serif text-4xl font-light text-[#1a1a1a]">Order Management</h1>
            <p className="text-sm text-[#888] mt-1.5">Track and update all customer orders.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button className="ord-outline-btn" onClick={() => router.push(`/${paramUserId}/admin/product`)}>
              <Package size={13} /> Products
            </button>
            <button className="ord-outline-btn" onClick={() => router.push(`/${paramUserId}/admin/category`)}>
              <LayoutGrid size={13} /> Categories
            </button>
            <button className="ord-outline-btn" onClick={fetchOrders}>
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </div>

        <div className="ord-divider mb-8" />

        {/* ── Alert ── */}
        {alert.show && (
          <div className={`ord-alert ${alert.type}`}>
            {alert.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
            {alert.message}
          </div>
        )}

        {/* ── Stat cards ── */}
        <div className="flex gap-3 flex-wrap mb-8">
          <div className="ord-stat">
            <p className="text-[9px] tracking-[0.18em] uppercase text-[#aaa] font-semibold mb-1">Total</p>
            <p className="ord-serif text-3xl font-light text-[#1a1a1a]">{orders.length}</p>
          </div>
          {stats.map(s => (
            <div key={s.label} className="ord-stat">
              <p className="text-[9px] tracking-[0.18em] uppercase text-[#aaa] font-semibold mb-1">{s.label}</p>
              <p className="ord-serif text-3xl font-light" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Controls ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 items-stretch sm:items-center">
          <div className="relative flex-1 min-w-0">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by order number, name, email…"
              className="ord-input pl-9"
            />
          </div>
          <div className="relative flex-shrink-0">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="ord-select">
              <option value="ALL">All Orders</option>
              {Object.entries(STATUS_META).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#aaa]" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white border border-[#e8e4de] rounded-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e4de]">
            <div>
              <h2 className="ord-serif text-xl font-light text-[#1a1a1a]">All Orders</h2>
              <p className="text-[10px] tracking-[0.1em] uppercase text-[#aaa] mt-0.5">
                {loading ? 'Loading…' : `${filteredOrders.length} of ${orders.length} order${orders.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="ord-skel h-14" style={{ animationDelay: `${i * 70}ms` }} />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Package size={40} className="text-[#d4cfc8]" />
              <p className="ord-serif text-2xl font-light text-[#888]">
                {searchQuery ? 'No orders match your search' : 'No orders yet'}
              </p>
              <p className="text-xs tracking-[0.08em] text-[#bbb]">
                {searchQuery ? 'Try different keywords' : 'Orders will appear here once placed'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {['Order', 'Customer', 'Items', 'Total', 'Status', 'Date', ''].map(h => (
                        <th key={h} className="ord-th">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order: any, idx: number) => {
                      const sm = STATUS_META[order.orderStatus] || STATUS_META.CREATED;
                      return (
                        <tr key={order.id} className="ord-tr" style={{ borderBottom: idx < filteredOrders.length - 1 ? '1px solid #f0ece6' : 'none' }}>
                          <td className="ord-td">
                            <span className="text-xs font-mono font-semibold text-[#1a1a1a]">
                              #{(order.orderNumber || order.id.slice(0, 8)).toUpperCase()}
                            </span>
                          </td>
                          <td className="ord-td">
                            <p className="text-sm font-medium text-[#1a1a1a]">{order.user?.name || '—'}</p>
                            <p className="text-xs text-[#888]">{order.user?.email || '—'}</p>
                          </td>
                          <td className="ord-td text-center">
                            <span className="w-7 h-7 rounded-sm border border-[#e8e4de] bg-[#faf9f7] text-xs font-semibold text-[#1a1a1a] inline-flex items-center justify-center">
                              {order.items.length}
                            </span>
                          </td>
                          <td className="ord-td">
                            <span className="ord-serif text-base font-light text-[#1a1a1a]">
                              {fmtCurrency(order.totalAmount)}
                            </span>
                          </td>
                          <td className="ord-td">
                            <span className="ord-status" style={{ color: sm.text, background: sm.bg, borderColor: sm.border }}>
                              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sm.dot }} />
                              {sm.label}
                            </span>
                          </td>
                          <td className="ord-td">
                            <span className="text-xs text-[#888]">{fmtDate(order.createdAt)}</span>
                          </td>
                          <td className="ord-td">
                            <button className="ord-view-btn" onClick={() => setSelectedOrder(order)}>
                              <Eye size={12} /> View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="lg:hidden divide-y divide-[#f0ece6]">
                {filteredOrders.map((order: any) => {
                  const sm = STATUS_META[order.orderStatus] || STATUS_META.CREATED;
                  return (
                    <div key={order.id} className="p-4 hover:bg-[#faf9f7] transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="text-xs font-mono font-semibold text-[#1a1a1a]">
                            #{(order.orderNumber || order.id.slice(0, 8)).toUpperCase()}
                          </p>
                          <p className="text-sm font-medium text-[#1a1a1a] mt-0.5">{order.user?.name || '—'}</p>
                          <p className="text-xs text-[#888]">{order.user?.email || '—'}</p>
                        </div>
                        <button className="ord-view-btn flex-shrink-0" onClick={() => setSelectedOrder(order)}>
                          <Eye size={12} /> View
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="ord-serif text-lg font-light text-[#1a1a1a]">{fmtCurrency(order.totalAmount)}</span>
                        <span className="ord-status" style={{ color: sm.text, background: sm.bg, borderColor: sm.border }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: sm.dot }} />
                          {sm.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ════════ ORDER DETAIL MODAL ════════ */}
      <Modal open={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
        {selectedOrder && (
          <OrderDetail
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            updating={updating}
            onUpdate={updateOrderStatus}
          />
        )}
      </Modal>

      <div className="ord-divider" />
      <FooterPart />
    </div>
  );
};

export default OrderManagement;