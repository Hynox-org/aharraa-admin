// lib/types.ts
import React from 'react';

// ============================================
// Authentication & User Types
// ============================================

export interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: string; // Add role property
}

export interface ValidateTokenResponse {
  message: string;
  user: User;
}

export interface DeliveryLocation {
  street: string;
  state: string;
  pincode: string;
  lat: number;
  lon: number;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  supabaseId: string;
  fullName: string;
  phoneNumber: string;
  breakfastDeliveryLocation?: DeliveryLocation;
  lunchDeliveryLocation?: DeliveryLocation;
  dinnerDeliveryLocation?: DeliveryLocation;
  createdAt: string;
  updatedAt: string;
}

export interface AuthApiResponse {
  accessToken?: string;
  message?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, returnUrl?: string) => void;
  logout: () => void;
  token: string | null;
}

// ============================================
// UI Component Types
// ============================================

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  icon: string;
  gradient: string;
}

export interface Highlight {
  icon: string;
  title: string;
  description: string;
  iconComponent: React.ElementType;
  gradient: string;
}

export interface Review {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  gradient: string;
}

export interface PersonDetails {
  name: string;
  phoneNumber: string;
}

// ============================================
// Core Business Types
// ============================================

export type DietPreference = "All" | "Veg" | "Non-Veg" | "Vegan" | "Custom";
export type MealCategory = "Breakfast" | "Lunch" | "Dinner";
export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

// ============================================
// Vendor Schema
// ============================================

export interface Vendor {
  _id: string;
  name: string;
  description?: string;
  email?: string;
  image?: string;
  rating?: number;
  menus?: string[]; // Array of Menu IDs
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// ============================================
// Meal Schema
// ============================================

export interface NutritionalDetails {
  protein: number; // in grams
  carbs: number; // in grams
  fats: number; // in grams
  calories: number; // in kcal
}

export interface Meal {
  _id: string;
  name: string;
  description: string;
  dietPreference: DietPreference;
  category: MealCategory;
  subProducts: string[]; // e.g., ["Rice", "Curry", "Salad"]
  nutritionalDetails: NutritionalDetails;
  price: number;
  image: string;
  vendorId: string; // Reference to Vendor._id
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// ============================================
// Menu Schema (NEW - synced with backend)
// ============================================

export interface MenuItem {
  day: DayOfWeek;
  category: MealCategory;
  meal: string; // Meal ID reference
}

export interface Menu {
  _id: string;
  name: string;
  vendor: string; // Vendor ID reference
  coverImage?: string | null;
  description?: string;
  perDayPrice: number;
  menuItems: MenuItem[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// Populated Menu (when meal is populated)
export interface MenuItemWithPopulatedMeal extends Omit<MenuItem, 'meal'> {
  meal: Meal; // Populated Meal object
}

export interface MenuWithPopulatedMeals extends Omit<Menu, 'menuItems'> {
  menuItems: MenuItemWithPopulatedMeal[];
}

// ============================================
// Plan Schema
// ============================================

export interface Plan {
  _id: string;
  name: string; // e.g., "3-Day Plan", "5-Day Plan", "7-Day Plan"
  durationDays: 3 | 5 | 7;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// ============================================
// Accompaniment Schema (NEW - synced with backend)
// ============================================

export interface Accompaniment {
  _id: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// ============================================
// Delivery Address Schema
// ============================================

export interface DeliveryAddress {
  street: string;
  city: string;
  zip: string;
  lat?: number;
  lon?: number;
}

// For storage/display purposes
export interface DeliveryAddressDocument {
  _id: string;
  userId: string;
  street: string;
  city: string;
  zip: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// ============================================
// Cart Schema
// ============================================

export interface CartItem {
  _id: string;
  user: string; // User ID reference
  menu: string | Menu | MenuWithPopulatedMeals; // Menu ID reference, Menu, or MenuWithPopulatedMeals
  plan: string | Plan; // Plan ID reference or populated Plan
  quantity: number;
  personDetails?: PersonDetails[];
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  itemTotalPrice: number;
  addedDate: string;
  vendor: string; // Vendor ID reference
  __v?: number;
}

// Populated CartItem (when menu and plan are populated)
export interface PopulatedCartItem extends Omit<CartItem, 'menu' | 'plan'> {
  menu: Menu | MenuWithPopulatedMeals; // Can be either populated or not
  plan: Plan;
}

export interface Cart {
  _id: string;
  user: string; // User ID reference
  items: string[] | CartItem[]; // Array of CartItem IDs or populated CartItems
  totalItems: number;
  cartTotalPrice: number;
  lastUpdated: string;
  createdAt: string;
  __v?: number;
}

// ============================================
// Order Schema
// ============================================

export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled" | "failed";
export type PaymentStatus = "SUCCESS" | "FAILED" | "PENDING";

export interface OrderItem {
  id: string; // Unique identifier for the order item
  menu: string | Menu; // Menu ID reference
  plan: string | Plan; // Plan ID reference
  quantity: number;
  personDetails?: PersonDetails[];
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  skippedDates?: string[]; // Array of ISO date strings
  itemTotalPrice: number;
  vendor: string | Vendor; // Vendor ID reference
}

// Populated OrderItem (when references are populated)
export interface PopulatedOrderItem extends Omit<OrderItem, 'menu' | 'plan' | 'vendor'> {
  menu: { id: string; name?: string; coverImage?: string | null };
  plan: { id: string; name?: string };
  vendor: { id: string; name?: string };
}

export interface PaymentDetails {
  cfPaymentId?: string;
  status?: PaymentStatus;
  paymentTime?: string;
  bankReference?: string;
  method?: string;
}

export interface Order {
  _id: string;
  user: string; // User ID reference
  items: OrderItem[];
  paymentMethod: string;
  totalAmount: number;
  currency: string;
  orderDate: string; // ISO date string
  status: OrderStatus;
  paymentSessionId?: string;
  paymentDetails?: PaymentDetails;
  paymentConfirmedAt?: string;
  deliveryAddresses: Record<MealCategory, DeliveryAddress>; // Map of meal category to delivery address
  invoiceUrl?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// Populated Order (when user is populated)
export interface PopulatedOrder extends Omit<Order, 'user' | 'items'> {
  user: UserProfile;
  items: PopulatedOrderItem[];
}

// ============================================
// Payment Types
// ============================================

export type PaymentMethod = "COD" | "CC" | "UPI";

export interface CreatePaymentPayload {
  userId: string;
  checkoutData: CheckoutData;
  paymentMethod: PaymentMethod;
  totalAmount: number; // Minimum 0
  currency: string; // e.g., "INR"
}

// ============================================
// Checkout Types
// ============================================

export interface CheckoutItemView {
  id: string; // Unique ID from CartItem
  menu: { id: string; name: string; coverImage?: string }; // Changed from meal to menu
  plan: { id: string; name: string; durationDays?: number };
  quantity: number;
  personDetails?: PersonDetails[];
  startDate: string;
  endDate: string;
  itemTotalPrice: number;
  vendor: { id: string; name: string };
}

export interface CheckoutItem {
  id: string; // Unique ID from CartItem
  menu: string; // Changed from meal to menu
  plan: string;
  quantity: number;
  personDetails?: PersonDetails[];
  startDate: string;
  endDate: string;
  itemTotalPrice: number;
  vendor: string;
}

export interface CheckoutData {
  id: string; // Unique ID for checkout session/order
  userId: string;
  items: CheckoutItem[];
  deliveryAddresses: {
    Breakfast?: DeliveryAddress;
    Lunch?: DeliveryAddress;
    Dinner?: DeliveryAddress;
  };
  totalPrice: number;
  checkoutDate: string; // Timestamp when checkout data was finalized
}

// ============================================
// Store Types (Zustand/State Management)
// ============================================
export interface Store {
  returnUrl: string;
  setReturnUrl: (url: string) => void;
}
export type MealType = "breakfast" | "lunch" | "dinner";

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

// ============================================
// Contact Info Type
// ============================================

export interface ContactInfo {
  phone: string;
  email: string;
}
