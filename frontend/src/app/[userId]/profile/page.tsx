'use client'
import React, { useState, useEffect } from 'react';
import {
  User, Package, MapPin, Heart, LogOut, ChevronRight,
  CheckCircle2, RefreshCw, AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import PersonalInfoSection from '@/components/PersonalInfoSection';
import AddressSection from '@/components/AddressSection';
import OrderSection from '@/components/OrderSection';
import WishlistSection from '@/components/WishlistSection';
import LogoutSection from '@/components/LogoutSection';
import ReturnSection from '@/components/Return';
import Link from 'next/link';
import WarrantyClaimSection from '@/components/WarrantyClaimSection';
import FooterPart from '@/components/FooterPart';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const MENU = [
  { id: 'personal', label: 'Personal Info',  icon: User },
  { id: 'address',  label: 'Address Book',   icon: MapPin },
  { id: 'order',    label: 'Orders',          icon: Package },
  { id: 'returns',  label: 'Returns',         icon: RefreshCw },
  { id: 'wishlist', label: 'Wishlist',        icon: Heart },
  // { id: 'warranty',          label: 'Warranty Claims',   icon: ShieldCheck },
  { id: 'logout',   label: 'Logout',          icon: LogOut },
];

export default function ProfilePage() {
  const { userId } = useParams();
  const router     = useRouter();

  const [activeSection, setActiveSection] = useState('personal');
  const [userData, setUserData]   = useState<any>({});
  const [orders, setOrders]       = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [wishlist, setWishlist]   = useState([]);
  const [returns, setReturns]     = useState([]);
  const [warrantyClaims, setWarrantyClaims] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [alert, setAlert]         = useState<any>(null);

  /* ── Auth ── */
  useEffect(() => {
    const stored = localStorage.getItem('arttagUserId');
    if (!stored || stored !== userId) {
      localStorage.removeItem('arttagUserId');
      localStorage.removeItem('arttagtoken');
      router.push('/login');
    }
  }, [userId]);

  useEffect(() => { loadInitialData(); }, []);

  const showAlert = (message: any, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const loadInitialData = async () => {
    setPageLoading(true);
    await Promise.all([fetchUserData(), fetchOrders(), fetchAddresses(), fetchWishlist(), fetchReturns(), fetchWarrantyClaims()]);
    setPageLoading(false);
  };

  const fetchUserData = async () => {
    try { const res = await axios.get(`${API_BASE_URL}/user/${userId}/get/profile`); setUserData(res.data.user); }
    catch { showAlert('Failed to load profile', 'error'); }
  };
  const fetchOrders = async () => {
    try { const { data } = await axios.get(`${API_BASE_URL}/order/${userId}/get/all/orders`); if (data.success) setOrders(data.orders); }
    catch { console.error('orders fetch failed'); }
  };
  const fetchAddresses = async () => {
    try { const { data } = await axios.get(`${API_BASE_URL}/user/${userId}/get/address`); if (data.success) setAddresses(data.address); }
    catch { console.error('addresses fetch failed'); }
  };
  const fetchWishlist = async () => {
    try { const { data } = await axios.get(`${API_BASE_URL}/wishlist/${userId}/get/all/items/wishlist`); if (data.success) setWishlist(data.wishlist); }
    catch { console.error('wishlist fetch failed'); }
  };
  const fetchReturns = async () => {
    try { const { data } = await axios.get(`${API_BASE_URL}/return/get/user/${userId}/return`); if (data.returns) setReturns(data.returns); }
    catch { console.error('returns fetch failed'); }
  };

  const fetchWarrantyClaims = async () => {
       try { const { data } = await axios.get(`${API_BASE_URL}/warranty/my-claims/${userId}`); if (data.success) setWarrantyClaims(data.claims); }
       catch { console.error('warranty claims fetch failed'); }
     };

  /* ── Loading ── */
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center gap-5"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap'); .pf-serif { font-family: 'Cormorant Garamond', serif; }`}</style>
        <Link href="/"><span className="pf-serif text-3xl font-light tracking-[0.24em] text-[#1a1a1a]">ARTTAG</span></Link>
        <div className="w-6 h-6 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs tracking-[0.15em] uppercase text-[#888]">Loading your profile…</p>
      </div>
    );
  }

  const initials = userData?.name ? userData.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : '—';

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .pf-serif { font-family: 'Cormorant Garamond', serif; }

        .pf-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }

        /* Menu item */
        .pf-menu-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #f0ece6;
          transition: background 0.12s, color 0.12s;
          color: #555; font-size: 13px; font-weight: 500;
          background: transparent; border-left: none; width: 100%;
          font-family: 'DM Sans', sans-serif;
        }
        .pf-menu-item:last-child { border-bottom: none; }
        .pf-menu-item:hover { background: #f5f3ef; }
        .pf-menu-item.active {
          background: #1a1a1a; color: #fff; border-bottom-color: #1a1a1a;
        }
        .pf-menu-item.active svg { color: #fff !important; }

        /* Content panel */
        .pf-panel {
          background: #fff; border: 1px solid #e8e4de; border-radius: 2px;
          overflow: hidden; min-height: 400px;
        }

        /* Avatar */
        .pf-avatar {
          width: 48px; height: 48px; border-radius: 2px;
          background: #1a1a1a; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; font-weight: 700; letter-spacing: 0.05em;
          flex-shrink: 0;
        }

        /* Alert */
        .pf-alert {
          display: flex; align-items: center; gap: 8px; padding: 11px 14px;
          border-radius: 2px; border: 1px solid; font-size: 13px; margin-bottom: 20px;
        }
        .pf-alert.success { background: #eafaf1; border-color: #a9dfbf; color: #1e8449; }
        .pf-alert.error   { background: #fdecea; border-color: #f5b7b1; color: #c0392b; }
      `}</style>

      {/* ── Top nav bar ── */}
      <div className="bg-white border-b border-[#e8e4de]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12 h-14 flex items-center justify-between">
        <Link href={'/'} className="flex-shrink-0 -ml-10 sm:-ml-11 lg:-ml-12">
              <div className="flex items-center">
                <div className="w-auto h-12 sm:h-13 md:h-15 lg:h-14 xl:h-[50px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 270 54"
                    className="h-full w-auto"
                  >
                    <defs>
                      <style>
                        {`
                        .st0 {
                          font-family: MuktaMahee-Regular, 'Mukta Mahee';
                          font-size: 49.69px;
                        }
                        `}
                      </style>
                    </defs>
                    <g>
                      <path d="M62.85,33.21c.11,0,.17.04.19.21.2,1.7-.04,4.05-.01,5.84,0,.44.01.95-.3,1.15-.34.21-1.72-.06-2.18-.12-14.77-1.86-19.13-21.03-6.37-28.96,3.44-2.14,5.73-2.15,9.65-2.25.57-.01,1.26,0,1.76.06-2.15,2.88-1.5,7.52,2.16,8.77,1.53.52,2.98.08,4.52.4v21.62c0,.2-.1.41-.29.49h-6.67c-.08,0-.16-.03-.22-.09-.06-.06-.09-.14-.09-.22v-20.52c0-.35-.19-.72-.24-.86-1.18-3.54-5.67-2.47-7.9-.6-4.54,3.81-3.78,11.34,1.53,14.02.34.17,1.24.75,2.41.87l2.06.2Z" />
                      <path d="M68.98,16.48c-.15,0-.29-.02-.44-.05-1.63-.42-2.77-2.4-2.6-4.02.15-1.44,1.7-3.34,3.22-3.34h20.4c.15,0,.17.11.18.44v6.66c0,.08-.03.16-.09.22-.06.06-.14.09-.22.09h-20.45Z" />
                      <path d="M73.96,40.29v-21.62c0-.2.1-.41.29-.49h6.67c.08,0,.16.03.22.09.06.06.09.14.09.22v18.21c.03.76-.62,1.51-.8,1.75-1.53,2.1-4.13,2.17-6.49,1.83Z" />
                    </g>
                    
                  </svg>
                </div>
              </div>
            </Link>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#888]">My Account</p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12 py-10">

        {/* ── Alert ── */}
        {alert && (
          <div className={`pf-alert ${alert.type}`}>
            {alert.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
            {alert.message}
          </div>
        )}

        {/* ── User banner ── */}
        <div className="flex items-center gap-4 mb-8">
          <div className="pf-avatar">{initials}</div>
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-0.5">Welcome back</p>
            <h1 className="pf-serif text-3xl font-light text-[#1a1a1a]">
              {userData?.name || 'Your Account'}
            </h1>
            {userData?.email && (
              <p className="text-xs text-[#888] mt-0.5">{userData.email}</p>
            )}
          </div>
        </div>

        <div className="pf-divider mb-8" />

        {/* ── Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-8 items-start">

          {/* ── Sidebar ── */}
          <div className="bg-white border border-[#e8e4de] rounded-sm overflow-hidden lg:sticky lg:top-20">
            {MENU.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const isDanger = item.id === 'logout';
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`pf-menu-item ${isActive ? 'active' : ''}`}
                  style={isDanger && !isActive ? { color: '#c0392b' } : {}}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={15} className={isActive ? 'text-white' : isDanger ? 'text-[#c0392b]' : 'text-[#aaa]'} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight size={14} className={isActive ? 'text-white' : 'text-[#d4cfc8]'} />
                </button>
              );
            })}
          </div>

          {/* ── Content panel ── */}
          <div className="pf-panel">
            {activeSection === 'personal' && (
              <PersonalInfoSection userData={userData} userId={userId} onUpdate={fetchUserData} showAlert={showAlert} />
            )}
            {activeSection === 'address' && (
              <AddressSection addresses={addresses} userId={userId} onUpdate={fetchAddresses} showAlert={showAlert} />
            )}
            {activeSection === 'order' && (
              <OrderSection orders={orders} showAlert={showAlert} />
            )}
            {activeSection === 'returns' && (
              <ReturnSection returns={returns} userId={userId} onUpdate={fetchReturns} showAlert={showAlert} />
            )}
            {activeSection === 'wishlist' && (
              <WishlistSection wishlist={wishlist} userId={userId} onUpdate={fetchWishlist} showAlert={showAlert} />
            )}
            {activeSection === 'logout' && (
              <LogoutSection onCancel={() => setActiveSection('personal')} />
            )}

{activeSection === 'warranty' && (
   <WarrantyClaimSection warrantyClaims={warrantyClaims} showAlert={showAlert} />
 )}
          </div>
        </div>
      </div>

      <div className="pf-divider" />
      <FooterPart />
    </div>
  );
}