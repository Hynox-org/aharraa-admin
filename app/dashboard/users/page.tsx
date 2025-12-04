"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import { UserProfile } from '@/lib/types';
import { 
  HiUsers, 
  HiMail, 
  HiPhone, 
  HiCalendar, 
  HiRefresh, 
  HiX,
  HiSearch,
  HiFilter
} from 'react-icons/hi';

const UsersPage = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const fetchUsers = async () => {
    if (!token) {
      setLoading(false);
      setError("Authentication token not found.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest<UserProfile[]>("/api/admin/users", "GET", null, token);
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users.");
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (date: string | Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    
    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.fullName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.phoneNumber?.includes(query) ||
      user._id?.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

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
            <p className="text-sm text-gray-500">Loading users...</p>
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Users</h1>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-8 sm:p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiX className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load users</h3>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchUsers}
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Manage registered users and their profiles</p>
          </div>
          <button
            onClick={fetchUsers}
            className="p-2 sm:p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Refresh users"
          >
            <HiRefresh className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>

        {/* Search & Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-black" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-black w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <HiX className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Total Count */}
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white rounded-lg border border-gray-200 w-fit">
            <HiUsers className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
            <span className="text-xs sm:text-sm font-semibold text-gray-700">
              {filteredUsers.length} {filteredUsers.length === users.length ? 'Total' : `of ${users.length}`}
            </span>
          </div>
        </div>
      </div>

      {/* Users Table/List */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-8 sm:p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiUsers className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No matching users found' : 'No users found'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {searchQuery 
                ? `Try adjusting your search query` 
                : 'Registered users will appear here.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-sm font-medium text-[#3CB371] hover:text-[#2d9158]"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Joined</th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-[#3CB371] to-[#2FA05E] flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {user.fullName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{user.fullName || 'N/A'}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <HiMail className="h-3 w-3" />
                              <span className="truncate max-w-[200px]">{user.email || 'No email'}</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <HiPhone className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{user.phoneNumber || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <HiCalendar className="h-4 w-4 text-gray-400" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          #{user._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredUsers.map((user) => (
              <div 
                key={user._id} 
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all"
              >
                {/* User Info */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#3CB371] to-[#2FA05E] flex items-center justify-center text-white font-bold text-base shadow-md flex-shrink-0">
                    {user.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{user.fullName || 'N/A'}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate">
                      <HiMail className="h-3 w-3 flex-shrink-0" />
                      {user.email || 'No email'}
                    </p>
                  </div>
                </div>

                {/* Contact & Date */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1">Phone</p>
                    <div className="flex items-center gap-1 text-xs text-gray-700">
                      <HiPhone className="h-3 w-3 text-gray-400" />
                      <span className="font-medium">{user.phoneNumber || 'N/A'}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1">Joined</p>
                    <div className="flex items-center gap-1 text-xs text-gray-700">
                      <HiCalendar className="h-3 w-3 text-gray-400" />
                      <span className="font-medium">{formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* ID */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    ID: #{user._id.slice(-8).toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UsersPage;
