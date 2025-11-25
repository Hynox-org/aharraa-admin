import Link from 'next/link';
import { ArrowRight, ChefHat, Clock, ShieldCheck, Users } from 'lucide-react';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block mb-4">
              <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
                Admin Portal v1.0
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Manage <span className="text-orange-600">Fresh, Home-Cooked</span> Meals Delivery
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful admin portal to orchestrate orders, manage talented home chefs, 
              coordinate delivery operations, and ensure quality across your meal subscription platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link 
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Access Portal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              
              <Link 
                href="https://aharraa.com"
                target="_blank"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg border-2 border-orange-600 hover:bg-orange-50 transition-colors"
              >
                View Customer Site
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Three Portals, One Platform
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Role-based dashboards designed for administrators, home chefs, and delivery personnel
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Admin Portal Card */}
              <div className="group bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border-2 border-orange-200 hover:border-orange-400 hover:shadow-2xl transition-all duration-300">
                <div className="bg-orange-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Admin Dashboard</h3>
                <p className="text-gray-600 mb-4">
                  Complete platform oversight with order management, vendor onboarding, delivery coordination, and financial analytics.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    Order orchestration & assignment
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    Vendor & chef management
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    Revenue & payout tracking
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    Customer support tools
                  </li>
                </ul>
              </div>

              {/* Vendor Portal Card */}
              <div className="group bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border-2 border-green-200 hover:border-green-400 hover:shadow-2xl transition-all duration-300">
                <div className="bg-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ChefHat className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Vendor Portal</h3>
                <p className="text-gray-600 mb-4">
                  Empower home chefs to manage orders, update menus, track earnings, and maintain their culinary operations.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Real-time order acceptance
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Menu & availability control
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Earnings dashboard
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Customer feedback access
                  </li>
                </ul>
              </div>

              {/* Delivery Portal Card */}
              <div className="group bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300">
                <div className="bg-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Delivery Portal</h3>
                <p className="text-gray-600 mb-4">
                  Streamline delivery operations with assignment tracking, status updates, and earnings management for delivery personnel.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    Assigned deliveries view
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    Real-time status updates
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    Proof of delivery capture
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    Availability scheduling
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Why Aharraa Section */}
        <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-orange-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Why Choose Aharraa?
                </h2>
                <p className="text-gray-600">
                  Our commitment to quality, freshness, and community
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
                  <div className="text-4xl mb-4">🌿</div>
                  <h3 className="font-bold text-gray-900 mb-2">Fresh Ingredients</h3>
                  <p className="text-sm text-gray-600">
                    Locally-sourced, organic ingredients prepared daily
                  </p>
                </div>

                <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
                  <div className="text-4xl mb-4">👨‍🍳</div>
                  <h3 className="font-bold text-gray-900 mb-2">Expert Chefs</h3>
                  <p className="text-sm text-gray-600">
                    Home chefs with years of culinary experience
                  </p>
                </div>

                <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="font-bold text-gray-900 mb-2">Quick Delivery</h3>
                  <p className="text-sm text-gray-600">
                    Hot meals delivered within 2 hours of preparation
                  </p>
                </div>

                <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="font-bold text-gray-900 mb-2">Quality Assured</h3>
                  <p className="text-sm text-gray-600">
                    Every meal meets our strict quality standards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-orange-600 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
                <div className="text-orange-100">Daily Orders</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">150+</div>
                <div className="text-orange-100">Home Chefs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
                <div className="text-orange-100">Delivery Partners</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">4.8★</div>
                <div className="text-orange-100">Customer Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Ready to Manage Your Operations?
              </h2>
              <p className="text-lg text-gray-600">
                Access your role-specific dashboard and start managing fresh, home-cooked meal deliveries today.
              </p>
              <div className="pt-4">
                <Link 
                  href="/login"
                  className="inline-flex items-center justify-center px-10 py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl text-lg"
                >
                  Login to Portal
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}