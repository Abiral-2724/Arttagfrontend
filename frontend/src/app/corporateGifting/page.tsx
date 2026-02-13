'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, CheckCircle2, Package, Sparkles, Users, Heart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

const CorporateGiftingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    contact: '',
    companyEmail: '',
    askAnything: '',
    quantity: ''
  });
  
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('onboarding');
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  const whyChooseUsCards = [
    {
      title: "GIFTING FOR",
      subtitle: "EVERY OCCASION",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
      gradient: "from-[#2c5f5a] to-[#234944]"
    },
    {
      title: "50,000+",
      subtitle: "INNOVATIVE PRODUCTS",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
      gradient: "from-[#d4956c] to-[#b87d56]"
    },
    {
      title: "ADD THOUGHTFUL",
      subtitle: "GESTURES",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80",
      gradient: "from-[#e87b5f] to-[#d4654d]"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % whyChooseUsCards.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + whyChooseUsCards.length) % whyChooseUsCards.length);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleTouchStart = (e) => {
      isDown = true;
      startX = e.touches[0].pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleTouchMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.touches[0].pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
      isDown = false;
      const slideWidth = slider.offsetWidth;
      const newSlide = Math.round(slider.scrollLeft / slideWidth);
      setCurrentSlide(newSlide);
      slider.scrollTo({
        left: newSlide * slideWidth,
        behavior: 'smooth'
      });
    };

    slider.addEventListener('touchstart', handleTouchStart);
    slider.addEventListener('touchmove', handleTouchMove);
    slider.addEventListener('touchend', handleTouchEnd);

    return () => {
      slider.removeEventListener('touchstart', handleTouchStart);
      slider.removeEventListener('touchmove', handleTouchMove);
      slider.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.companyEmail.trim()) {
      newErrors.companyEmail = 'Company email is required';
    } else if (!emailRegex.test(formData.companyEmail)) {
      newErrors.companyEmail = 'Invalid email format';
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/corporate/add/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity)
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          companyName: '',
          contact: '',
          companyEmail: '',
          askAnything: '',
          quantity: ''
        });
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        alert(data.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const categories = [
    { id: 'onboarding', label: 'ONBOARDING', icon: Users },
    { id: 'festive', label: 'FESTIVE', icon: Sparkles },
    { id: 'cobranding', label: 'CO-BRANDING', icon: Heart },
    { id: 'ecofriendly', label: 'ECO-FRIENDLY', icon: Package }
  ];

  return (
    <div className="min-h-screen bg-[#f5f3f0]" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      <Navbar></Navbar>
      
     
      <section className="relative overflow-hidden bg-gradient-to-br from-[#e8e4df] via-[#f0ece7] to-[#d9d5d0] pt-24 pb-32">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #2c5f5a 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fadeIn">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#1a1a1a] leading-[0.95]">
                CORPORATE<br />
                <span className="text-[#2c5f5a]">GIFTING</span>
              </h1>
              <p className="text-lg md:text-xl text-[#4a4a4a] leading-relaxed max-w-xl">
                Begin, nurture and celebrate the relationships you foster with your employees, 
                clients, business partners and more with thoughtful corporate gifting.
              </p>
              <button 
                onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })}
                className="group bg-[#2c5f5a] text-white px-10 py-5 rounded-none text-lg font-semibold tracking-wide hover:bg-[#234944] transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl"
              >
                GET STARTED
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </div>
            
            {/* Hide image on mobile */}
            <div className="relative animate-slideIn hidden lg:block">
              <div className="aspect-square bg-[#2c5f5a] shadow-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80" 
                  alt="Corporate gifts" 
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#d4956c] rounded-full opacity-60 blur-2xl" />
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-[#2c5f5a] rounded-full opacity-40 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

     
      <section className="py-15 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-2 tracking-tight text-[#1a1a1a]">
            WHY CHOOSE US?
          </h2>
          <div className="w-24 h-1 bg-[#2c5f5a] mx-auto mb-20" />
          
          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {whyChooseUsCards.map((card, index) => (
              <div key={index} className="group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className={`aspect-[3/5] bg-gradient-to-br ${card.gradient}`}>
                  <img 
                    src={card.image}
                    alt={card.title} 
                    className="w-full h-full object-cover mix-blend-overlay opacity-60"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                  <h3 className="text-3xl font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-2xl text-white/90 font-light">{card.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Slider */}
          <div className="md:hidden relative">
            <div 
              ref={sliderRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {whyChooseUsCards.map((card, index) => (
                <div key={index} className="flex-shrink-0 w-full snap-center">
                  <div className="group relative overflow-hidden shadow-lg">
                    <div className={`aspect-[4/5] bg-gradient-to-br ${card.gradient}`}>
                      <img 
                        src={card.image}
                        alt={card.title} 
                        className="w-full h-full object-cover mix-blend-overlay opacity-60"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                      <h3 className="text-3xl font-bold text-white mb-2">{card.title}</h3>
                      <p className="text-2xl text-white/90 font-light">{card.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Controls */}
            

            {/* Slider Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {whyChooseUsCards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                    sliderRef.current?.scrollTo({
                      left: index * sliderRef.current.offsetWidth,
                      behavior: 'smooth'
                    });
                  }}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === index ? 'w-8 bg-[#2c5f5a]' : 'w-2 bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What's Possible Section */}
      <section className="py-24 bg-[#f5f3f0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-4 tracking-tight text-[#1a1a1a]">
            WHAT'S POSSIBLE
          </h2>
          <div className="w-24 h-1 bg-[#2c5f5a] mx-auto mb-12" />
          
          {/* Desktop: Tabs centered */}
          <div className="hidden md:flex justify-center gap-4 mb-16 flex-wrap">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`px-8 py-3 rounded-full font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${
                    activeTab === category.id
                      ? 'bg-[#2c5f5a] text-white shadow-lg'
                      : 'bg-white text-[#2c5f5a] border-2 border-[#2c5f5a] hover:bg-[#2c5f5a] hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* Desktop: Two-column layout */}
          <div className="hidden md:grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-5xl font-bold text-[#1a1a1a] leading-tight">
                {activeTab === 'onboarding' && 'WELCOME WITH PURPOSE'}
                {activeTab === 'festive' && 'CELEBRATE TOGETHER'}
                {activeTab === 'cobranding' && 'POWERFUL PARTNERSHIPS'}
                {activeTab === 'ecofriendly' && 'GIFTS THAT GIVE BACK'}
              </h3>
              <p className="text-xl text-[#4a4a4a] leading-relaxed">
                {activeTab === 'onboarding' && 'Set the tone from day one with curated onboarding kits that reflect your company\'s values and culture. Personalise each item to make your new hires feel valued and appreciated.'}
                {activeTab === 'festive' && 'Mark special occasions with gifts that bring joy and strengthen bonds. From festive celebrations to milestone achievements, make every moment memorable.'}
                {activeTab === 'cobranding' && 'Make your collaborations shine with co-branded gifts that tell a story. Combine your brand with ours to create unique, high-quality gifts that enhance relationships and showcase shared values.'}
                {activeTab === 'ecofriendly' && 'Show your commitment to sustainability with eco-friendly corporate gifts. Thoughtfully designed to minimise impact and maximise appreciation, these gifts highlight your dedication to the planet and the people you work with.'}
              </p>
              <button className="bg-transparent border-2 border-[#2c5f5a] text-[#2c5f5a] px-8 py-4 rounded-none font-semibold tracking-wide hover:bg-[#2c5f5a] hover:text-white transition-all duration-300">
                EXPLORE MORE
              </button>
            </div>
            <div className="relative">
              <div className="aspect-square overflow-hidden shadow-xl">
                <img 
                  src={
                    activeTab === 'onboarding' 
                      ? 'https://images.dailyobjects.com/marche/assets/images/other-2/Review-Section1.jpg?tr=cm-pad_crop,v-3,w-686,dpr-2'
                      : activeTab === 'festive'
                      ? 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80'
                      : activeTab === 'cobranding'
                      ? 'https://images.dailyobjects.com/marche/assets/images/other-2/co-branding1.jpg?tr=cm-pad_crop,v-3,w-686,dpr-2'
                      : 'https://images.dailyobjects.com/marche/assets/images/other-2/Corporate-gifting-eco-friendly.jpg?tr=cm-pad_crop,v-3,w-686,dpr-2'
                  }
                  alt={activeTab} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Mobile: Vertical layout with tabs at top */}
          <div className="md:hidden">
            {/* Tabs */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`px-6 py-3 rounded-full font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
                      activeTab === category.id
                        ? 'bg-[#2c5f5a] text-white shadow-lg'
                        : 'bg-white text-[#2c5f5a] border-2 border-[#2c5f5a] hover:bg-[#2c5f5a] hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    {category.label}
                  </button>
                );
              })}
            </div>

            {/* Image */}
            <div className="mb-8">
              <div className="relative overflow-hidden shadow-xl">
                <img 
                  src={
                    activeTab === 'onboarding' 
                      ? 'https://images.dailyobjects.com/marche/assets/images/other-2/Review-Section1.jpg?tr=cm-pad_crop,v-3,w-686,dpr-2'
                      : activeTab === 'festive'
                      ? 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80'
                      : activeTab === 'cobranding'
                      ? 'https://images.dailyobjects.com/marche/assets/images/other-2/co-branding1.jpg?tr=cm-pad_crop,v-3,w-686,dpr-2'
                      : 'https://images.dailyobjects.com/marche/assets/images/other-2/Corporate-gifting-eco-friendly.jpg?tr=cm-pad_crop,v-3,w-686,dpr-2'
                  }
                  alt={activeTab} 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-[#1a1a1a] leading-tight">
                {activeTab === 'onboarding' && 'WELCOME WITH PURPOSE'}
                {activeTab === 'festive' && 'CELEBRATE TOGETHER'}
                {activeTab === 'cobranding' && 'POWERFUL PARTNERSHIPS'}
                {activeTab === 'ecofriendly' && 'GIFTS THAT GIVE BACK'}
              </h3>
              <p className="text-lg text-[#4a4a4a] leading-relaxed">
                {activeTab === 'onboarding' && 'Set the tone from day one with curated onboarding kits that reflect your company\'s values and culture. Personalise each item to make your new hires feel valued and appreciated.'}
                {activeTab === 'festive' && 'Mark special occasions with gifts that bring joy and strengthen bonds. From festive celebrations to milestone achievements, make every moment memorable.'}
                {activeTab === 'cobranding' && 'Make your collaborations shine with co-branded gifts that tell a story. Combine your brand with ours to create unique, high-quality gifts that enhance relationships and showcase shared values.'}
                {activeTab === 'ecofriendly' && 'Show your commitment to sustainability with eco-friendly corporate gifts. Thoughtfully designed to minimise impact and maximise appreciation, these gifts highlight your dedication to the planet and the people you work with.'}
              </p>
              <button className="bg-transparent border-2 border-[#2c5f5a] text-[#2c5f5a] px-8 py-4 rounded-none font-semibold tracking-wide hover:bg-[#2c5f5a] hover:text-white transition-all duration-300">
                EXPLORE MORE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-[#1a1a1a]">
              DROP YOUR EMAIL<br />AND WE'LL GET IN TOUCH.
            </h2>
            <p className="text-lg text-[#4a4a4a]">
              For any further queries, email us at{' '}
              <a href="mailto:support@arttag.in" className="text-[#2c5f5a] underline">
                support@arttag.in
              </a>
            </p>
          </div>

          {submitSuccess && (
            <Alert className="mb-8 bg-[#2c5f5a] text-white border-none">
              <CheckCircle2 className="h-5 w-5" />
              <AlertDescription className="text-white ml-2">
                Your request has been submitted successfully! We'll get back to you soon.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#1a1a1a] tracking-wide">
                  Name <span className="text-[#e87b5f]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={`w-full px-5 py-4 border-2 rounded-none focus:outline-none focus:ring-0 transition-all ${
                    errors.name 
                      ? 'border-[#e87b5f] focus:border-[#e87b5f]' 
                      : 'border-[#d9d5d0] focus:border-[#2c5f5a]'
                  }`}
                />
                {errors.name && (
                  <p className="text-[#e87b5f] text-sm font-medium">{errors.name}</p>
                )}
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#1a1a1a] tracking-wide">
                  Company Name <span className="text-[#e87b5f]">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="ABC Company"
                  className={`w-full px-5 py-4 border-2 rounded-none focus:outline-none focus:ring-0 transition-all ${
                    errors.companyName 
                      ? 'border-[#e87b5f] focus:border-[#e87b5f]' 
                      : 'border-[#d9d5d0] focus:border-[#2c5f5a]'
                  }`}
                />
                {errors.companyName && (
                  <p className="text-[#e87b5f] text-sm font-medium">{errors.companyName}</p>
                )}
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#1a1a1a] tracking-wide">
                  Contact <span className="text-[#e87b5f]">*</span>
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="+91 1234567890"
                  className={`w-full px-5 py-4 border-2 rounded-none focus:outline-none focus:ring-0 transition-all ${
                    errors.contact 
                      ? 'border-[#e87b5f] focus:border-[#e87b5f]' 
                      : 'border-[#d9d5d0] focus:border-[#2c5f5a]'
                  }`}
                />
                {errors.contact && (
                  <p className="text-[#e87b5f] text-sm font-medium">{errors.contact}</p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#1a1a1a] tracking-wide">
                  Quantity <span className="text-[#e87b5f]">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="50"
                  min="1"
                  className={`w-full px-5 py-4 border-2 rounded-none focus:outline-none focus:ring-0 transition-all ${
                    errors.quantity 
                      ? 'border-[#e87b5f] focus:border-[#e87b5f]' 
                      : 'border-[#d9d5d0] focus:border-[#2c5f5a]'
                  }`}
                />
                {errors.quantity && (
                  <p className="text-[#e87b5f] text-sm font-medium">{errors.quantity}</p>
                )}
              </div>

              {/* Company Email */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-[#1a1a1a] tracking-wide">
                  Company Email <span className="text-[#e87b5f]">*</span>
                </label>
                <input
                  type="email"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleInputChange}
                  placeholder="john@company.com"
                  className={`w-full px-5 py-4 border-2 rounded-none focus:outline-none focus:ring-0 transition-all ${
                    errors.companyEmail 
                      ? 'border-[#e87b5f] focus:border-[#e87b5f]' 
                      : 'border-[#d9d5d0] focus:border-[#2c5f5a]'
                  }`}
                />
                {errors.companyEmail && (
                  <p className="text-[#e87b5f] text-sm font-medium">{errors.companyEmail}</p>
                )}
              </div>

              {/* Ask Anything */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-[#1a1a1a] tracking-wide">
                  Ask Us Anything
                </label>
                <textarea
                  name="askAnything"
                  value={formData.askAnything}
                  onChange={handleInputChange}
                  placeholder="Type your question or message"
                  rows="5"
                  maxLength="300"
                  className="w-full px-5 py-4 border-2 border-[#d9d5d0] rounded-none focus:outline-none focus:border-[#2c5f5a] focus:ring-0 resize-none transition-all"
                />
                <div className="text-right text-sm text-[#888]">
                  {formData.askAnything.length}/300
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#2c5f5a] text-white px-16 py-5 rounded-none font-semibold text-lg tracking-wide hover:bg-[#234944] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
              </button>
            </div>
          </form>
        </div>
      </section>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600;700&display=swap');
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 1s ease-out;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
      
      <Separator />
      <Footer></Footer>
    </div>
  );
};

export default CorporateGiftingPage;