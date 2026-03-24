'use client'
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Home, ArrowRight, Package } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const [visible, setVisible]   = useState(false);
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center px-4 py-16"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .os-serif { font-family: 'Cormorant Garamond', serif; }
        .os-divider { height: 1px; background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent); }
        @keyframes os-ring {
          0%   { transform: scale(0.85); opacity: 0; }
          60%  { transform: scale(1.06); opacity: 1; }
          100% { transform: scale(1);    opacity: 1; }
        }
        .os-icon-wrap { animation: os-ring 0.5s ease forwards; }
      `}</style>

      <div
        className="w-full max-w-[440px] transition-all duration-500"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <span className="os-serif text-2xl font-light tracking-[0.26em] text-[#1a1a1a] hover:opacity-60 transition-opacity">
              ARTTAG
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#e8e4de] rounded-sm px-8 py-10 flex flex-col items-center text-center">

          {/* Icon */}
          <div className="os-icon-wrap w-16 h-16 border-2 border-[#1a1a1a] rounded-sm flex items-center justify-center mb-7">
            <CheckCircle2 size={28} className="text-[#1a1a1a]" strokeWidth={1.5} />
          </div>

          {/* Heading */}
          <p className="text-[10px] tracking-[0.26em] uppercase text-[#aaa] mb-2">Order Confirmed</p>
          <h1 className="os-serif text-4xl font-light text-[#1a1a1a] leading-snug mb-4">
            Thank you for<br />your purchase
          </h1>

          <div className="os-divider w-full mb-5" />

          <p className="text-sm text-[#888] leading-relaxed mb-8 max-w-xs">
            Your order has been successfully placed. You'll receive a confirmation on your registered contact.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full">
            {userId && (
              <button
                onClick={() => router.push(`/${userId}/profile`)}
                className="w-full flex items-center justify-center gap-2 border border-[#e8e4de] text-[#555] py-3 text-[10px] tracking-[0.14em] uppercase font-semibold rounded-sm hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
              >
                <Package size={13} /> View My Orders
              </button>
            )}
            <button
              onClick={() => router.push('/')}
              className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] text-white py-3 text-[10px] tracking-[0.14em] uppercase font-semibold rounded-sm hover:bg-[#333] transition-colors"
            >
              <Home size={13} /> Back to Home <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] text-[#aaa] mt-6 leading-relaxed">
          Need help?{' '}
          <a href="mailto:support@arttag.in"
            className="text-[#555] border-b border-[#d4cfc8] hover:border-[#555] transition-colors">
            support@arttag.in
          </a>
        </p>
      </div>
    </div>
  );
}