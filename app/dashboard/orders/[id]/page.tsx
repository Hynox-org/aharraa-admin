"use client";

import React, { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/lib/authContext";
import { PopulatedOrderWithRefunds } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
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
  HiPhone,
  HiCurrencyRupee,
} from "react-icons/hi";
import { toast } from "sonner";

type RefundPreview = {
  orderId: string;
  suggestedRefundAmount: number;
  consumedAmount: number;
  consumedMealsCount: number;
  totalAmount: number;
  currency: string;
  canFullRefund: boolean;
  message?: string;
};

const OrderDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [order, setOrder] = useState<PopulatedOrderWithRefunds | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refund states
  const [refundPreview, setRefundPreview] = useState<RefundPreview | null>(null);
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [isRefundLoading, setIsRefundLoading] = useState(false);
  const [refundError, setRefundError] = useState<string | null>(null);
  const [refundSuccess, setRefundSuccess] = useState<string | null>(null);
  const [refundNote, setRefundNote] = useState<string>("");
  const [showRefundPanel, setShowRefundPanel] = useState(false);

  const canShowRefundButton = () => {
    return order?.status === "cancelled";
  };

  const getActiveRefundCount = () => {
    if (!order?.refunds) return 0;
    return order.refunds.filter((r) =>
      ["PENDING", "SUCCESS", "ONHOLD"].includes(r.status)
    ).length;
  };

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
      const data = await apiRequest<PopulatedOrderWithRefunds>(
        `/api/admin/orders/${id}`,
        "GET",
        null,
        token
      );
      setOrder(data);

      // Reset refund states when order changes
      if (data.refunds && data.refunds.length > 0) {
        setRefundPreview(null);
        setRefundAmount("");
        setShowRefundPanel(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch order details.");
      console.error("Failed to fetch order details:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRefundPreview = async () => {
    if (!token || !id) return;
    try {
      setIsRefundLoading(true);
      setRefundError(null);
      setRefundSuccess(null);

      const data = await apiRequest<RefundPreview>(
        `/api/admin/orders/${id}/refund/calculate`,
        "GET",
        null,
        token
      );
      toast(data?.message);
      setRefundPreview(data);
      setRefundAmount(data.suggestedRefundAmount.toFixed(2));
      setShowRefundPanel(true);
    } catch (err: any) {
      console.error("Failed to fetch refund preview", err);
      toast("Error: " + (err.message || "Failed to calculate refund"));
      setRefundError(err.message || "Failed to fetch refund preview");
      setShowRefundPanel(false);
    } finally {
      setIsRefundLoading(false);
    }
  };

  const handleProceedRefund = async () => {
    if (!token || !id) return;

    const numericAmount = parseFloat(refundAmount);
    if (!numericAmount || numericAmount <= 0) {
      setRefundError("Refund amount must be greater than zero");
      return;
    }

    try {
      setIsRefundLoading(true);
      setRefundError(null);
      setRefundSuccess(null);

      const body = {
        amount: numericAmount,
        note: refundNote,
      };

      const data = await apiRequest<{
        message: string;
        refund: any;
      }>(`/api/admin/orders/${id}/refund/process`, "POST", body, token);

      setTimeout(async () => {
        setRefundSuccess(data.message || "Refund initiated successfully");
        setRefundPreview(null);
        setRefundAmount("");
        setRefundNote("");
        await fetchOrderDetails();
      }, 5000);
    } catch (err: any) {
      console.error("Failed to create refund", err);
      toast("Error: " + (err.message || "Failed to create refund"));
      setRefundError(err.message || "Failed to create refund");
    } finally {
      setIsRefundLoading(false);
    }
  };

  const syncRefundDetails = async () => {
    if (!token || !id) return;
    try {
      const data = await apiRequest<{ refunds: any[] }>(
        `/api/admin/orders/${id}/sync-refunds`,
        "POST",
        {},
        token
      );

      if (data && data.refunds) {
        setOrder((prev) => (prev ? { ...prev, refunds: data.refunds } : null));
      }
    } catch (err) {
      console.error("Failed to sync refunds with gateway:", err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
      syncRefundDetails();
    }
  }, [id, token]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "confirmed":
      case "shipped":
      case "on the way":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "readyfordelivery":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatShortDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleCancelRefund = async (refund: any) => {
    toast("Prefer Merchant Dashboard for cancellation...!");
  };

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-8 sm:p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#3CB371] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-gray-500">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to load order
            </h3>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <button
              onClick={() => {
                fetchOrderDetails();
                syncRefundDetails();
              }}
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

  const hasRefunds = order.refunds && order.refunds.length > 0;
  const activeRefundCount = getActiveRefundCount();

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => router.back()}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <HiArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <span
                className={`px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full border capitalize ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
              {order.paymentDetails?.status && (
                <span className="px-2 py-1 text-[10px] sm:text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                  Payment:{" "}
                  <span className="font-semibold capitalize">
                    {order.paymentDetails.status}
                  </span>
                </span>
              )}
            </div>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Created on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canShowRefundButton() && (
            <button
              onClick={fetchRefundPreview}
              className="px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg border-2 border-red-300 text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isRefundLoading}
            >
              {isRefundLoading ? (
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-red-300 border-t-transparent rounded-full animate-spin" />
                  Calculating...
                </span>
              ) : (
                "Refund"
              )}
            </button>
          )}

          {activeRefundCount > 0 && (
            <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full font-medium">
              {activeRefundCount} Active
            </span>
          )}

          <button
            onClick={() => {
              fetchOrderDetails();
              syncRefundDetails();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Refresh"
          >
            <HiRefresh className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Primary summary row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4 sm:gap-5">
        {/* Left column: customer + address + timeline */}
        <div className="space-y-4 sm:space-y-5">
          {/* Customer + Payment cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {/* Customer */}
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                    <HiUser className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                    Customer
                  </h3>
                </div>
              </div>
              <div className="space-y-2 text-xs sm:text-sm">
                <p className="font-semibold text-gray-900">
                  {order.user?.name || "N/A"}
                </p>
                <p className="text-gray-600 flex items-center gap-1.5">
                  <HiMail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{order.user?.email || "N/A"}</span>
                </p>
                {order.user?.phoneNumber && (
                  <p className="text-gray-600 flex items-center gap-1.5">
                    <HiPhone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>{order.user.phoneNumber}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-green-100 flex items-center justify-center">
                    <HiCreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                    Payment
                  </h3>
                </div>
              </div>
              <div className="space-y-2 text-xs sm:text-sm">
                <p className="text-xl sm:text-2xl font-bold text-[#3CB371]">
                  ₹{order.totalAmount?.toLocaleString() || "0"}
                </p>
                <p className="text-gray-600">
                  Status:{" "}
                  <span className="font-semibold capitalize">
                    {order.paymentDetails?.status || "N/A"}
                  </span>
                </p>
                {order.paymentSessionId && (
                  <p
                    className="text-[10px] sm:text-xs text-gray-500 truncate"
                    title={order.paymentSessionId}
                  >
                    Session: {order.paymentSessionId.slice(0, 20)}...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Timeline + invoice */}
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-3 sm:gap-4">
            {/* Timeline */}
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                  <HiCalendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                  Timeline
                </h3>
              </div>
              <div className="space-y-2 text-xs sm:text-sm">
                <p className="text-gray-600">
                  Created:{" "}
                  <span className="font-medium">{formatDate(order.createdAt)}</span>
                </p>
                <p className="text-gray-600">
                  Updated:{" "}
                  <span className="font-medium">{formatDate(order.updatedAt)}</span>
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  {order.isConfirmationEmailSent ? (
                    <>
                      <HiCheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-700 font-medium">
                        Confirmation email sent
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-500">Confirmation email not sent</span>
                  )}
                </div>
              </div>
            </div>

            {/* Invoice */}
            {order.invoiceUrl && (
              <div className="bg-gradient-to-r from-green-50 to-white rounded-lg sm:rounded-xl border border-green-200 p-4 sm:p-5 hover:shadow-md transition-all">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-green-100 flex items-center justify-center">
                      <HiDocumentText className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                        Invoice
                      </h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        View or download invoice for this order
                      </p>
                    </div>
                  </div>
                  <a
                    href={order.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#3CB371] hover:text-[#2d9158] transition-colors"
                  >
                    View
                    <HiArrowLeft className="w-4 h-4 rotate-180" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Delivery addresses */}
          {order.deliveryAddresses &&
            Object.keys(order.deliveryAddresses).length > 0 && (
              <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                      <HiLocationMarker className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                      Delivery addresses
                    </h3>
                  </div>
                  <span className="text-[11px] sm:text-xs text-gray-500">
                    {Object.keys(order.deliveryAddresses).length} categories
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {Object.entries(order.deliveryAddresses).map(
                    ([mealCategory, address]) => (
                      <div
                        key={mealCategory}
                        className="p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100 hover:border-gray-300 transition-colors"
                      >
                        <p className="font-semibold text-sm sm:text-base text-gray-900 mb-2 capitalize flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#3CB371]" />
                          {mealCategory}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          {address.street}, {address.city}, {address.zip}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </div>

        {/* Right column: refund section */}
        <div className="space-y-4 sm:space-y-5">
          {/* Refund panel */}
          {showRefundPanel && refundPreview && (
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg sm:rounded-xl border-2 border-red-200 p-5 sm:p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                    <HiCurrencyRupee className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-red-900">
                      Refund processing
                    </h3>
                    {refundPreview.canFullRefund ? (
                      <p className="text-xs sm:text-sm text-red-700">
                        No meals consumed – eligible for full refund
                      </p>
                    ) : (
                      <p className="text-xs sm:text-sm text-red-700">
                        {refundPreview.consumedMealsCount} meal
                        {refundPreview.consumedMealsCount !== 1 ? "s" : ""} consumed
                        (₹{refundPreview.consumedAmount.toLocaleString()})
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowRefundPanel(false);
                    setRefundPreview(null);
                    setRefundAmount("");
                    setRefundNote("");
                  }}
                  className="text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <HiX className="w-5 h-5" />
                </button>
              </div>

              {refundError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{refundError}</p>
                </div>
              )}

              {refundSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    {refundSuccess}
                  </p>
                </div>
              )}

              {!refundSuccess && (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-semibold text-red-900 mb-2">
                        Refund amount{" "}
                        <span className="text-xs text-red-600">(editable)</span>
                      </label>
                      <div className="relative">
                        <HiCurrencyRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="number"
                          min="0"
                          max={refundPreview.totalAmount}
                          step="0.01"
                          value={refundAmount}
                          onChange={(e) => setRefundAmount(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border-2 border-red-300 rounded-xl text-lg font-bold text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all bg-white"
                          placeholder="0.00"
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-600">
                        Total: ₹{refundPreview.totalAmount.toLocaleString()} | Suggested: ₹
                        {refundPreview.suggestedRefundAmount.toLocaleString()}
                      </p>
                    </div>

                    {/* Note */}
                    <div>
                      <label className="block text-sm font-semibold text-red-900 mb-2">
                        Reason (optional)
                      </label>
                      <textarea
                        value={refundNote}
                        onChange={(e) => setRefundNote(e.target.value)}
                        rows={2}
                        className="w-full border-2 border-red-300 text-gray-700 rounded-xl px-4 py-3 text-sm resize-vertical focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all bg-white"
                        placeholder="Enter refund reason or notes..."
                        maxLength={500}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        {refundNote.length}/500 characters
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleProceedRefund}
                      disabled={
                        isRefundLoading ||
                        !refundAmount ||
                        parseFloat(refundAmount) <= 0
                      }
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-xl text-sm sm:text-base font-bold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                    >
                      {isRefundLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Processing refund...
                        </>
                      ) : (
                        `Proceed with ₹${parseFloat(
                          refundAmount || "0"
                        ).toLocaleString()} refund`
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Refund history */}
          {hasRefunds && (
            <div className="bg-white rounded-lg sm:rounded-xl border border-orange-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <HiCurrencyRupee className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                      Refund history
                    </h3>
                    <p className="text-xs text-gray-500">
                      {order.refunds?.length || 0} refund
                      {order.refunds && order.refunds.length !== 1 ? "s" : ""} recorded
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {order.refunds?.map((refund: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100 group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900">
                        ₹{refund.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {refund.note || "No note"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(refund.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {["PENDING", "ONHOLD"].includes(refund.status) && (
                      <div className="flex items-center gap-2 ml-3">
                        <button
                          onClick={() => handleCancelRefund(refund)}
                          disabled={isRefundLoading}
                          className="px-3 py-1.5 text-xs bg-red-100 hover:bg-red-200 text-red-800 font-medium rounded-full transition-all flex items-center gap-1 disabled:opacity-50"
                        >
                          <HiX className="w-3 h-3" />
                          Cancel
                        </button>
                      </div>
                    )}

                    <span
                      className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${refund.status === "SUCCESS"
                          ? "bg-green-100 text-green-800"
                          : refund.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800 animate-pulse"
                            : refund.status === "CANCELLED"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                        }`}
                    >
                      {refund.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order items */}
      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HiShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">
              Order items ({order.items?.length || 0})
            </h3>
          </div>
        </div>

        {order.items && order.items.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <HiShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-500">
              No items in this order.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {order.items?.map((item, index) => (
              <div
                key={index}
                className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-bold text-gray-900">
                        {item.plan?.name || "N/A"}
                      </h4>
                      {item.quantity && (
                        <span className="px-2 py-0.5 text-[10px] sm:text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                          Qty: {item.quantity}
                        </span>
                      )}
                    </div>
                    {item.menu?.name && (
                      <p className="text-xs sm:text-sm text-gray-700 mt-1">
                        {item.menu.name}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Vendor:{" "}
                      <span className="font-medium">
                        {item.vendor?.name || "N/A"}
                      </span>
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-base sm:text-lg font-bold text-gray-900">
                      ₹{item.itemTotalPrice?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="space-y-1.5 sm:space-y-2">
                    <p className="text-gray-600">
                      <span className="font-semibold">Start:</span>{" "}
                      {formatShortDate(item.startDate)}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">End:</span>{" "}
                      {formatShortDate(item.endDate)}
                    </p>
                    {item.selectedMealTimes &&
                      item.selectedMealTimes.length > 0 && (
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
                        <p className="font-semibold text-gray-700 mb-1">
                          Skipped dates
                        </p>
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

                {/* Person details */}
                {item.personDetails && item.personDetails.length > 0 && (
                  <div className="mt-4 p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100">
                    <p className="font-semibold text-xs sm:text-sm text-gray-900 mb-3 flex items-center gap-2">
                      <HiUser className="w-4 h-4" />
                      Person details
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
