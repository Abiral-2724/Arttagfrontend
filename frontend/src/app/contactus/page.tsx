import React from 'react';
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'support@arttag.in',
    sub: 'We respond within 24 hours',
    link: 'mailto:support@arttag.in',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 94070 68809',
    sub: 'Call us during support hours',
    link: 'tel:+919407068809',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: 'Smart City, Gwalior',
    sub: 'Madhya Pradesh – 474001',
    link: null,
  },
  {
    icon: Clock,
    label: 'Support Hours',
    value: 'Mon – Sat',
    sub: '10 AM – 7 PM IST',
    link: null,
  },
];

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .cu-serif { font-family: 'Cormorant Garamond', serif; }
        .cu-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }
        .cu-card {
          background: #fff;
          border: 1px solid #e8e4de;
          border-radius: 2px;
          padding: 24px;
          transition: box-shadow 0.22s ease, border-color 0.22s ease, transform 0.22s ease;
          display: flex;
          align-items: flex-start;
          gap: 18px;
          text-decoration: none;
          color: inherit;
        }
        .cu-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.07);
          border-color: #d4cfc8;
          transform: translateY(-2px);
        }
        .cu-icon {
          width: 42px; height: 42px;
          border: 1px solid #e8e4de;
          border-radius: 2px;
          background: #f5f3ef;
          display: flex; align-items: center; justify-content: center;
          color: #888; flex-shrink: 0;
          transition: all 0.2s;
        }
        .cu-card:hover .cu-icon {
          background: #1a1a1a;
          color: #fff;
          border-color: #1a1a1a;
        }
        .cu-arrow {
          margin-left: auto;
          color: #d4cfc8;
          transition: all 0.2s;
          flex-shrink: 0;
          align-self: center;
        }
        .cu-card:hover .cu-arrow {
          color: #1a1a1a;
          transform: translate(3px, -3px);
        }
      `}</style>

      <Navbar />

      <div className="max-w-[860px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20">

        {/* ── Header ── */}
        <div className="mb-12">
          <p className="text-[10px] tracking-[0.28em] uppercase text-[#888] mb-3">Support</p>
          <h1 className="cu-serif text-5xl sm:text-6xl font-light text-[#1a1a1a] leading-tight mb-4">
            Contact Us
          </h1>
          <div className="cu-divider my-6" />
          <p className="text-base text-[#555] leading-relaxed max-w-[520px]">
            Have a question or need help with an order? Our support team is here for you. Reach out through any of the channels below.
          </p>
        </div>

        {/* ── Contact cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {contactInfo.map((info, i) => {
            const Icon = info.icon;
            const Tag: any = info.link ? 'a' : 'div';
            return (
              <Tag
                key={i}
                href={info.link || undefined}
                className="cu-card"
              >
                <div className="cu-icon">
                  <Icon size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] tracking-[0.14em] uppercase font-semibold text-[#aaa] mb-1">
                    {info.label}
                  </p>
                  <p className="text-sm font-semibold text-[#1a1a1a] leading-snug">
                    {info.value}
                  </p>
                  <p className="text-xs text-[#888] mt-0.5">{info.sub}</p>
                </div>
                {info.link && <ArrowRight size={16} className="cu-arrow" />}
              </Tag>
            );
          })}
        </div>

        {/* ── Divider + footnote ── */}
        <div className="cu-divider mb-8" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-[#aaa] leading-relaxed max-w-sm">
            For order-related queries, please keep your Order ID handy. We aim to respond to all enquiries within one business day.
          </p>
          <p className="text-[10px] tracking-[0.16em] uppercase text-[#ccc]">Arttag © 2025</p>
        </div>
      </div>
    </div>
  );
}