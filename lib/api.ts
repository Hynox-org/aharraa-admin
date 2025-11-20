export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import {
  ValidateTokenResponse,
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

    console.log("✅ API Success:", data);
    return data as T;
  } catch (err: any) {
    console.error("🚨 apiRequest Catch:", err);
    if (err === "token not found") {
      localStorage.removeItem("aharraa-u-token");
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

export async function oauthLogin(
  provider: string
): Promise<{ message: string; url: string }> {
  return apiRequest<{ message: string; url: string }>(
    `/auth/oauth/${provider}`,
    "GET",
    null,
    null
  );
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/auth/forgot-password", "POST", { email });
}

export async function resetPassword(
  newPassword: string, 
  token: string
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(
    "/auth/reset-password", 
    "POST", 
    { newPassword },  // ✅ Only newPassword in body
    token             // ✅ Token as 4th parameter (becomes Authorization header)
  );
}