"use client"
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, User, Search, ChevronDown, ArrowRight, Play } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Footer from '../components/Footer'
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AutoScroll from 'embla-carousel-auto-scroll';
import TopCategorySlider from '@/components/TopCategory';

const carouselSlides = [
  {
    title: 'POP ADAPTERS',
    subtitle: "India's 1st Foldable Pin Adapter.",
    image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/v1769967739/6_nissci.svg',
    link: '/product/category/88b6c5ef-5ab0-41b8-97fb-c2099be6fb13'
  },
  {
    title: 'STACK COLLECTION',
    subtitle: 'Organize Your Space.',
    image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/v1769967756/5_osfu1j.svg',
    link: '/product/category/6be4fe65-560d-4c66-8aa8-e5a478e02632'
  },
  {
    title: '',
    subtitle: '',
    image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/v1769967712/3_o9ejzq.svg',
    link: '/product/category/88b6c5ef-5ab0-41b8-97fb-c2099be6fb13'
  },
  {
    title: 'WATCHBANDS',
    subtitle: 'Upgrade your watch drobe with our latest styles.',
    image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/v1769967536/2_bgjulo.svg',
    link: 'product/category/88b6c5ef-5ab0-41b8-97fb-c2099be6fb13'
  },
  {

    title: 'LOOP POWER BANKS',
    subtitle: 'Qi2-Certified, Next-Gen Fast Wireless Charging.',
    image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/v1769967747/4_lovdny.svg',
    link: '/product/category/88b6c5ef-5ab0-41b8-97fb-c2099be6fb13'
  },
];

interface Subcategory {
  id: string;
  name: string;
  imageUrl: string;
  parentId: string;
  createdAt: string;
}

interface SubcategoriesResponse {
  success: boolean;
  message: string;
  subcategories: Subcategory[];
}


export default function DailyObjectsReplica() {
  const [userId, setUserId] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi]: any = useState(null);
  const router = useRouter();
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const categorySliderRef : any = useRef<HTMLDivElement>(null);
  const topCategorySliderRef : any = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await fetch(`${API_BASE}/category/get/all/subcategory`);
      const data: SubcategoriesResponse = await response.json();
      if (data.success) {
        setSubcategories(data.subcategories);
      }
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  };


  useEffect(() => {
    const id = localStorage.getItem("arttagUserId");
    if (id) {
      setUserId(id);
    }
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [api]);

  const handleShopNow = (link) => {
    router.push(link);
  };

  const scrollSlider = (direction: 'left' | 'right', sliderRef: React.RefObject<HTMLDivElement>) => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === 'left'
        ? sliderRef.current.scrollLeft - scrollAmount
        : sliderRef.current.scrollLeft + scrollAmount;

      sliderRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleCategoryClick = (subcategory: Subcategory) => {
    const categoryId = subcategory.parentId;
    const subcategoryId = subcategory.id;
    const subcategoryName = subcategory.name.toLowerCase().replace(/\s+/g, '-');

    window.location.href = `/product/category/${categoryId}/subcategory/${subcategoryId}/${subcategoryName}`;
  };

  const shopByCategories = [
    {
      title: 'TECH ACCESSORIES',
      image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/v1769967756/5_osfu1j.svg',
      link: 'product/category/88b6c5ef-5ab0-41b8-97fb-c2099be6fb13'
    },
    {
      title: 'BAGS & WALLETS',
      image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/v1770181930/IMG_4630_tuviuo.jpg',
      link: 'product/category/6be4fe65-560d-4c66-8aa8-e5a478e02632'
    },
    {
      title: 'WORK ESSENTIALS',
      image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/v1770182067/IMG_4632_phsqrk.jpg',
      link: 'product/category/d7928347-cf87-4f84-ac22-71614aa6e629'
    }
  ];


  return (
    <div className="bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>

<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .serif { font-family: 'Cormorant Garamond', serif; }
        .sans { font-family: 'DM Sans', sans-serif; }
`}</style>
      {/* Header */}
      <Navbar page={"Home"} />

      {/* Hero Carousel */}
      <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
        <CarouselContent>
          {carouselSlides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[calc(100vh-80px)]">
                {/* Background Image */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />

                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/10"></div>

                <div className="relative max-w-[1300px] mx-auto h-full px-4 sm:px-6 md:px-8 lg:px-12 flex items-end pb-16 sm:pb-20 md:pb-28 lg:pb-35">
                  <div className="z-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[47px] font-black text-white mb-1 sm:mb-2 tracking-tight leading-tight uppercase drop-shadow-lg">
                      {slide.title}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-[21px] text-white mb-4 sm:mb-5 md:mb-7 font-light drop-shadow-md">
                      {slide.subtitle}
                    </p>
                    <button
                      onClick={() => handleShopNow(slide.link)}
                      className="bg-white text-black px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-xs sm:text-sm md:text-[14px] font-black tracking-wider rounded-[3px] hover:bg-black hover:text-white transition-colors shadow-lg"
                    >
                      SHOP NOW
                    </button>
                  </div>
                </div>

                {/* Navigation Dots */}
                <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
                  {carouselSlides.map((_, idx) => (
                    <button
                      key={idx}
                      className={`h-1.5 sm:h-2 rounded-full transition-all ${idx === index ? 'bg-white w-6 sm:w-8' : 'bg-white/50 w-1.5 sm:w-2'
                        }`}
                      onClick={() => setCurrentSlide(idx)}
                    />
                  ))}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="hidden md:flex absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-blue-300 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-0 shadow-lg">
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </CarouselPrevious>

        <CarouselNext className="hidden md:flex absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-blue-300 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-0 shadow-lg">
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </CarouselNext>
      </Carousel>

      {/* Shop by Category Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-12 md:py-16">
        <h2 className="text-xl sm:text-2xl md:text-[28px] ml-2 sm:ml-3 md:ml-5 text-black font-bold mb-4 sm:mb-5 tracking-tight uppercase">
          SHOP BY CATEGORY
        </h2>
        {/* Mobile Horizontal Slider */}
        <div className="sm:hidden relative group">
          <button
            onClick={() => scrollSlider('left', categorySliderRef)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg rounded-full p-2 hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <div
            ref={categorySliderRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {shopByCategories.map((category, index) => (
              <Link key={index} href={category.link} className="flex-shrink-0 w-[65vw] snap-center">
                <div className="group/item relative rounded-xl cursor-pointer overflow-hidden">
                  <div className="aspect-[3/5] relative overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                    <div className="absolute bottom-6 left-6 right-20 flex items-center justify-between">
                      <h3 className="text-white text-lg font-black uppercase tracking-tight">
                        {category.title}
                      </h3>
                      <button className="absolute -right-14 rounded-full border-1 border-white w-10 h-10 flex items-center justify-center transition-transform group-hover/item:scale-110 flex-shrink-0">
                        <ArrowRight className='text-white w-4 h-4' />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scrollSlider('right', categorySliderRef)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg rounded-full p-2 hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-6">
          {shopByCategories.map((category, index) => (
            <Link key={index} href={category.link}>
              <div className="group relative rounded-xl sm:rounded-2xl cursor-pointer overflow-hidden">
                <div className="aspect-[3/4] sm:aspect-[2/3] lg:aspect-[2.8/4] relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 left-3 sm:left-4 md:left-5 right-3 sm:right-4 md:right-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white text-base sm:text-lg md:text-xl font-black uppercase tracking-tight pr-3">
                        {category.title}
                      </h3>
                      <button className="rounded-full border border-white w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-transform group-hover:scale-110 flex-shrink-0">
                        <ArrowRight className="text-white w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="max-w-[1440px] mx-auto px-0 pb-3 sm:pb-5">
        <div className="relative overflow-hidden">
          <img
            src="https://images.dailyobjects.com/marche/assets/images/other-2/brighten-Desk-Landing-Page-Banner.jpg?tr=cm-pad_crop,v-3"
            alt="Brighten Your Everyday"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      <TopCategorySlider
        isLoadingCategories={isLoadingCategories}
        topCategorySliderRef={topCategorySliderRef}
        subcategories={subcategories}
        handleCategoryClick={handleCategoryClick}
      />

      {/* Trending Collections Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-12 md:py-16">
        <div className="flex justify-between items-center mb-6 sm:mb-8 ml-2 sm:ml-3 md:ml-5">
          <h2 className="text-xl sm:text-2xl md:text-[26px] font-sans ml-2 sm:ml-3 md:ml-5 text-black font-bold tracking-tight uppercase">
            TRENDING COLLECTIONS
          </h2>
        </div>

        {/* Mobile Slider */}
        <div className="sm:hidden relative">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 snap-x snap-mandatory">
          {[
            {
              title: 'Laptop Sleeves',
              description: 'Smart Protection for Smart Devices.',
              image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/v1771308238/IMG_4935_cgdyro.jpg',
              link: 'product/category/88b6c5ef-5ab0-41b8-97fb-c2099be6fb13'
            },
            {
              title: 'Tote Bags',
              description: 'Your Everyday Essential.',
              image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/v1771308259/IMG_4936_kklziy.jpg',
              link: 'product/category/6be4fe65-560d-4c66-8aa8-e5a478e02632'
            },
            {
              title: 'Backpacks',
              description: 'Pack Your Next Adventure.',
              image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/v1771308269/IMG_4938_gbh4x0.jpg',
              link: 'product/category/d7928347-cf87-4f84-ac22-71614aa6e629'
            }
          ].map((collection, index) => (
              <Link key={index} href={collection.link} className="flex-shrink-0 w-[70vw] snap-center">
                <div className="relative rounded-2xl overflow-hidden group cursor-pointer h-[400px]">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  <div className="absolute bottom-8 left-6 right-6">
                    <h3 className="text-white text-2xl font-black uppercase tracking-tight mb-3">
                      {collection.title}
                    </h3>
                    <p className="text-white/90 text-sm font-light mb-5 leading-relaxed">
                      {collection.description}
                    </p>
                    <button className="flex items-center gap-2 text-white font-semibold text-sm group/btn hover:gap-3 transition-all">
                      Shop now!
                      <div className="rounded-full border-2 border-white w-8 h-8 flex items-center justify-center group-hover/btn:bg-white transition-all">
                        <ArrowRight className="w-4 h-4 group-hover/btn:text-black transition-colors" />
                      </div>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:grid sm:grid-cols-3">
          {[
            {
              title: 'Laptop Sleeves',
              description: 'Smart Protection for Smart Devices.',
              image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/v1771308238/IMG_4935_cgdyro.jpg',
              link: '/product/category/6be4fe65-560d-4c66-8aa8-e5a478e02632/subcategory/3e3a56aa-b8d7-412b-8d37-399139cace76/BAGS%20&%20WALLETS'
            },
            {
              title: 'Tote Bags',
              description: 'Your Everyday Essential.',
              image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/v1771308259/IMG_4936_kklziy.jpg',
              link: '/product/category/6be4fe65-560d-4c66-8aa8-e5a478e02632/subcategory/724675b8-811c-42aa-ac9b-d1e52c3223ec/BAGS%20&%20WALLETS'
            },
            {
              title: 'Backpacks',
              description: 'Pack Your Next Adventure.',
              image: 'https://res.cloudinary.com/dci6nuwrm/image/upload/v1771308269/IMG_4938_gbh4x0.jpg',
              link: '/product/category/6be4fe65-560d-4c66-8aa8-e5a478e02632/subcategory/da0c3b9e-183e-4fb4-9169-18fde3ed4c43/BAGS%20&%20WALLETS'
            }
          ].map((collection, index) => (
            <Link key={index} href={collection.link}>
              <div className="relative rounded-2xl overflow-hidden group cursor-pointer aspect-[3.5/5] ml-6">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-6 sm:left-8 right-6 sm:right-8">
                  <h3 className="text-white text-xl sm:text-2xl md:text-[28px] font-black uppercase tracking-tight mb-2 sm:mb-3">
                    {collection.title}
                  </h3>
                  <p className="text-white/90 text-xs sm:text-sm md:text-base font-light mb-4 sm:mb-6 leading-relaxed">
                    {collection.description}
                  </p>
                  
                  <button className="flex items-center gap-2 text-white font-light text-sm sm:text-base group/btn hover:gap-3 transition-all">
                    Shop now!
                    <div className="rounded-full border-1 border-white w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center group-hover/btn:bg-white transition-all">
                      <ArrowRight className="w-3 h-4 sm:w-5 sm:h-5 group-hover/btn:text-black transition-colors" />
                    </div>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Corporate Gifting Section ─── */}
      <section className="max-w-[1440px] mx-auto px-0 py-3 sm:py-5">
  <div className="relative overflow-hidden group cursor-pointer">
    
    {/* Fixed aspect ratio container so image never gets weird on any screen */}
    <div className="relative w-full aspect-[16/9] sm:aspect-[16/7] md:aspect-[13/6]">
      <img
        src="https://res.cloudinary.com/dci6nuwrm/image/upload/v1772197618/Personalized_Corporate_Gift_Set__Custom_Notebook_Pen_Thermos_Card_Holder_Employees_Graduation_znhmr2.jpg"
        alt="Corporate Gifting"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlay — stronger at bottom for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

      {/* Text content — pinned to bottom-left, scales with viewport */}
      <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 md:bottom-12 md:left-12 lg:bottom-16 lg:left-16 max-w-[85%] sm:max-w-[60%] md:max-w-[50%]">
        <h2 className="text-lg sm:text-xl md:text-3xl lg:text-[42px] font-black text-white uppercase tracking-tight leading-tight mb-1.5 sm:mb-2 md:mb-3 drop-shadow-lg">
          CORPORATE GIFTING
        </h2>
        <p className="text-white/90 text-xs sm:text-sm md:text-base font-light mb-3 sm:mb-4 md:mb-5 drop-shadow-md leading-relaxed">
          It is the season to celebrate and nurture everlasting bonds. Build lasting relationships with our bespoke corporate solutions.
        </p>
        <button
          className="bg-white text-black px-3 sm:px-5 md:px-7 py-2 sm:py-2.5 md:py-3 text-[10px] sm:text-xs md:text-sm font-black tracking-wider rounded-[3px] hover:bg-black hover:text-white transition-colors shadow-lg"
          onClick={() => router.push('/corporateGifting')}
        >
          ENQUIRE NOW
        </button>
      </div>
    </div>

  </div>
</section>
      {/* ─── End Corporate Gifting Section ─── */}

      {/* ─── Step Inside DailyObjects Section ─── */}
      <section className="max-w-[1440px] mx-auto px-0 py-3 sm:py-5">
  <div className="relative overflow-hidden group cursor-pointer">
    
    {/* Desktop image */}
    {/* Desktop image */}
<img
  src="https://res.cloudinary.com/dci6nuwrm/image/upload/v1772104937/IMG_5132_g3drr6.png"
  alt="Step Inside Arttag Store"
  className="hidden sm:block w-full object-cover"
  style={{ aspectRatio: '16/7', objectPosition: 'center' }}
/>

    {/* Mobile image — same src, cropped taller for portrait */}
    <img
      src="https://res.cloudinary.com/dci6nuwrm/image/upload/v1772104937/IMG_5132_g3drr6.png"
      alt="Step Inside Arttag Store"
      className="block sm:hidden w-full object-cover"
      style={{ aspectRatio: '4/5' }}
    />

    {/* Overlay */}
    <div className="absolute inset-0 bg-black/30" />

    {/* Content */}
    <div className="absolute bottom-6 left-4 sm:bottom-14 sm:left-10 md:bottom-20 md:left-14">
      <h2 className="text-lg sm:text-2xl md:text-[36px] font-black text-white uppercase tracking-tight leading-tight mb-2 sm:mb-3 drop-shadow-lg">
        STEP INSIDE<br />Arttag
      </h2>
      <p className="text-white/90 text-xs sm:text-base md:text-lg font-light mb-3 sm:mb-5 drop-shadow-md">
        Experience our products in real life
      </p>
      <button className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-black tracking-wider rounded-[3px] hover:bg-black hover:text-white transition-colors shadow-lg">
        VISIT US!
      </button>
    </div>
  </div>
</section>
      {/* ─── End Step Inside Section ─── */}

      {/* ─── Everyday Inspiration Section ─── */}
      {/* ─── Everyday Inspiration Section ─── */}
<section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-12 md:py-16">
  <div className="text-center mb-6 sm:mb-8 md:mb-10">
    <h2 className="text-2xl sm:text-3xl md:text-[32px] font-black text-black uppercase tracking-tight">
      EVERYDAY INSPIRATION
    </h2>
    <p className="text-gray-500 text-sm sm:text-base mt-1.5 font-light">
      Follow @arttag.india to join the #arttagcommunity
    </p>
  </div>

  <Carousel
    opts={{ align: 'start', loop: true, dragFree: true }}
    plugins={[
      AutoScroll({
        speed: 1.5,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]}
    className="w-full"
  >
    <CarouselContent className="-ml-2">
      {[
        { image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=500&fit=crop', alt: 'Style 1' },
        { image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop', alt: 'Style 2' },
        { image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop', alt: 'Style 3' },
        { image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop', alt: 'Style 4' },
        { image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop', alt: 'Style 5' },
        { image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=500&fit=crop', alt: 'Style 6' },
        { image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop', alt: 'Style 7' },
        { image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=500&fit=crop', alt: 'Style 8' },
      ].map((item, index) => (
        <CarouselItem key={index} className="pl-2 basis-[42%] sm:basis-[28%] md:basis-[22%] lg:basis-[18%]">
          <div className="relative overflow-hidden group cursor-pointer aspect-[3/5]">
            <img
              src={item.image}
              alt={item.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
  </Carousel>
</section>
{/* ─── End Everyday Inspiration Section ─── */}
      {/* ─── End Everyday Inspiration Section ─── */}

      {/* ─── HOW TO PASTE LAPTOP SKINS — Video Section ─── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-12 md:py-16">
        {/* Section Header */}
        <div className="ml-2 sm:ml-3 md:ml-5 mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-[32px] font-sans text-black font-bold tracking-tight uppercase">
            HOW TO PASTE LAPTOP SKINS ?
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-1.5 font-light">
            Follow our step by step guide for a perfect, bubble free finish every time.
          </p>
        </div>

        {/* Video Embed Container */}
        <div className="ml-2 sm:ml-3 md:ml-5 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl bg-black">
          {/* 16:9 Aspect Ratio Wrapper */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/CVM8Ly19iyg?rel=0&modestbranding=1&color=white"
              title="How to Paste Laptop Skins?"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </section>
      {/* ─── End Video Section ─── */}

      <section>
        <Footer />
      </section>
    </div>
  );
}