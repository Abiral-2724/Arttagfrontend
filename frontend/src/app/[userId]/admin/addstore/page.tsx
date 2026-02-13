'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Upload, MapPin, Clock, Phone, Calendar, Building2, Search, ChevronLeft, ChevronRight, Eye, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';

// Shadcn UI Components with proper styling
const Card = ({ className = '', children, ...props }) => (
  <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ className = '', children, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className = '', children, ...props }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ className = '', children, ...props }) => (
  <p className={`text-sm text-gray-500 ${className}`} {...props}>
    {children}
  </p>
);

const CardContent = ({ className = '', children, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const Input : any = React.memo(({ className = '', error, ...props })  => (
  <input
    className={`flex h-10 w-full rounded-md border ${
      error 
        ? 'border-red-500 focus-visible:ring-red-500' 
        : 'border-gray-300 focus-visible:ring-blue-600'
    } bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
));

Input.displayName = 'Input';

const Textarea : any = React.memo(({ className = '', error, ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border ${
      error 
        ? 'border-red-500 focus-visible:ring-red-500' 
        : 'border-gray-300 focus-visible:ring-blue-600'
    } bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
));

Textarea.displayName = 'Textarea';

const Button : any = ({ className = '', variant = 'default', size = 'default', children, disabled, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-900',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    ghost: 'hover:bg-gray-100 hover:text-gray-900',
    link: 'text-blue-600 underline-offset-4 hover:underline',
  };
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
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

const Select : any = React.memo(({ className = '', error, children, ...props }) => (
  <select
    className={`flex h-10 w-full rounded-md border ${
      error 
        ? 'border-red-500 focus-visible:ring-red-500' 
        : 'border-gray-300 focus-visible:ring-blue-600'
    } bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </select>
));

Select.displayName = 'Select';

const Badge : any = ({ className = '', variant = 'default', children, ...props }) => {
  const variants = {
    default: 'bg-blue-100 text-blue-900 hover:bg-blue-200',
    success: 'bg-green-100 text-green-900 hover:bg-green-200',
    destructive: 'bg-red-100 text-red-900 hover:bg-red-200',
    warning: 'bg-yellow-100 text-yellow-900 hover:bg-yellow-200',
  };
  
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

const Label : any = ({ className = '', children, required, htmlFor, ...props }) => (
  <label 
    htmlFor={htmlFor}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} 
    {...props}
  >
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const Switch : any = ({ checked, onCheckedChange, id, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    id={id}
    disabled={disabled}
    onClick={() => onCheckedChange(!checked)}
    className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 ${
      checked ? 'bg-blue-600' : 'bg-gray-200'
    }`}
  >
    <span
      className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

const Alert = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: 'bg-blue-50 text-blue-900 border-blue-200',
    destructive: 'bg-red-50 text-red-900 border-red-200',
  };
  
  return (
    <div className={`relative w-full rounded-lg border p-4 ${variants[variant]} ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="h-4 w-4 mt-0.5" />
        <div className="text-sm [&_p]:leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({ className = '', children, ...props }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props}>
    {children}
  </div>
);

const DialogTitle = ({ className = '', children, ...props }) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h2>
);

const DialogContent = ({ className = '', children, ...props }) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
);

// States and Days enums
const STATES = [
  'AndhraPradesh', 'ArunachalPradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'HimachalPradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'MadhyaPradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'TamilNadu', 'Telangana', 'Tripura', 'UttarPradesh',
  'Uttarakhand', 'WestBengal', 'AndamanAndNicobarIslands', 'Chandigarh',
  'DadraAndNagarHaveliAndDamanAndDiu', 'Delhi', 'JammuAndKashmir', 'Ladakh',
  'Lakshadweep', 'Puducherry'
];

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const formatStateName = (state) => state.replace(/([A-Z])/g, ' $1').trim();

// Store Form Component
const StoreForm = ({ onSubmit,
  isEdit,
  loading,
  submitError,
  resetForm,
  closeModal,

  storeName,
  setStoreName,
  storePhoneNumber,
  setStorePhoneNumber,
  storeAddress,
  setStoreAddress,
  storeCity,
  setStoreCity,
  storeState,
  setStoreState,
  storePincode,
  setStorePincode,
  storeLocationUrl,
  setStoreLocationUrl,

  storeOpenDayStart,
  setStoreOpenDayStart,
  storeOpenDayEnd,
  setStoreOpenDayEnd,
  storeOpeningTimeing,
  setStoreOpeningTimeing,
  storeClosingTiming,
  setStoreClosingTiming,
  is24x7,
  setIs24x7,

  formErrors,
  imagePreview,
  handleImageChange,
  setImagePreview,
  setStoreImage }) => (
  <form onSubmit={onSubmit} className="space-y-6">
    {submitError && (
      <Alert variant="destructive">
        {submitError}
      </Alert>
    )}

    {/* Image Upload */}
    <div className="space-y-2">
      <Label>Store Image {!isEdit && <span className="text-red-500">*</span>}</Label>
      <div className="mt-2">
        {imagePreview ? (
          <div className="relative group">
            <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg border-2 border-gray-200" />
            <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                setStoreImage(null);
              }}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-gray-50 hover:bg-blue-50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <p className="mb-2 text-sm text-gray-600">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>
        )}
      </div>
    </div>

    {/* Basic Information */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="storeName" required>Store Name</Label>
          <Input
            id="storeName"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Enter store name"
            error={formErrors.storeName}
          />
          {formErrors.storeName && (
            <p className="text-red-600 text-xs">{formErrors.storeName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="storePhoneNumber" required>Phone Number</Label>
          <Input
            id="storePhoneNumber"
            value={storePhoneNumber}
            onChange={(e) => setStorePhoneNumber(e.target.value)}
            placeholder="Enter phone number"
            error={formErrors.storePhoneNumber}
          />
          {formErrors.storePhoneNumber && (
            <p className="text-red-600 text-xs">{formErrors.storePhoneNumber}</p>
          )}
        </div>
      </div>
    </div>

    {/* Address */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Address Details</h3>
      
      <div className="space-y-2">
        <Label htmlFor="storeAddress" required>Store Address</Label>
        <Textarea
          id="storeAddress"
          value={storeAddress}
          onChange={(e) => setStoreAddress(e.target.value)}
          placeholder="Enter complete address"
          error={formErrors.storeAddress}
        />
        {formErrors.storeAddress && (
          <p className="text-red-600 text-xs">{formErrors.storeAddress}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="storeCity" required>City</Label>
          <Input
            id="storeCity"
            value={storeCity}
            onChange={(e) => setStoreCity(e.target.value)}
            placeholder="Enter city"
            error={formErrors.storeCity}
          />
          {formErrors.storeCity && (
            <p className="text-red-600 text-xs">{formErrors.storeCity}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="storeState" required>State</Label>
          <Select
            id="storeState"
            value={storeState}
            onChange={(e) => setStoreState(e.target.value)}
            error={formErrors.storeState}
          >
            <option value="">Select State</option>
            {STATES.map(state => (
              <option key={state} value={state}>{formatStateName(state)}</option>
            ))}
          </Select>
          {formErrors.storeState && (
            <p className="text-red-600 text-xs">{formErrors.storeState}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="storePincode" required>Pincode</Label>
          <Input
            id="storePincode"
            value={storePincode}
            onChange={(e) => setStorePincode(e.target.value)}
            placeholder="6-digit pincode"
            maxLength={6}
            error={formErrors.storePincode}
          />
          {formErrors.storePincode && (
            <p className="text-red-600 text-xs">{formErrors.storePincode}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="storeLocationUrl" required>Google Maps URL</Label>
        <Input
          id="storeLocationUrl"
          value={storeLocationUrl}
          onChange={(e) => setStoreLocationUrl(e.target.value)}
          placeholder="https://maps.google.com/..."
          type="url"
          error={formErrors.storeLocationUrl}
        />
        {formErrors.storeLocationUrl && (
          <p className="text-red-600 text-xs">{formErrors.storeLocationUrl}</p>
        )}
      </div>
    </div>

    {/* Operating Hours */}
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Operating Hours</h3>
        <div className="flex items-center space-x-2">
          <Switch
            id="is24x7"
            checked={is24x7}
            onCheckedChange={setIs24x7}
          />
          <Label htmlFor="is24x7" className="cursor-pointer">24/7 Store</Label>
        </div>
      </div>

      {!is24x7 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storeOpenDayStart" required>Opening Day</Label>
              <Select
                id="storeOpenDayStart"
                value={storeOpenDayStart}
                onChange={(e) => setStoreOpenDayStart(e.target.value)}
              >
                {WEEK_DAYS.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeOpenDayEnd" required>Closing Day</Label>
              <Select
                id="storeOpenDayEnd"
                value={storeOpenDayEnd}
                onChange={(e) => setStoreOpenDayEnd(e.target.value)}
              >
                {WEEK_DAYS.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storeOpeningTimeing" required>Opening Time</Label>
              <Input
                id="storeOpeningTimeing"
                value={storeOpeningTimeing}
                onChange={(e) => setStoreOpeningTimeing(e.target.value)}
                placeholder="e.g., 9:00 AM"
                error={formErrors.storeOpeningTimeing}
              />
              {formErrors.storeOpeningTimeing && (
                <p className="text-red-600 text-xs">{formErrors.storeOpeningTimeing}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeClosingTiming" required>Closing Time</Label>
              <Input
                id="storeClosingTiming"
                value={storeClosingTiming}
                onChange={(e) => setStoreClosingTiming(e.target.value)}
                placeholder="e.g., 9:00 PM"
                error={formErrors.storeClosingTiming}
              />
              {formErrors.storeClosingTiming && (
                <p className="text-red-600 text-xs">{formErrors.storeClosingTiming}</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>

    {/* Submit Button */}
    <div className="flex justify-end gap-3 pt-4 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          isEdit ? setIsEditModalOpen(false) : setIsAddModalOpen(false);
          resetForm();
        }}
        disabled={loading}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          isEdit ? 'Update Store' : 'Add Store'
        )}
      </Button>
    </div>
  </form>
);

const AdminStoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStores, setTotalStores] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 10;

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] : any = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] : any = useState(false);
  const [isViewModalOpen, setIsViewModalOpen]  = useState(false);
  const [selectedStore, setSelectedStore] : any = useState(null);

  // Form state - using individual state to prevent re-render issues
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storeCity, setStoreCity] = useState('');
  const [storeState, setStoreState] = useState('');
  const [storePincode, setStorePincode] = useState('');
  const [storePhoneNumber, setStorePhoneNumber] = useState('');
  const [storeOpenDayStart, setStoreOpenDayStart] = useState('Monday');
  const [storeOpenDayEnd, setStoreOpenDayEnd] = useState('Sunday');
  const [storeOpeningTimeing, setStoreOpeningTimeing] = useState('');
  const [storeClosingTiming, setStoreClosingTiming] = useState('');
  const [is24x7, setIs24x7] = useState(false);
  const [storeLocationUrl, setStoreLocationUrl] = useState('');
  const [storeImage, setStoreImage] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  // Fetch stores
  const fetchStores = useCallback(async (page = 1) => {
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
      alert('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores(1);
  }, [fetchStores]);

  // Validate form
  const validateForm = useCallback(() => {
    const errors : any = {};
    
    if (!storeName.trim()) errors.storeName = 'Store name is required';
    if (!storeAddress.trim()) errors.storeAddress = 'Address is required';
    if (!storeCity.trim()) errors.storeCity = 'City is required';
    if (!storeState) errors.storeState = 'State is required';
    if (!storePincode.trim()) {
      errors.storePincode = 'Pincode is required';
    } else if (storePincode.length !== 6) {
      errors.storePincode = 'Pincode must be 6 digits';
    }
    if (!storePhoneNumber.trim()) errors.storePhoneNumber = 'Phone number is required';
    if (!storeLocationUrl.trim()) errors.storeLocationUrl = 'Location URL is required';
    
    if (!is24x7) {
      if (!storeOpeningTimeing.trim()) errors.storeOpeningTimeing = 'Opening time is required';
      if (!storeClosingTiming.trim()) errors.storeClosingTiming = 'Closing time is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [storeName, storeAddress, storeCity, storeState, storePincode, storePhoneNumber, storeLocationUrl, is24x7, storeOpeningTimeing, storeClosingTiming]);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setStoreImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = useCallback(() => {
    setStoreName('');
    setStoreAddress('');
    setStoreCity('');
    setStoreState('');
    setStorePincode('');
    setStorePhoneNumber('');
    setStoreOpenDayStart('Monday');
    setStoreOpenDayEnd('Sunday');
    setStoreOpeningTimeing('');
    setStoreClosingTiming('');
    setIs24x7(false);
    setStoreLocationUrl('');
    setStoreImage(null);
    setImagePreview(null);
    setFormErrors({});
    setSubmitError('');
  }, []);

  // Add store
  const handleAddStore = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) {
      setSubmitError('Please fix all errors before submitting');
      return;
    }
    
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('storeName', storeName);
      formDataToSend.append('storeAddress', storeAddress);
      formDataToSend.append('storeCity', storeCity);
      formDataToSend.append('storeState', storeState);
      formDataToSend.append('storePincode', storePincode);
      formDataToSend.append('storePhoneNumber', storePhoneNumber);
      formDataToSend.append('storeOpenDayStart', storeOpenDayStart);
      formDataToSend.append('storeOpenDayEnd', storeOpenDayEnd);
      formDataToSend.append('is24x7', is24x7.toString());
      formDataToSend.append('storeLocationUrl', storeLocationUrl);
      
      if (!is24x7) {
        formDataToSend.append('storeOpeningTimeing', storeOpeningTimeing);
        formDataToSend.append('storeClosingTiming', storeClosingTiming);
      } else {
        formDataToSend.append('storeOpeningTimeing', '');
        formDataToSend.append('storeClosingTiming', '');
      }
      
      if (storeImage) {
        formDataToSend.append('storeimage', storeImage);
      }

      const response = await fetch(`${API_BASE}/store/add/store`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        alert('Store added successfully!');
        setIsAddModalOpen(false);
        resetForm();
        fetchStores(currentPage);
      } else {
        setSubmitError(data.message || 'Failed to add store');
      }
    } catch (error) {
      console.error('Error adding store:', error);
      setSubmitError('Failed to add store. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update store
  const handleUpdateStore = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) {
      setSubmitError('Please fix all errors before submitting');
      return;
    }
    
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('id', selectedStore.id);
      
      formDataToSend.append('storeName', storeName);
      formDataToSend.append('storeAddress', storeAddress);
      formDataToSend.append('storeCity', storeCity);
      formDataToSend.append('storeState', storeState);
      formDataToSend.append('storePincode', storePincode);
      formDataToSend.append('storePhoneNumber', storePhoneNumber);
      formDataToSend.append('storeOpenDayStart', storeOpenDayStart);
      formDataToSend.append('storeOpenDayEnd', storeOpenDayEnd);
      formDataToSend.append('is24x7', is24x7.toString());
      formDataToSend.append('storeLocationUrl', storeLocationUrl);
      
      if (!is24x7) {
        formDataToSend.append('storeOpeningTimeing', storeOpeningTimeing);
        formDataToSend.append('storeClosingTiming', storeClosingTiming);
      } else {
        formDataToSend.append('storeOpeningTimeing', '');
        formDataToSend.append('storeClosingTiming', '');
      }
      
      if (storeImage && typeof storeImage !== 'string') {
        formDataToSend.append('storeimage', storeImage);
      }

      const response = await fetch(`${API_BASE}/store/update/store`, {
        method: 'PATCH',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        alert('Store updated successfully!');
        setIsEditModalOpen(false);
        resetForm();
        fetchStores(currentPage);
      } else {
        setSubmitError(data.message || 'Failed to update store');
      }
    } catch (error) {
      console.error('Error updating store:', error);
      setSubmitError('Failed to update store. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete store
  const handleDeleteStore = async (storeId) => {
    if (!window.confirm('Are you sure you want to delete this store? This action cannot be undone.')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/store/delete/store`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: storeId }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Store deleted successfully!');
        fetchStores(currentPage);
      } else {
        alert(data.message || 'Failed to delete store');
      }
    } catch (error) {
      console.error('Error deleting store:', error);
      alert('Failed to delete store');
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (store) => {
    setSelectedStore(store);
    setStoreName(store.storeName);
    setStoreAddress(store.storeAddress);
    setStoreCity(store.storeCity);
    setStoreState(store.storeState);
    setStorePincode(store.storePincode);
    setStorePhoneNumber(store.storePhoneNumber);
    setStoreOpenDayStart(store.storeOpenDayStart);
    setStoreOpenDayEnd(store.storeOpenDayEnd);
    setStoreOpeningTimeing(store.storeOpeningTimeing || '');
    setStoreClosingTiming(store.storeClosingTiming || '');
    setIs24x7(store.is24x7);
    setStoreLocationUrl(store.storeLocationUrl);
    setStoreImage(store.storeImage);
    setImagePreview(store.storeImage);
    setFormErrors({});
    setSubmitError('');
    setIsEditModalOpen(true);
  };

  // Open view modal
  const openViewModal = (store) => {
    setSelectedStore(store);
    setIsViewModalOpen(true);
  };

  // Filter stores based on search
  const filteredStores = stores.filter((store : any) => 
    store.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.storeCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.storePincode.includes(searchQuery)
  );

  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar></Navbar>
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Store Management</h1>
              <p className="mt-1 text-sm text-gray-500">Manage all your store locations</p>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Add Store
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats and Search */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
              <Building2 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStores}</div>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-3">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stores by name, city, or pincode..."
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stores Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Stores</CardTitle>
            <CardDescription>View and manage all store locations</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                <p className="text-sm text-gray-500">Loading stores...</p>
              </div>
            ) : filteredStores.length > 0 ? (
              <>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Store</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Location</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Contact</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Hours</th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStores.map((store : any) => (
                        <tr key={store.id} className="border-b transition-colors hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {store.storeImage ? (
                                <img
                                  src={store.storeImage}
                                  alt={store.storeName}
                                  className="h-12 w-12 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                                  <Building2 className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{store.storeName}</div>
                                {store.is24x7 && (
                                  <Badge variant="success" className="mt-1">
                                    24/7
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              <div className="font-medium">{store.storeCity}</div>
                              <div className="text-gray-500">{formatStateName(store.storeState)}</div>
                              <div className="text-xs text-gray-400">{store.storePincode}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-gray-600">{store.storePhoneNumber}</div>
                          </td>
                          <td className="p-4">
                            {store.is24x7 ? (
                              <div className="text-sm font-medium text-green-600">Open 24/7</div>
                            ) : (
                              <div className="text-sm">
                                <div>{store.storeOpenDayStart} - {store.storeOpenDayEnd}</div>
                                <div className="text-xs text-gray-500">
                                  {store.storeOpeningTimeing} - {store.storeClosingTiming}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openViewModal(store)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditModal(store)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteStore(store.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 py-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => fetchStores(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => fetchStores(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold">No stores found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {searchQuery ? 'Try adjusting your search' : 'Get started by adding your first store'}
                </p>
                {!searchQuery && (
                  <Button className="mt-4" onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Store
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Store Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogHeader>
          <DialogTitle>Add New Store</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => {
              setIsAddModalOpen(false);
              resetForm();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <DialogContent>
        <StoreForm
  onSubmit={handleAddStore}
  isEdit={false}
  loading={loading}
  submitError={submitError}
  resetForm={resetForm}
  closeModal={() => setIsAddModalOpen(false)}

  storeName={storeName}
  setStoreName={setStoreName}
  storePhoneNumber={storePhoneNumber}
  setStorePhoneNumber={setStorePhoneNumber}
  storeAddress={storeAddress}
  setStoreAddress={setStoreAddress}
  storeCity={storeCity}
  setStoreCity={setStoreCity}
  storeState={storeState}
  setStoreState={setStoreState}
  storePincode={storePincode}
  setStorePincode={setStorePincode}
  storeLocationUrl={storeLocationUrl}
  setStoreLocationUrl={setStoreLocationUrl}

  storeOpenDayStart={storeOpenDayStart}
  setStoreOpenDayStart={setStoreOpenDayStart}
  storeOpenDayEnd={storeOpenDayEnd}
  setStoreOpenDayEnd={setStoreOpenDayEnd}
  storeOpeningTimeing={storeOpeningTimeing}
  setStoreOpeningTimeing={setStoreOpeningTimeing}
  storeClosingTiming={storeClosingTiming}
  setStoreClosingTiming={setStoreClosingTiming}
  is24x7={is24x7}
  setIs24x7={setIs24x7}

  formErrors={formErrors}
  imagePreview={imagePreview}
  handleImageChange={handleImageChange}
  setImagePreview={setImagePreview}
  setStoreImage={setStoreImage}
/>

        </DialogContent>
      </Dialog>

      {/* Edit Store Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogHeader>
          <DialogTitle>Edit Store</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => {
              setIsEditModalOpen(false);
              resetForm();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <DialogContent>
        <StoreForm
  onSubmit={handleUpdateStore}
  isEdit
  loading={loading}
  submitError={submitError}
  resetForm={resetForm}
  closeModal={() => setIsAddModalOpen(false)}

  storeName={storeName}
  setStoreName={setStoreName}
  storePhoneNumber={storePhoneNumber}
  setStorePhoneNumber={setStorePhoneNumber}
  storeAddress={storeAddress}
  setStoreAddress={setStoreAddress}
  storeCity={storeCity}
  setStoreCity={setStoreCity}
  storeState={storeState}
  setStoreState={setStoreState}
  storePincode={storePincode}
  setStorePincode={setStorePincode}
  storeLocationUrl={storeLocationUrl}
  setStoreLocationUrl={setStoreLocationUrl}

  storeOpenDayStart={storeOpenDayStart}
  setStoreOpenDayStart={setStoreOpenDayStart}
  storeOpenDayEnd={storeOpenDayEnd}
  setStoreOpenDayEnd={setStoreOpenDayEnd}
  storeOpeningTimeing={storeOpeningTimeing}
  setStoreOpeningTimeing={setStoreOpeningTimeing}
  storeClosingTiming={storeClosingTiming}
  setStoreClosingTiming={setStoreClosingTiming}
  is24x7={is24x7}
  setIs24x7={setIs24x7}

  formErrors={formErrors}
  imagePreview={imagePreview}
  handleImageChange={handleImageChange}
  setImagePreview={setImagePreview}
  setStoreImage={setStoreImage}
/>

        </DialogContent>
      </Dialog>

      {/* View Store Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogHeader>
          <DialogTitle>Store Details</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => setIsViewModalOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <DialogContent>
          {selectedStore  && (
            <div className="space-y-6">
              {selectedStore.storeImage && (
                <img
                  src={selectedStore.storeImage}
                  alt={selectedStore.storeName}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Store Name</Label>
                  <p className="mt-1 font-medium">{selectedStore.storeName}</p>
                </div>

                <div>
                  <Label className="text-gray-500">Phone Number</Label>
                  <p className="mt-1 font-medium">{selectedStore.storePhoneNumber}</p>
                </div>

                <div className="md:col-span-2">
                  <Label className="text-gray-500">Address</Label>
                  <p className="mt-1">{selectedStore.storeAddress}</p>
                </div>

                <div>
                  <Label className="text-gray-500">City</Label>
                  <p className="mt-1">{selectedStore.storeCity}</p>
                </div>

                <div>
                  <Label className="text-gray-500">State</Label>
                  <p className="mt-1">{formatStateName(selectedStore.storeState)}</p>
                </div>

                <div>
                  <Label className="text-gray-500">Pincode</Label>
                  <p className="mt-1">{selectedStore.storePincode}</p>
                </div>

                <div>
                  <Label className="text-gray-500">Operating Hours</Label>
                  {selectedStore.is24x7 ? (
                    <Badge variant="success" className="mt-1">24/7 Open</Badge>
                  ) : (
                    <div className="mt-1">
                      <p>{selectedStore.storeOpenDayStart} - {selectedStore.storeOpenDayEnd}</p>
                      <p className="text-sm text-gray-500">
                        {selectedStore.storeOpeningTimeing} - {selectedStore.storeClosingTiming}
                      </p>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <a
                    href={selectedStore.storeLocationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <MapPin className="h-4 w-4" />
                    View on Google Maps
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStoreManagement;