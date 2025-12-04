'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { HiMenuAlt3, HiX, HiLogout, HiLogin } from 'react-icons/hi';
import { useAuth } from '@/lib/authContext';

export default function HeaderLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          scrolled 
            ? 'border-b border-gray-200 shadow-md' 
            : 'border-b border-gray-100 shadow-sm'
        }`}
      >
        <nav className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-md sm:rounded-lg overflow-hidden shadow-sm border border-gray-200 group-hover:border-[#3CB371] transition-all duration-200">
                <img 
                  src="https://qlgusdrybvqzckgizmco.supabase.co/storage/v1/object/public/Files/aharra_logo_color.jpg" 
                  alt="Aharraa Logo" 
                  className="h-full w-full object-cover"
                />
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 group-hover:text-[#3CB371] transition-colors duration-200">
                Aharraa
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              <Link 
                href="https://aharraa.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 lg:px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#3CB371] hover:bg-green-50 rounded-lg transition-all duration-200"
              >
                Customer Site
              </Link>
              <Link 
                href="https://aharraa.com/about" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 lg:px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#3CB371] hover:bg-green-50 rounded-lg transition-all duration-200"
              >
                About Us
              </Link>
              <Link 
                href="https://aharraa.com/contact" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 lg:px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#3CB371] hover:bg-green-50 rounded-lg transition-all duration-200"
              >
                Contact
              </Link>
              
              {/* Auth Button - Desktop */}
              <div className="ml-2 lg:ml-4 pl-2 lg:pl-4 border-l border-gray-200">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 px-4 lg:px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 active:scale-95"
                  >
                    <HiLogout className="w-4 h-4" />
                    <span className="hidden lg:inline">Logout</span>
                    <span className="lg:hidden">Exit</span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-4 lg:px-5 py-2 bg-gradient-to-r from-[#3CB371] to-[#2FA05E] text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-[#35a065] hover:to-[#288a51] transition-all duration-200 active:scale-95"
                  >
                    <HiLogin className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <HiX className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" />
              ) : (
                <HiMenuAlt3 className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" />
              )}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 sm:py-4 border-t border-gray-100 bg-white animate-slideDown">
              <div className="flex flex-col space-y-1">
                <Link 
                  href="https://aharraa.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-[#3CB371] rounded-lg transition-all active:bg-green-100"
                  onClick={closeMobileMenu}
                >
                  Customer Site
                </Link>
                <Link 
                  href="https://aharraa.com/about" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-[#3CB371] rounded-lg transition-all active:bg-green-100"
                  onClick={closeMobileMenu}
                >
                  About Us
                </Link>
                <Link 
                  href="https://aharraa.com/contact" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-[#3CB371] rounded-lg transition-all active:bg-green-100"
                  onClick={closeMobileMenu}
                >
                  Contact
                </Link>
                
                {/* Auth Button - Mobile */}
                <div className="px-3 sm:px-4 pt-2 sm:pt-3">
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg active:scale-95 transition-all"
                    >
                      <HiLogout className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 sm:py-3 bg-gradient-to-r from-[#3CB371] to-[#2FA05E] text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg active:scale-95 transition-all"
                      onClick={closeMobileMenu}
                    >
                      <HiLogin className="w-4 h-4" />
                      <span>Login</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden animate-fadeIn"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}
