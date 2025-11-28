'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { Vendor } from '@/lib/types';
import { useAuth } from '@/lib/authContext';
import { HiOfficeBuilding } from 'react-icons/hi';
import { useRouter, usePathname } from 'next/navigation';

const VendorsPage = () => {
  const { token } = useAuth();
  const router = useRouter();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      if (!token) {
        setLoading(false);
        setError('Authentication token not found.');
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await apiRequest<Vendor[]>("/api/vendor/", "GET", null, token);
        if(data === null || data === undefined){
          setVendors([]);
          console.warn("No vendors data received");
        }else{
            setVendors(data);
            console.log("Vendors data fetched:", data);
        }
      }catch (err: any) {
        setError(err.message || 'Failed to fetch vendors.');
      }finally {
        setLoading(false);
      }
    };
    fetchVendors();
}, [token]);

if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="text-gray-500">Loading vendors...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <p className="text-red-600 font-medium">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
                <p className="text-sm text-gray-500 mt-1">Manage and track all your vendors</p>
            </div>
            {/* <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
                <HiOfficeBuilding className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Total: {vendors.length}</span>
            </div> */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
                    <HiOfficeBuilding className="h-5 w-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Total: {vendors.length}</span>
                </div>

                <button
                    onClick={() => router.push('/dashboard/vendors/create')}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Create
                </button>
            </div>
        </div>
        {/* Orders Table */}
        {vendors.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12">
                <div className="text-center">
                    <HiOfficeBuilding className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No vendors found.</p>
                </div>
            </div>
        ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {vendors.map((vendor) => (
                                <tr key={vendor._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        #{vendor._id.slice(-8).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <div>
                                            <p className="font-medium">{vendor?.name || 'N/A'}</p>
                                        </div> 
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <div>
                                            <p className="font-medium">{vendor?.email || 'N/A'}</p>
                                        </div> 
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
    </div>
);
}
export default VendorsPage;
