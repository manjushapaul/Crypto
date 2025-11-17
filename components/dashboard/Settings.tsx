"use client";

import { useState, useEffect, useRef } from "react";
import { 
  User, 
  Lock, 
  Bell, 
  Palette, 
  Globe, 
  DollarSign, 
  Key, 
  LogOut,
  Camera,
  Shield,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  Loader2,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { useUser } from "@/context/UserContext";
import { useTheme, LANGUAGES, type Language, type Theme } from "@/context/ThemeContext";

/**
 * Settings Component Props
 */
interface SettingsProps {
  onProfileUpdate?: (data: { name: string; email: string; avatar?: string }) => void;
  onPasswordChange?: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => void;
  onToggle2FA?: (enabled: boolean) => void;
  onThemeChange?: (theme: "light" | "dark") => void;
  onLanguageChange?: (language: string) => void;
  onNotificationChange?: (settings: { alerts: boolean; sound: boolean; push: boolean; email: boolean }) => void;
  onCurrencyChange?: (currency: string) => void;
  onTimezoneChange?: (timezone: string) => void;
  onGenerateAPIKey?: () => void;
  onLogout?: () => void;
  // Account card actions
  onUpgrade?: () => void;
  onManageSubscription?: () => void;
  onViewMembershipHistory?: () => void;
  onIncreaseSecurity?: () => void;
}

/**
 * LocalStorage keys for settings persistence
 */
const SETTINGS_STORAGE_KEY = "crypto-dashboard-settings";

/**
 * Load settings from localStorage
 */
function loadSettings() {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error loading settings:", error);
    return null;
  }
}

/**
 * Save settings to localStorage
 */
function saveSettings(settings: any) {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    console.log("✅ Settings saved to localStorage");
  } catch (error) {
    console.error("❌ Error saving settings:", error);
  }
}

/**
 * Settings Component
 * Comprehensive settings page for cryptocurrency dashboard
 * 
 * Features:
 * - Profile & Account Management
 * - Security & Authentication (Password, 2FA)
 * - App Preferences (Theme, Language, Notifications)
 * - Dashboard Customization
 * - API Keys & Integrations
 * - Responsive and accessible
 * - Matches dashboard UI patterns
 * 
 * Design Consistency:
 * - Uses dashboard color palette (#22243A, #ffe369, #ff9500)
 * - White cards with rounded-xl, shadow-lg
 * - Proper spacing and typography
 * - Accessible with ARIA labels
 */
export default function Settings({
  onProfileUpdate,
  onPasswordChange,
  onToggle2FA,
  onThemeChange,
  onLanguageChange,
  onNotificationChange,
  onCurrencyChange,
  onTimezoneChange,
  onGenerateAPIKey,
  onLogout,
  onUpgrade,
  onManageSubscription,
  onViewMembershipHistory,
  onIncreaseSecurity,
}: SettingsProps) {
  // Use global user context for real-time sync
  const { user, updateUser } = useUser();
  
  // Use global theme context for appearance settings
  const { theme, setTheme, language, setLanguage } = useTheme();
  
  // Profile state (local state for form editing, synced to context on save)
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Sync local state when context changes (e.g., from another tab/component)
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setAvatar(user.avatar || "");
  }, [user]);
  
  // Profile form state
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  
  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password form state
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  // Security state
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [showTwoFAConfirm, setShowTwoFAConfirm] = useState(false);
  const [showTwoFASetup, setShowTwoFASetup] = useState(false);
  
  // Account state
  const [accountType, setAccountType] = useState<"Free" | "Premium">("Premium");
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  
  // Tooltip state
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Preferences state (theme and language now from context)
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("UTC");

  // Notification settings
  const [notifications, setNotifications] = useState({
    alerts: true,
    sound: true,
    push: true,
    email: false,
  });

  // API key state
  const [showAPIKey, setShowAPIKey] = useState(false);
  const [apiKey] = useState("sk_live_xxxxxxxxxxxxxxxxxxxx");

  /**
   * Load settings from localStorage on mount
   * Note: Theme and language are now managed by ThemeContext
   */
  useEffect(() => {
    const stored = loadSettings();
    if (stored) {
      if (stored.name) setName(stored.name);
      if (stored.email) setEmail(stored.email);
      // theme and language managed by ThemeContext
      if (stored.currency) setCurrency(stored.currency);
      if (stored.timezone) setTimezone(stored.timezone);
      if (stored.notifications) setNotifications(stored.notifications);
      if (stored.is2FAEnabled !== undefined) setIs2FAEnabled(stored.is2FAEnabled);
      console.log("✅ Settings loaded from localStorage");
    }
  }, []);

  /**
   * Save settings whenever they change
   * Note: Theme and language are now managed by ThemeContext
   */
  useEffect(() => {
    saveSettings({
      name,
      email,
      // theme and language managed by ThemeContext
      currency,
      timezone,
      notifications,
      is2FAEnabled,
    });
  }, [name, email, currency, timezone, notifications, is2FAEnabled]);

  /**
   * Validate email format
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validate name
   */
  const validateName = (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 50;
  };

  /**
   * Handle photo file selection
   */
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setProfileError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setProfileError('Image size must be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setAvatar(reader.result as string);
        setProfileError(null);
        console.log("Photo preview generated");
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Handle click on Change Photo button
   */
  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handle name field change with validation
   */
  const handleNameChange = (value: string) => {
    setName(value);
    setNameError(null);
    setProfileSuccess(false);
    
    if (value.trim().length === 0) {
      setNameError('Name is required');
    } else if (value.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
    } else if (value.trim().length > 50) {
      setNameError('Name must be less than 50 characters');
    }
  };

  /**
   * Handle email field change with validation
   */
  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError(null);
    setProfileSuccess(false);
    
    if (value.trim().length === 0) {
      setEmailError('Email is required');
    } else if (!validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    }
  };

  /**
   * Handle profile save with validation
   * Updates global user context for real-time sync across all components
   */
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setProfileError(null);
    setProfileSuccess(false);
    setNameError(null);
    setEmailError(null);
    
    // Validate fields
    let hasError = false;
    
    if (!validateName(name)) {
      setNameError('Name must be between 2 and 50 characters');
      hasError = true;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }
    
    if (hasError) {
      setProfileError('Please fix the errors above');
      return;
    }
    
    // Start loading
    setProfileLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update global user context (triggers navbar update)
      updateUser({ name, email, avatar });
      
      console.log("✅ Profile updated globally:", { name, email, avatar });
      
      // Call parent callback if provided
      if (onProfileUpdate) {
        onProfileUpdate({ name, email, avatar });
      }
      
      // Success
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
      
    } catch (error) {
      setProfileError('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  /**
   * Validate password strength
   * Requires: 8+ chars, uppercase, lowercase, number, special char
   */
  const validatePasswordStrength = (password: string): { isValid: boolean; error: string | null } => {
    if (password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters' };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, error: 'Password must contain an uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, error: 'Password must contain a lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, error: 'Password must contain a number' };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { isValid: false, error: 'Password must contain a special character' };
    }
    return { isValid: true, error: null };
  };

  /**
   * Check if password form is valid
   */
  const isPasswordFormValid = (): boolean => {
    return (
      currentPassword.length > 0 &&
      newPassword.length > 0 &&
      confirmPassword.length > 0 &&
      newPassword === confirmPassword &&
      !newPasswordError &&
      !confirmPasswordError
    );
  };

  /**
   * Handle new password change with validation
   */
  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    setPasswordError(null);
    setPasswordSuccess(false);
    
    if (value.length > 0) {
      const validation = validatePasswordStrength(value);
      setNewPasswordError(validation.error);
    } else {
      setNewPasswordError(null);
    }
    
    // Check confirm password match
    if (confirmPassword.length > 0 && value !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError(null);
    }
  };

  /**
   * Handle confirm password change
   */
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setPasswordError(null);
    setPasswordSuccess(false);
    
    if (value.length > 0 && value !== newPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError(null);
    }
  };

  /**
   * Validate current password against backend
   * This should be replaced with actual backend API call
   */
  const validateCurrentPassword = async (password: string): Promise<{ valid: boolean; error?: string }> => {
    try {
      // TODO: Replace with actual backend API call
      // const response = await fetch('/api/auth/validate-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ password }),
      // });
      // if (!response.ok) {
      //   return { valid: false, error: 'Current password is incorrect' };
      // }
      // return { valid: true };
      
      // SIMULATION: For demo purposes only
      // In production, NEVER validate passwords client-side
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate backend validation
      // Replace this with actual secure backend validation
      const storedPasswordHash = localStorage.getItem('user_password_demo');
      
      // For demo: If no stored password, any password is "correct"
      // In production, this would be a secure backend check
      if (!storedPasswordHash) {
        console.warn('⚠️ No stored password for validation. In production, use secure backend validation.');
        return { valid: true };
      }
      
      // Simple comparison for demo (INSECURE - use backend in production)
      if (password !== storedPasswordHash) {
        return { valid: false, error: 'Current password is incorrect' };
      }
      
      return { valid: true };
      
    } catch (error) {
      console.error('Password validation error:', error);
      return { valid: false, error: 'Failed to validate password. Please try again.' };
    }
  };

  /**
   * Update password on backend
   * This should be replaced with actual backend API call
   */
  const updatePasswordOnBackend = async (current: string, newPass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // TODO: Replace with actual backend API call
      // const response = await fetch('/api/auth/update-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ currentPassword: current, newPassword: newPass }),
      // });
      // if (!response.ok) {
      //   const data = await response.json();
      //   return { success: false, error: data.message };
      // }
      // return { success: true };
      
      // SIMULATION: For demo purposes only
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Store new password for demo (INSECURE - use backend in production)
      localStorage.setItem('user_password_demo', newPass);
      console.log('✅ Password updated successfully (demo mode)');
      
      return { success: true };
      
    } catch (error) {
      console.error('Password update error:', error);
      return { success: false, error: 'Failed to update password. Please try again.' };
    }
  };

  /**
   * Handle password change with comprehensive validation
   * 
   * Security Flow:
   * 1. Validate all client-side requirements (length, strength, match)
   * 2. Call backend to validate current password
   * 3. Only if current password is correct, proceed with update
   * 4. Call backend to update password
   * 5. Show success/error feedback
   */
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setPasswordError(null);
    setPasswordSuccess(false);
    setCurrentPasswordError(null);
    setNewPasswordError(null);
    setConfirmPasswordError(null);
    
    // Step 1: Client-side validation
    // Validate current password field is filled
    if (!currentPassword) {
      setCurrentPasswordError('Current password is required');
      return;
    }
    
    // Validate new password strength
    const validation = validatePasswordStrength(newPassword);
    if (!validation.isValid) {
      setNewPasswordError(validation.error);
      return;
    }
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }
    
    // Prevent setting the same password
    if (currentPassword === newPassword) {
      setNewPasswordError('New password must be different from current password');
      return;
    }
    
    // Step 2: Start loading - validating current password
    setPasswordLoading(true);
    
    try {
      // Step 3: Validate current password with backend
      console.log('🔐 Validating current password...');
      const validationResult = await validateCurrentPassword(currentPassword);
      
      if (!validationResult.valid) {
        // Current password is incorrect - BLOCK the update
        setCurrentPasswordError(validationResult.error || 'Current password is incorrect');
        setPasswordError('Please check your current password and try again.');
        console.error('❌ Current password validation failed');
        return;
      }
      
      console.log('✅ Current password validated');
      
      // Step 4: Update password on backend
      console.log('🔄 Updating password...');
      const updateResult = await updatePasswordOnBackend(currentPassword, newPassword);
      
      if (!updateResult.success) {
        // Update failed
        setPasswordError(updateResult.error || 'Failed to update password. Please try again.');
        console.error('❌ Password update failed');
        return;
      }
      
      console.log('✅ Password updated successfully');
      
      // Step 5: Call parent callback if provided
      if (onPasswordChange) {
        onPasswordChange({ currentPassword, newPassword, confirmPassword });
      }
      
      // Step 6: Show success message
      setPasswordSuccess(true);
      
      // Step 7: Clear fields after success (3 second delay)
      setTimeout(() => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordSuccess(false);
      }, 3000);
      
    } catch (error: any) {
      // Handle unexpected errors
      console.error('❌ Unexpected error during password change:', error);
      setPasswordError('An unexpected error occurred. Please try again.');
    } finally {
      // Always stop loading
      setPasswordLoading(false);
    }
  };

  /**
   * Toggle 2FA with confirmation and backend integration
   */
  const handle2FAToggle = async () => {
    if (is2FAEnabled) {
      // Show confirmation modal before disabling
      setShowTwoFAConfirm(true);
    } else {
      // Enable 2FA - show setup modal
      await enable2FA();
    }
  };

  /**
   * Enable 2FA
   */
  const enable2FA = async () => {
    setTwoFALoading(true);
    
    try {
      // Simulate API call to enable 2FA
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Replace with actual backend call
      // const response = await enableTwoFactorAuth();
      
      console.log("✅ 2FA enabled");
      
      setIs2FAEnabled(true);
      setShowTwoFASetup(true);
      
      // Call parent callback if provided
      if (onToggle2FA) {
        onToggle2FA(true);
      }
      
    } catch (error) {
      console.error('Failed to enable 2FA:', error);
      alert('Failed to enable two-factor authentication. Please try again.');
    } finally {
      setTwoFALoading(false);
    }
  };

  /**
   * Disable 2FA after confirmation
   */
  const disable2FA = async () => {
    setTwoFALoading(true);
    setShowTwoFAConfirm(false);
    
    try {
      // Simulate API call to disable 2FA
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Replace with actual backend call
      // const response = await disableTwoFactorAuth();
      
      console.log("✅ 2FA disabled");
      
      setIs2FAEnabled(false);
      
      // Call parent callback if provided
      if (onToggle2FA) {
        onToggle2FA(false);
      }
      
    } catch (error) {
      console.error('Failed to disable 2FA:', error);
      alert('Failed to disable two-factor authentication. Please try again.');
    } finally {
      setTwoFALoading(false);
    }
  };

  /**
   * Handle theme change
   * Updates global theme context and triggers callback
   */
  const handleThemeSelect = (newTheme: Theme) => {
    setTheme(newTheme);
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
    console.log("🎨 Theme changed to:", newTheme);
  };

  /**
   * Handle language change
   * Updates global language context and triggers callback
   */
  const handleLanguageSelect = (newLanguage: string) => {
    setLanguage(newLanguage as Language);
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
    console.log("🌐 Language changed to:", newLanguage);
  };

  /**
   * Toggle notification setting
   */
  const toggleNotification = (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    if (onNotificationChange) {
      onNotificationChange(updated);
    }
  };

  return (
    <ErrorBoundary>
      <div className="p-0 sm:p-0 lg:p-0">
        <div className="mx-auto max-w-screen-2xl space-y-6">
          {/* Main Layout - 2 Column Design (matching Home page) */}
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6 p-3 bg-[#eaebfd] dark:bg-gray-900 sm:p-8">
              
              {/* Page Header */}
              <div>
                <h1 className="text-[2rem] font-extrabold text-gray-900 dark:text-white">Settings</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Manage your account, preferences, and security settings
                </p>
              </div>

              {/* Row 1: Profile & Security Cards Side by Side */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                
                {/* Profile & Account Management Card */}
                <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-gray-900/50">
                <div className="mb-6 flex items-center gap-3">
                  <div className="shrink-0">
                    <User className="h-6 w-6 text-[#ff9500]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile & Account</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal information</p>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {/* Avatar Upload with Preview */}
                  <div className="flex items-center gap-4">
                    {/* Avatar Display */}
                    {photoPreview || avatar ? (
                      <img
                        src={photoPreview || avatar}
                        alt="Profile"
                        className="h-20 w-20 rounded-full object-cover shadow-md ring-2 ring-blue-500/20"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-purple-400 to-pink-500 text-2xl font-bold text-white shadow-md">
                        {name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    
                    {/* Hidden File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      aria-label="Upload profile photo"
                    />
                    
                    {/* Change Photo Button */}
                    <button
                      type="button"
                      onClick={handleChangePhotoClick}
                      className="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      aria-label="Change profile photo"
                    >
                      <Camera className="h-4 w-4" />
                      Change Photo
                    </button>
                  </div>

                  {/* Name Field with Validation */}
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Full Name
                      <span className="text-red-500 dark:text-red-400 ml-1" aria-label="required">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className={cn(
                        "w-full rounded-lg border bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white transition-all focus:outline-none focus:ring-2",
                        nameError
                          ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/20 dark:focus:ring-red-400/20"
                          : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                      )}
                      placeholder="Enter your full name"
                      aria-invalid={!!nameError}
                      aria-describedby={nameError ? "name-error" : undefined}
                      disabled={profileLoading}
                    />
                    {nameError && (
                      <p id="name-error" className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400" role="alert">
                        <AlertCircle className="h-4 w-4" />
                        {nameError}
                      </p>
                    )}
                  </div>

                  {/* Email Field with Validation */}
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Email Address
                      <span className="text-red-500 dark:text-red-400 ml-1" aria-label="required">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className={cn(
                        "w-full rounded-lg border bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white transition-all focus:outline-none focus:ring-2",
                        emailError
                          ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/20 dark:focus:ring-red-400/20"
                          : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                      )}
                      placeholder="your.email@example.com"
                      aria-invalid={!!emailError}
                      aria-describedby={emailError ? "email-error" : undefined}
                      disabled={profileLoading}
                    />
                    {emailError && (
                      <p id="email-error" className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400" role="alert">
                        <AlertCircle className="h-4 w-4" />
                        {emailError}
                      </p>
                    )}
                  </div>

                  {/* Error Message */}
                  {profileError && (
                    <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-3" role="alert">
                      <p className="flex items-center gap-2 text-sm font-medium text-red-800 dark:text-red-300">
                        <AlertCircle className="h-4 w-4" />
                        {profileError}
                      </p>
                    </div>
                  )}

                  {/* Success Message */}
                  {profileSuccess && (
                    <div className="rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-3" role="alert">
                      <p className="flex items-center gap-2 text-sm font-medium text-green-800 dark:text-green-300">
                        <Check className="h-4 w-4" />
                        Profile updated successfully!
                      </p>
                    </div>
                  )}

                  {/* Save Button with Loading State */}
                  <button
                    type="submit"
                    disabled={profileLoading || !!nameError || !!emailError}
                    className={cn(
                      "w-full rounded-xl px-4 py-3 font-bold shadow-md dark:shadow-dark-md transition-all focus:outline-none focus:ring-2 focus:ring-[#22243A] dark:focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800",
                      profileLoading || !!nameError || !!emailError
                        ? "cursor-not-allowed bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500"
                        : "bg-[#ffe369] dark:bg-yellow-500 text-[#22243A] dark:text-gray-900 hover:bg-[#ffd940] dark:hover:bg-yellow-400 hover:shadow-lg dark:hover:shadow-dark-lg"
                    )}
                    aria-busy={profileLoading}
                  >
                    {profileLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-5 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      "Save Profile"
                    )}
                  </button>
                </form>
                </div>

                {/* Security & Authentication Card */}
                <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-gray-900/50">
                <div className="mb-6 flex items-center gap-3">
                  <div className="shrink-0">
                    <Lock className="h-6 w-6 text-[#ff9500]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account security</p>
                  </div>
                </div>

                {/* Password Change Form with Validation */}
                <form onSubmit={handleSavePassword} className="mb-6 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                    Change Password
                  </h3>

                  {/* Current Password */}
                  <div>
                    <label htmlFor="current-password" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Current Password
                      <span className="text-red-500 dark:text-red-400 ml-1" aria-label="required">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => {
                          setCurrentPassword(e.target.value);
                          setCurrentPasswordError(null);
                          setPasswordSuccess(false);
                        }}
                        className={cn(
                          "w-full rounded-lg border bg-white dark:bg-gray-700 px-4 py-3 pr-10 text-gray-900 dark:text-white transition-all focus:outline-none focus:ring-2",
                          currentPasswordError
                            ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/20 dark:focus:ring-red-400/20"
                            : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                        )}
                        placeholder="Enter current password"
                        disabled={passwordLoading}
                        aria-invalid={!!currentPasswordError}
                        aria-describedby={currentPasswordError ? "current-password-error" : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                        tabIndex={-1}
                      >
                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {currentPasswordError && (
                      <p id="current-password-error" className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400" role="alert">
                        <AlertCircle className="h-4 w-4" />
                        {currentPasswordError}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label htmlFor="new-password" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      New Password
                      <span className="text-red-500 dark:text-red-400 ml-1" aria-label="required">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => handleNewPasswordChange(e.target.value)}
                        className={cn(
                          "w-full rounded-lg border bg-white dark:bg-gray-700 px-4 py-3 pr-10 text-gray-900 dark:text-white transition-all focus:outline-none focus:ring-2",
                          newPasswordError
                            ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/20 dark:focus:ring-red-400/20"
                            : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                        )}
                        placeholder="Enter new password"
                        disabled={passwordLoading}
                        aria-invalid={!!newPasswordError}
                        aria-describedby={newPasswordError ? "new-password-error" : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                        tabIndex={-1}
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {newPasswordError && (
                      <p id="new-password-error" className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400" role="alert">
                        <AlertCircle className="h-4 w-4" />
                        {newPasswordError}
                      </p>
                    )}
                    {newPassword.length > 0 && !newPasswordError && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-green-600">
                        <Check className="h-4 w-4" />
                        Strong password
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirm-password" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Confirm New Password
                      <span className="text-red-500 dark:text-red-400 ml-1" aria-label="required">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                        className={cn(
                          "w-full rounded-lg border bg-white dark:bg-gray-700 px-4 py-3 pr-10 text-gray-900 dark:text-white transition-all focus:outline-none focus:ring-2",
                          confirmPasswordError
                            ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/20 dark:focus:ring-red-400/20"
                            : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                        )}
                        placeholder="Confirm new password"
                        disabled={passwordLoading}
                        aria-invalid={!!confirmPasswordError}
                        aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {confirmPasswordError && (
                      <p id="confirm-password-error" className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400" role="alert">
                        <AlertCircle className="h-4 w-4" />
                        {confirmPasswordError}
                      </p>
                    )}
                    {confirmPassword.length > 0 && !confirmPasswordError && confirmPassword === newPassword && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-green-600">
                        <Check className="h-4 w-4" />
                        Passwords match
                      </p>
                    )}
                  </div>

                  {/* Error Message */}
                  {passwordError && (
                    <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-3" role="alert">
                      <p className="flex items-center gap-2 text-sm font-medium text-red-800 dark:text-red-300">
                        <AlertCircle className="h-4 w-4" />
                        {passwordError}
                      </p>
                    </div>
                  )}

                  {/* Success Message */}
                  {passwordSuccess && (
                    <div className="rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-3" role="alert">
                      <p className="flex items-center gap-2 text-sm font-medium text-green-800 dark:text-green-300">
                        <Check className="h-4 w-4" />
                        Password updated successfully!
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={passwordLoading || !isPasswordFormValid()}
                    className={cn(
                      "w-full rounded-xl px-4 py-3 font-bold shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#22243A] focus:ring-offset-2",
                      passwordLoading || !isPasswordFormValid()
                        ? "cursor-not-allowed bg-gray-300 text-gray-500"
                        : "bg-[#22243A] text-[#ffe369] hover:bg-[#2a2d3f] hover:shadow-lg"
                    )}
                    aria-busy={passwordLoading}
                  >
                    {passwordLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Updating Password...
                      </span>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </form>

                {/* 2FA Toggle */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        <Shield className="h-6 w-6 text-[#ff9500]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
                      </div>
                    </div>
                    
                    {/* Toggle Switch - Black & Gold Theme with Loading */}
                    <button
                      type="button"
                      onClick={handle2FAToggle}
                      disabled={twoFALoading}
                      className={cn(
                        "relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:ring-offset-2 dark:focus:ring-offset-gray-800 hover:shadow-md dark:hover:shadow-dark-md",
                        twoFALoading && "cursor-not-allowed opacity-50",
                        is2FAEnabled ? "bg-black dark:bg-gray-700" : "bg-gray-300 dark:bg-gray-600"
                      )}
                      role="switch"
                      aria-checked={is2FAEnabled}
                      aria-label="Toggle two-factor authentication"
                      aria-busy={twoFALoading}
                    >
                      {twoFALoading ? (
                        <Loader2 className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-spin text-gray-600 dark:text-gray-300" />
                      ) : (
                        <span
                          className={cn(
                            "inline-block h-6 w-6 transform rounded-full shadow-md transition-all duration-200",
                            is2FAEnabled ? "translate-x-7 bg-[#FF9500]" : "translate-x-1 bg-white"
                          )}
                        />
                      )}
                    </button>
                  </div>

                  {is2FAEnabled && (
                    <div className="mt-4 rounded-lg bg-green-50 p-4">
                      <p className="text-sm font-medium text-green-900">
                        ✓ Two-factor authentication is enabled
                      </p>
                      <p className="mt-1 text-xs text-green-700">
                        Your account is protected with an additional security layer
                      </p>
                    </div>
                  )}
                </div>
                </div>

              </div>

              {/* Row 2: API Keys & Integrations - Full Width */}
              <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-gray-900/50">
                <div className="mb-6 flex items-center gap-3">
                  <div className="shrink-0">
                    <Key className="h-6 w-6 text-[#ff9500]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">API Keys</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your API access keys</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* API Key Display */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Your API Key
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showAPIKey ? "text" : "password"}
                          value={apiKey}
                          readOnly
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 pr-10 text-sm text-gray-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAPIKey(!showAPIKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                          aria-label={showAPIKey ? "Hide API key" : "Show API key"}
                        >
                          {showAPIKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Generate New Key Button */}
                  <button
                    type="button"
                    onClick={onGenerateAPIKey}
                    className="w-full rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 font-bold text-gray-900 shadow-md transition-all hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Generate New API Key
                  </button>
                </div>
              </div>

              {/* Row 3: Logout - Full Width */}
              <div className="rounded-xl border-2 border-red-200 dark:border-red-800 bg-white dark:bg-gray-800 p-6 shadow-lg">
                <div className="mb-6 flex items-center gap-3">
                  <div className="shrink-0">
                    <LogOut className="h-6 w-6 text-[#ff9500]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Logout</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sign out of your account</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">End Session</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">You will need to login again</p>
                  </div>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white shadow-md transition-all hover:bg-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Logout
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column - Sidebar (matching Home page gradient) */}
            <div className="space-y-6 bg-linear-to-r from-gray-100 via-blue-100 to-gray-100 dark:bg-linear-to-r dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-3 sm:p-8 lg:col-span-1">
              
              {/* Account Summary Widget - Black & Gold Luxury Style with Interactive Features */}
              <div className="rounded-2xl bg-black p-6 shadow-lg">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">Account Status</h3>
                  <p className="text-sm text-gray-400">Your dashboard overview</p>
                </div>
                <div className="space-y-3">
                  {/* Account Type Row with Tooltip */}
                  <div 
                    className="relative flex items-center justify-between rounded-xl bg-[#1a1a1a] p-4"
                    onMouseEnter={() => setActiveTooltip('account')}
                    onMouseLeave={() => setActiveTooltip(null)}
                  > 
                    <span className="text-sm font-medium text-gray-300">Account Type</span>
                    <div className="relative">
                      <span className="rounded-full bg-[#FF9500] px-4 py-2 text-xs font-extrabold text-black shadow-md cursor-help">
                        {accountType}
                      </span>
                      {/* Tooltip */}
                      {activeTooltip === 'account' && (
                        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg bg-black border border-[#FF9500] p-3 shadow-xl">
                          <p className="text-xs text-gray-300">
                            {accountType === 'Premium' 
                              ? 'Premium account with full access to all features and priority support.'
                              : 'Free account with basic features. Upgrade for advanced analytics.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Member Since Row - Clickable with Info Icon */}
                  <div className="flex items-center justify-between rounded-xl bg-[#1a1a1a] p-4">
                    <span className="text-sm font-medium text-gray-300">Member Since</span>
                    <button
                      onClick={() => {
                        setShowMembershipModal(true);
                        if (onViewMembershipHistory) onViewMembershipHistory();
                      }}
                      className="flex items-center gap-2 text-lg font-bold text-[#FF9500] transition-all hover:text-[#ffa520] focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:ring-offset-2 focus:ring-offset-black rounded-lg px-2"
                      aria-label="View membership history"
                    >
                      Jan 2024
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#FF9500] text-xs">
                        i
                      </div>
                    </button>
                  </div>
                  
                  {/* Security Level Row with Tooltip */}
                  <div 
                    className="relative flex items-center justify-between rounded-xl bg-[#1a1a1a] p-4"
                    onMouseEnter={() => setActiveTooltip('security')}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <span className="text-sm font-medium text-gray-300">Security Level</span>
                    <div className="relative">
                      <span className="text-lg font-bold text-[#FF9500] cursor-help">
                        {is2FAEnabled ? (
                          <span className="flex items-center gap-1">
                            High
                            <Check className="h-5 w-5 text-green-500" />
                          </span>
                        ) : (
                          "Medium"
                        )}
                      </span>
                      {/* Tooltip */}
                      {activeTooltip === 'security' && (
                        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg bg-black border border-[#FF9500] p-3 shadow-xl">
                          <p className="text-xs text-gray-300">
                            {is2FAEnabled 
                              ? 'High security with 2FA enabled. Your account is well protected.'
                              : 'Medium security. Enable 2FA for better protection.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  {/* Upgrade/Manage Subscription Button */}
                  {accountType === 'Free' ? (
                    <button
                      onClick={onUpgrade}
                      className="w-full rounded-xl bg-[#FF9500] px-4 py-3 font-extrabold text-black shadow-md transition-all hover:bg-[#ffa520] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:ring-offset-2 focus:ring-offset-black"
                    >
                      ⭐ Upgrade to Premium
                    </button>
                  ) : (
                    <button
                      onClick={onManageSubscription}
                      className="w-full rounded-xl border-2 border-[#FF9500] bg-transparent px-4 py-3 font-bold text-[#FF9500] shadow-md transition-all hover:bg-[#FF9500] hover:text-black focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:ring-offset-2 focus:ring-offset-black"
                    >
                      Manage Subscription
                    </button>
                  )}

                  {/* Increase Security Button (only show if not high security) */}
                  {!is2FAEnabled && (
                    <button
                      onClick={onIncreaseSecurity}
                      className="w-full rounded-xl bg-[#1a1a1a] px-4 py-3 font-bold text-[#FF9500] shadow-md transition-all hover:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:ring-offset-2 focus:ring-offset-black"
                    >
                      <Shield className="mr-2 inline-block h-4 w-4" />
                      Increase Security
                    </button>
                  )}
                </div>
              </div>

              {/* Notification Settings */}
              <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-gray-900/50">
                <div className="mb-6 flex items-center gap-3">
                  <div className="shrink-0">
                    <Bell className="h-6 w-6 text-[#ff9500]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Control your alert preferences</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Price Alerts Toggle - Black & Gold Theme */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">Price Alerts</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Get notified about price changes</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleNotification("alerts")}
                      className={cn(
                        "relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:ring-offset-2 dark:focus:ring-offset-gray-800 hover:shadow-md dark:hover:shadow-dark-md",
                        notifications.alerts ? "bg-black dark:bg-gray-700" : "bg-gray-300 dark:bg-gray-600"
                      )}
                      role="switch"
                      aria-checked={notifications.alerts}
                    >
                      <span
                        className={cn(
                          "inline-block h-5 w-5 transform rounded-full shadow-md transition-all duration-200",
                          notifications.alerts ? "translate-x-6 bg-[#FF9500]" : "translate-x-1 bg-white"
                        )}
                      />
                    </button>
                  </div>

                  {/* Sound Toggle - Black & Gold Theme */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">Sound</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Enable notification sounds</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleNotification("sound")}
                      className={cn(
                        "relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:ring-offset-2 dark:focus:ring-offset-gray-800 hover:shadow-md dark:hover:shadow-dark-md",
                        notifications.sound ? "bg-black dark:bg-gray-700" : "bg-gray-300 dark:bg-gray-600"
                      )}
                      role="switch"
                      aria-checked={notifications.sound}
                    >
                      <span
                        className={cn(
                          "inline-block h-5 w-5 transform rounded-full shadow-md transition-all duration-200",
                          notifications.sound ? "translate-x-6 bg-[#FF9500]" : "translate-x-1 bg-white"
                        )}
                      />
                    </button>
                  </div>

                  {/* Push Notifications Toggle - Black & Gold Theme */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">Push Notifications</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Browser push notifications</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleNotification("push")}
                      className={cn(
                        "relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:ring-offset-2 dark:focus:ring-offset-gray-800 hover:shadow-md dark:hover:shadow-dark-md",
                        notifications.push ? "bg-black dark:bg-gray-700" : "bg-gray-300 dark:bg-gray-600"
                      )}
                      role="switch"
                      aria-checked={notifications.push}
                    >
                      <span
                        className={cn(
                          "inline-block h-5 w-5 transform rounded-full shadow-md transition-all duration-200",
                          notifications.push ? "translate-x-6 bg-[#FF9500]" : "translate-x-1 bg-white"
                        )}
                      />
                    </button>
                  </div>

                  {/* Email Notifications Toggle - Black & Gold Theme */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">Email Notifications</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Receive updates via email</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleNotification("email")}
                      className={cn(
                        "relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:ring-offset-2 dark:focus:ring-offset-gray-800 hover:shadow-md dark:hover:shadow-dark-md",
                        notifications.email ? "bg-black dark:bg-gray-700" : "bg-gray-300 dark:bg-gray-600"
                      )}
                      role="switch"
                      aria-checked={notifications.email}
                    >
                      <span
                        className={cn(
                          "inline-block h-5 w-5 transform rounded-full shadow-md transition-all duration-200",
                          notifications.email ? "translate-x-6 bg-[#FF9500]" : "translate-x-1 bg-white"
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Membership History Modal - Black & Gold Theme */}
      {showMembershipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-black border-2 border-[#FF9500] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-[#FF9500]/30 bg-[#1a1a1a] p-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Membership History</h2>
                <p className="mt-1 text-sm text-gray-400">Your account timeline and activity</p>
              </div>
              <button
                onClick={() => setShowMembershipModal(false)}
                className="group rounded-full bg-[#FF9500] p-2 text-black shadow-md transition-all hover:bg-[#ffa520] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="max-h-[60vh] overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Timeline Items */}
                <div className="rounded-xl bg-[#1a1a1a] p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white">Account Created</h3>
                      <p className="mt-1 text-sm text-gray-400">Welcome to TIXX Dashboard</p>
                    </div>
                    <span className="text-sm font-bold text-[#FF9500]">Jan 15, 2024</span>
                  </div>
                </div>

                <div className="rounded-xl bg-[#1a1a1a] p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white">Premium Upgrade</h3>
                      <p className="mt-1 text-sm text-gray-400">Upgraded to Premium plan</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="rounded-full bg-[#FF9500] px-3 py-1 text-xs font-bold text-black">
                          $49.99/month
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#FF9500]">Jan 16, 2024</span>
                  </div>
                </div>

                <div className="rounded-xl bg-[#1a1a1a] p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white">2FA Enabled</h3>
                      <p className="mt-1 text-sm text-gray-400">Two-factor authentication activated</p>
                    </div>
                    <span className="text-sm font-bold text-[#FF9500]">
                      {is2FAEnabled ? "Active" : "Not Set"}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-[#1a1a1a] p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white">Last Login</h3>
                      <p className="mt-1 text-sm text-gray-400">Most recent account access</p>
                    </div>
                    <span className="text-sm font-bold text-[#FF9500]">Today</span>
                  </div>
                </div>

                {/* Billing Information */}
                <div className="mt-6 rounded-xl border-2 border-[#FF9500]/30 bg-[#1a1a1a] p-4">
                  <h3 className="mb-4 font-bold text-[#FF9500]">Billing & Invoices</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Next Billing Date:</span>
                      <span className="font-semibold text-white">Feb 15, 2024</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Plan Amount:</span>
                      <span className="font-semibold text-[#FF9500]">$49.99/month</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Payment Method:</span>
                      <span className="font-semibold text-white">•••• 4242</span>
                    </div>
                  </div>
                  <button className="mt-4 w-full rounded-lg bg-[#FF9500] px-4 py-2 text-sm font-bold text-black transition-all hover:bg-[#ffa520]">
                    View All Invoices
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Disable Confirmation Modal */}
      {showTwoFAConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl dark:shadow-dark-xl">
            {/* Modal Header */}
            <div className="bg-red-50 dark:bg-red-900/20 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-red-900 dark:text-red-300">Disable Two-Factor Authentication</h2>
                  <p className="text-sm text-red-700 dark:text-red-400">This will reduce your account security</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 dark:text-gray-300">
                Are you sure you want to disable two-factor authentication? Your account will be less secure without this extra layer of protection.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 bg-gray-50 p-6">
              <button
                onClick={() => setShowTwoFAConfirm(false)}
                disabled={twoFALoading}
                className="flex-1 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 font-bold text-gray-700 transition-all hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={disable2FA}
                disabled={twoFALoading}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-bold text-white transition-all hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {twoFALoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Disabling...
                  </span>
                ) : (
                  "Disable 2FA"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Setup Modal */}
      {showTwoFASetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl dark:shadow-dark-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-linear-to-r from-green-50 to-blue-50 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Two-Factor Authentication Enabled</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Setup complete!</p>
                </div>
              </div>
              <button
                onClick={() => setShowTwoFASetup(false)}
                className="rounded-full p-2 text-gray-400 dark:text-gray-500 transition-colors hover:bg-white dark:hover:bg-gray-700 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-4">
                {/* QR Code Placeholder */}
                <div className="flex justify-center rounded-lg bg-gray-100 p-8">
                  <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-white dark:bg-gray-700 shadow-inner dark:shadow-dark-md">
                    <div className="text-center">
                      <Shield className="mx-auto h-16 w-16 text-green-500" />
                      <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">QR Code Placeholder</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Scan with authenticator app</p>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="rounded-lg bg-blue-50 p-4">
                  <h3 className="mb-2 font-bold text-blue-900">Setup Instructions:</h3>
                  <ol className="list-decimal space-y-1 pl-5 text-sm text-blue-800">
                    <li>Download an authenticator app (Google Authenticator, Authy, etc.)</li>
                    <li>Scan the QR code above with your app</li>
                    <li>Enter the 6-digit code from your app to verify</li>
                    <li>Save your backup codes in a secure location</li>
                  </ol>
                </div>

                {/* Backup Code */}
                <div className="rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-4">
                  <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Backup Code:</p>
                  <code className="block rounded bg-white dark:bg-gray-700 px-3 py-2 text-center font-mono text-sm font-bold text-gray-900 dark:text-white">
                    XXXX-XXXX-XXXX-XXXX
                  </code>
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                    Save this code securely. You'll need it if you lose access to your authenticator app.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-gray-50 p-6">
              <button
                onClick={() => setShowTwoFASetup(false)}
                className="w-full rounded-xl bg-green-600 px-4 py-3 font-bold text-white transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}

