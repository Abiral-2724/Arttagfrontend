"use client"
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Footer from '../components/Footer';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AutoScroll from 'embla-carousel-auto-scroll';
import TopCategorySlider from '@/components/TopCategory';

/* ─── Data ─── */
const carouselSlides = [
  { title: '',     subtitle: "", image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/v1775561461/2_ja806e.png', link: '/product/category/88b6c5ef-5ab0-41b8-97fb-c2099be6fb13' },
  { title: '', subtitle: '',               image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/v1775561460/4_yns9bm.png', link: '/product/category/6be4fe65-560d-4c66-8aa8-e5a478e02632' },
  { title: '',                 subtitle: '',                                    image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/v1775561453/3_h5uk21.png', link: '/product/category/88b6c5ef-5ab0-41b8-97fb-c2099be6fb13' },
  { title: '',                 subtitle: '',                                    image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/v1775561347/1_tglkqn.png', link: '/product/category/88b6c5ef-5ab0-41b8-97fb-c2099be6fb13' },
];

const shopByCategories = [
  { title: 'Travel & Lifestyle', image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/f_auto,q_auto,w_800/v1773209284/IMG_5611_wygjc4.jpg', link: 'product/category/88b6c5ef-5ab0-41b8-97fb-c2099be6fb13' },
  { title: 'Work Bags',          image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/f_auto,q_auto,w_800/v1773209386/IMG_5609_zjwnfq.jpg', link: 'product/category/d7928347-cf87-4f84-ac22-71614aa6e629' },
  { title: 'Backpacks',          image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/f_auto,q_auto,w_800/v1773209479/IMG_5592_fms8zt.jpg', link: 'product/category/6be4fe65-560d-4c66-8aa8-e5a478e02632' },
];

const trendingCollections = [
  { title: 'Laptop Backpacks', description: 'Pack Your Everyday Essentials', image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/f_auto,q_auto,w_800/v1773209719/IMG_5588_fhj1sk.png', link: '/product/category/6be4fe65-560d-4c66-8aa8-e5a478e02632/subcategory/724675b8-811c-42aa-ac9b-d1e52c3223ec/BAGS%20&%20WALLETS' },
  { title: 'Tote Bags',        description: 'Your Everyday Essential.',      image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/f_auto,q_auto,w_800/v1773209569/IMG_5520_yrowcz.png', link: '/product/category/88b6c5ef-5ab0-41b8-97fb-c2099be6fb13/subcategory/22da583b-23c7-446f-869b-674998ecc54f/BAGS%20&%20WALLETS' },
  { title: 'Laptop Sleeves',   description: 'Protect Your Essentials',      image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/f_auto,q_auto,w_800/v1773148508/IMG_5145_hsiahs.jpg', link: '/product/category/d7928347-cf87-4f84-ac22-71614aa6e629/subcategory/9b29784b-655c-40a5-a6d6-9fbdeef208b5/BAGS%20&%20WALLETS' },
];

const instagramImages = [
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=500&fit=crop',
];

interface Subcategory { id: string; name: string; imageUrl: string; parentId: string; createdAt: string; }
interface SubcategoriesResponse { success: boolean; message: string; subcategories: Subcategory[]; }

export default function HomePage() {
  const [api, setApi]: any = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const router = useRouter();
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const topCategorySliderRef = useRef<HTMLDivElement>(null);
  const categorySliderRef    = useRef<HTMLDivElement>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetch_ = async () => {
      setIsLoadingCategories(true);
      try {
        const res  = await fetch(`${API_BASE}/category/get/all/subcategory`);
        const data: SubcategoriesResponse = await res.json();
        if (data.success) setSubcategories(data.subcategories);
      } catch { console.error('Failed to fetch subcategories'); }
      finally { setIsLoadingCategories(false); }
    };
    fetch_();
  }, []);

  useEffect(() => {
    if (!api) return;
    api.on('select', () => setActiveSlide(api.selectedScrollSnap()));
    const t = setInterval(() => api.scrollNext(), 4500);
    return () => clearInterval(t);
  }, [api]);

  const handleCategoryClick = (sub: Subcategory) => {
    window.location.href = `/product/category/${sub.parentId}/subcategory/${sub.id}/${sub.name.toLowerCase().replace(/\s+/g, '-')}`;
  };

  return (
    <div className="bg-[#faf9f7] min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .hp-serif   { font-family:'Cormorant Garamond',serif; }
        .hp-divider { height:1px; background:linear-gradient(to right,transparent,#e8e4de 30%,#e8e4de 70%,transparent); }
        .hp-eyebrow { font-size:10px; font-weight:600; letter-spacing:0.22em; text-transform:uppercase; color:#888; }

        /*
         * hp-banner — the ONE pattern used for hero slides, corporate gifting,
         * and step-inside. The image sets its OWN height via h-auto so nothing
         * ever gets cropped. The text is absolutely positioned INSIDE via inset:0.
         */
        .hp-banner {
          position: relative;
          width: 100%;
          /* overflow hidden so nothing bleeds out */
          overflow: hidden;
          display: block;
        }
        .hp-banner-img {
          display: block;
          width: 100%;
          height: auto;
        }
        /* Mobile: cap at 75vw so portrait images don't dominate */
        @media (max-width: 640px) {
          .hp-banner-img {
            max-height: 75vw;
            object-fit: cover;
            object-position: center center;
          }
        }
        /* Tablet */
        @media (min-width: 641px) and (max-width: 1023px) {
          .hp-banner-img {
            max-height: 60vw;
            object-fit: cover;
            object-position: center center;
          }
        }
        /* Desktop: hero 82vh, section banners (corporate / store) 52vh */
        @media (min-width: 1024px) {
          .hp-banner-hero .hp-banner-img {
            max-height: 82vh;
            object-fit: cover;
            object-position: center center;
          }
          .hp-banner-section .hp-banner-img {
            max-height: 74vh;
            object-fit: cover;
            object-position: center center;
          }
        }
        /* Text overlay — always inside the image via position:absolute + inset:0 */
        .hp-banner-body {
          position: absolute;
          /* inset 0 = fills entire image area exactly */
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          /* responsive padding using clamp so it scales on every screen */
          padding: clamp(16px, 4vw, 60px);
        }

        /* Cards */
        .hp-card { position:relative; overflow:hidden; border-radius:2px; }
        .hp-card-img { transition:transform 0.65s cubic-bezier(0.4,0,0.2,1); }
        .hp-card:hover .hp-card-img { transform:scale(1.05); }
        .hp-arrow-box { transition:all 0.2s ease; }
        .hp-card:hover .hp-arrow-box { background:#fff; border-color:#fff; }
        .hp-card:hover .hp-arrow-box svg { color:#1a1a1a; }

        /* Insta */
        .hp-insta { position:relative; overflow:hidden; border-radius:2px; }
        .hp-insta img { transition:transform 0.55s ease; }
        .hp-insta:hover img { transform:scale(1.07); }
        .hp-insta-overlay { position:absolute; inset:0; background:rgba(0,0,0,0); transition:background 0.3s; display:flex; align-items:center; justify-content:center; }
        .hp-insta:hover .hp-insta-overlay { background:rgba(0,0,0,0.28); }
        .hp-insta-icon { opacity:0; transition:opacity 0.3s; }
        .hp-insta:hover .hp-insta-icon { opacity:1; }

        /* Skeleton */
        .hp-skel {
          background:linear-gradient(90deg,#f5f3ef 0%,#ece9e3 50%,#f5f3ef 100%);
          background-size:200% 100%;
          animation:hpSkel 1.4s ease-in-out infinite;
          border-radius:2px;
        }
        @keyframes hpSkel { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>

      <Navbar page="Home" />

      {/* ══════════════════════════ HERO CAROUSEL ══════════════════════════
          Styled identically to Corporate Gifting / Step Inside:
          — full-width image, h-auto (zero crop at any screen size)
          — dark gradient from bottom
          — text + CTA pinned to bottom-left via hp-banner-body
          — nav dots centred at image bottom via absolute positioning
      ══════════════════════════════════════════════════════════════════════ */}
      <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
        <CarouselContent>
          {carouselSlides.map((slide, index) => (
            <CarouselItem key={index}>
              {/* hp-banner + hp-banner-hero class for the desktop max-height cap */}
              <div className="hp-banner hp-banner-hero">

                {/* Serve correct Cloudinary size per breakpoint — NO crop transforms */}
                <picture>
                  <source
                    media="(max-width: 640px)"
                    srcSet={slide.image.replace('/upload/', '/upload/f_auto,q_auto,w_750/')}
                  />
                  <source
                    media="(max-width: 1024px)"
                    srcSet={slide.image.replace('/upload/', '/upload/f_auto,q_auto,w_1200/')}
                  />
                  <img
                    src={slide.image.replace('/upload/', '/upload/f_auto,q_auto,w_1800/')}
                    alt={slide.title || 'Arttag Collection'}
                    className="hp-banner-img"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </picture>

                {/* bottom-to-top gradient — same style as corporate gifting */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.18) 42%, transparent 100%)' }}
                />

                {/* Text overlay — always shown, title/subtitle conditional */}
                <div className="hp-banner-body">
                  <div style={{ maxWidth: '620px' }}>
                    {slide.title && (
                      <>
                        <p
                          style={{
                            fontSize: '10px', fontWeight: 600, letterSpacing: '0.22em',
                            textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)',
                            marginBottom: '10px'
                          }}
                        >
                          New Arrival
                        </p>
                        <h1
                          className="font-black text-white tracking-tight uppercase leading-none drop-shadow-lg"
                          style={{ fontSize: 'clamp(20px, 4.5vw, 54px)', marginBottom: '8px' }}
                        >
                          {slide.title}
                        </h1>
                        <p
                          className="text-white font-light drop-shadow-md"
                          style={{
                            fontSize: 'clamp(12px, 1.5vw, 20px)',
                            opacity: 0.85,
                            marginBottom: 'clamp(14px, 2.2vw, 30px)'
                          }}
                        >
                          {slide.subtitle}
                        </p>
                      </>
                    )}
                    <button
                      onClick={() => router.push(slide.link)}
                      className="inline-flex items-center gap-2 bg-white text-[#1a1a1a] font-bold tracking-wider rounded-[3px] hover:bg-[#1a1a1a] hover:text-white transition-colors shadow-lg group/btn"
                      style={{
                        fontSize: 'clamp(10px, 1.1vw, 13px)',
                        padding: 'clamp(10px,1.2vw,16px) clamp(16px,2.2vw,34px)'
                      }}
                    >
                      SHOP NOW
                      <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Dots — absolutely positioned at bottom of image */}
                <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                  {carouselSlides.map((_, idx) => (
                    <button
                      key={idx}
                      aria-label={`Go to slide ${idx + 1}`}
                      onClick={() => api?.scrollTo(idx)}
                      style={{
                        height: '6px',
                        width: idx === activeSlide ? '28px' : '8px',
                        borderRadius: '9999px',
                        background: idx === activeSlide ? '#fff' : 'rgba(255,255,255,0.45)',
                        transition: 'all 0.3s ease',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="hidden md:flex absolute left-5 lg:left-8 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-11 h-11 rounded-full border-0 shadow-lg z-10">
          <ChevronLeft className="w-5 h-5" />
        </CarouselPrevious>
        <CarouselNext className="hidden md:flex absolute right-5 lg:right-8 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-11 h-11 rounded-full border-0 shadow-lg z-10">
          <ChevronRight className="w-5 h-5" />
        </CarouselNext>
      </Carousel>

      {/* ══════════════════════════ SHOP BY CATEGORY ══════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-14 sm:py-20">
        <p className="hp-eyebrow mb-1.5">Collections</p>
        <h2 className="hp-serif text-3xl sm:text-4xl font-light text-[#1a1a1a] mb-8">Shop by Category</h2>
        <div className="hp-divider mb-10" />

        {/* Mobile slider */}
        <div className="md:hidden relative">
          <div ref={categorySliderRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
            {shopByCategories.map((cat, i) => (
              <Link key={i} href={cat.link} className="flex-shrink-0 w-[76vw] snap-center">
                <div className="hp-card aspect-[3/4]">
                  <img src={cat.image} alt={cat.title} className="hp-card-img w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <h3 className="hp-serif text-2xl font-light text-white">{cat.title}</h3>
                    <div className="hp-arrow-box w-9 h-9 border border-white/50 rounded-sm flex items-center justify-center">
                      <ArrowRight size={14} className="text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-5">
          {shopByCategories.map((cat, i) => (
            <Link key={i} href={cat.link}>
              <div className="hp-card aspect-[3/4]">
                <img src={cat.image} alt={cat.title} className="hp-card-img w-full h-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <p className="text-white/55 text-[10px] tracking-[0.16em] uppercase mb-1">Explore</p>
                    <h3 className="hp-serif text-2xl sm:text-3xl font-light text-white">{cat.title}</h3>
                  </div>
                  <div className="hp-arrow-box w-10 h-10 border border-white/50 rounded-sm flex items-center justify-center flex-shrink-0">
                    <ArrowRight size={15} className="text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════ PROMO BANNER ══════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-0 mb-2">
        <div className="relative overflow-hidden">
          <img
            src="https://res.cloudinary.com/dci6nuwrm/image/upload/f_auto,q_auto,w_1400/v1775561347/1_tglkqn.png"
            alt="Arttag Collection"
            className="w-full h-auto block"
            loading="lazy"
          />
        </div>
      </section>

      {/* ══════════════════════════ TOP CATEGORIES ══════════════════════════ */}
      <TopCategorySlider
        isLoadingCategories={isLoadingCategories}
        topCategorySliderRef={topCategorySliderRef}
        subcategories={subcategories}
        handleCategoryClick={handleCategoryClick}
      />

      {/* ══════════════════════════ TRENDING COLLECTIONS ══════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-14 sm:py-20">
        <p className="hp-eyebrow mb-1.5">What's Hot</p>
        <h2 className="hp-serif text-3xl sm:text-4xl font-light text-[#1a1a1a] mb-8">Trending Collections</h2>
        <div className="hp-divider mb-10" />

        {/* Mobile */}
        <div className="md:hidden flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
          {trendingCollections.map((col, i) => (
            <Link key={i} href={col.link} className="flex-shrink-0 w-[76vw] snap-center">
              <div className="hp-card aspect-[3/4]">
                <img src={col.image} alt={col.title} className="hp-card-img w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="absolute bottom-7 left-6 right-6">
                  <p className="text-white/55 text-[10px] tracking-[0.14em] uppercase mb-1.5">{col.description}</p>
                  <h3 className="hp-serif text-2xl font-light text-white mb-4">{col.title}</h3>
                  <div className="flex items-center gap-2 text-[10px] tracking-[0.14em] uppercase font-semibold text-white">
                    Shop Now <ArrowRight size={11} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop */}
        <div className="hidden md:grid md:grid-cols-3 gap-5">
          {trendingCollections.map((col, i) => (
            <Link key={i} href={col.link}>
              <div className="hp-card aspect-[3/4] group">
                <img src={col.image} alt={col.title} className="hp-card-img w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-white/50 text-[10px] tracking-[0.16em] uppercase mb-1.5">{col.description}</p>
                  <h3 className="hp-serif text-3xl font-light text-white mb-5">{col.title}</h3>
                  <div className="flex items-center gap-2.5 text-[10px] tracking-[0.16em] uppercase font-semibold text-white">
                    <span className="group-hover:opacity-70 transition-opacity">Shop Now</span>
                    <div className="hp-arrow-box w-7 h-7 border border-white/50 rounded-sm flex items-center justify-center">
                      <ArrowRight size={11} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════ CORPORATE GIFTING ══════════════════════════
          Uses hp-banner — text is always INSIDE the image via inset:0 overlay
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-0 py-2">
        <div className="hp-banner hp-banner-section cursor-pointer" onClick={() => router.push('/corporateGifting')}>
          <picture>
            <source
              media="(max-width: 640px)"
              srcSet="https://res.cloudinary.com/dci6nuwrm/image/upload/f_auto,q_auto,w_750,ar_4:3,c_fill,g_auto/v1772197618/Personalized_Corporate_Gift_Set__Custom_Notebook_Pen_Thermos_Card_Holder_Employees_Graduation_znhmr2.jpg"
            />
            <img
              src="https://res.cloudinary.com/dci6nuwrm/image/upload/f_auto,q_auto,w_1400/v1772197618/Personalized_Corporate_Gift_Set__Custom_Notebook_Pen_Thermos_Card_Holder_Employees_Graduation_znhmr2.jpg"
              alt="Corporate Gifting"
              className="hp-banner-img"
              loading="lazy"
            />
          </picture>

          {/* left-to-right gradient so text on left is always readable */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)' }}
          />

          <div className="hp-banner-body">
            <div style={{ maxWidth: '500px' }}>
              <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: '10px' }}>
                For Business
              </p>
              <h2
                className="hp-serif font-light text-white leading-tight"
                style={{ fontSize: 'clamp(24px, 3.8vw, 52px)', marginBottom: '10px' }}
              >
                Corporate Gifting
              </h2>
              <p
                className="text-white/70 font-light leading-relaxed hidden sm:block"
                style={{ fontSize: 'clamp(12px, 1.2vw, 16px)', marginBottom: 'clamp(16px, 2vw, 28px)', maxWidth: '340px' }}
              >
                Build lasting relationships with bespoke corporate gifting solutions.
              </p>
              <button className="inline-flex items-center gap-2 bg-white text-[#1a1a1a] px-5 py-3 text-[10px] tracking-[0.18em] uppercase font-semibold rounded-sm hover:bg-[#1a1a1a] hover:text-white transition-all group/btn">
                Enquire Now <ArrowRight size={11} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ STEP INSIDE ══════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-0 py-2">
        <div className="hp-banner hp-banner-section cursor-pointer" onClick={() => router.push('/findstore')}>
          <picture>
            <source
              media="(max-width: 640px)"
              srcSet="https://res.cloudinary.com/dci6nuwrm/image/upload/f_auto,q_auto,w_750,ar_4:3,c_fill,g_center/v1772104937/IMG_5132_g3drr6.png"
            />
            <img
              src="https://res.cloudinary.com/dci6nuwrm/image/upload/f_auto,q_auto,w_1400/v1772104937/IMG_5132_g3drr6.png"
              alt="Visit Arttag Store"
              className="hp-banner-img"
              loading="lazy"
            />
          </picture>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'rgba(0,0,0,0.30)' }}
          />

          <div className="hp-banner-body">
            <div style={{ maxWidth: '460px' }}>
              <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: '10px' }}>
                Our Stores
              </p>
              <h2
                className="hp-serif font-light text-white leading-tight"
                style={{ fontSize: 'clamp(24px, 3.8vw, 52px)', marginBottom: 'clamp(16px, 2vw, 28px)' }}
              >
                Step Inside<br />Arttag
              </h2>
              <button className="inline-flex items-center gap-2 bg-white text-[#1a1a1a] px-5 py-3 text-[10px] tracking-[0.18em] uppercase font-semibold rounded-sm hover:bg-[#1a1a1a] hover:text-white transition-all group/btn">
                Find a Store <ArrowRight size={11} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ INSTAGRAM ══════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-14 sm:py-20">
        <div className="text-center mb-8">
          <p className="hp-eyebrow mb-1.5">Community</p>
          <h2 className="hp-serif text-3xl sm:text-4xl font-light text-[#1a1a1a] mb-2">Everyday Inspiration</h2>
          <p className="text-[#888] text-xs tracking-[0.1em]">
            Follow <span className="text-[#1a1a1a]">@arttag.india</span> · #arttagcommunity
          </p>
        </div>
        <div className="hp-divider mb-8" />

        <Carousel
          opts={{ align: 'start', loop: true, dragFree: true }}
          plugins={[AutoScroll({ speed: 1.2, stopOnInteraction: false, stopOnMouseEnter: true })]}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {instagramImages.map((img, i) => (
              <CarouselItem key={i} className="pl-2 basis-[44%] sm:basis-[30%] md:basis-[20%] lg:basis-[16%]">
                <div className="hp-insta aspect-[3/5]">
                  <img src={img} alt={`Arttag community ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  <div className="hp-insta-overlay">
                    <svg className="hp-insta-icon w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* ══════════════════════════ VIDEO ══════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-14 sm:py-20 bg-white">
        <p className="hp-eyebrow mb-1.5">Guide</p>
        <h2 className="hp-serif text-3xl sm:text-4xl font-light text-[#1a1a1a] mb-1">How to Paste Laptop Skins</h2>
        <p className="text-[#888] text-sm mb-8">Step-by-step guide for a perfect, bubble-free finish every time.</p>
        <div className="hp-divider mb-8" />
        <div className="rounded-sm overflow-hidden bg-black border border-[#e8e4de]">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
  className="absolute inset-0 w-full h-full"
  src="https://www.youtube.com/embed/FxZS85MqSe0"
  title="How to Paste Laptop Skins?"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  loading="lazy"
/>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}