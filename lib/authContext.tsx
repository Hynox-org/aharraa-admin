"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation"; // Import useRouter and usePathname
import { validateToken } from "@/lib/api";
import { AuthContextType, User } from "@/lib/types";



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false); // New state to track active login process
  const [token, setToken] = useState<string | null>(null); // Add token state
  const router = useRouter(); // Initialize useRouter
  const pathname = usePathname(); // Initialize usePathname

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("aharraa-u-token-admin");
      if (storedToken) {
        setToken(storedToken); // Set token state
        try {
          const response = await validateToken(storedToken);
          setUser(response.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("aharraa-u-token-admin");
          setToken(null); // Clear token state
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    // Only redirect if authenticated, on /auth, and not currently in a login process
    if (isAuthenticated && pathname === "/auth" && !isLoggingIn) {
      router.push("/"); // If already authenticated and on /auth, redirect to home page
    }
  }, [isAuthenticated, pathname, router, isLoggingIn]);

  // Effect to handle route protection
  useEffect(() => {
    // We only want to run this after initial loading is complete
    if (!loading && !isAuthenticated && pathname !== "/login" && pathname !== "/") {
      router.push("/login");
    }
  }, [loading, isAuthenticated, pathname, router]);

  const login = async (newToken: string, returnUrl?: string) => { // Make login function async and accept returnUrl
    localStorage.setItem("aharraa-u-token-admin", newToken);
    setToken(newToken); // Set token state on login
    setLoading(true);
    setIsLoggingIn(true); // Set isLoggingIn to true at the start of login
    try {
      const response = await validateToken(newToken);
      setUser(response.user);
      setIsAuthenticated(true);
      setLoading(false); // Set loading to false before redirection
      if (returnUrl) {
        router.push(returnUrl);
      } else {
        router.push("/"); // Default redirect to home page
      }
    } catch (error) {
      console.error("Login failed:", error);
      localStorage.removeItem("aharraa-u-token-admin");
      setToken(null); // Clear token state on error
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false); // Also set loading to false on error
    } finally {
      setIsLoggingIn(false); // Always set isLoggingIn to false at the end
    }
  };

  const logout = () => {
    localStorage.removeItem("aharraa-u-token-admin");
    setToken(null); // Clear token state on logout
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
