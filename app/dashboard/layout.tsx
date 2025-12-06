"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { 
  HiHome, 
  HiShoppingBag, 
  HiUsers, 
  HiChartBar, 
  HiCog, 
  HiLogout,
  HiMenuAlt3,
  HiX,
  HiUserGroup,
  HiOfficeBuilding,
  HiOutlineCollection,
  HiBell
} from 'react-icons/hi';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const { user, logout, isAuthenticated } = useAuth();
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [userInitial, setUserInitial] = useState("U");

  useEffect(() => {
    // Handle loading state
    if (user) {
      setIsLoading(false);
    }

    // Set active menu based on pathname
    const path = pathname.split('/').pop();
    if (path) {
      setActiveMenu(path === 'dashboard' ? '/' : path);
    }
    
    // Set user info
    if (user?.role === "admin") {
      setUserName("Admin User");
      setUserEmail(user.email || "admin@aharraa.com");
      setUserInitial("A");
    } else if (user?.role === "vendor") {
      setUserName("Vendor User");
      setUserEmail(user.email || "vendor@aharraa.com");
      setUserInitial("V");
    }
  }, [pathname, user?.role, user?.email, user]);

  // Role-based menu items
  const getMenuItems = () => {
    if (!user?.role) return []; 
    const role = user.role.toLowerCase();
    
    const allMenuItems = [
      { id: '/', label: 'Dashboard', icon: HiHome, roles: ['admin', 'vendor'] },
      { id: 'orders', label: 'Orders', icon: HiShoppingBag, roles: ['admin', 'vendor'] },
      { id: 'orderItems', label: 'Order Items', icon: HiShoppingBag, roles: ['admin', 'vendor'] },
      { id: 'users', label: 'Users', icon: HiUserGroup, roles: ['admin'] },
      { id: 'vendors', label: 'Vendors', icon: HiOfficeBuilding, roles: ['admin'] },
      { id: 'menus', label: 'Menus', icon: HiOutlineCollection, roles: ['admin', 'vendor']},
    ];
    
    return allMenuItems.filter(item => item.roles.includes(role));
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
  };

  const handleNavigation = (itemId: string) => {
    setActiveMenu(itemId);
    const route = itemId === '/' ? '/dashboard' : `/dashboard/${itemId}`;
    router.push(route);
    setSidebarOpen(false);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#3CB371] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-56 lg:w-64 bg-white border-r border-gray-200 shadow-sm">
          {/* Logo */}
          <div className="flex items-center h-14 lg:h-16 px-4 lg:px-6 border-b border-gray-100">
            <div className="h-8 w-8 lg:h-9 lg:w-9 rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <img 
                src="https://qlgusdrybvqzckgizmco.supabase.co/storage/v1/object/public/Files/aharra_logo_color.jpg" 
                alt="Aharraa" 
                className="h-full w-full object-cover"
              />
            </div>
            <h2 className="ml-2 lg:ml-3 text-base lg:text-lg font-bold text-gray-900">Aharraa</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 lg:px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#3CB371] to-[#2FA05E] text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-2 lg:p-3 border-t border-gray-100 bg-gray-50">
            <div className="px-3 py-2 mb-2">
              <p className="text-xs font-semibold text-gray-900 truncate">{userName}</p>
              <p className="text-[10px] text-gray-500 truncate">{userEmail}</p>
            </div>
            <button 
              onClick={handleLogout} 
              className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-95"
            >
              <HiLogout className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" 
            onClick={() => setSidebarOpen(false)} 
          />
          <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-2xl animate-slideRight">
            {/* Mobile Header */}
            <div className="flex items-center justify-between h-14 px-4 border-b border-gray-100">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                  <img 
                    src="https://qlgusdrybvqzckgizmco.supabase.co/storage/v1/object/public/Files/aharra_logo_color.jpg" 
                    alt="Aharraa" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <h2 className="ml-2 text-base font-bold text-gray-900">Aharraa</h2>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <HiX className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="px-2 py-4 space-y-1 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#3CB371] to-[#2FA05E] text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Logout */}
            <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={handleLogout} 
                className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-95"
              >
                <HiLogout className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 lg:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-4 lg:px-6 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
              aria-label="Open menu"
            >
              <HiMenuAlt3 className="h-5 w-5 text-gray-700" />
            </button>
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 capitalize">
              {activeMenu === '/' ? 'Dashboard' : activeMenu}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications - Optional */}
            <button className="hidden sm:flex p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <HiBell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Info - Desktop */}
            <div className="hidden sm:block text-right">
              <p className="text-xs sm:text-sm font-semibold text-gray-900">{userName}</p>
              <p className="text-[10px] sm:text-xs text-gray-500">{userEmail}</p>
            </div>

            {/* User Avatar */}
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-[#3CB371] to-[#2FA05E] flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-md">
              {userInitial}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-3 sm:p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
