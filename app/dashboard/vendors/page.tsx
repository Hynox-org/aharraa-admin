'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { Vendor } from '@/lib/types';
import { useAuth } from '@/lib/authContext';
import { 
  HiOfficeBuilding, 
  HiRefresh, 
  HiX, 
  HiPlus,
  HiSearch,
  HiMail,
  HiPhone,
  HiLocationMarker
} from 'react-icons/hi';
import { useRouter } from 'next/navigation';

const VendorsPage = () => {
  const { token } = useAuth();
  const router = useRouter();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchVendors = async () => {
    if (!token) {
      setLoading(false);
      setError('Authentication token not found.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest<Vendor[]>("/api/admin/vendors", "GET", null, token);
      
      if (data === null || data === undefined) {
        setVendors([]);
        console.warn("No vendors data received");
      } else {
        setVendors(data);
        console.log("Vendors data fetched:", data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vendors.');
      console.error("Failed to fetch vendors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [token]);

  // Filter vendors based on search query
  const filteredVendors = useMemo(() => {
    if (!searchQuery.trim()) return vendors;
    
    const query = searchQuery.toLowerCase();
    return vendors.filter(vendor => 
      vendor.name?.toLowerCase().includes(query) ||
      vendor.email?.toLowerCase().includes(query) ||
      vendor._id?.toLowerCase().includes(query)
    );
  }, [vendors, searchQuery]);

  // Loading State
  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-48 bg-gray-200 rounded mt-2 animate-pulse"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-8 sm:p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#3CB371] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-gray-500">Loading vendors...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Vendors</h1>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-8 sm:p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiX className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load vendors</h3>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchVendors}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#3CB371] text-white rounded-lg hover:bg-[#35a065] transition-colors"
            >
              <HiRefresh className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Vendors</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Manage and track all your vendors</p>
          </div>
          <button
            onClick={fetchVendors}
            className="p-2 sm:p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Refresh vendors"
          >
            <HiRefresh className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-black" />
            <input
              type="text"
              placeholder="Search vendors by name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-black w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <HiX className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Total Count */}
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white rounded-lg border border-gray-200">
              <HiOfficeBuilding className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                {filteredVendors.length} {filteredVendors.length === vendors.length ? 'Total' : `of ${vendors.length}`}
              </span>
            </div>

            {/* Create Button */}
            <button
              onClick={() => router.push('/dashboard/vendors/create')}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#3CB371] rounded-lg hover:bg-[#35a065] focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:ring-offset-2 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <HiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Create Vendor</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vendors Table/List */}
      {filteredVendors.length === 0 ? (
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-8 sm:p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOfficeBuilding className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No matching vendors found' : 'No vendors found'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-4">
              {searchQuery 
                ? 'Try adjusting your search query' 
                : 'Create your first vendor to get started'}
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="text-sm font-medium text-[#3CB371] hover:text-[#2d9158]"
              >
                Clear search
              </button>
            ) : (
              <button
                onClick={() => router.push('/dashboard/vendors/create')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#3CB371] text-white text-sm font-semibold rounded-lg hover:bg-[#35a065] transition-colors"
              >
                <HiPlus className="w-4 h-4" />
                Create First Vendor
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Vendor</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {vendor.name?.charAt(0).toUpperCase() || 'V'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{vendor?.name || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <HiMail className="h-4 w-4 text-gray-400" />
                          <span className="truncate max-w-[250px]">{vendor?.email || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          #{vendor._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredVendors.map((vendor) => (
              <div 
                key={vendor._id} 
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all"
              >
                {/* Vendor Info */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-base shadow-md flex-shrink-0">
                    {vendor.name?.charAt(0).toUpperCase() || 'V'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{vendor?.name || 'N/A'}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate">
                      <HiMail className="h-3 w-3 flex-shrink-0" />
                      {vendor?.email || 'No email'}
                    </p>
                  </div>
                </div>

                {/* ID */}
                <div className="pt-3 border-t border-gray-100">
                  <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    ID: #{vendor._id.slice(-8).toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VendorsPage;
