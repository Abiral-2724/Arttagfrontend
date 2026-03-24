'use client'
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutArttag() {
  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .ab-serif { font-family: 'Cormorant Garamond', serif; }
        .ab-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
        }
        .ab-mission-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #1a1a1a; flex-shrink: 0; margin-top: 8px;
        }
        .ab-founder-card {
          background: #fff;
          border: 1px solid #e8e4de;
          border-radius: 2px;
          overflow: hidden;
          transition: box-shadow 0.25s, border-color 0.25s;
        }
        .ab-founder-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
          border-color: #d4cfc8;
        }
        .ab-founder-card img {
          transition: transform 0.6s ease;
        }
        .ab-founder-card:hover img { transform: scale(1.04); }

        .ab-value-card {
          background: #fff;
          border: 1px solid #e8e4de;
          border-radius: 2px;
          padding: 28px;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .ab-value-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
          border-color: #d4cfc8;
        }
      `}</style>

      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-[#1a1a1a] text-white py-20 sm:py-28 px-4">
        <div className="max-w-[860px] mx-auto text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#888] mb-4">Our Story</p>
          <h1 className="ab-serif text-5xl sm:text-7xl font-light leading-tight mb-6">
            About Arttag
          </h1>
          <p className="text-xl sm:text-2xl font-light text-[#aaa] max-w-2xl mx-auto leading-relaxed">
            Where Function Meets Expression.
          </p>
        </div>
      </section>

      <div className="max-w-[860px] mx-auto px-4 sm:px-8 lg:px-12">

        {/* ── Intro ── */}
        <section className="py-16 sm:py-20">
          <div className="space-y-5 text-[#555] text-base sm:text-lg leading-relaxed">
            <p>
              At Arttag, we believe everyday essentials should be as expressive as they are functional.
            </p>
            <p>
              We're building a modern lifestyle brand that merges technology, design, and creativity — crafting premium gadgets, accessories, and bags that elevate your daily life with both style and purpose.
            </p>
            <p>
              From the smallest charger to the most versatile travel bag, every Arttag product reflects a balance of innovation, artistry, and individuality — designed for those who live boldly and express freely.
            </p>
          </div>
        </section>

        <div className="ab-divider" />

        {/* ── Our Story ── */}
        <section className="py-16 sm:py-20">
          <p className="text-[10px] tracking-[0.24em] uppercase text-[#888] mb-3">Origin</p>
          <h2 className="ab-serif text-4xl sm:text-5xl font-light text-[#1a1a1a] mb-8">Our Story</h2>
          <blockquote className="ab-serif text-2xl sm:text-3xl font-light italic text-[#1a1a1a] border-l-2 border-[#1a1a1a] pl-6 mb-8">
            "Why should functional products look ordinary?"
          </blockquote>
          <div className="space-y-4 text-[#555] text-base leading-relaxed">
            <p>
              What started as a creative experiment in designing skins and stickers has now evolved into a premium lifestyle brand that reimagines how we interact with our everyday essentials.
            </p>
            <p>
              At Arttag, we transform daily-use gadgets into statement pieces — combining premium quality, modern aesthetics, and personalized touches that make every product uniquely yours.
            </p>
          </div>
        </section>

        <div className="ab-divider" />

        {/* ── Vision & Mission ── */}
        <section className="py-16 sm:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Vision */}
            <div>
              <p className="text-[10px] tracking-[0.22em] uppercase text-[#888] mb-2">Looking ahead</p>
              <h3 className="ab-serif text-3xl font-light text-[#1a1a1a] mb-5">Our Vision</h3>
              <div className="ab-divider mb-5" />
              <div className="space-y-3 text-sm text-[#555] leading-relaxed">
                <p>To become a global lifestyle brand that blends art and innovation, transforming everyday essentials into expressions of personality and creativity.</p>
                <p>We envision a world where every Arttag product — from a cable to a carry bag — is a symbol of function, emotion, and design.</p>
              </div>
            </div>
            {/* Mission */}
            <div>
              <p className="text-[10px] tracking-[0.22em] uppercase text-[#888] mb-2">Our purpose</p>
              <h3 className="ab-serif text-3xl font-light text-[#1a1a1a] mb-5">Our Mission</h3>
              <div className="ab-divider mb-5" />
              <ul className="space-y-3">
                {[
                  'Deliver high-quality, design-driven gadgets and accessories that elevate everyday life.',
                  'Keep the Arttag artistic essence alive in every product.',
                  'Empower individuality through customization and creativity.',
                  'Continuously innovate, ensuring our designs stay relevant, refined, and responsible.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#555] leading-relaxed">
                    <div className="ab-mission-dot" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="ab-divider" />

        {/* ── The Arttag Touch ── */}
        <section className="py-16 sm:py-20">
          <p className="text-[10px] tracking-[0.24em] uppercase text-[#888] mb-3">What sets us apart</p>
          <h2 className="ab-serif text-4xl sm:text-5xl font-light text-[#1a1a1a] mb-8">The Arttag Touch</h2>
          <div className="space-y-4 text-[#555] text-base leading-relaxed">
            <p className="text-lg font-medium text-[#1a1a1a]">What sets us apart is our personal touch.</p>
            <p>Every Arttag creation carries an element of art — from custom skins and free stickers to signature design details that add character to your essentials.</p>
            <p className="font-medium text-[#333]">We don't just sell products; we craft personal experiences that resonate with your lifestyle.</p>
          </div>
        </section>

        <div className="ab-divider" />

        {/* ── Founders ── */}
        <section className="py-16 sm:py-20">
          <p className="text-[10px] tracking-[0.24em] uppercase text-[#888] mb-3">The People</p>
          <h2 className="ab-serif text-4xl sm:text-5xl font-light text-[#1a1a1a] mb-10">Our Founders</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Shivam */}
            <div className="ab-founder-card">
              <div className="aspect-[4/3] overflow-hidden bg-[#f5f3ef]">
                <img
                  src="https://res.cloudinary.com/dci6nuwrm/image/upload/v1764854997/IMG_1577_g0gvof.jpg"
                  alt="Shivam Awasthi"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="p-6">
                <p className="text-[10px] tracking-[0.16em] uppercase text-[#aaa] font-semibold mb-1">Co-Founder · Creative Director</p>
                <h3 className="ab-serif text-2xl font-light text-[#1a1a1a] mb-3">Shivam Awasthi</h3>
                <div className="ab-divider mb-3" />
                <p className="text-sm text-[#555] leading-relaxed">
                  A visionary artist and entrepreneur, Shivam brings creativity, storytelling, and brand emotion to Arttag. With a background in art, music, and design, he ensures every product carries a soulful personality — merging lifestyle with self-expression.
                </p>
              </div>
            </div>

            {/* Dheeraj */}
            <div className="ab-founder-card">
              <div className="aspect-[4/3] overflow-hidden bg-[#f5f3ef]">
                <img
                  src="https://res.cloudinary.com/dci6nuwrm/image/upload/v1765471054/IMG_1997_n241l1.jpg"
                  alt="Dheeraj Awasthi"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: '50% 20%' }}
                />
              </div>
              <div className="p-6">
                <p className="text-[10px] tracking-[0.16em] uppercase text-[#aaa] font-semibold mb-1">Co-Founder · Operations & Strategy</p>
                <h3 className="ab-serif text-2xl font-light text-[#1a1a1a] mb-3">Dheeraj Awasthi</h3>
                <div className="ab-divider mb-3" />
                <p className="text-sm text-[#555] leading-relaxed">
                  With a strong focus on innovation and execution, Dheeraj leads product development and business strategy at Arttag. His commitment to quality and performance ensures every product delivers premium value and lasting reliability.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="ab-divider" />

      </div>

      {/* ── CTA Banner ── */}
      <section className="bg-[#1a1a1a] text-white py-16 sm:py-20 px-4 mt-0">
        <div className="max-w-[860px] mx-auto text-center space-y-4">
          <p className="text-[10px] tracking-[0.28em] uppercase text-[#666]">Join us</p>
          <h2 className="ab-serif text-4xl sm:text-5xl font-light leading-tight">
            Join the Arttag Lifestyle
          </h2>
          <div className="ab-divider my-6" style={{ background: 'linear-gradient(to right, transparent, #333 30%, #333 70%, transparent)' }} />
          <p className="text-[#888] text-base leading-relaxed max-w-2xl mx-auto">
            Arttag is more than just a brand — it's a statement. Every gadget, bag, and design carries a spark of individuality that connects art with your everyday life.
          </p>
          <p className="text-[#aaa] text-base leading-relaxed max-w-2xl mx-auto">
            Step into a world where innovation meets imagination, and make your essentials truly yours.
          </p>
          <p className="ab-serif text-2xl font-light text-white pt-4">
            Welcome to Arttag — Where Function Meets Expression.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}