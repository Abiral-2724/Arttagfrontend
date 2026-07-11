import Navbar from '@/components/Navbar';
import React from 'react';

const intro =
  "At Arttag, we stand behind the quality and craftsmanship of every product we create. Each bag is carefully inspected before dispatch to ensure it meets our high standards. This Limited Warranty covers manufacturing defects in materials and workmanship under normal, intended use.";

const sections = [
  {
    number: '01',
    title: 'Warranty Coverage',
    body: "All Arttag bags are covered by a 6-Month Limited Manufacturing Warranty from the date of delivery. If a verified manufacturing defect occurs during the warranty period, Arttag will, at its sole discretion, repair the product or replace it with the same or a comparable model, subject to availability. The decision to repair or replace a product rests solely with Arttag.",
  },
  {
    number: '02',
    title: 'What Is Covered',
    intro: 'This warranty applies only to manufacturing defects, including:',
    points: [
      'Defective stitching.',
      'Zip or zipper manufacturing defects.',
      'Buckle or hardware failure due to manufacturing.',
      'Handle or shoulder strap failure caused by manufacturing defects.',
      'Manufacturing defects in materials or product assembly.',
    ],
  },
  {
    number: '03',
    title: 'What Is Not Covered',
    intro: 'This warranty does not cover:',
    points: [
      'Normal wear and tear.',
      'Cosmetic damage such as scratches, stains, fading, or discoloration.',
      'Damage caused by misuse, negligence, accidents, abuse, or improper handling.',
      'Damage resulting from overloading the bag beyond its intended purpose.',
      'Cuts, punctures, burns, tears, or damage caused by sharp objects.',
      'Damage caused during airline, railway, courier, or third-party transportation.',
      'Loss or theft of the product.',
      'Products purchased from unauthorized sellers.',
      'Damage caused by improper storage or lack of reasonable care.',
    ],
  },
  {
    number: '04',
    title: 'Water-Resistance Disclaimer',
    body: "Arttag products are made using water-resistant materials designed to withstand light rain and minor water splashes. Water-resistant does not mean waterproof. Our bags are not waterproof and should not be submerged in water or exposed to heavy rain, flooding, or prolonged moisture. Damage resulting from water exposure is not covered under this warranty.",
  },
  {
    number: '05',
    title: 'Unauthorized Repairs & Modifications',
    intro:
      'To ensure product quality and safety, all warranty-related repairs must be performed only by Arttag. This warranty will become void immediately if the product has been:',
    points: [
      'Repaired by any unauthorized service provider.',
      'Stitched or re-stitched outside Arttag.',
      'Altered, modified, or customized in any manner.',
      'Had its zip, handles, straps, buckles, fabric, or any other component replaced or repaired by a third party.',
      'Subjected to any aftermarket repair or structural modification.',
    ],
    outro:
      'Arttag cannot guarantee the quality, durability, or safety of products repaired or modified by unauthorized persons. Therefore, such products are not eligible for warranty service.',
  },
  {
    number: '06',
    title: 'Warranty Claim Process',
    intro: 'To request warranty service, please contact our Customer Support Team with:',
    points: [
      'Order ID or proof of purchase.',
      'Clear photographs of the product.',
      'Images of the affected area.',
      'A brief description of the issue.',
    ],
    outro: 'Additional photos or videos may be requested to assist with the inspection.',
  },
  {
    number: '07',
    title: 'Inspection & Resolution',
    body: "Every warranty claim is subject to inspection by Arttag. If the issue is confirmed as a manufacturing defect, we will repair or replace the product at no charge. If the issue is outside the scope of this warranty, we may offer a paid repair service where available.",
  },
  {
    number: '08',
    title: 'Limitation of Liability',
    body: "Arttag's liability under this Limited Warranty is strictly limited to the repair or replacement of the product. Under no circumstances shall Arttag be liable for any indirect, incidental, consequential, or special damages arising from the use or inability to use the product.",
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
            Arttag Limited Warranty
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