"use client";

import { useState, useEffect, useRef } from "react";
import { 
  User, 
  Lock, 
  Shield,
  Camera,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  Loader2,
  Download,
  FileText,
  Key,
  Link2,
  Activity,
  Ticket,
  Award,
  Globe,
  Smartphone,
  MapPin,
  Mail,
  Phone,
  LogOut,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Wallet,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { usePortfolio } from "@/context/PortfolioContext";
import { formatCurrency } from "@/lib/utils";

/**
 * Profile Component
 * Comprehensive user profile page with all account management features
 * 
 * Features:
 * - Personal information management
 * - Security settings and 2FA
 * - KYC verification
 * - Financial overview
 * - Support tickets
 * - API key management
 * - Connected accounts
 * - Activity logs
 * - Gamification (badges, achievements)
 * 
 * Design:
 * - Matches dashboard styling exactly
 * - Uses dashboard color palette (#ff9500, #22243A, #ffe369)
 * - Fully responsive and accessible
 */
export default function Profile() {
  const { user, updateUser } = useUser();
  const { theme } = useTheme();
  const { portfolio } = usePortfolio();

  // Personal Information State
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [address, setAddress] = useState("123 Main St, New York, NY 10001");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(true);

  // Verification State
  const [kycStatus, setKycStatus] = useState<"pending" | "verified" | "rejected">("pending");
  const [verificationProgress, setVerificationProgress] = useState(60);

  // Financial Overview State
  const totalBalance = portfolio.reduce((sum, asset) => sum + ((asset.amount || 0) * (asset.price || 0)), 0);

  // Support & Activity State
  const [supportTickets, setSupportTickets] = useState([
    { id: "1", subject: "Account verification issue", status: "open", date: "2024-01-15" },
    { id: "2", subject: "Transaction inquiry", status: "resolved", date: "2024-01-10" },
  ]);

  // API Keys State
  const [apiKeys, setApiKeys] = useState([
    { id: "1", name: "Trading Bot", key: "sk_live_xxxxxxxxxxxxxxxxxxxx", lastUsed: "2024-01-14", calls: 1234 },
    { id: "2", name: "Portfolio Tracker", key: "sk_live_yyyyyyyyyyyyyyyyyyyy", lastUsed: "2024-01-13", calls: 567 },
  ]);
  const [showAPIKey, setShowAPIKey] = useState<Record<string, boolean>>({});

  // Connections State
  const [connections, setConnections] = useState([
    { id: "1", type: "wallet", name: "MetaMask", address: "0x1234...5678", connected: true },
    { id: "2", type: "exchange", name: "Binance", connected: true },
    { id: "3", type: "payment", name: "PayPal", connected: false },
  ]);

  // Activity Log State
  const [activityLog, setActivityLog] = useState([
    { id: "1", action: "Password changed", date: "2024-01-14 10:30", ip: "192.168.1.1", device: "Chrome on Mac" },
    { id: "2", action: "Profile updated", date: "2024-01-13 15:20", ip: "192.168.1.1", device: "Chrome on Mac" },
    { id: "3", action: "2FA enabled", date: "2024-01-12 09:15", ip: "192.168.1.1", device: "Chrome on Mac" },
  ]);

  // Loading States
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [twoFALoading, setTwoFALoading] = useState(false);

  // Error States
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Success States
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Sync local state when context changes
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setAvatar(user.avatar || "");
  }, [user]);

  /**
   * Handle photo file selection
   */
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setProfileError('Please select a valid image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setProfileError('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setAvatar(reader.result as string);
        setProfileError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Handle profile save
   */
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);
    setProfileLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateUser({ name, email, avatar });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (error) {
      setProfileError('Failed to update profile. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  /**
   * Handle password change
   */
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    setPasswordLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (error) {
      setPasswordError('Failed to update password. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  /**
   * Handle 2FA toggle
   */
  const handle2FAToggle = async () => {
    setTwoFALoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIs2FAEnabled(!is2FAEnabled);
    } finally {
      setTwoFALoading(false);
    }
  };

  /**
   * Handle download transactions
   */
  const handleDownloadTransactions = (format: "csv" | "pdf") => {
    console.log(`Downloading transactions as ${format.toUpperCase()}`);
    // TODO: Implement actual download
  };

  /**
   * Handle disconnect connection
   */
  const handleDisconnect = (id: string) => {
    setConnections(prev => prev.map(conn => 
      conn.id === id ? { ...conn, connected: false } : conn
    ));
  };

  /**
   * Handle delete API key
   */
  const handleDeleteAPIKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
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
                <h1 className="text-[2rem] font-extrabold text-gray-900 dark:text-white">Profile</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Manage your personal information, security, and account settings
                </p>
              </div>

              {/* Row 1: Personal Information & Security Cards Side by Side */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                
                {/* Personal Information Section */}
                <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-gray-900/50">
                <div className="mb-6 flex items-center gap-3">
                  <div className="shrink-0">
                    <User className="h-6 w-6 text-[#ff9500]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal details</p>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-4">
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
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <Camera className="h-4 w-4" />
                      Change Photo
                    </button>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Address
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                    />
                  </div>

                  {/* Error/Success Messages */}
                  {profileError && (
                    <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-3">
                      <p className="flex items-center gap-2 text-sm font-medium text-red-800 dark:text-red-300">
                        <AlertCircle className="h-4 w-4" />
                        {profileError}
                      </p>
                    </div>
                  )}

                  {profileSuccess && (
                    <div className="rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-3">
                      <p className="flex items-center gap-2 text-sm font-medium text-green-800 dark:text-green-300">
                        <Check className="h-4 w-4" />
                        Profile updated successfully!
                      </p>
                    </div>
                  )}

                  {/* Save Button */}
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className={cn(
                      "w-full rounded-xl px-4 py-3 font-bold shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#22243A] focus:ring-offset-2",
                      profileLoading
                        ? "cursor-not-allowed bg-gray-300 dark:bg-gray-700 text-gray-500"
                        : "bg-[#ffe369] dark:bg-yellow-500 text-[#22243A] dark:text-gray-900 hover:bg-[#ffd940] dark:hover:bg-yellow-400 hover:shadow-lg"
                    )}
                  >
                    {profileLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-5 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </form>
                </div>

                {/* Security Section */}
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

                <div className="space-y-6">
                  {/* Change Password Form */}
                  <form onSubmit={handleSavePassword} className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Change Password
                    </h3>

                    {/* Current Password */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 pr-10 text-gray-900 dark:text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 pr-10 text-gray-900 dark:text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 pr-10 text-gray-900 dark:text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {passwordError && (
                      <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-3">
                        <p className="flex items-center gap-2 text-sm font-medium text-red-800 dark:text-red-300">
                          <AlertCircle className="h-4 w-4" />
                          {passwordError}
                        </p>
                      </div>
                    )}

                    {passwordSuccess && (
                      <div className="rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-3">
                        <p className="flex items-center gap-2 text-sm font-medium text-green-800 dark:text-green-300">
                          <Check className="h-4 w-4" />
                          Password updated successfully!
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                      className={cn(
                        "w-full rounded-xl px-4 py-3 font-bold shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#22243A] focus:ring-offset-2",
                        passwordLoading || !currentPassword || !newPassword || !confirmPassword
                          ? "cursor-not-allowed bg-gray-300 dark:bg-gray-700 text-gray-500"
                          : "bg-[#22243A] text-[#ffe369] hover:bg-[#2a2d3f] hover:shadow-lg"
                      )}
                    >
                      {passwordLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Updating...
                        </span>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </form>

                  {/* 2FA Toggle */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="h-6 w-6 text-[#ff9500]" />
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handle2FAToggle}
                        disabled={twoFALoading}
                        className={cn(
                          "relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:ring-offset-2",
                          twoFALoading && "cursor-not-allowed opacity-50",
                          is2FAEnabled ? "bg-black dark:bg-gray-700" : "bg-gray-300 dark:bg-gray-600"
                        )}
                      >
                        {twoFALoading ? (
                          <Loader2 className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-spin text-gray-600" />
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
                  </div>

                  {/* Privacy Settings */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe className="h-6 w-6 text-[#ff9500]" />
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Profile Visibility</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Control who can see your profile</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrivacyVisible(!privacyVisible)}
                        className={cn(
                          "relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:ring-offset-2",
                          privacyVisible ? "bg-black dark:bg-gray-700" : "bg-gray-300 dark:bg-gray-600"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-6 w-6 transform rounded-full shadow-md transition-all duration-200",
                            privacyVisible ? "translate-x-7 bg-[#FF9500]" : "translate-x-1 bg-white"
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </div>
                </div>

              </div>

              {/* Row 2: Verification & Financial Overview Cards Side by Side */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                
                {/* Verification Section */}
                <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-gray-900/50">
                <div className="mb-6 flex items-center gap-3">
                  <div className="shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-[#ff9500]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Verification</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Complete your identity verification</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* KYC Status */}
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">KYC Status</h3>
                      <span className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        kycStatus === "verified" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                        kycStatus === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      )}>
                        {kycStatus === "verified" ? "Verified" : kycStatus === "pending" ? "Pending" : "Rejected"}
                      </span>
                    </div>
                    <div className="mb-2">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Verification Progress</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{verificationProgress}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${verificationProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ID Upload */}
                  <div>
                    <h3 className="mb-3 text-sm font-bold text-gray-900 dark:text-white">Upload ID Documents</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-4">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Government ID</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Passport, Driver's License, or National ID</p>
                        </div>
                        <button className="rounded-lg bg-[#22243A] px-4 py-2 text-xs font-semibold text-[#ffe369] transition-all hover:bg-[#2a2d3f]">
                          Upload
                        </button>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-4">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Proof of Address</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Utility bill or bank statement</p>
                        </div>
                        <button className="rounded-lg bg-[#22243A] px-4 py-2 text-xs font-semibold text-[#ffe369] transition-all hover:bg-[#2a2d3f]">
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Digital Identity Card */}
                  <div className="rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">Digital Identity</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Blockchain-verified identity card</p>
                      </div>
                      <button className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-blue-700">
                        View Card
                      </button>
                    </div>
                  </div>
                </div>
                </div>

                {/* Financial Overview Section */}
                <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-gray-900/50">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">
                      <TrendingUp className="h-6 w-6 text-[#ff9500]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Financial Overview</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Your portfolio summary</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownloadTransactions("csv")}
                      className="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <Download className="h-4 w-4" />
                      CSV
                    </button>
                    <button
                      onClick={() => handleDownloadTransactions("pdf")}
                      className="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <FileText className="h-4 w-4" />
                      PDF
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Total Balance */}
                  <div className="rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">Total Balance</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalBalance)}</p>
                  </div>

                  {/* Assets Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-4">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Total Assets</p>
                      <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{portfolio.length}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-4">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Active Wallets</p>
                      <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{connections.filter(c => c.connected).length}</p>
                    </div>
                  </div>

                  {/* Recent Transactions Preview */}
                  <div>
                    <h3 className="mb-3 text-sm font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
                    <div className="space-y-2">
                      {portfolio.slice(0, 3).map((asset) => (
                        <div key={asset.id} className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22243A] text-sm font-semibold text-[#ffe369]">
                              {asset.symbol?.substring(0, 2).toUpperCase() || "CO"}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{asset.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{asset.amount || 0} {asset.symbol}</p>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {formatCurrency((asset.amount || 0) * (asset.price || 0))}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                </div>

              </div>

              {/* Row 3: Support & Activity & Developer/API Controls Cards Side by Side */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                
                {/* Support & Activity Section */}
                <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-gray-900/50">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">
                      <Ticket className="h-6 w-6 text-[#ff9500]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Support & Activity</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tickets and account changes</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 rounded-lg bg-[#22243A] px-4 py-2 text-xs font-semibold text-[#ffe369] transition-all hover:bg-[#2a2d3f]">
                    <Ticket className="h-4 w-4" />
                    New Ticket
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Support Tickets */}
                  <div>
                    <h3 className="mb-3 text-sm font-bold text-gray-900 dark:text-white">Support Tickets</h3>
                    <div className="space-y-2">
                      {supportTickets.map((ticket) => (
                        <div key={ticket.id} className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{ticket.subject}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{ticket.date}</p>
                          </div>
                          <span className={cn(
                            "rounded-full px-3 py-1 text-xs font-semibold",
                            ticket.status === "open" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          )}>
                            {ticket.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Account Activity Log */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="mb-3 text-sm font-bold text-gray-900 dark:text-white">Account Activity</h3>
                    <div className="space-y-2">
                      {activityLog.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{activity.date} • {activity.device}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                </div>

                {/* Developer/API Controls Section */}
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
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{apiKey.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Last used: {apiKey.lastUsed} • {apiKey.calls} calls</p>
                        </div>
                        <button
                          onClick={() => handleDeleteAPIKey(apiKey.id)}
                          className="rounded-lg p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type={showAPIKey[apiKey.id] ? "text" : "password"}
                            value={apiKey.key}
                            readOnly
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2 pr-10 text-sm text-gray-900 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowAPIKey(prev => ({ ...prev, [apiKey.id]: !prev[apiKey.id] }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showAPIKey[apiKey.id] ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button className="w-full rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 font-bold text-gray-900 dark:text-white shadow-md transition-all hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-lg">
                    Generate New API Key
                  </button>
                </div>
                </div>

              </div>

              {/* Row 4: Connected Accounts & Recent Login Activity Cards Side by Side */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                
                {/* Connected Accounts Section */}
                <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-gray-900/50">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="shrink-0">
                      <Link2 className="h-6 w-6 text-[#ff9500]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Connected Accounts</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Manage linked wallets and integrations</p>
                    </div>
                  </div>

                <div className="space-y-3">
                  {connections.map((connection) => (
                    <div key={connection.id} className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-full",
                          connection.type === "wallet" ? "bg-purple-100 dark:bg-purple-900/30" :
                          connection.type === "exchange" ? "bg-yellow-100 dark:bg-yellow-900/30" :
                          "bg-blue-100 dark:bg-blue-900/30"
                        )}>
                          {connection.type === "wallet" ? (
                            <Wallet className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          ) : connection.type === "exchange" ? (
                            <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                          ) : (
                            <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{connection.name}</p>
                          {connection.address && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">{connection.address}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "rounded-full px-3 py-1 text-xs font-semibold",
                          connection.connected
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                        )}>
                          {connection.connected ? "Connected" : "Disconnected"}
                        </span>
                        {connection.connected && (
                          <button
                            onClick={() => handleDisconnect(connection.id)}
                            className="rounded-lg px-3 py-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            Disconnect
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button className="w-full rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-100 dark:hover:bg-gray-700">
                    + Connect New Account
                  </button>
                </div>
                </div>

                {/* Recent Login Activity Section */}
                <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-gray-900/50">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="shrink-0">
                      <Activity className="h-6 w-6 text-[#ff9500]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Login Activity</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Monitor your account access</p>
                    </div>
                  </div>

                <div className="space-y-3">
                  {activityLog.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                          <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.device}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{activity.date} • {activity.ip}</p>
                        </div>
                      </div>
                      <button className="rounded-lg px-3 py-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
                  <button className="mt-4 w-full rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-600">
                    Log Out of All Other Sessions
                  </button>
                </div>

              </div>
            </div>

            {/* Right Column - Sidebar (matching Home page gradient) */}
            <div className="space-y-6 bg-linear-to-r from-gray-100 via-blue-100 to-gray-100 dark:bg-linear-to-r dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-3 sm:p-8 lg:col-span-1">
              
              {/* Profile Summary Card */}
              <div className="rounded-2xl bg-black p-6 shadow-lg">
                <div className="mb-6 flex items-center justify-center">
                  {avatar || photoPreview ? (
                    <img
                      src={avatar || photoPreview || ""}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover shadow-md ring-4 ring-[#FF9500]/30"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-purple-400 to-pink-500 text-3xl font-bold text-white shadow-md">
                      {name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white">{name}</h3>
                  <p className="mt-1 text-sm text-gray-400">{email}</p>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-[#1a1a1a] p-3">
                    <span className="text-sm text-gray-300">Member Since</span>
                    <span className="font-bold text-[#FF9500]">Jan 2024</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-[#1a1a1a] p-3">
                    <span className="text-sm text-gray-300">Verification</span>
                    <span className={cn(
                      "font-bold",
                      kycStatus === "verified" ? "text-green-500" :
                      kycStatus === "pending" ? "text-yellow-500" :
                      "text-red-500"
                    )}>
                      {kycStatus === "verified" ? "Verified" : kycStatus === "pending" ? "Pending" : "Rejected"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-[#1a1a1a] p-3">
                    <span className="text-sm text-gray-300">Security Level</span>
                    <span className="font-bold text-[#FF9500]">
                      {is2FAEnabled ? "High" : "Medium"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Gamification Section */}
              <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-gray-900/50">
                <div className="mb-6 flex items-center gap-3">
                  <div className="shrink-0">
                    <Award className="h-6 w-6 text-[#ff9500]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Achievements</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Your badges and trust score</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Trust Score */}
                  <div className="rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">Trust Score</p>
                    <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">85</p>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Excellent</p>
                  </div>

                  {/* Badges */}
                  <div>
                    <h3 className="mb-3 text-sm font-bold text-gray-900 dark:text-white">Badges</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { name: "Verified", icon: CheckCircle2, color: "green" },
                        { name: "Trader", icon: TrendingUp, color: "blue" },
                        { name: "Security", icon: Shield, color: "yellow" },
                      ].map((badge, index) => {
                        const Icon = badge.icon;
                        return (
                          <div key={index} className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                            <div className={cn(
                              "flex h-12 w-12 items-center justify-center rounded-full",
                              badge.color === "green" ? "bg-green-100 dark:bg-green-900/30" :
                              badge.color === "blue" ? "bg-blue-100 dark:bg-blue-900/30" :
                              "bg-yellow-100 dark:bg-yellow-900/30"
                            )}>
                              <Icon className={cn(
                                "h-6 w-6",
                                badge.color === "green" ? "text-green-600 dark:text-green-400" :
                                badge.color === "blue" ? "text-blue-600 dark:text-blue-400" :
                                "text-yellow-600 dark:text-yellow-400"
                              )} />
                            </div>
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{badge.name}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-gray-900/50">
                <div className="mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#ff9500]" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Tips</h3>
                </div>
                <div className="space-y-4">
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4">
                    <h4 className="mb-2 text-sm font-bold text-blue-900 dark:text-blue-300">Secure Your Account</h4>
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      Enable two-factor authentication for enhanced security.
                    </p>
                  </div>
                  <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
                    <h4 className="mb-2 text-sm font-bold text-green-900 dark:text-green-300">Complete Verification</h4>
                    <p className="text-xs text-green-700 dark:text-green-400">
                      Verify your identity to unlock all platform features.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

