"use client";

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import { PopulatedOrder } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import { 
  HiArrowLeft, 
  HiUser, 
  HiMail, 
  HiCreditCard, 
  HiLocationMarker, 
  HiCalendar,
  HiDocumentText,
  HiShoppingBag,
  HiRefresh,
  HiX,
  HiCheckCircle,
  HiPhone
} from 'react-icons/hi';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [order, setOrder] = useState<PopulatedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = async () => {
    if (!token) {
      setLoading(false);
      setError("Authentication token not found.");
      return;
    }
    if (!id) {
      setLoading(false);
      setError("Order ID not provided.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest<PopulatedOrder>(`/api/admin/orders/${id}`, "GET", null, token);
      setOrder(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch order details.");
      console.error("Failed to fetch order details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id, token]);

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
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

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatShortDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-8 sm:p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#3CB371] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-gray-500">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 py-2 text-sm sm:text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <HiArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          Back
        </button>
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-8 sm:p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiX className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load order</h3>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchOrderDetails}
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

  // No Order State
  if (!order) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 py-2 text-sm sm:text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <HiArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          Back
        </button>
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-8 sm:p-12">
          <div className="text-center">
            <HiShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No order found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => router.back()}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <HiArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Order Details</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">#{order._id.slice(-8).toUpperCase()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold rounded-full border capitalize ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
          <button
            onClick={fetchOrderDetails}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Refresh"
          >
            <HiRefresh className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Order Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Customer Info */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <HiUser className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Customer</h3>
          </div>
          <div className="space-y-2 text-xs sm:text-sm">
            <p className="font-semibold text-gray-900">{order.user?.name || 'N/A'}</p>
            <p className="text-gray-600 flex items-center gap-1.5">
              <HiMail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">{order.user?.email || 'N/A'}</span>
            </p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-green-100 flex items-center justify-center">
              <HiCreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Payment</h3>
          </div>
          <div className="space-y-2 text-xs sm:text-sm">
            <p className="text-xl sm:text-2xl font-bold text-[#3CB371]">₹{order.totalAmount?.toLocaleString() || '0'}</p>
            <p className="text-gray-600">
              Status: <span className="font-semibold capitalize">{order.paymentDetails?.status || 'N/A'}</span>
            </p>
            {order.paymentSessionId && (
              <p className="text-[10px] sm:text-xs text-gray-500 truncate" title={order.paymentSessionId}>
                Session: {order.paymentSessionId.slice(0, 20)}...
              </p>
            )}
          </div>
        </div>

        {/* Order Info */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-purple-100 flex items-center justify-center">
              <HiCalendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Timeline</h3>
          </div>
          <div className="space-y-2 text-xs sm:text-sm">
            <p className="text-gray-600">
              Created: <span className="font-medium">{formatDate(order.createdAt)}</span>
            </p>
            <p className="text-gray-600">
              Updated: <span className="font-medium">{formatDate(order.updatedAt)}</span>
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              {order.isConfirmationEmailSent ? (
                <>
                  <HiCheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-medium">Email Sent</span>
                </>
              ) : (
                <span className="text-gray-500">Email Not Sent</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Addresses */}
      {order.deliveryAddresses && Object.keys(order.deliveryAddresses).length > 0 && (
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-100 flex items-center justify-center">
              <HiLocationMarker className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Delivery Addresses</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {Object.entries(order.deliveryAddresses).map(([mealCategory, address]) => (
              <div key={mealCategory} className="p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100 hover:border-gray-300 transition-colors">
                <p className="font-semibold text-sm sm:text-base text-gray-900 mb-2 capitalize flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3CB371]"></span>
                  {mealCategory}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {address.street}, {address.city}, {address.zip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoice */}
      {order.invoiceUrl && (
        <div className="bg-gradient-to-r from-green-50 to-white rounded-lg sm:rounded-xl border border-green-200 p-4 sm:p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-green-100 flex items-center justify-center">
                <HiDocumentText className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Invoice Available</h3>
            </div>
            <a 
              href={order.invoiceUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#3CB371] hover:text-[#2d9158] transition-colors"
            >
              View Invoice
              <HiArrowLeft className="w-4 h-4 rotate-180" />
            </a>
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <HiShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">
              Order Items ({order.items?.length || 0})
            </h3>
          </div>
        </div>

        {order.items && order.items.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <HiShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-500">No items in this order.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {order.items?.map((item, index) => (
              <div key={index} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                {/* Item Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <h4 className="text-sm sm:text-base font-bold text-gray-900">{item.plan?.name || 'N/A'}</h4>
                    {item.menu?.name && (
                      <p className="text-xs sm:text-sm text-gray-700 mt-1">{item.menu.name}</p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Vendor: <span className="font-medium">{item.vendor?.name || 'N/A'}</span>
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-base sm:text-lg font-bold text-gray-900">
                      ₹{item.itemTotalPrice?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>

                {/* Item Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="space-y-1.5 sm:space-y-2">
                    <p className="text-gray-600">
                      <span className="font-semibold">Start:</span> {formatShortDate(item.startDate)}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">End:</span> {formatShortDate(item.endDate)}
                    </p>
                    {item.selectedMealTimes && item.selectedMealTimes.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.selectedMealTimes.map((mealTime, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] sm:text-xs font-medium"
                          >
                            {mealTime}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    {item.skippedDates && item.skippedDates.length > 0 && (
                      <div>
                        <p className="font-semibold text-gray-700 mb-1">Skipped Dates:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.skippedDates.map((date, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] sm:text-xs"
                            >
                              {formatShortDate(date)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Person Details */}
                {item.personDetails && item.personDetails.length > 0 && (
                  <div className="mt-4 p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100">
                    <p className="font-semibold text-xs sm:text-sm text-gray-900 mb-3 flex items-center gap-2">
                      <HiUser className="w-4 h-4" />
                      Person Details
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {item.personDetails.map((person, pIdx) => (
                        <div 
                          key={pIdx} 
                          className="flex items-center gap-2 p-2 rounded bg-white border border-gray-100"
                        >
                          <div className="w-6 h-6 rounded-full bg-[#3CB371] flex items-center justify-center text-white text-xs font-bold">
                            {pIdx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                              {person.name}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-600 flex items-center gap-1">
                              <HiPhone className="w-3 h-3" />
                              {person.phoneNumber}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;
