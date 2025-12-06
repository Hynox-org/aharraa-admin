"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/lib/authContext";
import {
  HiChevronLeft,
  HiChevronRight,
  HiCalendar,
  HiRefresh,
  HiX,
  HiClock,
  HiUser,
  HiPhone,
  HiLocationMarker,
  HiClipboardList,
  HiCheckCircle,
  HiExclamationCircle,
} from "react-icons/hi";

// Types
interface PersonDetail {
  name: string;
  phoneNumber: string;
}

interface DeliveryAddress {
  street: string;
  city: string;
  zip: string;
  state?: string;
  pincode?: string;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
}

interface OrderItem {
  orderId: string;
  orderItemId: string;
  customer: Customer;
  menu: string;
  vendor: string;
  numberOfPersons: number;
  personDetails: PersonDetail[];
  deliveryAddress: DeliveryAddress;
  status: "pending" | "preparing" | "readyForDelivery" | "delivered" | "cancelled";
  lastUpdated: string | null;
  notes: string;
}

interface MealSchedule {
  breakfast: OrderItem[];
  lunch: OrderItem[];
  dinner: OrderItem[];
}

interface MealScheduleResponse {
  date: string;
  mealSchedule: MealSchedule;
  totalBreakfast: number;
  totalLunch: number;
  totalDinner: number;
}

interface StatusHistoryItem {
  date: string;
  mealTime: string;
  status: string;
  updatedBy: string;
  updatedAt: string;
  notes: string;
}

interface StatusHistoryResponse {
  orderId: string;
  orderItemId: string;
  statusHistory: StatusHistoryItem[];
}

const OrderItemsPage = () => {
  const { token } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [mealSchedule, setMealSchedule] = useState<MealSchedule>({
    breakfast: [],
    lunch: [],
    dinner: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMealTime, setSelectedMealTime] = useState<"breakfast" | "lunch" | "dinner">("breakfast");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [statusNotes, setStatusNotes] = useState<string>("");
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch meal schedule
  const fetchMealSchedule = async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<MealScheduleResponse>(
        `/api/admin/orders/items/meal-schedule?date=${date}`,
        "GET",
        null,
        token
      );
      setMealSchedule(data.mealSchedule);
    } catch (err: any) {
      setError(err.message || "Failed to fetch meal schedule");
      console.error("Error fetching meal schedule:", err);
    } finally {
      setLoading(false);
    }
  };

  const isToday = (dateString: string) => {
  const today = new Date().toISOString().split("T")[0];
  return dateString === today;
};


  // Update meal status
  const updateMealStatus = async () => {
    if (!selectedItem || !newStatus) return;

    setLoading(true);
    setError(null);
    try {
      await apiRequest(
        `/api/admin/orders/${selectedItem.orderId}/items/${selectedItem.orderItemId}/meal-status`,
        "PATCH",
        {
          date: selectedDate,
          mealTime: selectedMealTime,
          status: newStatus,
          notes: statusNotes,
        },
        token
      );

      await fetchMealSchedule(selectedDate);
      setShowStatusModal(false);
      setSelectedItem(null);
      setNewStatus("");
      setStatusNotes("");
    } catch (err: any) {
      setError(err.message || "Failed to update status");
      console.error("Error updating status:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch status history
  const fetchStatusHistory = async (orderId: string, orderItemId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<StatusHistoryResponse>(
        `/api/admin/orders/${orderId}/items/${orderItemId}/status-history`,
        "GET",
        null,
        token
      );
      setStatusHistory(data.statusHistory);
      setShowHistoryModal(true);
    } catch (err: any) {
      setError(err.message || "Failed to fetch status history");
      console.error("Error fetching status history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMealSchedule(selectedDate);
    }
  }, [selectedDate, token]);

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate.toISOString().split("T")[0]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-black border-gray-300";
      case "preparing":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "readyForDelivery":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-black border-gray-300";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Filter items by status
  const filterItems = (items: OrderItem[]) => {
    if (statusFilter === "all") return items;
    return items.filter(item => item.status === statusFilter);
  };

  // Render order item card
  const renderOrderItem = (item: OrderItem, mealTime: string) => (
    <div
      key={`${item.orderId}-${item.orderItemId}`}
      className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3CB371] to-[#2FA05E] flex items-center justify-center text-white font-bold text-xs">
              {item.customer.name.charAt(0).toUpperCase()}
            </div>
            <h4 className="font-bold text-sm sm:text-base text-gray-900 truncate">
              {item.customer.name}
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 truncate">{item.menu}</p>
        </div>
        <span
          className={`px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold border flex-shrink-0 ml-2 ${getStatusColor(
            item.status
          )}`}
        >
          {formatStatus(item.status)}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-black">
          <HiPhone className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">{item.customer.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-black">
          <HiUser className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>{item.numberOfPersons} person(s)</span>
        </div>
        {item.personDetails && item.personDetails.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <p className="font-semibold text-gray-900 mb-1.5 text-xs">Person Details:</p>
            <div className="space-y-1">
              {item.personDetails.map((person, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs"
                >
                  <div className="w-5 h-5 rounded-full bg-[#3CB371] flex items-center justify-center text-white font-bold text-[10px]">
                    {idx + 1}
                  </div>
                  <span className="flex-1 text-black truncate">{person.name}</span>
                  <span className="text-gray-500">{person.phoneNumber}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-start gap-2 text-black pt-2">
          <HiLocationMarker className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <span className="flex-1 text-xs leading-relaxed">
            {item.deliveryAddress.street}, {item.deliveryAddress.state} -{" "}
            {item.deliveryAddress.pincode}
          </span>
        </div>
        {item.notes && (
          <div className="flex items-start gap-2 text-black pt-2 border-t border-gray-100">
            <HiClipboardList className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <span className="flex-1 text-xs">{item.notes}</span>
          </div>
        )}
        {item.lastUpdated && (
          <div className="flex items-center gap-2 text-gray-500 text-[10px] sm:text-xs pt-2">
            <HiClock className="w-3 h-3" />
            <span>Updated: {new Date(item.lastUpdated).toLocaleString("en-IN")}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
        <button
  onClick={() => {
    setSelectedItem(item);
    setSelectedMealTime(mealTime as any);
    setNewStatus(item.status);
    setStatusNotes("");
    setShowStatusModal(true);
  }}
  className={`flex-1 px-3 sm:px-4 py-2 rounded-lg transition text-xs sm:text-sm font-semibold shadow-sm ${
    !isToday(selectedDate)
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-[#3CB371] text-white hover:bg-[#35a065]"
  }`}
>
  Update Status
</button>
        <button
          onClick={() => fetchStatusHistory(item.orderId, item.orderItemId)}
          className="px-3 sm:px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition text-xs sm:text-sm font-semibold"
        >
          History
        </button>
      </div>
    </div>
  );

  const renderMealSection = (mealType: "breakfast" | "lunch" | "dinner", icon: string, title: string) => {
    const items = filterItems(mealSchedule[mealType]);
    
    return (
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <span>{title}</span>
            <span className="text-sm font-normal text-gray-500">
              ({items.length})
            </span>
          </h2>
        </div>
        {items.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <HiClipboardList className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <p className="text-sm sm:text-base text-gray-500">
              No {title.toLowerCase()} orders for this date
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {items.map((item) => renderOrderItem(item, mealType))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Order Items Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
              Manage and track meal deliveries
            </p>
          </div>
          <button
            onClick={() => fetchMealSchedule(selectedDate)}
            className="p-2 sm:p-2.5 rounded-lg hover:bg-gray-100 transition-colors w-fit"
            aria-label="Refresh"
          >
            <HiRefresh className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>

        {/* Date Selector */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => changeDate(-1)}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition text-sm font-medium"
            >
              <HiChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex-1 flex items-center gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <HiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-9 text-black sm:pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB371] focus:border-[#3CB371] text-sm"
                />
              </div>
              <button
                onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
                className="px-3 sm:px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition text-sm font-medium whitespace-nowrap"
              >
                Today
              </button>
            </div>

            <button
              onClick={() => changeDate(1)}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition text-sm font-medium"
            >
              <span className="hidden sm:inline">Next</span>
              <HiChevronRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 mt-3 text-center font-medium">
            {formatDate(selectedDate)}
          </p>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <label className="text-sm font-semibold text-black">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 text-black sm:flex-initial sm:min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB371] focus:border-[#3CB371] text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="readyForDelivery">Ready for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-3">
            <HiExclamationCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700 flex-1">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && !showStatusModal && !showHistoryModal && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#3CB371] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading meal schedule...</p>
          </div>
        )}

        {/* Meal Sections */}
        {!loading && (
          <div className="space-y-4 sm:space-y-6">
            {renderMealSection("breakfast", "🌅", "Breakfast")}
            {renderMealSection("lunch", "☀️", "Lunch")}
            {renderMealSection("dinner", "🌙", "Dinner")}
          </div>
        )}

        {/* Update Status Modal */}
        {showStatusModal && selectedItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg sm:rounded-xl max-w-md w-full p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Update Order Status</h3>
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedItem(null);
                    setNewStatus("");
                    setStatusNotes("");
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <HiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Customer</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedItem.customer.name}</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Meal Time</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{selectedMealTime}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB371] focus:border-[#3CB371] text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="readyForDelivery">Ready for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Notes</label>
                  <textarea
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                    rows={3}
                    placeholder="Add any notes about this status update..."
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB371] focus:border-[#3CB371] text-sm resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedItem(null);
                    setNewStatus("");
                    setStatusNotes("");
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition text-sm font-semibold"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={updateMealStatus}
                  className="flex-1 px-4 py-2.5 bg-[#3CB371] text-white rounded-lg hover:bg-[#35a065] transition disabled:opacity-50 text-sm font-semibold flex items-center justify-center gap-2"
                  disabled={loading || !newStatus}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <HiCheckCircle className="w-4 h-4" />
                      Update
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status History Modal */}
        {showHistoryModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg sm:rounded-xl max-w-2xl w-full p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Status History</h3>
                <button
                  onClick={() => {
                    setShowHistoryModal(false);
                    setStatusHistory([]);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <HiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {statusHistory.length === 0 ? (
                <div className="text-center py-12">
                  <HiClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No status history available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {statusHistory.map((history, idx) => (
                    <div
                      key={idx}
                      className="border-l-4 border-[#3CB371] pl-4 py-3 bg-gray-50 rounded-r-lg"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                history.status
                              )}`}
                            >
                              {formatStatus(history.status)}
                            </span>
                            <span className="text-xs font-semibold text-black capitalize">
                              {history.mealTime}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{history.date}</p>
                          {history.notes && (
                            <p className="text-sm text-black mt-2 p-2 bg-white rounded border border-gray-200">
                              {history.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          <p className="font-medium">{history.updatedBy}</p>
                          <p>{new Date(history.updatedAt).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={() => {
                    setShowHistoryModal(false);
                    setStatusHistory([]);
                  }}
                  className="w-full px-4 py-2.5 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition text-sm font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderItemsPage;
