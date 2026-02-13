'use client'
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Clock,
  Image as ImageIcon,
  Save,
  X,
  FileText,
  Filter,
  MoreVertical,
  Loader2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navbar from '@/components/Navbar';

const AdminBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterPublished, setFilterPublished] = useState('all');
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    authorName: '',
    metaTitle: '',
    metaDescription: '',
  });
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Debounced search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        setCurrentPage(1); // Reset to page 1 when searching
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterAuthor, filterPublished, searchTerm]);

  // Fetch blogs when page or filters change, or when search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      searchBlogs();
    } else {
      fetchBlogs();
    }
  }, [currentPage, filterAuthor, filterPublished, searchTerm]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 9,
      });

      if (filterAuthor) params.append('author', filterAuthor);
      if (filterPublished !== 'all') params.append('published', filterPublished);

      // ✅ Fixed: Actually use the params in the URL
      const response = await fetch(`${API_BASE}/blog/get/all/blogs?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setBlogs(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalBlogs(data.pagination.total);
      }
    } catch (error) {
      showAlert('Failed to fetch blogs', 'error');
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchBlogs = async () => {
    if (!searchTerm.trim()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/blog/search/blog?search=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();

      if (data.success) {
        setBlogs(data.data);
        setTotalPages(1);
        setTotalBlogs(data.count);
      } else {
        setBlogs([]);
        showAlert(data.message, 'error');
      }
    } catch (error) {
      showAlert('Search failed', 'error');
      console.error('Error searching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showAlert('Image size should be less than 5MB', 'error');
        return;
      }
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.content.trim()) errors.content = 'Content is required';
    if (!formData.authorName.trim()) errors.authorName = 'Author name is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      authorName: '',
      metaTitle: '',
      metaDescription: '',
    });
    setCoverImageFile(null);
    setCoverImagePreview(null);
    setFormErrors({});
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    setSubmitLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('excerpt', formData.excerpt);
      formDataToSend.append('authorName', formData.authorName);
      formDataToSend.append('metaTitle', formData.metaTitle || formData.title);
      formDataToSend.append('metaDescription', formData.metaDescription || formData.excerpt);
      
      if (coverImageFile) {
        formDataToSend.append('coverImage', coverImageFile);
      }

      const response = await fetch(`${API_BASE}/blog/add/blog`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        showAlert('Blog created successfully!', 'success');
        setIsCreateDialogOpen(false);
        resetForm();
        fetchBlogs();
      } else {
        showAlert(data.message || 'Failed to create blog', 'error');
      }
    } catch (error) {
      showAlert('Failed to create blog', 'error');
      console.error('Error creating blog:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!validateForm()) return;

    setSubmitLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('id', selectedBlog.id);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('excerpt', formData.excerpt);
      formDataToSend.append('authorName', formData.authorName);
      formDataToSend.append('metaTitle', formData.metaTitle);
      formDataToSend.append('metaDescription', formData.metaDescription);
      
      if (coverImageFile) {
        formDataToSend.append('coverImage', coverImageFile);
      }

      const response = await fetch(`${API_BASE}/blog/edit/blog`, {
        method: 'PATCH',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        showAlert('Blog updated successfully!', 'success');
        setIsEditDialogOpen(false);
        resetForm();
        setSelectedBlog(null);
        fetchBlogs();
      } else {
        showAlert(data.message || 'Failed to update blog', 'error');
      }
    } catch (error) {
      showAlert('Failed to update blog', 'error');
      console.error('Error updating blog:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    setSubmitLoading(true);
    try {
      const response = await fetch(`${API_BASE}/blog/delete/blog`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedBlog.id }),
      });

      const data = await response.json();

      if (data.success) {
        showAlert('Blog deleted successfully!', 'success');
        setIsDeleteDialogOpen(false);
        setSelectedBlog(null);
        fetchBlogs();
      } else {
        showAlert(data.message || 'Failed to delete blog', 'error');
      }
    } catch (error) {
      showAlert('Failed to delete blog', 'error');
      console.error('Error deleting blog:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const openEditDialog = (blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || '',
      authorName: blog.authorName,
      metaTitle: blog.metaTitle || '',
      metaDescription: blog.metaDescription || '',
    });
    setCoverImagePreview(blog.coverImage);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (blog) => {
    setSelectedBlog(blog);
    setIsDeleteDialogOpen(true);
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 5000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const BlogFormFields = () => (
    <div className="space-y-6">
      {/* Cover Image Upload */}
      <div className="space-y-2">
        <Label>Cover Image</Label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
          </div>
        </div>
        {coverImagePreview && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden border">
            <img
              src={coverImagePreview}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => {
                setCoverImageFile(null);
                setCoverImagePreview(null);
              }}
              className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Enter blog title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={formErrors.title ? 'border-red-500' : ''}
        />
        {formErrors.title && (
          <p className="text-sm text-red-500">{formErrors.title}</p>
        )}
      </div>

      {/* Author Name */}
      <div className="space-y-2">
        <Label htmlFor="authorName">
          Author Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="authorName"
          placeholder="Enter author name"
          value={formData.authorName}
          onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
          className={formErrors.authorName ? 'border-red-500' : ''}
        />
        {formErrors.authorName && (
          <p className="text-sm text-red-500">{formErrors.authorName}</p>
        )}
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          placeholder="Brief description of the blog post"
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          rows={3}
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content">
          Content <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="content"
          placeholder="Write your blog content here (HTML supported)"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={12}
          className={formErrors.content ? 'border-red-500' : ''}
        />
        {formErrors.content && (
          <p className="text-sm text-red-500">{formErrors.content}</p>
        )}
      </div>

      {/* SEO Section */}
      <div className="border-t pt-6 space-y-4">
        <h3 className="text-lg font-semibold">SEO Settings (Optional)</h3>
        
        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            placeholder="SEO title (defaults to blog title)"
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea
            id="metaDescription"
            placeholder="SEO description (defaults to excerpt)"
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar></Navbar>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Alert */}
          {alert.show && (
            <Alert
              className={`${
                alert.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <FileText className="text-purple-600" size={32} />
                  Blog Management
                </h1>
                <p className="text-gray-500 mt-1">
                  Create, edit, and manage your blog posts
                </p>
              </div>
              <Button
                onClick={() => {
                  resetForm();
                  setIsCreateDialogOpen(true);
                }}
                className="bg-blue-800 text-white"
              >
                <Plus size={20} className="mr-2" />
                Create New Blog
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="mt-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search blogs by title... (real-time search)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>

              <div className="flex gap-2">
                {/* ✅ Added: Published Status Filter */}
                <Select value={filterPublished} onValueChange={setFilterPublished}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Posts</SelectItem>
                    <SelectItem value="true">Published</SelectItem>
                    <SelectItem value="false">Drafts</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterAuthor('');
                    setFilterPublished('all');
                    setCurrentPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <FileText size={16} />
                <strong>{totalBlogs}</strong> Total Posts
              </span>
              <span>•</span>
              <span>
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </span>
            </div>
          </div>

          {/* Blog Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : blogs.length === 0 ? (
            <Card className="text-center py-20">
              <CardContent>
                <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No blogs found
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm
                    ? 'Try adjusting your search criteria'
                    : 'Get started by creating your first blog post'}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => {
                      resetForm();
                      setIsCreateDialogOpen(true);
                    }}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    <Plus size={20} className="mr-2" />
                    Create Your First Blog
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <Card
                    key={blog.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    {/* Cover Image */}
                    {blog.coverImage && (
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>
                    )}

                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="text-lg line-clamp-2">
                          {blog.title}
                        </CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(blog)}>
                              <Edit size={16} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(blog)}
                              className="text-red-600"
                            >
                              <Trash2 size={16} className="mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <CardDescription className="line-clamp-2">
                        {blog.excerpt || 'No excerpt available'}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User size={14} />
                        <span>{blog.authorName}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} />
                        <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {blog.publishedAt ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Published
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                            Draft
                          </Badge>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="border-t pt-4">
                      <div className="flex gap-2 w-full">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => openEditDialog(blog)}
                        >
                          <Edit size={16} className="mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-red-600 hover:text-red-700"
                          onClick={() => openDeleteDialog(blog)}
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? 'default' : 'outline'}
                            onClick={() => setCurrentPage(pageNum)}
                            className={
                              currentPage === pageNum
                                ? 'bg-purple-600 hover:bg-purple-700'
                                : ''
                            }
                          >
                            {pageNum}
                          </Button>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return <span key={pageNum}>...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Create Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-amber-100">
              <DialogHeader>
                <DialogTitle>Create New Blog Post</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new blog post
                </DialogDescription>
              </DialogHeader>

              <BlogFormFields />

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}
                  disabled={submitLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={submitLoading}
                  className="bg-blue-700 text-white"
                >
                  {submitLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2 text-white" />
                      Create Blog
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-amber-100">
              <DialogHeader>
                <DialogTitle>Edit Blog Post</DialogTitle>
                <DialogDescription>
                  Update the details of your blog post
                </DialogDescription>
              </DialogHeader>

              <BlogFormFields />

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    resetForm();
                    setSelectedBlog(null);
                  }}
                  disabled={submitLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEdit}
                  disabled={submitLoading}
                  className="bg-blue-700 text-white"
                >
                  {submitLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Update Blog
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className='bg-amber-50'>
              <DialogHeader>
                <DialogTitle>Delete Blog Post</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{selectedBlog?.title}"? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedBlog(null);
                  }}
                  disabled={submitLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={submitLoading}
                  className='bg-blue-700 text-white'
                >
                  {submitLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogPage;