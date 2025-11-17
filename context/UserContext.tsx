"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

/**
 * User Profile Interface
 * Represents the user's profile data
 */
export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

/**
 * User Context Type
 * Defines the shape of the user context
 */
interface UserContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  getInitials: () => string;
}

/**
 * Default user profile
 */
const DEFAULT_USER: UserProfile = {
  name: "Manjusha Paul",
  email: "manjusha@example.com",
  avatar: "",
};

/**
 * LocalStorage key for user profile
 */
const USER_STORAGE_KEY = "crypto-dashboard-user-profile";

/**
 * User Context
 * Provides global user profile state management
 */
const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * User Provider Props
 */
interface UserProviderProps {
  children: ReactNode;
}

/**
 * Load user profile from localStorage
 */
const loadUserFromStorage = (): UserProfile => {
  if (typeof window === "undefined") return DEFAULT_USER;
  
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log("✅ User profile loaded from localStorage:", parsed);
      return { ...DEFAULT_USER, ...parsed };
    }
  } catch (error) {
    console.error("Failed to load user profile from localStorage:", error);
  }
  
  return DEFAULT_USER;
};

/**
 * Save user profile to localStorage
 */
const saveUserToStorage = (user: UserProfile): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    console.log("✅ User profile saved to localStorage:", user);
  } catch (error) {
    console.error("Failed to save user profile to localStorage:", error);
  }
};

/**
 * UserProvider Component
 * 
 * Provides global user profile state to all child components.
 * Persists user data to localStorage for persistence across sessions.
 * 
 * Features:
 * - Global user profile state (name, email, avatar)
 * - Real-time synchronization across all components
 * - localStorage persistence
 * - Automatic initials generation from name
 * - Type-safe API
 * 
 * @example
 * ```tsx
 * // In app layout
 * <UserProvider>
 *   <App />
 * </UserProvider>
 * 
 * // In any component
 * const { user, updateUser, getInitials } = useUser();
 * 
 * // Update user name
 * updateUser({ name: "John Doe" });
 * 
 * // Get initials
 * const initials = getInitials(); // "JD"
 * ```
 */
export function UserProvider({ children }: UserProviderProps) {
  // Initialize state from localStorage
  const [user, setUser] = useState<UserProfile>(() => loadUserFromStorage());

  /**
   * Update user profile
   * Merges updates with existing user data and persists to storage
   */
  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, ...updates };
      saveUserToStorage(updatedUser);
      console.log("🔄 User profile updated:", updatedUser);
      return updatedUser;
    });
  };

  /**
   * Generate initials from user's name
   * Takes first letter of first and last name
   */
  const getInitials = (): string => {
    if (!user.name) return "U";
    
    const nameParts = user.name.trim().split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  // Persist to localStorage whenever user changes
  useEffect(() => {
    saveUserToStorage(user);
  }, [user]);

  const value: UserContextType = {
    user,
    updateUser,
    getInitials,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/**
 * useUser Hook
 * 
 * Custom hook to access user context.
 * Must be used within a UserProvider.
 * 
 * @throws {Error} If used outside of UserProvider
 * 
 * @example
 * ```tsx
 * const { user, updateUser, getInitials } = useUser();
 * 
 * // Display user name
 * <p>{user.name}</p>
 * 
 * // Update user email
 * updateUser({ email: "newemail@example.com" });
 * 
 * // Show initials in avatar
 * <div>{getInitials()}</div>
 * ```
 */
export function useUser(): UserContextType {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  
  return context;
}

/**
 * Export types for external use
 */
export type { UserContextType };




