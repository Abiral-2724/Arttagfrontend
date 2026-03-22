'use client'
import React, { useState } from 'react';
import {
  Package, Eye, X, CheckCircle2, Clock, Truck,
  XCircle, Calendar, CreditCard, ShoppingBag,
  AlertCircle, RotateCcw, ChevronRight, PackageCheck,
  MapPin, ArrowRight,
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/* ─────────────────────────────────────────────
   STATUS CONFIG
───────────────────────────────────────────── */
const STATUS_META: Record<string, { label: string; dot: string; text: string; bg: string; border: string }> = {
  CREATED:   { label: 'Created',   dot: '#aaa',    text: '#555',    bg: '#f5f3ef', border: '#e8e4de' },
  CONFIRMED: { label: 'Confirmed', dot: '#2980b9', text: '#1a5276', bg: '#eaf3fb', border: '#aed6f1' },
  SHIPPED:   { label: 'Shipped',   dot: '#8e44ad', text: '#6c3483', bg: '#f4ecf7', border: '#d2b4de' },
  DELIVERED: { label: 'Delivered', dot: '#27ae60', text: '#1e8449', bg: '#eafaf1', border: '#a9dfbf' },
  CANCELLED: { label: 'Cancelled', dot: '#c0392b', text: '#922b21', bg: '#fdecea', border: '#f5b7b1' },
};

const RETURN_META: Record<string, { label: string; dot: string; text: string; bg: string; border: string }> = {
  REQUESTED: { label: 'Requested', dot: '#e67e22', text: '#935116', bg: '#fef5e7', border: '#f5cba7' },
  REJECTED:  { label: 'Rejected',  dot: '#c0392b', text: '#922b21', bg: '#fdecea', border: '#f5b7b1' },
  APPROVED:  { label: 'Approved',  dot: '#2980b9', text: '#1a5276', bg: '#eaf3fb', border: '#aed6f1' },
  PICKED:    { label: 'Picked Up', dot: '#8e44ad', text: '#6c3483', bg: '#f4ecf7', border: '#d2b4de' },
  REFUNDED:  { label: 'Refunded',  dot: '#27ae60', text: '#1e8449', bg: '#eafaf1', border: '#a9dfbf' },
};

const StatusBadge = ({ status, meta }: any) => {
  const s = meta[status];
  if (!s) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.08em] uppercase px-2.5 py-1 rounded-sm border"
      style={{ color: s.text, background: s.bg, borderColor: s.border }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
};

/* ─────────────────────────────────────────────
   MODAL
───────────────────────────────────────────── */
const Modal = ({ open, onClose, title, eyebrow, children, wide = false }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}>
      <div className={`bg-white border border-[#e8e4de] rounded-sm w-full max-h-[90vh] overflow-y-auto ${wide ? 'max-w-3xl' : 'max-w-md'}`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="sticky top-0 bg-white z-10 flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#e8e4de]">
          <div>
            {eyebrow && <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-0.5">{eyebrow}</p>}
            <h2 className="text-xl font-semibold text-[#1a1a1a]">{title}</h2>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 border border-[#e8e4de] rounded-sm flex items-center justify-center text-[#888] hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a] transition-all flex-shrink-0 mt-0.5">
            <X size={13} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   ORDER STATUS TRACKER
───────────────────────────────────────────── */
const StatusTracker = ({ status, deliveryDate }: any) => {
  const steps = ['CREATED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
  const idx = steps.indexOf(status);
  const cancelled = status === 'CANCELLED';

  if (cancelled) {
    return (
      <div className="flex items-center gap-3 p-4 bg-[#fdecea] border border-[#f5b7b1] rounded-sm">
        <XCircle size={18} className="text-[#c0392b] flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-[#922b21]">Order Cancelled</p>
          <p className="text-xs text-[#c0392b] mt-0.5">This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 right-0 top-3.5 h-0.5 bg-[#e8e4de]">
          <div className="h-full bg-[#1a1a1a] transition-all duration-500"
            style={{ width: `${(idx / (steps.length - 1)) * 100}%` }} />
        </div>
        {steps.map((s, i) => {
          const done    = i < idx;
          const current = i === idx;
          return (
            <div key={s} className="flex flex-col items-center gap-2 z-10">
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center bg-white transition-all ${done || current ? 'border-[#1a1a1a]' : 'border-[#e8e4de]'}`}>
                {done ? <CheckCircle2 size={14} className="text-[#1a1a1a]" />
                  : current ? <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a1a] animate-pulse" />
                  : <div className="w-2.5 h-2.5 rounded-full bg-[#e8e4de]" />}
              </div>
              <span className={`text-[9px] tracking-[0.1em] uppercase font-semibold ${done || current ? 'text-[#1a1a1a]' : 'text-[#ccc]'}`}>
                {s}
              </span>
            </div>
          );
        })}
      </div>

      {/* Delivery info */}
      <div className="flex items-center gap-3 p-3 bg-[#faf9f7] border border-[#e8e4de] rounded-sm">
        <Truck size={15} className="text-[#888] flex-shrink-0" />
        <div>
          <p className="text-[10px] uppercase tracking-[0.1em] text-[#888] font-semibold">
            {status === 'DELIVERED' ? 'Delivered on' : 'Expected Delivery'}
          </p>
          <p className="text-sm font-medium text-[#1a1a1a] mt-0.5">
            {deliveryDate
              ? new Date(deliveryDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
              : 'Delivery date will be updated soon'}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   RETURN REQUEST DIALOG
───────────────────────────────────────────── */
const ReturnRequestDialog = ({ open, onClose, product, orderId, userId, onSuccess }: any) => {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/return/request/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, productId: product.product.id, reason: reason.trim(), userId }),
      });
      const data = await res.json();
      if (res.ok) { onSuccess('Return request submitted successfully'); onClose(); setReason(''); }
      else alert(data.error || 'Failed to submit');
    } catch { alert('Error submitting return request'); }
    finally { setSubmitting(false); }
  };

  if (!open || !product) return null;

  return (
    <Modal open={open} onClose={onClose} title="Request Return" eyebrow="Returns">
      <div className="flex gap-3 mb-5 bg-[#faf9f7] border border-[#e8e4de] rounded-sm p-3">
        <img src={product.product?.primaryImage1} alt={product.product?.name}
          className="w-14 h-14 object-cover rounded-sm border border-[#e8e4de] flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#1a1a1a] line-clamp-2">{product.product?.name}</p>
          <p className="text-xs text-[#888] mt-0.5">Qty: {product.quantity} · ₹{product.price}</p>
        </div>
      </div>

      <div className="space-y-1.5 mb-4">
        <label className="block text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888]">
          Reason for Return <span className="text-[#c0392b]">*</span>
        </label>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Describe why you want to return this product…"
          rows={4}
          className="w-full px-3 py-2.5 text-sm border border-[#e8e4de] rounded-sm bg-white text-[#1a1a1a] outline-none focus:border-[#1a1a1a] transition-colors resize-none placeholder:text-[#ccc]"
          disabled={submitting}
        />
      </div>

      <div className="flex items-start gap-2 px-3 py-2.5 bg-[#eaf3fb] border border-[#aed6f1] rounded-sm mb-5">
        <AlertCircle size={13} className="text-[#2980b9] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#1a5276] leading-relaxed">Your request will be reviewed. You'll be notified once approved.</p>
      </div>

      <div className="flex gap-3">
        <button onClick={onClose} disabled={submitting}
          className="flex-1 border border-[#e8e4de] text-[#888] py-2.5 text-[10px] tracking-[0.14em] uppercase font-semibold rounded-sm hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors disabled:opacity-40">
          Cancel
        </button>
        <button onClick={handleSubmit} disabled={submitting || !reason.trim()}
          className="flex-1 bg-[#1a1a1a] text-white py-2.5 text-[10px] tracking-[0.14em] uppercase font-semibold rounded-sm hover:bg-[#333] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {submitting ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <RotateCcw size={12} />}
          Submit Request
        </button>
      </div>
    </Modal>
  );
};

/* ─────────────────────────────────────────────
   ORDER DETAIL MODAL
───────────────────────────────────────────── */
const OrderDetailModal = ({ order, open, onClose, onCancelRequest }: any) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [returnDialog, setReturnDialog]       = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productsOpen, setProductsOpen]       = useState(false);

  if (!order) return null;
  const canCancel = order.orderStatus === 'CREATED' || order.orderStatus === 'CONFIRMED';

  const handleConfirmCancel = async () => {
    setProcessing(true);
    await onCancelRequest(order.id, order.paymentMethod);
    setProcessing(false); setShowCancelConfirm(false);
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <Modal open={open} onClose={onClose} title={`Order #${order.id.slice(0, 10)}…`} eyebrow="Order Detail" wide>
        <div className="space-y-6">

          {/* Status + date */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs text-[#888]">
              <Calendar size={13} />{fmtDate(order.createdAt)}
            </div>
            <StatusBadge status={order.orderStatus} meta={STATUS_META} />
          </div>

          {/* Tracker */}
          <div className="bg-[#faf9f7] border border-[#e8e4de] rounded-sm p-4">
            <p className="text-[9px] tracking-[0.18em] uppercase text-[#aaa] font-semibold mb-4">Order Status</p>
            <StatusTracker status={order.orderStatus} deliveryDate={order.deliveryDate} />
          </div>

          {/* Items */}
          <div>
            <p className="text-[9px] tracking-[0.18em] uppercase text-[#aaa] font-semibold mb-3">Items ({order.items?.length})</p>
            <div className="space-y-2">
              {order.items?.map((item: any) => {
                const returnMeta = RETURN_META[item.returnStatus];
                const canReturn = item.isReturnable && !item.returnStatus && order.orderStatus === 'DELIVERED';
                return (
                  <div key={item.id} className="flex gap-3 p-3 bg-[#faf9f7] border border-[#e8e4de] rounded-sm">
                    <img src={item.product?.primaryImage1} alt={item.product?.name}
                      className="w-14 h-14 object-cover rounded-sm border border-[#e8e4de] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1a1a1a] line-clamp-1">{item.product?.name}</p>
                      <p className="text-xs text-[#888] mt-0.5">Qty: {item.quantity} · ₹{item.price}</p>
                      {returnMeta && <div className="mt-1.5"><StatusBadge status={item.returnStatus} meta={RETURN_META} /></div>}
                      {!item.isReturnable && !item.returnStatus && <p className="text-[10px] text-[#aaa] mt-1">Not eligible for return</p>}
                      {canReturn && (
                        <button onClick={() => { setSelectedProduct(item); setReturnDialog(true); }}
                          className="mt-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-[#1a1a1a] border-b border-[#1a1a1a] hover:opacity-60 transition-opacity">
                          <RotateCcw size={10} /> Request Return
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price */}
          <div className="bg-[#faf9f7] border border-[#e8e4de] rounded-sm p-4 space-y-2">
            <p className="text-[9px] tracking-[0.18em] uppercase text-[#aaa] font-semibold mb-2">Price Summary</p>
            <div className="flex justify-between text-sm text-[#555]"><span>Subtotal</span><span>₹{order.subtotal || order.totalAmount}</span></div>
            {order.shippingCharge > 0 && <div className="flex justify-between text-sm text-[#555]"><span>Shipping</span><span>₹{order.shippingCharge}</span></div>}
            <div className="h-px bg-[#e8e4de] my-2" />
            <div className="flex justify-between font-semibold text-[#1a1a1a]"><span>Total</span><span>₹{order.totalAmount}</span></div>
          </div>

          {/* Payment */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#faf9f7] border border-[#e8e4de] rounded-sm">
              <p className="text-[9px] tracking-[0.14em] uppercase text-[#aaa] font-semibold mb-1">Payment Method</p>
              <p className="text-sm font-medium text-[#1a1a1a]">{order.paymentMethod}</p>
            </div>
            <div className="p-3 bg-[#faf9f7] border border-[#e8e4de] rounded-sm">
              <p className="text-[9px] tracking-[0.14em] uppercase text-[#aaa] font-semibold mb-1">Payment Status</p>
              <p className="text-sm font-medium text-[#1a1a1a]">{order.paymentStatus}</p>
            </div>
          </div>

          {/* Cancel */}
          {canCancel && (
            <button onClick={() => setShowCancelConfirm(true)}
              className="w-full border border-[#f5b7b1] text-[#c0392b] bg-[#fdecea] py-3 text-[10px] tracking-[0.16em] uppercase font-semibold rounded-sm hover:bg-[#f9d5d0] transition-colors flex items-center justify-center gap-2">
              <XCircle size={13} /> Cancel Order
            </button>
          )}
        </div>
      </Modal>

      {/* Cancel confirm */}
      <Modal open={showCancelConfirm} onClose={() => setShowCancelConfirm(false)} title="Cancel Order?" eyebrow="Confirm Action">
        <p className="text-sm text-[#666] mb-5 leading-relaxed">
          {order.paymentMethod === 'COD'
            ? 'This COD order will be immediately cancelled.'
            : 'A refund request will be created and processed within 5–7 business days.'}
        </p>
        <div className="flex gap-3">
          <button onClick={() => setShowCancelConfirm(false)} disabled={processing}
            className="flex-1 border border-[#e8e4de] text-[#888] py-2.5 text-[10px] tracking-[0.14em] uppercase font-semibold rounded-sm hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors disabled:opacity-40">
            Keep Order
          </button>
          <button onClick={handleConfirmCancel} disabled={processing}
            className="flex-1 bg-[#c0392b] text-white py-2.5 text-[10px] tracking-[0.14em] uppercase font-semibold rounded-sm hover:bg-[#a93226] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {processing ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <XCircle size={12} />}
            Yes, Cancel
          </button>
        </div>
      </Modal>

      {/* Return request */}
      <ReturnRequestDialog
        open={returnDialog}
        onClose={() => { setReturnDialog(false); setSelectedProduct(null); }}
        product={selectedProduct}
        orderId={order.id}
        userId={typeof window !== 'undefined' ? localStorage.getItem('arttagUserId') : null}
        onSuccess={(msg: string) => { setReturnDialog(false); setSelectedProduct(null); onClose(); }}
      />
    </>
  );
};

/* ─────────────────────────────────────────────
   MAIN ORDER SECTION
───────────────────────────────────────────── */
const ORDER_TABS = [
  { id: 'ALL',       label: 'All',       icon: ShoppingBag },
  { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
];

export default function OrderSection({ showAlert }: any) {
  const [activeTab, setActiveTab]       = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [detailOpen, setDetailOpen]     = useState(false);
  const [trackOpen, setTrackOpen]       = useState(false);
  const [orders, setOrders]             = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  const userId = typeof window !== 'undefined' ? localStorage.getItem('arttagUserId') : null;

  React.useEffect(() => { fetchOrders(); }, [userId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/payment/get/all/user/${userId}/orders`);
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
      else setError(data.message || 'Failed to fetch orders');
    } catch { setError('Failed to load orders.'); }
    finally { setLoading(false); }
  };

  const handleCancelRequest = async (orderId: string, paymentMethod: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/payment/cancel/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reason: 'Customer requested cancellation' }),
      });
      const data = await res.json();
      if (data.success) {
        showAlert?.(paymentMethod === 'COD' ? 'Order cancelled' : 'Cancellation requested. Refund in 5–7 days.');
        setDetailOpen(false); await fetchOrders();
      } else showAlert?.(data.message || 'Failed to cancel', 'error');
    } catch { showAlert?.('Error cancelling order', 'error'); }
  };

  const filtered = activeTab === 'ALL' ? orders : orders.filter((o: any) => o.orderStatus === activeTab);

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="p-6 sm:p-8">

      {/* Header */}
      <div className="mb-7">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-0.5">Your</p>
        <h2 className="text-xl font-semibold text-[#1a1a1a]">Orders</h2>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#e8e4de] to-transparent mb-7" />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#e8e4de]">
        {ORDER_TABS.map(tab => {
          const Icon = tab.icon;
          const count = tab.id === 'ALL' ? orders.length : orders.filter((o: any) => o.orderStatus === tab.id).length;
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-[10px] tracking-[0.12em] uppercase font-semibold border-b-2 -mb-px transition-colors ${
                active ? 'border-[#1a1a1a] text-[#1a1a1a]' : 'border-transparent text-[#888] hover:text-[#555]'
              }`}>
              <Icon size={13} />
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-bold ${active ? 'bg-[#1a1a1a] text-white' : 'bg-[#f0ece6] text-[#888]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-6 h-6 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs tracking-[0.1em] uppercase text-[#888]">Loading orders…</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <XCircle size={36} className="text-[#d4cfc8]" />
          <p className="text-sm text-[#c0392b]">{error}</p>
          <button onClick={fetchOrders} className="text-[10px] uppercase tracking-wider font-semibold text-[#1a1a1a] border-b border-[#1a1a1a] hover:opacity-60 transition-opacity">Try Again</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Package size={36} className="text-[#d4cfc8]" />
          <p className="text-sm font-light text-[#888]">{activeTab === 'ALL' ? 'No orders yet' : `No ${activeTab.toLowerCase()} orders`}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order: any) => {
            const sm = STATUS_META[order.orderStatus] || STATUS_META.CREATED;
            return (
              <div key={order.id}
                className="border border-[#e8e4de] rounded-sm bg-white hover:border-[#d4cfc8] hover:shadow-sm transition-all overflow-hidden">
                {/* Status stripe */}
                <div className="h-0.5" style={{ background: sm.dot }} />

                <div className="p-4">
                  {/* Row 1: order id + status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs font-semibold text-[#1a1a1a] font-mono">#{order.id.slice(0, 12)}…</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-[#888] mt-0.5">
                        <Calendar size={11} />{fmtDate(order.createdAt)}
                      </div>
                    </div>
                    <StatusBadge status={order.orderStatus} meta={STATUS_META} />
                  </div>

                  {/* Row 2: items + payment + total */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { label: 'Items', value: `${order.items?.length} item${order.items?.length !== 1 ? 's' : ''}` },
                      { label: 'Payment', value: order.paymentMethod },
                      { label: 'Total', value: `₹${order.totalAmount}` },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-[#faf9f7] border border-[#f0ece6] rounded-sm p-2.5">
                        <p className="text-[9px] uppercase tracking-[0.1em] text-[#aaa] font-semibold mb-0.5">{label}</p>
                        <p className="text-xs font-semibold text-[#1a1a1a] truncate">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelectedOrder(order); setTrackOpen(true); }}
                      className="flex-1 border border-[#e8e4de] text-[#555] py-2 text-[10px] tracking-[0.12em] uppercase font-semibold rounded-sm hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors flex items-center justify-center gap-1.5">
                      <MapPin size={11} /> Track
                    </button>
                    <button
                      onClick={() => { setSelectedOrder(order); setDetailOpen(true); }}
                      className="flex-1 bg-[#1a1a1a] text-white py-2 text-[10px] tracking-[0.12em] uppercase font-semibold rounded-sm hover:bg-[#333] transition-colors flex items-center justify-center gap-1.5">
                      <Eye size={11} /> View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail modal */}
      <OrderDetailModal order={selectedOrder} open={detailOpen} onClose={() => setDetailOpen(false)} onCancelRequest={handleCancelRequest} />

      {/* Track modal */}
      <Modal open={trackOpen && !!selectedOrder} onClose={() => setTrackOpen(false)} title="Track Order" eyebrow="Shipment Status">
        {selectedOrder && <StatusTracker status={selectedOrder.orderStatus} deliveryDate={selectedOrder.deliveryDate} />}
      </Modal>
    </div>
  );
}