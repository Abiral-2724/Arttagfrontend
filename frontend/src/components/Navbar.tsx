'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Search, ShoppingCart, User, Menu, X, ChevronRight, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const navItems = [
  {
    name: 'Travel & Lifestyle',
    eyebrow: 'Explore the Collection',
    image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/f_auto,q_auto,w_400/v1773209284/IMG_5611_wygjc4.jpg',
    items: [
      { name: 'Travel Bags',  link: '/product/category/88b6c5ef-5ab0-41b8-97fb-c2099be6fb13/subcategory/2bcf9905-3bb2-4eb9-92f2-a9bb43015959/TECH%20ACCESSORIES' },
      { name: 'Sling Bags',   link: '/product/category/88b6c5ef-5ab0-41b8-97fb-c2099be6fb13/subcategory/2df4bd6f-a8e8-4aec-97e7-f014bef4dab1/TECH%20ACCESSORIES' },
      { name: 'Tote Bags',    link: '/product/category/88b6c5ef-5ab0-41b8-97fb-c2099be6fb13/subcategory/22da583b-23c7-446f-869b-674998ecc54f/TECH%20ACCESSORIES' },
      { name: 'Sports Bags',  link: '/product/category/88b6c5ef-5ab0-41b8-97fb-c2099be6fb13/subcategory/932e3c8a-d458-4f0c-bbf2-7da238a46a3b/TECH%20ACCESSORIES' },
    ],
    id: '88b6c5ef-5ab0-41b8-97fb-c2099be6fb13',
  },
  {
    name: 'Backpacks',
    eyebrow: 'Carry Everything',
    image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/f_auto,q_auto,w_400/v1773209479/IMG_5592_fms8zt.jpg',
    items: [
      { name: 'Laptop Backpacks',  link: '/product/category/6be4fe65-560d-4c66-8aa8-e5a478e02632/subcategory/724675b8-811c-42aa-ac9b-d1e52c3223ec/BAGS%20&%20WALLETS' },
      { name: 'School Backpacks',  link: '/product/category/6be4fe65-560d-4c66-8aa8-e5a478e02632/subcategory/3e3a56aa-b8d7-412b-8d37-399139cace76/BAGS%20&%20WALLETS' },
      { name: 'College Backpacks', link: '/product/category/6be4fe65-560d-4c66-8aa8-e5a478e02632/subcategory/017079fa-b6fb-40d1-8c2e-f582dab7fba7/BAGS%20&%20WALLETS' },
      { name: 'Travel Backpacks',  link: '/product/category/6be4fe65-560d-4c66-8aa8-e5a478e02632/subcategory/172af898-c565-4987-b715-a8d1fb1ad776/BAGS%20&%20WALLETS' },
    ],
    id: '6be4fe65-560d-4c66-8aa8-e5a478e02632',
  },
  {
    name: 'Work Bags',
    eyebrow: 'Built for Professionals',
    image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/f_auto,q_auto,w_400/v1773209386/IMG_5609_zjwnfq.jpg',
    items: [
      { name: 'Office Bags',      link: '/product/category/d7928347-cf87-4f84-ac22-71614aa6e629/subcategory/ac53bff1-72ff-4587-8eb5-7435a0892ec1/WORK%20ESSENTIALS' },
      { name: 'Laptop Sleeves',   link: '/product/category/d7928347-cf87-4f84-ac22-71614aa6e629/subcategory/9b29784b-655c-40a5-a6d6-9fbdeef208b5/WORK%20ESSENTIALS' },
      { name: 'Messenger Bags',   link: '/product/category/d7928347-cf87-4f84-ac22-71614aa6e629/subcategory/f7d95b01-3279-4b59-aa28-20f249d2d508/WORK%20ESSENTIALS' },
    ],
    id: 'd7928347-cf87-4f84-ac22-71614aa6e629',
  },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const Navbar = ({ page }: any) => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('arttagtoken');
    const id = localStorage.getItem('arttagUserId');
    if (token && id) {
      setUserId(id);
      setIsAuthenticated(true);
      checkAdmin(id);
      fetchCartCount(id);
    }
  }, []);

  const checkAdmin = async (id: string) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/user/${id}/get/profile`);
      if (res.data.user.role === 'ADMIN') setIsAdmin(true);
    } catch {}
  };

  const fetchCartCount = async (id: string) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/cart/${id}/get/product/total/count`);
      if (res.data.success) setCartCount(res.data.totalCount);
    } catch {}
  };

  const openDropdown = (idx: number) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(idx);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 120);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const handleCartClick    = () => router.push(userId ? `/${userId}/cart`    : '/login');
  const handleProfileClick = () => router.push(userId ? `/${userId}/profile` : '/login');
  const handleLoginClick   = () => router.push('/login');
  const handleAdminPage    = () => { if (userId) router.push(`/${userId}/admin`); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .nb-root { font-family: 'DM Sans', sans-serif; }
        .nb-serif { font-family: 'Cormorant Garamond', serif; }

        /* Nav link underline animation */
        .nb-navlink {
          position: relative;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #3a3a3a;
          transition: color 0.2s;
          padding-bottom: 2px;
        }
        .nb-navlink::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 1px;
          background: #1a1a1a;
          transition: width 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        .nb-navlink:hover { color: #1a1a1a; }
        .nb-navlink:hover::after,
        .nb-navlink.active::after { width: 100%; }

        /* Mega dropdown */
        .nb-mega {
          position: absolute;
          top: calc(100% + 1px);
          left: 50%;
          transform: translateX(-50%);
          width: 520px;
          background: #fff;
          border: 1px solid #e8e4de;
          border-top: 2px solid #1a1a1a;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08);
          padding: 0;
          opacity: 0;
          pointer-events: none;
          transform: translateX(-50%) translateY(8px);
          transition: opacity 0.22s ease, transform 0.22s ease;
          z-index: 100;
        }
        .nb-mega.open {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }
        .nb-mega-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 0;
          font-size: 13px;
          font-weight: 400;
          color: #4a4a4a;
          border-bottom: 1px solid #f2efe9;
          transition: color 0.15s, padding-left 0.15s;
          cursor: pointer;
        }
        .nb-mega-link:last-child { border-bottom: none; }
        .nb-mega-link:hover { color: #1a1a1a; padding-left: 4px; }
        .nb-mega-link svg { opacity: 0; transition: opacity 0.15s; }
        .nb-mega-link:hover svg { opacity: 1; }

        /* Icon button */
        .nb-icon {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px;
          color: #4a4a4a;
          border-radius: 50%;
          transition: background 0.15s, color 0.15s;
          position: relative;
        }
        .nb-icon:hover { background: #f5f3ef; color: #1a1a1a; }

        /* Cart badge */
        .nb-badge {
          position: absolute;
          top: 1px; right: 1px;
          width: 16px; height: 16px;
          background: #1a1a1a;
          color: #fff;
          font-size: 9px;
          font-weight: 700;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid #fff;
        }

        /* Mobile menu item */
        .nb-mob-cat {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          border-bottom: 1px solid #f0ede8;
          cursor: pointer;
          transition: background 0.15s;
        }
        .nb-mob-cat:hover { background: #faf9f7; }
        .nb-mob-sub {
          background: #faf9f7;
          border-bottom: 1px solid #f0ede8;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.3s ease;
        }
        .nb-mob-sub.open { max-height: 400px; }
        .nb-mob-sub-link {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 24px 12px 36px;
          font-size: 13px;
          color: #5a5a5a;
          border-bottom: 1px solid #f0ede8;
          transition: color 0.15s, background 0.15s;
        }
        .nb-mob-sub-link:last-child { border-bottom: none; }
        .nb-mob-sub-link:hover { color: #1a1a1a; background: #f0ede8; }
      `}</style>

      <header className="nb-root bg-white sticky top-0 z-50" style={{ borderBottom: '1px solid #e8e4de' }}>

        {/* ── Top bar (optional promo strip) ── */}
        <div style={{ background: '#1a1a1a', color: '#e8e4de', textAlign: 'center', fontSize: '11px', letterSpacing: '0.18em', padding: '7px 0', fontWeight: 500 }}>
          FREE SHIPPING ON ORDERS ABOVE ₹999 &nbsp;·&nbsp; USE CODE <span style={{ color: '#fff', fontWeight: 700 }}>ARTTAG10</span>
        </div>

        {/* ── Main bar ── */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

            {/* Logo */}
            <Link href="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 54" style={{ height: '44px', width: 'auto' }}>
                <defs>
                  <style>{`.st0{font-family:MuktaMahee-Regular,'Mukta Mahee';font-size:49.69px;}`}</style>
                </defs>
                <g>
                  <path d="M62.85,33.21c.11,0,.17.04.19.21.2,1.7-.04,4.05-.01,5.84,0,.44.01.95-.3,1.15-.34.21-1.72-.06-2.18-.12-14.77-1.86-19.13-21.03-6.37-28.96,3.44-2.14,5.73-2.15,9.65-2.25.57-.01,1.26,0,1.76.06-2.15,2.88-1.5,7.52,2.16,8.77,1.53.52,2.98.08,4.52.4v21.62c0,.2-.1.41-.29.49h-6.67c-.08,0-.16-.03-.22-.09-.06-.06-.09-.14-.09-.22v-20.52c0-.35-.19-.72-.24-.86-1.18-3.54-5.67-2.47-7.9-.6-4.54,3.81-3.78,11.34,1.53,14.02.34.17,1.24.75,2.41.87l2.06.2Z" />
                  <path d="M68.98,16.48c-.15,0-.29-.02-.44-.05-1.63-.42-2.77-2.4-2.6-4.02.15-1.44,1.7-3.34,3.22-3.34h20.4c.15,0,.17.11.18.44v6.66c0,.08-.03.16-.09.22-.06.06-.14.09-.22.09h-20.45Z" />
                  <path d="M73.96,40.29v-21.62c0-.2.1-.41.29-.49h6.67c.08,0,.16.03.22.09.06.06.09.14.09.22v18.21c.03.76-.62,1.51-.8,1.75-1.53,2.1-4.13,2.17-6.49,1.83Z" />
                </g>
              </svg>
            </Link>

            {/* Desktop nav */}
            {page !== 'cart' && (
              <nav style={{ display: 'flex', alignItems: 'center', gap: '40px' }} className="hidden xl:flex">
                {navItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => openDropdown(idx)}
                    onMouseLeave={scheduleClose}
                  >
                    <button className={`nb-navlink ${activeDropdown === idx ? 'active' : ''}`}>
                      {item.name}
                    </button>

                    {/* Mega dropdown */}
                    <div
                      className={`nb-mega ${activeDropdown === idx ? 'open' : ''}`}
                      onMouseEnter={cancelClose}
                      onMouseLeave={scheduleClose}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px' }}>
                        {/* Left: links */}
                        <div style={{ padding: '28px 32px' }}>
                          <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#aaa', marginBottom: '16px' }}>
                            {item.eyebrow}
                          </p>
                          <div>
                            {item.items.map((sub, si) => (
                              <Link key={si} href={sub.link} onClick={() => setActiveDropdown(null)}>
                                <div className="nb-mega-link">
                                  <span>{sub.name}</span>
                                  <ChevronRight size={13} />
                                </div>
                              </Link>
                            ))}
                          </div>
                          <Link href={`/product/category/${item.id}`} onClick={() => setActiveDropdown(null)}>
                            <div style={{ marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1a1a1a', borderBottom: '1px solid #1a1a1a', paddingBottom: '1px' }}>
                              View All <ChevronRight size={11} />
                            </div>
                          </Link>
                        </div>

                        {/* Right: category image */}
                        <div style={{ position: 'relative', overflow: 'hidden' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)' }} />
                          <p className="nb-serif" style={{ position: 'absolute', bottom: '14px', left: '14px', right: '14px', color: '#fff', fontSize: '18px', fontWeight: 400, lineHeight: 1.2 }}>
                            {item.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Static links */}
                <Link href="/corporateGifting">
                  <span className="nb-navlink">Corporate</span>
                </Link>
              </nav>
            )}

            {/* Desktop icons */}
            <div className="hidden md:flex items-center" style={{ gap: '4px' }}>
              {page !== 'cart' && (
                <Link href="/search">
                  <button className="nb-icon"><Search size={18} strokeWidth={1.6} /></button>
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  {page !== 'cart' && (
                    <button className="nb-icon" onClick={handleCartClick}>
                      <ShoppingCart size={18} strokeWidth={1.6} />
                      {cartCount > 0 && <span className="nb-badge">{cartCount}</span>}
                    </button>
                  )}
                  <button className="nb-icon" onClick={handleProfileClick}>
                    <User size={18} strokeWidth={1.6} />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={handleAdminPage}
                      style={{ marginLeft: '8px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', background: '#1a1a1a', color: '#fff', padding: '8px 18px', border: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#333')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#1a1a1a')}
                    >
                      Admin
                    </button>
                  )}
                </>
              ) : (
                <div style={{ position: 'relative', display: 'inline-block' }} className="group">
                  <button className="nb-icon" onClick={handleLoginClick}>
                    <UserRound size={18} strokeWidth={1.6} />
                  </button>
                  <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', background: '#1a1a1a', color: '#fff', fontSize: '11px', letterSpacing: '0.1em', padding: '5px 10px', whiteSpace: 'nowrap', pointerEvents: 'none' }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity">
                    Sign In
                  </div>
                </div>
              )}
            </div>

            {/* Mobile: cart + hamburger */}
            <div className="flex md:hidden items-center gap-3">
              {isAuthenticated && page !== 'cart' && (
                <button className="nb-icon" onClick={handleCartClick}>
                  <ShoppingCart size={18} strokeWidth={1.6} />
                  {cartCount > 0 && <span className="nb-badge">{cartCount}</span>}
                </button>
              )}
              <button className="nb-icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X size={20} strokeWidth={1.6} /> : <Menu size={20} strokeWidth={1.6} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileMenuOpen && (
          <div className="md:hidden" style={{ background: '#fff', borderTop: '1px solid #e8e4de', maxHeight: 'calc(100vh - 110px)', overflowY: 'auto' }}>

            {/* Categories */}
            {page !== 'cart' && navItems.map((item, idx) => (
              <div key={idx}>
                <div className="nb-mob-cat" onClick={() => setExpandedCategory(expandedCategory === idx ? null : idx)}>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1a1a1a' }}>{item.name}</p>
                    <p style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{item.items.length} styles</p>
                  </div>
                  <ChevronRight
                    size={16}
                    style={{ color: '#aaa', transition: 'transform 0.2s', transform: expandedCategory === idx ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  />
                </div>

                <div className={`nb-mob-sub ${expandedCategory === idx ? 'open' : ''}`}>
                  {item.items.map((sub, si) => (
                    <Link key={si} href={sub.link} onClick={() => setMobileMenuOpen(false)}>
                      <div className="nb-mob-sub-link">
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ccc', flexShrink: 0 }} />
                        {sub.name}
                      </div>
                    </Link>
                  ))}
                  <Link href={`/product/category/${item.id}`} onClick={() => setMobileMenuOpen(false)}>
                    <div className="nb-mob-sub-link" style={{ fontWeight: 600, color: '#1a1a1a' }}>
                      <ChevronRight size={13} />
                      View All {item.name}
                    </div>
                  </Link>
                </div>
              </div>
            ))}

            {/* Corporate link */}
            <Link href="/corporateGifting" onClick={() => setMobileMenuOpen(false)}>
              <div className="nb-mob-cat">
                <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1a1a1a' }}>Corporate Gifting</p>
                <ChevronRight size={16} style={{ color: '#aaa' }} />
              </div>
            </Link>

            {/* Bottom actions */}
            <div style={{ padding: '20px 24px', borderTop: '1px solid #e8e4de', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {page !== 'cart' && (
                <Link href="/search" onClick={() => setMobileMenuOpen(false)}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '13px 16px', border: '1px solid #e8e4de', background: '#faf9f7', fontSize: '13px', fontWeight: 500, color: '#3a3a3a', cursor: 'pointer' }}>
                    <Search size={15} /> Search Products
                  </button>
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => { handleProfileClick(); setMobileMenuOpen(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '13px 16px', border: '1px solid #e8e4de', background: '#faf9f7', fontSize: '13px', fontWeight: 500, color: '#3a3a3a', cursor: 'pointer' }}
                  >
                    <User size={15} /> My Profile
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => { handleAdminPage(); setMobileMenuOpen(false); }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '13px 16px', background: '#1a1a1a', color: '#fff', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', border: 'none' }}
                    >
                      Admin Panel
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => { handleLoginClick(); setMobileMenuOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '14px 16px', background: '#1a1a1a', color: '#fff', fontSize: '12px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', border: 'none' }}
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;