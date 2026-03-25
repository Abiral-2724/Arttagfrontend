'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Users, Sparkles, Heart, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const WHY_CARDS = [
  { title: 'Gifting for Every Occasion',     sub: 'From onboarding to milestones',  img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80' },
  { title: '50,000+ Innovative Products',    sub: 'Curated for every need',          img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
  { title: 'Add Thoughtful Gestures',        sub: 'Meaningful, memorable gifts',     img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80' },
];

const TABS = [
  { id: 'onboarding',  label: 'Onboarding',  icon: Users,    title: 'Welcome with Purpose',
    desc: "Set the tone from day one with curated onboarding kits that reflect your company's values and culture. Personalise each item to make new hires feel genuinely valued.",
    img: 'https://images.dailyobjects.com/marche/assets/images/other-2/Review-Section1.jpg?tr=cm-pad_crop,v-3,w-686,dpr-2' },
  { id: 'festive',     label: 'Festive',     icon: Sparkles, title: 'Celebrate Together',
    desc: 'Mark special occasions with gifts that bring joy and strengthen bonds. From festive celebrations to milestone achievements, make every moment memorable.',
    img: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80' },
  { id: 'cobranding',  label: 'Co-Branding', icon: Heart,    title: 'Powerful Partnerships',
    desc: 'Make your collaborations shine with co-branded gifts that tell a story. Combine your brand identity with ours to create unique, high-quality pieces that enhance relationships.',
    img: 'https://images.dailyobjects.com/marche/assets/images/other-2/co-branding1.jpg?tr=cm-pad_crop,v-3,w-686,dpr-2' },
  { id: 'ecofriendly', label: 'Eco-Friendly', icon: Package, title: 'Gifts That Give Back',
    desc: 'Show your commitment to sustainability with eco-friendly corporate gifts — thoughtfully designed to minimise impact and maximise appreciation.',
    img: 'https://images.dailyobjects.com/marche/assets/images/other-2/Corporate-gifting-eco-friendly.jpg?tr=cm-pad_crop,v-3,w-686,dpr-2' },
];

const empty = { name: '', companyName: '', contact: '', companyEmail: '', askAnything: '', quantity: '' };

const CorporateGiftingPage = () => {
  const [formData, setFormData]     = useState({ ...empty });
  const [errors, setErrors]         = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeTab, setActiveTab]   = useState('onboarding');
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<any>(null);
  const API_BASE  = process.env.NEXT_PUBLIC_API_BASE_URL;

  const tab = TABS.find(t => t.id === activeTab)!;

  /* touch slider */
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    let startX = 0, scrollLeft = 0;
    const ts = (e: TouchEvent) => { startX = e.touches[0].pageX - el.offsetLeft; scrollLeft = el.scrollLeft; };
    const tm = (e: TouchEvent) => { e.preventDefault(); el.scrollLeft = scrollLeft - (e.touches[0].pageX - el.offsetLeft - startX) * 2; };
    const te = () => { const s = Math.round(el.scrollLeft / el.offsetWidth); setCurrentSlide(s); el.scrollTo({ left: s * el.offsetWidth, behavior: 'smooth' }); };
    el.addEventListener('touchstart', ts); el.addEventListener('touchmove', tm); el.addEventListener('touchend', te);
    return () => { el.removeEventListener('touchstart', ts); el.removeEventListener('touchmove', tm); el.removeEventListener('touchend', te); };
  }, []);

  const validate = () => {
    const e: any = {};
    if (!formData.name.trim())         e.name = 'Required';
    if (!formData.companyName.trim())  e.companyName = 'Required';
    if (!formData.contact.trim())      e.contact = 'Required';
    if (!formData.companyEmail.trim()) e.companyEmail = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) e.companyEmail = 'Invalid email';
    if (!formData.quantity || Number(formData.quantity) <= 0) e.quantity = 'Must be a positive number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const res  = await fetch(`${API_BASE}/corporate/add/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, quantity: parseInt(formData.quantity) }),
      });
      const data = await res.json();
      if (data.success) { setSubmitSuccess(true); setFormData({ ...empty }); setTimeout(() => setSubmitSuccess(false), 5000); }
      else alert(data.message || 'Failed to submit');
    } catch { alert('Failed to submit. Please try again.'); }
    finally { setIsSubmitting(false); }
  };

  const set = (field: string) => (e: any) => { setFormData(p => ({ ...p, [field]: e.target.value })); if (errors[field]) setErrors((p: any) => ({ ...p, [field]: '' })); };

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .cg-serif { font-family: 'Cormorant Garamond', serif; }
        .cg-divider { height: 1px; background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent); }

        .cg-input {
          width: 100%; padding: 11px 14px; font-size: 13px;
          border: 1px solid #e8e4de; border-radius: 2px;
          background: #fff; color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.2s;
        }
        .cg-input:focus { border-color: #1a1a1a; }
        .cg-input::placeholder { color: #ccc; }
        .cg-input.error { border-color: #f5b7b1; }

        .cg-tab {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 18px; font-size: 11px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          border: 1px solid #e8e4de; border-radius: 2px;
          cursor: pointer; transition: all 0.18s;
          font-family: 'DM Sans', sans-serif; background: #fff; color: #888;
          white-space: nowrap;
        }
        .cg-tab:hover { border-color: #1a1a1a; color: #1a1a1a; }
        .cg-tab.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }

        .cg-submit-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: #1a1a1a; color: #fff; border: none;
          padding: 14px 40px; font-size: 11px; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer; transition: background 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .cg-submit-btn:hover:not(:disabled) { background: #333; }
        .cg-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
      `}</style>

      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-[#1a1a1a] py-20 sm:py-28 px-4 overflow-hidden">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#555] mb-4">Arttag · For Business</p>
            <h1 className="cg-serif text-6xl sm:text-7xl lg:text-8xl font-light text-white leading-none mb-6">
              Corporate<br />
              <span className="text-[#e8e4de]">Gifting</span>
            </h1>
            <p className="text-[#888] text-base leading-relaxed max-w-lg mb-8">
              Begin, nurture and celebrate the relationships you foster with your employees, clients, and business partners with thoughtful corporate gifting.
            </p>
            <button
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-3 bg-white text-[#1a1a1a] px-8 py-4 text-[10px] tracking-[0.18em] uppercase font-semibold rounded-sm hover:bg-[#f5f3ef] transition-colors group"
            >
              Get Started <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="hidden lg:block aspect-square overflow-hidden rounded-sm border border-[#333]">
            <img src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80" alt="Corporate gifts" className="w-full h-full object-cover opacity-80" />
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12">
          <p className="text-[10px] tracking-[0.24em] uppercase text-[#888] mb-2">Why Arttag</p>
          <h2 className="cg-serif text-4xl sm:text-5xl font-light text-[#1a1a1a] mb-10">Why Choose Us?</h2>
          <div className="cg-divider mb-10" />

          {/* Desktop */}
          <div className="hidden md:grid md:grid-cols-3 gap-5">
            {WHY_CARDS.map((card, i) => (
              <div key={i} className="group relative overflow-hidden rounded-sm border border-[#e8e4de] aspect-[3/5]">
                <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="cg-serif text-2xl font-light text-white mb-1">{card.title}</h3>
                  <p className="text-[11px] tracking-[0.1em] uppercase text-white/60">{card.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile slider */}
          <div className="md:hidden">
            <div ref={sliderRef} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4">
              {WHY_CARDS.map((card, i) => (
                <div key={i} className="flex-shrink-0 w-full snap-center relative overflow-hidden rounded-sm border border-[#e8e4de] aspect-[4/5]">
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="cg-serif text-2xl font-light text-white mb-1">{card.title}</h3>
                    <p className="text-[11px] tracking-[0.1em] uppercase text-white/60">{card.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-5">
              {WHY_CARDS.map((_, i) => (
                <button key={i} onClick={() => { setCurrentSlide(i); sliderRef.current?.scrollTo({ left: i * sliderRef.current.offsetWidth, behavior: 'smooth' }); }}
                  className={`h-1.5 rounded-full transition-all ${currentSlide === i ? 'w-8 bg-[#1a1a1a]' : 'w-2 bg-[#d4cfc8]'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What's Possible ── */}
      <section className="py-16 sm:py-20 bg-[#faf9f7]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12">
          <p className="text-[10px] tracking-[0.24em] uppercase text-[#888] mb-2">Possibilities</p>
          <h2 className="cg-serif text-4xl sm:text-5xl font-light text-[#1a1a1a] mb-10">What's Possible</h2>
          <div className="cg-divider mb-8" />

          {/* Tabs */}
          <div className="flex gap-2 mb-10 overflow-x-auto pb-1 scrollbar-hide flex-wrap">
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)} className={`cg-tab ${activeTab === t.id ? 'active' : ''}`}>
                  <Icon size={13} /> {t.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="order-2 lg:order-1 space-y-5">
              <h3 className="cg-serif text-3xl sm:text-4xl font-light text-[#1a1a1a]">{tab.title}</h3>
              <div className="cg-divider" />
              <p className="text-[#555] text-base leading-relaxed">{tab.desc}</p>
              <button className="inline-flex items-center gap-2 border border-[#1a1a1a] text-[#1a1a1a] px-7 py-3 text-[10px] tracking-[0.16em] uppercase font-semibold rounded-sm hover:bg-[#1a1a1a] hover:text-white transition-colors">
                Explore More <ArrowRight size={12} />
              </button>
            </div>
            <div className="order-1 lg:order-2 aspect-square overflow-hidden rounded-sm border border-[#e8e4de]">
              <img src={tab.img} alt={tab.id} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section id="contact-form" className="py-16 sm:py-20 bg-white">
        <div className="max-w-[720px] mx-auto px-4 sm:px-8 lg:px-12">
          <p className="text-[10px] tracking-[0.24em] uppercase text-[#888] mb-2 text-center">Enquire Now</p>
          <h2 className="cg-serif text-4xl sm:text-5xl font-light text-[#1a1a1a] mb-3 text-center leading-snug">
            Drop Your Details &<br />We'll Get in Touch
          </h2>
          <p className="text-sm text-[#888] text-center mb-10">
            For further queries email us at{' '}
            <a href="mailto:support@arttag.in" className="text-[#1a1a1a] border-b border-[#d4cfc8] hover:border-[#1a1a1a] transition-colors">
              support@arttag.in
            </a>
          </p>
          <div className="cg-divider mb-10" />

          {submitSuccess && (
            <div className="flex items-center gap-2 px-4 py-3 bg-[#eafaf1] border border-[#a9dfbf] rounded-sm text-sm text-[#1e8449] mb-8">
              <CheckCircle2 size={15} /> Request submitted! We'll be in touch shortly.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {[
                { field: 'name',        label: 'Name',         placeholder: 'Your full name',    type: 'text' },
                { field: 'companyName', label: 'Company Name', placeholder: 'ABC Corp',           type: 'text' },
                { field: 'contact',     label: 'Contact',      placeholder: '+91 98765 43210',   type: 'tel' },
                { field: 'quantity',    label: 'Quantity',     placeholder: '50',                 type: 'number' },
              ].map(({ field, label, placeholder, type }) => (
                <div key={field} className="space-y-1.5">
                  <label className="block text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888]">
                    {label} <span className="text-[#c0392b]">*</span>
                  </label>
                  <input type={type} min={type === 'number' ? '1' : undefined}
                    value={(formData as any)[field]} onChange={set(field)} placeholder={placeholder}
                    className={`cg-input ${(errors as any)[field] ? 'error' : ''}`} />
                  {(errors as any)[field] && <p className="text-[11px] text-[#c0392b]">{(errors as any)[field]}</p>}
                </div>
              ))}

              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888]">
                  Company Email <span className="text-[#c0392b]">*</span>
                </label>
                <input type="email" value={formData.companyEmail} onChange={set('companyEmail')} placeholder="you@company.com"
                  className={`cg-input ${errors.companyEmail ? 'error' : ''}`} />
                {errors.companyEmail && <p className="text-[11px] text-[#c0392b]">{errors.companyEmail}</p>}
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888]">
                  Ask Us Anything
                </label>
                <textarea value={formData.askAnything} onChange={set('askAnything')}
                  placeholder="Any specific requirements or questions…" rows={4} maxLength={300}
                  className="cg-input" style={{ resize: 'none' }} />
                <p className="text-[11px] text-[#aaa] text-right">{formData.askAnything.length}/300</p>
              </div>
            </div>

            <div className="text-center pt-2">
              <button type="submit" disabled={isSubmitting} className="cg-submit-btn">
                {isSubmitting
                  ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting…</>
                  : <><ArrowRight size={13} /> Submit Request</>
                }
              </button>
            </div>
          </form>
        </div>
      </section>

      <div style={{ height: 1, background: 'linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent)' }} />
      <Footer />
    </div>
  );
};

export default CorporateGiftingPage;