'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function HeaderLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream border-b border-olive/20 shadow-sm">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <img 
              src="https://qlgusdrybvqzckgizmco.supabase.co/storage/v1/object/public/Files/aharra_logo_color.jpg" 
              alt="Aharraa Logo" 
              className="h-10 w-auto rounded shadow-sm border-2 border-olive/10"
            />
            <h1 className="text-2xl font-bold text-olive group-hover:text-burnt transition-colors">
              Aharraa
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="https://aharraa.com" 
              target="_blank"
              className="text-darkolive hover:text-burnt font-medium transition-colors"
            >
              Customer Site
            </Link>
            <Link 
              href="https://aharraa.com/about" 
              target="_blank"
              className="text-darkolive hover:text-burnt font-medium transition-colors"
            >
              About Us
            </Link>
            <Link 
              href="https://aharraa.com/contact" 
              target="_blank"
              className="text-darkolive hover:text-burnt font-medium transition-colors"
            >
              Contact
            </Link>
            <Link 
              href="/login"
              className="px-6 py-2.5 bg-mustard text-cream font-semibold rounded-lg shadow-md hover:bg-burnt hover:shadow-lg transition-colors"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-olive/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen
              ? (<X className="h-6 w-6 text-darkolive" />)
              : (<Menu className="h-6 w-6 text-darkolive" />)
            }
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-olive/20 bg-cream">
            <div className="flex flex-col space-y-3">
              <Link 
                href="https://aharraa.com" 
                target="_blank"
                className="px-4 py-2 text-darkolive hover:bg-olive/10 hover:text-burnt rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Customer Site
              </Link>
              <Link 
                href="https://aharraa.com/about" 
                target="_blank"
                className="px-4 py-2 text-darkolive hover:bg-olive/10 hover:text-burnt rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="https://aharraa.com/contact" 
                target="_blank"
                className="px-4 py-2 text-darkolive hover:bg-olive/10 hover:text-burnt rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                href="/login"
                className="mx-4 px-6 py-2.5 bg-mustard text-cream font-semibold rounded-lg hover:bg-burnt transition-colors text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
