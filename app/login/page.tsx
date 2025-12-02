"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
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
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md px-8 py-10 bg-white border border-black-200 shadow-lg rounded-xl">
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-lg overflow-hidden shadow-sm border border-black-200">
            <img 
              src="https://qlgusdrybvqzckgizmco.supabase.co/storage/v1/object/public/Files/aharra_logo_color.jpg" 
              alt="Aharraa Logo" 
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <h3 className="text-3xl font-bold text-center text-black mb-2">Admin Login</h3>
        <p className="text-center text-black text-sm mb-8">Enter your credentials to access your account</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-black mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiMail className="h-5 w-5 text-black" />
              </div>
              <input
                type="email"
                placeholder="admin@aharraa.com"
                className="w-full pl-10 pr-4 py-3 border text-black border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-transparent transition-all"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-black mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiLockClosed className="h-5 w-5 text-black" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 text-black border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-transparent transition-all"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <HiEyeOff className="h-5 w-5 text-black hover:text-black" />
                ) : (
                  <HiEye className="h-5 w-5 text-black hover:text-black" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-3 text-white font-semibold bg-[#3CB371] rounded-lg hover:bg-[#35a065] focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

        {/* Footer */}
        {/* <div className="mt-6 text-center">
          <a href="/forgot-password" className="text-sm text-black hover:text-[#3CB371] transition-colors">
            Forgot your password?
          </a>
        </div> */}
      </div>
    </div>
  );
};

export default LoginPage;
