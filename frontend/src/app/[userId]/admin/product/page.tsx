'use client'
import React, { useState, useEffect } from 'react';
import {
  Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Trash2, Plus, X, Eye, Package, Edit, Search, ShoppingBag,
  LayoutGrid, ImageIcon, Palette, Info, CheckCircle2, AlertCircle,
  ChevronRight, TrendingUp, RefreshCw,
} from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import Navbar from '@/components/Navbar';
import FooterPart from '@/components/FooterPart';

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type AlertState = { show: boolean; message: string; type: 'success' | 'error' };

const EMPTY_FORM = {
  name: '', description: '', shortDescription: '', originalPrice: '',
  discountPrice: '', type: '', tags: '', material: '', dimensions: '',
  weight: '', packageContent: '', care: '', countryOfOrigin: '',
  manufacturerName: '', packerName: '', importerName: '', delivery: '',
  caseOnDeliveryAvailability: 'false', returnDetails: '',
  categoryId: '', subcategoryId: '', totalCount: '',
  highlights: '', keyFeatures: '',
};

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function ProductAdminPortal() {
  const router = useRouter();
  const { userId } = useParams();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Auth
  const [isChecking, setIsChecking] = useState(true);

  // Data
  const [products, setProducts]                 = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories]             = useState<any[]>([]);
  const [subcategories, setSubcategories]       = useState<any[]>([]); // for the active select
  const [allSubcategories, setAllSubcategories] = useState<any[]>([]); // for name lookup in table

  // UI state
  const [loading, setLoading]             = useState(false);
  const [searchQuery, setSearchQuery]     = useState('');
  const [alert, setAlert]                 = useState<AlertState>({ show: false, message: '', type: 'success' });
  const [uploadProgress, setUploadProgress] = useState('');

  // Dialog state
  const [isAddDialogOpen, setIsAddDialogOpen]   = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [viewProduct, setViewProduct]     = useState<any>(null);
  const [editProduct, setEditProduct]     = useState<any>(null);
  const [stockProduct, setStockProduct]   = useState<any>(null);
  const [newStock, setNewStock]           = useState('');

  // Form
  const [formData, setFormData]           = useState({ ...EMPTY_FORM });
  const [colors, setColors]               = useState([{ name: '', hex: '#1a1a1a', images: [] as File[] }]);
  const [modelImages, setModelImages]     = useState<File[]>([]);
  const [modelImageDescriptions, setModelImageDescriptions] = useState<string[]>([]);
  const [primaryImage1, setPrimaryImage1] = useState<File | null>(null);
  const [primaryImage2, setPrimaryImage2] = useState<File | null>(null);

  // Edit-mode color management
  // existingColors: colors already in DB (shown with current images)
  // deletedColorIds: IDs of existing colors to delete on save
  // newColors: brand-new color entries with local File[] images
  const [existingColors, setExistingColors]   = useState<any[]>([]);
  const [deletedColorIds, setDeletedColorIds] = useState<string[]>([]);
  const [newColors, setNewColors]             = useState<{ name: string; hex: string; images: File[] }[]>([]);

  /* ── Auth check ── */
  useEffect(() => {
    const check = async () => {
      try {
        const storedUserId = localStorage.getItem('arttagUserId');
        const storedToken  = localStorage.getItem('arttagtoken');
        if (!storedUserId || !storedToken || storedUserId !== userId) { router.replace('/login'); return; }
        const res = await axios.get(`${API_BASE_URL}/user/${userId}/get/profile`);
        if (!res.data.success || res.data.user.role !== 'ADMIN') { router.replace('/login'); return; }
      } catch { router.replace('/login'); }
      finally { setIsChecking(false); }
    };
    if (userId) check();
  }, [userId, router]);

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  useEffect(() => {
    if (!searchQuery.trim()) { setFilteredProducts(products); return; }
    setFilteredProducts(products.filter((p: any) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.type?.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  }, [searchQuery, products]);

  /* ── Data fetchers ── */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/product/get/all/product`);
      if (res.data.success) { setProducts(res.data.data); setFilteredProducts(res.data.data); }
    } catch { showAlert('Failed to fetch products', 'error'); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const [catRes, subRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/category/get/all/category`),
        axios.get(`${API_BASE_URL}/category/get/all/subcategory`),
      ]);
      if (catRes.data.success) setCategories(catRes.data.category);
      if (subRes.data.success) setAllSubcategories(subRes.data.subcategories);
    } catch { showAlert('Failed to fetch categories', 'error'); }
  };

  const fetchSubcategories = async (categoryId: string) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/category/get/${categoryId}/all/subcategory`);
      setSubcategories(res.data.success ? res.data.subcategories : []);
    } catch { setSubcategories([]); }
  };

  /* ── Helpers ── */
  const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 5000);
  };

  const resetForm = () => {
    setFormData({ ...EMPTY_FORM });
    setColors([{ name: '', hex: '#1a1a1a', images: [] }]);
    setModelImages([]); setModelImageDescriptions([]);
    setPrimaryImage1(null); setPrimaryImage2(null);
    setExistingColors([]); setDeletedColorIds([]); setNewColors([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({ ...prev, categoryId, subcategoryId: '' }));
    fetchSubcategories(categoryId);
  };

  /* ── Color handlers ── */
  const handleColorChange = (index: number, field: string, value: any) => {
    const next = [...colors];
    next[index] = { ...next[index], [field]: value };
    setColors(next);
  };
  const addColor = () => setColors([...colors, { name: '', hex: '#1a1a1a', images: [] }]);
  const removeColor = (i: number) => setColors(colors.filter((_, idx) => idx !== i));
  const handleColorImageUpload = (index: number, files: FileList | null) => {
    if (!files) return;
    const next = [...colors];
    next[index] = { ...next[index], images: [...next[index].images, ...Array.from(files)] };
    setColors(next);
  };
  const removeColorImage = (ci: number, ii: number) => {
    const next = [...colors];
    next[ci] = { ...next[ci], images: next[ci].images.filter((_, i) => i !== ii) };
    setColors(next);
  };

  /* ── Model image handlers ── */
  const handleModelImageUpload = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files) as File[];
    setModelImages(prev => [...prev, ...arr]);
    setModelImageDescriptions(prev => [...prev, ...arr.map(() => 'Model Image')]);
  };
  const removeModelImage = (i: number) => {
    setModelImages(prev => prev.filter((_, idx) => idx !== i));
    setModelImageDescriptions(prev => prev.filter((_, idx) => idx !== i));
  };
  const updateModelDesc = (i: number, val: string) => {
    const next = [...modelImageDescriptions];
    next[i] = val;
    setModelImageDescriptions(next);
  };

  /* ── Submit: Add Product ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) { showAlert('Please select a category', 'error'); return; }
    const categoryId = formData.subcategoryId || formData.categoryId;
    try {
      setLoading(true);
      setUploadProgress('Preparing…');
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (k !== 'categoryId' && k !== 'subcategoryId') fd.append(k, v);
      });
      if (primaryImage1) fd.append('primaryImage1', primaryImage1);
      if (primaryImage2) fd.append('primaryImage2', primaryImage2);
      modelImages.forEach(img => fd.append('modelImages', img));
      fd.append('modelImageDescriptions', JSON.stringify(modelImageDescriptions));
      fd.append('colors', JSON.stringify(colors.map(({ images, ...c }) => c)));
      colors.forEach(color => {
        color.images.forEach((img, ii) => fd.append(`color_${color.name}_image${ii}`, img));
      });
      setUploadProgress('Uploading…');
      const res = await axios.post(
        `${API_BASE_URL}/product/admin/${userId}/add/product/${categoryId}`,
        fd,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 300000,
          onUploadProgress: (p: any) => setUploadProgress(`Uploading… ${Math.round((p.loaded * 100) / p.total)}%`),
        }
      );
      if (res.data.success) {
        showAlert('Product added successfully!');
        resetForm(); setIsAddDialogOpen(false); fetchProducts();
      }
    } catch (err: any) {
      showAlert(err.response?.data?.message || 'Failed to add product', 'error');
    } finally { setLoading(false); setUploadProgress(''); }
  };

  /* ── Submit: Edit Product ── */
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const fd = new FormData();

      // Send all text fields except the two routing helpers
      Object.entries(formData).forEach(([k, v]) => {
        if (k === 'categoryId' || k === 'subcategoryId') return;
        if (v !== '') fd.append(k, v as string);
      });

      // Resolve the final category to send: subcategoryId wins if set, else categoryId
      const resolvedCategoryId = formData.subcategoryId || formData.categoryId;
      if (resolvedCategoryId) fd.append('categoryId', resolvedCategoryId);

      if (primaryImage1) fd.append('primaryImage1', primaryImage1);
      if (primaryImage2) fd.append('primaryImage2', primaryImage2);
      if (modelImages.length > 0) {
        fd.append('replaceModelImages', 'true');
        modelImages.forEach(img => fd.append('modelImages', img));
      }

      // ── Color updates ──
      if (deletedColorIds.length > 0) {
        fd.append('deleteColorIds', JSON.stringify(deletedColorIds));
      }

      const existingColorMeta = existingColors
        .filter(c => !deletedColorIds.includes(c.id))
        .map(c => ({ id: c.id, name: c.name, hex: c.hex }));
      if (existingColorMeta.length > 0) {
        fd.append('updateColors', JSON.stringify(existingColorMeta));
        existingColors.forEach(c => {
          if (deletedColorIds.includes(c.id)) return;
          c.newImages.forEach((file: File | null, slot: number) => {
            if (file) fd.append(`updateColor_${c.id}_image${slot}`, file);
          });
        });
      }

      if (newColors.length > 0) {
        fd.append('addColors', JSON.stringify(newColors.map(({ images, ...c }) => c)));
        newColors.forEach(color => {
          color.images.forEach((img, ii) => fd.append(`color_${color.name}_image${ii}`, img));
        });
      }

      const res = await axios.patch(
        `${API_BASE_URL}/product/edit/product/${editProduct.id}`,
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (res.data.success) {
        showAlert('Product updated successfully!');
        resetForm(); setIsEditDialogOpen(false); setEditProduct(null); fetchProducts();
      }
    } catch (err: any) {
      showAlert(err.response?.data?.message || 'Failed to update product', 'error');
    } finally { setLoading(false); }
  };

  const openEditDialog = (product: any) => {
    setEditProduct(product);

    // ── Resolve parent vs subcategory ──────────────────────────────────
    // product.categoryId could be a subcategory ID or a top-level category ID.
    // Check allSubcategories to determine which it is.
    const matchedSub = allSubcategories.find((s: any) => s.id === product.categoryId);
    const resolvedParentId    = matchedSub ? matchedSub.parentId  : (product.categoryId || '');
    const resolvedSubId       = matchedSub ? matchedSub.id        : '';

    setFormData({
      name: product.name || '', description: product.description || '',
      shortDescription: product.shortDescription || '',
      originalPrice: product.originalPrice || '', discountPrice: product.discountPrice || '',
      type: product.type || '', tags: product.tags || '', material: product.material || '',
      dimensions: product.dimensions || '', weight: product.weight || '',
      packageContent: product.packageContent || '', care: product.care || '',
      countryOfOrigin: product.countryOfOrigin || '', manufacturerName: product.manufacturerName || '',
      packerName: product.packerName || '', importerName: product.importerName || '',
      delivery: product.delivery || '', returnDetails: product.returnDetails || '',
      caseOnDeliveryAvailability: product.caseOnDeliveryAvailability ? 'true' : 'false',
      // Set resolved parent as categoryId so the Category <Select> shows it
      categoryId: resolvedParentId,
      // Set subcategoryId so the Subcategory <Select> shows the correct value
      subcategoryId: resolvedSubId,
      totalCount: product.totalCount || '',
      highlights: product.highlights || '', keyFeatures: product.keyFeatures || '',
    });

    setPrimaryImage1(null); setPrimaryImage2(null);
    setModelImages([]); setModelImageDescriptions([]);

    // Pre-load existing colors with their current image URLs
    setExistingColors(
      (product.colors || []).map((c: any) => ({
        ...c,
        imageUrls: [c.colorImage1, c.colorImage2, c.colorImage3, c.colorImage4, c.colorImage5].filter(Boolean),
        newImages: [null, null, null, null, null] as (File | null)[],
      }))
    );
    setDeletedColorIds([]);
    setNewColors([]);

    // Load subcategories for the resolved parent so the dropdown is populated
    if (resolvedParentId) fetchSubcategories(resolvedParentId);

    setIsEditDialogOpen(true);
  };

  const deleteProduct = async (productId: string) => {
    try {
      setLoading(true);
      const res = await axios.delete(`${API_BASE_URL}/product/${userId}/delete/product`, { data: { productId } });
      if (res.data.success) { showAlert('Product deleted successfully!'); fetchProducts(); }
    } catch (err: any) {
      showAlert(err.response?.data?.message || 'Failed to delete product', 'error');
    } finally { setLoading(false); }
  };

  const updateStock = async () => {
    if (!stockProduct || !newStock) return;
    try {
      setLoading(true);
      const res = await axios.patch(`${API_BASE_URL}/product/update/stock`, {
        productId: stockProduct.id, newStock: parseInt(newStock),
      });
      if (res.data.success) {
        showAlert('Stock updated successfully!');
        setIsStockDialogOpen(false); setStockProduct(null); setNewStock(''); fetchProducts();
      }
    } catch (err: any) {
      showAlert(err.response?.data?.message || 'Failed to update stock', 'error');
    } finally { setLoading(false); }
  };

  /* ─────────────────────────────────────────────
     FORM SECTIONS — plain JSX variables, NOT
     components, to prevent unmount-on-rerender
     focus loss.
  ───────────────────────────────────────────── */
  const basicTabJSX = (
    <div className="space-y-5">
      <div className="admin-grid-2">
        <Field label="Product Name" required>
          <input name="name" value={formData.name} onChange={handleInputChange} required className="admin-input" placeholder="e.g. Roll-Top Backpack 30L" />
        </Field>
        <Field label="Product Type">
          <input name="type" value={formData.type} onChange={handleInputChange} className="admin-input" placeholder="e.g. Backpack, Tote" />
        </Field>
      </div>
      <Field label="Short Description">
        <input name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} className="admin-input" placeholder="One-line product summary" />
      </Field>
      <Field label="Full Description" required>
        <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} required className="admin-textarea" placeholder="Detailed product description" />
      </Field>
      <Field label="Product Highlights">
        <textarea name="highlights" value={formData.highlights} onChange={handleInputChange} rows={3} className="admin-textarea" placeholder="• Premium Puffy Front Design&#10;• Double Padded Laptop Protection&#10;• Waterproof & Durable Fabric" />
        <p className="admin-hint">Separate each highlight with a new line or bullet point (•)</p>
      </Field>
      <Field label="Key Features">
        <textarea name="keyFeatures" value={formData.keyFeatures} onChange={handleInputChange} rows={3} className="admin-textarea" placeholder="• Roll-top buckle closure&#10;• Dedicated padded laptop compartment" />
        <p className="admin-hint">Separate each feature with a new line or bullet point (•)</p>
      </Field>
      <div className="admin-grid-2">
        <Field label="Original Price (₹)" required>
          <input name="originalPrice" type="number" step="0.01" value={formData.originalPrice} onChange={handleInputChange} required className="admin-input" placeholder="0.00" />
        </Field>
        <Field label="Discount Price (₹)" required>
          <input name="discountPrice" type="number" step="0.01" value={formData.discountPrice} onChange={handleInputChange} required className="admin-input" placeholder="0.00" />
        </Field>
      </div>
      <div className="admin-grid-2">
        <Field label="Category" required>
          <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
            <SelectTrigger className="admin-select-trigger"><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent className="bg-white">
              {categories.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Subcategory">
          <Select
            value={formData.subcategoryId}
            onValueChange={v => setFormData(p => ({ ...p, subcategoryId: v }))}
            disabled={!formData.categoryId}
          >
            <SelectTrigger className="admin-select-trigger"><SelectValue placeholder="Select subcategory" /></SelectTrigger>
            <SelectContent className="bg-white">
              {!subcategories?.length
                ? <p className="text-xs text-[#888] px-3 py-2">No subcategories</p>
                : subcategories.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)
              }
            </SelectContent>
          </Select>
        </Field>
      </div>
      <Field label="Stock Count" required>
        <input name="totalCount" type="number" value={formData.totalCount} onChange={handleInputChange} required className="admin-input" placeholder="0" />
      </Field>
    </div>
  );

  const detailsTabJSX = (
    <div className="space-y-5">
      <div className="admin-grid-2">
        <Field label="Material" required>
          <input name="material" value={formData.material} onChange={handleInputChange} required className="admin-input" placeholder="e.g. Waterproof Polyester" />
        </Field>
        <Field label="Dimensions" required>
          <input name="dimensions" value={formData.dimensions} onChange={handleInputChange} required className="admin-input" placeholder="e.g. 45 × 30 × 15 cm" />
        </Field>
      </div>
      <div className="admin-grid-2">
        <Field label="Weight (kg)" required>
          <input name="weight" type="number" step="0.01" value={formData.weight} onChange={handleInputChange} required className="admin-input" placeholder="0.00" />
        </Field>
        <Field label="Country of Origin" required>
          <input name="countryOfOrigin" value={formData.countryOfOrigin} onChange={handleInputChange} required className="admin-input" placeholder="India" />
        </Field>
      </div>
      <Field label="Package Content" required>
        <textarea name="packageContent" value={formData.packageContent} onChange={handleInputChange} rows={3} required className="admin-textarea" placeholder="• 1 × Roll-Top Laptop Backpack&#10;• 1 × Warranty Card" />
        <p className="admin-hint">Separate items with new lines or bullet points</p>
      </Field>
      <Field label="Care Instructions" required>
        <textarea name="care" value={formData.care} onChange={handleInputChange} rows={3} required className="admin-textarea" placeholder="• Do not machine wash&#10;• Clean with soft damp cloth" />
        <p className="admin-hint">Separate instructions with new lines or bullet points</p>
      </Field>
      <div className="admin-grid-3">
        <Field label="Manufacturer" required>
          <input name="manufacturerName" value={formData.manufacturerName} onChange={handleInputChange} required className="admin-input" />
        </Field>
        <Field label="Packer" required>
          <input name="packerName" value={formData.packerName} onChange={handleInputChange} required className="admin-input" />
        </Field>
        <Field label="Importer" required>
          <input name="importerName" value={formData.importerName} onChange={handleInputChange} required className="admin-input" />
        </Field>
      </div>
      <Field label="Delivery Information" required>
        <textarea name="delivery" value={formData.delivery} onChange={handleInputChange} rows={3} required className="admin-textarea" placeholder="• Dispatch within 24–48 hours&#10;• Estimated delivery: 3–7 business days" />
        <p className="admin-hint">Separate lines with new lines or bullet points</p>
      </Field>
      <Field label="Return Details" required>
        <textarea name="returnDetails" value={formData.returnDetails} onChange={handleInputChange} rows={3} required className="admin-textarea" placeholder="• Return request allowed within 7 days&#10;• Product must be unused with original packaging" />
        <p className="admin-hint">Separate lines with new lines or bullet points</p>
      </Field>
      <Field label="Cash on Delivery" required>
        <Select
          value={formData.caseOnDeliveryAvailability}
          onValueChange={v => setFormData(p => ({ ...p, caseOnDeliveryAvailability: v }))}
        >
          <SelectTrigger className="admin-select-trigger"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="true">Available</SelectItem>
            <SelectItem value="false">Not Available</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );

  const imagesTabJSX = (isEdit: boolean) => (
    <div className="space-y-6">
      {isEdit && (
        <div className="flex items-start gap-3 p-4 bg-[#faf9f7] border border-[#e8e4de] rounded-sm text-sm text-[#555]">
          <Info size={16} className="mt-0.5 flex-shrink-0 text-[#888]" />
          <span>Upload new images to replace existing ones. Leave blank to keep current images.</span>
        </div>
      )}
      <div className="admin-grid-2">
        <Field label="Primary Image 1">
          <label className="admin-file-label">
            <input type="file" accept="image/*" onChange={(e: any) => setPrimaryImage1(e.target.files[0])} className="hidden" />
            <div className="admin-file-inner">
              <ImageIcon size={20} className="text-[#aaa]" />
              <span>{primaryImage1 ? primaryImage1.name : 'Choose file…'}</span>
            </div>
          </label>
        </Field>
        <Field label="Primary Image 2">
          <label className="admin-file-label">
            <input type="file" accept="image/*" onChange={(e: any) => setPrimaryImage2(e.target.files[0])} className="hidden" />
            <div className="admin-file-inner">
              <ImageIcon size={20} className="text-[#aaa]" />
              <span>{primaryImage2 ? primaryImage2.name : 'Choose file…'}</span>
            </div>
          </label>
        </Field>
      </div>
      <Field label={isEdit ? 'Model Images (replaces all existing)' : 'Model Images'}>
        <label className="admin-file-label">
          <input type="file" accept="image/*" multiple onChange={e => handleModelImageUpload(e.target.files)} className="hidden" />
          <div className="admin-file-inner">
            <ImageIcon size={20} className="text-[#aaa]" />
            <span>Choose files…</span>
          </div>
        </label>
        {modelImages.length > 0 && (
          <div className="space-y-2 mt-3">
            {modelImages.map((img, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-[#faf9f7] border border-[#e8e4de] rounded-sm">
                <ImageIcon size={14} className="text-[#888] flex-shrink-0" />
                <span className="text-sm text-[#444] flex-1 truncate">{img.name}</span>
                <input
                  value={modelImageDescriptions[idx] || ''}
                  onChange={e => updateModelDesc(idx, e.target.value)}
                  placeholder="Description"
                  className="admin-input max-w-[180px] text-xs"
                />
                <button type="button" onClick={() => removeModelImage(idx)} className="text-[#aaa] hover:text-[#c0392b] transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Field>
    </div>
  );

  const addColorsTabJSX = (
    <div className="space-y-4">
      {colors.map((color, ci) => (
        <div key={ci} className="border border-[#e8e4de] rounded-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-[#faf9f7] border-b border-[#e8e4de]">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border border-[#ddd]" style={{ backgroundColor: color.hex }} />
              <span className="text-xs font-semibold tracking-[0.1em] uppercase text-[#555]">
                {color.name || `Colour ${ci + 1}`}
              </span>
            </div>
            {colors.length > 1 && (
              <button type="button" onClick={() => removeColor(ci)} className="text-[#aaa] hover:text-[#c0392b] transition-colors">
                <Trash2 size={14} />
              </button>
            )}
          </div>
          <div className="p-4 space-y-4">
            <div className="admin-grid-2">
              <Field label="Colour Name">
                <input value={color.name} onChange={e => handleColorChange(ci, 'name', e.target.value)} placeholder="e.g. Midnight Black" className="admin-input" />
              </Field>
              <Field label="Hex Code">
                <div className="flex gap-2 items-center">
                  <input type="color" value={color.hex} onChange={e => handleColorChange(ci, 'hex', e.target.value)} className="w-10 h-10 cursor-pointer border border-[#e8e4de] rounded-sm p-0.5 bg-white" />
                  <input value={color.hex} onChange={e => handleColorChange(ci, 'hex', e.target.value)} placeholder="#1a1a1a" className="admin-input flex-1" />
                </div>
              </Field>
            </div>
            <Field label={`Colour Images (${color.images.length}/5)`}>
              <label className={`admin-file-label ${color.images.length >= 5 ? 'opacity-40 pointer-events-none' : ''}`}>
                <input type="file" accept="image/*" multiple disabled={color.images.length >= 5} onChange={e => handleColorImageUpload(ci, e.target.files)} className="hidden" />
                <div className="admin-file-inner">
                  <Palette size={16} className="text-[#aaa]" />
                  <span>{color.images.length >= 5 ? 'Maximum 5 images reached' : 'Choose up to 5 images…'}</span>
                </div>
              </label>
              {color.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {color.images.map((img: File, ii) => (
                    <div key={ii} className="relative group flex items-center gap-2 px-3 py-1.5 bg-[#faf9f7] border border-[#e8e4de] rounded-sm text-xs text-[#555]">
                      <span className="max-w-[120px] truncate">{img.name}</span>
                      <button type="button" onClick={() => removeColorImage(ci, ii)} className="text-[#ccc] hover:text-[#c0392b] transition-colors">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Field>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addColor}
        className="w-full py-3 border border-dashed border-[#d4cfc8] text-[#888] text-xs tracking-[0.12em] uppercase font-medium hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all rounded-sm flex items-center justify-center gap-2"
      >
        <Plus size={14} />
        Add Another Colour
      </button>
    </div>
  );

  const editColorsTabJSX = (
    <div className="space-y-5">
      {existingColors.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] tracking-[0.15em] uppercase font-semibold text-[#888]">Current Colours</p>
          {existingColors.map((color, ci) => {
            const isDeleted = deletedColorIds.includes(color.id);
            return (
              <div key={color.id} className={`border rounded-sm overflow-hidden transition-opacity ${isDeleted ? 'opacity-40 border-[#f5b7b1] bg-[#fdecea]' : 'border-[#e8e4de]'}`}>
                <div className="flex items-center justify-between px-4 py-3 bg-[#faf9f7] border-b border-[#e8e4de]">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border border-[#ddd]" style={{ backgroundColor: color.hex }} />
                    <span className="text-xs font-semibold tracking-[0.1em] uppercase text-[#555]">{color.name || `Colour ${ci + 1}`}</span>
                    {isDeleted && <span className="text-[9px] tracking-[0.1em] uppercase text-[#c0392b] font-bold">Will be removed</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => isDeleted
                      ? setDeletedColorIds(prev => prev.filter(id => id !== color.id))
                      : setDeletedColorIds(prev => [...prev, color.id])
                    }
                    className={`text-xs tracking-[0.08em] uppercase font-semibold px-3 py-1 rounded-sm border transition-all ${
                      isDeleted
                        ? 'border-[#27ae60] text-[#27ae60] hover:bg-[#eafaf1]'
                        : 'border-[#c0392b] text-[#c0392b] hover:bg-[#fdecea]'
                    }`}
                  >
                    {isDeleted ? 'Restore' : 'Remove'}
                  </button>
                </div>
                {!isDeleted && (
                  <div className="p-4 space-y-4">
                    <div className="admin-grid-2">
                      <Field label="Colour Name">
                        <input
                          value={color.name}
                          onChange={e => {
                            const next = [...existingColors];
                            next[ci] = { ...next[ci], name: e.target.value };
                            setExistingColors(next);
                          }}
                          className="admin-input"
                        />
                      </Field>
                      <Field label="Hex Code">
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={color.hex}
                            onChange={e => {
                              const next = [...existingColors];
                              next[ci] = { ...next[ci], hex: e.target.value };
                              setExistingColors(next);
                            }}
                            className="w-10 h-10 cursor-pointer border border-[#e8e4de] rounded-sm p-0.5 bg-white"
                          />
                          <input
                            value={color.hex}
                            onChange={e => {
                              const next = [...existingColors];
                              next[ci] = { ...next[ci], hex: e.target.value };
                              setExistingColors(next);
                            }}
                            placeholder="#1a1a1a"
                            className="admin-input flex-1"
                          />
                        </div>
                      </Field>
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.12em] uppercase font-semibold text-[#888] mb-2">Images (replace individual slots)</p>
                      <div className="grid grid-cols-5 gap-2">
                        {[0, 1, 2, 3, 4].map(slot => {
                          const currentUrl = color.imageUrls?.[slot];
                          const newFile    = color.newImages?.[slot];
                          return (
                            <div key={slot} className="flex flex-col gap-1.5">
                              <div className="aspect-square rounded-sm overflow-hidden border border-[#e8e4de] bg-[#f5f3ef] flex items-center justify-center relative">
                                {newFile
                                  ? <img src={URL.createObjectURL(newFile)} alt="" className="w-full h-full object-cover" />
                                  : currentUrl
                                  ? <img src={currentUrl} alt="" className="w-full h-full object-cover" />
                                  : <ImageIcon size={16} className="text-[#ccc]" />
                                }
                                {newFile && (
                                  <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#27ae60] rounded-full flex items-center justify-center">
                                    <CheckCircle2 size={10} className="text-white" />
                                  </div>
                                )}
                              </div>
                              <label className="cursor-pointer text-center">
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={e => {
                                    const file = e.target.files?.[0] || null;
                                    const next = [...existingColors];
                                    const imgs = [...(next[ci].newImages || [null, null, null, null, null])];
                                    imgs[slot] = file;
                                    next[ci] = { ...next[ci], newImages: imgs };
                                    setExistingColors(next);
                                  }}
                                />
                                <span className="text-[9px] tracking-[0.05em] uppercase text-[#888] hover:text-[#1a1a1a] transition-colors">
                                  {newFile ? '✓ Changed' : currentUrl ? 'Replace' : 'Add'}
                                </span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {newColors.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] tracking-[0.15em] uppercase font-semibold text-[#888]">New Colours</p>
          {newColors.map((color, ci) => (
            <div key={ci} className="border border-[#e8e4de] rounded-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-[#faf9f7] border-b border-[#e8e4de]">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-[#ddd]" style={{ backgroundColor: color.hex }} />
                  <span className="text-xs font-semibold tracking-[0.1em] uppercase text-[#555]">{color.name || `New Colour ${ci + 1}`}</span>
                  <span className="text-[9px] tracking-[0.1em] uppercase text-[#27ae60] font-bold">New</span>
                </div>
                <button
                  type="button"
                  onClick={() => setNewColors(prev => prev.filter((_, i) => i !== ci))}
                  className="text-[#aaa] hover:text-[#c0392b] transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="admin-grid-2">
                  <Field label="Colour Name">
                    <input
                      value={color.name}
                      onChange={e => {
                        const next = [...newColors];
                        next[ci] = { ...next[ci], name: e.target.value };
                        setNewColors(next);
                      }}
                      placeholder="e.g. Forest Green"
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Hex Code">
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={color.hex}
                        onChange={e => {
                          const next = [...newColors];
                          next[ci] = { ...next[ci], hex: e.target.value };
                          setNewColors(next);
                        }}
                        className="w-10 h-10 cursor-pointer border border-[#e8e4de] rounded-sm p-0.5 bg-white"
                      />
                      <input
                        value={color.hex}
                        onChange={e => {
                          const next = [...newColors];
                          next[ci] = { ...next[ci], hex: e.target.value };
                          setNewColors(next);
                        }}
                        placeholder="#1a1a1a"
                        className="admin-input flex-1"
                      />
                    </div>
                  </Field>
                </div>
                <Field label={`Images (${color.images.length}/5)`}>
                  <label className={`admin-file-label ${color.images.length >= 5 ? 'opacity-40 pointer-events-none' : ''}`}>
                    <input
                      type="file" accept="image/*" multiple
                      disabled={color.images.length >= 5}
                      className="hidden"
                      onChange={e => {
                        if (!e.target.files) return;
                        const next = [...newColors];
                        next[ci] = { ...next[ci], images: [...next[ci].images, ...Array.from(e.target.files)] };
                        setNewColors(next);
                      }}
                    />
                    <div className="admin-file-inner">
                      <Palette size={16} className="text-[#aaa]" />
                      <span>{color.images.length >= 5 ? 'Max 5 images' : 'Choose up to 5 images…'}</span>
                    </div>
                  </label>
                  {color.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {color.images.map((img, ii) => (
                        <div key={ii} className="flex items-center gap-2 px-3 py-1.5 bg-[#faf9f7] border border-[#e8e4de] rounded-sm text-xs text-[#555]">
                          <span className="max-w-[120px] truncate">{img.name}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const next = [...newColors];
                              next[ci] = { ...next[ci], images: next[ci].images.filter((_, i) => i !== ii) };
                              setNewColors(next);
                            }}
                            className="text-[#ccc] hover:text-[#c0392b] transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Field>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setNewColors(prev => [...prev, { name: '', hex: '#1a1a1a', images: [] }])}
        className="w-full py-3 border border-dashed border-[#d4cfc8] text-[#888] text-xs tracking-[0.12em] uppercase font-medium hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all rounded-sm flex items-center justify-center gap-2"
      >
        <Plus size={14} />
        Add New Colour
      </button>
    </div>
  );

  /* ── Loading screen ── */
  if (isChecking) {
    return (
      <div className="admin-loading-screen">
        <style>{adminStyles}</style>
        <Link href="/">
          <span className="admin-logo">ARTTAG</span>
        </Link>
        <div className="w-7 h-7 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mt-6" />
        <p className="text-xs tracking-[0.15em] uppercase text-[#888] mt-3">Verifying access…</p>
      </div>
    );
  }

  /* ── Stats ── */
  // Build a flat id→name map from all categories + subcategories
  const categoryNameMap: Record<string, string> = {};
  categories.forEach((c: any) => { categoryNameMap[c.id] = c.name; });
  allSubcategories.forEach((s: any) => { categoryNameMap[s.id] = s.name; });

  const totalStock  = products.reduce((s: number, p: any) => s + (p.totalCount || 0), 0);
  const outOfStock  = products.filter((p: any) => (p.totalCount || 0) === 0).length;
  const totalOrders = products.reduce((s: number, p: any) => s + (p.orderCount || 0), 0);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <style>{adminStyles}</style>
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-10">

        {/* ── Page header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-[#888] mb-1">Admin Portal</p>
            <h1 className="admin-serif text-4xl font-light text-[#1a1a1a]">Product Management</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => router.push(`/${userId}/admin/category`)} className="admin-outline-btn">
              <LayoutGrid size={14} />
              Categories
            </button>
            <button onClick={() => router.push(`/${userId}/admin/orders`)} className="admin-outline-btn">
              <ShoppingBag size={14} />
              Orders
            </button>
            <button onClick={() => { resetForm(); setIsAddDialogOpen(true); }} className="admin-primary-btn">
              <Plus size={16} />
              Add Product
            </button>
          </div>
        </div>

        <div className="admin-divider mb-10" />

        {/* ── Stat cards ── */}
        {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Products', value: products.length, icon: <Package size={18} /> },
            { label: 'Total Stock', value: totalStock.toLocaleString(), icon: <TrendingUp size={18} /> },
            { label: 'Out of Stock', value: outOfStock, icon: <AlertCircle size={18} />, warn: outOfStock > 0 },
            { label: 'Total Orders', value: totalOrders, icon: <ShoppingBag size={18} /> },
          ].map(({ label, value, icon, warn }) => (
            <div key={label} className={`admin-stat-card ${warn ? 'warn' : ''}`}>
              <div className="admin-stat-icon">{icon}</div>
              <div className="admin-stat-value">{value}</div>
              <div className="admin-stat-label">{label}</div>
            </div>
          ))}
        </div> */}

        {/* ── Alert ── */}
        {alert.show && (
          <div className={`admin-alert ${alert.type === 'error' ? 'error' : 'success'} mb-6`}>
            {alert.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            {alert.message}
          </div>
        )}

        {/* ── Search + refresh ── */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            
            <input
              placeholder="Search products…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="admin-input pl-9 w-full"
            />
          </div>
          <button onClick={fetchProducts} className="admin-outline-btn" title="Refresh">
            <RefreshCw size={14} />
          </button>
        </div>

        {/* ── Products table ── */}
        <div className="bg-white border border-[#e8e4de] rounded-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e4de]">
            <div>
              <h2 className="admin-serif text-xl font-light text-[#1a1a1a]">All Products</h2>
              <p className="text-xs text-[#888] mt-0.5">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#faf9f7] hover:bg-[#faf9f7]">
                  {['Product', 'Category', 'Prices', 'Stock', 'Colours', 'Orders', 'Reviews', 'Actions'].map(h => (
                    <TableHead key={h} className="admin-th">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-56 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-7 h-7 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs tracking-[0.12em] uppercase text-[#888]">Loading products…</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-56 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Package size={36} className="text-[#d4cfc8]" />
                        <p className="text-sm text-[#888]">No products found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product: any) => (
                    <TableRow key={product.id} className="hover:bg-[#faf9f7] transition-colors border-b border-[#f0ece6]">
                      {/* Product */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.primaryImage1
                            ? <img src={product.primaryImage1} alt={product.name} className="w-12 h-12 object-cover rounded-sm border border-[#e8e4de] flex-shrink-0" />
                            : <div className="w-12 h-12 bg-[#f5f3ef] rounded-sm border border-[#e8e4de] flex items-center justify-center flex-shrink-0"><Package size={16} className="text-[#ccc]" /></div>
                          }
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#1a1a1a] line-clamp-1">{product.name}</p>
                            {product.type && <span className="admin-badge">{product.type}</span>}
                          </div>
                        </div>
                      </TableCell>
                      {/* Category */}
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          {product.categoryId && categoryNameMap[product.categoryId] ? (
                            <span className="admin-badge">{categoryNameMap[product.categoryId]}</span>
                          ) : (
                            <span className="text-[10px] text-[#ccc] italic">—</span>
                          )}
                        </div>
                      </TableCell>
                      {/* Prices */}
                      <TableCell>
                        <p className="text-sm font-semibold text-[#1a1a1a]">₹{Number(product.discountPrice).toLocaleString()}</p>
                        {product.originalPrice > product.discountPrice && (
                          <p className="text-xs text-[#aaa] line-through">₹{Number(product.originalPrice).toLocaleString()}</p>
                        )}
                      </TableCell>
                      {/* Stock */}
                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                          <span className={`admin-stock-badge ${(product.totalCount || 0) === 0 ? 'out' : (product.totalCount || 0) < 20 ? 'low' : 'ok'}`}>
                            {product.totalCount || 0}
                          </span>
                          <button
                            onClick={() => { setStockProduct(product); setNewStock(String(product.totalCount || '')); setIsStockDialogOpen(true); }}
                            className="admin-xs-btn"
                          >
                            Update
                          </button>
                        </div>
                      </TableCell>
                      {/* Colours */}
                      <TableCell>
                        <div className="flex gap-1 items-center flex-wrap">
                          {product.colors?.slice(0, 5).map((c: any, i: number) => (
                            <div key={i} className="w-5 h-5 rounded-full border border-white shadow-sm" style={{ backgroundColor: c.hex }} title={c.name} />
                          ))}
                          {product.colors?.length > 5 && <span className="text-[10px] text-[#888]">+{product.colors.length - 5}</span>}
                        </div>
                      </TableCell>
                      {/* Orders */}
                      <TableCell>
                        <span className="text-sm text-[#444]">{product.orderCount || 0}</span>
                      </TableCell>
                      {/* Reviews */}
                      <TableCell>
                        <span className="text-sm text-[#444]">{product.reviews?.length || 0}</span>
                      </TableCell>
                      {/* Actions */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {/* View */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <button onClick={() => setViewProduct(product)} className="admin-icon-btn" title="View">
                                <Eye size={14} />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-[#e8e4de]">
                              <DialogHeader>
                                <p className="text-[10px] tracking-[0.18em] uppercase text-[#888]">Product Detail</p>
                                <DialogTitle className="admin-serif text-2xl font-light">{viewProduct?.name}</DialogTitle>
                              </DialogHeader>
                              {viewProduct && (
                                <div className="space-y-5 pt-2">
                                  <div className="grid grid-cols-2 gap-3">
                                    {[viewProduct.primaryImage1, viewProduct.primaryImage2].filter(Boolean).map((src, i) => (
                                      <img key={i} src={src} alt="" className="w-full aspect-square object-cover rounded-sm border border-[#e8e4de]" />
                                    ))}
                                  </div>
                                  <div className="admin-divider" />
                                  <div className="grid grid-cols-2 gap-3 text-sm">
                                    {[
                                      ['Type', viewProduct.type],
                                      ['Price', `₹${Number(viewProduct.discountPrice).toLocaleString()} (was ₹${Number(viewProduct.originalPrice).toLocaleString()})`],
                                      ['Material', viewProduct.material],
                                      ['Dimensions', viewProduct.dimensions],
                                      ['Weight', viewProduct.weight ? `${viewProduct.weight}g` : null],
                                      ['Origin', viewProduct.countryOfOrigin],
                                      ['Stock', viewProduct.totalCount],
                                      ['COD', viewProduct.caseOnDeliveryAvailability ? 'Available' : 'Not Available'],
                                    ].filter(([, v]) => v).map(([label, value]) => (
                                      <div key={label as string}>
                                        <p className="text-[10px] tracking-[0.1em] uppercase text-[#aaa] mb-0.5">{label}</p>
                                        <p className="text-[#1a1a1a] font-medium">{value}</p>
                                      </div>
                                    ))}
                                  </div>
                                  {viewProduct.description && (
                                    <>
                                      <div className="admin-divider" />
                                      <div>
                                        <p className="text-[10px] tracking-[0.1em] uppercase text-[#aaa] mb-2">Description</p>
                                        <p className="text-sm text-[#555] leading-relaxed">{viewProduct.description}</p>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {/* Edit */}
                          <button onClick={() => openEditDialog(product)} className="admin-icon-btn" title="Edit">
                            <Edit size={14} />
                          </button>

                          {/* Delete */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="admin-icon-btn danger" title="Delete"><Trash2 size={14} /></button>
                            </DialogTrigger>
                            <DialogContent className="max-w-sm bg-white border border-[#e8e4de]">
                              <DialogHeader>
                                <p className="text-[10px] tracking-[0.18em] uppercase text-[#888]">Confirm Delete</p>
                                <DialogTitle className="admin-serif text-xl font-light">Delete Product?</DialogTitle>
                                <DialogDescription className="text-sm text-[#666] pt-1">
                                  "<strong>{product.name}</strong>" will be permanently removed. This cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex gap-3 pt-4">
                                <DialogTrigger asChild>
                                  <button className="admin-outline-btn flex-1">Cancel</button>
                                </DialogTrigger>
                                <button onClick={() => deleteProduct(product.id)} disabled={loading} className="flex-1 py-2 bg-[#c0392b] text-white text-xs tracking-[0.12em] uppercase font-medium rounded-sm hover:bg-[#a93226] transition-colors disabled:opacity-50">
                                  {loading ? 'Deleting…' : 'Delete'}
                                </button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* ════════════════ ADD PRODUCT DIALOG ════════════════ */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-[#e8e4de]">
          <DialogHeader>
            <p className="text-[10px] tracking-[0.18em] uppercase text-[#888]">New Listing</p>
            <DialogTitle className="admin-serif text-2xl font-light">Add Product</DialogTitle>
          </DialogHeader>
          <div className="admin-divider my-4" />
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic">
              <TabsList className="admin-tabs-list">
                {[
                  { v: 'basic',   label: 'Basic',   icon: <Info size={13} /> },
                  { v: 'details', label: 'Details',  icon: <Package size={13} /> },
                  { v: 'images',  label: 'Images',   icon: <ImageIcon size={13} /> },
                  { v: 'colors',  label: 'Colours',  icon: <Palette size={13} /> },
                ].map(t => (
                  <TabsTrigger key={t.v} value={t.v} className="admin-tab-trigger">
                    {t.icon} {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="pt-6">
                <TabsContent value="basic">{basicTabJSX}</TabsContent>
                <TabsContent value="details">{detailsTabJSX}</TabsContent>
                <TabsContent value="images">{imagesTabJSX(false)}</TabsContent>
                <TabsContent value="colors">{addColorsTabJSX}</TabsContent>
              </div>
            </Tabs>
            <div className="admin-divider" />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setIsAddDialogOpen(false)} className="admin-outline-btn">Cancel</button>
              <button type="submit" disabled={loading} className="admin-primary-btn disabled:opacity-50">
                {loading ? (
                  <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />{uploadProgress || 'Adding…'}</>
                ) : 'Add Product'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ════════════════ EDIT PRODUCT DIALOG ════════════════ */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-[#e8e4de]">
          <DialogHeader>
            <p className="text-[10px] tracking-[0.18em] uppercase text-[#888]">Edit Listing</p>
            <DialogTitle className="admin-serif text-2xl font-light">Edit Product</DialogTitle>
          </DialogHeader>
          <div className="admin-divider my-4" />
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <Tabs defaultValue="basic">
              <TabsList className="admin-tabs-list">
                {[
                  { v: 'basic',   label: 'Basic',   icon: <Info size={13} /> },
                  { v: 'details', label: 'Details',  icon: <Package size={13} /> },
                  { v: 'images',  label: 'Images',   icon: <ImageIcon size={13} /> },
                  { v: 'colors',  label: 'Colours',  icon: <Palette size={13} /> },
                ].map(t => (
                  <TabsTrigger key={t.v} value={t.v} className="admin-tab-trigger">
                    {t.icon} {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="pt-6">
                <TabsContent value="basic">{basicTabJSX}</TabsContent>
                <TabsContent value="details">{detailsTabJSX}</TabsContent>
                <TabsContent value="images">{imagesTabJSX(true)}</TabsContent>
                <TabsContent value="colors">{editColorsTabJSX}</TabsContent>
              </div>
            </Tabs>
            <div className="admin-divider" />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => { setIsEditDialogOpen(false); setEditProduct(null); resetForm(); }} className="admin-outline-btn">Cancel</button>
              <button type="submit" disabled={loading} className="admin-primary-btn disabled:opacity-50">
                {loading ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Updating…</> : 'Update Product'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ════════════════ STOCK DIALOG ════════════════ */}
      <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
        <DialogContent className="max-w-sm bg-white border border-[#e8e4de]">
          <DialogHeader>
            <p className="text-[10px] tracking-[0.18em] uppercase text-[#888]">Inventory</p>
            <DialogTitle className="admin-serif text-xl font-light">Update Stock</DialogTitle>
            <DialogDescription className="text-sm text-[#666] pt-0.5">
              {stockProduct?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Field label="New Stock Count">
              <input
                type="number"
                value={newStock}
                onChange={e => setNewStock(e.target.value)}
                placeholder="Enter quantity"
                className="admin-input"
              />
            </Field>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsStockDialogOpen(false)} className="admin-outline-btn flex-1">Cancel</button>
              <button onClick={updateStock} disabled={loading} className="admin-primary-btn flex-1 disabled:opacity-50">
                {loading ? 'Updating…' : 'Update'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <FooterPart />
    </div>
  );
}

/* ─────────────────────────────────────────────
   FIELD WRAPPER
───────────────────────────────────────────── */
function Field({ label, required = false, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888]">
        {label}{required && <span className="text-[#c0392b] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const adminStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  .admin-serif { font-family: 'Cormorant Garamond', serif; }

  .admin-divider {
    height: 1px;
    background: linear-gradient(to right, transparent, #e8e4de 30%, #e8e4de 70%, transparent);
  }

  /* Loading */
  .admin-loading-screen {
    min-height: 100vh;
    background: #faf9f7;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .admin-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem;
    font-weight: 300;
    letter-spacing: 0.2em;
    color: #1a1a1a;
  }

  /* Inputs */
  .admin-input {
    width: 100%;
    padding: 8px 12px;
    font-size: 13px;
    border: 1px solid #e8e4de;
    border-radius: 2px;
    background: #fff;
    color: #1a1a1a;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s;
    outline: none;
  }
  .admin-input:focus { border-color: #1a1a1a; }
  .admin-input::placeholder { color: #ccc; }

  .admin-textarea {
    width: 100%;
    padding: 8px 12px;
    font-size: 13px;
    border: 1px solid #e8e4de;
    border-radius: 2px;
    background: #fff;
    color: #1a1a1a;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s;
    outline: none;
    resize: none;
    line-height: 1.6;
  }
  .admin-textarea:focus { border-color: #1a1a1a; }
  .admin-textarea::placeholder { color: #ccc; white-space: pre-line; }

  .admin-hint {
    font-size: 10px;
    color: #aaa;
    letter-spacing: 0.04em;
    margin-top: 4px;
  }

  .admin-select-trigger {
    border: 1px solid #e8e4de !important;
    border-radius: 2px !important;
    background: #fff !important;
    font-size: 13px !important;
    color: #1a1a1a !important;
    height: 38px !important;
    font-family: 'DM Sans', sans-serif !important;
  }
  .admin-select-trigger:focus { border-color: #1a1a1a !important; }

  /* File upload */
  .admin-file-label {
    display: block;
    cursor: pointer;
    border: 1px dashed #d4cfc8;
    border-radius: 2px;
    transition: border-color 0.2s;
  }
  .admin-file-label:hover { border-color: #1a1a1a; }
  .admin-file-inner {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    font-size: 13px;
    color: #888;
    font-family: 'DM Sans', sans-serif;
  }

  /* Grids */
  .admin-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .admin-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  @media (max-width: 640px) {
    .admin-grid-2 { grid-template-columns: 1fr; }
    .admin-grid-3 { grid-template-columns: 1fr; }
  }

  /* Buttons */
  .admin-primary-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #1a1a1a;
    color: #fff;
    border: none;
    padding: 9px 20px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    border-radius: 2px;
    cursor: pointer;
    transition: background 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .admin-primary-btn:hover:not(:disabled) { background: #333; }

  .admin-outline-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    color: #1a1a1a;
    border: 1px solid #e8e4de;
    padding: 8px 18px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .admin-outline-btn:hover { border-color: #1a1a1a; }

  .admin-icon-btn {
    width: 30px; height: 30px;
    border-radius: 2px;
    border: 1px solid #e8e4de;
    background: #faf9f7;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: #888;
    transition: all 0.15s;
  }
  .admin-icon-btn:hover { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
  .admin-icon-btn.danger:hover { background: #c0392b; border-color: #c0392b; }

  .admin-xs-btn {
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 600;
    color: #888;
    background: transparent;
    border: 1px solid #e8e4de;
    border-radius: 2px;
    padding: 2px 8px;
    cursor: pointer;
    transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .admin-xs-btn:hover { border-color: #1a1a1a; color: #1a1a1a; }

  /* Table */
  .admin-th {
    font-size: 9px !important;
    letter-spacing: 0.15em !important;
    text-transform: uppercase !important;
    font-weight: 600 !important;
    color: #aaa !important;
    padding: 10px 16px !important;
  }

  /* Badge */
  .admin-badge {
    display: inline-block;
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 600;
    color: #888;
    background: #f5f3ef;
    border: 1px solid #e8e4de;
    border-radius: 2px;
    padding: 1px 6px;
    margin-top: 3px;
  }

  /* Stock badges */
  .admin-stock-badge {
    display: inline-block;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 2px;
    border: 1px solid;
  }
  .admin-stock-badge.ok   { background: #eafaf1; color: #27ae60; border-color: #a9dfbf; }
  .admin-stock-badge.low  { background: #fef5e7; color: #e67e22; border-color: #f5cba7; }
  .admin-stock-badge.out  { background: #fdecea; color: #c0392b; border-color: #f5b7b1; }

  /* Alert */
  .admin-alert {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border-radius: 2px;
    border: 1px solid;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
  }
  .admin-alert.success { background: #eafaf1; border-color: #a9dfbf; color: #1e8449; }
  .admin-alert.error   { background: #fdecea; border-color: #f5b7b1; color: #c0392b; }

  /* Stat cards */
  .admin-stat-card {
    background: #fff;
    border: 1px solid #e8e4de;
    border-radius: 2px;
    padding: 20px;
    transition: box-shadow 0.2s;
  }
  .admin-stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
  .admin-stat-card.warn { border-color: #f5b7b1; background: #fdecea; }
  .admin-stat-icon { color: #888; margin-bottom: 10px; }
  .admin-stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem;
    font-weight: 400;
    color: #1a1a1a;
    line-height: 1;
    margin-bottom: 4px;
  }
  .admin-stat-label {
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #aaa;
    font-weight: 600;
  }
  .admin-stat-card.warn .admin-stat-value { color: #c0392b; }
  .admin-stat-card.warn .admin-stat-icon { color: #c0392b; }

  /* Tabs */
  .admin-tabs-list {
    display: flex;
    gap: 2px;
    background: #f5f3ef;
    border: 1px solid #e8e4de;
    border-radius: 2px;
    padding: 3px;
  }
  .admin-tab-trigger {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 600;
    color: #888;
    padding: 6px 14px;
    border-radius: 2px;
    cursor: pointer;
    border: none;
    background: transparent;
    transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .admin-tab-trigger[data-state='active'] {
    background: #fff;
    color: #1a1a1a;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
`;