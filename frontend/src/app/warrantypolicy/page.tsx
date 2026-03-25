import Navbar from '@/components/Navbar';
import React from 'react';

const sections = [
  {
    number: '01',
    title: 'Our Warranty',
    body: 'We offer a 7-day replacement warranty for issues including misprints, manufacturing defects, or incorrect items dispatched. If your product arrives with any of these issues, we\'ll make it right.',
  },
  {
    number: '02',
    title: 'What Is Not Covered',
    points: [
      'Wrong model or variant selected by the customer at the time of ordering.',
      'Damage caused during or after self-application.',
      'Normal wear and tear from daily use.',
      'Colour variations due to differences between device screens and print output.',
    ],
  },
  {
    number: '03',
    title: 'Replacement Process',
    body: 'To initiate a warranty claim, contact us within 7 days of delivery. Please include your order ID and clear photo or video proof of the issue. Once verified, we will dispatch a replacement at no additional charge.',
  },
];

export default function WarrantyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .wp-serif { font-family: 'Cormorant Garamond', serif; }
        .wp-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }
        .wp-bullet {
          width: 5px; height: 5px; border-radius: 50%;
          background: #1a1a1a; flex-shrink: 0; margin-top: 8px;
        }
      `}</style>

      <Navbar />

      <div className="max-w-[860px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20">

        {/* Header */}
        <div className="mb-12">
          <p className="text-[10px] tracking-[0.28em] uppercase text-[#888] mb-3">Legal · Coverage</p>
          <h1 className="wp-serif text-5xl sm:text-6xl font-light text-[#1a1a1a] leading-tight mb-4">
            Warranty Policy
          </h1>
          <div className="wp-divider my-6" />
          <p className="text-xs tracking-[0.14em] uppercase text-[#aaa]">
            Last updated —{' '}
            {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-0">
          {sections.map((s, i) => (
            <div key={s.number}>
              <div className="grid grid-cols-[48px_1fr] sm:grid-cols-[64px_1fr] gap-6 sm:gap-10 py-10">
                <div className="pt-1">
                  <span className="wp-serif text-3xl sm:text-4xl font-light text-[#d4cfc8]">{s.number}</span>
                </div>
                <div>
                  <h2 className="wp-serif text-2xl sm:text-3xl font-light text-[#1a1a1a] mb-4">{s.title}</h2>
                  {s.body && (
                    <p className="text-sm sm:text-base text-[#555] leading-relaxed">{s.body}</p>
                  )}
                  {s.points && (
                    <ul className="space-y-3">
                      {s.points.map((p, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm sm:text-base text-[#555] leading-relaxed">
                          <div className="wp-bullet" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              {i < sections.length - 1 && <div className="wp-divider" />}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="wp-divider mt-12 mb-8" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-[#aaa] leading-relaxed max-w-sm">
            Questions about a claim? Contact us at{' '}
            <a href="mailto:support@arttag.in" className="text-[#1a1a1a] border-b border-[#d4cfc8] hover:border-[#1a1a1a] transition-colors">
              support@arttag.in
            </a>
          </p>
          <p className="text-[10px] tracking-[0.16em] uppercase text-[#ccc]">Arttag © 2025</p>
        </div>
      </div>
    </div>
  );
}