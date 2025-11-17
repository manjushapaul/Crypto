"use client";

import { useState } from "react";
import Profile from "@/components/dashboard/Profile";

/**
 * Profile Page
 * 
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
 * 
 * Design:
 * - Matches dashboard styling exactly
 * - bg-[#eaebfd] background
 * - Dashboard color palette throughout (#ff9500, #22243A, #ffe369)
 * - Fully responsive and accessible
 */
export default function ProfilePage() {
  return (
    <Profile />
  );
}

