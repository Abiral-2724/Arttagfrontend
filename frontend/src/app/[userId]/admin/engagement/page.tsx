'use client'
import React, { useState, useEffect, useMemo } from 'react';
import {
  Heart, ShoppingCart, Users, TrendingUp, Search,
  ChevronDown, ChevronUp, X, Phone, Mail, User,
  Package, ArrowUpRight, Calendar, Hash
} from 'lucide-react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface UserDetail {
  id: string;
  name: string | null;
  email: string | null;
  phoneNumber: string;
  addedAt: string;
  quantity?: number;
}

interface ProductEngagement {
  id: string;
  name: string;
  image: string;
  discountPrice: number;
  originalPrice: number;
  wishlistCount: number;
  cartCount: number;
  wishlistUsers: UserDetail[];
  cartUsers: UserDetail[];
}

type DrawerType = 'wishlist' | 'cart' | null;

/* ─────────────────────────────────────────────
   USER DRAWER
───────────────────────────────────────────── */
const UserDrawer = ({
  open, onClose, users, title, type
}: {
  open: boolean;
  onClose: () => void;
  users: UserDetail[];
  title: string;
  type: DrawerType;
}) => {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const accent = type === 'wishlist'
    ? { bg: '#fdecea', text: '#922b21', border: '#f5b7b1', dot: '#c0392b' }
    : { bg: '#eafaf1', text: '#1e8449', border: '#a9dfbf', dot: '#27ae60' };

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <div
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col"
        style={{
          width: 'min(420px, 100vw)',
          background: '#faf9f7',
          borderLeft: '1px solid #e8e4de',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8e4de', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#aaa', marginBottom: 4 }}>
                {type === 'wishlist' ? 'Wishlist' : 'Cart'} · Users
              </p>
              <h2 style={{ fontSize: 18, fontWeight: 400, color: '#1a1a1a', lineHeight: 1.3 }}>{title}</h2>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32, height: 32, border: '1px solid #e8e4de', borderRadius: 3,
                background: '#faf9f7', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >
              <X size={14} color="#888" />
            </button>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            marginTop: 12, padding: '4px 10px', borderRadius: 3,
            background: accent.bg, border: `1px solid ${accent.border}`,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent.dot }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: accent.text, letterSpacing: '0.08em' }}>
              {users.length} user{users.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* User list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px' }}>
          {users.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#bbb' }}>
              <Users size={32} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
              <p style={{ fontSize: 14, fontWeight: 300 }}>No users yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {users.map((u, i) => (
                <div
                  key={u.id}
                  style={{
                    background: '#fff', border: '1px solid #e8e4de', borderRadius: 4,
                    padding: '14px 16px',
                    animation: `slideIn 0.25s ease both`,
                    animationDelay: `${Math.min(i * 40, 400)}ms`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: '#f5f3ef', border: '1px solid #e8e4de',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <User size={15} color="#888" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 1 }}>
                        {u.name || 'Unnamed User'}
                      </p>
                      <p style={{ fontSize: 10, letterSpacing: '0.06em', color: '#aaa' }}>
                        ID: {u.id.slice(0, 8)}…
                      </p>
                    </div>
                    {type === 'cart' && u.quantity && u.quantity > 1 && (
                      <div style={{
                        marginLeft: 'auto', background: '#f5f3ef', border: '1px solid #e8e4de',
                        borderRadius: 3, padding: '2px 8px', flexShrink: 0,
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#888' }}>
                          ×{u.quantity}
                        </span>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {u.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <Mail size={11} color="#bbb" />
                        <span style={{ fontSize: 12, color: '#666', wordBreak: 'break-all' }}>{u.email}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <Phone size={11} color="#bbb" />
                      <span style={{ fontSize: 12, color: '#666' }}>{u.phoneNumber}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <Calendar size={11} color="#bbb" />
                      <span style={{ fontSize: 12, color: '#aaa' }}>
                        {new Date(u.addedAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   PRODUCT ROW
───────────────────────────────────────────── */
const ProductRow = ({
  product, index, onOpenDrawer
}: {
  product: ProductEngagement;
  index: number;
  onOpenDrawer: (type: DrawerType, product: ProductEngagement) => void;
}) => {
  const engagement = product.wishlistCount + product.cartCount;

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e8e4de',
        borderRadius: 4,
        padding: '16px 20px',
        display: 'grid',
        gridTemplateColumns: '28px 56px 1fr auto auto',
        alignItems: 'center',
        gap: 16,
        animation: `fadeUp 0.3s ease both`,
        animationDelay: `${Math.min(index * 40, 600)}ms`,
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Rank */}
      <span style={{ fontSize: 12, fontWeight: 600, color: '#ccc', fontFamily: 'monospace', textAlign: 'center' }}>
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Image */}
      <div style={{
        width: 56, height: 56, borderRadius: 3, overflow: 'hidden',
        border: '1px solid #e8e4de', flexShrink: 0,
        background: '#f5f3ef',
      }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      {/* Name + price */}
      <div style={{ minWidth: 0 }}>
        <p style={{
          fontSize: 14, fontWeight: 500, color: '#1a1a1a',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          marginBottom: 3,
        }}>
          {product.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>
            ₹{product.discountPrice.toLocaleString('en-IN')}
          </span>
          {product.originalPrice > product.discountPrice && (
            <span style={{ fontSize: 11, color: '#bbb', textDecoration: 'line-through' }}>
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
          {engagement > 0 && (
            <span style={{
              fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#888', background: '#f5f3ef', border: '1px solid #e8e4de',
              borderRadius: 2, padding: '2px 6px', fontWeight: 600,
            }}>
              {engagement} interactions
            </span>
          )}
        </div>
      </div>

      {/* Wishlist button */}
      <button
        onClick={() => onOpenDrawer('wishlist', product)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: product.wishlistCount > 0 ? '#fdecea' : '#f5f3ef',
          border: `1px solid ${product.wishlistCount > 0 ? '#f5b7b1' : '#e8e4de'}`,
          borderRadius: 3, padding: '8px 14px', cursor: 'pointer',
          transition: 'all 0.15s', flexShrink: 0,
        }}
        onMouseEnter={e => {
          (e.currentTarget.style.borderColor) = product.wishlistCount > 0 ? '#c0392b' : '#1a1a1a';
        }}
        onMouseLeave={e => {
          (e.currentTarget.style.borderColor) = product.wishlistCount > 0 ? '#f5b7b1' : '#e8e4de';
        }}
      >
        <Heart size={14} color={product.wishlistCount > 0 ? '#c0392b' : '#bbb'}
          fill={product.wishlistCount > 0 ? '#c0392b' : 'none'} />
        <span style={{
          fontSize: 13, fontWeight: 600,
          color: product.wishlistCount > 0 ? '#922b21' : '#bbb',
        }}>
          {product.wishlistCount}
        </span>
        {product.wishlistCount > 0 && (
          <ArrowUpRight size={11} color="#c0392b" />
        )}
      </button>

      {/* Cart button */}
      <button
        onClick={() => onOpenDrawer('cart', product)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: product.cartCount > 0 ? '#eafaf1' : '#f5f3ef',
          border: `1px solid ${product.cartCount > 0 ? '#a9dfbf' : '#e8e4de'}`,
          borderRadius: 3, padding: '8px 14px', cursor: 'pointer',
          transition: 'all 0.15s', flexShrink: 0,
        }}
        onMouseEnter={e => {
          (e.currentTarget.style.borderColor) = product.cartCount > 0 ? '#27ae60' : '#1a1a1a';
        }}
        onMouseLeave={e => {
          (e.currentTarget.style.borderColor) = product.cartCount > 0 ? '#a9dfbf' : '#e8e4de';
        }}
      >
        <ShoppingCart size={14} color={product.cartCount > 0 ? '#27ae60' : '#bbb'} />
        <span style={{
          fontSize: 13, fontWeight: 600,
          color: product.cartCount > 0 ? '#1e8449' : '#bbb',
        }}>
          {product.cartCount}
        </span>
        {product.cartCount > 0 && (
          <ArrowUpRight size={11} color="#27ae60" />
        )}
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function ProductEngagementPage() {
  const { userId } = useParams();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [products, setProducts] = useState<ProductEngagement[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [sortBy, setSortBy]     = useState<'engagement' | 'wishlist' | 'cart'>('engagement');

  const [drawer, setDrawer] = useState<{
    open: boolean; type: DrawerType; product: ProductEngagement | null;
  }>({ open: false, type: null, product: null });

  useEffect(() => {
    fetch(`${API_BASE_URL}/analytics/product-engagement`)
      .then(r => r.json())
      .then(d => { if (d.success) setProducts(d.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }
    if (sortBy === 'wishlist') list.sort((a, b) => b.wishlistCount - a.wishlistCount);
    else if (sortBy === 'cart') list.sort((a, b) => b.cartCount - a.cartCount);
    else list.sort((a, b) => (b.wishlistCount + b.cartCount) - (a.wishlistCount + a.cartCount));
    return list;
  }, [products, search, sortBy]);

  const totalWishlists = products.reduce((s, p) => s + p.wishlistCount, 0);
  const totalCarts     = products.reduce((s, p) => s + p.cartCount, 0);
  const topProduct     = products[0];

  const openDrawer = (type: DrawerType, product: ProductEngagement) => {
    setDrawer({ open: true, type, product });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f7', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .eng-search:focus { outline: none; border-color: #1a1a1a !important; }
        .eng-sort-btn { transition: all 0.15s; }
        .eng-sort-btn:hover { border-color: #1a1a1a !important; color: #1a1a1a !important; }

        .skel {
          background: linear-gradient(90deg, #f5f3ef 0%, #ece9e3 50%, #f5f3ef 100%);
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
          border-radius: 4px;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e8e4de; border-radius: 2px; }
      `}</style>

      <Navbar />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 28, animation: 'fadeUp 0.3s ease both' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#aaa', marginBottom: 6 }}>
            Admin · Analytics
          </p>
          <h1 style={{ fontSize: 30, fontWeight: 300, color: '#1a1a1a', marginBottom: 6 }}>
            Product Engagement
          </h1>
          <p style={{ fontSize: 13, color: '#888' }}>
            See which products users are saving to wishlists and adding to cart.
          </p>
        </div>

        <div style={{ height: 1, background: 'linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent)', marginBottom: 28 }} />

        {/* ── Stat cards ── */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28, animation: 'fadeUp 0.3s 0.05s ease both' }}>
          {[
            {
              label: 'Total Products', value: products.length,
              icon: <Package size={16} color="#888" />, color: '#1a1a1a',
            },
            {
              label: 'Total Wishlists', value: totalWishlists,
              icon: <Heart size={16} color="#c0392b" fill="#c0392b" />, color: '#c0392b',
            },
            {
              label: 'Total Cart Adds', value: totalCarts,
              icon: <ShoppingCart size={16} color="#27ae60" />, color: '#27ae60',
            },
            {
              label: 'Total Interactions', value: totalWishlists + totalCarts,
              icon: <TrendingUp size={16} color="#2980b9" />, color: '#2980b9',
            },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, minWidth: 140,
              background: '#fff', border: '1px solid #e8e4de', borderRadius: 4,
              padding: '14px 18px',
              transition: 'box-shadow 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                {s.icon}
                <p style={{ fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#aaa', fontWeight: 600 }}>
                  {s.label}
                </p>
              </div>
              <p style={{ fontSize: 28, fontWeight: 300, color: s.color, lineHeight: 1 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Most engaged product banner ── */}
        {!loading && topProduct && (
          <div style={{
            background: '#1a1a1a', borderRadius: 4, padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: 16,
            marginBottom: 24, flexWrap: 'wrap',
            animation: 'fadeUp 0.3s 0.1s ease both',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 3,
              overflow: 'hidden', flexShrink: 0, background: '#333',
            }}>
              <img src={topProduct.image} alt={topProduct.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#666', marginBottom: 3 }}>
                Most Engaged Product
              </p>
              <p style={{
                fontSize: 14, fontWeight: 500, color: '#fff',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {topProduct.name}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 20, fontWeight: 300, color: '#e74c3c' }}>{topProduct.wishlistCount}</p>
                <p style={{ fontSize: 9, color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase' }}>wishlists</p>
              </div>
              <div style={{ width: 1, background: '#333' }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 20, fontWeight: 300, color: '#2ecc71' }}>{topProduct.cartCount}</p>
                <p style={{ fontSize: 9, color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase' }}>cart adds</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Controls ── */}
        <div style={{
          display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
          marginBottom: 16, animation: 'fadeUp 0.3s 0.12s ease both',
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} color="#bbb" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              className="eng-search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              style={{
                width: '100%', padding: '9px 12px 9px 36px',
                border: '1px solid #e8e4de', borderRadius: 3,
                background: '#fff', fontSize: 13, color: '#1a1a1a',
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
          </div>

          {/* Sort */}
          {/* <div style={{ display: 'flex', gap: 6 }}>
            {([
              ['engagement', 'Most Engaged'],
              ['wishlist',   'By Wishlist'],
              ['cart',       'By Cart'],
            ] as const).map(([val, label]) => (
              <button
                key={val}
                className="eng-sort-btn"
                onClick={() => setSortBy(val)}
                style={{
                  padding: '8px 14px', fontSize: 10, fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  border: '1px solid',
                  borderColor: sortBy === val ? '#1a1a1a' : '#e8e4de',
                  borderRadius: 3, cursor: 'pointer',
                  background: sortBy === val ? '#1a1a1a' : '#fff',
                  color: sortBy === val ? '#fff' : '#888',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {label}
              </button>
            ))}
          </div> */}
        </div>

        {/* ── Table header labels ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '28px 56px 1fr auto auto',
          gap: 16, padding: '0 20px 8px',
        }}>
          {['#', '', 'Product', 'Wishlist', 'Cart'].map((h, i) => (
            <p key={i} style={{
              fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
              fontWeight: 600, color: '#bbb',
              textAlign: i === 0 ? 'center' : i >= 3 ? 'left' : 'left',
            }}>
              {h}
            </p>
          ))}
        </div>

        {/* ── Product list ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="skel" style={{ height: 88, animationDelay: `${i * 80}ms` }} />
            ))
          ) : filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 20px',
              background: '#fff', border: '1px solid #e8e4de', borderRadius: 4,
            }}>
              <Package size={36} color="#d4cfc8" style={{ margin: '0 auto 12px' }} />
              <p style={{ fontSize: 18, fontWeight: 300, color: '#888', marginBottom: 6 }}>
                {search ? 'No products match your search' : 'No products found'}
              </p>
              <p style={{ fontSize: 12, color: '#bbb' }}>
                {search ? 'Try a different search term' : 'Products will appear here once added'}
              </p>
            </div>
          ) : (
            filtered.map((p, i) => (
              <ProductRow key={p.id} product={p} index={i} onOpenDrawer={openDrawer} />
            ))
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <p style={{ textAlign: 'center', fontSize: 11, color: '#ccc', marginTop: 20 }}>
            Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          </p>
        )}

      </div>

      {/* ── User drawer ── */}
      <UserDrawer
        open={drawer.open}
        onClose={() => setDrawer({ open: false, type: null, product: null })}
        users={
          drawer.type === 'wishlist'
            ? (drawer.product?.wishlistUsers ?? [])
            : (drawer.product?.cartUsers ?? [])
        }
        title={drawer.product?.name ?? ''}
        type={drawer.type}
      />
    </div>
  );
}