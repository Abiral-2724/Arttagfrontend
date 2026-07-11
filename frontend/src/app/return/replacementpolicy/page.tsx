import Navbar from '@/components/Navbar';
import React from 'react';

const intro =
  "At Arttag, every product undergoes a thorough quality inspection before dispatch. If you receive a product that is damaged, defective, or incorrect, we are committed to resolving the issue as quickly as possible.";

const sections = [
  {
    number: '01',
    title: 'Return Eligibility',
    intro: 'Returns or replacements are accepted only in the following cases:',
    points: [
      'You received a damaged product.',
      'You received a product with a verified manufacturing defect.',
      'You received the wrong product.',
      'You received an incomplete order or a missing item.',
    ],
  },
  {
    number: '02',
    title: 'Return Request Timeline',
    intro:
      'Any issue must be reported within 48 hours of delivery. To process your request, please provide:',
    points: [
      'Order ID or proof of purchase.',
      'Clear photographs of the product.',
      'Photographs of the outer packaging.',
      'An unedited unboxing video (strongly recommended for transit damage or missing items).',
      'A brief description of the issue.',
    ],
    outro: 'Failure to report the issue within the specified timeframe may result in rejection of the claim.',
  },
  {
    number: '03',
    title: 'Non-Returnable Situations',
    intro: 'Returns or replacements will not be accepted for:',
    points: [
      'Change of mind.',
      'Color, design, or style preference.',
      'Incorrect product selection by the customer.',
      'Minor variations in color due to screen or lighting differences.',
      'Normal wear and tear.',
      'Damage caused after delivery due to misuse, negligence, accidents, overloading, improper handling, or improper storage.',
      'Damage caused by water exposure. Arttag bags are water-resistant, not waterproof.',
      'Products that have been used, washed, or intentionally damaged.',
      'Products repaired, stitched, altered, or modified by any unauthorized third party.',
      'Claims submitted without sufficient evidence or beyond the reporting period.',
    ],
  },
  {
    number: '04',
    title: 'Inspection & Approval',
    body: "All return and replacement requests are subject to inspection by Arttag's Quality Team. Approval of a claim is at Arttag's sole discretion after reviewing the submitted evidence. If the issue is determined not to be a manufacturing defect or is outside the scope of this policy, the request may be declined.",
  },
  {
    number: '05',
    title: 'Replacement Process',
    intro: 'If your claim is approved, Arttag may, at its sole discretion:',
    points: [
      'Repair the product,',
      'Replace it with the same model, or',
      'Replace it with an equivalent product if the original model is unavailable.',
    ],
    outro:
      'Replacement products do not extend or restart the original warranty period unless required by applicable law.',
  },
  {
    number: '06',
    title: 'Refund Policy',
    intro: 'Refunds are issued only if:',
    points: [
      'A replacement or repair cannot be provided, and',
      'Arttag determines that a refund is the appropriate resolution.',
    ],
    outro:
      'Approved refunds will be processed to the original payment method within the applicable processing period. Shipping charges, COD fees, convenience charges, and other service fees are generally non-refundable unless required by law.',
  },
  {
    number: '07',
    title: 'Fraud Prevention',
    intro: 'Arttag reserves the right to reject any claim involving:',
    points: [
      'False or misleading information.',
      'Edited or manipulated photographs or videos.',
      'Intentional product damage.',
      'Repeated abusive or fraudulent claims.',
    ],
    outro: 'Fraudulent claims may result in cancellation of warranty benefits and refusal of future service.',
  },
  {
    number: '08',
    title: 'Limitation of Liability',
    body: "Arttag's liability under this policy is limited to the repair, replacement, or refund of the original purchase price of the product, at Arttag's sole discretion.",
  },
];

export default function ReturnReplacementPolicyPage() {
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
            Return & Replacement Policy
          </h1>
          <div className="wp-divider my-6" />
          <p className="text-sm sm:text-base text-[#555] leading-relaxed mb-6">{intro}</p>
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
                  {s.intro && (
                    <p className="text-sm sm:text-base text-[#555] leading-relaxed mb-4">{s.intro}</p>
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
                  {s.outro && (
                    <p className="text-sm sm:text-base text-[#555] leading-relaxed mt-4">{s.outro}</p>
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