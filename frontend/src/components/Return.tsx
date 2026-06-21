'use client'
import React, { useState, useMemo } from 'react';
import {
  Package, Clock, CheckCircle2, XCircle, RefreshCw,
  ChevronDown, ChevronUp, Truck, PackageCheck,
} from 'lucide-react';

interface ReturnItem {
  id: string; orderId: string; status: string; reason: string; amount: number; createdAt: string;
  approvedAt?: string; rejectedAt?: string; pickedAt?: string; refundedAt?: string;
  order: { id: string; orderStatus: string; createdAt: string; updatedAt: string;
    items: Array<{ id: string; quantity: number; price: number; product: { id: string; name: string; primaryImage1: string } }> };
  product: { id: string; name: string; primaryImage1: string };
}

const STATUS_META: Record<string, { label: string; dot: string; text: string; bg: string; border: string }> = {
  REQUESTED: { label: 'Requested', dot: '#e67e22', text: '#935116', bg: '#fef5e7', border: '#f5cba7' },
  APPROVED:  { label: 'Approved',  dot: '#27ae60', text: '#1e8449', bg: '#eafaf1', border: '#a9dfbf' },
  REJECTED:  { label: 'Rejected',  dot: '#c0392b', text: '#922b21', bg: '#fdecea', border: '#f5b7b1' },
  PICKED:    { label: 'Picked Up', dot: '#8e44ad', text: '#6c3483', bg: '#f4ecf7', border: '#d2b4de' },
  REFUNDED:  { label: 'Refunded',  dot: '#27ae60', text: '#1e8449', bg: '#eafaf1', border: '#a9dfbf' },
};

const STATUS_MSGS: Record<string, { bg: string; border: string; text: string; body: string }> = {
  REQUESTED: { bg: '#eaf3fb', border: '#aed6f1', text: '#1a5276', body: 'Your return is being reviewed. We\'ll update you shortly.' },
  APPROVED:  { bg: '#eafaf1', border: '#a9dfbf', text: '#1e8449', body: 'Return approved. We\'ll arrange pickup soon.' },
  PICKED:    { bg: '#f4ecf7', border: '#d2b4de', text: '#6c3483', body: 'Item picked up. Refund will be initiated after verification.' },
  REFUNDED:  { bg: '#eafaf1', border: '#a9dfbf', text: '#1e8449', body: 'Refund has been completed and credited to your account.' },
  REJECTED:  { bg: '#fdecea', border: '#f5b7b1', text: '#922b21', body: 'Return rejected. Please contact support for more information.' },
};

/* Icons + colors for each possible timeline stage, driven by real stage timestamps */
const TIMELINE_ICON: Record<string, React.ReactNode> = {
  REQUESTED: <Clock size={10} className="text-[#2980b9]" />,
  APPROVED:  <CheckCircle2 size={10} className="text-[#27ae60]" />,
  REJECTED:  <XCircle size={10} className="text-[#c0392b]" />,
  PICKED:    <Truck size={10} className="text-[#8e44ad]" />,
  REFUNDED:  <PackageCheck size={10} className="text-[#27ae60]" />,
};
const TIMELINE_BG: Record<string, { bg: string; border: string }> = {
  REQUESTED: { bg: '#eaf3fb', border: '#aed6f1' },
  APPROVED:  { bg: '#eafaf1', border: '#a9dfbf' },
  REJECTED:  { bg: '#fdecea', border: '#f5b7b1' },
  PICKED:    { bg: '#f4ecf7', border: '#d2b4de' },
  REFUNDED:  { bg: '#eafaf1', border: '#a9dfbf' },
};

/* Builds the timeline strictly from the return's own stage timestamps — not the order's */
const buildTimeline = (item: ReturnItem) => {
  const steps: { key: string; label: string; date: string }[] = [
    { key: 'REQUESTED', label: 'Return Requested', date: item.createdAt },
  ];
  if (item.status === 'REJECTED' && item.rejectedAt) {
    steps.push({ key: 'REJECTED', label: 'Rejected', date: item.rejectedAt });
    return steps;
  }
  if (item.approvedAt) steps.push({ key: 'APPROVED', label: 'Approved', date: item.approvedAt });
  if (item.pickedAt)   steps.push({ key: 'PICKED',   label: 'Picked Up', date: item.pickedAt });
  if (item.refundedAt) steps.push({ key: 'REFUNDED', label: 'Refunded', date: item.refundedAt });
  return steps;
};

const StatusBadge = ({ status }: any) => {
  const s = STATUS_META[status];
  if (!s) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.08em] uppercase px-2.5 py-1 rounded-sm border"
      style={{ color: s.text, background: s.bg, borderColor: s.border }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
};

const TABS = [
  { id: 'all',       label: 'All' },
  { id: 'requested', label: 'Requested' },
  { id: 'approved',  label: 'Approved' },
  { id: 'picked',    label: 'Picked Up' },
  { id: 'refunded',  label: 'Refunded' },
  { id: 'rejected',  label: 'Rejected' },
];

export default function ReturnSection({ returns, showAlert }: any) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('all');

  const toggle = (id: string) => {
    setExpanded(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const counts = useMemo(() => ({
    all: returns.length,
    requested: returns.filter((r: ReturnItem) => r.status === 'REQUESTED').length,
    approved:  returns.filter((r: ReturnItem) => r.status === 'APPROVED').length,
    picked:    returns.filter((r: ReturnItem) => r.status === 'PICKED').length,
    refunded:  returns.filter((r: ReturnItem) => r.status === 'REFUNDED').length,
    rejected:  returns.filter((r: ReturnItem) => r.status === 'REJECTED').length,
  }), [returns]);

  const filtered = useMemo(() =>
    activeTab === 'all' ? returns : returns.filter((r: ReturnItem) => r.status === activeTab.toUpperCase()),
    [returns, activeTab]
  );

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const fmtCurrency = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);

  if (!returns || returns.length === 0) {
    return (
      <div className="p-6 sm:p-8">
        <div className="mb-7">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-0.5">Your</p>
          <h2 className="text-xl font-semibold text-[#1a1a1a]">Returns</h2>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[#e8e4de] to-transparent mb-7" />
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <RefreshCw size={36} className="text-[#d4cfc8]" />
          <p className="text-sm font-light text-[#888]">No returns yet</p>
          <p className="text-xs text-[#bbb] text-center max-w-xs">Returns can be requested from your Orders section for eligible items.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">

      <div className="mb-7">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-0.5">Your</p>
        <h2 className="text-xl font-semibold text-[#1a1a1a]">Returns</h2>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#e8e4de] to-transparent mb-7" />

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#e8e4de] mb-6 overflow-x-auto">
        {TABS.map(tab => {
          const count = counts[tab.id as keyof typeof counts];
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-[10px] tracking-[0.1em] uppercase font-semibold border-b-2 -mb-px whitespace-nowrap transition-colors ${
                active ? 'border-[#1a1a1a] text-[#1a1a1a]' : 'border-transparent text-[#888] hover:text-[#555]'
              }`}>
              {tab.label}
              {count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-bold ${active ? 'bg-[#1a1a1a] text-white' : 'bg-[#f0ece6] text-[#888]'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Items */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <RefreshCw size={28} className="text-[#d4cfc8]" />
          <p className="text-sm font-light text-[#888]">No {activeTab !== 'all' ? activeTab : ''} returns</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item: ReturnItem) => {
            const isOpen    = expanded.has(item.id);
            const retItem   = item.order.items.find(i => i.product.id === item.product.id);
            const statusMsg = STATUS_MSGS[item.status];
            const timeline  = buildTimeline(item);

            return (
              <div key={item.id} className="border border-[#e8e4de] rounded-sm overflow-hidden">
                {/* Header row */}
                <button
                  className="w-full flex items-start justify-between p-4 hover:bg-[#faf9f7] transition-colors text-left"
                  onClick={() => toggle(item.id)}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <img src={item.product.primaryImage1} alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-sm border border-[#e8e4de] flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#1a1a1a] line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] text-[#aaa] mt-0.5 font-mono">#{item.orderId.slice(0, 10)}…</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <StatusBadge status={item.status} />
                        {item.amount > 0 && (
                          <span className="text-[10px] text-[#27ae60] font-semibold">{fmtCurrency(item.amount)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    {isOpen ? <ChevronUp size={15} className="text-[#aaa]" /> : <ChevronDown size={15} className="text-[#aaa]" />}
                  </div>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="border-t border-[#f0ece6] bg-[#faf9f7] p-4 space-y-4">

                    {/* Reason */}
                    <div>
                      <p className="text-[9px] tracking-[0.14em] uppercase font-semibold text-[#aaa] mb-1">Reason</p>
                      <p className="text-sm text-[#555] leading-relaxed">{item.reason}</p>
                    </div>

                    {/* Item detail */}
                    {retItem && (
                      <div>
                        <p className="text-[9px] tracking-[0.14em] uppercase font-semibold text-[#aaa] mb-2">Returned Item</p>
                        <div className="flex items-center gap-3 bg-white border border-[#e8e4de] rounded-sm p-3">
                          <img src={retItem.product.primaryImage1} alt={retItem.product.name}
                            className="w-12 h-12 object-cover rounded-sm border border-[#e8e4de]" />
                          <div>
                            <p className="text-sm font-medium text-[#1a1a1a]">{retItem.product.name}</p>
                            <p className="text-xs text-[#888] mt-0.5">Qty: {retItem.quantity} · {fmtCurrency(retItem.price)}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Timeline — built from the return's own stage timestamps, not the order's */}
                    <div>
                      <p className="text-[9px] tracking-[0.14em] uppercase font-semibold text-[#aaa] mb-2">Timeline</p>
                      <div className="space-y-2">
                        {timeline.map((step, idx) => (
                          <div key={step.key} className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ background: TIMELINE_BG[step.key].bg, border: `1px solid ${TIMELINE_BG[step.key].border}` }}>
                              {TIMELINE_ICON[step.key]}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-[#1a1a1a]">{step.label}</p>
                              <p className="text-[10px] text-[#aaa]">{fmtDate(step.date)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status message */}
                    {statusMsg && (
                      <div className="p-3 rounded-sm border text-xs leading-relaxed"
                        style={{ background: statusMsg.bg, borderColor: statusMsg.border, color: statusMsg.text }}>
                        {statusMsg.body}
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
  );
}