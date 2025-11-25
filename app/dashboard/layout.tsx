"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  HiHome, 
  HiShoppingBag, 
  HiUsers, 
  HiChartBar, 
  HiCog, 
  HiLogout,
  HiMenuAlt3,
  HiX,
  HiUserGroup
} from 'react-icons/hi';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState('dashboard');

  useEffect(() => {
    const path = pathname.split('/').pop();
    if (path) {
      setActiveMenu(path);
    }
  }, [pathname]);

  const menuItems = [
    { id: '/', label: 'Dashboard', icon: HiHome },
    { id: 'orders', label: 'Orders', icon: HiShoppingBag },
    { id: 'users', label: 'Users', icon: HiUserGroup },
    // { id: 'customers', label: 'Customers', icon: HiUsers },
    // { id: 'analytics', label: 'Analytics', icon: HiChartBar },
    // { id: 'settings', label: 'Settings', icon: HiCog },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <img 
              src="https://qlgusdrybvqzckgizmco.supabase.co/storage/v1/object/public/Files/aharra_logo_color.jpg" 
              alt="Aharraa" 
              className="h-8 w-8 rounded"
            />
            <h2 className="ml-3 text-lg font-semibold text-black">Aharraa Admin</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    router.push(`/dashboard/${item.id}`);
                  }}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
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

          {/* Logout */}
          <div className="p-3 border-t border-gray-200">
            <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md">
              <HiLogout className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-black">Aharraa Admin</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <HiX className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <nav className="px-3 py-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveMenu(item.id);
                      router.push(`/dashboard/${item.id}`);
                      setSidebarOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
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
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 mr-2"
            >
              <HiMenuAlt3 className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">info.aharraa@gmail.com</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-[#3CB371] flex items-center justify-center text-white font-medium text-sm">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
