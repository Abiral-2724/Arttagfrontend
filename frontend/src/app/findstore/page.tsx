'use client'
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Phone, ExternalLink, ChevronLeft, ChevronRight, Filter, X, Store as StoreIcon, Navigation } from 'lucide-react';
import Navbar from '@/components/Navbar';

// Proper Shadcn UI Components
const Card = ({ className = '', children, ...props }) => (
  <div className={`rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-500 ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ className = '', children, ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

const Input = ({ className = '', ...props }) => (
  <input
    className={`flex h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm transition-all focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-slate-400 ${className}`}
    {...props}
  />
);

const Button = ({ className = '', variant = 'default', size = 'default', children, disabled, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-4 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900/20 shadow-sm hover:shadow-md',
    outline: 'border-2 border-slate-900 bg-white text-slate-900 hover:bg-slate-50 focus:ring-slate-900/20',
    ghost: 'text-slate-700 hover:bg-slate-100 focus:ring-slate-900/10',
    link: 'text-slate-900 underline-offset-4 hover:underline',
  };
  
  const sizes = {
    default: 'h-11 px-6 py-2 text-sm',
    sm: 'h-9 px-4 text-sm',
    lg: 'h-12 px-8 text-base',
    icon: 'h-11 w-11',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Select = ({ className = '', children, value, onChange, ...props }) => (
  <select
    className={`flex h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm transition-all focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    value={value}
    onChange={onChange}
    {...props}
  >
    {children}
  </select>
);

const Badge = ({ className = '', variant = 'default', children, ...props }) => {
  const variants = {
    default: 'bg-slate-900 text-white',
    success: 'bg-emerald-500 text-white',
    outline: 'border-2 border-slate-900 bg-white text-slate-900',
  };
  
  return (
    <div
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// States enum
const STATES = [
  'AndhraPradesh', 'ArunachalPradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'HimachalPradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'MadhyaPradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'TamilNadu', 'Telangana', 'Tripura', 'UttarPradesh',
  'Uttarakhand', 'WestBengal', 'AndamanAndNicobarIslands', 'Chandigarh',
  'DadraAndNagarHaveliAndDamanAndDiu', 'Delhi', 'JammuAndKashmir', 'Ladakh',
  'Lakshadweep', 'Puducherry'
];

const formatStateName = (state) => {
  return state.replace(/([A-Z])/g, ' $1').trim();
};

const formatDayName = (day) => {
  if (day === 'Thusday') return 'Thursday';
  return day;
};

const FindStore = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState('browse');
  
  const [searchFilters, setSearchFilters] = useState({
    city: '',
    state: '',
    pincode: ''
  });

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStores, setTotalStores] = useState(0);
  const limit = 9;
  
  const [showFilters, setShowFilters] = useState(false);

  const fetchAllStores = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/store/get/all/store?page=${page}&limit=${limit}`);
      const data = await response.json();
      
      if (data.success) {
        setStores(data.stores);
        setTotalPages(data.totalPages);
        setTotalStores(data.totalStores);
        setCurrentPage(data.currentPage);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchStores = async () => {
    const { city, state, pincode } = searchFilters;
    
    if (!city && !state && !pincode) {
      alert('Please provide at least one search parameter');
      return;
    }
    
    setLoading(true);
    setSearchMode('search');
    
    try {
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      if (state) params.append('state', state);
      if (pincode) params.append('pincode', pincode);
      
      const response = await fetch(`${API_BASE}/store/search?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setStores(data.stores);
        setTotalStores(data.count);
      } else {
        setStores([]);
        alert(data.message);
      }
    } catch (error) {
      console.error('Error searching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchFilters({ city: '', state: '', pincode: '' });
    setSearchMode('browse');
    setCurrentPage(1);
    fetchAllStores(1);
  };

  useEffect(() => {
    fetchAllStores(1);
  }, []);

  const StoreCard = ({ store, index }) => (
    <Card 
      className="group overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
    >
      <div className="relative">
        {store.storeImage ? (
          <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
            <img 
              src={store.storeImage} 
              alt={store.storeName}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        ) : (
          <div className="relative h-56 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <StoreIcon className="w-16 h-16 text-slate-300" />
          </div>
        )}
        
        {store.is24x7 && (
          <div className="absolute top-4 right-4">
            <Badge variant="success" className="shadow-lg">
              <Clock className="w-3 h-3 mr-1" />
              24/7 Open
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
            {store.storeName}
          </h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-slate-700" />
              </div>
            </div>
            <div className="text-sm text-slate-600 leading-relaxed">
              <p className="font-medium text-slate-900">{store.storeAddress}</p>
              <p className="mt-1">{store.storeCity}, {formatStateName(store.storeState)}</p>
              <p className="font-mono text-xs mt-1 text-slate-500">{store.storePincode}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <Phone className="w-4 h-4 text-slate-700" />
              </div>
            </div>
            <a 
              href={`tel:${store.storePhoneNumber}`} 
              className="text-sm font-medium text-slate-900 hover:text-slate-600 transition-colors"
            >
              {store.storePhoneNumber}
            </a>
          </div>
          
          {!store.is24x7 && store.storeOpeningTimeing && store.storeClosingTiming && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-slate-700" />
                </div>
              </div>
              <div className="text-sm text-slate-600">
                <p className="font-medium text-slate-900">
                  {formatDayName(store.storeOpenDayStart)} - {formatDayName(store.storeOpenDayEnd)}
                </p>
                <p className="mt-1 font-mono text-xs">
                  {store.storeOpeningTimeing} - {store.storeClosingTiming}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="pt-2 border-t border-slate-100">
          <a
            href={store.storeLocationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:gap-3 transition-all duration-300 group/link"
          >
            <Navigation className="w-4 h-4" />
            Get Directions
            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
          </a>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div>
<Navbar></Navbar>
<div className="min-h-screen bg-slate-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        
        * {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        @keyframes fade-in-0 {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slide-in-from-bottom-4 {
          from {
            transform: translateY(1rem);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation-duration: 0.6s;
          animation-fill-mode: both;
        }
        
        .fade-in-0 {
          animation-name: fade-in-0;
        }
        
        .slide-in-from-bottom-4 {
          animation-name: slide-in-from-bottom-4;
        }
        
        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>

      {/* Hero Header */}
      <div className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.3),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.2),transparent_50%)]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-3xl animate-in fade-in-0 slide-in-from-bottom-4" style={{ animationDuration: '0.8s' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
              <StoreIcon className="w-4 h-4" />
              Store Locator
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Nearest Store
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Discover our locations across the country. Visit us for an exceptional shopping experience.
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative -mt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <Card className="shadow-2xl">
            <CardContent className="p-8">
              {/* Desktop Filters */}
              <div className="hidden lg:flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">City</label>
                  <Input
                    placeholder="Enter city name"
                    value={searchFilters.city}
                    onChange={(e) => setSearchFilters({ ...searchFilters, city: e.target.value })}
                  />
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">State</label>
                  <Select
                    value={searchFilters.state}
                    onChange={(e) => setSearchFilters({ ...searchFilters, state: e.target.value })}
                  >
                    <option value="">All States</option>
                    {STATES.map(state => (
                      <option key={state} value={state}>
                        {formatStateName(state)}
                      </option>
                    ))}
                  </Select>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Pincode</label>
                  <Input
                    placeholder="Enter pincode"
                    value={searchFilters.pincode}
                    onChange={(e) => setSearchFilters({ ...searchFilters, pincode: e.target.value })}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={searchStores} size="lg" className="min-w-[140px]">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                  {searchMode === 'search' && (
                    <Button onClick={clearSearch} variant="outline" size="lg">
                      <X className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              {/* Mobile Filters */}
              <div className="lg:hidden space-y-4">
                <Button 
                  onClick={() => setShowFilters(!showFilters)} 
                  variant="outline" 
                  className="w-full"
                  size="lg"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
                
                {showFilters && (
                  <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">City</label>
                      <Input
                        placeholder="Enter city name"
                        value={searchFilters.city}
                        onChange={(e) => setSearchFilters({ ...searchFilters, city: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">State</label>
                      <Select
                        value={searchFilters.state}
                        onChange={(e) => setSearchFilters({ ...searchFilters, state: e.target.value })}
                      >
                        <option value="">All States</option>
                        {STATES.map(state => (
                          <option key={state} value={state}>
                            {formatStateName(state)}
                          </option>
                        ))}
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Pincode</label>
                      <Input
                        placeholder="Enter pincode"
                        value={searchFilters.pincode}
                        onChange={(e) => setSearchFilters({ ...searchFilters, pincode: e.target.value })}
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <Button onClick={searchStores} className="flex-1" size="lg">
                        <Search className="w-4 h-4 mr-2" />
                        Search
                      </Button>
                      {searchMode === 'search' && (
                        <Button onClick={clearSearch} variant="outline" size="lg">
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {searchMode === 'search' ? 'Search Results' : 'All Locations'}
            </h2>
            <p className="text-slate-600 mt-2">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                  Loading stores...
                </span>
              ) : (
                `Showing ${stores.length} of ${totalStores} stores`
              )}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-56 bg-gradient-to-br from-slate-200 to-slate-100 animate-pulse" />
                <CardContent className="space-y-4">
                  <div className="h-6 bg-slate-200 rounded animate-pulse w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded animate-pulse" />
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-5/6" />
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stores.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store, index) => (
                <StoreCard key={store.id} store={store} index={index} />
              ))}
            </div>

            {searchMode === 'browse' && totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <Button
                  onClick={() => fetchAllStores(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="icon"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <span className="text-sm font-semibold text-slate-900">
                    Page {currentPage}
                  </span>
                  <span className="text-slate-400">/</span>
                  <span className="text-sm text-slate-600">
                    {totalPages}
                  </span>
                </div>
                
                <Button
                  onClick={() => fetchAllStores(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="icon"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-6">
              <MapPin className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">No stores found</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              We couldn't find any stores matching your search criteria. Try adjusting your filters.
            </p>
            {searchMode === 'search' && (
              <Button onClick={clearSearch} variant="outline" size="lg">
                <X className="w-4 h-4 mr-2" />
                Clear Search & View All
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
    </div>
   
  );
};

export default FindStore;