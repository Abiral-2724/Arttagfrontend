'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Upload, X, Eye, Package, Edit, Search, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import Navbar from '@/components/Navbar';
import FooterPart from '@/components/FooterPart';


export default function ProductAdminPortal() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewProduct, setViewProduct] : any = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [editProduct, setEditProduct] : any = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [stockProduct, setStockProduct] : any = useState(null);
  const [newStock, setNewStock] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { userId } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    originalPrice: '',
    discountPrice: '',
    type: '',
    tags: '',
    material: '',
    dimensions: '',
    weight: '',
    packageContent: '',
    care: '',
    countryOfOrigin: '',
    manufacturerName: '',
    packerName: '',
    importerName: '',
    delivery: '',
    caseOnDeliveryAvailability: 'false',
    returnDetails: '',
    categoryId: '',
    subcategoryId: '',
    totalCount: ''
  });

  const [colors, setColors] = useState([{ name: '', hex: '#000000', images: [] }]);
  const [modelImages, setModelImages] : any = useState([]);
  const [modelImageDescriptions, setModelImageDescriptions] : any = useState([]);
  const [primaryImage1, setPrimaryImage1] : any = useState(null);
  const [primaryImage2, setPrimaryImage2] : any = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const storedUserId = localStorage.getItem("arttagUserId");
        const storedToken = localStorage.getItem("arttagtoken");

        if (!storedUserId || !storedToken || storedUserId !== userId) {
          router.replace("/login");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/user/${userId}/get/profile`);

        if (!response.data.success || response.data.user.role !== "ADMIN") {
          router.replace("/login");
          return;
        }

      } catch (error) {
        console.error("Error verifying user:", error);
        router.replace("/login");
      } finally {
        setIsChecking(false);
      }
    };

    if (userId) checkAccess();
  }, [userId, router]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product : any) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/product/get/all/product`);
      if (response.data.success) {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
      }
    } catch (error) {
      console.log('error product = ', error)
      showAlert('Failed to fetch products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/category/get/all/category`);
      if (response.data.success) {
        setCategories(response.data.category);
      }
    } catch (error) {
      showAlert('Failed to fetch categories', 'error');
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/category/get/${categoryId}/all/subcategory`);
      if (response.data.success) {
        setSubcategories(response.data.subcategories);
      }
    } catch (error) {
      setSubcategories([]);
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (categoryId) => {
    setFormData(prev => ({ ...prev, categoryId, subcategoryId: '' }));
    fetchSubcategories(categoryId);
  };

  const handleColorChange = (index, field, value) => {
    const newColors = [...colors];
    newColors[index][field] = value;
    setColors(newColors);
  };

  const addColor = () => {
    setColors([...colors, { name: '', hex: '#000000', images: [] }]);
  };

  const removeColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleColorImageUpload = (index, files) => {
    const newColors : any = [...colors];
    newColors[index].images = [...newColors[index].images, ...Array.from(files)];
    setColors(newColors);
  };

  const removeColorImage = (colorIndex, imageIndex) => {
    const newColors = [...colors];
    newColors[colorIndex].images = newColors[colorIndex].images.filter((_, i) => i !== imageIndex);
    setColors(newColors);
  };

  const handleModelImageUpload = (files) => {
    const newImages = Array.from(files);
    setModelImages([...modelImages, ...newImages]);
    setModelImageDescriptions([...modelImageDescriptions, ...newImages.map(() => 'Model Image')]);
  };

  const removeModelImage = (index) => {
    setModelImages(modelImages.filter((_, i) => i !== index));
    setModelImageDescriptions(modelImageDescriptions.filter((_, i) => i !== index));
  };

  const updateModelImageDescription = (index, description) => {
    const newDescriptions = [...modelImageDescriptions];
    newDescriptions[index] = description;
    setModelImageDescriptions(newDescriptions);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.categoryId) {
      showAlert('Please select a category', 'error');
      return;
    }
  
    const categoryId = formData.subcategoryId || formData.categoryId;
  
    try {
      setLoading(true);
      setUploadProgress('Preparing upload...');
      
      const formDataToSend = new FormData();
  
      Object.keys(formData).forEach(key => {
        if (key !== 'categoryId' && key !== 'subcategoryId') {
          formDataToSend.append(key, formData[key]);
        }
      });
  
      if (primaryImage1) formDataToSend.append('primaryImage1', primaryImage1);
      if (primaryImage2) formDataToSend.append('primaryImage2', primaryImage2);
  
      modelImages.forEach(image => {
        formDataToSend.append('modelImages', image);
      });
      formDataToSend.append('modelImageDescriptions', JSON.stringify(modelImageDescriptions));
  
      const colorData = colors.map(({ images, ...color }) => color);
      formDataToSend.append('colors', JSON.stringify(colorData));
  
      colors.forEach((color, index) => {
        color.images.forEach((image, imgIndex) => {
          formDataToSend.append(`color_${color.name}_image${imgIndex}`, image);
        });
      });
  
      setUploadProgress('Uploading images...');
      
      const response = await axios.post(
        `${API_BASE_URL}/product/admin/${userId}/add/product/${categoryId}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 300000,
          onUploadProgress: (progressEvent : any) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(`Uploading... ${percentCompleted}%`);
          }
        }
      );
  
      if (response.data.success) {
        setUploadProgress('Processing...');
        showAlert('Product added successfully!', 'success');
        resetForm();
        setIsAddDialogOpen(false);
        await fetchProducts();
      }
    } catch (error : any) {
      console.error('Error adding product:', error);
      showAlert(error.response?.data?.message || 'Failed to add product', 'error');
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        if (key !== 'categoryId' && key !== 'subcategoryId' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (primaryImage1) formDataToSend.append('primaryImage1', primaryImage1);
      if (primaryImage2) formDataToSend.append('primaryImage2', primaryImage2);

      if (modelImages.length > 0) {
        formDataToSend.append('replaceModelImages', 'true');
        modelImages.forEach(image => {
          formDataToSend.append('modelImages', image);
        });
      }

      const response = await axios.patch(
        `${API_BASE_URL}/product/edit/product/${editProduct.id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        showAlert('Product updated successfully!', 'success');
        resetForm();
        setIsEditDialogOpen(false);
        setEditProduct(null);
        fetchProducts();
      }
    } catch (error : any) {
      showAlert(error.response?.data?.message || 'Failed to update product', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      originalPrice: product.originalPrice || '',
      discountPrice: product.discountPrice || '',
      type: product.type || '',
      tags: product.tags || '',
      material: product.material || '',
      dimensions: product.dimensions || '',
      weight: product.weight || '',
      packageContent: product.packageContent || '',
      care: product.care || '',
      countryOfOrigin: product.countryOfOrigin || '',
      manufacturerName: product.manufacturerName || '',
      packerName: product.packerName || '',
      importerName: product.importerName || '',
      delivery: product.delivery || '',
      caseOnDeliveryAvailability: product.caseOnDeliveryAvailability ? 'true' : 'false',
      returnDetails: product.returnDetails || '',
      categoryId: product.categoryId || '',
      subcategoryId: '',
      totalCount: product.totalCount || ''
    });
    setIsEditDialogOpen(true);
  };

  const deleteProduct = async (productId : any) => {
   
    try {
      setLoading(true);
      const response = await axios.delete(`${API_BASE_URL}/product/${userId}/delete/product`, {
        data: { productId }
      });

      if (response.data.success) {
        showAlert('Product deleted successfully!', 'success');
        fetchProducts();
      }
    } catch (error : any) {
      showAlert(error.response?.data?.message || 'Failed to delete product', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async () => {
    if (!stockProduct || !newStock) return;

    try {
      setLoading(true);
      const response = await axios.patch(`${API_BASE_URL}/product/update/stock`, {
        productId: stockProduct.id,
        newStock: parseInt(newStock)
      });

      if (response.data.success) {
        showAlert('Stock updated successfully!', 'success');
        setIsStockDialogOpen(false);
        setStockProduct(null);
        setNewStock('');
        fetchProducts();
      }
    } catch (error : any) {
      showAlert(error.response?.data?.message || 'Failed to update stock', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', description: '', shortDescription: '', originalPrice: '',
      discountPrice: '', type: '', tags: '', material: '', dimensions: '',
      weight: '', packageContent: '', care: '', countryOfOrigin: '',
      manufacturerName: '', packerName: '', importerName: '', delivery: '',
      caseOnDeliveryAvailability: 'false', returnDetails: '', categoryId: '', subcategoryId: '', totalCount: ''
    });
    setColors([{ name: '', hex: '#000000', images: [] }]);
    setModelImages([]);
    setModelImageDescriptions([]);
    setPrimaryImage1(null);
    setPrimaryImage2(null);
  };

  const openAddDialog = () => {
    resetForm(); // Clear form before opening
    setIsAddDialogOpen(true);
  };

  const handleViewCategory = () => {
    router.push(`/${userId}/admin/category`);
  };
  
  const handleOrderCategory = () => {
    router.push(`/${userId}/admin/orders`);
  };

  return (
    <div>
    {isChecking ? (
      // Enhanced Loading State
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
        <Link href={'/'}>
          <div className="mb-8 transform hover:scale-105 transition-transform">
            <div className="w-auto h-16 md:h-20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 270 54"
                className="h-full w-auto drop-shadow-lg"
              >
                <defs>
                  <style>
                    {`.st0 { font-family: MuktaMahee-Regular, 'Mukta Mahee'; font-size: 49.69px; }`}
                  </style>
                </defs>
                <g>
                  <path d="M62.85,33.21c.11,0,.17.04.19.21.2,1.7-.04,4.05-.01,5.84,0,.44.01.95-.3,1.15-.34.21-1.72-.06-2.18-.12-14.77-1.86-19.13-21.03-6.37-28.96,3.44-2.14,5.73-2.15,9.65-2.25.57-.01,1.26,0,1.76.06-2.15,2.88-1.5,7.52,2.16,8.77,1.53.52,2.98.08,4.52.4v21.62c0,.2-.1.41-.29.49h-6.67c-.08,0-.16-.03-.22-.09-.06-.06-.09-.14-.09-.22v-20.52c0-.35-.19-.72-.24-.86-1.18-3.54-5.67-2.47-7.9-.6-4.54,3.81-3.78,11.34,1.53,14.02.34.17,1.24.75,2.41.87l2.06.2Z" />
                  <path d="M68.98,16.48c-.15,0-.29-.02-.44-.05-1.63-.42-2.77-2.4-2.6-4.02.15-1.44,1.7-3.34,3.22-3.34h20.4c.15,0,.17.11.18.44v6.66c0,.08-.03.16-.09.22-.06.06-.14.09-.22.09h-20.45Z" />
                  <path d="M73.96,40.29v-21.62c0-.2.1-.41.29-.49h6.67c.08,0,.16.03.22.09.06.06.09.14.09.22v18.21c.03.76-.62,1.51-.8,1.75-1.53,2.1-4.13,2.17-6.49,1.83Z" />
                </g>
                <text className="st0" transform="translate(84.95 40.38)">
                  <tspan x="0" y="0">Arttag</tspan>
                </text>
              </svg>
            </div>
          </div>
        </Link>
        <div className="relative">
          <Spinner className="text-blue-600 text-6xl md:text-7xl" />
          <div className="absolute inset-0 blur-xl bg-blue-400 opacity-20 animate-pulse"></div>
        </div>
        <p className="text-gray-600 text-base md:text-lg mt-6 font-medium">Verifying request...</p>
      </div>
    ) : (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Navbar />
        
        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Title Section */}
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                    Product Management
                  </h1>
                  <p className="text-gray-600 text-sm md:text-base flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Manage your e-commerce inventory
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleViewCategory}
                    variant="outline"
                    className="flex items-center justify-center gap-2 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all"
                  >
                    <Package className="w-4 h-4" />
                    <span className="font-medium">Categories</span>
                  </Button>

                  <Button
                    onClick={handleOrderCategory}
                    variant="outline"
                    className="flex items-center justify-center gap-2 border-2 hover:bg-green-50 hover:border-green-300 transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span className="font-medium">Orders</span>
                  </Button>

                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <Button
                      onClick={openAddDialog}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="font-semibold">Add Product</span>
                    </Button>
                    
                    {/* Add Product Dialog */}
                    <DialogContent className="max-w-[95vw] sm:max-w-[85vw] lg:max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                      <DialogHeader>
                        <DialogTitle className="text-xl md:text-2xl font-bold text-gray-900">
                          Add New Product
                        </DialogTitle>
                        <DialogDescription className="text-sm md:text-base text-gray-600">
                          Fill in the product details below to add to your inventory
                        </DialogDescription>
                      </DialogHeader>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <Tabs defaultValue="basic" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 bg-gray-100 p-1 rounded-lg">
                            <TabsTrigger value="basic" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                              Basic Info
                            </TabsTrigger>
                            <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                              Details
                            </TabsTrigger>
                            <TabsTrigger value="images" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                              Images
                            </TabsTrigger>
                            <TabsTrigger value="colors" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                              Colors
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="basic" className="space-y-4 mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">
                                  Product Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="name"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleInputChange}
                                  required
                                  className="border-2 focus:border-blue-500"
                                  placeholder="Enter product name"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="type" className="text-sm font-medium">Product Type</Label>
                                <Input
                                  id="type"
                                  name="type"
                                  value={formData.type}
                                  onChange={handleInputChange}
                                  className="border-2 focus:border-blue-500"
                                  placeholder="e.g., Wall Art, Sculpture"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="shortDescription" className="text-sm font-medium">
                                Short Description
                              </Label>
                              <Input
                                id="shortDescription"
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleInputChange}
                                className="border-2 focus:border-blue-500"
                                placeholder="Brief product summary"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="description" className="text-sm font-medium">
                                Full Description <span className="text-red-500">*</span>
                              </Label>
                              <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                required
                                className="border-2 focus:border-blue-500 resize-none"
                                placeholder="Detailed product description"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="originalPrice" className="text-sm font-medium">
                                  Original Price <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                  <Input
                                    id="originalPrice"
                                    name="originalPrice"
                                    type="number"
                                    step="0.01"
                                    value={formData.originalPrice}
                                    onChange={handleInputChange}
                                    required
                                    className="border-2 focus:border-blue-500 pl-8"
                                    placeholder="0.00"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="discountPrice" className="text-sm font-medium">
                                  Discount Price <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                  <Input
                                    id="discountPrice"
                                    name="discountPrice"
                                    type="number"
                                    step="0.01"
                                    value={formData.discountPrice}
                                    onChange={handleInputChange}
                                    required
                                    className="border-2 focus:border-blue-500 pl-8"
                                    placeholder="0.00"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="categoryId" className="text-sm font-medium">
                                  Category <span className="text-red-500">*</span>
                                </Label>
                                <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
                                  <SelectTrigger className="border-2 focus:border-blue-500">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white">
                                    {categories.map((cat: any) => (
                                      <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="subcategoryId" className="text-sm font-medium">
                                  Subcategory
                                </Label>
                                <Select
                                  value={formData.subcategoryId}
                                  onValueChange={(value) => setFormData((prev) => ({ ...prev, subcategoryId: value }))}
                                  disabled={!formData.categoryId}
                                >
                                  <SelectTrigger className="border-2 focus:border-blue-500">
                                    <SelectValue placeholder="Select subcategory" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white">
                                    {subcategories?.length === 0 ? (
                                      <p className="text-sm text-gray-500 px-2 py-2">No subcategories available</p>
                                    ) : (
                                      subcategories?.map((sub: any) => (
                                        <SelectItem key={sub.id} value={sub.id}>
                                          {sub.name}
                                        </SelectItem>
                                      ))
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="totalCount" className="text-sm font-medium">
                                Initial Stock Count <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="totalCount"
                                name="totalCount"
                                type="number"
                                value={formData.totalCount}
                                onChange={handleInputChange}
                                required
                                className="border-2 focus:border-blue-500"
                                placeholder="Enter stock quantity"
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="details" className="space-y-4 mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="material" className="text-sm font-medium">
                                  Material <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="material"
                                  name="material"
                                  value={formData.material}
                                  onChange={handleInputChange}
                                  required
                                  className="border-2 focus:border-blue-500"
                                  placeholder="e.g., Canvas, Wood"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="dimensions" className="text-sm font-medium">
                                  Dimensions <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="dimensions"
                                  name="dimensions"
                                  value={formData.dimensions}
                                  onChange={handleInputChange}
                                  required
                                  className="border-2 focus:border-blue-500"
                                  placeholder="e.g., 30x40 cm"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="weight" className="text-sm font-medium">
                                  Weight (kg) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="weight"
                                  name="weight"
                                  type="number"
                                  step="0.01"
                                  value={formData.weight}
                                  onChange={handleInputChange}
                                  required
                                  className="border-2 focus:border-blue-500"
                                  placeholder="0.00"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="countryOfOrigin" className="text-sm font-medium">
                                  Country of Origin <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="countryOfOrigin"
                                  name="countryOfOrigin"
                                  value={formData.countryOfOrigin}
                                  onChange={handleInputChange}
                                  required
                                  className="border-2 focus:border-blue-500"
                                  placeholder="e.g., India"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="packageContent" className="text-sm font-medium">
                                Package Content <span className="text-red-500">*</span>
                              </Label>
                              <Textarea
                                id="packageContent"
                                name="packageContent"
                                value={formData.packageContent}
                                onChange={handleInputChange}
                                rows={3}
                                required
                                className="border-2 focus:border-blue-500 resize-none"
                                placeholder="What's included in the package"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="care" className="text-sm font-medium">
                                Care Instructions <span className="text-red-500">*</span>
                              </Label>
                              <Textarea
                                id="care"
                                name="care"
                                value={formData.care}
                                onChange={handleInputChange}
                                rows={3}
                                required
                                className="border-2 focus:border-blue-500 resize-none"
                                placeholder="How to care for this product"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="manufacturerName" className="text-sm font-medium">
                                  Manufacturer <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="manufacturerName"
                                  name="manufacturerName"
                                  value={formData.manufacturerName}
                                  onChange={handleInputChange}
                                  required
                                  className="border-2 focus:border-blue-500"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="packerName" className="text-sm font-medium">
                                  Packer <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="packerName"
                                  name="packerName"
                                  value={formData.packerName}
                                  onChange={handleInputChange}
                                  required
                                  className="border-2 focus:border-blue-500"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="importerName" className="text-sm font-medium">
                                  Importer <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="importerName"
                                  name="importerName"
                                  value={formData.importerName}
                                  onChange={handleInputChange}
                                  required
                                  className="border-2 focus:border-blue-500"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="delivery" className="text-sm font-medium">
                                Delivery Information <span className="text-red-500">*</span>
                              </Label>
                              <Textarea
                                id="delivery"
                                name="delivery"
                                value={formData.delivery}
                                onChange={handleInputChange}
                                rows={2}
                                required
                                className="border-2 focus:border-blue-500 resize-none"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="returnDetails" className="text-sm font-medium">
                                Return Details <span className="text-red-500">*</span>
                              </Label>
                              <Textarea
                                id="returnDetails"
                                name="returnDetails"
                                value={formData.returnDetails}
                                onChange={handleInputChange}
                                rows={2}
                                required
                                className="border-2 focus:border-blue-500 resize-none"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="caseOnDeliveryAvailability" className="text-sm font-medium">
                                Cash on Delivery <span className="text-red-500">*</span>
                              </Label>
                              <Select
                                value={formData.caseOnDeliveryAvailability}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, caseOnDeliveryAvailability: value }))}
                              >
                                <SelectTrigger className="border-2 focus:border-blue-500">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectItem value="true">Available</SelectItem>
                                  <SelectItem value="false">Not Available</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TabsContent>

                          <TabsContent value="images" className="space-y-4 mt-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Primary Image 1</Label>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e: any) => setPrimaryImage1(e.target.files[0])}
                                  className="border-2 focus:border-blue-500 cursor-pointer"
                                />
                                {primaryImage1 && (
                                  <p className="text-sm text-blue-600 flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    {primaryImage1.name}
                                  </p>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Primary Image 2</Label>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e: any) => setPrimaryImage2(e.target.files[0])}
                                  className="border-2 focus:border-blue-500 cursor-pointer"
                                />
                                {primaryImage2 && (
                                  <p className="text-sm text-blue-600 flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    {primaryImage2.name}
                                  </p>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Model Images</Label>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => handleModelImageUpload(e.target.files)}
                                  className="border-2 focus:border-blue-500 cursor-pointer"
                                />
                                {modelImages.length > 0 && (
                                  <div className="space-y-2 mt-3">
                                    {modelImages.map((img, idx) => (
                                      <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <Package className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                        <span className="text-sm flex-1 truncate">{img.name}</span>
                                        <Input
                                          placeholder="Description"
                                          value={modelImageDescriptions[idx]}
                                          onChange={(e) => updateModelImageDescription(idx, e.target.value)}
                                          className="max-w-xs border-blue-300"
                                        />
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeModelImage(idx)}
                                          className="hover:bg-red-100 hover:text-red-600"
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="colors" className="space-y-4 mt-6">
                            {colors.map((color, index) => (
                              <Card key={index} className="border-2 hover:border-blue-300 transition-colors">
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                  <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg font-semibold">Color {index + 1}</CardTitle>
                                    {colors.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeColor(index)}
                                        className="hover:bg-red-600"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    )}
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">Color Name</Label>
                                      <Input
                                        value={color.name}
                                        onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                                        placeholder="e.g., Crimson Red"
                                        className="border-2 focus:border-blue-500"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">Hex Code</Label>
                                      <div className="flex gap-2">
                                        <Input
                                          type="color"
                                          value={color.hex}
                                          onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
                                          className="w-20 h-10 cursor-pointer"
                                        />
                                        <Input
                                          value={color.hex}
                                          onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
                                          placeholder="#000000"
                                          className="border-2 focus:border-blue-500"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">Color Images (Max 5)</Label>
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      disabled={color.images.length >= 5}
                                      onChange={(e) => handleColorImageUpload(index, e.target.files)}
                                      className="border-2 focus:border-blue-500 cursor-pointer disabled:opacity-50"
                                    />
                                    {color.images.length > 0 && (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                                        {color.images.map((img: any, imgIdx: any): any => (
                                          <div key={imgIdx} className="relative p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                                            <span className="text-sm truncate block pr-6">{img.name}</span>
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="sm"
                                              className="absolute top-1 right-1 hover:bg-red-100 hover:text-red-600"
                                              onClick={() => removeColorImage(index, imgIdx)}
                                            >
                                              <X className="w-3 h-3" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={addColor}
                              className="w-full border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Another Color
                            </Button>
                          </TabsContent>
                        </Tabs>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                            className="border-2 hover:bg-gray-100"
                          >
                            Cancel
                          </Button>
                          <Button
  type="submit"
  disabled={loading}
  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
>
  {loading ? (
    <>
      <Spinner className="w-4 h-4 mr-2" />
      {uploadProgress || 'Adding...'}
    </>
  ) : (
    'Add Product'
  )}
</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search products by name or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-2 focus:border-blue-500 shadow-sm"
                />
              </div>
            </div>

            {/* Alert */}
            {alert.show && (
              <Alert
                className={`mb-6 border-2 ${
                  alert.type === 'error'
                    ? 'border-red-300 bg-red-50 text-red-900'
                    : 'border-green-300 bg-green-50 text-green-900'
                }`}
              >
                <AlertDescription className="font-medium">{alert.message}</AlertDescription>
              </Alert>
            )}

            {/* Products Table */}
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  All Products
                </CardTitle>
                <CardDescription className="text-base">View and manage all your products</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="font-semibold">Product</TableHead>
                        <TableHead className="font-semibold hidden md:table-cell">Category</TableHead>
                        <TableHead className="font-semibold">Price</TableHead>
                        <TableHead className="font-semibold hidden sm:table-cell">Discount</TableHead>
                        <TableHead className="font-semibold hidden lg:table-cell">Colors</TableHead>
                        <TableHead className="font-semibold">Stock</TableHead>
                        <TableHead className="font-semibold hidden xl:table-cell">Orders</TableHead>
                        <TableHead className="font-semibold hidden xl:table-cell">Reviews</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={9} className="h-64">
                            <div className="flex flex-col items-center justify-center gap-4">
                              <Spinner className="text-blue-600 text-5xl" />
                              <p className="text-gray-600 font-medium">Loading Products...</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="h-64">
                            <div className="flex flex-col items-center justify-center gap-4">
                              <div className="p-4 bg-gray-100 rounded-full">
                                <Package className="w-12 h-12 text-gray-400" />
                              </div>
                              <p className="text-gray-500 font-medium">No products found</p>
                              <p className="text-gray-400 text-sm">Add your first product to get started!</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProducts.map((product: any) => (
                          <TableRow key={product.id} className="hover:bg-blue-50/50 transition-colors">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                {product.primaryImage1 && (
                                  <img
                                    src={product.primaryImage1}
                                    alt={product.name}
                                    className="w-14 h-14 object-cover rounded-lg border-2 border-gray-200 flex-shrink-0"
                                  />
                                )}
                                <div className="min-w-0">
                                  <div className="font-semibold truncate">{product.name}</div>
                                  {product.type && (
                                    <Badge variant="secondary" className="mt-1 text-xs bg-blue-100 text-blue-700">
                                      {product.type}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge variant="outline" className="border-gray-300">
                                {product.categoryId}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-semibold">₹{parseFloat(product.originalPrice).toFixed(2)}</TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <span className="text-green-600 font-bold">₹{parseFloat(product.discountPrice).toFixed(2)}</span>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <div className="flex gap-1 items-center">
                                {product.colors?.slice(0, 3).map((color, idx) => (
                                  <div
                                    key={idx}
                                    className="w-7 h-7 rounded-full border-2 border-white shadow-md"
                                    style={{ backgroundColor: color.hex }}
                                    title={color.name}
                                  />
                                ))}
                                {product.colors?.length > 3 && (
                                  <span className="text-xs text-gray-500 ml-1 font-medium">
                                    +{product.colors.length - 3}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-2">
                                <Badge variant="outline" className="w-fit font-semibold border-blue-300 text-blue-700">
                                  {product.totalCount || 0}
                                </Badge>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setStockProduct(product);
                                    setNewStock(product.totalCount || '');
                                    setIsStockDialogOpen(true);
                                  }}
                                  className="text-xs border-2 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                                >
                                  Update
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="hidden xl:table-cell">
                              <Badge variant="outline" className="font-semibold border-orange-300 text-orange-700">
                                {product.orderCount || 0}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden xl:table-cell">
                              <Badge variant="outline" className="font-semibold border-purple-300 text-purple-700">
                                {product.reviews?.length || 0}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2 flex-wrap">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setViewProduct(product)}
                                      className="hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300 transition-all"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
                                    <DialogHeader>
                                      <DialogTitle className="text-xl font-bold">{viewProduct?.name}</DialogTitle>
                                    </DialogHeader>
                                    {viewProduct && (
                                      <div className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                          {viewProduct.primaryImage1 && (
                                            <img
                                              src={viewProduct.primaryImage1}
                                              alt="Primary 1"
                                              className="w-full h-64 object-cover rounded-lg border-2"
                                            />
                                          )}
                                          {viewProduct.primaryImage2 && (
                                            <img
                                              src={viewProduct.primaryImage2}
                                              alt="Primary 2"
                                              className="w-full h-64 object-cover rounded-lg border-2"
                                            />
                                          )}
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                          <h3 className="font-semibold mb-2 text-lg">Description</h3>
                                          <p className="text-gray-700">{viewProduct.description}</p>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg">
                                          <div>
                                            <span className="font-semibold text-blue-900">Material:</span>
                                            <span className="ml-2 text-gray-700">{viewProduct.material}</span>
                                          </div>
                                          <div>
                                            <span className="font-semibold text-blue-900">Dimensions:</span>
                                            <span className="ml-2 text-gray-700">{viewProduct.dimensions}</span>
                                          </div>
                                          <div>
                                            <span className="font-semibold text-blue-900">Weight:</span>
                                            <span className="ml-2 text-gray-700">{viewProduct.weight}kg</span>
                                          </div>
                                          <div>
                                            <span className="font-semibold text-blue-900">Origin:</span>
                                            <span className="ml-2 text-gray-700">{viewProduct.countryOfOrigin}</span>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditDialog(product)}
                                  className="hover:bg-green-100 hover:text-green-700 hover:border-green-300 transition-all"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="hover:bg-red-100 hover:text-red-700 hover:border-red-300 transition-all"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-md bg-white">
                                    <DialogHeader>
                                      <DialogTitle className="text-xl">Delete Product</DialogTitle>
                                      <DialogDescription className="text-base pt-2">
                                        Are you sure you want to delete "<span className="font-semibold">{product.name}</span>"? This action
                                        cannot be undone.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex justify-end gap-3 mt-6">
                                      <DialogTrigger asChild>
                                        <Button variant="outline" className="border-2">
                                          Cancel
                                        </Button>
                                      </DialogTrigger>
                                      <Button
                                        variant="destructive"
                                        onClick={() => deleteProduct(product.id)}
                                        disabled={loading}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        {loading ? 'Deleting...' : 'Delete Product'}
                                      </Button>
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
              </CardContent>
            </Card>

            {/* Stock Update Dialog */}
            <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
              <DialogContent className="max-w-md bg-white">
                <DialogHeader>
                  <DialogTitle className="text-xl">Update Stock</DialogTitle>
                  <DialogDescription className="text-base pt-2">
                    Update stock for: <span className="font-semibold">{stockProduct?.name}</span>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="newStock" className="font-medium">
                      New Stock Count
                    </Label>
                    <Input
                      id="newStock"
                      type="number"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      placeholder="Enter new stock count"
                      className="border-2 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={() => setIsStockDialogOpen(false)} className="border-2">
                      Cancel
                    </Button>
                    <Button onClick={updateStock} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                      {loading ? 'Updating...' : 'Update Stock'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Product Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-[95vw] sm:max-w-[85vw] lg:max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader>
                  <DialogTitle className="text-xl md:text-2xl font-bold text-gray-900">Edit Product</DialogTitle>
                  <DialogDescription className="text-sm md:text-base text-gray-600">
                    Update product details
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleEditSubmit} className="space-y-6">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 gap-2 bg-gray-100 p-1 rounded-lg">
                      <TabsTrigger value="basic" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Basic Info
                      </TabsTrigger>
                      <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Details
                      </TabsTrigger>
                      <TabsTrigger value="images" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Images
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4 mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name" className="text-sm font-medium">
                            Product Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="edit-name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="border-2 focus:border-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-type" className="text-sm font-medium">Product Type</Label>
                          <Input
                            id="edit-type"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="border-2 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-shortDescription" className="text-sm font-medium">Short Description</Label>
                        <Input
                          id="edit-shortDescription"
                          name="shortDescription"
                          value={formData.shortDescription}
                          onChange={handleInputChange}
                          className="border-2 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-description" className="text-sm font-medium">
                          Full Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="edit-description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={4}
                          required
                          className="border-2 focus:border-blue-500 resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-originalPrice" className="text-sm font-medium">
                            Original Price <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                            <Input
                              id="edit-originalPrice"
                              name="originalPrice"
                              type="number"
                              step="0.01"
                              value={formData.originalPrice}
                              onChange={handleInputChange}
                              required
                              className="border-2 focus:border-blue-500 pl-8"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-discountPrice" className="text-sm font-medium">
                            Discount Price <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                            <Input
                              id="edit-discountPrice"
                              name="discountPrice"
                              type="number"
                              step="0.01"
                              value={formData.discountPrice}
                              onChange={handleInputChange}
                              required
                              className="border-2 focus:border-blue-500 pl-8"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-totalCount" className="text-sm font-medium">
                          Stock Count <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="edit-totalCount"
                          name="totalCount"
                          type="number"
                          value={formData.totalCount}
                          onChange={handleInputChange}
                          required
                          className="border-2 focus:border-blue-500"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="details" className="space-y-4 mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-material" className="text-sm font-medium">Material</Label>
                          <Input
                            id="edit-material"
                            name="material"
                            value={formData.material}
                            onChange={handleInputChange}
                            className="border-2 focus:border-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-dimensions" className="text-sm font-medium">Dimensions</Label>
                          <Input
                            id="edit-dimensions"
                            name="dimensions"
                            value={formData.dimensions}
                            onChange={handleInputChange}
                            className="border-2 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-weight" className="text-sm font-medium">Weight (kg)</Label>
                          <Input
                            id="edit-weight"
                            name="weight"
                            type="number"
                            step="0.01"
                            value={formData.weight}
                            onChange={handleInputChange}
                            className="border-2 focus:border-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-countryOfOrigin" className="text-sm font-medium">Country of Origin</Label>
                          <Input
                            id="edit-countryOfOrigin"
                            name="countryOfOrigin"
                            value={formData.countryOfOrigin}
                            onChange={handleInputChange}
                            className="border-2 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-packageContent" className="text-sm font-medium">Package Content</Label>
                        <Textarea
                          id="edit-packageContent"
                          name="packageContent"
                          value={formData.packageContent}
                          onChange={handleInputChange}
                          rows={2}
                          className="border-2 focus:border-blue-500 resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-care" className="text-sm font-medium">Care Instructions</Label>
                        <Textarea
                          id="edit-care"
                          name="care"
                          value={formData.care}
                          onChange={handleInputChange}
                          rows={2}
                          className="border-2 focus:border-blue-500 resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-manufacturerName" className="text-sm font-medium">Manufacturer</Label>
                          <Input
                            id="edit-manufacturerName"
                            name="manufacturerName"
                            value={formData.manufacturerName}
                            onChange={handleInputChange}
                            className="border-2 focus:border-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-packerName" className="text-sm font-medium">Packer</Label>
                          <Input
                            id="edit-packerName"
                            name="packerName"
                            value={formData.packerName}
                            onChange={handleInputChange}
                            className="border-2 focus:border-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-importerName" className="text-sm font-medium">Importer</Label>
                          <Input
                            id="edit-importerName"
                            name="importerName"
                            value={formData.importerName}
                            onChange={handleInputChange}
                            className="border-2 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-delivery" className="text-sm font-medium">Delivery Information</Label>
                        <Textarea
                          id="edit-delivery"
                          name="delivery"
                          value={formData.delivery}
                          onChange={handleInputChange}
                          rows={2}
                          className="border-2 focus:border-blue-500 resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-returnDetails" className="text-sm font-medium">Return Details</Label>
                        <Textarea
                          id="edit-returnDetails"
                          name="returnDetails"
                          value={formData.returnDetails}
                          onChange={handleInputChange}
                          rows={2}
                          className="border-2 focus:border-blue-500 resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-caseOnDeliveryAvailability" className="text-sm font-medium">
                          Cash on Delivery
                        </Label>
                        <Select
                          value={formData.caseOnDeliveryAvailability}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, caseOnDeliveryAvailability: value }))}
                        >
                          <SelectTrigger className="border-2 focus:border-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="true">Available</SelectItem>
                            <SelectItem value="false">Not Available</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>

                    <TabsContent value="images" className="space-y-4 mt-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-blue-800 font-medium">
                          💡 Upload new images to replace existing ones (optional)
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Primary Image 1</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e: any) => setPrimaryImage1(e.target.files[0])}
                            className="border-2 focus:border-blue-500 cursor-pointer"
                          />
                          {primaryImage1 && (
                            <p className="text-sm text-blue-600 flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              {primaryImage1.name}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Primary Image 2</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e: any) => setPrimaryImage2(e.target.files[0])}
                            className="border-2 focus:border-blue-500 cursor-pointer"
                          />
                          {primaryImage2 && (
                            <p className="text-sm text-blue-600 flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              {primaryImage2.name}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Model Images (will replace all existing)</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleModelImageUpload(e.target.files)}
                            className="border-2 focus:border-blue-500 cursor-pointer"
                          />
                          {modelImages.length > 0 && (
                            <div className="space-y-2 mt-3">
                              {modelImages.map((img, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                  <Package className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                  <span className="text-sm flex-1 truncate">{img.name}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeModelImage(idx)}
                                    className="hover:bg-red-100 hover:text-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditDialogOpen(false);
                        setEditProduct(null);
                        resetForm();
                      }}
                      className="border-2 hover:bg-gray-100"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
                    >
                      {loading ? (
                        <>
                          <Spinner className="w-4 h-4 mr-2" />
                          Updating...
                        </>
                      ) : (
                        'Update Product'
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8"></div>
        <FooterPart />
      </div>
    )}
  </div>
  );
}