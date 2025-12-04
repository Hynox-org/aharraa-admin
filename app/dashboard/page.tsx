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
  const { token } = useAuth();

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Preparing': return 'bg-yellow-100 text-yellow-800';
      case 'On the Way': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await apiRequest<AnalyticsData>("/api/admin/analytics", "GET", null, token);

        // Update stats with change & trend placeholders (adjust as needed)
        setStats([
          {
            title: 'Total Orders',
            value: data.totalOrders.toLocaleString(),
            change: '+' + data.totalOrders/100 + '%',
            trend: 'up',
            icon: HiShoppingBag,
          },
          {
            title: 'Active Customers',
            value: data.activeCustomers.toLocaleString(),
            change: '+'+ data.activeCustomers/100 + '%',
            trend: 'up',
            icon: HiUsers,
          },
          {
            title: 'Revenue Today',
            value: `₹${data.revenueToday.toLocaleString()}`,
            change: '+' + data.revenueToday/100 + '%',
            trend: 'up',
            icon: HiChartBar,
          },
          {
            title: 'Pending Orders',
            value: data.pendingOrders.toLocaleString(),
            change: '-' + data.pendingOrders/100+ '%',
            trend: 'down',
            icon: HiClock,
          },
        ]);

        // Map recent orders to required format with fallback data/time
        setRecentOrders(
          data.recentOrders.map((order) => ({
            id: order.id,
            customer: order.customer || 'Unknown',
            items: 'Items', // You may adapt if items list is available in API
            amount: `₹${(order.amount ?? 0).toLocaleString()}`,
            status: order.status,
            time: 'Recent', // Optionally calculate relative time from createdAt
          }))
        );

        // Map popular menus to required format
        setPopularMeals(
          data.popularMenus.map((meal) => ({
            name: meal.name,
            orders: meal.orders,
            revenue: `₹${(meal.revenue ?? 0).toLocaleString()}`,
          }))
        );
      } catch(err) {
        console.error('Failed to fetch analytics', err);
        // Optionally add error handling UI here
      }
    };

    if (token) {
      fetchAnalytics();
    }
  }, [token]);


  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-5 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gray-100 rounded">
                  <Icon className="h-5 w-5 text-gray-600" />
                </div>
                <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{order.items}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Meals */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Popular Meals</h2>
          </div>
          <div className="p-6">
            <table className="w-full">
              <tbody className="divide-y divide-gray-200">
                {popularMeals.map((meal, index) => (
                  <tr key={index}>
                    <td className="py-3">
                      <p className="font-medium text-gray-900">{meal.name}</p>
                      {/* <p className="text-sm text-gray-500">{meal.orders} orders</p> */}
                    </td>
                    <td className="py-3 text-right">
                      <p className="font-semibold text-[#3CB371]">{meal.revenue}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
