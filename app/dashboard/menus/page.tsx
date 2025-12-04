'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { MenuWithPopulatedMeals } from '@/lib/types';
import { useAuth } from '@/lib/authContext';
import { 
  HiDocumentText, 
  HiRefresh, 
  HiX, 
  HiFilter,
  HiChevronDown,
  HiChevronUp
} from 'react-icons/hi';
import { useRouter } from 'next/navigation';

const MenusPage = () => {
  const { token } = useAuth();
  const router = useRouter();
  const [menus, setMenus] = useState<MenuWithPopulatedMeals[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const fetchMenus = async () => {
    if (!token) {
      setLoading(false);
      setError('Authentication token not found.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest<MenuWithPopulatedMeals[]>("/api/admin/menus", "GET", null, token);
      console.log("Menus data fetched:", data);
      
      if (data === null || data === undefined) {
        setMenus([]);
      } else {
        setMenus(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch menus.');
      console.error("Failed to fetch menus:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [token]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Get only categories with actual data
  const getAvailableCategories = () => {
    const allCategories = ['Breakfast', 'Lunch', 'Dinner'];
    const available: string[] = [];

    allCategories.forEach(category => {
      const hasItems = menus.some(menu =>
        menu.menuItems.some(item => 
          item.category === category && item.meal
        )
      );
      if (hasItems) {
        available.push(category);
      }
    });

    return available;
  };

  // Get items by category and day
  const getMenuItemsByCategoryAndDay = (category: string, day: string) => {
    return menus
      .flatMap(menu =>
        menu.menuItems
          .filter(item => 
            item.category === category && 
            item.day === day && 
            item.meal
          )
      );
  };

  const availableCategories = getAvailableCategories();

  // Filter categories
  const filteredCategories = useMemo(() => {
    if (selectedCategory === 'all') return availableCategories;
    return availableCategories.filter(cat => cat.toLowerCase() === selectedCategory.toLowerCase());
  }, [availableCategories, selectedCategory]);

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Auto-expand all on load
  useEffect(() => {
    if (availableCategories.length > 0) {
      setExpandedCategories(availableCategories);
    }
  }, [availableCategories.length]);

  // Loading State
  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-48 bg-gray-200 rounded mt-2 animate-pulse"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-8 sm:p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#3CB371] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-gray-500">Loading menus...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Menus</h1>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-8 sm:p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiX className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load menus</h3>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchMenus}
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Menus</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Manage weekly meal menus</p>
          </div>
          <button
            onClick={fetchMenus}
            className="p-2 sm:p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Refresh menus"
          >
            <HiRefresh className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>

        {/* Stats & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Total Count */}
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white rounded-lg border border-gray-200 w-fit">
            <HiDocumentText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
            <span className="text-xs sm:text-sm font-semibold text-gray-700">
              Total: {menus.length} | Active: {availableCategories.length} meal types
            </span>
          </div>

          {/* Category Filter */}
          {availableCategories.length > 0 && (
            <div className="flex items-center gap-2">
              <HiFilter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs sm:text-sm border border-gray-300 rounded-lg px-3 py-1.5 sm:py-2 bg-white focus:outline-none text-gray-700 focus:ring-2 focus:ring-[#3CB371]"
              >
                <option value="all">All Categories</option>
                {availableCategories.map(cat => (
                  <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Menus Display */}
      {filteredCategories.length > 0 ? (
        <div className="space-y-4">
          {filteredCategories.map((category) => {
            const isExpanded = expandedCategories.includes(category);
            return (
              <div 
                key={category} 
                className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors border-b border-gray-200"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#3CB371] to-[#2FA05E] flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {category.charAt(0)}
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 capitalize">
                      {category}
                    </h2>
                  </div>
                  {isExpanded ? (
                    <HiChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <HiChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {/* Category Content */}
                {isExpanded && (
                  <div className="p-3 sm:p-6">
                    {/* Desktop: Horizontal Scroll */}
                    <div className="hidden sm:flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {days.map((day) => {
                        const items = getMenuItemsByCategoryAndDay(category, day);
                        return (
                          <div 
                            key={day} 
                            className="min-w-[240px] flex-shrink-0 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
                          >
                            <div className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#3CB371]"></div>
                              {day}
                            </div>
                            {items.length > 0 ? (
                              <div className="space-y-2">
                                {items.map((item) => (
                                  <div 
                                    key={item.meal?._id} 
                                    className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-[#3CB371] transition-all group"
                                  >
                                    <div className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-[#3CB371] transition-colors">
                                      {item.meal?.name || 'Unnamed Meal'}
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-gray-700">₹{item.meal?.price || 0}</span>
                                      {item.meal?.dietPreference && (
                                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-green-100 text-green-700 rounded-full capitalize border border-green-200">
                                          {item.meal.dietPreference}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-gray-400 text-xs text-center py-8 italic">
                                No meals
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Mobile: Grid */}
                    <div className="sm:hidden grid grid-cols-1 gap-3">
                      {days.map((day) => {
                        const items = getMenuItemsByCategoryAndDay(category, day);
                        if (items.length === 0) return null;
                        
                        return (
                          <div 
                            key={day} 
                            className="p-3 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200"
                          >
                            <div className="font-bold text-gray-800 mb-2 text-xs uppercase tracking-wide flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#3CB371]"></div>
                              {day}
                            </div>
                            <div className="space-y-2">
                              {items.map((item) => (
                                <div 
                                  key={item.meal?._id} 
                                  className="p-2.5 bg-white rounded-lg border border-gray-200 shadow-sm"
                                >
                                  <div className="font-semibold text-gray-900 text-xs mb-1.5 line-clamp-2">
                                    {item.meal?.name || 'Unnamed Meal'}
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-700">₹{item.meal?.price || 0}</span>
                                    {item.meal?.dietPreference && (
                                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-green-100 text-green-700 rounded-full capitalize">
                                        {item.meal.dietPreference}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-8 sm:p-16 shadow-sm">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiDocumentText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No menus with meals found</h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              {selectedCategory !== 'all' 
                ? `No menus available for ${selectedCategory}` 
                : 'Please contact admin to add menu items.'}
            </p>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-sm font-medium text-[#3CB371] hover:text-[#2d9158]"
              >
                View all categories
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenusPage;
