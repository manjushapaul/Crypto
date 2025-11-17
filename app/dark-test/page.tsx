"use client";

import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";

/**
 * Dark Mode Test Page
 * Simple page to verify dark mode is working properly
 */
export default function DarkTestPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hasDarkClass, setHasDarkClass] = useState(false);
  const [storedTheme, setStoredTheme] = useState("");

  // Only run on client to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    setHasDarkClass(document.documentElement.classList.contains('dark'));
    setStoredTheme(localStorage.getItem('crypto-dashboard-theme') || "not set");
  }, [theme]);

  return (
    <div className="min-h-screen p-8 dark:bg-gray-900  bg-white transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Dark Mode Test Page
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Current theme: <span className="font-bold text-blue-600 dark:text-blue-400">{theme}</span>
          </p>
        </div>

        {/* Theme Toggle Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setTheme("light")}
            className="px-6 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all"
          >
            Set Light Mode
          </button>
          <button
            onClick={() => setTheme("dark")}
            className="px-6 py-3 rounded-xl bg-gray-800 text-white font-bold hover:bg-gray-900 transition-all"
          >
            Set Dark Mode
          </button>
        </div>

        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-xl dark:bg-gray-800  bg-white shadow-lg border-2 border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold dark:text-white text-gray-900  mb-2">
              Card Title
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              This card should change colors when you toggle the theme.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-xl bg-gray-100 dark:bg-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Another Card
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Background should be light gray in light mode, darker in dark mode.
            </p>
          </div>
        </div>

        {/* Debug Info */}
        <div className="p-6 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-700">
          <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-300 mb-3">
            Debug Information
          </h3>
          {mounted ? (
            <div className="space-y-2 text-sm font-mono">
              <div className="text-gray-700 dark:text-gray-300">
                <span className="font-bold">Theme:</span> {theme}
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                <span className="font-bold">HTML has dark class:</span>{" "}
                {hasDarkClass ? "YES ✅" : "NO ❌"}
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                <span className="font-bold">localStorage theme:</span>{" "}
                {storedTheme}
              </div>
            </div>
          ) : (
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              Loading debug info...
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-3">
            How to Test:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-300">
            <li>Click "Set Dark Mode" button above</li>
            <li>Watch all backgrounds, text, and borders change</li>
            <li>Check debug info shows "HTML has dark class: YES ✅"</li>
            <li>Click "Set Light Mode" button</li>
            <li>Everything should return to light colors</li>
            <li>Refresh the page - theme should persist</li>
          </ol>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <a
            href="/settings"
            className="inline-block px-6 py-3 rounded-xl bg-[#ffe369] text-[#22243A] font-bold hover:bg-[#ffd940] transition-all"
          >
            ← Back to Settings
          </a>
        </div>
      </div>
    </div>
  );
}

