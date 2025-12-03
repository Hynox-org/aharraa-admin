"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import { PopulatedOrder, OrderStatus } from '@/lib/types';
import { HiEye, HiShoppingBag, HiChevronDown } from 'react-icons/hi';

const OrdersPage = () => {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState<PopulatedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(null);

  useEffect(() => {
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

    fetchOrders();
  }, [token]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200 hover:border-green-400';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:border-yellow-400';
      case 'shipped':
      case 'on the way':
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:border-blue-400';
      case 'readyfordelivery':
        return 'bg-purple-100 text-purple-800 border-purple-200 hover:border-purple-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200 hover:border-red-400';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:border-gray-400';
    }
  };

  const baseStatuses: OrderStatus[] = [
    'readyForDelivery', 'delivered', 'cancelled'
  ] as OrderStatus[];

  const filterOptions = ['pending', 'confirmed', 'readyForDelivery', 'failed', 'delivered', 'cancelled', 'all'];

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
      setOpenStatusDropdown(null); // Close dropdown after update
    }
  };

  const toggleStatusDropdown = (orderId: string) => {
    setOpenStatusDropdown(openStatusDropdown === orderId ? null : orderId);
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(o => o.status?.toLowerCase() === statusFilter.toLowerCase());

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="text-gray-500">Loading orders...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <p className="text-red-600 font-medium">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  const changeableStatuses = getChangeableStatuses();

  return (
    <div className="space-y-6">
      {/* Header with filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track all customer orders</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
            <HiShoppingBag className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Total: {orders.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white focus:outline-none text-gray-700 focus:ring-2 focus:ring-[#3CB371]"
            >
              {filterOptions.map((st) => (
                <option key={st} value={st}>
                  {st === 'all' ? 'All Statuses' : st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <div className="text-center">
            <HiShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No orders found.</p>
            <p className="text-sm text-gray-400 mt-1">
              {statusFilter !== 'all' ? `No orders with status "${statusFilter}".` : 'Orders will appear here once customers place them.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Items</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div>
                        <p className="font-medium">{order.user?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{order.user?.email || order.user?._id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ₹{order.totalAmount?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 relative">
                      {/* ✅ INLINE STATUS DROPDOWN */}
                      <div className="relative">
                        {/* Status Pill - clickable */}
                        <button
                          onClick={() => changeableStatuses.length > 0 && toggleStatusDropdown(order._id)}
                          disabled={updatingId === order._id}
                          className={`
                            flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200
                            ${getStatusColor(order.status || '')}
                            ${updatingId === order._id ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md hover:scale-[1.02]'}
                          `}
                        >
                          <span>{order.status || 'Unknown'}</span>
                          {changeableStatuses.length > 0 && (
                            <HiChevronDown 
                              className={`h-3 w-3 transition-transform ${openStatusDropdown === order._id ? 'rotate-180' : ''}`} 
                            />
                          )}
                        </button>

                        {/* ✅ DROPDOWN MENU */}
                        {openStatusDropdown === order._id && changeableStatuses.length > 0 && (
                          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                            <div className="py-1">
                              {/* Current status if not changeable */}
                              {order.status && !changeableStatuses.includes(order.status) && (
                                <div className="px-3 py-2 text-xs text-gray-500 cursor-not-allowed">
                                  {order.status}
                                </div>
                              )}
                              {/* Changeable options */}
                              {changeableStatuses.map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handleStatusChange(order._id, status)}
                                  disabled={updatingId === order._id}
                                  className={`
                                    w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-50 transition-colors
                                    ${status.toLowerCase() === (order.status || '').toLowerCase() 
                                      ? 'bg-[#3CB371]/10 text-[#3CB371] border-r-4 border-[#3CB371]' 
                                      : 'text-gray-700 hover:text-gray-900'
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
                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/orders/${order._id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-[#3CB371] hover:text-[#2d9158] hover:underline transition-colors"
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
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
