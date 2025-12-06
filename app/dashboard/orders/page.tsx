"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import { PopulatedOrder, OrderStatus } from '@/lib/types';
import { 
  HiEye, 
  HiShoppingBag, 
  HiChevronDown, 
  HiRefresh, 
  HiFilter,
  HiX 
} from 'react-icons/hi';

const OrdersPage = () => {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState<PopulatedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const fetchOrders = async () => {
    if (!token) {
      setLoading(false);
      setError("Authentication token not found.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest<PopulatedOrder[]>("/api/admin/orders", "GET", null, token);
      setOrders(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders.");
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenStatusDropdown(null);
    if (openStatusDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openStatusDropdown]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'confirmed':
      case 'shipped':
      case 'on the way':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'readyfordelivery':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const baseStatuses: OrderStatus[] = [
    'pending', 'confirmed', 'readyForDelivery', 'delivered', 'cancelled'
  ] as OrderStatus[];

  const filterOptions = ['all', 'pending', 'confirmed', 'readyForDelivery', 'delivered', 'cancelled', 'failed'];

  const getChangeableStatuses = (): OrderStatus[] => {
    if (user?.role === 'admin') {
      return baseStatuses;
    }
    if (user?.role === 'vendor') {
      return ['readyForDelivery' as OrderStatus];
    }
    return [];
  };

  const handleStatusChange = async (orderId: string, nextStatus: string) => {
    if (!token || !nextStatus) return;

    try {
      setUpdatingId(orderId);
      
      const resp = await apiRequest<{
        message: string;
        status: OrderStatus;
        orderId: string;
      }>(`/api/admin/orders/${orderId}/status`, 'PATCH', { status: nextStatus }, token);

      setOrders(prev =>
        prev.map((order): PopulatedOrder => {
          if (order._id === orderId) {
            return {
              ...order,
              status: resp.status as OrderStatus
            };
          }
          return order;
        })
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
      setOpenStatusDropdown(null);
    }
  };

  const toggleStatusDropdown = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenStatusDropdown(openStatusDropdown === orderId ? null : orderId);
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(o => o.status?.toLowerCase() === statusFilter.toLowerCase());

  const changeableStatuses = getChangeableStatuses();

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
            <p className="text-sm text-gray-500">Loading orders...</p>
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders</h1>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-8 sm:p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiX className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load orders</h3>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchOrders}
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
      {/* Header with filter */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Manage and track all customer orders</p>
          </div>
          <button
            onClick={fetchOrders}
            className="p-2 sm:p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Refresh orders"
          >
            <HiRefresh className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>

        {/* Filters - Mobile & Desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Total Count */}
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white rounded-lg border border-gray-200 w-fit">
            <HiShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
            <span className="text-xs sm:text-sm font-semibold text-gray-700">
              Total: <span className="text-[#3CB371]">{filteredOrders.length}</span>
            </span>
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="sm:hidden flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700"
            >
              <HiFilter className="w-4 h-4" />
              Filter
              <HiChevronDown className={`w-4 h-4 transition-transform ${showMobileFilter ? 'rotate-180' : ''}`} />
            </button>

            <div className={`${showMobileFilter ? 'flex' : 'hidden'} sm:flex items-center gap-2`}>
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">Filter:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setShowMobileFilter(false);
                }}
                className="text-xs sm:text-sm border border-gray-300 rounded-lg px-3 py-1.5 sm:py-2 bg-white focus:outline-none text-gray-700 focus:ring-2 focus:ring-[#3CB371] w-full sm:w-auto"
              >
                {filterOptions.map((st) => (
                  <option key={st} value={st}>
                    {st === 'all' ? 'All Statuses' : st.charAt(0).toUpperCase() + st.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table/List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-8 sm:p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiShoppingBag className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {statusFilter !== 'all' 
                ? `No orders with status "${statusFilter}".` 
                : 'Orders will appear here once customers place them.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  {/* <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th> */}
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Items</th>
                  <th className="px-4 lg:px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 lg:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">{order.user?.name || 'N/A'}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 truncate max-w-[200px]">
                          {order.user?.email || order.user?._id}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-xs sm:text-sm font-bold text-gray-900">
                      ₹{order.totalAmount?.toLocaleString() || '0'}
                    </td>
                    <td className="px-4 lg:px-6 py-4 relative" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => changeableStatuses.length > 0 && toggleStatusDropdown(order._id, e)}
                          disabled={updatingId === order._id}
                          className={`
                            flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200
                            ${getStatusColor(order.status || '')}
                            ${updatingId === order._id ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md cursor-pointer'}
                          `}
                        >
                          <span>{order.status || 'Unknown'}</span>
                          {changeableStatuses.length > 0 && (
                            <HiChevronDown 
                              className={`h-3 w-3 transition-transform ${openStatusDropdown === order._id ? 'rotate-180' : ''}`} 
                            />
                          )}
                        </button>

                        {openStatusDropdown === order._id && changeableStatuses.length > 0 && (
                          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                            <div className="py-1">
                              {changeableStatuses.map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handleStatusChange(order._id, status)}
                                  disabled={updatingId === order._id}
                                  className={`
                                    w-full text-left px-3 py-2 text-xs font-medium transition-colors
                                    ${status.toLowerCase() === (order.status || '').toLowerCase() 
                                      ? 'bg-[#3CB371]/10 text-[#3CB371] border-l-4 border-[#3CB371]' 
                                      : 'text-gray-700 hover:bg-gray-50'
                                    }
                                    ${updatingId === order._id ? 'opacity-70 cursor-not-allowed' : ''}
                                  `}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-xs sm:text-sm text-gray-600">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/orders/${order._id}`}
                        className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#3CB371] hover:text-[#2d9158] hover:underline transition-colors"
                      >
                        <HiEye className="h-4 w-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <div key={order._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">{order.user?.name || 'N/A'}</p>
                  </div>
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      // onClick={(e) => changeableStatuses.length > 0 && toggleStatusDropdown(order._id, e)}
                      disabled={updatingId === order._id}
                      className={`
                        flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-full border
                        ${getStatusColor(order.status || '')}
                        ${updatingId === order._id ? 'opacity-70' : ''}
                      `}
                    >
                      <span>{order.status}</span>
                      {changeableStatuses.length > 0 && <HiChevronDown className="h-3 w-3" />}
                    </button>

                    {openStatusDropdown === order._id && changeableStatuses.length > 0 && (
                      <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                        <div className="py-1">
                          {changeableStatuses.map((status) => (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(order._id, status)}
                              className={`
                                w-full text-left px-3 py-2 text-xs font-medium
                                ${status === order.status ? 'bg-[#3CB371]/10 text-[#3CB371]' : 'text-gray-700 hover:bg-gray-50'}
                              `}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-[10px] text-gray-500">Amount</p>
                      <p className="text-sm font-bold text-gray-900">₹{order.totalAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500">Items</p>
                      <p className="text-sm font-semibold text-gray-700">{order.items?.length || 0}</p>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/orders/${order._id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#3CB371] hover:text-[#2d9158]"
                  >
                    <HiEye className="h-4 w-4" />
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
