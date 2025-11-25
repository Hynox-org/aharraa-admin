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
  HiShoppingBag
} from 'react-icons/hi';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [order, setOrder] = useState<PopulatedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    if (id) {
      fetchOrderDetails();
    }
  }, [id, token]);

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shipped':
      case 'on the way':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="text-gray-500">Loading order details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <HiArrowLeft className="h-5 w-5" />
          Back
        </button>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <p className="text-red-600 font-medium">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <HiArrowLeft className="h-5 w-5" />
          Back
        </button>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <p className="text-gray-500 text-center">No order found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <HiArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <p className="text-sm text-gray-500 mt-1">#{order._id.slice(-8).toUpperCase()}</p>
          </div>
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded border capitalize ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      {/* Order Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Customer Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <HiUser className="h-5 w-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Customer</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-medium text-gray-900">{order.user?.name || 'N/A'}</p>
            <p className="text-gray-600 flex items-center gap-2">
              <HiMail className="h-4 w-4" />
              {order.user?.email || 'N/A'}
            </p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <HiCreditCard className="h-5 w-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Payment</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-2xl font-bold text-[#3CB371]">₹{order.totalAmount?.toLocaleString() || '0'}</p>
            <p className="text-gray-600">
              Status: <span className="font-medium">{order.paymentDetails?.status || 'N/A'}</span>
            </p>
            {order.paymentSessionId && (
              <p className="text-xs text-gray-500 truncate" title={order.paymentSessionId}>
                Session: {order.paymentSessionId}
              </p>
            )}
          </div>
        </div>

        {/* Order Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <HiCalendar className="h-5 w-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Timeline</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-gray-600">
              Created: <span className="font-medium">{formatDate(order.createdAt)}</span>
            </p>
            <p className="text-gray-600">
              Updated: <span className="font-medium">{formatDate(order.updatedAt)}</span>
            </p>
            <p className="text-gray-600">
              Email Sent: <span className="font-medium">{order.isConfirmationEmailSent ? 'Yes' : 'No'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Delivery Addresses */}
      {order.deliveryAddresses && Object.keys(order.deliveryAddresses).length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <HiLocationMarker className="h-5 w-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Delivery Addresses</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(order.deliveryAddresses).map(([mealCategory, address]) => (
              <div key={mealCategory} className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900 mb-2 capitalize">{mealCategory}</p>
                <p className="text-sm text-gray-600">
                  {address.street}, {address.city}, {address.zip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoice */}
      {order.invoiceUrl && (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiDocumentText className="h-5 w-5 text-gray-400" />
              <h3 className="font-semibold text-gray-900">Invoice</h3>
            </div>
            <a 
              href={order.invoiceUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm font-medium text-[#3CB371] hover:text-[#2d9158]"
            >
              View Invoice →
            </a>
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <HiShoppingBag className="h-5 w-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Order Items ({order.items?.length || 0})</h3>
          </div>
        </div>

        {order.items && order.items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No items in this order.</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {order.items?.map((item, index) => (
              <div key={index} className="p-6">
                {/* Item Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.plan?.name || 'N/A'}</h4>
                    <p className="text-sm text-gray-500 mt-1">Vendor: {item.vendor?.name || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">₹{item.itemTotalPrice?.toFixed(2) || '0.00'}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>

                {/* Item Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Start Date:</span> {new Date(item.startDate).toLocaleDateString('en-IN')}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">End Date:</span> {new Date(item.endDate).toLocaleDateString('en-IN')}
                    </p>
                    {item.selectedMealTimes && item.selectedMealTimes.length > 0 && (
                      <p className="text-gray-600">
                        <span className="font-medium">Meal Times:</span> {item.selectedMealTimes.join(', ')}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    {item.skippedDates && item.skippedDates.length > 0 && (
                      <p className="text-gray-600">
                        <span className="font-medium">Skipped Dates:</span> {item.skippedDates.map(date => new Date(date).toLocaleDateString('en-IN')).join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Person Details */}
                {item.personDetails && item.personDetails.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 mb-2">Person Details:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {item.personDetails.map((person, pIdx) => (
                        <div key={pIdx} className="text-sm text-gray-600">
                          • {person.name} ({person.phoneNumber})
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
