'use client';

import Link from 'next/link';
import { useState } from 'react';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { useAuth } from '@/lib/authContext'; // Import useAuth

export default function HeaderLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth(); // Use the auth hook

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false); // Close mobile menu on logout
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative h-10 w-10 rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <img 
                src="https://qlgusdrybvqzckgizmco.supabase.co/storage/v1/object/public/Files/aharra_logo_color.jpg" 
                alt="Aharraa Logo" 
                className="h-full w-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-black group-hover:text-[#3CB371] transition-colors duration-200">
              Aharraa
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link 
              href="https://aharraa.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#3CB371] hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              Customer Site
            </Link>
            <Link 
              href="https://aharraa.com/about" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#3CB371] hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              About Us
            </Link>
            <Link 
              href="https://aharraa.com/contact" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#3CB371] hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              Contact
            </Link>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="ml-4 px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg transition-all duration-200"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="ml-4 px-6 py-2.5 bg-[#3CB371] text-white font-semibold rounded-lg shadow-md hover:bg-[#35a065] hover:shadow-lg transition-all duration-200"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <HiX className="h-6 w-6 text-black" />
            ) : (
              <HiMenuAlt3 className="h-6 w-6 text-black" />
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white animate-fadeIn">
            <div className="flex flex-col space-y-1">
              <Link 
                href="https://aharraa.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#3CB371] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Customer Site
              </Link>
              <Link 
                href="https://aharraa.com/about" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#3CB371] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="https://aharraa.com/contact" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#3CB371] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="px-4 pt-2">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-center"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full px-6 py-3 bg-[#3CB371] text-white font-semibold rounded-lg hover:bg-[#35a065] transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
