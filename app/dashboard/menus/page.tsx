'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { MenuWithPopulatedMeals } from '@/lib/types';
import { useAuth } from '@/lib/authContext';
import { HiDocumentText } from 'react-icons/hi';
import { useRouter } from 'next/navigation';

const MenusPage = () => {
  const { token } = useAuth();
  const router = useRouter();
  const [menus, setMenus] = useState<MenuWithPopulatedMeals[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, [token]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Menus</h1>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="text-gray-500">Loading menus...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Menus</h1>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <p className="text-red-600 font-medium">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // ✅ FIXED: Get only categories with actual data
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

  // ✅ FIXED: Only get items with valid meals
  const getMenuItemsByCategoryAndDay = (category: string, day: string) => {
    return menus
      .flatMap(menu =>
        menu.menuItems
          .filter(item => 
            item.category === category && 
            item.day === day && 
            item.meal // ✅ Only items with meals
          )
      );
  };

  const availableCategories = getAvailableCategories();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menus</h1>
          <p className="text-sm text-gray-500 mt-1">Manage weekly meal menus</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
            <HiDocumentText className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {/* Total: {menus.length} | Active: {availableCategories.length} meal types */}
              Total: {menus.length}
            </span>
          </div>
          {/* <button
            onClick={() => router.push('/dashboard/menus/create')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Create
          </button> */}
        </div>
      </div>

      {availableCategories.length > 0 ? (
        availableCategories.map((category) => (
          <div key={category} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 capitalize border-b pb-3">
              {category}
            </h2>
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {days.map((day) => {
                const items = getMenuItemsByCategoryAndDay(category, day);
                return (
                  <div key={day} className="min-w-[240px] flex-shrink-0 p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border shadow-sm">
                    <div className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">
                      {day}
                    </div>
                    {items.length > 0 ? (
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div key={item.meal?._id || item._id} className="p-3 bg-white rounded-lg border shadow-sm hover:shadow-md transition-all">
                            <div className="font-medium text-gray-900 text-sm mb-1 truncate">
                              {item.meal?.name || 'Unnamed Meal'}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">₹{item.meal?.price || 0}</span>
                              {item.meal?.dietPreference && (
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full capitalize">
                                  {item.meal.dietPreference}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm text-center py-8 italic opacity-75">
                        No {category.toLowerCase()} for {day.toLowerCase()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 shadow-sm">
          <div className="text-center">
            <HiDocumentText className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <p className="text-xl font-medium text-gray-500 mb-2">No menus with meals found</p>
            <p className="text-sm text-gray-400 mb-6">Menus exist but no meals are assigned yet.</p>
            <button
              onClick={() => router.push('/dashboard/menus/create')}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Create Menu with Meals
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenusPage;
