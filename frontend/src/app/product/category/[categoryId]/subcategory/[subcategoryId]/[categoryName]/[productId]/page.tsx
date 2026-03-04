'use client'
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Check, Gift, Tag, Package, CreditCard, RotateCcw, Heart, Loader2, Share2, X, Copy, Check as CheckIcon, ArrowRight, ChevronDown } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import CustomerReviewSection from '@/components/CustomerReview';

// Add this to your global CSS or _document.tsx:
// @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

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

interface Color {
  id: string;
  name: string;
  hex: string;
  productId: string;
  colorImage1: string | null;
  colorImage2: string | null;
  colorImage3: string | null;
  colorImage4: string | null;
  colorImage5: string | null;
}

interface ProductImage {
  id: string;
  url: string;
  altText: string;
  description: string;
  productId: string;
}

interface SimilarProduct {
  id: string;
  name: string;
  originalPrice: number;
  discountPrice: number;
  type: string;
  primaryImage1: string;
  primaryImage2: string;
  colors: Color[];
  images: ProductImage[];
  totalCount: number;
}

const ProductDetailPage = () => {
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [product, setProduct]: any = useState(null);
  const [selectedColor, setSelectedColor]: any = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError]: any = useState(null);
  const [isInCart, setIsInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);
  const [userId, setUserId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
  const [loadingSimilarProducts, setLoadingSimilarProducts] = useState(false);
  const { productId } = useParams();
  const [productName, setProductName] = useState("")
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
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

  const fetchSimilarProducts = async (subcategoryId: string) => {
    setLoadingSimilarProducts(true);
    try {
      const response = await fetch(`${API_BASE_URL}/product/get/all/product/category/${subcategoryId}`);
      const data = await response.json();
      if (data.success) {
        const filteredProducts = data.product.filter((p: SimilarProduct) => p.id !== productId);
        setSimilarProducts(filteredProducts || []);
      }
    } catch (error) {
      console.error('Failed to fetch similar products:', error);
    } finally {
      setLoadingSimilarProducts(false);
    }
  };

  const params = useParams();
  const { categoryId, subcategoryId, categoryName } = params;

  const handleSimilarProductClick = (similarProductId: string) => {
    router.push(`http://localhost:3000/product/category/${categoryId}/subcategory/${subcategoryId}/${categoryName}/${similarProductId}`);
  };

  const handleViewAllClick = () => {
    if (product?.categoryId) {
      const catName = product.categoryName || 'products';
      const formattedCategoryName = catName.toUpperCase().replace(/\s+/g, '%20');
      router.push(`/product/category/${product.parentCategoryId}/subcategory/${product.categoryId}/${formattedCategoryName}`);
    }
  };

  const handleCategoryClick = (subcategory: Subcategory) => {
    const catId = subcategory.parentId;
    const subId = subcategory.id;
    const subName = subcategory.name.toLowerCase().replace(/\s+/g, '-');
    window.location.href = `/product/category/${catId}/subcategory/${subId}/${subName}`;
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? window.localStorage?.getItem("arttagtoken") : null;
    const storedUserId: any = typeof window !== 'undefined' ? window.localStorage?.getItem("arttagUserId") : null;
    if (storedUserId && token) {
      setUserId(storedUserId);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    fetchProductDetails(storedUserId);
  }, [productId]);

  const fetchProductDetails = async (currentUserId = null) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/product/get/product/details/${productId}`);
      const data = await response.json();
      if (data.success) {
        setProduct(data.product);
        setProductName(data.product.name);
        if (data.product.categoryId) {
          fetchSimilarProducts(data.product.categoryId);
        }
        if (currentUserId) {
          if (data.product.wishlists?.length > 0) {
            setIsInWishlist(data.product.wishlists.some(w => w.userId === currentUserId));
          }
          if (data.product.cart?.length > 0) {
            setIsInCart(data.product.cart.some(c => c.ownerId === currentUserId));
          }
        }
        if (data.product.colors?.length > 0) {
          setSelectedColor(data.product.colors[0]);
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentImages = () => {
    if (!selectedColor) return [];
    const images: any = [];
    if (selectedColor.colorImage1) images.push(selectedColor.colorImage1);
    if (selectedColor.colorImage2) images.push(selectedColor.colorImage2);
    if (selectedColor.colorImage3) images.push(selectedColor.colorImage3);
    if (selectedColor.colorImage4) images.push(selectedColor.colorImage4);
    if (selectedColor.colorImage5) images.push(selectedColor.colorImage5);
    return images;
  };

  const nextImage = () => {
    const images = getCurrentImages();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = getCurrentImages();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setCurrentImageIndex(0);
  };

  const minSwipeDistance = 50;
  const onTouchStart = (e) => { setTouchEnd(0); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e) => { setTouchEnd(e.targetTouches[0].clientX); };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextImage();
    if (distance < -minSwipeDistance) prevImage();
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) { router.push('/login'); return; }
    if (product.totalCount === 0) { alert('This product is currently out of stock'); return; }
    if (isInCart) { router.push(`/${userId}/cart`); return; }
    try {
      setAddingToCart(true);
      const response = await axios.post(`${API_BASE_URL}/cart/add/product/user/cart`, { userId, productId });
      if (response.data.success) { setIsInCart(true); alert('Product added to cart successfully!'); }
    } catch (err: any) {
      if (err.response?.data?.message === 'Product already added to cart') setIsInCart(true);
      alert(err.response?.data?.message || 'Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isLoggedIn) { router.push('/login'); return; }
    try {
      setTogglingWishlist(true);
      if (isInWishlist) {
        const response = await axios.delete(`${API_BASE_URL}/wishlist/delete/item/user/wishlist`, { data: { userId, productId } });
        if (response.data.success) setIsInWishlist(false);
      } else {
        const response = await axios.post(`${API_BASE_URL}/wishlist/add/product/user/wishlist`, { userId, productId });
        if (response.data.success) setIsInWishlist(true);
      }
    } catch (err: any) {
      if (err.response?.data?.message === 'product already added to user wishlist') setIsInWishlist(true);
      alert(err.response?.data?.message || 'Failed to update wishlist');
    } finally {
      setTogglingWishlist(false);
    }
  };

  const getProductUrl = () => typeof window !== 'undefined' ? window.location.href : '';
  const getShareText = () => `Check out ${product?.name} for ₹${product?.discountPrice}!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getProductUrl());
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch { alert('Failed to copy link'); }
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(getProductUrl());
    const text = encodeURIComponent(getShareText());
    const urls = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
      email: `mailto:?subject=${text}&body=${url}`,
    };
    if (urls[platform]) window.open(urls[platform], '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    setShowShareModal(true);
  };

  const calculateDiscount = (orig: number, disc: number) => Math.round(((orig - disc) / orig) * 100);

  // ─── Loading State ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center gap-8">
        <Link href="/">
          <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-light tracking-[0.2em] text-[#1a1a1a]">ARTTAG</span>
        </Link>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs tracking-[0.15em] uppercase text-[#888]">Loading product</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f7]">
        <Alert><AlertDescription>Product not found</AlertDescription></Alert>
      </div>
    );
  }

  const images = getCurrentImages();
  const discount = Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100);

  const CartButtonLabel = () => {
    if (product.totalCount === 0) return <>Out of Stock</>;
    if (addingToCart) return <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />Adding…</>;
    if (!isLoggedIn) return <>Login to Add to Cart</>;
    if (isInCart) return <>Go to Cart <ArrowRight className="w-4 h-4 inline ml-1" /></>;
    return <>Add to Cart</>;
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-[#faf9f7] pb-24 md:pb-0">
      {/* Google Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .serif { font-family: 'Cormorant Garamond', serif; }
        .sans { font-family: 'DM Sans', sans-serif; }

        .product-image-wrap { position: relative; overflow: hidden; background: #f5f3ef; }
        .product-image-wrap img { transition: transform 0.6s cubic-bezier(0.4,0,0.2,1); }
        .product-image-wrap:hover img { transform: scale(1.03); }

        .thumb-btn { transition: all 0.2s ease; border: 1.5px solid transparent; }
        .thumb-btn.active { border-color: #1a1a1a; }
        .thumb-btn:hover { border-color: #999; }

        .color-swatch { position: relative; transition: transform 0.2s ease; }
        .color-swatch::after { content: ''; position: absolute; inset: -4px; border-radius: 9999px; border: 1.5px solid transparent; transition: border-color 0.2s; }
        .color-swatch.active::after { border-color: #1a1a1a; }

        .cta-btn { letter-spacing: 0.12em; transition: all 0.25s ease; }
        .cta-btn:hover:not(:disabled) { background: #333; }
        .cta-btn:disabled { opacity: 0.6; }

        .wishlist-btn { transition: all 0.2s ease; }
        .wishlist-btn:hover { transform: scale(1.12); }

        .divider { height: 1px; background: linear-gradient(to right, transparent, #d4cfc8 30%, #d4cfc8 70%, transparent); }

        .similar-card { transition: all 0.35s cubic-bezier(0.4,0,0.2,1); }
        .similar-card:hover { transform: translateY(-4px); }

        .badge-tag { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; padding: 4px 10px; border-radius: 2px; font-weight: 500; }

        [data-accordion-item] { border-bottom: 1px solid #e8e4de; }
        
        .share-modal-bg { backdrop-filter: blur(8px); background: rgba(0,0,0,0.4); }
      `}</style>

      <Navbar />

      {/* ── Hero Product Section ────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 pt-8 pb-16">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ─ LEFT: Image Gallery ─ */}
          <div className="space-y-3 md:sticky md:top-8">
            {/* Main Image */}
            <div
              className="product-image-wrap aspect-[4/5] rounded-sm cursor-grab active:cursor-grabbing"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {images.length > 0 && (
                <img
                  src={images[currentImageIndex]}
                  alt={selectedColor?.name}
                  className="w-full h-full object-cover select-none"
                  draggable="false"
                />
              )}

              {/* Floating Badges */}
              {discount > 0 && (
                <div className="absolute top-5 left-5 badge-tag bg-[#1a1a1a] text-white">
                  −{discount}%
                </div>
              )}
              {product.totalCount === 0 && (
                <div className="absolute top-5 left-5 badge-tag bg-[#c0392b] text-white">
                  Sold Out
                </div>
              )}
              {product.totalCount > 0 && product.totalCount < 20 && (
                <div className="absolute top-5 left-5 badge-tag bg-[#e67e22] text-white">
                  Only {product.totalCount} left
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute top-5 right-5 flex flex-col gap-2">
                {isLoggedIn && (
                  <button
                    onClick={handleToggleWishlist}
                    disabled={togglingWishlist}
                    className={`wishlist-btn w-10 h-10 rounded-full flex items-center justify-center shadow-md ${isInWishlist ? 'bg-[#c0392b]' : 'bg-white/90'}`}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-white text-white' : 'text-[#1a1a1a]'}`} />
                  </button>
                )}
                <button
                  onClick={handleNativeShare}
                  className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md wishlist-btn"
                >
                  <Share2 className="w-4 h-4 text-[#1a1a1a]" />
                </button>
              </div>

              {/* Prev/Next Arrows */}
              {images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/85 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/85 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Dot Indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-5 h-1.5 bg-[#1a1a1a]' : 'w-1.5 h-1.5 bg-white/70'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`thumb-btn flex-none w-16 h-16 rounded-sm overflow-hidden bg-[#f5f3ef] ${idx === currentImageIndex ? 'active' : ''}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─ RIGHT: Product Info ─ */}
          <div className="space-y-7 pt-2 md:pt-6">

            {/* Category breadcrumb pill */}
            {product.categoryName && (
              <p className="text-xs tracking-[0.18em] uppercase text-[#888] sans">
                {product.type && <span>{product.type} · </span>}{product.categoryName}
              </p>
            )}

            {/* Product Name */}
            <h1 className="serif text-lg md:text-2xl font-light leading-tight text-[#1a1a1a]">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-semibold text-[#1a1a1a]">₹{product.discountPrice.toLocaleString()}</span>
              {product.originalPrice > product.discountPrice && (
                <span className="text-lg text-[#aaa] line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
              <span className="text-xs tracking-wide text-[#888]">Incl. all taxes</span>
            </div>

            {/* Stock Badge */}
            <div>
              {product.totalCount === 0 ? (
                <span className="badge-tag bg-[#fdecea] text-[#c0392b]">● Out of Stock</span>
              ) : product.totalCount < 20 ? (
                <span className="badge-tag bg-[#fef5e7] text-[#e67e22]">● {product.totalCount} units left</span>
              ) : (
                <span className="badge-tag bg-[#eafaf1] text-[#27ae60]">● In Stock</span>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-[#555] leading-relaxed text-sm">{product.shortDescription}</p>
            )}

            <div className="divider" />

            {/* Color Selector */}
            {product.colors?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-xs tracking-[0.15em] uppercase font-medium text-[#444]">Colour</p>
                  {selectedColor && <p className="text-xs text-[#888]">— {selectedColor.name}</p>}
                </div>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => handleColorChange(color)}
                      title={color.name}
                      className={`color-swatch w-8 h-8 rounded-full shadow-sm ${selectedColor?.id === color.id ? 'active' : ''}`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* CTA Button (Desktop) */}
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.totalCount === 0}
              className="cta-btn hidden md:flex items-center justify-center w-full max-w-sm py-4 px-8 bg-[#1a1a1a] text-white text-xs tracking-[0.18em] uppercase font-medium rounded-sm"
            >
              <CartButtonLabel />
            </button>

            <div className="divider" />

            {/* Accordion Details */}
            <Accordion type="single" collapsible className="w-full space-y-0">
              <AccordionItem value="product-details" className="border-b border-[#e8e4de]">
                <AccordionTrigger className="serif text-lg font-light py-4 hover:no-underline text-[#1a1a1a] [&>svg]:text-[#888]">
                  Product Details
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-[#555] text-sm leading-relaxed pb-4">{product.description}</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="specifications" className="border-b border-[#e8e4de]">
                <AccordionTrigger className="serif text-lg font-light py-4 hover:no-underline text-[#1a1a1a] [&>svg]:text-[#888]">
                  Specifications
                </AccordionTrigger>
                <AccordionContent>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pb-4 text-sm">
                    {[
                      ['Material', product.material],
                      ['Dimensions', product.dimensions],
                      ['Weight', product.weight ? `${product.weight}g` : null],
                      ['Country of Origin', product.countryOfOrigin],
                    ].filter(([, v]) => v).map(([label, value]) => (
                      <div key={label as string} className="border-b border-[#f0ece6] pb-3">
                        <dt className="text-xs tracking-[0.1em] uppercase text-[#888] mb-0.5">{label}</dt>
                        <dd className="text-[#333] font-medium">{value}</dd>
                      </div>
                    ))}
                    {product.care && (
                      <div className="sm:col-span-2 border-b border-[#f0ece6] pb-3">
                        <dt className="text-xs tracking-[0.1em] uppercase text-[#888] mb-0.5">Care Instructions</dt>
                        <dd className="text-[#333]">{product.care}</dd>
                      </div>
                    )}
                    {product.packageContent && (
                      <div className="sm:col-span-2 border-b border-[#f0ece6] pb-3">
                        <dt className="text-xs tracking-[0.1em] uppercase text-[#888] mb-0.5">Package Content</dt>
                        <dd className="text-[#333]">{product.packageContent}</dd>
                      </div>
                    )}
                    {product.manufacturerName && (
                      <div className="pb-3">
                        <dt className="text-xs tracking-[0.1em] uppercase text-[#888] mb-0.5">Manufacturer</dt>
                        <dd className="text-[#333]">{product.manufacturerName}</dd>
                      </div>
                    )}
                    {product.packerName && (
                      <div className="pb-3">
                        <dt className="text-xs tracking-[0.1em] uppercase text-[#888] mb-0.5">Packer</dt>
                        <dd className="text-[#333]">{product.packerName}</dd>
                      </div>
                    )}
                  </dl>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="delivery" className="border-b border-[#e8e4de]">
                <AccordionTrigger className="serif text-lg font-light py-4 hover:no-underline text-[#1a1a1a] [&>svg]:text-[#888]">
                  Delivery & Returns
                </AccordionTrigger>
                <AccordionContent>
                  <dl className="space-y-4 pb-4 text-sm">
                    {[
                      ['Delivery Time', product.delivery],
                      ['Cash on Delivery', product.caseOnDeliveryAvailability ? 'Available' : 'Not Available'],
                      ['Return Policy', product.returnDetails],
                    ].filter(([, v]) => v).map(([label, value]) => (
                      <div key={label as string} className="border-b border-[#f0ece6] pb-3">
                        <dt className="text-xs tracking-[0.1em] uppercase text-[#888] mb-0.5">{label}</dt>
                        <dd className="text-[#333]">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* ── Editorial Feature Images ────────────────────────────── */}
      {product.images?.length > 0 && (
        <div className="space-y-0">
          {product.images.map((image, idx) => (
            <div
              key={image.id}
              className={`grid md:grid-cols-2 items-stretch ${idx % 2 !== 0 ? 'md:[&>*:first-child]:order-2' : ''}`}
            >
              <div className="h-[70vh] overflow-hidden">
                <img src={image.url} alt={image.altText} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <div className="flex flex-col justify-center bg-[#faf9f7] px-10 md:px-20 lg:px-28 py-16 space-y-4">
                <div className="w-8 h-px bg-[#1a1a1a]" />
                <h2 className="serif text-3xl md:text-4xl font-light text-[#1a1a1a] leading-snug">
                  {image.description}
                </h2>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Similar Products ────────────────────────────────────── */}
      {similarProducts.length > 0 && (
        <div className="bg-[#faf9f7] py-16 md:py-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs tracking-[0.18em] uppercase text-[#888] mb-2">Discover more</p>
                <h2 className="serif text-3xl md:text-4xl font-light text-[#1a1a1a]">Similar Products</h2>
              </div>
              <button
                onClick={handleViewAllClick}
                className="hidden sm:flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5 hover:opacity-60 transition-opacity"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {loadingSimilarProducts ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <Carousel opts={{ align: "start", loop: false }} className="w-full">
                <CarouselContent className="-ml-4">
                  {similarProducts.map((item) => {
                    const pd = calculateDiscount(item.originalPrice, item.discountPrice);
                    return (
                      <CarouselItem key={item.id} className="pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4">
                        <div
                          className="similar-card cursor-pointer group"
                          onClick={() => handleSimilarProductClick(item.id)}
                        >
                          {/* Image */}
                          <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f3ef] rounded-sm mb-3">
                            <img
                              src={item.primaryImage1 || item.colors[0]?.colorImage1}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-107"
                            />
                            {pd > 0 && (
                              <span className="absolute top-3 left-3 badge-tag bg-[#1a1a1a] text-white">−{pd}%</span>
                            )}
                            {item.totalCount === 0 && (
                              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                <span className="text-xs tracking-[0.15em] uppercase text-[#888]">Sold Out</span>
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="space-y-1 px-0.5">
                            {item.type && <p className="text-[10px] tracking-[0.15em] uppercase text-[#888]">{item.type}</p>}
                            <h3 className="text-sm font-medium text-[#1a1a1a] line-clamp-2 group-hover:opacity-60 transition-opacity">{item.name}</h3>
                            <div className="flex items-center gap-2 pt-0.5">
                              <span className="text-sm font-semibold">₹{item.discountPrice.toLocaleString()}</span>
                              {item.originalPrice > item.discountPrice && (
                                <span className="text-xs text-[#aaa] line-through">₹{item.originalPrice.toLocaleString()}</span>
                              )}
                            </div>
                            {/* Color dots */}
                            {item.colors?.length > 0 && (
                              <div className="flex gap-1.5 pt-1">
                                {item.colors.slice(0, 5).map((c) => (
                                  <div key={c.id} className="w-3.5 h-3.5 rounded-full border border-[#ddd]" style={{ backgroundColor: c.hex }} title={c.name} />
                                ))}
                                {item.colors.length > 5 && <div className="text-[10px] text-[#888]">+{item.colors.length - 5}</div>}
                              </div>
                            )}
                          </div>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="left-0 border border-[#e8e4de] bg-[#faf9f7] hover:bg-[#1a1a1a] hover:text-white shadow-none" />
                <CarouselNext className="right-0 border border-[#e8e4de] bg-[#faf9f7] hover:bg-[#1a1a1a] hover:text-white shadow-none" />
              </Carousel>
            )}
          </div>
        </div>
      )}

      {/* ── Top Categories ──────────────────────────────────────── */}
      <div className="bg-white py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="mb-10">
            <p className="text-xs tracking-[0.18em] uppercase text-[#888] mb-2">Browse by</p>
            <h2 className="serif text-3xl md:text-4xl font-light text-[#1a1a1a]">Top Categories</h2>
          </div>

          {isLoadingCategories ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <Carousel opts={{ align: "start", loop: false }} className="w-full">
              <CarouselContent className="-ml-4 md:-ml-6">
                {subcategories.map((category) => (
                  <CarouselItem key={category.id} className="pl-4 md:pl-6 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6">
                    <div onClick={() => handleCategoryClick(category)} className="flex flex-col items-center gap-3 cursor-pointer group">
                      <div className="w-full aspect-square rounded-full overflow-hidden bg-[#f5f3ef] shadow-sm group-hover:shadow-lg transition-all duration-300 ring-2 ring-transparent group-hover:ring-[#1a1a1a] ring-offset-2">
                        <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <span className="text-xs font-medium text-center text-[#1a1a1a] tracking-wide group-hover:opacity-60 transition-opacity line-clamp-2">
                        {category.name}
                      </span>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 border border-[#e8e4de] bg-white hover:bg-[#1a1a1a] hover:text-white shadow-none" />
              <CarouselNext className="right-0 border border-[#e8e4de] bg-white hover:bg-[#1a1a1a] hover:text-white shadow-none" />
            </Carousel>
          )}
        </div>
      </div>

      <CustomerReviewSection productId={productId} userId={userId} productName={productName} />

      <div className="divider mx-8" />
      <Footer />

      {/* ── Mobile Sticky CTA ────────────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#e8e4de] p-4 z-50">
        <button
          onClick={handleAddToCart}
          disabled={addingToCart || product.totalCount === 0}
          className="cta-btn w-full py-4 bg-[#1a1a1a] text-white text-xs tracking-[0.18em] uppercase font-medium rounded-sm flex items-center justify-center gap-2"
        >
          <CartButtonLabel />
        </button>
      </div>

      {/* ── Share Modal ──────────────────────────────────────────── */}
      {showShareModal && (
        <div className="share-modal-bg fixed inset-0 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-lg p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="serif text-2xl font-light">Share</h2>
              <button onClick={() => setShowShareModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f3ef] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { id: 'whatsapp', label: 'WhatsApp', bg: '#25D366', letter: 'W' },
                { id: 'facebook', label: 'Facebook', bg: '#1877F2', letter: 'f' },
                { id: 'twitter', label: 'Twitter', bg: '#000', letter: '𝕏' },
                { id: 'linkedin', label: 'LinkedIn', bg: '#0A66C2', letter: 'in' },
                { id: 'telegram', label: 'Telegram', bg: '#26A5E4', letter: '✈' },
                { id: 'email', label: 'Email', bg: '#555', letter: '@' },
              ].map(({ id, label, bg, letter }) => (
                <button
                  key={id}
                  onClick={() => handleShare(id)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-[#f5f3ef] transition-colors"
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: bg }}>
                    {letter}
                  </div>
                  <span className="text-[11px] text-[#666]">{label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-3 py-3.5 border border-[#e8e4de] rounded-sm text-sm tracking-wide hover:bg-[#f5f3ef] transition-colors"
            >
              {linkCopied ? (
                <><CheckIcon className="w-4 h-4 text-[#27ae60]" /><span className="text-[#27ae60]">Link Copied!</span></>
              ) : (
                <><Copy className="w-4 h-4" /><span>Copy Link</span></>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;