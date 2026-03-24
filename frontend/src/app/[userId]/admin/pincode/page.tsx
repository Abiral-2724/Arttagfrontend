'use client'
import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Trash2, Search, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';

const PincodeManager = () => {
  const [pincodes, setPincodes]   = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [dialogOpen, setDialogOpen]         = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pincodeToDelete, setPincodeToDelete]   = useState<any>(null);
  const [newPincode, setNewPincode]     = useState('');
  const [submitting, setSubmitting]     = useState(false);
  const [deleting, setDeleting]         = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => { fetchPincodes(); }, []);

  const fetchPincodes = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API_BASE_URL}/coupen/all/pincode`);
      const data = await res.json();
      if (data.success) setPincodes(data.pincodes);
    } catch { showAlert('Failed to fetch pincodes', 'error'); }
    finally { setLoading(false); }
  };

  const handleAddPincode = async () => {
    if (!newPincode || newPincode.length !== 6) {
      showAlert('Please enter a valid 6-digit pincode', 'error');
      return;
    }
    try {
      setSubmitting(true);
      const res  = await fetch(`${API_BASE_URL}/coupen/add/pincode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode: parseInt(newPincode) }),
      });
      const data = await res.json();
      if (data.success) {
        showAlert(data.message || 'Pincode added successfully');
        setNewPincode(''); setDialogOpen(false); fetchPincodes();
      } else {
        showAlert(data.message || 'Failed to add pincode', 'error');
      }
    } catch { showAlert('Failed to add pincode', 'error'); }
    finally { setSubmitting(false); }
  };

  const handleDeletePincode = async () => {
    if (!pincodeToDelete) return;
    try {
      setDeleting(true);
      const res  = await fetch(`${API_BASE_URL}/coupen/pincode/${pincodeToDelete.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showAlert('Pincode deleted successfully');
        setDeleteDialogOpen(false); setPincodeToDelete(null); fetchPincodes();
      } else {
        showAlert(data.message || 'Failed to delete pincode', 'error');
      }
    } catch { showAlert('Failed to delete pincode', 'error'); }
    finally { setDeleting(false); }
  };

  const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 4000);
  };

  const filtered = pincodes.filter(p =>
    String(p.pincode).includes(searchQuery.trim())
  );

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .pin-serif { font-family: 'DM Sans', sans-serif; }

        .pin-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }

        /* Card */
        .pin-card {
          background: #fff;
          border: 1px solid #e8e4de;
          border-radius: 2px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .pin-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          border-color: #d4cfc8;
        }
        .pin-value {
          font-size: 15px;
          font-weight: 600;
          color: #1a1a1a;
          letter-spacing: 0.04em;
        }
        .pin-delete-btn {
          width: 28px; height: 28px;
          border-radius: 2px;
          border: 1px solid #e8e4de;
          background: #faf9f7;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: #aaa;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }
        .pin-delete-btn:hover {
          background: #fdecea;
          border-color: #f5b7b1;
          color: #c0392b;
        }

        /* Primary button */
        .pin-primary-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #1a1a1a;
          color: #fff;
          border: none;
          padding: 9px 20px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
          transition: background 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .pin-primary-btn:hover:not(:disabled) { background: #333; }
        .pin-primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Outline button */
        .pin-outline-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          color: #1a1a1a;
          border: 1px solid #e8e4de;
          padding: 8px 18px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .pin-outline-btn:hover { border-color: #1a1a1a; }

        /* Input */
        .pin-input {
          width: 100%;
          padding: 10px 12px;
          font-size: 14px;
          border: 1px solid #e8e4de;
          border-radius: 2px;
          background: #fff;
          color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s;
          letter-spacing: 0.06em;
        }
        .pin-input:focus { border-color: #1a1a1a; }
        .pin-input::placeholder { color: #ccc; letter-spacing: 0.02em; }

        /* Alert */
        .pin-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 14px;
          border-radius: 2px;
          border: 1px solid;
          font-size: 13px;
          margin-bottom: 20px;
          font-family: 'DM Sans', sans-serif;
        }
        .pin-alert.success { background: #eafaf1; border-color: #a9dfbf; color: #1e8449; }
        .pin-alert.error   { background: #fdecea; border-color: #f5b7b1; color: #c0392b; }

        /* Skeleton */
        .pin-skel {
          background: linear-gradient(90deg, #f5f3ef 0%, #ece9e3 50%, #f5f3ef 100%);
          background-size: 200% 100%;
          animation: skel 1.4s ease-in-out infinite;
          border-radius: 2px;
        }
        @keyframes skel {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pin-fade { animation: fade-up 0.3s ease both; }
      `}</style>

      <Navbar />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12 py-10">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-[#888] mb-1">Admin · Delivery</p>
            <h1 className="pin-serif text-4xl font-light text-[#1a1a1a]">Pincode Management</h1>
            <p className="text-sm text-[#888] mt-1.5">Manage delivery zones by adding or removing pincodes.</p>
          </div>
          <button className="pin-primary-btn self-start sm:self-auto" onClick={() => setDialogOpen(true)}>
            <Plus size={14} />
            Add Pincode
          </button>
        </div>

        <div className="pin-divider mb-8" />

        {/* ── Alert ── */}
        {alert.show && (
          <div className={`pin-alert ${alert.type} pin-fade`}>
            {alert.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
            {alert.message}
          </div>
        )}

        {/* ── Stats + Search bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-white border border-[#e8e4de] rounded-sm px-5 py-3 flex flex-col gap-0.5">
              <span className="text-[9px] tracking-[0.18em] uppercase text-[#aaa] font-semibold">Total Pincodes</span>
              <span className="pin-serif text-2xl font-light text-[#1a1a1a]">{pincodes.length}</span>
            </div>
            {searchQuery && (
              <div className="bg-white border border-[#e8e4de] rounded-sm px-5 py-3 flex flex-col gap-0.5">
                <span className="text-[9px] tracking-[0.18em] uppercase text-[#aaa] font-semibold">Filtered</span>
                <span className="pin-serif text-2xl font-light text-[#1a1a1a]">{filtered.length}</span>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative max-w-xs w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value.replace(/\D/g, ''))}
              placeholder="Search pincode…"
              maxLength={6}
              className="pin-input pl-9 pr-9"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#1a1a1a] transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ── Pincode grid ── */}
        <div className="bg-white border border-[#e8e4de] rounded-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e4de]">
            <div>
              <h2 className="pin-serif text-xl font-light text-[#1a1a1a]">Available Pincodes</h2>
              <p className="text-[10px] tracking-[0.1em] uppercase text-[#aaa] mt-0.5">
                {loading ? 'Loading…' : `${filtered.length} pincode${filtered.length !== 1 ? 's' : ''}${searchQuery ? ' matching' : ''}`}
              </p>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {Array(12).fill(0).map((_, i) => (
                  <div key={i} className="pin-skel h-[58px] rounded-sm" style={{ animationDelay: `${i * 60}ms` }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <MapPin size={36} className="text-[#d4cfc8]" />
                <p className="pin-serif text-xl font-light text-[#888]">
                  {searchQuery ? 'No pincodes match your search' : 'No pincodes yet'}
                </p>
                <p className="text-xs tracking-[0.08em] text-[#bbb]">
                  {searchQuery ? 'Try a different number' : 'Add your first pincode to get started'}
                </p>
                {!searchQuery && (
                  <button className="pin-primary-btn mt-2" onClick={() => setDialogOpen(true)}>
                    <Plus size={13} /> Add Pincode
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filtered.map((item, i) => (
                  <div key={item.id} className="pin-card pin-fade" style={{ animationDelay: `${Math.min(i * 25, 300)}ms` }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin size={13} className="text-[#888] flex-shrink-0" />
                      <span className="pin-value truncate">{item.pincode}</span>
                    </div>
                    <button
                      className="pin-delete-btn"
                      title="Delete pincode"
                      onClick={() => { setPincodeToDelete(item); setDeleteDialogOpen(true); }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ════════ ADD PINCODE DIALOG ════════ */}
      <Dialog open={dialogOpen} onOpenChange={open => { setDialogOpen(open); if (!open) setNewPincode(''); }}>
        <DialogContent className="max-w-sm bg-white border border-[#e8e4de] rounded-sm">
          <DialogHeader>
            <p className="text-[10px] tracking-[0.18em] uppercase text-[#888]">Delivery Zone</p>
            <DialogTitle className="pin-serif text-2xl font-light text-[#1a1a1a] mt-0.5">Add Pincode</DialogTitle>
            <DialogDescription className="text-sm text-[#888] mt-1">
              Enter a 6-digit pincode to add it to your delivery zone.
            </DialogDescription>
          </DialogHeader>

          <div className="pin-divider my-4" />

          <div className="space-y-2">
            <label className="block text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888]">
              Pincode
            </label>
            <input
              type="text"
              maxLength={6}
              value={newPincode}
              onChange={e => setNewPincode(e.target.value.replace(/\D/g, ''))}
              onKeyDown={e => e.key === 'Enter' && newPincode.length === 6 && handleAddPincode()}
              placeholder="e.g. 400001"
              className="pin-input"
              autoFocus
            />
            {newPincode.length > 0 && newPincode.length < 6 && (
              <p className="text-[11px] text-[#c0392b]">{6 - newPincode.length} more digit{6 - newPincode.length !== 1 ? 's' : ''} required</p>
            )}
            {newPincode.length === 6 && (
              <p className="text-[11px] text-[#27ae60] flex items-center gap-1">
                <CheckCircle2 size={11} /> Looks good
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={() => { setDialogOpen(false); setNewPincode(''); }} className="pin-outline-btn flex-1">
              Cancel
            </button>
            <button
              onClick={handleAddPincode}
              disabled={submitting || newPincode.length !== 6}
              className="pin-primary-btn flex-1 justify-center"
            >
              {submitting
                ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Adding…</>
                : 'Add Pincode'
              }
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ════════ DELETE CONFIRM DIALOG ════════ */}
      <Dialog open={deleteDialogOpen} onOpenChange={open => { setDeleteDialogOpen(open); if (!open) setPincodeToDelete(null); }}>
        <DialogContent className="max-w-sm bg-white border border-[#e8e4de] rounded-sm">
          <DialogHeader>
            <p className="text-[10px] tracking-[0.18em] uppercase text-[#888]">Confirm Removal</p>
            <DialogTitle className="pin-serif text-2xl font-light text-[#1a1a1a] mt-0.5">Delete Pincode?</DialogTitle>
            <DialogDescription className="text-sm text-[#666] mt-1">
              Pincode <strong className="text-[#1a1a1a] font-semibold">{pincodeToDelete?.pincode}</strong> will be removed from your delivery zones. This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="pin-divider my-4" />

          <div className="flex gap-3">
            <button onClick={() => { setDeleteDialogOpen(false); setPincodeToDelete(null); }} className="pin-outline-btn flex-1">
              Cancel
            </button>
            <button
              onClick={handleDeletePincode}
              disabled={deleting}
              className="flex-1 py-2 bg-[#c0392b] text-white text-[10px] tracking-[0.14em] uppercase font-semibold rounded-sm hover:bg-[#a93226] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {deleting
                ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Deleting…</>
                : <><Trash2 size={12} /> Delete</>
              }
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PincodeManager;