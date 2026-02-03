import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const TopCategorySlider = ({
  subcategories,
  topCategorySliderRef,
  isLoadingCategories,
  handleCategoryClick
}) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scrollSlider = (direction) => {
    if (topCategorySliderRef.current) {
      const scrollAmount = 400;
      const newScrollPosition =
        direction === 'left'
          ? topCategorySliderRef.current.scrollLeft - scrollAmount
          : topCategorySliderRef.current.scrollLeft + scrollAmount;

      topCategorySliderRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (topCategorySliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = topCategorySliderRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  React.useEffect(() => {
    const slider = topCategorySliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => slider.removeEventListener('scroll', handleScroll);
    }
  }, [subcategories]);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="flex gap-4 pb-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="flex-shrink-0 w-64 sm:w-72">
          <CardContent className="p-4">
            <Skeleton className="aspect-[4/3] w-full rounded-lg mb-4" />
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                Featured Collection
              </span>
            </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Popular Categories
          </h2>
          <p className="text-gray-600">
            Explore our most loved products
          </p>
        </div>

        {/* Slider Section */}
        {isLoadingCategories ? (
          <LoadingSkeleton />
        ) : (
          <div className="relative">
            {/* Left Arrow */}
            {showLeftArrow && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => scrollSlider('left')}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </Button>
            )}

            {/* Slider Container */}
            <div
              ref={topCategorySliderRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-2 px-2"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {subcategories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="flex-shrink-0 w-64 sm:w-72"
                >
                  {/* Product Card */}
                  <Card className="group cursor-pointer border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 h-full">
                    <CardContent className="p-4">
                      {/* Image Container */}
                      <div className="relative bg-gray-50 rounded-sm aspect-[2/3] mb-4 flex items-center justify-center overflow-hidden">
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />

                        {/* Note Badge */}
                        {category.note && (
                          <Badge
                            variant="secondary"
                            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 shadow-sm border border-gray-200"
                          >
                            <span className="text-xs text-gray-700 font-medium">
                              {category.note}
                            </span>
                          </Badge>
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </h3>
                        {category.subtitle && (
                          <p className="text-sm text-gray-500 mb-2">
                            {category.subtitle}
                          </p>
                        )}
                        <div className="flex items-center text-blue-600 text-sm font-medium group-hover:gap-1 transition-all">
                          <span>View products</span>
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            {showRightArrow && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => scrollSlider('right')}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </Button>
            )}
          </div>
        )}

        {/* Empty state */}
        {!isLoadingCategories && subcategories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No categories yet
            </h3>
            <p className="text-gray-500 text-sm">
              Check back soon for new products
            </p>
          </div>
        )}
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default TopCategorySlider;