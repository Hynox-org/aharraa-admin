"use client";

import { useState } from 'react';
import { 
  HiHome, 
  HiShoppingBag, 
  HiUsers, 
  HiChartBar, 
  HiCog, 
  HiLogout,
  HiMenuAlt3,
  HiX,
  HiTrendingUp,
  HiTrendingDown,
  HiClock,
  HiCheckCircle
} from 'react-icons/hi';

// Sample Data
const stats = [
  { 
    title: 'Total Orders', 
    value: '1,234', 
    change: '+12.5%', 
    trend: 'up',
    icon: HiShoppingBag,
    color: 'bg-[#3CB371]'
  },
  { 
    title: 'Active Customers', 
    value: '856', 
    change: '+8.2%', 
    trend: 'up',
    icon: HiUsers,
    color: 'bg-blue-500'
  },
  { 
    title: 'Revenue Today', 
    value: '₹45,680', 
    change: '+15.3%', 
    trend: 'up',
    icon: HiChartBar,
    color: 'bg-purple-500'
  },
  { 
    title: 'Pending Orders', 
    value: '23', 
    change: '-5.1%', 
    trend: 'down',
    icon: HiClock,
    color: 'bg-orange-500'
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HiHome },
    { id: 'orders', label: 'Orders', icon: HiShoppingBag },
    { id: 'customers', label: 'Customers', icon: HiUsers },
    { id: 'analytics', label: 'Analytics', icon: HiChartBar },
    { id: 'settings', label: 'Settings', icon: HiCog },
  ];

  const getStatusColor = (status : string) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Preparing': return 'bg-yellow-100 text-yellow-700';
      case 'On the Way': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center h-20 px-6 border-b border-gray-200">
            <img 
              src="https://qlgusdrybvqzckgizmco.supabase.co/storage/v1/object/public/Files/aharra_logo_color.jpg" 
              alt="Aharraa" 
              className="h-10 w-10 rounded-lg border border-gray-200"
            />
            <h2 className="ml-3 text-xl font-bold text-black">Aharraa Admin</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    activeMenu === item.id
                      ? 'bg-[#3CB371] text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all">
              <HiLogout className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-black">Aharraa Admin</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <HiX className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <nav className="px-4 py-6 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveMenu(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                      activeMenu === item.id
                        ? 'bg-[#3CB371] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 mr-4"
            >
              <HiMenuAlt3 className="h-6 w-6 text-black" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-black">Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, Admin!</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-black">Admin User</p>
              <p className="text-xs text-gray-600">info.aharraa@gmail.com</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[#3CB371] flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className={`flex items-center text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? <HiTrendingUp className="h-4 w-4 mr-1" /> : <HiTrendingDown className="h-4 w-4 mr-1" />}
                      {stat.change}
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                  <p className="text-3xl font-bold text-black">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Recent Orders & Popular Meals */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-black">Recent Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-black">{order.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{order.items}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-black">{order.amount}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-black">Popular Meals</h2>
              </div>
              <div className="p-6 space-y-4">
                {popularMeals.map((meal, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <h3 className="font-semibold text-black">{meal.name}</h3>
                      <p className="text-sm text-gray-600">{meal.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#3CB371]">{meal.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
