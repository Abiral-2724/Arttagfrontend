'use client'
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Check,
  X,
  Clock,
  Mail,
  Building2,
  Phone,
  Package,
  Calendar,
  RefreshCw
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const CorporateGiftingAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showStatusDropdown, setShowStatusDropdown] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isSearching, setIsSearching] = useState(false);
  
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ;
  const LIMIT = 10;

  // Fetch all requests with filters
  const fetchRequests = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: LIMIT.toString(),
        sortBy,
        sortOrder,
      });

      if (statusFilter !== 'ALL') {
        params.append('status', statusFilter);
      }

      const response = await fetch(`${API_BASE}/corporate/get/all/request?${params}`);
      const data = await response.json();

      if (data.success) {
        setRequests(data.data);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search by company name or email
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchRequests(1);
      setIsSearching(false);
      return;
    }

    setLoading(true);
    setIsSearching(true);
    try {
      const response = await fetch(
        `${API_BASE}/corporate/search?search=${encodeURIComponent(searchTerm.trim())}`
      );
      const data = await response.json();

      if (data.success) {
        setRequests(data.data);
        setTotal(data.count);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update request status
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/corporate/update/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the list
        if (isSearching) {
          handleSearch();
        } else {
          fetchRequests(currentPage);
        }
        setShowStatusDropdown(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Company', 'Email', 'Contact', 'Quantity', 'Status', 'Date', 'Message'];
    const csvData = requests.map(req => [
      req.name,
      req.companyName,
      req.companyEmail,
      req.contact,
      req.quantity,
      req.status,
      new Date(req.createdAt).toLocaleDateString(),
      req.askAnything || ''
    ]);

    const csv = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `corporate-requests-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  useEffect(() => {
    fetchRequests(1);
  }, [statusFilter, sortBy, sortOrder]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'PENDING':
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <Check size={14} />;
      case 'REJECTED':
        return <X size={14} />;
      case 'PENDING':
      default:
        return <Clock size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar></Navbar>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Corporate Gifting
              </h1>
              <p className="text-slate-600 mt-1">
                Manage and track all corporate gifting requests
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-slate-500">Total Requests</p>
                <p className="text-2xl font-bold text-slate-900">{total}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by company name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white px-6 py-3 pr-10 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer font-medium"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Search size={18} />
              Search
            </button>

            <button
              onClick={() => {
                setSearchTerm('');
                setIsSearching(false);
                fetchRequests(1);
              }}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Reset
            </button>

            {/* <button
              onClick={exportToCSV}
              disabled={requests.length === 0}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Download size={18} />
              Export
            </button> */}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-20">
              <Package className="mx-auto text-slate-300 mb-4" size={64} />
              <p className="text-xl font-semibold text-slate-600">No requests found</p>
              <p className="text-slate-500 mt-2">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Contact Info
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {requests.map((request) => (
                      <tr key={request.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="font-semibold text-slate-900">{request.name}</div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Mail size={14} />
                              {request.companyEmail}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone size={14} />
                              {request.contact}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Building2 size={18} className="text-slate-400" />
                            <span className="font-medium text-slate-900">{request.companyName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Package size={18} className="text-slate-400" />
                            <span className="font-semibold text-slate-900">{request.quantity}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar size={14} />
                            {new Date(request.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <button
                              onClick={() => setShowStatusDropdown(showStatusDropdown === request.id ? null : request.id)}
                              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <MoreVertical size={18} className="text-slate-600" />
                            </button>

                            {showStatusDropdown === request.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-10">
                                <button
                                  onClick={() => updateStatus(request.id, 'PENDING')}
                                  className="w-full px-4 py-2 text-left hover:bg-amber-50 flex items-center gap-2 text-amber-700 font-medium"
                                >
                                  <Clock size={16} />
                                  Mark as Pending
                                </button>
                                <button
                                  onClick={() => updateStatus(request.id, 'APPROVED')}
                                  className="w-full px-4 py-2 text-left hover:bg-emerald-50 flex items-center gap-2 text-emerald-700 font-medium"
                                >
                                  <Check size={16} />
                                  Approve
                                </button>
                                <button
                                  onClick={() => updateStatus(request.id, 'REJECTED')}
                                  className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-red-700 font-medium"
                                >
                                  <X size={16} />
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!isSearching && totalPages > 1 && (
                <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
                  <div className="text-sm text-slate-600">
                    Showing {((currentPage - 1) * LIMIT) + 1} to {Math.min(currentPage * LIMIT, total)} of {total} requests
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchRequests(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <ChevronLeft size={18} />
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => fetchRequests(i + 1)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            currentPage === i + 1
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-700 hover:bg-white border border-slate-300'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => fetchRequests(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      Next
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Request Details Expandable Section */}
        {requests.length > 0 && (
          <div className="mt-6 space-y-4">
            {requests.map((request) => (
              request.askAnything && (
                <details key={`details-${request.id}`} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <summary className="px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors font-semibold text-slate-900 flex items-center justify-between">
                    <span>Message from {request.name} - {request.companyName}</span>
                    <ChevronDown size={20} className="text-slate-400" />
                  </summary>
                  <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                    <p className="text-slate-700 leading-relaxed">{request.askAnything}</p>
                  </div>
                </details>
              )
            ))}
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showStatusDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowStatusDropdown(null)}
        />
      )}
    </div>
  );
};

export default CorporateGiftingAdmin;