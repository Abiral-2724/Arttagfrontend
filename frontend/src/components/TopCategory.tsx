import React, { useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const TopCategorySlider = ({
  subcategories,
  topCategorySliderRef,
  isLoadingCategories,
  handleCategoryClick
}) => {
  return (
    <div className="bg-white py-16 md:py-24">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        @keyframes tcs-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">

        {/* ── Section header ── */}
        <div className="mb-10">
          <p style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="text-[10px] tracking-[0.22em] uppercase text-[#888] mb-1.5 font-semibold">
            Browse by
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-3xl md:text-4xl font-light text-[#1a1a1a]">
            Top Categories
          </h2>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#e8e4de] to-transparent mb-10" />

        {/* ── Loading skeleton ── */}
        {isLoadingCategories ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <div
                  className="aspect-[3/4] rounded-sm"
                  style={{
                    background: 'linear-gradient(90deg, #f5f3ef 0%, #ece9e3 50%, #f5f3ef 100%)',
                    backgroundSize: '200% 100%',
                    animation: `tcs-shimmer 1.4s ease-in-out infinite`,
                    animationDelay: `${i * 70}ms`,
                  }}
                />
                <div className="h-2.5 w-3/4 rounded" style={{ background: '#f0ece6' }} />
                <div className="h-2.5 w-1/2 rounded" style={{ background: '#f0ece6' }} />
              </div>
            ))}
          </div>

        ) : subcategories.length === 0 ? (

          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="w-14 h-14 rounded-sm flex items-center justify-content-center mb-5"
              style={{ background: '#f5f3ef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg className="w-7 h-7" style={{ color: '#c8c4bc' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-2xl font-light text-[#1a1a1a] mb-2">
              No categories yet
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-sm text-[#aaa]">
              Check back soon for new arrivals
            </p>
          </div>

        ) : (

          /* ── Carousel ── */
          <Carousel opts={{ align: 'start', loop: false }} className="w-full">
            <CarouselContent className="-ml-4">
              {subcategories.map((category) => (
                <CarouselItem
                  key={category.id}
                  className="pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4"
                >
                  <div
                    onClick={() => handleCategoryClick(category)}
                    className="cursor-pointer group"
                  >
                    {/* Image */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f3ef] rounded-sm mb-3">
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                        loading="lazy"
                        onError={(e: any) => {
                          e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80';
                        }}
                      />
                      {/* Note badge if present */}
                      {category.note && (
                        <span
                          className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-medium tracking-wide"
                          style={{
                            background: 'rgba(255,255,255,0.92)',
                            color: '#3a3a3a',
                            border: '1px solid #e8e4de',
                            fontFamily: "'DM Sans', sans-serif",
                            letterSpacing: '0.06em',
                          }}
                        >
                          {category.note}
                        </span>
                      )}
                    </div>

                    {/* Label */}
                    <div className="px-0.5">
                      <h3
                        className="text-sm font-medium text-[#1a1a1a] line-clamp-2 group-hover:opacity-60 transition-opacity"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="
              -left-4 w-8 h-8 rounded-sm border border-[#e8e4de]
              bg-white text-[#888] shadow-none
              hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a]
              transition-all duration-150"
            />
            <CarouselNext className="
              -right-4 w-8 h-8 rounded-sm border border-[#e8e4de]
              bg-white text-[#888] shadow-none
              hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a]
              transition-all duration-150"
            />
          </Carousel>
        )}
      </div>
    </div>
  );
};

export default TopCategorySlider;