import Link from 'next/link';
import { ArrowRight, ChefHat, Clock, ShieldCheck, Users, TrendingUp, Award, Zap } from 'lucide-react';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-3 sm:px-4 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
            <div className="inline-block mb-3 sm:mb-4">
              <span className="bg-green-50 text-[#3CB371] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border border-green-200">
                Admin Portal v1.0
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight px-2">
              Manage <span className="text-[#3CB371]">Fresh, Home-Cooked</span> Meals Delivery
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Powerful admin portal to orchestrate orders, manage talented home chefs, 
              coordinate delivery operations, and ensure quality across your meal subscription platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6 px-4">
              <Link 
                href="/dashboard"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#3CB371] text-white font-semibold rounded-lg hover:bg-[#35a065] transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 text-sm sm:text-base"
              >
                Access Portal
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              
              <Link 
                href="https://aharraa.com"
                target="_blank"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#3CB371] font-semibold rounded-lg border-2 border-[#3CB371] hover:bg-green-50 transition-all duration-200 active:scale-95 text-sm sm:text-base"
              >
                View Customer Site
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Three Portals, One Platform
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
                Role-based dashboards designed for administrators, home chefs, and delivery personnel
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
              {/* Admin Portal Card */}
              <div className="group bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border-2 border-gray-200 hover:border-[#3CB371] hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-[#3CB371] to-[#2FA05E] w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-md">
                  <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Admin Dashboard</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Complete platform oversight with order management, vendor onboarding, delivery coordination, and financial analytics.
                </p>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-[#3CB371] mr-2 font-bold">✓</span>
                    Order orchestration & assignment
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3CB371] mr-2 font-bold">✓</span>
                    Vendor & chef management
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3CB371] mr-2 font-bold">✓</span>
                    Revenue & payout tracking
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#3CB371] mr-2 font-bold">✓</span>
                    Customer support tools
                  </li>
                </ul>
              </div>

              {/* Vendor Portal Card */}
              <div className="group bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-md">
                  <ChefHat className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Vendor Portal</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Empower home chefs to manage orders, update menus, track earnings, and maintain their culinary operations.
                </p>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">✓</span>
                    Real-time order acceptance
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">✓</span>
                    Menu & availability control
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">✓</span>
                    Earnings dashboard
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 font-bold">✓</span>
                    Customer feedback access
                  </li>
                </ul>
              </div>

              {/* Delivery Portal Card */}
              <div className="group bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border-2 border-gray-200 hover:border-amber-500 hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-md">
                  <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Delivery Portal</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Streamline delivery operations with assignment tracking, status updates, and earnings management for delivery personnel.
                </p>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 font-bold">✓</span>
                    Assigned deliveries view
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 font-bold">✓</span>
                    Real-time status updates
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 font-bold">✓</span>
                    Proof of delivery capture
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 font-bold">✓</span>
                    Availability scheduling
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Why Aharraa Section */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Why Choose Aharraa?
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Our commitment to quality, freshness, and community
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-green-50 to-white rounded-lg sm:rounded-xl border border-green-100 hover:shadow-lg hover:border-[#3CB371] transition-all duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#3CB371]" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Fresh Ingredients</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Locally-sourced, organic ingredients prepared daily
                  </p>
                </div>

                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-white rounded-lg sm:rounded-xl border border-blue-100 hover:shadow-lg hover:border-blue-500 transition-all duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Expert Chefs</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Home chefs with years of culinary experience
                  </p>
                </div>

                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-amber-50 to-white rounded-lg sm:rounded-xl border border-amber-100 hover:shadow-lg hover:border-amber-500 transition-all duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Quick Delivery</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Hot meals delivered within 2 hours of preparation
                  </p>
                </div>

                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-white rounded-lg sm:rounded-xl border border-purple-100 hover:shadow-lg hover:border-purple-500 transition-all duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Quality Assured</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Every meal meets our strict quality standards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-[#3CB371] to-[#2FA05E] text-white">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2">1000+</div>
                <div className="text-xs sm:text-sm text-green-100">Daily Orders</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2">150+</div>
                <div className="text-xs sm:text-sm text-green-100">Home Chefs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2">50+</div>
                <div className="text-xs sm:text-sm text-green-100">Delivery Partners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2">4.8★</div>
                <div className="text-xs sm:text-sm text-green-100">Customer Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-3 sm:px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 px-4">
                Ready to Manage Your Operations?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 px-4">
                Access your role-specific dashboard and start managing fresh, home-cooked meal deliveries today.
              </p>
              <div className="pt-2 sm:pt-4">
                <Link 
                  href="/login"
                  className="inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 bg-[#3CB371] text-white font-semibold rounded-lg hover:bg-[#35a065] transition-all duration-200 shadow-lg hover:shadow-xl text-base sm:text-lg active:scale-95"
                >
                  Login to Portal
                  <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
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
