"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { apiRequest } from '@/lib/api';
import { 
  HiShoppingBag, 
  HiUsers, 
  HiChartBar, 
  HiTrendingUp,
  HiTrendingDown,
  HiClock,
  HiRefresh,
} from 'react-icons/hi';
import { IconType } from 'react-icons';

interface RecentOrder {
  id: string;
  customer: string;
  items: string;
  amount: string;
  status: string;
  time: string;
}

interface PopularMeal {
  name: string;
  orders: number;
  revenue: string;
}

interface StatsItem {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: IconType;
  color: string;
}

interface AnalyticsData {
  totalOrders: number;
  pendingOrders: number;
  activeCustomers: number;
  revenueToday: number;
  recentOrders: {
    id: string;
    customer: string;
    items: string;
    amount: number;
    status: string;
    createdAt: string;
  }[];
  popularMenus: {
    name: string;
    orders: number;
    revenue: number;
  }[];
}

const DashboardPage = () => {
  const [stats, setStats] = useState<StatsItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [popularMeals, setPopularMeals] = useState<PopularMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700 border border-green-200';
      case 'preparing': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'on the way': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-700 border border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<AnalyticsData>("/api/admin/analytics", "GET", null, token);

      // Update stats with proper colors
      setStats([
        {
          title: 'Total Orders',
          value: data.totalOrders.toLocaleString(),
          change: '+' + (data.totalOrders / 100).toFixed(1) + '%',
          trend: 'up',
          icon: HiShoppingBag,
          color: 'from-blue-500 to-blue-600',
        },
        {
          title: 'Active Customers',
          value: data.activeCustomers.toLocaleString(),
          change: '+' + (data.activeCustomers / 100).toFixed(1) + '%',
          trend: 'up',
          icon: HiUsers,
          color: 'from-purple-500 to-purple-600',
        },
        {
          title: 'Revenue Today',
          value: `₹${data.revenueToday.toLocaleString()}`,
          change: '+' + (data.revenueToday / 100).toFixed(1) + '%',
          trend: 'up',
          icon: HiChartBar,
          color: 'from-[#3CB371] to-[#2FA05E]',
        },
        {
          title: 'Pending Orders',
          value: data.pendingOrders.toLocaleString(),
          change: '-' + (data.pendingOrders / 100).toFixed(1) + '%',
          trend: 'down',
          icon: HiClock,
          color: 'from-amber-500 to-amber-600',
        },
      ]);

      // Map recent orders
      setRecentOrders(
        data.recentOrders.map((order) => ({
          id: order.id,
          customer: order.customer || 'Unknown',
          items: order.items || 'N/A',
          amount: `₹${(order.amount ?? 0).toLocaleString()}`,
          status: order.status,
          time: new Date(order.createdAt).toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
        }))
      );

      // Map popular menus
      setPopularMeals(
        data.popularMenus.map((meal) => ({
          name: meal.name,
          orders: meal.orders,
          revenue: `₹${(meal.revenue ?? 0).toLocaleString()}`,
        }))
      );
    } catch(err: any) {
      console.error('Failed to fetch analytics', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  // Loading State
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-4 sm:p-5 rounded-lg sm:rounded-xl border border-gray-200 animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="w-12 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-20 h-3 bg-gray-200 rounded mb-2"></div>
              <div className="w-24 h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        
        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg sm:rounded-xl border border-gray-200 h-96 animate-pulse"></div>
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 h-96 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiClock className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load dashboard</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#3CB371] text-white rounded-lg hover:bg-[#35a065] transition-colors"
          >
            <HiRefresh className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="p-2 sm:p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Refresh data"
        >
          <HiRefresh className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? HiTrendingUp : HiTrendingDown;
          return (
            <div 
              key={index} 
              className="bg-white p-4 sm:p-5 rounded-lg sm:rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-2.5 bg-gradient-to-br ${stat.color} rounded-lg sm:rounded-xl shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  <TrendIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                  <span className={`text-xs sm:text-sm font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Orders</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Latest orders from your customers</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase">Customer</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">Items</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">#{order.id.slice(0, 8)}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">{order.customer}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 hidden md:table-cell">{order.items}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-900">{order.amount}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span className={`px-2 sm:px-2.5 py-1 text-[10px] sm:text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Meals */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Popular Meals</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Top selling items</p>
          </div>
          <div className="p-4 sm:p-6">
            {popularMeals.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {popularMeals.map((meal, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white hover:from-green-50 hover:to-white border border-gray-100 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#3CB371] to-[#2FA05E] flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{meal.name}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">{meal.orders} orders</p>
                      </div>
                    </div>
                    <p className="font-bold text-sm sm:text-base text-[#3CB371] ml-2">{meal.revenue}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-gray-500">
                No popular meals data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
