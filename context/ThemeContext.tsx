"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

/**
 * Theme type
 */
export type Theme = "light" | "dark";

/**
 * Language type
 */
export type Language = "en" | "es" | "fr" | "de" | "ja" | "zh";

/**
 * Language display names
 */
export const LANGUAGES: Record<Language, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語",
  zh: "中文",
};

/**
 * Theme Context Type
 */
interface ThemeContextType {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  toggleTheme: () => void;
}

/**
 * LocalStorage keys
 */
const THEME_STORAGE_KEY = "crypto-dashboard-theme";
const LANGUAGE_STORAGE_KEY = "crypto-dashboard-language";

/**
 * Default theme context value
 * Used when component is rendered outside ThemeProvider
 */
const defaultThemeContext: ThemeContextType = {
  theme: "light",
  language: "en",
  setTheme: () => console.warn("setTheme called outside ThemeProvider"),
  setLanguage: () => console.warn("setLanguage called outside ThemeProvider"),
  toggleTheme: () => console.warn("toggleTheme called outside ThemeProvider"),
};

/**
 * Theme Context
 */
const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

/**
 * Theme Provider Props
 */
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Load theme from localStorage
 */
const loadTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      console.log("✅ Theme loaded from localStorage:", stored);
      return stored;
    }
  } catch (error) {
    console.error("Failed to load theme from localStorage:", error);
  }
  
  return "light";
};

/**
 * Load language from localStorage
 */
const loadLanguage = (): Language => {
  if (typeof window === "undefined") return "en";
  
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && Object.keys(LANGUAGES).includes(stored)) {
      console.log("✅ Language loaded from localStorage:", stored);
      return stored as Language;
    }
  } catch (error) {
    console.error("Failed to load language from localStorage:", error);
  }
  
  return "en";
};

/**
 * Save theme to localStorage and apply to document
 */
const saveTheme = (theme: Theme): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    console.log("✅ Theme saved to localStorage:", theme);
    
    // Apply theme class to document root
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch (error) {
    console.error("Failed to save theme to localStorage:", error);
  }
};

/**
 * Save language to localStorage
 */
const saveLanguage = (language: Language): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    console.log("✅ Language saved to localStorage:", language);
    
    // Update document lang attribute
    document.documentElement.lang = language;
  } catch (error) {
    console.error("Failed to save language to localStorage:", error);
  }
};

/**
 * ThemeProvider Component
 * 
 * Provides global theme and language state management.
 * Persists preferences to localStorage and applies them instantly across the dashboard.
 * 
 * Features:
 * - Theme switching (light/dark)
 * - Language selection
 * - localStorage persistence
 * - Instant UI updates via CSS classes
 * - Document root class management
 * - Type-safe API
 * 
 * @example
 * ```tsx
 * // In app layout
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * 
 * // In any component
 * const { theme, setTheme, language, setLanguage } = useTheme();
 * 
 * // Change theme
 * setTheme("dark");
 * 
 * // Change language
 * setLanguage("es");
 * ```
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => loadTheme());
  const [language, setLanguageState] = useState<Language>(() => loadLanguage());
  const [mounted, setMounted] = useState(false);

  /**
   * Set theme and persist
   */
  const setTheme = (newTheme: Theme) => {
    console.log("🎨 Setting theme to:", newTheme);
    setThemeState(newTheme);
    saveTheme(newTheme);
    
    // Debug: Check if class was applied
    setTimeout(() => {
      const hasClass = document.documentElement.classList.contains('dark');
      console.log("✅ Dark class applied:", hasClass);
      console.log("📋 HTML classes:", document.documentElement.className);
    }, 100);
  };

  /**
   * Set language and persist
   */
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    saveLanguage(newLanguage);
    console.log("🌐 Language changed to:", newLanguage);
  };

  /**
   * Toggle between light and dark theme
   */
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  /**
   * Apply theme on mount and when theme changes
   */
  useEffect(() => {
    setMounted(true);
    saveTheme(theme);
    saveLanguage(language);
  }, [theme, language]);

  /**
   * Prevent flash of unstyled content
   */
  if (!mounted) {
    return <>{children}</>;
  }

  const value: ThemeContextType = {
    theme,
    language,
    setTheme,
    setLanguage,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * useTheme Hook
 * 
 * Custom hook to access theme context.
 * Can be used within or outside a ThemeProvider (will use defaults if outside).
 * 
 * @example
 * ```tsx
 * const { theme, setTheme, language, setLanguage } = useTheme();
 * 
 * // Check current theme
 * if (theme === "dark") {
 *   // Apply dark styles
 * }
 * 
 * // Change theme
 * setTheme("light");
 * 
 * // Change language
 * setLanguage("fr");
 * ```
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  return context;
}

/**
 * Export types for external use
 */
export type { ThemeContextType };

