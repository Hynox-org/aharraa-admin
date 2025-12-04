"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiShieldCheck } from 'react-icons/hi';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/lib/authContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiRequest<{ message: string; accessToken: string; role: string }>(
        '/auth/login',
        'POST',
        { email, password }
      );

      console.log('Login successful:', data);
      auth.login(data.accessToken);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-3 sm:px-4 py-6">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white border border-gray-200 shadow-xl rounded-xl sm:rounded-2xl px-5 sm:px-8 py-7 sm:py-10">
          
          {/* Logo Section */}
          <div className="flex justify-center mb-5 sm:mb-6">
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-lg sm:rounded-xl overflow-hidden shadow-md border-2 border-gray-100">
              <img 
                src="https://qlgusdrybvqzckgizmco.supabase.co/storage/v1/object/public/Files/aharra_logo_color.jpg" 
                alt="Aharraa Logo" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Header Text */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2">
              Admin Login
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Email Field */}
            <div>
              <label 
                className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2" 
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiMail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="admin@aharraa.com"
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label 
                className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2" 
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiLockClosed className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <HiEyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <HiEye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div 
                className="bg-red-50 border-l-4 border-red-500 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm flex items-start gap-2 sm:gap-3"
                role="alert"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="flex-1">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 sm:px-6 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base text-white font-semibold bg-[#3CB371] rounded-lg sm:rounded-xl hover:bg-[#35a065] focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Security Badge */}
          <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500">
              <HiShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3CB371]" />
              <span>Secure admin access</span>
            </div>
          </div>
        </div>

        {/* Additional Info - Optional */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-[10px] sm:text-xs text-gray-500">
            Protected by industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
