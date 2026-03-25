import Navbar from '@/components/Navbar'
import React from 'react'

const sections = [
  {
    number: '01',
    title: 'Information We Collect',
    body: 'We collect your name, contact details, delivery address, order information, and device data when you interact with our platform. This information is provided directly by you during account creation, checkout, or customer support interactions.',
  },
  {
    number: '02',
    title: 'How We Use Your Information',
    body: 'Your information is used to process and fulfil orders, personalise your shopping experience, send order updates and service communications, and provide responsive customer support. We do not sell your personal data to third parties.',
  },
  {
    number: '03',
    title: 'Data Protection',
    body: 'All data is stored on secure, encrypted servers. Payment information is processed exclusively through trusted, PCI-DSS compliant payment gateways. We never store your full card details on our systems.',
  },
  {
    number: '04',
    title: 'Cookies',
    body: 'We use cookies and similar technologies to enhance your browsing experience, remember your preferences, and understand how our website is used. You can manage or disable cookies through your browser settings at any time.',
  },
  {
    number: '05',
    title: 'Your Rights',
    body: 'You have the right to access, correct, or request deletion of your personal data at any time. To exercise these rights, please reach out to our support team. We aim to respond to all data requests within 30 days.',
  },
]

type Props = {}

const PrivacyAndSecurity = (props: Props) => {
  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .ps-serif { font-family: 'Cormorant Garamond', serif; }
        .ps-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }
      `}</style>

      <Navbar />

      <div className="max-w-[860px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20">

        {/* ── Page header ── */}
        <div className="mb-12">
          <p className="text-[10px] tracking-[0.28em] uppercase text-[#888] mb-3">Legal · Data</p>
          <h1 className="ps-serif text-5xl sm:text-6xl font-light text-[#1a1a1a] leading-tight mb-4">
            Privacy &amp;<br />Security Policy
          </h1>
          <div className="ps-divider my-6" />
          <p className="text-xs tracking-[0.14em] uppercase text-[#aaa]">Last updated — 30 November 2025</p>
        </div>

        {/* ── Intro ── */}
        <p className="text-base text-[#555] leading-relaxed mb-16 max-w-[620px]">
          At Arttag, your privacy is a priority. This policy explains what data we collect, how we use it, and the steps we take to keep it safe. Please read it carefully.
        </p>

        {/* ── Sections ── */}
        <div className="space-y-0">
          {sections.map((s, i) => (
            <div key={s.number}>
              <div className="grid grid-cols-[48px_1fr] sm:grid-cols-[64px_1fr] gap-6 sm:gap-10 py-10">
                {/* Number */}
                <div className="pt-1">
                  <span className="ps-serif text-3xl sm:text-4xl font-light text-[#d4cfc8]">{s.number}</span>
                </div>
                {/* Content */}
                <div>
                  <h2 className="ps-serif text-2xl sm:text-3xl font-light text-[#1a1a1a] mb-4">
                    {s.title}
                  </h2>
                  <p className="text-sm sm:text-base text-[#555] leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </div>
              {i < sections.length - 1 && <div className="ps-divider" />}
            </div>
          ))}
        </div>

        {/* ── Footer note ── */}
        <div className="ps-divider mt-12 mb-10" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-[#aaa] leading-relaxed max-w-sm">
            Questions about this policy? Contact us at{' '}
            <a href="mailto:support@arttag.in" className="text-[#1a1a1a] border-b border-[#d4cfc8] hover:border-[#1a1a1a] transition-colors">
              support@arttag.in
            </a>
          </p>
          <p className="text-[10px] tracking-[0.16em] uppercase text-[#ccc]">Arttag © 2025</p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyAndSecurity