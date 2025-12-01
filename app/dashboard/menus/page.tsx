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
        const data = await apiRequest<MenuWithPopulatedMeals[]>("/api/menu/", "GET", null, token);
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
  const categories = ['Breakfast', 'Lunch', 'Dinner'];

  const getMenuItemsByCategoryAndDay = (category: string, day: string) => {
    return menus.flatMap(menu =>
      menu.menuItems.filter(item => item.category === category && item.day === day)
    );
  };

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
            <span className="text-sm font-medium text-gray-700">Total: {menus.length}</span>
          </div>
          <button
            onClick={() => router.push('/dashboard/menus/create')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Sections */}
      {categories.map((category) => (
        <div key={category} className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4  text-gray-500 capitalize">{category}</h2>
          <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300">
            {days.map((day) => {
              const items = getMenuItemsByCategoryAndDay(category, day);
              return (
                <div key={day} className="min-w-[220px] flex-shrink-0 p-4 bg-gray-50 rounded-lg border">
                  <div className="font-semibold text-gray-800 mb-3">{day}</div>
                  {items.length > 0 ? (
                    items.map((item) => (
                      <div key={item.meal._id} className="mb-2 p-2 bg-white rounded text-sm">
                        <div className="font-medium text-gray-600">{item.meal.name}</div>
                        <div className="text-gray-500 text-xs">₹{item.meal.price}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm text-center py-4">No {category.toLowerCase()}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {menus.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <div className="text-center">
            <HiDocumentText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No menus found.</p>
            <p className="text-sm text-gray-400 mt-2">Click "Create" to add your first menu</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenusPage;
