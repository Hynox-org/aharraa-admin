import Link from 'next/link';
import { ChefHat, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function FooterLanding() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="https://qlgusdrybvqzckgizmco.supabase.co/storage/v1/object/public/Files/aharra_logo_color.jpg" 
                alt="Aharraa Logo" 
                className="h-10 w-auto" 
              />
              <h3 className="text-2xl font-bold text-white">Aharraa</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Fresh, home-cooked meals delivered to your door. Experience the warmth of 
              home-style cooking with meals prepared by talented chefs.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-orange-600 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-orange-600 transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-orange-600 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-orange-600 transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Portal Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Portal Access</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/login" className="text-sm hover:text-orange-500 transition-colors flex items-center">
                  <span className="mr-2">→</span> Admin Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm hover:text-orange-500 transition-colors flex items-center">
                  <span className="mr-2">→</span> Vendor Portal
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm hover:text-orange-500 transition-colors flex items-center">
                  <span className="mr-2">→</span> Delivery Portal
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm hover:text-orange-500 transition-colors flex items-center">
                  <span className="mr-2">→</span> Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="https://aharraa.com" target="_blank" className="text-sm hover:text-orange-500 transition-colors flex items-center">
                  <span className="mr-2">→</span> Customer Site
                </Link>
              </li>
              <li>
                <Link href="https://aharraa.com/about" target="_blank" className="text-sm hover:text-orange-500 transition-colors flex items-center">
                  <span className="mr-2">→</span> About Us
                </Link>
              </li>
              <li>
                <Link href="https://aharraa.com/contact" target="_blank" className="text-sm hover:text-orange-500 transition-colors flex items-center">
                  <span className="mr-2">→</span> Contact Us
                </Link>
              </li>
              <li>
                <Link href="https://aharraa.com/terms-and-conditions" target="_blank" className="text-sm hover:text-orange-500 transition-colors flex items-center">
                  <span className="mr-2">→</span> Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="https://aharraa.com/privacy-policy" target="_blank" className="text-sm hover:text-orange-500 transition-colors flex items-center">
                  <span className="mr-2">→</span> Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start text-sm">
                <MapPin className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-center text-sm">
                <Phone className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                <a href="tel:+911234567890" className="hover:text-orange-500 transition-colors">
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-center text-sm">
                <Mail className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                <a href="mailto:admin@aharraa.com" className="hover:text-orange-500 transition-colors">
                  admin@aharraa.com
                </a>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400 mb-2">Admin Support Hours</p>
              <p className="text-sm font-medium text-white">Mon - Sat: 9:00 AM - 9:00 PM</p>
              <p className="text-sm font-medium text-white">Sunday: 10:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {currentYear} Aharraa. All rights reserved. Built with ❤️ for fresh, home-cooked meals.
            </p>
            <div className="flex items-center space-x-6">
              <Link href="https://aharraa.com/terms-and-conditions" target="_blank" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                Terms
              </Link>
              <Link href="https://aharraa.com/privacy-policy" target="_blank" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                Privacy
              </Link>
              <span className="text-sm text-gray-400">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
