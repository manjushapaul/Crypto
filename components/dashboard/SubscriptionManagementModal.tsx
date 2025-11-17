"use client";

import { useState } from "react";
import {
  X,
  Check,
  CreditCard,
  Calendar,
  DollarSign,
  Crown,
  Shield,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Plan Interface
 */
interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
}

/**
 * Subscription Modal Props
 * 
 * @property {boolean} isOpen - Controls modal visibility
 * @property {() => void} onClose - Callback to close modal
 * @property {string} currentPlan - Current plan ID ("free", "premium", "professional")
 * @property {(planId: string) => void} onChangePlan - Callback when plan is changed
 * @property {() => void} onUpdatePayment - Callback to update payment method
 * @property {() => void} onCancelSubscription - Callback to cancel subscription
 * @property {() => void} onContactSupport - Callback to contact support
 */
interface SubscriptionManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
  onChangePlan?: (planId: string) => void;
  onUpdatePayment?: () => void;
  onCancelSubscription?: () => void;
  onContactSupport?: () => void;
}

/**
 * Available plans
 */
const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    features: ["Basic portfolio tracking", "5 watchlist coins", "Community support"],
  },
  {
    id: "premium",
    name: "Premium",
    price: 49.99,
    period: "month",
    features: ["Advanced analytics", "Unlimited watchlist", "Priority support", "API access"],
  },
  {
    id: "professional",
    name: "Professional",
    price: 99.99,
    period: "month",
    features: ["Everything in Premium", "Trading signals", "Dedicated manager", "Team tools"],
  },
];

/**
 * Subscription Management Modal Component
 * 
 * Matches the visual style of the asset details modal:
 * - White background with large rounded corners
 * - Centered modal with shadow-2xl
 * - Close button in top right corner
 * - Header with gradient background
 * - Stats grid layout (2 columns)
 * - Action buttons row (gold primary, white outlined secondary)
 * 
 * Features:
 * - Display current subscription details
 * - Plan name, price, renewal date
 * - Payment method display
 * - Plan features with pill badges
 * - Change plan action
 * - Update payment action
 * - Cancel subscription with confirmation
 * - Contact support
 * 
 * Design exactly matches asset modal from Explore page for visual consistency.
 * 
 * @example
 * ```tsx
 * <SubscriptionManagementModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   currentPlan="premium"
 *   onChangePlan={(id) => handlePlanChange(id)}
 *   onUpdatePayment={() => handleUpdatePayment()}
 *   onCancelSubscription={() => handleCancel()}
 * />
 * ```
 */
export default function SubscriptionManagementModal({
  isOpen,
  onClose,
  currentPlan = "premium",
  onChangePlan,
  onUpdatePayment,
  onCancelSubscription,
  onContactSupport,
}: SubscriptionManagementModalProps) {
  const [loading, setLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showChangePlan, setShowChangePlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);

  // Get current plan data
  const planData = PLANS.find(p => p.id === currentPlan) || PLANS[1];
  
  // Mock data for demonstration
  const nextBillingDate = "February 15, 2025";
  const paymentMethod = { type: "Visa", last4: "4242" };

  /**
   * Handle change plan
   */
  const handleChangePlan = async () => {
    if (selectedPlan === currentPlan) {
      return;
    }

    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onChangePlan) {
        onChangePlan(selectedPlan);
      }
      
      setShowChangePlan(false);
      onClose();
      
    } catch (error) {
      console.error("Plan change error:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle cancel subscription
   */
  const handleCancelSubscription = async () => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onCancelSubscription) {
        onCancelSubscription();
      }
      
      setShowCancelConfirm(false);
      onClose();
      
    } catch (error) {
      console.error("Cancellation error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Change Plan View
  if (showChangePlan) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md">
                <Crown className="h-7 w-7 text-[#ff9500]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  Change Plan
                </h2>
                <p className="text-sm font-medium text-gray-600">Select your new plan</p>
              </div>
            </div>
            <button
              onClick={() => setShowChangePlan(false)}
              className="group rounded-full bg-white p-2 text-gray-400 shadow-md transition-all hover:bg-gray-100 hover:text-gray-900 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#ff9500] focus:ring-offset-2"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[70vh] overflow-y-auto p-6">
            <div className="space-y-4">
              {PLANS.map((plan) => {
                const isCurrentPlan = plan.id === currentPlan;
                const isSelected = plan.id === selectedPlan;

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={cn(
                      "cursor-pointer rounded-xl border-2 p-5 transition-all",
                      isSelected
                        ? "border-[#ff9500] bg-orange-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                          {isCurrentPlan && (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-1 mb-3">
                          <span className="text-3xl font-bold text-gray-900">
                            ${plan.price}
                          </span>
                          <span className="text-sm text-gray-600">/ {plan.period}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {plan.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="ml-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff9500]">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleChangePlan}
                disabled={loading || selectedPlan === currentPlan}
                className={cn(
                  "flex-1 rounded-xl px-4 py-3 text-center font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2",
                  loading || selectedPlan === currentPlan
                    ? "cursor-not-allowed bg-gray-300 text-gray-500"
                    : "bg-[#ffe369] text-[#22243A] hover:bg-[#ffd940] hover:shadow-lg focus:ring-[#22243A]"
                )}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Changing Plan...
                  </span>
                ) : (
                  "Confirm Change"
                )}
              </button>
              <button
                onClick={() => setShowChangePlan(false)}
                disabled={loading}
                className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-center font-bold text-gray-900 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cancel Confirmation View
  if (showCancelConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="border-b border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Cancel Subscription?</h2>
                <p className="text-sm text-gray-600">This action can be reversed</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Your subscription will remain active until{" "}
              <span className="font-bold">{nextBillingDate}</span>. After that, you'll lose access
              to {planData.name} features.
            </p>
            <p className="text-sm text-gray-600">
              You can reactivate your subscription at any time before the end of your billing period.
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                disabled={loading}
                className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-center font-bold text-gray-900 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Keep Plan
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={loading}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-center font-bold text-white transition-all hover:bg-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Cancelling...
                  </span>
                ) : (
                  "Cancel Subscription"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Subscription Details View
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Modal Header - Matches asset modal style */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md">
              <Crown className="h-7 w-7 text-[#ff9500]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                {planData.name} Subscription
              </h2>
              <p className="text-sm font-medium text-gray-600">Manage your plan and billing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="group rounded-full bg-white p-2 text-gray-400 shadow-md transition-all hover:bg-gray-100 hover:text-gray-900 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#ff9500] focus:ring-offset-2"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          {/* Price Section - Matches asset modal style */}
          <div className="mb-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-5">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Current Plan
                </p>
                <p className="mt-1 text-4xl font-bold text-gray-900">
                  ${planData.price}
                  <span className="text-lg text-gray-600">/{planData.period}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-500">Status</p>
                <div className="mt-1 flex items-center gap-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                    <Check className="h-4 w-4" />
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Features */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-500">
              Plan Features
            </h3>
            <div className="flex flex-wrap gap-2">
              {planData.features.map((feature, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-purple-100 px-3 py-1.5 text-xs font-medium text-purple-700"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Billing Stats - Matches asset modal stats grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-blue-600" />
                <p className="text-xs font-medium text-gray-600">Next Billing</p>
              </div>
              <p className="text-lg font-bold text-gray-900">{nextBillingDate}</p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="h-4 w-4 text-purple-600" />
                <p className="text-xs font-medium text-gray-600">Payment Method</p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {paymentMethod.type} •••• {paymentMethod.last4}
              </p>
            </div>
          </div>

          {/* Billing Amount */}
          <div className="mb-6 rounded-lg bg-green-50 p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <p className="text-xs font-medium text-gray-600">Next Payment Amount</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">${planData.price}</p>
            <p className="text-xs text-gray-600 mt-1">Auto-renews on {nextBillingDate}</p>
          </div>

          {/* Security Info */}
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-blue-900 text-sm">Secure Billing</h4>
                <p className="text-xs text-blue-700 mt-1">
                  Your payment information is encrypted and secure. We never store your full card details.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons - Matches asset modal button row */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setShowChangePlan(true)}
              className="flex-1 rounded-xl bg-[#ffe369] px-4 py-3 text-center font-bold text-[#22243A] transition-all hover:bg-[#ffd940] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#22243A] focus:ring-offset-2"
            >
              Change Plan
            </button>
            <button
              onClick={onUpdatePayment}
              className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-center font-bold text-gray-900 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Update Payment
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="flex-1 rounded-xl border-2 border-red-200 bg-white px-4 py-3 text-center font-bold text-red-600 transition-all hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Cancel Subscription
            </button>
            <button
              onClick={onContactSupport}
              className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-center font-bold text-gray-900 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

