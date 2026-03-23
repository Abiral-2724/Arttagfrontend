'use client'
import React, { useState } from 'react';
import {
  Package, Grid3x3, ShoppingCart, PinIcon, IndianRupeeIcon,
  TicketSlash, Undo2, Store, Gift, Wind, ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FooterPart from '@/components/FooterPart';

/* ─────────────────────────────────────────────
   NAV ITEMS
───────────────────────────────────────────── */
const NAV_ITEMS = (userId: any, router: any) => [
  {
    id: 'products',   label: 'Products',          sub: 'Manage product catalogue',
    icon: Package,    path: `/${userId}/admin/product`,
  },
  {
    id: 'categories', label: 'Categories',         sub: 'Organise store categories',
    icon: Grid3x3,    path: `/${userId}/admin/category`,
  },
  {
    id: 'orders',     label: 'Orders',             sub: 'Track & manage orders',
    icon: ShoppingCart, path: `/${userId}/admin/orders`,
  },
  {
    id: 'pincodes',   label: 'Pincodes',           sub: 'Delivery zone pincodes',
    icon: PinIcon,    path: `/${userId}/admin/pincode`,
  },
  {
    id: 'coupons',    label: 'Coupons',            sub: 'Promotional coupon codes',
    icon: IndianRupeeIcon, path: `/${userId}/admin/coupens`,
  },
  {
    id: 'refunds',    label: 'Refund Requests',    sub: 'Process payment refunds',
    icon: TicketSlash, path: `/${userId}/admin/refund`,
  },
  {
    id: 'returns',    label: 'Return Requests',    sub: 'Handle product returns',
    icon: Undo2,      path: `/${userId}/admin/return`,
  },
  {
    id: 'stores',     label: 'Store Locations',    sub: 'View & manage stores',
    icon: Store,      path: `/${userId}/admin/addstore`,
  },
  {
    id: 'gifting',    label: 'Corporate Gifting',  sub: 'Corporate gifting requests',
    icon: Gift,       path: `/${userId}/admin/gifting`,
  },
  {
    id: 'blogs',      label: 'Blogs',              sub: 'Create & manage blog posts',
    icon: Wind,       path: `/${userId}/admin/blog`,
  },
];

/* ─────────────────────────────────────────────
   SECTION GROUPINGS
───────────────────────────────────────────── */
const SECTIONS = [
  {
    heading: 'Catalogue',
    ids: ['products', 'categories'],
  },
  {
    heading: 'Commerce',
    ids: ['orders', 'refunds', 'returns'],
  },
  {
    heading: 'Promotions',
    ids: ['pincodes', 'coupons'],
  },
  {
    heading: 'Engage',
    ids: ['stores', 'gifting', 'blogs'],
  },
];

export default function AdminDashboard() {
  const { userId } = useParams();
  const router     = useRouter();

  const items = NAV_ITEMS(userId, router);
  const byId  = Object.fromEntries(items.map(i => [i.id, i]));

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .dash-serif { font-family: 'Cormorant Garamond', serif; }

        .dash-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }

        /* Nav card */
        .dash-card {
          background: #fff;
          border: 1px solid #e8e4de;
          border-radius: 2px;
          padding: 20px;
          cursor: pointer;
          transition: box-shadow 0.22s ease, border-color 0.22s ease, transform 0.22s ease;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          position: relative;
          overflow: hidden;
        }
        .dash-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          border-color: #d4cfc8;
          transform: translateY(-2px);
        }
        .dash-card:hover .dash-card-arrow { opacity: 1; transform: translate(0, 0); }
        .dash-card:hover .dash-card-icon { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }

        .dash-card-icon {
          width: 40px; height: 40px; border-radius: 2px;
          border: 1px solid #e8e4de; background: #f5f3ef;
          display: flex; align-items: center; justify-content: center;
          color: #888; transition: all 0.22s; flex-shrink: 0;
        }

        .dash-card-arrow {
          position: absolute; top: 16px; right: 16px;
          opacity: 0; transform: translate(-4px, 4px);
          transition: all 0.22s;
          color: #aaa;
        }

        /* Section heading */
        .dash-section-heading {
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 600;
          color: #aaa;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #f0ece6;
        }

        /* Welcome banner */
        .dash-banner {
          background: #1a1a1a;
          border-radius: 2px;
          padding: 32px 40px;
          color: #fff;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
        }
        .dash-banner::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: rgba(255,255,255,0.03);
        }
        .dash-banner::after {
          content: '';
          position: absolute;
          bottom: -60px; right: 60px;
          width: 280px; height: 280px;
          border-radius: 50%;
          background: rgba(255,255,255,0.02);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dash-fade { animation: fadeUp 0.4s ease both; }
        .dash-fade-1 { animation-delay: 0.05s; }
        .dash-fade-2 { animation-delay: 0.1s; }
        .dash-fade-3 { animation-delay: 0.15s; }
        .dash-fade-4 { animation-delay: 0.2s; }
      `}</style>

      <Navbar />

      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 lg:px-12 py-10">

        {/* ── Welcome banner ── */}
        <div className="dash-banner">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p className="text-[10px] tracking-[0.24em] uppercase text-[#888] mb-1">Admin Portal</p>
            <h1 className="dash-serif text-4xl sm:text-5xl font-light text-white leading-tight">
              Arttag Dashboard
            </h1>
            <p className="text-[#666] text-sm mt-2">Welcome back. Use the sections below to manage your store.</p>
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="dash-divider" style={{ background: 'rgba(255,255,255,0.08)', marginBottom: 0 }} />
          </div>
        </div>

        {/* ── Section groups ── */}
        <div className="space-y-10">
          {SECTIONS.map((section, si) => (
            <div key={section.heading} className={`dash-fade dash-fade-${si + 1}`}>
              <p className="dash-section-heading">{section.heading}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.ids.map(id => {
                  const item = byId[id];
                  if (!item) return null;
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="dash-card"
                      onClick={() => router.push(item.path)}
                    >
                      <div className="dash-card-icon">
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1a1a1a]">{item.label}</p>
                        <p className="text-xs text-[#888] mt-0.5 leading-relaxed">{item.sub}</p>
                      </div>
                      <div className="dash-card-arrow">
                        <ArrowUpRight size={14} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom divider ── */}
        <div className="dash-divider mt-12" />
      </div>

      <FooterPart />
    </div>
  );
}