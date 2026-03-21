'use client';

import React, { useState, useEffect } from 'react';
import {
  Trash2, Minus, Plus, Gift, Tag, ChevronDown,
  X, ShoppingBag, Loader2, Check, MapPin, Lock,
  ArrowRight, Heart,
} from 'lucide-react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { useParams } from 'next/navigation';
import FooterPart from '@/components/FooterPart';
import Link from 'next/link';

/* ─────────────────────────────────────────────
   MODAL
───────────────────────────────────────────── */
const Modal = ({ open, onClose, title, eyebrow, children }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-white border border-[#e8e4de] rounded-sm w-full max-w-md"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#e8e4de]">
          <div>
            {eyebrow && <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-0.5">{eyebrow}</p>}
            <h2 className="cart-serif text-xl font-light text-[#1a1a1a]">{title}</h2>
          </div>
          <button onClick={onClose} className="cart-icon-btn mt-0.5 flex-shrink-0"><X size={14} /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   FIELD
───────────────────────────────────────────── */
const Field = ({ label, required = false, children }: any) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888]">
      {label}{required && <span className="text-[#c0392b] ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const ShoppingCart = () => {
  const [cartData, setCartData]: any = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCoupons, setShowCoupons] = useState(false);
  const [showPincodeCheck, setShowPincodeCheck] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct]: any = useState(null);
  const [processingItems, setProcessingItems] = useState<any>({});

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon]: any = useState(null);
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const [pincode, setPincode] = useState('');
  const [pincodeChecking, setPincodeChecking] = useState(false);
  const [pincodeStatus, setPincodeStatus]: any = useState(null);

  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [isGiftWrapped, setIsGiftWrapped] = useState(false);
  const [giftData, setGiftData] = useState({ recipentName: '', senderName: '', messageFromSender: '' });
  const [savingGift, setSavingGift] = useState(false);

  const { userId } = useParams();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => { fetchCartData(); }, []);

  const recalculateCouponDiscount = (total: number, pct: number) => Math.round((total * pct) / 100);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const [cartRes, orderRes] = await Promise.all([
        axios.get(`${API_BASE}/cart/${userId}/get/all/user/cart/product`),
        axios.get(`${API_BASE}/cart/${userId}/cart/summary`),
      ]);
      if (cartRes.data.success) {
        setCartData({ ...cartRes.data, ...orderRes.data });
        setIsGiftWrapped(orderRes.data.isAddingAsGift || false);
        if (orderRes.data.isAddingAsGift && cartRes.data.cart.length > 0) {
          const f = cartRes.data.cart[0];
          if (f.giftRecipentname || f.giftSendername) {
            setGiftData({ recipentName: f.giftRecipentname || '', senderName: f.giftSendername || '', messageFromSender: f.giftMessageFromSender || '' });
          }
        }
        if (orderRes.data.couponCode && orderRes.data.couponDiscountPercentage) {
          const da = recalculateCouponDiscount(orderRes.data.totalamount, orderRes.data.couponDiscountPercentage);
          setAppliedCoupon({ code: orderRes.data.couponCode, discountPercentage: orderRes.data.couponDiscountPercentage, discountAmount: da });
          setCouponCode(orderRes.data.couponCode);
        }
      }
    } catch { alert('Failed to load cart'); }
    finally { setLoading(false); }
  };

  const handleCheckPincode = async () => {
    if (pincode.length !== 6) { setPincodeStatus({ success: false, message: 'Please enter a valid 6-digit pincode' }); return; }
    setPincodeChecking(true); setPincodeStatus(null);
    try {
      const res = await axios.post(`${API_BASE}/coupen/check/pincode/dumy`, { pincode });
      setPincodeStatus({ success: res.data.success, message: res.data.message });
    } catch (e: any) { setPincodeStatus({ success: false, message: e.response?.data?.message || 'Delivery not available' }); }
    finally { setPincodeChecking(false); }
  };

  const handleAddGiftWrapping = async () => {
    if (!giftData.recipentName || !giftData.senderName) { alert('Please fill in recipient and sender names'); return; }
    setSavingGift(true);
    try {
      const res = await axios.patch(`${API_BASE}/cart/add/cart/item/gift`, { ownerId: userId, ...giftData });
      if (res.data.success) { setIsGiftWrapped(true); setShowGiftDialog(false); await fetchCartData(); }
    } catch (e: any) { alert(e.response?.data?.message || 'Failed to add gift wrapping'); }
    finally { setSavingGift(false); }
  };

  const handleRemoveGiftWrapping = async () => {
    try {
      const res = await axios.patch(`${API_BASE}/cart/remove/cart/item/gift`, { ownerId: userId });
      if (res.data.success) { setIsGiftWrapped(false); setGiftData({ recipentName: '', senderName: '', messageFromSender: '' }); await fetchCartData(); }
    } catch (e: any) { alert(e.response?.data?.message || 'Failed to remove gift wrapping'); }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) { setCouponError('Please enter a coupon code'); return; }
    setApplyingCoupon(true); setCouponError('');
    try {
      const vRes = await axios.post(`${API_BASE}/coupen/apply/coupen`, { code: couponCode, totalCartAmount: cartData.grandTotal, currentDate: new Date().toISOString() });
      if (vRes.data.success) {
        const pct = vRes.data.discountPercentage;
        const da = recalculateCouponDiscount(cartData.grandTotal, pct);
        const uRes = await axios.patch(`${API_BASE}/cart/add/coupendiscount/amount`, { userId, couponCode, couponDiscountPercentage: pct });
        if (uRes.data.success) { setAppliedCoupon({ code: couponCode, discountPercentage: pct, discountAmount: da }); await fetchCartData(); }
        else { setCouponError(uRes.data.message); }
      } else { setCouponError(vRes.data.message); }
    } catch (e: any) { setCouponError(e.response?.data?.message || 'Failed to apply coupon'); }
    finally { setApplyingCoupon(false); }
  };

  const handleRemoveCoupon = async () => {
    try {
      await axios.patch(`${API_BASE}/cart/add/coupendiscount/amount`, { userId, couponCode: null, couponDiscountPercentage: 0 });
      setAppliedCoupon(null); setCouponCode(''); setCouponError(''); await fetchCartData();
    } catch { alert('Failed to remove coupon'); }
  };

  const handleDeleteClick = (product: any) => { setSelectedProduct(product); setDeleteDialogOpen(true); };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      setProcessingItems((p: any) => ({ ...p, [selectedProduct.productId]: true }));
      const res = await axios.delete(`${API_BASE}/cart/delete/product/user/cart`, { data: { userId, productId: selectedProduct.productId } });
      if (res.data.success) {
        const item = cartData.cart.find((i: any) => i.productId === selectedProduct.productId);
        const iTotal = item.quantity * item.product.originalPrice;
        const iDiscount = iTotal - (item.quantity * item.product.discountPrice);
        const newGT = cartData.grandTotal - (iTotal - iDiscount);
        if (appliedCoupon) setAppliedCoupon({ ...appliedCoupon, discountAmount: recalculateCouponDiscount(newGT, appliedCoupon.discountPercentage) });
        setCartData((p: any) => ({ ...p, cart: p.cart.filter((i: any) => i.productId !== selectedProduct.productId), totalItems: p.totalItems - item.quantity, totalOrginalPrice: p.totalOrginalPrice - iTotal, totalDiscount: p.totalDiscount - iDiscount, grandTotal: newGT, priceSaved: p.priceSaved - iDiscount }));
        setDeleteDialogOpen(false); setSelectedProduct(null);
      }
    } catch { fetchCartData(); }
    finally { setProcessingItems((p: any) => ({ ...p, [selectedProduct?.productId]: false })); }
  };

  const handleMoveToWishlist = async () => {
    if (!selectedProduct) return;
    try {
      setProcessingItems((p: any) => ({ ...p, [selectedProduct.productId]: true }));
      const res = await axios.patch(`${API_BASE}/cart/move/product/cart/to/wishlist`, { userId, productId: selectedProduct.productId });
      if (res.data.success) {
        const item = cartData.cart.find((i: any) => i.productId === selectedProduct.productId);
        const iTotal = item.quantity * item.product.originalPrice;
        const iDiscount = iTotal - (item.quantity * item.product.discountPrice);
        const newGT = cartData.grandTotal - (iTotal - iDiscount);
        if (appliedCoupon) setAppliedCoupon({ ...appliedCoupon, discountAmount: recalculateCouponDiscount(newGT, appliedCoupon.discountPercentage) });
        setCartData((p: any) => ({ ...p, cart: p.cart.filter((i: any) => i.productId !== selectedProduct.productId), totalItems: p.totalItems - item.quantity, totalOrginalPrice: p.totalOrginalPrice - iTotal, totalDiscount: p.totalDiscount - iDiscount, grandTotal: newGT, priceSaved: p.priceSaved - iDiscount }));
        setDeleteDialogOpen(false); setSelectedProduct(null);
      }
    } catch { fetchCartData(); }
    finally { setProcessingItems((p: any) => ({ ...p, [selectedProduct?.productId]: false })); }
  };

  const handleIncreaseQuantity = async (productId: string, currentQty: number) => {
    try {
      setProcessingItems((p: any) => ({ ...p, [productId]: true }));
      const item = cartData.cart.find((i: any) => i.productId === productId);
      const newGT = cartData.grandTotal + item.product.discountPrice;
      if (appliedCoupon) setAppliedCoupon({ ...appliedCoupon, discountAmount: recalculateCouponDiscount(newGT, appliedCoupon.discountPercentage) });
      setCartData((p: any) => ({ ...p, cart: p.cart.map((i: any) => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i), totalItems: p.totalItems + 1, totalOrginalPrice: p.totalOrginalPrice + item.product.originalPrice, totalDiscount: p.totalDiscount + (item.product.originalPrice - item.product.discountPrice), grandTotal: newGT, priceSaved: p.priceSaved + (item.product.originalPrice - item.product.discountPrice) }));
      const res = await axios.patch(`${API_BASE}/cart/update/product/count`, { userId, productId, productCount: currentQty });
      if (!res.data.success) fetchCartData();
    } catch { fetchCartData(); }
    finally { setProcessingItems((p: any) => ({ ...p, [productId]: false })); }
  };

  const handleDecreaseQuantity = async (productId: string, currentQty: number) => {
    if (currentQty <= 1) return;
    try {
      setProcessingItems((p: any) => ({ ...p, [productId]: true }));
      const item = cartData.cart.find((i: any) => i.productId === productId);
      const newGT = cartData.grandTotal - item.product.discountPrice;
      if (appliedCoupon) setAppliedCoupon({ ...appliedCoupon, discountAmount: recalculateCouponDiscount(newGT, appliedCoupon.discountPercentage) });
      setCartData((p: any) => ({ ...p, cart: p.cart.map((i: any) => i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i), totalItems: p.totalItems - 1, totalOrginalPrice: p.totalOrginalPrice - item.product.originalPrice, totalDiscount: p.totalDiscount - (item.product.originalPrice - item.product.discountPrice), grandTotal: newGT, priceSaved: p.priceSaved - (item.product.originalPrice - item.product.discountPrice) }));
      const res = await axios.patch(`${API_BASE}/cart/decrease/product/count`, { userId, productId, productCount: currentQty });
      if (!res.data.success) fetchCartData();
    } catch { fetchCartData(); }
    finally { setProcessingItems((p: any) => ({ ...p, [productId]: false })); }
  };

  const couponDiscountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const giftWrappingCharge  = cartData?.isAddingAsGift ? (cartData.addAsGiftPrice || 250) : 0;
  const shippingCharge      = cartData?.shippingCharge || 0;
  const subtotal            = cartData?.grandTotal || 0;
  const finalGrandTotal     = subtotal - couponDiscountAmount + giftWrappingCharge + shippingCharge;

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center gap-4"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap'); .cart-serif { font-family: 'Cormorant Garamond', serif; }`}</style>
          <Link href="/"><span className="cart-serif text-3xl font-light tracking-[0.2em] text-[#1a1a1a]">ARTTAG</span></Link>
          <div className="w-6 h-6 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs tracking-[0.15em] uppercase text-[#888]">Loading your bag…</p>
        </div>
      </>
    );
  }

  /* ── Empty ── */
  if (!cartData || cartData.cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center gap-6 px-4"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap'); .cart-serif { font-family: 'Cormorant Garamond', serif; }`}</style>
          <ShoppingBag size={48} className="text-[#d4cfc8]" />
          <div className="text-center">
            <h2 className="cart-serif text-4xl font-light text-[#1a1a1a] mb-2">Your bag is empty</h2>
            <p className="text-sm text-[#888]">Add something beautiful to get started.</p>
          </div>
          <Link href="/">
            <button className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-8 py-3 text-[10px] tracking-[0.18em] uppercase font-semibold rounded-sm hover:bg-[#333] transition-colors">
              Continue Shopping <ArrowRight size={13} />
            </button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .cart-serif { font-family: 'DM Sans', sans-serif; }
        .cart-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }

        /* Input */
        .cart-input {
          width: 100%; padding: 9px 12px; font-size: 13px;
          border: 1px solid #e8e4de; border-radius: 2px;
          background: #fff; color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.2s;
        }
        .cart-input:focus { border-color: #1a1a1a; }
        .cart-input::placeholder { color: #ccc; }

        /* Buttons */
        .cart-primary-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 7px;
          background: #1a1a1a; color: #fff; border: none;
          padding: 14px 24px; font-size: 11px; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: background 0.2s;
          font-family: 'DM Sans', sans-serif; width: 100%;
        }
        .cart-primary-btn:hover:not(:disabled) { background: #333; }
        .cart-primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .cart-outline-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          background: transparent; color: #888; border: 1px solid #e8e4de;
          padding: 8px 16px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .cart-outline-btn:hover:not(:disabled) { border-color: #1a1a1a; color: #1a1a1a; }
        .cart-outline-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .cart-icon-btn {
          width: 28px; height: 28px; border-radius: 2px;
          border: 1px solid #e8e4de; background: #faf9f7;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #888; transition: all 0.15s;
        }
        .cart-icon-btn:hover { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }

        /* Qty button */
        .qty-btn {
          width: 28px; height: 28px; border-radius: 2px;
          border: 1px solid #e8e4de; background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #888; transition: all 0.15s; flex-shrink: 0;
        }
        .qty-btn:hover:not(:disabled) { border-color: #1a1a1a; color: #1a1a1a; }
        .qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Cart item card */
        .cart-item-card {
          background: #fff; border: 1px solid #e8e4de; border-radius: 2px;
          padding: 20px; transition: box-shadow 0.2s, border-color 0.2s;
        }
        .cart-item-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); border-color: #d4cfc8; }

        /* Summary panel */
        .summary-panel {
          background: #fff; border: 1px solid #e8e4de; border-radius: 2px;
          padding: 24px; position: sticky; top: 80px;
        }

        /* Accordion row */
        .accord-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 0; cursor: pointer; transition: opacity 0.15s;
        }
        .accord-row:hover { opacity: 0.75; }

        /* Discount badge */
        .disc-badge {
          font-size: 10px; font-weight: 600; letter-spacing: 0.06em;
          color: #1e8449; background: #eafaf1; border: 1px solid #a9dfbf;
          padding: 2px 8px; border-radius: 2px;
        }

        /* Alert */
        .cart-alert {
          display: flex; align-items: flex-start; gap: 8px; padding: 10px 12px;
          border-radius: 2px; border: 1px solid; font-size: 12px;
        }
        .cart-alert.success { background: #eafaf1; border-color: #a9dfbf; color: #1e8449; }
        .cart-alert.error   { background: #fdecea; border-color: #f5b7b1; color: #c0392b; }

        /* Skeleton */
        .cart-skel {
          background: linear-gradient(90deg, #f5f3ef 0%, #ece9e3 50%, #f5f3ef 100%);
          background-size: 200% 100%;
          animation: cSkel 1.4s ease-in-out infinite;
          border-radius: 2px;
        }
        @keyframes cSkel {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <Navbar page={"cart"} />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-14">

        {/* ── Page header ── */}
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.24em] uppercase text-[#888] mb-1">Your</p>
          <h1 className="cart-serif text-5xl font-light text-[#1a1a1a]">Shopping Bag</h1>
          <p className="text-sm text-[#888] mt-1.5">
            {cartData.totalItems} {cartData.totalItems === 1 ? 'item' : 'items'} selected
          </p>
        </div>

        <div className="cart-divider mb-10" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 items-start">

          {/* ── Cart items ── */}
          <div className="space-y-4">
            {cartData.cart.map((item: any) => {
              const savePct = Math.round(((item.product.originalPrice - item.product.discountPrice) / item.product.originalPrice) * 100);
              return (
                <div key={item.id} className="cart-item-card">
                  <div className="flex gap-5">
                    {/* Image */}
                    <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden rounded-sm border border-[#e8e4de] bg-[#f5f3ef]">
                      <img
                        src={item.product.primaryImage1}
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="cart-serif text-xl font-light text-[#1a1a1a] leading-snug line-clamp-2 flex-1">
                          {item.product.name}
                        </h3>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          disabled={processingItems[item.productId]}
                          className="cart-icon-btn flex-shrink-0"
                          title="Remove"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Price row */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="cart-serif text-2xl font-light text-[#1a1a1a]">
                          ₹{(item.product.discountPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <span className="text-sm text-[#aaa] line-through">
                          ₹{(item.product.originalPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <span className="disc-badge">{savePct}% off</span>
                      </div>

                      {item.product.shortDescription && (
                        <p className="text-xs text-[#888] leading-relaxed mb-3 line-clamp-1">
                          {item.product.shortDescription}
                        </p>
                      )}

                      {/* Quantity + delivery */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] tracking-[0.1em] uppercase text-[#888] font-semibold">Qty</span>
                          <div className="flex items-center gap-2 bg-[#faf9f7] border border-[#e8e4de] rounded-sm px-2 py-1">
                            <button
                              className="qty-btn border-0 bg-transparent"
                              onClick={() => handleDecreaseQuantity(item.productId, item.quantity)}
                              disabled={processingItems[item.productId] || item.quantity <= 1}
                            >
                              <Minus size={13} />
                            </button>
                            <span className="text-sm font-semibold text-[#1a1a1a] w-5 text-center">
                              {processingItems[item.productId]
                                ? <Loader2 size={12} className="animate-spin inline" />
                                : item.quantity
                              }
                            </span>
                            <button
                              className="qty-btn border-0 bg-transparent"
                              onClick={() => handleIncreaseQuantity(item.productId, item.quantity)}
                              disabled={processingItems[item.productId]}
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>

                        {item.product.delivery && (
                          <p className="text-[11px] text-[#27ae60] flex items-center gap-1.5 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#27ae60] flex-shrink-0" />
                            {item.product.delivery}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Order summary panel ── */}
          <div className="summary-panel">
            <h2 className="cart-serif text-2xl font-light text-[#1a1a1a] mb-5">Order Summary</h2>
            <div className="cart-divider mb-5" />

            {/* Check Delivery */}
            <div className="mb-0 border-b border-[#f0ece6]">
              <div className="accord-row" onClick={() => setShowPincodeCheck(!showPincodeCheck)}>
                <div className="flex items-center gap-2.5">
                  <MapPin size={15} className="text-[#888]" />
                  <span className="text-xs tracking-[0.08em] uppercase font-semibold text-[#555]">Check Delivery</span>
                </div>
                <ChevronDown size={14} className={`text-[#aaa] transition-transform ${showPincodeCheck ? 'rotate-180' : ''}`} />
              </div>
              {showPincodeCheck && (
                <div className="pb-4 space-y-2.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pincode}
                      onChange={e => { const v = e.target.value.replace(/\D/g, ''); if (v.length <= 6) { setPincode(v); setPincodeStatus(null); } }}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      className="cart-input flex-1"
                    />
                    <button
                      onClick={handleCheckPincode}
                      disabled={pincodeChecking || pincode.length !== 6}
                      className="cart-outline-btn flex-shrink-0 px-3"
                    >
                      {pincodeChecking ? <Loader2 size={13} className="animate-spin" /> : 'Check'}
                    </button>
                  </div>
                  {pincodeStatus && (
                    <div className={`cart-alert ${pincodeStatus.success ? 'success' : 'error'}`}>
                      {pincodeStatus.success ? <Check size={13} className="flex-shrink-0 mt-0.5" /> : <X size={13} className="flex-shrink-0 mt-0.5" />}
                      <span>{pincodeStatus.success ? 'Delivery available · 2–4 days' : pincodeStatus.message}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Gift Wrapping */}
            <div className="border-b border-[#f0ece6]">
              <div className="accord-row" onClick={() => !isGiftWrapped && setShowGiftDialog(true)}>
                <div className="flex items-center gap-2.5">
                  <Gift size={15} className="text-[#888]" />
                  <div>
                    <span className="text-xs tracking-[0.08em] uppercase font-semibold text-[#555]">Gift Wrapping</span>
                    <p className="text-[10px] text-[#aaa] mt-0.5">+₹250</p>
                  </div>
                </div>
                {isGiftWrapped ? (
                  <button className="cart-outline-btn py-1 px-2 text-[9px]" onClick={e => { e.stopPropagation(); handleRemoveGiftWrapping(); }}>
                    Remove
                  </button>
                ) : (
                  <button className="text-[10px] tracking-[0.1em] uppercase font-semibold text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5 hover:opacity-60 transition-opacity">
                    Add
                  </button>
                )}
              </div>
              {isGiftWrapped && giftData.recipentName && (
                <div className="pb-3">
                  <div className="cart-alert success">
                    <Check size={12} className="flex-shrink-0 mt-0.5" />
                    <span>To: {giftData.recipentName} · From: {giftData.senderName}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Coupons */}
            <div className="border-b border-[#f0ece6]">
              <div className="accord-row" onClick={() => setShowCoupons(!showCoupons)}>
                <div className="flex items-center gap-2.5">
                  <Tag size={15} className="text-[#888]" />
                  <span className="text-xs tracking-[0.08em] uppercase font-semibold text-[#555]">
                    {appliedCoupon ? `${appliedCoupon.code} applied` : 'Coupons & Offers'}
                  </span>
                </div>
                <ChevronDown size={14} className={`text-[#aaa] transition-transform ${showCoupons ? 'rotate-180' : ''}`} />
              </div>
              {showCoupons && (
                <div className="pb-4 space-y-2.5">
                  {appliedCoupon ? (
                    <div className="cart-alert success">
                      <Check size={12} className="flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-semibold">{appliedCoupon.code}</span> — saved ₹{couponDiscountAmount.toFixed(2)}
                      </div>
                      <button onClick={handleRemoveCoupon} className="text-[#c0392b] text-[10px] uppercase tracking-wider font-semibold flex-shrink-0">Remove</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                          placeholder="Enter coupon code"
                          className="cart-input flex-1"
                          style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}
                          disabled={applyingCoupon}
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={applyingCoupon || !couponCode.trim()}
                          className="cart-outline-btn flex-shrink-0 px-3"
                        >
                          {applyingCoupon ? <Loader2 size={13} className="animate-spin" /> : 'Apply'}
                        </button>
                      </div>
                      {couponError && <p className="text-[11px] text-[#c0392b]">{couponError}</p>}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Price breakdown */}
            <div className="mt-5 space-y-3 mb-5">
              <div className="flex justify-between text-sm text-[#555]">
                <span>Item Total ({cartData.totalItems} items)</span>
                <span className="font-medium text-[#1a1a1a]">₹{cartData.totalOrginalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#888]">Discount</span>
                <span className="text-[#27ae60] font-medium">−₹{cartData.totalDiscount.toLocaleString('en-IN')}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#888]">Coupon ({appliedCoupon.code})</span>
                  <span className="text-[#e67e22] font-medium">−₹{couponDiscountAmount.toFixed(2)}</span>
                </div>
              )}
              {isGiftWrapped && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#888]">Gift Wrapping</span>
                  <span className="text-[#555] font-medium">+₹{giftWrappingCharge}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-[#888]">Shipping</span>
                <span className={`font-medium ${shippingCharge === 0 ? 'text-[#27ae60]' : 'text-[#555]'}`}>
                  {shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}
                </span>
              </div>
            </div>

            <div className="cart-divider mb-5" />

            <div className="flex justify-between items-end mb-1">
              <span className="text-sm font-semibold text-[#1a1a1a] tracking-[0.04em]">Grand Total</span>
              <span className="cart-serif text-3xl font-light text-[#1a1a1a]">₹{finalGrandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between mb-6">
              <span className="text-[10px] text-[#aaa]">Inclusive of taxes</span>
              <span className="text-[10px] text-[#27ae60] font-semibold">
                You saved ₹{(cartData.priceSaved + couponDiscountAmount).toFixed(2)}
              </span>
            </div>

            <Link href={`/${userId}/order/checkout`}>
              <button className="cart-primary-btn">
                Proceed to Checkout <ArrowRight size={14} />
              </button>
            </Link>

            <div className="flex items-center justify-center gap-2 mt-4">
              <Lock size={11} className="text-[#aaa]" />
              <span className="text-[10px] text-[#aaa] tracking-[0.08em]">Secured by SSL encryption</span>
            </div>
          </div>
        </div>
      </div>

      {/* ════════ DELETE DIALOG ════════ */}
      <Modal open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} title="Remove from Bag?" eyebrow="Confirm">
        {selectedProduct && (
          <div className="flex gap-4 mb-5 bg-[#faf9f7] border border-[#e8e4de] rounded-sm p-3">
            <img src={selectedProduct.product.primaryImage1} alt={selectedProduct.product.name}
              className="w-16 h-16 object-cover rounded-sm border border-[#e8e4de] flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#1a1a1a] line-clamp-2">{selectedProduct.product.name}</p>
              <p className="text-xs text-[#888] mt-0.5">₹{selectedProduct.product.discountPrice} × {selectedProduct.quantity}</p>
            </div>
          </div>
        )}
        <p className="text-sm text-[#666] mb-5 leading-relaxed">Do you want to remove this item or save it to your wishlist?</p>
        <div className="flex gap-3">
          <button
            onClick={handleConfirmDelete}
            disabled={processingItems[selectedProduct?.productId]}
            className="cart-outline-btn flex-1 py-2.5"
          >
            {processingItems[selectedProduct?.productId] ? <Loader2 size={13} className="animate-spin" /> : <><Trash2 size={12} /> Remove</>}
          </button>
          <button
            onClick={handleMoveToWishlist}
            disabled={processingItems[selectedProduct?.productId]}
            className="flex-1 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.14em] uppercase font-semibold rounded-sm hover:bg-[#333] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {processingItems[selectedProduct?.productId] ? <Loader2 size={13} className="animate-spin" /> : <><Heart size={12} /> Wishlist</>}
          </button>
        </div>
      </Modal>

      {/* ════════ GIFT DIALOG ════════ */}
      <Modal open={showGiftDialog} onClose={() => setShowGiftDialog(false)} title="Add Gift Wrapping" eyebrow="Special Delivery · ₹250">
        <p className="text-sm text-[#888] mb-5 leading-relaxed">Make your gift extra special with premium wrapping and a personalised message.</p>
        <div className="space-y-4">
          <Field label="Recipient Name" required>
            <input value={giftData.recipentName} onChange={e => setGiftData({ ...giftData, recipentName: e.target.value })}
              placeholder="Who is this for?" className="cart-input" disabled={savingGift} />
          </Field>
          <Field label="Sender Name" required>
            <input value={giftData.senderName} onChange={e => setGiftData({ ...giftData, senderName: e.target.value })}
              placeholder="Your name" className="cart-input" disabled={savingGift} />
          </Field>
          <Field label="Gift Message (optional)">
            <textarea value={giftData.messageFromSender} onChange={e => setGiftData({ ...giftData, messageFromSender: e.target.value })}
              placeholder="Write a personalised message…" rows={3} className="cart-input" style={{ resize: 'none' }} disabled={savingGift} />
          </Field>
        </div>
        <div className="cart-divider my-5" />
        <div className="flex gap-3">
          <button onClick={() => setShowGiftDialog(false)} className="cart-outline-btn flex-1 py-2.5" disabled={savingGift}>Cancel</button>
          <button
            onClick={handleAddGiftWrapping}
            disabled={savingGift || !giftData.recipentName || !giftData.senderName}
            className="flex-1 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.14em] uppercase font-semibold rounded-sm hover:bg-[#333] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {savingGift ? <Loader2 size={13} className="animate-spin" /> : <><Gift size={12} /> Save Gift</>}
          </button>
        </div>
      </Modal>

      <div className="cart-divider" />
      <FooterPart />
    </div>
  );
};

export default ShoppingCart;