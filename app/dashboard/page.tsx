"use client";

import { 
  HiShoppingBag, 
  HiUsers, 
  HiChartBar, 
  HiTrendingUp,
  HiTrendingDown,
  HiClock,
} from 'react-icons/hi';

// Sample Data
const stats = [
  { 
    title: 'Total Orders', 
    value: '1,234', 
    change: '+12.5%', 
    trend: 'up',
    icon: HiShoppingBag,
  },
  { 
    title: 'Active Customers', 
    value: '856', 
    change: '+8.2%', 
    trend: 'up',
    icon: HiUsers,
  },
  { 
    title: 'Revenue Today', 
    value: '₹45,680', 
    change: '+15.3%', 
    trend: 'up',
    icon: HiChartBar,
  },
  { 
    title: 'Pending Orders', 
    value: '23', 
    change: '-5.1%', 
    trend: 'down',
    icon: HiClock,
  },
];

const recentOrders = [
  { id: '#ORD-1234', customer: 'Priya Sharma', items: 'Veg Thali, Roti (5)', amount: '₹380', status: 'Delivered', time: '10 mins ago' },
  { id: '#ORD-1233', customer: 'Rajesh Kumar', items: 'Paneer Butter Masala', amount: '₹250', status: 'Preparing', time: '15 mins ago' },
  { id: '#ORD-1232', customer: 'Anjali Patel', items: 'Dal Makhani, Rice', amount: '₹320', status: 'On the Way', time: '25 mins ago' },
  { id: '#ORD-1231', customer: 'Vikram Singh', items: 'Family Pack - 4 Meals', amount: '₹890', status: 'Delivered', time: '1 hour ago' },
  { id: '#ORD-1230', customer: 'Meera Desai', items: 'Aloo Gobi, Chapati (4)', amount: '₹280', status: 'Delivered', time: '2 hours ago' },
];

const popularMeals = [
  { name: 'Veg Thali', orders: 156, revenue: '₹23,400' },
  { name: 'Paneer Butter Masala', orders: 134, revenue: '₹20,100' },
  { name: 'Dal Makhani Combo', orders: 98, revenue: '₹15,680' },
  { name: 'Family Pack', orders: 67, revenue: '₹19,980' },
];

const DashboardPage = () => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Preparing': return 'bg-yellow-100 text-yellow-800';
      case 'On the Way': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                      <p className="text-sm text-gray-500">{meal.orders} orders</p>
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
