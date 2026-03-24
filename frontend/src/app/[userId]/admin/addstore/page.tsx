'use client'
import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Edit2, Trash2, X, Upload, MapPin, Phone, Building2,
  Search, ChevronLeft, ChevronRight, Eye, AlertCircle, ExternalLink,
  CheckCircle2, Clock,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const STATES = [
  'AndhraPradesh','ArunachalPradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','HimachalPradesh','Jharkhand','Karnataka','Kerala','MadhyaPradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','TamilNadu','Telangana','Tripura','UttarPradesh',
  'Uttarakhand','WestBengal','AndamanAndNicobarIslands','Chandigarh',
  'DadraAndNagarHaveliAndDamanAndDiu','Delhi','JammuAndKashmir','Ladakh',
  'Lakshadweep','Puducherry',
];
const WEEK_DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const fmt = (s: string) => s.replace(/([A-Z])/g, ' $1').trim();

/* ─────────────────────────────────────────────
   SMALL SHARED COMPONENTS
───────────────────────────────────────────── */
const Field = ({ label, required = false, error = '', children }: any) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888]">
      {label}{required && <span className="text-[#c0392b] ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-[11px] text-[#c0392b]">{error}</p>}
  </div>
);

const SI = ({ className = '', error = false, ...p }: any) => (
  <input
    className={`store-input ${error ? 'error' : ''} ${className}`}
    {...p}
  />
);

const ST = ({ className = '', error = false, ...p }: any) => (
  <textarea
    className={`store-input ${error ? 'error' : ''} ${className}`}
    style={{ minHeight: 80, resize: 'none' }}
    {...p}
  />
);

const SS = ({ className = '', error = false, children, ...p }: any) => (
  <div className="relative">
    <select className={`store-input pr-8 ${error ? 'error' : ''} ${className}`} {...p}>
      {children}
    </select>
    <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#aaa]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
  </div>
);

/* ─────────────────────────────────────────────
   MODAL
───────────────────────────────────────────── */
const Modal = ({ open, onClose, title, eyebrow, children }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-white border border-[#e8e4de] rounded-sm w-full max-w-3xl max-h-[90vh] overflow-y-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[#e8e4de] sticky top-0 bg-white z-10">
          <div>
            {eyebrow && <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-0.5">{eyebrow}</p>}
            <h2 className="store-serif text-2xl font-light text-[#1a1a1a]">{title}</h2>
          </div>
          <button onClick={onClose} className="store-icon-btn mt-1"><X size={14} /></button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   STORE FORM
───────────────────────────────────────────── */
const StoreForm = ({
  onSubmit, isEdit, loading, submitError,
  storeName, setStoreName, storePhoneNumber, setStorePhoneNumber,
  storeAddress, setStoreAddress, storeCity, setStoreCity,
  storeState, setStoreState, storePincode, setStorePincode,
  storeLocationUrl, setStoreLocationUrl, storeOpenDayStart, setStoreOpenDayStart,
  storeOpenDayEnd, setStoreOpenDayEnd, storeOpeningTimeing, setStoreOpeningTimeing,
  storeClosingTiming, setStoreClosingTiming, is24x7, setIs24x7,
  formErrors, imagePreview, handleImageChange, setImagePreview, setStoreImage,
  onCancel,
}: any) => (
  <form onSubmit={onSubmit} className="space-y-7">

    {submitError && (
      <div className="flex items-center gap-2 px-4 py-3 bg-[#fdecea] border border-[#f5b7b1] rounded-sm text-sm text-[#c0392b]">
        <AlertCircle size={14} /> {submitError}
      </div>
    )}

    {/* Image */}
    <div className="space-y-3">
      <p className="text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888]">
        Store Image{!isEdit && <span className="text-[#c0392b] ml-0.5">*</span>}
      </p>
      {imagePreview ? (
        <div className="relative group">
          <img src={imagePreview} alt="Preview" className="w-full h-52 object-cover rounded-sm border border-[#e8e4de]" />
          <button
            type="button"
            onClick={() => { setImagePreview(null); setStoreImage(null); }}
            className="absolute top-2 right-2 w-8 h-8 bg-[#c0392b] text-white rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 border border-dashed border-[#d4cfc8] rounded-sm cursor-pointer hover:border-[#1a1a1a] transition-colors bg-[#faf9f7] hover:bg-[#f5f3ef]">
          <Upload size={24} className="text-[#ccc] mb-3" />
          <p className="text-sm text-[#888]"><span className="font-medium text-[#1a1a1a]">Click to upload</span> or drag and drop</p>
          <p className="text-xs text-[#aaa] mt-1">PNG, JPG up to 5MB</p>
          <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
        </label>
      )}
    </div>

    <div className="store-divider" />

    {/* Basic info */}
    <div className="space-y-4">
      <p className="text-[10px] tracking-[0.18em] uppercase font-semibold text-[#aaa]">Basic Information</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Store Name" required error={formErrors.storeName}>
          <SI value={storeName} onChange={(e: any) => setStoreName(e.target.value)} placeholder="e.g. Arttag Mumbai" error={!!formErrors.storeName} />
        </Field>
        <Field label="Phone Number" required error={formErrors.storePhoneNumber}>
          <SI value={storePhoneNumber} onChange={(e: any) => setStorePhoneNumber(e.target.value)} placeholder="+91 98765 43210" error={!!formErrors.storePhoneNumber} />
        </Field>
      </div>
    </div>

    <div className="store-divider" />

    {/* Address */}
    <div className="space-y-4">
      <p className="text-[10px] tracking-[0.18em] uppercase font-semibold text-[#aaa]">Address</p>
      <Field label="Street Address" required error={formErrors.storeAddress}>
        <ST value={storeAddress} onChange={(e: any) => setStoreAddress(e.target.value)} placeholder="Full address" error={!!formErrors.storeAddress} />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="City" required error={formErrors.storeCity}>
          <SI value={storeCity} onChange={(e: any) => setStoreCity(e.target.value)} placeholder="Mumbai" error={!!formErrors.storeCity} />
        </Field>
        <Field label="State" required error={formErrors.storeState}>
          <SS value={storeState} onChange={(e: any) => setStoreState(e.target.value)} error={!!formErrors.storeState}>
            <option value="">Select state</option>
            {STATES.map(s => <option key={s} value={s}>{fmt(s)}</option>)}
          </SS>
        </Field>
        <Field label="Pincode" required error={formErrors.storePincode}>
          <SI value={storePincode} onChange={(e: any) => setStorePincode(e.target.value)} placeholder="400001" maxLength={6} error={!!formErrors.storePincode} />
        </Field>
      </div>
      <Field label="Google Maps URL" required error={formErrors.storeLocationUrl}>
        <SI value={storeLocationUrl} onChange={(e: any) => setStoreLocationUrl(e.target.value)} placeholder="https://maps.google.com/…" type="url" error={!!formErrors.storeLocationUrl} />
      </Field>
    </div>

    <div className="store-divider" />

    {/* Hours */}
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] tracking-[0.18em] uppercase font-semibold text-[#aaa]">Operating Hours</p>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <div
            onClick={() => setIs24x7(!is24x7)}
            className={`w-10 h-5 rounded-full relative transition-colors ${is24x7 ? 'bg-[#1a1a1a]' : 'bg-[#ddd]'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${is24x7 ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
          <span className="text-xs tracking-[0.08em] uppercase font-semibold text-[#555]">24 / 7</span>
        </label>
      </div>

      {!is24x7 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Opens from (day)">
              <SS value={storeOpenDayStart} onChange={(e: any) => setStoreOpenDayStart(e.target.value)}>
                {WEEK_DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </SS>
            </Field>
            <Field label="Closes on (day)">
              <SS value={storeOpenDayEnd} onChange={(e: any) => setStoreOpenDayEnd(e.target.value)}>
                {WEEK_DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </SS>
            </Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Opening Time" required error={formErrors.storeOpeningTimeing}>
              <SI value={storeOpeningTimeing} onChange={(e: any) => setStoreOpeningTimeing(e.target.value)} placeholder="9:00 AM" error={!!formErrors.storeOpeningTimeing} />
            </Field>
            <Field label="Closing Time" required error={formErrors.storeClosingTiming}>
              <SI value={storeClosingTiming} onChange={(e: any) => setStoreClosingTiming(e.target.value)} placeholder="9:00 PM" error={!!formErrors.storeClosingTiming} />
            </Field>
          </div>
        </>
      )}
    </div>

    {/* Actions */}
    <div className="flex justify-end gap-3 pt-4 border-t border-[#e8e4de]">
      <button type="button" onClick={onCancel} className="store-outline-btn" disabled={loading}>Cancel</button>
      <button type="submit" disabled={loading} className="store-primary-btn">
        {loading
          ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />{isEdit ? 'Updating…' : 'Adding…'}</>
          : isEdit ? 'Update Store' : 'Add Store'
        }
      </button>
    </div>
  </form>
);

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const AdminStoreManagement = () => {
  const [stores, setStores]         = useState<any[]>([]);
  const [loading, setLoading]       = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStores, setTotalStores] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [alert, setAlert]           = useState({ show: false, message: '', type: 'success' });

  // Modal state
  const [addOpen, setAddOpen]   = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [storeName, setStoreName]           = useState('');
  const [storeAddress, setStoreAddress]     = useState('');
  const [storeCity, setStoreCity]           = useState('');
  const [storeState, setStoreState]         = useState('');
  const [storePincode, setStorePincode]     = useState('');
  const [storePhoneNumber, setStorePhoneNumber] = useState('');
  const [storeOpenDayStart, setStoreOpenDayStart] = useState('Monday');
  const [storeOpenDayEnd, setStoreOpenDayEnd]     = useState('Sunday');
  const [storeOpeningTimeing, setStoreOpeningTimeing] = useState('');
  const [storeClosingTiming, setStoreClosingTiming]   = useState('');
  const [is24x7, setIs24x7]                 = useState(false);
  const [storeLocationUrl, setStoreLocationUrl] = useState('');
  const [storeImage, setStoreImage]         = useState<any>(null);
  const [imagePreview, setImagePreview]     = useState<any>(null);
  const [formErrors, setFormErrors]         = useState<any>({});
  const [submitError, setSubmitError]       = useState('');

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const LIMIT = 10;

  const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchStores = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/store/get/all/store?page=${page}&limit=${LIMIT}`);
      const data = await res.json();
      if (data.success) {
        setStores(data.stores); setTotalPages(data.totalPages);
        setTotalStores(data.totalStores); setCurrentPage(data.currentPage);
      }
    } catch { showAlert('Failed to fetch stores', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchStores(1); }, [fetchStores]);

  const validate = useCallback(() => {
    const e: any = {};
    if (!storeName.trim())       e.storeName       = 'Required';
    if (!storeAddress.trim())    e.storeAddress    = 'Required';
    if (!storeCity.trim())       e.storeCity       = 'Required';
    if (!storeState)             e.storeState      = 'Required';
    if (!storePincode.trim())    e.storePincode    = 'Required';
    else if (storePincode.length !== 6) e.storePincode = 'Must be 6 digits';
    if (!storePhoneNumber.trim()) e.storePhoneNumber = 'Required';
    if (!storeLocationUrl.trim()) e.storeLocationUrl = 'Required';
    if (!is24x7) {
      if (!storeOpeningTimeing.trim()) e.storeOpeningTimeing = 'Required';
      if (!storeClosingTiming.trim())  e.storeClosingTiming  = 'Required';
    }
    setFormErrors(e);
    return Object.keys(e).length === 0;
  }, [storeName, storeAddress, storeCity, storeState, storePincode, storePhoneNumber, storeLocationUrl, is24x7, storeOpeningTimeing, storeClosingTiming]);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showAlert('Please select an image file', 'error'); return; }
    if (file.size > 5 * 1024 * 1024)    { showAlert('Image must be under 5MB', 'error'); return; }
    setStoreImage(file);
    const r = new FileReader();
    r.onloadend = () => setImagePreview(r.result);
    r.readAsDataURL(file);
  };

  const resetForm = useCallback(() => {
    setStoreName(''); setStoreAddress(''); setStoreCity(''); setStoreState('');
    setStorePincode(''); setStorePhoneNumber(''); setStoreOpenDayStart('Monday');
    setStoreOpenDayEnd('Sunday'); setStoreOpeningTimeing(''); setStoreClosingTiming('');
    setIs24x7(false); setStoreLocationUrl(''); setStoreImage(null);
    setImagePreview(null); setFormErrors({}); setSubmitError('');
  }, []);

  const buildFD = (extra: any = {}) => {
    const fd = new FormData();
    const fields: any = {
      storeName, storeAddress, storeCity, storeState, storePincode,
      storePhoneNumber, storeOpenDayStart, storeOpenDayEnd,
      is24x7: is24x7.toString(), storeLocationUrl,
      storeOpeningTimeing: is24x7 ? '' : storeOpeningTimeing,
      storeClosingTiming:  is24x7 ? '' : storeClosingTiming,
      ...extra,
    };
    Object.entries(fields).forEach(([k, v]) => fd.append(k, v as string));
    if (storeImage && typeof storeImage !== 'string') fd.append('storeimage', storeImage);
    return fd;
  };

  const handleAddStore = async (e: any) => {
    e.preventDefault(); setSubmitError('');
    if (!validate()) { setSubmitError('Please fix all errors'); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/store/add/store`, { method: 'POST', body: buildFD() });
      const data = await res.json();
      if (data.success) { showAlert('Store added successfully!'); setAddOpen(false); resetForm(); fetchStores(currentPage); }
      else { setSubmitError(data.message || 'Failed to add store'); }
    } catch { setSubmitError('Failed to add store. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleUpdateStore = async (e: any) => {
    e.preventDefault(); setSubmitError('');
    if (!validate()) { setSubmitError('Please fix all errors'); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/store/update/store`, { method: 'PATCH', body: buildFD({ id: selectedStore.id }) });
      const data = await res.json();
      if (data.success) { showAlert('Store updated successfully!'); setEditOpen(false); resetForm(); fetchStores(currentPage); }
      else { setSubmitError(data.message || 'Failed to update store'); }
    } catch { setSubmitError('Failed to update store. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleDeleteStore = async (storeId: string) => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/store/delete/store`, {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: storeId }),
      });
      const data = await res.json();
      if (data.success) { showAlert('Store deleted successfully!'); setDeleteConfirmId(null); fetchStores(currentPage); }
      else { showAlert(data.message || 'Failed to delete store', 'error'); }
    } catch { showAlert('Failed to delete store', 'error'); }
    finally { setLoading(false); }
  };

  const openEditModal = (store: any) => {
    setSelectedStore(store);
    setStoreName(store.storeName); setStoreAddress(store.storeAddress);
    setStoreCity(store.storeCity); setStoreState(store.storeState);
    setStorePincode(store.storePincode); setStorePhoneNumber(store.storePhoneNumber);
    setStoreOpenDayStart(store.storeOpenDayStart); setStoreOpenDayEnd(store.storeOpenDayEnd);
    setStoreOpeningTimeing(store.storeOpeningTimeing || '');
    setStoreClosingTiming(store.storeClosingTiming || '');
    setIs24x7(store.is24x7); setStoreLocationUrl(store.storeLocationUrl);
    setStoreImage(store.storeImage); setImagePreview(store.storeImage);
    setFormErrors({}); setSubmitError(''); setEditOpen(true);
  };

  const formProps = {
    loading, submitError, storeName, setStoreName, storePhoneNumber, setStorePhoneNumber,
    storeAddress, setStoreAddress, storeCity, setStoreCity, storeState, setStoreState,
    storePincode, setStorePincode, storeLocationUrl, setStoreLocationUrl,
    storeOpenDayStart, setStoreOpenDayStart, storeOpenDayEnd, setStoreOpenDayEnd,
    storeOpeningTimeing, setStoreOpeningTimeing, storeClosingTiming, setStoreClosingTiming,
    is24x7, setIs24x7, formErrors, imagePreview, handleImageChange,
    setImagePreview, setStoreImage,
  };

  const filtered = stores.filter((s: any) =>
    s.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.storeCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.storePincode.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .store-serif { font-family: 'DM Sans', sans-serif; }

        .store-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }

        /* Input base */
        .store-input {
          width: 100%;
          padding: 9px 12px;
          font-size: 13px;
          border: 1px solid #e8e4de;
          border-radius: 2px;
          background: #fff;
          color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s;
          appearance: none;
        }
        .store-input:focus { border-color: #1a1a1a; }
        .store-input::placeholder { color: #ccc; }
        .store-input.error { border-color: #f5b7b1; }
        .store-input.error:focus { border-color: #c0392b; }

        /* Buttons */
        .store-primary-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: #1a1a1a; color: #fff; border: none;
          padding: 9px 20px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: background 0.2s;
          font-family: 'DM Sans', sans-serif; white-space: nowrap;
        }
        .store-primary-btn:hover:not(:disabled) { background: #333; }
        .store-primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .store-outline-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent; color: #888; border: 1px solid #e8e4de;
          padding: 8px 16px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: all 0.2s;
          font-family: 'DM Sans', sans-serif; white-space: nowrap;
        }
        .store-outline-btn:hover:not(:disabled) { border-color: #1a1a1a; color: #1a1a1a; }
        .store-outline-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .store-icon-btn {
          width: 30px; height: 30px; border-radius: 2px;
          border: 1px solid #e8e4de; background: #faf9f7;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #888; transition: all 0.15s; flex-shrink: 0;
        }
        .store-icon-btn:hover { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
        .store-icon-btn.danger:hover { background: #c0392b; border-color: #c0392b; }
        .store-icon-btn.view:hover  { background: #1a1a1a; border-color: #1a1a1a; }

        /* Table */
        .store-th {
          font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
          font-weight: 600; color: #aaa; padding: 10px 16px; text-align: left;
          background: #faf9f7; border-bottom: 1px solid #e8e4de;
        }
        .store-td { padding: 14px 16px; border-bottom: 1px solid #f0ece6; vertical-align: middle; }
        .store-tr { transition: background 0.15s; }
        .store-tr:hover { background: #faf9f7; }
        .store-tr:last-child .store-td { border-bottom: none; }

        /* Hours badge */
        .hours-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 3px 10px;
          border-radius: 2px; border: 1px solid;
        }

        /* Skeleton */
        .store-skel {
          background: linear-gradient(90deg, #f5f3ef 0%, #ece9e3 50%, #f5f3ef 100%);
          background-size: 200% 100%;
          animation: storeSkel 1.4s ease-in-out infinite;
          border-radius: 2px;
        }
        @keyframes storeSkel {
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
        .store-alert {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 14px; border-radius: 2px; border: 1px solid;
          font-size: 13px; margin-bottom: 20px;
        }
        .store-alert.success { background: #eafaf1; border-color: #a9dfbf; color: #1e8449; }
        .store-alert.error   { background: #fdecea; border-color: #f5b7b1; color: #c0392b; }
      `}</style>

      <Navbar />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-[#888] mb-1">Admin · Locations</p>
            <h1 className="store-serif text-4xl font-light text-[#1a1a1a]">Store Management</h1>
            <p className="text-sm text-[#888] mt-1.5">Manage all your physical store locations.</p>
          </div>
          <button className="store-primary-btn self-start sm:self-auto" onClick={() => { resetForm(); setAddOpen(true); }}>
            <Plus size={14} /> Add Store
          </button>
        </div>

        <div className="store-divider mb-8" />

        {/* ── Alert ── */}
        {alert.show && (
          <div className={`store-alert ${alert.type}`}>
            {alert.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
            {alert.message}
          </div>
        )}

        {/* ── Stat + Search ── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="bg-white border border-[#e8e4de] rounded-sm px-6 py-4 flex-shrink-0">
            <p className="text-[9px] tracking-[0.18em] uppercase text-[#aaa] font-semibold mb-0.5">Total Stores</p>
            <p className="store-serif text-3xl font-light text-[#1a1a1a]">{totalStores}</p>
          </div>
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, city, or pincode…"
              className="store-input pl-9 h-full min-h-[60px]"
            />
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white border border-[#e8e4de] rounded-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e4de]">
            <div>
              <h2 className="store-serif text-xl font-light text-[#1a1a1a]">All Stores</h2>
              <p className="text-[10px] tracking-[0.1em] uppercase text-[#aaa] mt-0.5">
                {loading ? 'Loading…' : `${filtered.length} store${filtered.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="store-skel h-16" style={{ animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Building2 size={40} className="text-[#d4cfc8]" />
              <p className="store-serif text-2xl font-light text-[#888]">
                {searchQuery ? 'No stores match your search' : 'No stores yet'}
              </p>
              <p className="text-xs tracking-[0.08em] text-[#bbb]">
                {searchQuery ? 'Try a different term' : 'Add your first store location'}
              </p>
              {!searchQuery && (
                <button className="store-primary-btn mt-2" onClick={() => { resetForm(); setAddOpen(true); }}>
                  <Plus size={13} /> Add Store
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {['Store', 'Location', 'Contact', 'Hours', ''].map(h => (
                      <th key={h} className="store-th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((store: any) => (
                    <tr key={store.id} className="store-tr">
                      {/* Store */}
                      <td className="store-td">
                        <div className="flex items-center gap-3">
                          {store.storeImage
                            ? <img src={store.storeImage} alt={store.storeName} className="w-12 h-12 object-cover rounded-sm border border-[#e8e4de] flex-shrink-0" />
                            : <div className="w-12 h-12 bg-[#f5f3ef] border border-[#e8e4de] rounded-sm flex items-center justify-center flex-shrink-0">
                                <Building2 size={18} className="text-[#ccc]" />
                              </div>
                          }
                          <div>
                            <p className="text-sm font-semibold text-[#1a1a1a]">{store.storeName}</p>
                            {store.is24x7 && (
                              <span className="hours-badge mt-1" style={{ background: '#eafaf1', color: '#27ae60', borderColor: '#a9dfbf' }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#27ae60]" /> 24 / 7
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Location */}
                      <td className="store-td">
                        <p className="text-sm font-medium text-[#1a1a1a]">{store.storeCity}</p>
                        <p className="text-xs text-[#888]">{fmt(store.storeState)}</p>
                        <p className="text-[11px] text-[#aaa] flex items-center gap-1 mt-0.5">
                          <MapPin size={10} />{store.storePincode}
                        </p>
                      </td>
                      {/* Contact */}
                      <td className="store-td">
                        <p className="text-sm text-[#444] flex items-center gap-1.5">
                          <Phone size={12} className="text-[#aaa]" />{store.storePhoneNumber}
                        </p>
                      </td>
                      {/* Hours */}
                      <td className="store-td">
                        {store.is24x7 ? (
                          <span className="text-xs font-semibold text-[#27ae60]">Always open</span>
                        ) : (
                          <div>
                            <p className="text-xs font-medium text-[#1a1a1a]">{store.storeOpenDayStart} – {store.storeOpenDayEnd}</p>
                            <p className="text-[11px] text-[#888] flex items-center gap-1 mt-0.5">
                              <Clock size={10} />{store.storeOpeningTimeing} – {store.storeClosingTiming}
                            </p>
                          </div>
                        )}
                      </td>
                      {/* Actions */}
                      <td className="store-td">
                        <div className="flex items-center gap-1.5 justify-end">
                          <button className="store-icon-btn view" onClick={() => { setSelectedStore(store); setViewOpen(true); }} title="View"><Eye size={14} /></button>
                          <button className="store-icon-btn" onClick={() => openEditModal(store)} title="Edit"><Edit2 size={14} /></button>
                          <button className="store-icon-btn danger" onClick={() => setDeleteConfirmId(store.id)} title="Delete"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#e8e4de] bg-[#faf9f7]">
              <p className="text-xs text-[#888]">
                Page <strong className="text-[#1a1a1a]">{currentPage}</strong> of <strong className="text-[#1a1a1a]">{totalPages}</strong>
              </p>
              <div className="flex items-center gap-1.5">
                <button className="pg-btn" disabled={currentPage === 1} onClick={() => fetchStores(currentPage - 1)}>
                  <ChevronLeft size={14} />
                </button>
                <button className="pg-btn" disabled={currentPage === totalPages} onClick={() => fetchStores(currentPage + 1)}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ════════ ADD MODAL ════════ */}
      <Modal open={addOpen} onClose={() => { setAddOpen(false); resetForm(); }} title="Add New Store" eyebrow="New Location">
        <StoreForm {...formProps} isEdit={false} onSubmit={handleAddStore} onCancel={() => { setAddOpen(false); resetForm(); }} />
      </Modal>

      {/* ════════ EDIT MODAL ════════ */}
      <Modal open={editOpen} onClose={() => { setEditOpen(false); resetForm(); }} title="Edit Store" eyebrow="Update Location">
        <StoreForm {...formProps} isEdit onSubmit={handleUpdateStore} onCancel={() => { setEditOpen(false); resetForm(); }} />
      </Modal>

      {/* ════════ VIEW MODAL ════════ */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title={selectedStore?.storeName || 'Store Details'} eyebrow="Store Detail">
        {selectedStore && (
          <div className="space-y-6">
            {selectedStore.storeImage && (
              <img src={selectedStore.storeImage} alt={selectedStore.storeName} className="w-full h-52 object-cover rounded-sm border border-[#e8e4de]" />
            )}
            <div className="store-divider" />
            <div className="grid grid-cols-2 gap-5 text-sm">
              {[
                ['Store Name',   selectedStore.storeName],
                ['Phone',        selectedStore.storePhoneNumber],
                ['City',         selectedStore.storeCity],
                ['State',        fmt(selectedStore.storeState)],
                ['Pincode',      selectedStore.storePincode],
                ['Hours',        selectedStore.is24x7 ? '24 / 7' : `${selectedStore.storeOpenDayStart} – ${selectedStore.storeOpenDayEnd}, ${selectedStore.storeOpeningTimeing} – ${selectedStore.storeClosingTiming}`],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#aaa] font-semibold mb-0.5">{label}</p>
                  <p className="text-[#1a1a1a] font-medium">{value}</p>
                </div>
              ))}
              <div className="col-span-2">
                <p className="text-[10px] tracking-[0.12em] uppercase text-[#aaa] font-semibold mb-0.5">Address</p>
                <p className="text-[#1a1a1a]">{selectedStore.storeAddress}</p>
              </div>
            </div>
            <div className="store-divider" />
            <a
              href={selectedStore.storeLocationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5 hover:opacity-60 transition-opacity"
            >
              <MapPin size={14} /> View on Google Maps <ExternalLink size={12} />
            </a>
          </div>
        )}
      </Modal>

      {/* ════════ DELETE CONFIRM ════════ */}
      <Modal open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Delete Store?" eyebrow="Confirm Action">
        <p className="text-sm text-[#666] mb-6 leading-relaxed">
          This store will be <strong className="text-[#1a1a1a]">permanently removed</strong>. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button className="store-outline-btn flex-1" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
          <button
            disabled={loading}
            onClick={() => deleteConfirmId && handleDeleteStore(deleteConfirmId)}
            className="flex-1 py-2 bg-[#c0392b] text-white text-[10px] tracking-[0.14em] uppercase font-semibold rounded-sm hover:bg-[#a93226] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading
              ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Deleting…</>
              : <><Trash2 size={12} />Delete Store</>
            }
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminStoreManagement;