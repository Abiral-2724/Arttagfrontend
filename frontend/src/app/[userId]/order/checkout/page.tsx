'use client'
import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, MapPin, Edit2, Plus, ShoppingBag, Truck,
  CheckCircle2, Package, Tag, Gift, X, Check, ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/* ─── shared primitives ─── */
const Field = ({ label, required = false, children }: any) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888]">
      {label}{required && <span className="text-[#c0392b] ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const AI = ({ ...p }: any) => (
  <input
    className="w-full px-3 py-2.5 text-sm border border-[#e8e4de] rounded-sm bg-white text-[#1a1a1a] outline-none transition-colors focus:border-[#1a1a1a] placeholder:text-[#ccc]"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
    {...p}
  />
);

const SectionDivider = () => (
  <div className="h-px bg-gradient-to-r from-transparent via-[#e8e4de] to-transparent my-1" />
);

/* ─── Modal ─── */
const Modal = ({ open, onClose, title, eyebrow, children }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-white border border-[#e8e4de] rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="sticky top-0 bg-white z-10 flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#e8e4de]">
          <div>
            {eyebrow && <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-0.5">{eyebrow}</p>}
            <h2 className="text-xl font-semibold text-[#1a1a1a]">{title}</h2>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 border border-[#e8e4de] rounded-sm flex items-center justify-center text-[#888] hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a] transition-all mt-0.5">
            <X size={13} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

/* ─── main page ─── */
export default function CheckoutPage() {
  const { userId }   = useParams();
  const router       = useRouter();
  const pathname     = usePathname();

  const [addresses, setAddresses]         = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [orderSummary, setOrderSummary]   = useState({
    totalItem: 0, totalamount: 0, shippingCharge: 0,
    couponCode: null as string | null, couponDiscountPercentage: 0,
    isAddingAsGift: false, addAsGiftPrice: 0,
  });
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode]   = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const emptyForm = {
    addressId: '', fullname: '', email: '', mobile: '', pincode: '',
    city: '', state: '', country: '', streetAddress: '', locality: '', landmark: '', GSTIN: '',
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { fetchAddresses(); fetchCartDetails(); }, []);

  const fetchAddresses = async () => {
    try {
      const res  = await fetch(`${API_BASE_URL}/user/${userId}/get/address`);
      const data = await res.json();
      if (data.success) {
        setAddresses(data.address);
        if (data.address.length > 0) setSelectedAddress(data.address[0].id);
      } else setError(data.message || 'Failed to load addresses');
    } catch { setError('Failed to load addresses. Please check your connection.'); }
  };

  const fetchCartDetails = async () => {
    try {
      const res  = await fetch(`${API_BASE_URL}/cart/${userId}/cart/summary`);
      const data = await res.json();
      if (data.success) {
        setOrderSummary({
          totalItem: data.totalItem, totalamount: data.totalamount, shippingCharge: data.shippingCharge,
          couponCode: data.couponCode || null, couponDiscountPercentage: data.couponDiscountPercentage || 0,
          isAddingAsGift: data.isAddingAsGift || false, addAsGiftPrice: data.addAsGiftPrice || 0,
        });
      } else setError(data.message || 'Failed to load cart details');
      setLoading(false);
    } catch { setError('Failed to load cart details.'); setLoading(false); }
  };

  const handleAddAddress = () => { setEditMode(false); setFormData(emptyForm); setDialogOpen(true); };
  const handleEditAddress = (addr: any) => {
    setEditMode(true);
    setFormData({ addressId: addr.id, fullname: addr.fullname || '', email: addr.email || '',
      mobile: addr.mobile || '', pincode: addr.pincode || '', city: addr.city || '',
      state: addr.state || '', country: addr.country || '', streetAddress: addr.streetAddress || '',
      locality: addr.locality || '', landmark: addr.landmark || '', GSTIN: addr.GSTIN || '' });
    setDialogOpen(true);
  };

  const set = (e: any) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleSubmitAddress = async () => {
    setSubmitting(true); setError('');
    const req = ['fullname','email','mobile','pincode','city','state','country','streetAddress','locality'];
    if (req.some(f => !(formData as any)[f])) { setError('Please fill all required fields'); setSubmitting(false); return; }
    if (formData.mobile.length !== 13) { setError('Phone must be +91XXXXXXXXXX (13 chars)'); setSubmitting(false); return; }
    if (formData.pincode.length !== 6) { setError('Pincode must be 6 digits'); setSubmitting(false); return; }
    try {
      const url    = editMode ? `${API_BASE_URL}/user/${userId}/modify/address` : `${API_BASE_URL}/user/${userId}/add/address`;
      const res    = await fetch(url, { method: editMode ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data   = await res.json();
      if (data.success) { setDialogOpen(false); fetchAddresses(); setError(''); }
      else setError(data.message || 'Failed to save address');
    } catch { setError('Failed to save address. Please try again.'); }
    finally { setSubmitting(false); }
  };

  const couponDiscount = orderSummary.couponDiscountPercentage > 0
    ? Math.round((orderSummary.totalamount * orderSummary.couponDiscountPercentage) / 100) : 0;
  const afterDiscount  = orderSummary.totalamount - couponDiscount;
  const grandTotal     = afterDiscount + orderSummary.shippingCharge + (orderSummary.isAddingAsGift ? orderSummary.addAsGiftPrice : 0);

  const handleContinue = () => {
    if (!selectedAddress) { setError('Please select a delivery address'); return; }
    router.push(`${pathname}/${selectedAddress}/payment`);
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center gap-4"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap');`}</style>
        <Link href="/"><span style={{ fontFamily: "'Cormorant Garamond', serif" }}
          className="text-3xl font-light tracking-[0.24em] text-[#1a1a1a]">ARTTAG</span></Link>
        <div className="w-6 h-6 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#888]">Loading order summary…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .co-serif { font-family: 'Cormorant Garamond', serif; }
        .co-divider { height: 1px; background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent); }

        /* Address card */
        .co-addr-card {
          border: 1px solid #e8e4de; border-radius: 2px; padding: 16px 18px;
          background: #fff; cursor: pointer; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .co-addr-card.selected { border-color: #1a1a1a; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        .co-addr-card:hover:not(.selected) { border-color: #d4cfc8; }

        /* Radio dot */
        .co-radio {
          width: 18px; height: 18px; border: 1.5px solid #d4cfc8; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: border-color 0.15s;
        }
        .co-addr-card.selected .co-radio { border-color: #1a1a1a; }
        .co-radio-dot { width: 8px; height: 8px; border-radius: 50%; background: #1a1a1a; }

        /* Summary row */
        .co-row { display: flex; align-items: center; justify-content: space-between; font-size: 13px; }

        /* Buttons */
        .co-primary {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 7px;
          background: #1a1a1a; color: #fff; border: none; padding: 14px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: background 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .co-primary:hover:not(:disabled) { background: #333; }
        .co-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        .co-outline {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent; color: #888; border: 1px solid #e8e4de;
          padding: 9px 16px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase; border-radius: 2px;
          cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif;
        }
        .co-outline:hover { border-color: #1a1a1a; color: #1a1a1a; }

        .co-dashed {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px;
          border: 1px dashed #d4cfc8; background: transparent; color: #888;
          padding: 11px; font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; border-radius: 2px; cursor: pointer; transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .co-dashed:hover { border-color: #1a1a1a; color: #1a1a1a; }

        /* Form save button */
        .co-save {
          display: inline-flex; align-items: center; gap: 7px;
          background: #1a1a1a; color: #fff; border: none; padding: 11px 24px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: background 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .co-save:hover:not(:disabled) { background: #333; }
        .co-save:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <Navbar />

      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] tracking-[0.26em] uppercase text-[#888] mb-1">Step 1 of 2</p>
          <h1 className="co-serif text-4xl sm:text-5xl font-light text-[#1a1a1a]">Checkout</h1>
        </div>

        {/* Alert */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-[#fdecea] border border-[#f5b7b1] rounded-sm text-sm text-[#c0392b] mb-6">
            <AlertCircle size={14} className="flex-shrink-0" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* ── LEFT: Address ── */}
          <div className="space-y-4">
            <div className="bg-white border border-[#e8e4de] rounded-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e8e4de]">
                <MapPin size={16} className="text-[#888]" />
                <h2 className="text-base font-semibold text-[#1a1a1a]">Delivery Address</h2>
              </div>

              <div className="p-5">
                {addresses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <MapPin size={32} className="text-[#d4cfc8]" />
                    <p className="text-sm font-light text-[#888]">No addresses saved yet</p>
                    <button onClick={handleAddAddress} className="co-dashed mt-1">
                      <Plus size={13} /> Add Delivery Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr: any) => {
                      const sel = selectedAddress === addr.id;
                      return (
                        <div key={addr.id} className={`co-addr-card ${sel ? 'selected' : ''}`}
                          onClick={() => setSelectedAddress(addr.id)}>
                          <div className="flex items-start gap-3">
                            <div className={`co-radio mt-0.5`}>
                              {sel && <div className="co-radio-dot" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1.5">
                                <p className="text-sm font-semibold text-[#1a1a1a]">{addr.fullname}</p>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {sel && (
                                    <span className="inline-flex items-center gap-1 text-[9px] tracking-[0.1em] uppercase font-semibold px-2 py-0.5 bg-[#1a1a1a] text-white rounded-sm">
                                      <Check size={9} /> Selected
                                    </span>
                                  )}
                                  <button
                                    onClick={e => { e.stopPropagation(); handleEditAddress(addr); }}
                                    className="w-6 h-6 border border-[#e8e4de] rounded-sm flex items-center justify-center text-[#888] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all">
                                    <Edit2 size={11} />
                                  </button>
                                </div>
                              </div>
                              <div className="text-xs text-[#666] leading-relaxed space-y-0.5">
                                <p>{addr.streetAddress}, {addr.locality}</p>
                                {addr.landmark && <p className="text-[#aaa]">{addr.landmark}</p>}
                                <p className="font-medium text-[#555]">{addr.city}, {addr.state} — {addr.pincode}</p>
                                <p className="text-[#888]">{addr.mobile}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <button onClick={handleAddAddress} className="co-dashed mt-1">
                      <Plus size={12} /> Add New Address
                    </button>
                  </div>
                )}
              </div>
            </div>

            <Link href={`/${userId}/cart`} className="inline-block">
              <button className="co-outline">
                <ArrowLeft size={12} /> Back to Cart
              </button>
            </Link>
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="bg-white border border-[#e8e4de] rounded-sm overflow-hidden lg:sticky lg:top-8">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e8e4de]">
              <ShoppingBag size={16} className="text-[#888]" />
              <h2 className="text-base font-semibold text-[#1a1a1a]">Order Summary</h2>
            </div>

            <div className="p-5 space-y-4">
              {/* Items */}
              <div className="co-row">
                <div className="flex items-center gap-2 text-[#666]">
                  <Package size={13} /> <span>Items ({orderSummary.totalItem})</span>
                </div>
                <span className="font-semibold text-[#1a1a1a]">₹{orderSummary.totalamount.toLocaleString()}</span>
              </div>

              {/* Coupon */}
              {orderSummary.couponDiscountPercentage > 0 && (
                <div className="bg-[#eafaf1] border border-[#a9dfbf] rounded-sm p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag size={13} className="text-[#27ae60]" />
                    <span className="text-[10px] tracking-[0.1em] uppercase font-semibold text-[#1e8449]">
                      Coupon Applied
                    </span>
                  </div>
                  <div className="co-row">
                    <span className="text-xs text-[#555]">{orderSummary.couponCode}</span>
                    <span className="text-xs font-semibold text-[#27ae60]">{orderSummary.couponDiscountPercentage}% off</span>
                  </div>
                  <div className="co-row mt-1 pt-1 border-t border-[#a9dfbf]">
                    <span className="text-xs text-[#666]">Discount</span>
                    <span className="text-xs font-bold text-[#1e8449]">−₹{couponDiscount.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* After discount */}
              {orderSummary.couponDiscountPercentage > 0 && (
                <div className="co-row">
                  <span className="text-[#666] text-xs">Subtotal after discount</span>
                  <span className="font-semibold text-[#27ae60]">₹{afterDiscount.toLocaleString()}</span>
                </div>
              )}

              {/* Shipping */}
              <div className="co-row">
                <div className="flex items-center gap-2 text-[#666]">
                  <Truck size={13} /> <span>Delivery</span>
                </div>
                {orderSummary.shippingCharge === 0
                  ? <span className="text-xs font-bold text-[#27ae60]">FREE</span>
                  : <span className="font-semibold text-[#1a1a1a]">₹{orderSummary.shippingCharge.toLocaleString()}</span>
                }
              </div>

              {/* Gift */}
              {orderSummary.isAddingAsGift && (
                <div className="bg-[#fef5e7] border border-[#f5cba7] rounded-sm p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift size={13} className="text-[#e67e22]" />
                      <div>
                        <p className="text-[10px] tracking-[0.08em] uppercase font-semibold text-[#935116]">Gift Packaging</p>
                        <p className="text-[10px] text-[#aaa]">Premium gift wrap</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#e67e22]">₹{orderSummary.addAsGiftPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="co-divider" />

              {/* Grand total */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#aaa] font-semibold mb-0.5">Total</p>
                  <p className="text-2xl font-semibold text-[#1a1a1a]">₹{grandTotal.toLocaleString()}</p>
                  <p className="text-[10px] text-[#aaa] mt-0.5">All taxes included</p>
                </div>
                {couponDiscount > 0 && (
                  <span className="text-[10px] tracking-[0.06em] text-[#27ae60] font-semibold">
                    Saved ₹{couponDiscount.toLocaleString()}
                  </span>
                )}
              </div>

              <button className="co-primary" onClick={handleContinue} disabled={!selectedAddress}>
                {selectedAddress
                  ? <><span>Continue to Payment</span><ArrowRight size={13} /></>
                  : 'Select Address to Continue'
                }
              </button>

              {/* Trust signals */}
              <div className="space-y-1.5 pt-1">
                {['Secure checkout', 'Easy returns & refunds'].map(t => (
                  <div key={t} className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-[#27ae60]" />
                    <span className="text-[11px] text-[#888]">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Add / Edit Address Modal ── */}
      <Modal open={dialogOpen} onClose={() => setDialogOpen(false)}
        title={editMode ? 'Edit Address' : 'Add Address'}
        eyebrow={editMode ? 'Update' : 'New'}>
        <div className="space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" required>
              <AI name="fullname" value={formData.fullname} onChange={set} placeholder="Your full name" />
            </Field>
            <Field label="Mobile" required>
              <AI name="mobile" value={formData.mobile} onChange={set} placeholder="+91XXXXXXXXXX" />
            </Field>
          </div>

          <Field label="Email" required>
            <AI type="email" name="email" value={formData.email} onChange={set} placeholder="your@email.com" />
          </Field>
          <Field label="Street Address" required>
            <AI name="streetAddress" value={formData.streetAddress} onChange={set} placeholder="House / Flat No., Building" />
          </Field>
          <Field label="Locality" required>
            <AI name="locality" value={formData.locality} onChange={set} placeholder="Area, Colony" />
          </Field>
          <Field label="Landmark">
            <AI name="landmark" value={formData.landmark} onChange={set} placeholder="Nearby landmark (optional)" />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="City" required><AI name="city" value={formData.city} onChange={set} placeholder="City" /></Field>
            <Field label="Pincode" required><AI name="pincode" value={formData.pincode} onChange={set} placeholder="6-digit pincode" maxLength={6} /></Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="State" required><AI name="state" value={formData.state} onChange={set} placeholder="State" /></Field>
            <Field label="Country" required><AI name="country" value={formData.country} onChange={set} placeholder="Country" /></Field>
          </div>

          <Field label="GSTIN (Optional)">
            <AI name="GSTIN" value={formData.GSTIN} onChange={set} placeholder="GST Identification Number" />
          </Field>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#fdecea] border border-[#f5b7b1] rounded-sm text-sm text-[#c0392b]">
              <AlertCircle size={13} /> {error}
            </div>
          )}

          <div className="flex gap-3 pt-2 border-t border-[#f0ece6]">
            <button onClick={() => setDialogOpen(false)} disabled={submitting}
              className="flex-1 border border-[#e8e4de] text-[#888] py-2.5 text-[10px] tracking-[0.14em] uppercase font-semibold rounded-sm hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors disabled:opacity-40">
              Cancel
            </button>
            <button onClick={handleSubmitAddress} disabled={submitting} className="co-save flex-1 justify-center">
              {submitting
                ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
                : <>{editMode ? 'Update Address' : 'Save Address'} <Check size={13} /></>
              }
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}