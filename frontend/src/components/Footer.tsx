import React from 'react';
import {
  Star,
  Package,
  RotateCcw,
  CheckCircle,
  ArrowUp,
  AppleIcon,
  Play,
} from 'lucide-react';
import FooterPart from './FooterPart';
import Link from 'next/link';

interface ExpandedSections {
  mostSearched: boolean;
  gifts: boolean;
  blogs: boolean;
}
type SectionKey = keyof ExpandedSections;

// Extracted as a standalone component so it renders at the right size
const ArttgLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="55 7 37 36"
    className="w-10 ml-2 h-auto"
  >
    <g>
      <path d="M62.85,33.21c.11,0,.17.04.19.21.2,1.7-.04,4.05-.01,5.84,0,.44.01.95-.3,1.15-.34.21-1.72-.06-2.18-.12-14.77-1.86-19.13-21.03-6.37-28.96,3.44-2.14,5.73-2.15,9.65-2.25.57-.01,1.26,0,1.76.06-2.15,2.88-1.5,7.52,2.16,8.77,1.53.52,2.98.08,4.52.4v21.62c0,.2-.1.41-.29.49h-6.67c-.08,0-.16-.03-.22-.09-.06-.06-.09-.14-.09-.22v-20.52c0-.35-.19-.72-.24-.86-1.18-3.54-5.67-2.47-7.9-.6-4.54,3.81-3.78,11.34,1.53,14.02.34.17,1.24.75,2.41.87l2.06.2Z" />
      <path d="M68.98,16.48c-.15,0-.29-.02-.44-.05-1.63-.42-2.77-2.4-2.6-4.02.15-1.44,1.7-3.34,3.22-3.34h20.4c.15,0,.17.11.18.44v6.66c0,.08-.03.16-.09.22-.06.06-.14.09-.22.09h-20.45Z" />
      <path d="M73.96,40.29v-21.62c0-.2.1-.41.29-.49h6.67c.08,0,.16.03.22.09.06.06.09.14.09.22v18.21c.03.76-.62,1.51-.8,1.75-1.53,2.1-4.13,2.17-6.49,1.83Z" />
    </g>
  </svg>
);

const ratingPlatforms = [
  {
    isLogo: true,
    icon: null,
    label: 'Arttag.in',
    rating: '4.6',
    reviews: '8.5k+ Reviews',
    stars: 5,
  },
  {
    isLogo: false,
    icon: <AppleIcon className="w-6 h-6 text-gray-800" />,
    label: 'App Store',
    rating: '4.6',
    reviews: '7.7k+ Reviews',
    stars: 5,
  },
  {
    isLogo: false,
    icon: <Play className="w-6 h-6 text-gray-800 fill-gray-800" />,
    label: 'Play Store',
    rating: '4.3',
    reviews: '5.3k+ Reviews',
    stars: 4,
  },
  {
    isLogo: false,
    icon: (
      <span
        className="text-2xl font-black text-gray-800"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        G
      </span>
    ),
    label: 'Google',
    rating: '4.7',
    reviews: '200+ Reviews',
    stars: 5,
  },
];

const features = [
  { icon: <Package className="w-5 h-5" />, label: 'Quick Delivery', desc: 'Pan-India shipping' },
  { icon: <RotateCcw className="w-5 h-5" />, label: 'Easy Returns', desc: '7-day hassle-free' },
  { icon: <CheckCircle className="w-5 h-5" />, label: 'Quality Assured', desc: 'Rigorously tested' },
];

const Footer: React.FC = () => {
  const [expandedSections, setExpandedSections] = React.useState<ExpandedSections>({
    mostSearched: false,
    gifts: false,
    blogs: false,
  });

  const toggleSection = (section: SectionKey): void => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full font-sans bg-white">

      {/* ── TRUST STRIP ─────────────────────────────────── */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-16">

          {/* Section headline */}
          <div className="flex items-center justify-center gap-4 mb-14">
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-gray-200" />
            <h2 className="text-center text-gray-900 text-xs tracking-[0.35em] uppercase font-medium">
              Trusted by over a million customers
            </h2>
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-gray-200" />
          </div>

          {/* Rating Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {ratingPlatforms.map((platform, i) => (
              <div
                key={i}
                className="group relative flex flex-col items-center py-8 px-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-default"
              >
                {/* Subtle top highlight on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 0%, rgba(0,0,0,0.025) 0%, transparent 65%)',
                  }}
                />

                {/* Icon area — logo card gets a wider flat container; others get the rounded box */}
                {platform.isLogo ? (
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    <Link href="/" aria-label="Arttag home" className="flex items-center justify-center w-full h-full">
                      <ArttgLogo />
                    </Link>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    {platform.icon}
                  </div>
                )}

                {/* Platform name */}
                <span className="text-gray-950 text-xs tracking-widest uppercase mb-3">
                  {platform.label}
                </span>

                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={`w-3 h-3 ${
                        j < platform.stars
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Rating number */}
                <span className="text-gray-950 text-2xl font-bold tracking-tight mb-1">
                  {platform.rating}
                </span>
                <span className="text-gray-500 text-xs">{platform.reviews}</span>
              </div>
            ))}
          </div>

          {/* Gradient divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-14" />

          {/* Feature Pillars */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-16">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-default">
                <div className="relative w-12 h-12 rounded-full flex items-center justify-center border border-gray-200 bg-gray-50 text-gray-500 group-hover:text-emerald-600 group-hover:border-emerald-300 group-hover:bg-emerald-50 transition-all duration-300 shadow-sm">
                  {f.icon}
                  {/* Expanding ring on hover */}
                  <span className="absolute inset-0 rounded-full border border-emerald-300/0 group-hover:border-emerald-200 group-hover:scale-[1.4] transition-all duration-500 opacity-0 group-hover:opacity-100" />
                </div>
                <div>
                  <p className="text-gray-950 text-sm font-semibold tracking-wide">{f.label}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back to top */}
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-end">
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2 text-gray-400 hover:text-gray-900 text-xs tracking-widest uppercase transition-all duration-300"
            >
              Back to top
              <span className="w-7 h-7 rounded-full border border-gray-200 group-hover:border-gray-400 flex items-center justify-center group-hover:-translate-y-0.5 transition-all duration-300">
                <ArrowUp className="w-3 h-3" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── FOOTER LINKS ─────────────────────────────────── */}
      <FooterPart />

    </footer>
  );
};

export default Footer;