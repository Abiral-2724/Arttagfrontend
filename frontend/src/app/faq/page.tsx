'use client'
import React, { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';

const faqs = [
  { q: 'What products do you offer?',         a: 'Premium skins for laptops, mobiles, and gadgets — crafted with high-quality materials and precision-cut designs.' },
  { q: 'Are the skins easy to apply?',        a: 'Yes. Every skin comes with bubble-free adhesive and a precision cut, making application straightforward even for first-timers.' },
  { q: 'Will skins damage my device?',        a: 'No. We use safe, residue-free adhesive that peels off cleanly without leaving marks or damaging your device.' },
  { q: 'Can I order a custom design?',        a: 'Absolutely. We offer custom design options — reach out to us at support@arttag.in to discuss your requirements.' },
  { q: 'What is the delivery time?',          a: 'Standard delivery takes 5–7 working days. Actual timelines may vary slightly depending on your location.' },
  { q: 'What if I receive a damaged product?', a: 'Contact us within 7 days of delivery with your order ID and photo proof. We\'ll arrange a replacement promptly.' },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .faq-serif { font-family: 'Cormorant Garamond', serif; }
        .faq-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }
        .faq-item {
          border-bottom: 1px solid #f0ece6;
          overflow: hidden;
        }
        .faq-item:first-child { border-top: 1px solid #f0ece6; }
        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s ease, opacity 0.25s ease;
          opacity: 0;
        }
        .faq-answer.open {
          max-height: 400px;
          opacity: 1;
        }
      `}</style>

      <Navbar />

      <div className="max-w-[760px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20">

        {/* Header */}
        <div className="mb-12">
          <p className="text-[10px] tracking-[0.28em] uppercase text-[#888] mb-3">Help</p>
          <h1 className="faq-serif text-5xl sm:text-6xl font-light text-[#1a1a1a] mb-4">
            Frequently Asked<br />Questions
          </h1>
          <div className="faq-divider" />
        </div>

        {/* FAQ list */}
        <div>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="faq-item">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="faq-serif text-lg font-light text-[#ccc] w-6 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-sm sm:text-base font-medium text-[#1a1a1a] group-hover:text-[#555] transition-colors">
                      {faq.q}
                    </span>
                  </div>
                  <div className={`w-6 h-6 border border-[#e8e4de] rounded-sm flex items-center justify-center flex-shrink-0 transition-all ${isOpen ? 'bg-[#1a1a1a] border-[#1a1a1a] rotate-45' : 'bg-transparent'}`}>
                    <Plus size={13} className={isOpen ? 'text-white' : 'text-[#888]'} />
                  </div>
                </button>
                <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
                  <p className="text-sm text-[#555] leading-relaxed pb-5 pl-10">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="faq-divider mt-12 mb-8" />
        <p className="text-xs text-[#aaa] leading-relaxed">
          Can't find what you're looking for?{' '}
          <a href="mailto:support@arttag.in" className="text-[#1a1a1a] border-b border-[#d4cfc8] hover:border-[#1a1a1a] transition-colors">
            Contact our support team
          </a>
          .
        </p>
      </div>
    </div>
  );
}