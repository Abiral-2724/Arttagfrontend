'use client'
import React, { useState } from 'react';
import { ShieldCheck, Clock, ChevronDown, AlertCircle, Copy, CheckCircle2 } from 'lucide-react';

/* ─────────────────────────────────────────────
   STATUS CONFIG — mirrors backend WarrantyStatus enum
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

type WarrantyClaimSectionProps = {
  warrantyClaims: any[];
  showAlert: (message: string, type?: 'success' | 'error') => void;
};

const WarrantyClaimSection = ({ warrantyClaims, showAlert }: WarrantyClaimSectionProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showAlert('Could not copy Claim ID', 'error');
    }
  };

  return (
    <div>
      <style>{`
        .wcs-divider { height: 1px; background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent); }
        .wcs-status {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 3px 9px;
          border-radius: 2px; border: 1px solid; white-space: nowrap;
        }
        .wcs-copy-btn {
          width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;
          border: 1px solid #e8e4de; border-radius: 2px; background: #faf9f7;
          cursor: pointer; color: #aaa; transition: all 0.15s; flex-shrink: 0;
        }
        .wcs-copy-btn:hover { border-color: #1a1a1a; color: #1a1a1a; background: #fff; }
        .wcs-row { border-bottom: 1px solid #f0ece6; }
        .wcs-row:last-child { border-bottom: none; }
        .wcs-row-header { padding: 16px 20px; cursor: pointer; transition: background 0.12s; }
        .wcs-row-header:hover { background: #faf9f7; }
        .wcs-timeline-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
      `}</style>

      <div className="px-6 sm:px-8 py-6 border-b border-[#e8e4de]">
        <p className="text-[10px] tracking-[0.22em] uppercase text-[#888] mb-1">Support</p>
        <h2 className="text-2xl font-light text-[#1a1a1a]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Warranty Claims
        </h2>
        <p className="text-sm text-[#888] mt-1">Track the status of claims you've submitted.</p>
      </div>

      {warrantyClaims.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <ShieldCheck size={32} className="text-[#d4cfc8]" />
          <p className="text-lg font-light text-[#888]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            No warranty claims yet
          </p>
          <p className="text-xs text-[#bbb]">Claims you submit will show up here.</p>
        </div>
      ) : (
        <div>
          {warrantyClaims.map((claim: any) => {
            const sm = STATUS_META[claim.status] || STATUS_META.CLAIM_RECEIVED;
            const isOpen = expandedId === claim.claimId;
            return (
              <div key={claim.claimId} className="wcs-row">
                <div className="wcs-row-header flex items-center justify-between gap-3" onClick={() => setExpandedId(isOpen ? null : claim.claimId)}>
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-[#444]">{claim.claimId}</span>
                        <button
                          className="wcs-copy-btn"
                          onClick={(e) => { e.stopPropagation(); handleCopy(claim.claimId); }}
                          title="Copy Claim ID"
                        >
                          {copiedId === claim.claimId ? <CheckCircle2 size={11} className="text-[#27ae60]" /> : <Copy size={11} />}
                        </button>
                      </div>
                      <p className="text-sm text-[#1a1a1a] font-medium truncate mt-1">{claim.productName}</p>
                      <p className="text-[11px] text-[#aaa]">{claim.productModel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="wcs-status" style={{ color: sm.text, background: sm.bg, borderColor: sm.border }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: sm.dot }} />
                      {sm.label}
                    </span>
                    <ChevronDown size={15} className={`text-[#aaa] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {isOpen && (
                  <div className="px-6 sm:px-8 pb-6">
                    <div className="wcs-divider mb-4" />
                    <p className="text-[10px] tracking-[0.14em] uppercase text-[#aaa] font-semibold mb-3 flex items-center gap-1.5">
                      <Clock size={11} /> Status Timeline
                    </p>
                    <div className="space-y-4">
                      {claim.history?.map((h: any, i: number) => {
                        const hsm = STATUS_META[h.status] || STATUS_META.CLAIM_RECEIVED;
                        return (
                          <div key={i} className="flex gap-3">
                            <div className="wcs-timeline-dot" style={{ background: hsm.dot }} />
                            <div>
                              <p className="text-sm text-[#1a1a1a] font-medium">{hsm.label}</p>
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WarrantyClaimSection;