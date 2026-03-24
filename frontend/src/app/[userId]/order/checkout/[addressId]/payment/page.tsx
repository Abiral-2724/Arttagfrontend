'use client'
import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, ShoppingBag, Truck, CheckCircle2, Package,
  Tag, Gift, CreditCard, Banknote, ArrowRight, AlertCircle, Loader2,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const paymentMethods = [
  {
    id: 'ONLINE',
    name: 'Online Payment',
    sub: 'UPI, Cards, Net Banking, Wallets',
    icon: CreditCard,
  },
  {
    id: 'CASEONDELIVERY',
    name: 'Cash on Delivery',
    sub: 'Pay when your order arrives',
    icon: Banknote,
  },
];

export default function PaymentPage() {
  const { userId, addressId } = useParams();
  const router = useRouter();

  const [selectedPayment, setSelectedPayment] = useState('');
  const [orderSummary, setOrderSummary]       = useState({
    totalItem: 0, totalamount: 0, shippingCharge: 0,
    couponCode: null as string | null, couponDiscountPercentage: 0,
    isAddingAsGift: false, addAsGiftPrice: 0,
  });
  const [cartItems, setCartItems]     = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    const script    = document.createElement('script');
    script.src      = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async    = true;
    script.onload   = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  useEffect(() => { fetchCartDetails(); }, []);

  const fetchCartDetails = async () => {
    try {
      const [cartRes, sumRes] = await Promise.all([
        fetch(`${API_BASE_URL}/cart/${userId}/get/all/user/cart/product`),
        fetch(`${API_BASE_URL}/cart/${userId}/cart/summary`),
      ]);
      const cartData = await cartRes.json();
      const sumData  = await sumRes.json();
      if (cartData.success) setCartItems(cartData.cart || []);
      if (sumData.success) {
        setOrderSummary({
          totalItem: sumData.totalItem || 0, totalamount: sumData.totalamount || 0,
          shippingCharge: sumData.shippingCharge || 0, couponCode: sumData.couponCode || null,
          couponDiscountPercentage: sumData.couponDiscountPercentage || 0,
          isAddingAsGift: sumData.isAddingAsGift || false, addAsGiftPrice: sumData.addAsGiftPrice || 0,
        });
      } else setError(sumData.message || 'Failed to load cart details');
      setLoading(false);
    } catch { setError('Failed to load cart details.'); setLoading(false); }
  };

  const couponDiscount = orderSummary.couponDiscountPercentage > 0
    ? Math.round((orderSummary.totalamount * orderSummary.couponDiscountPercentage) / 100) : 0;
  const afterDiscount  = orderSummary.totalamount - couponDiscount;
  const grandTotal     = afterDiscount + orderSummary.shippingCharge + (orderSummary.isAddingAsGift ? orderSummary.addAsGiftPrice : 0);

  const clearCart = async () => {
    try {
      await fetch(`${API_BASE_URL}/cart/delete/all/items/cart`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
    } catch { console.warn('Cart clear failed'); }
  };

  const handleRazorpay = async (orderData: any) => {
    try {
      const res  = await fetch(`${API_BASE_URL}/payment/create/order`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount: grandTotal }),
      });
      const rpOrder = await res.json();
      if (!rpOrder.id) throw new Error('Failed to create Razorpay order');

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: rpOrder.amount, currency: rpOrder.currency,
        name: 'Arttag', description: 'Order Payment', order_id: rpOrder.id,
        handler: async (response: any) => {
          try {
            const verRes  = await fetch(`${API_BASE_URL}/payment/verify`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature }),
            });
            const verData = await verRes.json();
            if (verData.success) {
              const poRes  = await fetch(`${API_BASE_URL}/payment/place/user/new/order`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...orderData, razorpayOrderId: response.razorpay_order_id, razorpayPaymentId: response.razorpay_payment_id }),
              });
              const poData = await poRes.json();
              if (poData.success) { await clearCart(); router.push(`/${userId}/order/success`); }
              else setError(poData.message || 'Failed to place order');
            } else setError('Payment verification failed');
          } catch { setError('Payment verification failed. Please contact support.'); }
          finally { setSubmitting(false); }
        },
        modal: { ondismiss: () => { setSubmitting(false); setError('Payment cancelled.'); } },
        theme: { color: '#1a1a1a' },
      };
      new (window as any).Razorpay(options).open();
    } catch { setError('Failed to initialize payment.'); setSubmitting(false); }
  };

  const handlePlaceOrder = async () => {
    if (!selectedPayment) { setError('Please select a payment method'); return; }
    setSubmitting(true); setError('');
    try {
      const orderData = {
        userId, subtotal: orderSummary.totalamount, discountAmount: couponDiscount,
        shippingCharge: orderSummary.shippingCharge, taxAmount: 0,
        cart: cartItems, addressId, paymentType: selectedPayment,
      };
      if (selectedPayment === 'ONLINE') {
        await handleRazorpay(orderData);
      } else {
        const res  = await fetch(`${API_BASE_URL}/payment/place/user/new/order`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData),
        });
        const data = await res.json();
        if (data.success) { await clearCart(); router.push(`/${userId}/order/success`); }
        else setError(data.message || 'Failed to place order');
        setSubmitting(false);
      }
    } catch { setError('Failed to place order. Please try again.'); setSubmitting(false); }
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
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#888]">Loading payment options…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .py-serif { font-family: 'Cormorant Garamond', serif; }
        .py-divider { height: 1px; background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent); }
        .py-row { display: flex; align-items: center; justify-content: space-between; font-size: 13px; }

        .py-method {
          border: 1px solid #e8e4de; border-radius: 2px; padding: 16px 18px;
          background: #fff; cursor: pointer; transition: border-color 0.15s, box-shadow 0.15s;
          display: flex; align-items: center; gap: 14px;
        }
        .py-method.selected { border-color: #1a1a1a; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        .py-method:hover:not(.selected) { border-color: #d4cfc8; }

        .py-radio {
          width: 18px; height: 18px; border: 1.5px solid #d4cfc8; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: border-color 0.15s;
        }
        .py-method.selected .py-radio { border-color: #1a1a1a; }
        .py-radio-dot { width: 8px; height: 8px; border-radius: 50%; background: #1a1a1a; }

        .py-primary {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 7px;
          background: #1a1a1a; color: #fff; border: none; padding: 14px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: background 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .py-primary:hover:not(:disabled) { background: #333; }
        .py-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        .py-outline {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent; color: #888; border: 1px solid #e8e4de;
          padding: 9px 16px; font-size: 10px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase; border-radius: 2px;
          cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif;
        }
        .py-outline:hover { border-color: #1a1a1a; color: #1a1a1a; }
      `}</style>

      <Navbar />

      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] tracking-[0.26em] uppercase text-[#888] mb-1">Step 2 of 2</p>
          <h1 className="py-serif text-4xl sm:text-5xl font-light text-[#1a1a1a]">Payment</h1>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-[#fdecea] border border-[#f5b7b1] rounded-sm text-sm text-[#c0392b] mb-6">
            <AlertCircle size={14} className="flex-shrink-0" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* ── LEFT: Payment Methods ── */}
          <div className="space-y-4">
            <div className="bg-white border border-[#e8e4de] rounded-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e8e4de]">
                <CreditCard size={16} className="text-[#888]" />
                <h2 className="text-base font-semibold text-[#1a1a1a]">Payment Method</h2>
              </div>
              <div className="p-5 space-y-3">
                {paymentMethods.map((m) => {
                  const Icon = m.icon;
                  const sel  = selectedPayment === m.id;
                  return (
                    <div key={m.id} className={`py-method ${sel ? 'selected' : ''}`}
                      onClick={() => setSelectedPayment(m.id)}>
                      <div className="py-radio">{sel && <div className="py-radio-dot" />}</div>
                      <div className="w-9 h-9 border border-[#e8e4de] rounded-sm bg-[#f5f3ef] flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-[#888]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1a1a1a]">{m.name}</p>
                        <p className="text-xs text-[#aaa] mt-0.5">{m.sub}</p>
                      </div>
                      {sel && (
                        <span className="text-[9px] tracking-[0.1em] uppercase font-semibold px-2 py-0.5 bg-[#1a1a1a] text-white rounded-sm flex-shrink-0">
                          Selected
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <Link href={`/${userId}/cart`} className="inline-block">
              <button className="py-outline"><ArrowLeft size={12} /> Back to Cart</button>
            </Link>
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="bg-white border border-[#e8e4de] rounded-sm overflow-hidden lg:sticky lg:top-8">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e8e4de]">
              <ShoppingBag size={16} className="text-[#888]" />
              <h2 className="text-base font-semibold text-[#1a1a1a]">Order Summary</h2>
            </div>

            <div className="p-5 space-y-4">
              <div className="py-row">
                <div className="flex items-center gap-2 text-[#666]"><Package size={13} /><span>Items ({orderSummary.totalItem})</span></div>
                <span className="font-semibold text-[#1a1a1a]">₹{orderSummary.totalamount.toLocaleString()}</span>
              </div>

              {orderSummary.couponDiscountPercentage > 0 && (
                <div className="bg-[#eafaf1] border border-[#a9dfbf] rounded-sm p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag size={13} className="text-[#27ae60]" />
                    <span className="text-[10px] tracking-[0.1em] uppercase font-semibold text-[#1e8449]">Coupon Applied</span>
                  </div>
                  <div className="py-row">
                    <span className="text-xs text-[#555]">{orderSummary.couponCode}</span>
                    <span className="text-xs font-semibold text-[#27ae60]">{orderSummary.couponDiscountPercentage}% off</span>
                  </div>
                  <div className="py-row mt-1 pt-1 border-t border-[#a9dfbf]">
                    <span className="text-xs text-[#666]">Discount</span>
                    <span className="text-xs font-bold text-[#1e8449]">−₹{couponDiscount.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {orderSummary.couponDiscountPercentage > 0 && (
                <div className="py-row">
                  <span className="text-xs text-[#666]">After discount</span>
                  <span className="font-semibold text-[#27ae60]">₹{afterDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="py-row">
                <div className="flex items-center gap-2 text-[#666]"><Truck size={13} /><span>Delivery</span></div>
                {orderSummary.shippingCharge === 0
                  ? <span className="text-xs font-bold text-[#27ae60]">FREE</span>
                  : <span className="font-semibold text-[#1a1a1a]">₹{orderSummary.shippingCharge.toLocaleString()}</span>
                }
              </div>

              {orderSummary.isAddingAsGift && (
                <div className="bg-[#fef5e7] border border-[#f5cba7] rounded-sm p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift size={13} className="text-[#e67e22]" />
                      <div>
                        <p className="text-[10px] uppercase font-semibold text-[#935116] tracking-[0.08em]">Gift Packaging</p>
                        <p className="text-[10px] text-[#aaa]">Premium gift wrap</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#e67e22]">₹{orderSummary.addAsGiftPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="py-divider" />

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#aaa] font-semibold mb-0.5">Total</p>
                  <p className="text-2xl font-semibold text-[#1a1a1a]">₹{grandTotal.toLocaleString()}</p>
                  <p className="text-[10px] text-[#aaa] mt-0.5">All taxes included</p>
                </div>
                {couponDiscount > 0 && (
                  <span className="text-[10px] text-[#27ae60] font-semibold tracking-[0.06em]">
                    Saved ₹{couponDiscount.toLocaleString()}
                  </span>
                )}
              </div>

              <button
                className="py-primary"
                onClick={handlePlaceOrder}
                disabled={!selectedPayment || submitting || (selectedPayment === 'ONLINE' && !razorpayLoaded)}
              >
                {submitting
                  ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />{selectedPayment === 'ONLINE' ? 'Processing…' : 'Placing Order…'}</>
                  : selectedPayment
                    ? <><span>{selectedPayment === 'ONLINE' ? 'Pay Now' : 'Place Order'}</span><ArrowRight size={13} /></>
                    : 'Select Payment Method'
                }
              </button>

              <div className="space-y-1.5 pt-1">
                {['100% Secure payments', 'Easy returns & refunds'].map(t => (
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
    </div>
  );
}