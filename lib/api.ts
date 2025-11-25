export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import {
  User,
  ValidateTokenResponse,
  CreatePaymentPayload,
  Order,
  UserProfile,
  Meal,
  Plan,
  Vendor,
  Cart,
  CartItem,
  PersonDetails,
  Menu,
  MenuWithPopulatedMeals // Changed from PopulatedMenu
} from "./types";


export async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body: Record<string, unknown> | null = null,
  token: string | null = null
): Promise<T> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const payload = body;

  try {
    console.log(" API Request:", {
      url: `${API_URL}${endpoint}`,
      method,
      headers,
      // payloadSent: payload, // Removed debugging log
      body: method !== "GET" && method !== "DELETE" ? JSON.stringify(payload) : null,
    });

    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: method !== "GET" && method !== "DELETE" ? JSON.stringify(payload) : null,
    });

    let data: any = {};
    try {
      data = await res.json();
    } catch {
      console.warn("⚠️ Response not JSON or empty");
    }

    if (!res.ok) {
      console.error("❌ API Error:", res?.status, data);
      if (res.status === 401) {
        // Redirect to auth page on 401 Unauthorized
        if (typeof window !== "undefined") {
          // Ensure this runs only in the browser
          window.location.href = "/auth";
        }
        throw new Error("Unauthorized: Redirecting to login.");
      }
      const cleanMessage =
        data?.message ||
        data?.error ||
        data?.supabaseError ||
        data?.details ||
        `Request failed with status ${res.status}`;
      throw new Error(cleanMessage);
    }

    return data as T;
  } catch (err: any) {
    console.error("🚨 apiRequest Catch:", err);
    if (err === "token not found") {
      localStorage.removeItem("aharraa-u-token-admin");
      throw new Error("session expired Please log in again.");
    }

    throw new Error(err?.message || "Something went wrong");
  }
}

export async function validateToken(
  token: string
): Promise<ValidateTokenResponse> {
  return apiRequest<ValidateTokenResponse>("/auth/verify", "POST", { token });
}