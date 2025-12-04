'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import Link from 'next/link';
import { 
  HiArrowLeft, 
  HiOfficeBuilding, 
  HiMail, 
  HiLockClosed,
  HiUser,
  HiCheckCircle,
  HiExclamationCircle
} from 'react-icons/hi';

const VendorCreatePage = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  // Password strength evaluation
  const evaluatePasswordStrength = (password: string): { strength: string; score: number; color: string } => {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { strength: 'Weak', score, color: 'bg-red-500' };
    if (score <= 4) return { strength: 'Medium', score, color: 'bg-yellow-500' };
    return { strength: 'Strong', score, color: 'bg-green-500' };
  };

  const passwordStrength = formData.password ? evaluatePasswordStrength(formData.password) : null;

  // Form validation
  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!token) {
      setError('Authentication required');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiRequest('/api/admin/vendor/new', 'POST', formData, token);
      
      if (response) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard/vendors');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create vendor');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/dashboard/vendors"
            className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
          >
            <HiArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform" />
            Back to Vendors
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Vendor</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Add a new vendor to your platform</p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl flex items-center gap-3 animate-fadeIn">
            <HiCheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-800">Vendor created successfully!</p>
              <p className="text-xs text-green-700 mt-0.5">Redirecting to vendors list...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl flex items-start gap-3">
            <HiExclamationCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">Error</p>
              <p className="text-sm text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HiOfficeBuilding className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                    fieldErrors.companyName 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-[#3CB371] focus:border-[#3CB371]'
                  }`}
                  placeholder="e.g., Acme Corporation"
                />
              </div>
              {fieldErrors.companyName && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <HiExclamationCircle className="h-3 w-3" />
                  {fieldErrors.companyName}
                </p>
              )}
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                    fieldErrors.name 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-[#3CB371] focus:border-[#3CB371]'
                  }`}
                  placeholder="e.g., John Doe"
                />
              </div>
              {fieldErrors.name && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <HiExclamationCircle className="h-3 w-3" />
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                    fieldErrors.email 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-[#3CB371] focus:border-[#3CB371]'
                  }`}
                  placeholder="vendor@example.com"
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <HiExclamationCircle className="h-3 w-3" />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                    fieldErrors.password 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-[#3CB371] focus:border-[#3CB371]'
                  }`}
                  placeholder="Minimum 8 characters"
                />
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && passwordStrength && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">Password Strength:</span>
                    <span className={`text-xs font-semibold ${
                      passwordStrength.strength === 'Weak' ? 'text-red-600' :
                      passwordStrength.strength === 'Medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrength.strength}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                    ></div>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500">
                    Use 8+ characters with uppercase, lowercase, numbers & symbols
                  </p>
                </div>
              )}
              
              {fieldErrors.password && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <HiExclamationCircle className="h-3 w-3" />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-[#3CB371] text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold hover:bg-[#35a065] focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </span>
                ) : success ? (
                  <span className="flex items-center justify-center gap-2">
                    <HiCheckCircle className="w-5 h-5" />
                    Created Successfully!
                  </span>
                ) : (
                  'Create Vendor'
                )}
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs sm:text-sm text-blue-800">
              <span className="font-semibold">Note:</span> The vendor will receive login credentials at the provided email address. They can change their password after first login.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorCreatePage;
