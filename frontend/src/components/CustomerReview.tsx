import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Pen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const CustomerReviewSection = ({ productId, userId, productName }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const getCardsPerSlide = () => {
    if (windowWidth < 768) return 1;
    if (windowWidth < 1024) return 2;
    return 3;
  };

  const cardsPerSlide = getCardsPerSlide();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { fetchReviews(); }, [productId]);
  useEffect(() => { setCurrentSlide(0); }, [cardsPerSlide]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/review/all/review/${productId}`);
      const data = await response.json();
      if (data.success) setReviews(data.productReview);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0) { alert('Please select a rating'); return; }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/review/add/product/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userId, title, description, rating }),
      });
      const data = await response.json();
      if (data.success) {
        setShowDialog(false);
        setRating(0); setTitle(''); setDescription('');
        fetchReviews();
        alert('Review submitted successfully!');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const totalSlides = Math.ceil(reviews.length / cardsPerSlide);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getVisibleReviews = () => {
    const startIdx = currentSlide * cardsPerSlide;
    return reviews.slice(startIdx, startIdx + cardsPerSlide);
  };

  // Render filled/half/empty stars as SVG for precision
  const StarIcon = ({ filled, size = 16 }: { filled: boolean | 'hover'; size?: number }) => (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill={filled ? '#1a1a1a' : 'none'}
      stroke={filled ? '#1a1a1a' : '#ccc'}
      strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: 'all 0.15s ease' }}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );

  const StarRating = ({
    rating: starRating,
    size = 16,
    interactive = false,
    onRate,
  }: {
    rating: number;
    size?: number;
    interactive?: boolean;
    onRate?: (n: number) => void;
  }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          onClick={() => interactive && onRate && onRate(star)}
        >
          <StarIcon
            filled={star <= (interactive ? (hoverRating || starRating) : starRating)}
            size={size}
          />
        </span>
      ))}
    </div>
  );

  const avg = Number(calculateAverageRating());

  // Rating distribution bar
  const getRatingCount = (star: number) =>
    reviews.filter((r) => r.rating === star).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .reviews-serif { font-family: 'Cormorant Garamond', serif; }
        .reviews-sans  { font-family: 'DM Sans', sans-serif; }

        .reviews-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #d4cfc8 30%, #d4cfc8 70%, transparent);
        }

        .review-card {
          background: #fff;
          border: 1px solid #ece9e3;
          border-radius: 2px;
          padding: 28px;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .review-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.07);
          transform: translateY(-2px);
        }

        .write-review-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px solid #1a1a1a;
          color: #1a1a1a;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 500;
          padding: 14px 28px;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .write-review-btn:hover {
          background: #1a1a1a;
          color: #fff;
        }

        .nav-btn {
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 1px solid #e8e4de;
          background: #faf9f7;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .nav-btn:hover { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }

        .rating-bar-track {
          flex: 1;
          height: 3px;
          background: #ece9e3;
          border-radius: 2px;
          overflow: hidden;
        }
        .rating-bar-fill {
          height: 100%;
          background: #1a1a1a;
          border-radius: 2px;
          transition: width 0.6s ease;
        }

        .dot-indicator {
          height: 2px;
          border-radius: 2px;
          background: #d4cfc8;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .dot-indicator.active {
          background: #1a1a1a;
          width: 28px !important;
        }

        /* Dialog overrides */
        .review-dialog-overlay { backdrop-filter: blur(8px); background: rgba(0,0,0,0.35) !important; }
        .review-dialog-content {
          background: #faf9f7 !important;
          border: 1px solid #ece9e3 !important;
          border-radius: 4px !important;
          box-shadow: 0 32px 80px rgba(0,0,0,0.15) !important;
        }
        .review-input {
          background: #fff !important;
          border: 1px solid #e8e4de !important;
          border-radius: 2px !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 14px !important;
          color: #1a1a1a !important;
          transition: border-color 0.2s !important;
        }
        .review-input:focus {
          border-color: #1a1a1a !important;
          outline: none !important;
          box-shadow: none !important;
          ring: none !important;
        }
        .submit-btn {
          width: 100%;
          background: #1a1a1a;
          color: #fff;
          border: none;
          padding: 14px;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          border-radius: 2px;
          cursor: pointer;
          transition: background 0.25s ease;
        }
        .submit-btn:hover:not(:disabled) { background: #333; }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .cancel-btn {
          width: 100%;
          background: transparent;
          color: #1a1a1a;
          border: 1px solid #d4cfc8;
          padding: 14px;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .cancel-btn:hover { border-color: #1a1a1a; }
      `}</style>

      <section className="reviews-sans bg-[#faf9f7] py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">

          {/* ── Section Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs tracking-[0.18em] uppercase text-[#888] mb-2">What people say</p>
              <h2 className="reviews-serif text-3xl md:text-4xl font-light text-[#1a1a1a]">Customer Reviews</h2>
            </div>
            <button className="write-review-btn self-start sm:self-auto" onClick={() => setShowDialog(true)}>
              <Pen className="w-3 h-3" />
              {reviews.length === 0 ? 'Be the first to review' : 'Write a Review'}
            </button>
          </div>

          <div className="reviews-divider mb-12" />

          {/* ── Rating Summary ── */}
          {reviews.length > 0 && (
            <div className="grid md:grid-cols-[auto_1fr] gap-10 md:gap-20 mb-14 items-start">

              {/* Big number */}
              <div className="text-center md:text-left">
                <div className="reviews-serif text-7xl md:text-8xl font-light text-[#1a1a1a] leading-none mb-3">
                  {avg.toFixed(1)}
                </div>
                <div className="flex justify-center md:justify-start mb-2">
                  <StarRating rating={Math.round(avg)} size={18} />
                </div>
                <p className="text-xs tracking-[0.12em] uppercase text-[#888]">
                  {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Breakdown bars */}
              <div className="space-y-3 pt-1 max-w-xs">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = getRatingCount(star);
                  const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-xs text-[#888] w-3 text-right">{star}</span>
                      <StarIcon filled size={12} />
                      <div className="rating-bar-track">
                        <div className="rating-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-[#aaa] w-4 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Empty State ── */}
          {reviews.length === 0 && (
            <div className="text-center py-16">
              <div className="reviews-serif text-5xl font-light text-[#d4cfc8] mb-4">✦</div>
              <p className="reviews-serif text-2xl font-light text-[#888] mb-2">No reviews yet</p>
              <p className="text-xs tracking-[0.12em] uppercase text-[#aaa]">Be the first to share your experience</p>
            </div>
          )}

          {/* ── Review Cards ── */}
          {reviews.length > 0 && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {getVisibleReviews().map((review, i) => (
                  <div key={review.id} className="review-card">
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-[#1a1a1a] mb-0.5">
                          {review.user?.name || 'Anonymous'}
                        </p>
                        <p className="text-[11px] tracking-[0.08em] text-[#aaa] uppercase">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                      <StarRating rating={review.rating} size={14} />
                    </div>

                    {/* Thin rule */}
                    <div className="h-px bg-[#f0ece6] mb-4" />

                    {review.title && (
                      <h4 className="reviews-serif text-lg font-light text-[#1a1a1a] mb-2 leading-snug line-clamp-2">
                        {review.title}
                      </h4>
                    )}
                    {review.description && (
                      <p className="text-[#666] text-sm leading-relaxed line-clamp-4">
                        {review.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation */}
              {totalSlides > 1 && (
                <div className="flex items-center justify-center gap-6 mt-10">
                  <button className="nav-btn" onClick={prevSlide}>
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                      <div
                        key={index}
                        className={`dot-indicator ${index === currentSlide ? 'active' : ''}`}
                        style={{ width: index === currentSlide ? 28 : 8 }}
                        onClick={() => setCurrentSlide(index)}
                      />
                    ))}
                  </div>

                  <button className="nav-btn" onClick={nextSlide}>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Write Review Dialog ── */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="review-dialog-content max-w-[95vw] sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-1">
            <p className="text-[10px] tracking-[0.18em] uppercase text-[#888] mb-1">Share your thoughts</p>
            <DialogTitle className="reviews-serif text-3xl font-light text-[#1a1a1a]">
              Write a Review
            </DialogTitle>
            {productName && (
              <p className="text-xs text-[#888] tracking-wide mt-1 line-clamp-1">{productName}</p>
            )}
          </DialogHeader>

          <div className="reviews-divider my-5" />

          <div className="space-y-6 reviews-sans">

            {/* Star Rating */}
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[#888] mb-3">
                Your Rating
              </label>
              <div className="flex items-center gap-2">
                <StarRating rating={rating} size={28} interactive onRate={setRating} />
                {rating > 0 && (
                  <span className="reviews-serif text-xl font-light text-[#888] ml-2">
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[#888] mb-2">
                Review Title
              </label>
              <Input
                placeholder="Summarise your experience"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="review-input focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[#888] mb-2">
                Your Review
              </label>
              <Textarea
                placeholder="Tell others what you think about this product…"
                value={description}
                onChange={(e) => {
                  if (e.target.value.length <= 400) setDescription(e.target.value);
                }}
                className="review-input focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[140px] resize-none"
              />
              <div className="flex justify-end mt-1.5">
                <span className="text-[11px] text-[#aaa]">{description.length} / 400</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button className="submit-btn" onClick={handleSubmitReview} disabled={loading}>
                {loading ? 'Submitting…' : 'Submit Review'}
              </button>
              <button className="cancel-btn" onClick={() => setShowDialog(false)}>
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomerReviewSection;