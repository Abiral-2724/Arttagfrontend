'use client'
import React, { useState, useEffect } from 'react';
import {
  Search, MapPin, Clock, Phone, ExternalLink,
  ChevronLeft, ChevronRight, X, Store as StoreIcon,
  Navigation, Filter, CheckCircle2, AlertCircle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const STATES = [
  'AndhraPradesh','ArunachalPradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','HimachalPradesh','Jharkhand','Karnataka','Kerala','MadhyaPradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','TamilNadu','Telangana','Tripura','UttarPradesh',
  'Uttarakhand','WestBengal','AndamanAndNicobarIslands','Chandigarh',
  'DadraAndNagarHaveliAndDamanAndDiu','Delhi','JammuAndKashmir','Ladakh',
  'Lakshadweep','Puducherry',
];
const fmt = (s: string) => s.replace(/([A-Z])/g, ' $1').trim();
const fmtDay = (d: string) => d === 'Thusday' ? 'Thursday' : d;

const FindStore = () => {
  const [stores, setStores]           = useState<any[]>([]);
  const [loading, setLoading]         = useState(false);
  const [searchMode, setSearchMode]   = useState('browse');
  const [filters, setFilters]         = useState({ city: '', state: '', pincode: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [totalStores, setTotalStores] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [alert, setAlert]             = useState({ show: false, message: '', type: 'success' });

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => { fetchAll(1); }, []);

  const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchAll = async (page: number) => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/store/get/all/store?page=${page}&limit=9`);
      const data = await res.json();
      if (data.success) { setStores(data.stores); setTotalPages(data.totalPages); setTotalStores(data.totalStores); setCurrentPage(data.currentPage); }
    } catch { console.error('Failed to fetch stores'); }
    finally { setLoading(false); }
  };

  const searchStores = async () => {
    const { city, state, pincode } = filters;
    if (!city && !state && !pincode) { showAlert('Please enter at least one search parameter.', 'error'); return; }
    setLoading(true); setSearchMode('search');
    try {
      const p = new URLSearchParams();
      if (city) p.append('city', city);
      if (state) p.append('state', state);
      if (pincode) p.append('pincode', pincode);
      const res  = await fetch(`${API_BASE}/store/search?${p}`);
      const data = await res.json();
      if (data.success) { setStores(data.stores); setTotalStores(data.count); }
      else { setStores([]); showAlert(data.message || 'No stores found.', 'error'); }
    } catch { console.error('Search failed'); }
    finally { setLoading(false); }
  };

  const clearSearch = () => {
    setFilters({ city: '', state: '', pincode: '' });
    setSearchMode('browse'); setCurrentPage(1); fetchAll(1);
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .fs-serif { font-family: 'Cormorant Garamond', serif; }

        .fs-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }

        /* Inputs */
        .fs-input {
          width: 100%; padding: 9px 12px; font-size: 13px;
          border: 1px solid #e8e4de; border-radius: 2px;
          background: #fff; color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.2s; appearance: none;
        }
        .fs-input:focus { border-color: #1a1a1a; }
        .fs-input::placeholder { color: #ccc; }

        /* Buttons */
        .fs-primary-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: #1a1a1a; color: #fff; border: none;
          padding: 9px 18px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: background 0.2s;
          font-family: 'DM Sans', sans-serif; white-space: nowrap;
        }
        .fs-primary-btn:hover { background: #333; }

        .fs-outline-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent; color: #888; border: 1px solid #e8e4de;
          padding: 8px 16px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .fs-outline-btn:hover { border-color: #1a1a1a; color: #1a1a1a; }

        /* Store card */
        .fs-card {
          background: #fff; border: 1px solid #e8e4de; border-radius: 2px;
          overflow: hidden; transition: box-shadow 0.25s, border-color 0.25s, transform 0.25s;
        }
        .fs-card:hover {
          box-shadow: 0 10px 36px rgba(0,0,0,0.08);
          border-color: #d4cfc8;
          transform: translateY(-2px);
        }
        .fs-card img { transition: transform 0.5s ease; }
        .fs-card:hover img { transform: scale(1.04); }

        /* Hours badge */
        .fs-hours-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 3px 9px;
          border-radius: 2px; border: 1px solid;
        }

        /* Info row */
        .fs-info-row {
          display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #555;
        }
        .fs-info-icon {
          width: 28px; height: 28px; background: #f5f3ef; border: 1px solid #e8e4de;
          border-radius: 2px; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 1px;
        }

        /* Skeleton */
        .fs-skel {
          background: linear-gradient(90deg, #f5f3ef 0%, #ece9e3 50%, #f5f3ef 100%);
          background-size: 200% 100%;
          animation: fsSkel 1.4s ease-in-out infinite;
          border-radius: 2px;
        }
        @keyframes fsSkel {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Pagination */
        .pg-btn {
          width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
          border-radius: 2px; border: 1px solid #e8e4de; background: #fff;
          font-size: 11px; font-weight: 600; color: #888; cursor: pointer; transition: all 0.15s;
        }
        .pg-btn:hover:not(:disabled) { border-color: #1a1a1a; color: #1a1a1a; }
        .pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Alert */
        .fs-alert {
          display: flex; align-items: center; gap: 8px; padding: 11px 14px;
          border-radius: 2px; border: 1px solid; font-size: 13px; margin-bottom: 20px;
        }
        .fs-alert.error { background: #fdecea; border-color: #f5b7b1; color: #c0392b; }
      `}</style>

      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-[#1a1a1a] py-16 sm:py-24 px-4">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-[10px] tracking-[0.28em] uppercase text-[#555] mb-3">Arttag</p>
          <h1 className="fs-serif text-5xl sm:text-6xl font-light text-white leading-tight mb-3">
            Find a Store
          </h1>
          <p className="text-[#888] text-base font-light max-w-xl">
            Discover our locations across India and visit us for an in-person experience.
          </p>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12 py-10">

        {/* ── Alert ── */}
        {alert.show && (
          <div className={`fs-alert ${alert.type}`}>
            <AlertCircle size={15} /> {alert.message}
          </div>
        )}

        {/* ── Search panel ── */}
        <div className="bg-white border border-[#e8e4de] rounded-sm p-5 mb-8">
          {/* Desktop filters */}
          <div className="hidden lg:flex gap-4 items-end">
            {[
              { label: 'City', key: 'city', placeholder: 'e.g. Gwalior', type: 'text' },
              { label: 'Pincode', key: 'pincode', placeholder: '6-digit pincode', type: 'text' },
            ].map(({ label, key, placeholder, type }) => (
              <div key={key} className="flex-1 space-y-1.5">
                <label className="block text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888]">{label}</label>
                <input type={type} placeholder={placeholder} value={(filters as any)[key]}
                  onChange={e => setFilters(p => ({ ...p, [key]: e.target.value }))}
                  className="fs-input" />
              </div>
            ))}
            <div className="flex-1 space-y-1.5">
              <label className="block text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888]">State</label>
              <div className="relative">
                <select value={filters.state} onChange={e => setFilters(p => ({ ...p, state: e.target.value }))} className="fs-input pr-8">
                  <option value="">All States</option>
                  {STATES.map(s => <option key={s} value={s}>{fmt(s)}</option>)}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#aaa]" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={searchStores} className="fs-primary-btn"><Search size={13} /> Search</button>
              {searchMode === 'search' && <button onClick={clearSearch} className="fs-outline-btn"><X size={13} /> Clear</button>}
            </div>
          </div>

          {/* Mobile filters */}
          <div className="lg:hidden space-y-3">
            <button onClick={() => setShowFilters(!showFilters)} className="fs-outline-btn w-full justify-center">
              <Filter size={13} /> {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            {showFilters && (
              <div className="space-y-3 pt-1">
                {[
                  { label: 'City', key: 'city', placeholder: 'e.g. Gwalior' },
                  { label: 'Pincode', key: 'pincode', placeholder: '6-digit pincode' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="block text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888]">{label}</label>
                    <input placeholder={placeholder} value={(filters as any)[key]}
                      onChange={e => setFilters(p => ({ ...p, [key]: e.target.value }))}
                      className="fs-input" />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <label className="block text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888]">State</label>
                  <div className="relative">
                    <select value={filters.state} onChange={e => setFilters(p => ({ ...p, state: e.target.value }))} className="fs-input pr-8">
                      <option value="">All States</option>
                      {STATES.map(s => <option key={s} value={s}>{fmt(s)}</option>)}
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#aaa]" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={searchStores} className="fs-primary-btn flex-1 justify-center"><Search size={13} /> Search</button>
                  {searchMode === 'search' && <button onClick={clearSearch} className="fs-outline-btn px-3"><X size={13} /></button>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Results header ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="fs-serif text-2xl font-light text-[#1a1a1a]">
              {searchMode === 'search' ? 'Search Results' : 'All Locations'}
            </h2>
            <p className="text-[10px] tracking-[0.1em] uppercase text-[#aaa] mt-0.5">
              {loading ? 'Loading…' : `${totalStores} store${totalStores !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {/* ── Store grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white border border-[#e8e4de] rounded-sm overflow-hidden">
                <div className="fs-skel" style={{ height: 200, animationDelay: `${i * 70}ms` }} />
                <div className="p-5 space-y-2.5">
                  <div className="fs-skel h-4 w-3/4" />
                  <div className="fs-skel h-3 w-full" />
                  <div className="fs-skel h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <MapPin size={36} className="text-[#d4cfc8]" />
            <p className="fs-serif text-2xl font-light text-[#888]">No stores found</p>
            <p className="text-xs text-[#bbb]">Try adjusting your search filters</p>
            {searchMode === 'search' && (
              <button onClick={clearSearch} className="fs-outline-btn mt-2"><X size={12} /> Clear & View All</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stores.map((store: any) => (
              <div key={store.id} className="fs-card">
                {/* Image */}
                <div className="overflow-hidden" style={{ aspectRatio: '4/3', background: '#f5f3ef' }}>
                  {store.storeImage
                    ? <img src={store.storeImage} alt={store.storeName} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><StoreIcon size={32} className="text-[#d4cfc8]" /></div>
                  }
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-[#1a1a1a] leading-snug">{store.storeName}</h3>
                    {store.is24x7 && (
                      <span className="fs-hours-badge flex-shrink-0" style={{ background: '#eafaf1', color: '#1e8449', borderColor: '#a9dfbf' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#27ae60]" /> 24/7
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="fs-info-row">
                      <div className="fs-info-icon"><MapPin size={13} className="text-[#888]" /></div>
                      <div>
                        <p className="text-[#1a1a1a] font-medium leading-snug">{store.storeAddress}</p>
                        <p className="text-[#888] text-xs mt-0.5">{store.storeCity}, {fmt(store.storeState)}</p>
                        <p className="text-[#aaa] text-xs font-mono mt-0.5">{store.storePincode}</p>
                      </div>
                    </div>

                    <div className="fs-info-row">
                      <div className="fs-info-icon"><Phone size={13} className="text-[#888]" /></div>
                      <a href={`tel:${store.storePhoneNumber}`} className="text-[#1a1a1a] hover:text-[#555] transition-colors">
                        {store.storePhoneNumber}
                      </a>
                    </div>

                    {!store.is24x7 && store.storeOpeningTimeing && store.storeClosingTiming && (
                      <div className="fs-info-row">
                        <div className="fs-info-icon"><Clock size={13} className="text-[#888]" /></div>
                        <div>
                          <p className="text-[#1a1a1a] font-medium text-xs">{fmtDay(store.storeOpenDayStart)} – {fmtDay(store.storeOpenDayEnd)}</p>
                          <p className="text-[#888] text-xs font-mono mt-0.5">{store.storeOpeningTimeing} – {store.storeClosingTiming}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="fs-divider" />

                  <a
                    href={store.storeLocationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] tracking-[0.1em] uppercase font-semibold text-[#1a1a1a] hover:opacity-60 transition-opacity"
                  >
                    <Navigation size={12} /> Get Directions <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && searchMode === 'browse' && totalPages > 1 && (
          <div className="flex items-center justify-between mt-10">
            <p className="text-xs text-[#888]">
              Page <strong className="text-[#1a1a1a]">{currentPage}</strong> of <strong className="text-[#1a1a1a]">{totalPages}</strong>
            </p>
            <div className="flex items-center gap-1.5">
              <button className="pg-btn" disabled={currentPage === 1} onClick={() => fetchAll(currentPage - 1)}>
                <ChevronLeft size={14} />
              </button>
              <button className="pg-btn" disabled={currentPage === totalPages} onClick={() => fetchAll(currentPage + 1)}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindStore;