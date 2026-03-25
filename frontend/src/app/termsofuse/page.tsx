import React from 'react';
import {
  Scale, ShieldCheck, FileText, Package, CreditCard,
  Truck, RefreshCcw, Copyright, AlertCircle, Edit3,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const sections = [
  {
    number: '01',
    icon: ShieldCheck,
    title: 'Acceptance of Terms',
    content: 'By visiting Arttag.in, placing an order, or interacting with our services, you acknowledge that you have read, understood, and agreed to these terms in their entirety.',
  },
  {
    number: '02',
    icon: FileText,
    title: 'Use of Website',
    points: [
      'You must use the website for lawful purposes only.',
      'You may not attempt to modify, distribute, or misuse any part of the website.',
      'All product images, descriptions, and content are the intellectual property of Arttag.',
    ],
  },
  {
    number: '03',
    icon: CreditCard,
    title: 'Orders & Payments',
    points: [
      'All orders placed through Arttag.in are subject to availability and confirmation.',
      'Prices may change without prior notice.',
      'Arttag reserves the right to cancel any order in case of payment issues, stock unavailability, or suspicious activity.',
    ],
  },
  {
    number: '04',
    icon: Truck,
    title: 'Shipping & Delivery',
    content: 'Delivery timelines may vary based on your location and order volume. We will communicate expected delivery windows at the time of purchase.',
  },
  {
    number: '05',
    icon: RefreshCcw,
    title: 'Returns, Refunds & Exchanges',
    content: 'Customised products are non-refundable unless a verified manufacturing defect exists. Please review our full returns policy for further detail.',
  },
  {
    number: '06',
    icon: Copyright,
    title: 'Intellectual Property',
    content: 'All content on Arttag.in — including text, images, logos, and product designs — belongs exclusively to Arttag and may not be reproduced without written permission.',
  },
  {
    number: '07',
    icon: AlertCircle,
    title: 'Limitation of Liability',
    content: 'Arttag is not responsible for any indirect, incidental, or consequential damages resulting from the use of our website or products beyond what is permitted by applicable law.',
  },
  {
    number: '08',
    icon: Edit3,
    title: 'Modification of Terms',
    content: 'Arttag may update these terms at any time without prior notice. Continued use of the website following any changes constitutes acceptance of the updated terms.',
  },
];

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .tou-serif { font-family: 'Cormorant Garamond', serif; }
        .tou-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }
        .tou-bullet {
          width: 5px; height: 5px; border-radius: 50%;
          background: #1a1a1a; flex-shrink: 0; margin-top: 7px;
        }
      `}</style>

      <Navbar />

      <div className="max-w-[860px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20">

        {/* ── Header ── */}
        <div className="mb-12">
          <p className="text-[10px] tracking-[0.28em] uppercase text-[#888] mb-3">Legal · Terms</p>
          <h1 className="tou-serif text-5xl sm:text-6xl font-light text-[#1a1a1a] leading-tight mb-4">
            Terms of Use
          </h1>
          <div className="tou-divider my-6" />
          <p className="text-xs tracking-[0.14em] uppercase text-[#aaa]">
            Last updated —{' '}
            {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* ── Intro ── */}
        <p className="text-base text-[#555] leading-relaxed mb-16 max-w-[640px]">
          Welcome to <span className="font-semibold text-[#1a1a1a]">Arttag.in</span>. By accessing or using our website, products, or services, you agree to comply with the following Terms of Use. Please read them carefully before proceeding.
        </p>

        {/* ── Sections ── */}
        <div className="space-y-0">
          {sections.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.number}>
                <div className="grid grid-cols-[48px_1fr] sm:grid-cols-[64px_1fr] gap-6 sm:gap-10 py-10">
                  {/* Left: number */}
                  <div className="pt-1 flex flex-col items-center gap-3">
                    <span className="tou-serif text-3xl sm:text-4xl font-light text-[#d4cfc8]">
                      {s.number}
                    </span>
                    <div className="w-8 h-8 border border-[#e8e4de] rounded-sm bg-[#f5f3ef] flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-[#888]" />
                    </div>
                  </div>

                  {/* Right: content */}
                  <div>
                    <h2 className="tou-serif text-2xl sm:text-3xl font-light text-[#1a1a1a] mb-4">
                      {s.title}
                    </h2>
                    {s.content && (
                      <p className="text-sm sm:text-base text-[#555] leading-relaxed">
                        {s.content}
                      </p>
                    )}
                    {s.points && (
                      <ul className="space-y-3">
                        {s.points.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="tou-bullet" />
                            <span className="text-sm sm:text-base text-[#555] leading-relaxed flex-1">
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                {i < sections.length - 1 && <div className="tou-divider" />}
              </div>
            );
          })}
        </div>

        {/* ── Footer ── */}
        <div className="tou-divider mt-12 mb-10" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-[#aaa] leading-relaxed max-w-sm">
            Questions about these terms? Reach us at{' '}
            <a
              href="mailto:support@arttag.in"
              className="text-[#1a1a1a] border-b border-[#d4cfc8] hover:border-[#1a1a1a] transition-colors"
            >
              support@arttag.in
            </a>
          </p>
          <p className="text-[10px] tracking-[0.16em] uppercase text-[#ccc]">Arttag © 2025</p>
        </div>
      </div>
    </div>
  );
}