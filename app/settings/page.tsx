"use client";

import { useState } from "react";
import Settings from "@/components/dashboard/Settings";
import SubscriptionManagementModal from "@/components/dashboard/SubscriptionManagementModal";

/**
 * Settings Page
 * 
 * User settings and preferences page
 * 
 * Features:
 * - Profile and account management
 * - Security settings (password, 2FA)
 * - App preferences (theme, language, notifications)
 * - Dashboard customization
 * - API keys and integrations
 * - Fully responsive and accessible
 * 
 * Design:
 * - Matches dashboard styling exactly
 * - bg-[#eaebfd] background
 * - Dashboard color palette throughout (#ff9500, #22243A, #ffe369)
 * - Fully responsive and accessible
 */
export default function SettingsPage() {
  // Subscription modal state
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("premium");

  /**
   * Handle profile update
   */
  const handleProfileUpdate = (data: {
    name: string;
    email: string;
    avatar?: string;
  }) => {
    console.log("Profile update:", data);
    // TODO: Call API to update profile
    // await updateProfile(data);
  };

  /**
   * Handle password change
   */
  const handlePasswordChange = (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    console.log("Password change requested");
    // TODO: Call API to change password
    // await changePassword(data);
  };

  /**
   * Handle 2FA toggle
   */
  const handleToggle2FA = (enabled: boolean) => {
    console.log("2FA toggle:", enabled);
    // TODO: Call API to enable/disable 2FA
    // await toggle2FA(enabled);
  };

  /**
   * Handle theme change
   */
  const handleThemeChange = (theme: "light" | "dark") => {
    console.log("Theme changed:", theme);
    // TODO: Update theme in global state/context
    // setTheme(theme);
  };

  /**
   * Handle language change
   */
  const handleLanguageChange = (language: string) => {
    console.log("Language changed:", language);
    // TODO: Update language in global state/context
    // setLanguage(language);
  };

  /**
   * Handle notification settings change
   */
  const handleNotificationChange = (settings: {
    alerts: boolean;
    sound: boolean;
    push: boolean;
    email: boolean;
  }) => {
    console.log("Notification settings:", settings);
    // TODO: Save notification preferences
    // await updateNotificationSettings(settings);
  };

  /**
   * Handle currency change
   */
  const handleCurrencyChange = (currency: string) => {
    console.log("Currency changed:", currency);
    // TODO: Update preferred currency
    // setCurrency(currency);
  };

  /**
   * Handle timezone change
   */
  const handleTimezoneChange = (timezone: string) => {
    console.log("Timezone changed:", timezone);
    // TODO: Update timezone preference
    // setTimezone(timezone);
  };

  /**
   * Handle API key generation
   */
  const handleGenerateAPIKey = () => {
    console.log("Generate new API key");
    // TODO: Call API to generate new key
    // const newKey = await generateAPIKey();
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    console.log("User logout");
    // TODO: Clear session and redirect
    // await logout();
    // router.push('/login');
  };

  /**
   * Handle upgrade to premium
   */
  const handleUpgrade = () => {
    console.log("Upgrade to Premium");
    // TODO: Navigate to upgrade/payment page
    // router.push('/upgrade');
  };

  /**
   * Handle manage subscription
   */
  const handleManageSubscription = () => {
    console.log("Manage subscription");
    setShowSubscriptionModal(true);
  };

  /**
   * Handle plan change
   */
  const handleChangePlan = (planId: string) => {
    console.log("Plan changed to:", planId);
    setCurrentPlan(planId);
    // TODO: Call API to change plan
    // await changePlan(planId);
  };

  /**
   * Handle payment update
   */
  const handleUpdatePayment = () => {
    console.log("Payment method update requested");
    // TODO: Open payment update flow or modal
    // await updatePaymentMethod();
  };

  /**
   * Handle subscription cancellation
   */
  const handleCancelSubscription = () => {
    console.log("Subscription cancelled");
    // TODO: Call API to cancel subscription
    // await cancelSubscription();
  };

  /**
   * Handle view membership history
   */
  const handleViewMembershipHistory = () => {
    console.log("View membership history");
    // TODO: Log analytics event
    // analytics.track('view_membership_history');
  };

  /**
   * Handle increase security
   */
  const handleIncreaseSecurity = () => {
    console.log("Increase security");
    // TODO: Scroll to security section or open 2FA setup
    // scrollToElement('security-section');
  };

  return (
    <>
      <Settings
        onProfileUpdate={handleProfileUpdate}
        onPasswordChange={handlePasswordChange}
        onToggle2FA={handleToggle2FA}
        onThemeChange={handleThemeChange}
        onLanguageChange={handleLanguageChange}
        onNotificationChange={handleNotificationChange}
        onCurrencyChange={handleCurrencyChange}
        onTimezoneChange={handleTimezoneChange}
        onGenerateAPIKey={handleGenerateAPIKey}
        onLogout={handleLogout}
        onUpgrade={handleUpgrade}
        onManageSubscription={handleManageSubscription}
        onViewMembershipHistory={handleViewMembershipHistory}
        onIncreaseSecurity={handleIncreaseSecurity}
      />
      
      {/* Subscription Management Modal */}
      <SubscriptionManagementModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        currentPlan={currentPlan}
        onChangePlan={handleChangePlan}
        onUpdatePayment={handleUpdatePayment}
        onCancelSubscription={handleCancelSubscription}
        onContactSupport={() => console.log("Contact support")}
      />
    </>
  );
}
