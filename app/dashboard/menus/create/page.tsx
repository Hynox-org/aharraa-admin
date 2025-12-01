'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import Link from 'next/link';
import { HiArrowLeft, HiPlus, HiTrash, HiCheck, HiCamera } from 'react-icons/hi2';
import { 
  DietPreference, 
  MealCategory, 
  DayOfWeek, 
  NutritionalDetails, 
  Meal 
} from '@/lib/types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const MenuCreatePage = () => {
  const router = useRouter();
  const { token, user } = useAuth();
  const [step, setStep] = useState(1); // 1: Basics, 2: Times, 3: Meals, 4: Review
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [createdMeals, setCreatedMeals] = useState<{ _id: string; name: string }[]>([]);

  // Step 1: Menu basics
  const [menuBasics, setMenuBasics] = useState({
    name: '',
    description: '',
    dietPreference: 'All' as DietPreference,
  });

  // Step 2: Selected meal times
  const [selectedTimes, setSelectedTimes] = useState<MealCategory[]>([]);
  const mealTimes: MealCategory[] = ['Breakfast', 'Lunch', 'Dinner'];

  // Step 3: Meals data - { "Monday-Breakfast": { meal data } }
  const [mealsData, setMealsData] = useState<Record<string, {
    name: string;
    description: string;
    subProducts: string[];
    nutritionalDetails: NutritionalDetails;
    price: number;
    image: string;
    dietPreference: DietPreference;
    category: MealCategory;
  }>>({});

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Initialize meals data when times change
  useEffect(() => {
    if (step !== 3) return;
    
    const newMealsData: Record<string, any> = {};
    days.forEach((day: DayOfWeek) => {
      selectedTimes.forEach((time: MealCategory) => {
        const key = `${day}-${time}`;
        if (!newMealsData[key]) {
          newMealsData[key] = {
            name: '',
            description: '',
            subProducts: [''],
            nutritionalDetails: { protein: 0, carbs: 0, fats: 0, calories: 0 },
            price: 0,
            image: '',
            dietPreference: menuBasics.dietPreference,
            category: time,
          };
        }
      });
    });
    setMealsData(newMealsData);
  }, [selectedTimes, menuBasics.dietPreference, step]);

  // Supabase Image Upload - IMMEDIATE on file select
  const handleImageUpload = async (file: File, dayTimeKey: string) => {
    if (!file) return;

    setUploadLoading(prev => ({ ...prev, [dayTimeKey]: true }));

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `meals/${dayTimeKey}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('meal-images')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('meal-images')
        .getPublicUrl(fileName);

      setMealsData(prev => ({
        ...prev,
        [dayTimeKey]: {
          ...prev[dayTimeKey],
          image: publicUrl
        }
      }));

      console.log('✅ Image uploaded:', publicUrl);
    } catch (err: any) {
      console.error('❌ Image upload failed:', err);
      setError(`Image upload failed for ${dayTimeKey}: ${err.message}`);
    } finally {
      setUploadLoading(prev => ({ ...prev, [dayTimeKey]: false }));
    }
  };

  // Add subproduct
  const addSubProduct = (dayTimeKey: string) => {
    setMealsData(prev => ({
      ...prev,
      [dayTimeKey]: {
        ...prev[dayTimeKey],
        subProducts: [...(prev[dayTimeKey]?.subProducts || []), '']
      }
    }));
  };

  // Remove subproduct
  const removeSubProduct = (dayTimeKey: string, index: number) => {
    setMealsData(prev => ({
      ...prev,
      [dayTimeKey]: {
        ...prev[dayTimeKey],
        subProducts: (prev[dayTimeKey]?.subProducts || []).filter((_: string, i: number) => i !== index)
      }
    }));
  };

  // Update meal field
  const updateMealField = (dayTimeKey: string, field: keyof Meal, value: any) => {
    setMealsData(prev => ({
      ...prev,
      [dayTimeKey]: { 
        ...prev[dayTimeKey], 
        [field]: value 
      }
    }));
  };

  // ✅ FIXED: Create all meals with vendorId from user
  const createAllMeals = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);
    const newCreatedMeals: { _id: string; name: string }[] = [];

    try {
      for (const [dayTimeKey, mealData] of Object.entries(mealsData)) {
        if (!mealData.name.trim() || !mealData.image.trim()) continue;

        const mealPayload: Omit<Meal, '_id' | 'createdAt' | 'updatedAt' | '__v'> = {
          name: mealData.name,
          description: mealData.description,
          dietPreference: mealData.dietPreference,
          category: mealData.category,
          subProducts: mealData.subProducts.filter(p => p.trim()),
          nutritionalDetails: mealData.nutritionalDetails,
          price: mealData.price,
          image: mealData.image,
          vendorId: user.id, // ✅ FIXED: Current user's ID
        };

        const response = await apiRequest('/api/meal', 'POST', mealPayload, token);
        if (response?._id) {
          newCreatedMeals.push({ _id: response._id, name: mealData.name });
        }
      }

      setCreatedMeals(newCreatedMeals);
      setStep(4);
    } catch (err: any) {
      setError(err.message || 'Failed to create meals');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Submit menu with vendor from user
  const submitMenu = async () => {
    if (createdMeals.length === 0 || !user?.id) {
      setError('No meals created or user not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const menuItems = Object.keys(mealsData).map(dayTimeKey => {
        const [day, category] = dayTimeKey.split('-') as [DayOfWeek, MealCategory];
        const mealData = mealsData[dayTimeKey];
        const createdMeal = createdMeals.find(m => m.name === mealData.name);
        
        if (!createdMeal) return null;

        return {
          day,
          category,
          meal: createdMeal._id
        };
      }).filter((item): item is { day: DayOfWeek; category: MealCategory; meal: string } => item !== null);

      const menuPayload = {
        name: menuBasics.name,
        description: menuBasics.description,
        perDayPrice: 0,
        availableMealTimes: selectedTimes,
        menuItems,
        vendor: user.id, // ✅ FIXED: Current user's ID
      };

      const response = await apiRequest('/api/menu', 'POST', menuPayload, token);
      if (response) {
        router.push('/dashboard/menus');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create menu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/menus" className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-all">
            <HiArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Weekly Menu</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Step {step} of 4</span>
              <div className="flex gap-1">
                {[1,2,3,4].map(s => (
                  <div key={s} className={`w-2 h-2 rounded-full ${step >= s ? 'bg-blue-600' : 'bg-gray-300'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

                {/* STEP 1: Menu Basics */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border shadow-sm p-8 max-w-2xl">
            <h2 className="text-2xl font-bold mb-8 text-gray-900">Menu Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Menu Name *
                </label>
                <input
                  type="text"
                  value={menuBasics.name}
                  onChange={(e) =>
                    setMenuBasics({ ...menuBasics, name: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 text-gray-500 rounded-lg"
                  placeholder="Weekly Veg Special"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Diet Preference
                </label>
                <select
                  value={menuBasics.dietPreference}
                  onChange={(e) =>
                    setMenuBasics({
                      ...menuBasics,
                      dietPreference: e.target.value as DietPreference,
                    })
                  }
                  className="w-full p-3 text-gray-500 border border-gray-300 rounded-lg "
                >
                  <option value="All">All Diets</option>
                  <option value="Veg">Vegetarian</option>
                  <option value="Non-Veg">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={menuBasics.description}
                  onChange={(e) =>
                    setMenuBasics({
                      ...menuBasics,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 text-gray-500 border border-gray-300 rounded-lg focus:ring-2"
                  placeholder="Fresh weekly menu with balanced nutrition..."
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!menuBasics.name}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next: Select Meal Times
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Select Meal Times */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border shadow-sm p-8 max-w-lg">
            <h2 className="text-2xl font-bold mb-8 text-gray-900">Select Meal Times</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {mealTimes.map((time) => (
                <label
                  key={time}
                  className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-grey-900 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedTimes.includes(time)}
                    onChange={(e) => {
                      const newTimes = e.target.checked
                        ? [...selectedTimes, time]
                        : selectedTimes.filter((t) => t !== time);
                      setSelectedTimes(newTimes);
                    }}
                    className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-grey-900"
                  />
                  <span className="font-medium text-gray-800 capitalize">
                    {time}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 px-4  text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={selectedTimes.length === 0}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next: Create Meals ({selectedTimes.length}/3)
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Enhanced with Supabase Upload & Fixed Nutrition Layout */}
        {step === 3 && (
          <div className="space-y-6">
            {days.map((day) => (
              <div key={day} className="bg-white rounded-2xl border shadow-sm p-8">
                <h3 className="text-xl text-gray-900 font-bold mb-6 border-b pb-4">{day}</h3>
                <div className="grid  text-black grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedTimes.map((time) => {
                    const dayTimeKey = `${day}-${time}`;
                    const mealData = mealsData[dayTimeKey] || {
                      name: '',
                      description: '',
                      subProducts: [''],
                      nutritionalDetails: { protein: 0, carbs: 0, fats: 0, calories: 0 },
                      price: 0,
                      image: '',
                      dietPreference: menuBasics.dietPreference,
                      category: time,
                    };
                    const isUploading = uploadLoading[dayTimeKey];

                    return (
                      <div key={time} className="border rounded-xl p-6 hover:shadow-md transition-all">
                        <h4 className="font-semibold text-lg capitalize mb-6 flex items-center gap-2">
                          {time}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            mealData.name 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {mealData.name || 'Untitled'}
                          </span>
                        </h4>

                        {/* Name */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Food Name *</label>
                          <input
                            placeholder="Enter food name"
                            value={mealData.name}
                            onChange={(e) => updateMealField(dayTimeKey, 'name', e.target.value)}
                            className="w-full p-3 text-gray-700 border border-gray-200 rounded-lg  "
                          />
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                          <textarea
                            placeholder="Brief description of the meal"
                            value={mealData.description}
                            onChange={(e) => updateMealField(dayTimeKey, 'description', e.target.value)}
                            rows={2}
                            className="w-full p-3 text-gray-700  border border-gray-200 rounded-lg  "
                          />
                        </div>

                        {/* Sub Products */}
                        <div className="mb-6">
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Sub Products</label>
                          {mealData.subProducts.map((subProduct, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                              <input
                                value={subProduct}
                                onChange={(e) => {
                                  const newSubProducts = [...mealData.subProducts];
                                  newSubProducts[index] = e.target.value;
                                  updateMealField(dayTimeKey, 'subProducts', newSubProducts);
                                }}
                                placeholder={`Item ${index + 1} (e.g., Rice, Curry)`}
                                className="flex-1 p-3 w-[90%] text-gray-700 border border-gray-200 rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeSubProduct(dayTimeKey, index)}
                                className=" text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <HiTrash className="h-5 w-5" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addSubProduct(dayTimeKey)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 mt-1"
                          >
                            <HiPlus className="h-4 w-4" /> Add Item
                          </button>
                        </div>

                        {/* ✅ PROPERLY ALIGNED NUTRITION FIELDS */}
                        <div className="mb-6">
                          <label className="block text-sm font-semibold text-gray-700 mb-4">Nutritional Details (per serving)</label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Protein (g)</label>
                              <input
                                type="number"
                                min="0"
                                step="0.1"
                                value={mealData.nutritionalDetails.protein}
                                onChange={(e) => updateMealField(dayTimeKey, 'nutritionalDetails', {
                                  ...mealData.nutritionalDetails,
                                  protein: Number(e.target.value)
                                })}
                                className="w-full p-3 text-gray-700 border border-gray-200 rounded-lg "
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Carbs (g)</label>
                              <input
                                type="number"
                                min="0"
                                step="0.1"
                                value={mealData.nutritionalDetails.carbs}
                                onChange={(e) => updateMealField(dayTimeKey, 'nutritionalDetails', {
                                  ...mealData.nutritionalDetails,
                                  carbs: Number(e.target.value)
                                })}
                                className="w-full p-3  text-gray-700 border border-gray-200 rounded-lg "
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Fats (g)</label>
                              <input
                                type="number"
                                min="0"
                                step="0.1"
                                value={mealData.nutritionalDetails.fats}
                                onChange={(e) => updateMealField(dayTimeKey, 'nutritionalDetails', {
                                  ...mealData.nutritionalDetails,
                                  fats: Number(e.target.value)
                                })}
                                className="w-full p-3 text-gray-700 border border-gray-200 rounded-lg "
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Calories (kcal)</label>
                              <input
                                type="number"
                                min="0"
                                value={mealData.nutritionalDetails.calories}
                                onChange={(e) => updateMealField(dayTimeKey, 'nutritionalDetails', {
                                  ...mealData.nutritionalDetails,
                                  calories: Number(e.target.value)
                                })}
                                className="w-full p-3 text-gray-700 border border-gray-200 rounded-lg "
                              />
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="50"
                            value={mealData.price}
                            onChange={(e) => updateMealField(dayTimeKey, 'price', Number(e.target.value))}
                            className="w-full p-3 text-gray-700 border border-gray-200 rounded-lg "
                          />
                        </div>

                        {/* ✅ SUPABASE IMAGE UPLOAD - IMMEDIATE */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <HiCamera className="h-4 w-4" />
                            Meal Image * (Upload from media)
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file, dayTimeKey);
                              }}
                              className="w-full p-3 border border-dashed border-gray-300 rounded-xl hover:border-grey-400  cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {isUploading && (
                              <div className="absolute inset-0 bg-blue-50 bg-opacity-75 flex items-center justify-center rounded-xl">
                                <div className="text-sm text-blue-600 font-medium flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                  Uploading...
                                </div>
                              </div>
                            )}
                          </div>
                          {mealData.image && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-xs text-green-800 font-medium">✅ Uploaded:</p>
                              <a 
                                href={mealData.image} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline truncate block"
                              >
                                {mealData.image}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            
            <div className="flex gap-4 pt-8 border-t bg-gray-50 p-8 rounded-2xl">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-4 text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex-1"
              >
                Back
              </button>
              <button
                onClick={createAllMeals}
                disabled={loading}
                className="px-12 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-all flex items-center gap-2 flex-1 justify-center"
              >
                {loading ? 'Creating...' : 'Create All Meals & Review'}
                <HiCheck className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 remains the same */}
        {step === 4 && (
          <div className="bg-white rounded-2xl border shadow-sm p-8 max-w-2xl">
            {/* Review content */}
            <div className="flex gap-4">
              <button onClick={() => setStep(3)} className="px-8 py-4 border rounded-xl hover:bg-gray-50 flex-1">Edit Meals</button>
              <button
                onClick={submitMenu}
                disabled={loading}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 flex-1 flex items-center justify-center gap-2"
              >
                {loading ? 'Creating Menu...' : 'Create Menu'}
                <HiCheck className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuCreatePage;
