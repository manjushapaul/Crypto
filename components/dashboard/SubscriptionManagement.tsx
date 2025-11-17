"use client";

import { useState, useEffect } from "react";
import {
  X,
  Check,
  CreditCard,
  Calendar,
  DollarSign,
  AlertCircle,
  Download,
  ChevronRight,
  HelpCircle,
  Loader2,
  Shield,
  Zap,
  Crown,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Plan Tier Interface
 */
interface PlanTier {
  id: string;
  name: string;
  price: number;
  billingPeriod: "monthly" | "yearly";
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  popular?: boolean;
}

/**
 * Invoice Interface
 */
interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  planName: string;
  downloadUrl?: string;
}

/**
 * Payment Method Interface
 */
interface PaymentMethod {
  type: "card" | "paypal" | "bank";
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
}

/**
 * Subscription Management Props
 */
interface SubscriptionManagementProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
  onChangePlan?: (planId: string) => void;
  onUpdatePayment?: (paymentData: any) => void;
  onCancelSubscription?: () => void;
  onRenewSubscription?: () => void;
}

/**
 * Toast notification state
 */
interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

/**
 * Available subscription plans
 */
const PLANS: PlanTier[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    billingPeriod: "monthly",
    features: [
      "Basic portfolio tracking",
      "5 watchlist coins",
      "Daily market updates",
      "Mobile app access",
      "Community support",
    ],
    icon: Star,
  },
  {
    id: "premium",
    name: "Premium",
    price: 49.99,
    billingPeriod: "monthly",
    features: [
      "Advanced portfolio analytics",
      "Unlimited watchlist",
      "Real-time price alerts",
      "Priority support",
      "API access",
      "Advanced charting tools",
      "Tax reporting",
    ],
    icon: Crown,
    popular: true,
  },
  {
    id: "professional",
    name: "Professional",
    price: 99.99,
    billingPeriod: "monthly",
    features: [
      "Everything in Premium",
      "Automated trading signals",
      "Custom indicators",
      "White-label solutions",
      "Dedicated account manager",
      "Advanced security features",
      "Multi-exchange support",
      "Team collaboration tools",
    ],
    icon: Zap,
  },
];

/**
 * Mock invoices data
 */
const MOCK_INVOICES: Invoice[] = [
  {
    id: "INV-2024-001",
    date: "2024-01-15",
    amount: 49.99,
    status: "paid",
    planName: "Premium Monthly",
  },
  {
    id: "INV-2023-012",
    date: "2023-12-15",
    amount: 49.99,
    status: "paid",
    planName: "Premium Monthly",
  },
  {
    id: "INV-2023-011",
    date: "2023-11-15",
    amount: 49.99,
    status: "paid",
    planName: "Premium Monthly",
  },
];

/**
 * SubscriptionManagement Component
 * 
 * Full-featured subscription management modal with:
 * - Current subscription details and status
 * - Plan comparison and switching
 * - Payment method management
 * - Invoice history with download
 * - Cancellation flow with confirmation
 * - Support and FAQ access
 * - Toast notifications for actions
 * 
 * Design:
 * - Black/dark backgrounds with gold/orange highlights
 * - Full-screen modal with center panel
 * - Responsive and accessible (ARIA labels, keyboard nav)
 * - Smooth animations and transitions
 * - Large tap zones for mobile
 * 
 * @example
 * ```tsx
 * <SubscriptionManagement
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   currentPlan="premium"
 *   onChangePlan={(planId) => handlePlanChange(planId)}
 *   onUpdatePayment={(data) => handlePaymentUpdate(data)}
 *   onCancelSubscription={() => handleCancel()}
 * />
 * ```
 */
export default function SubscriptionManagement({
  isOpen,
  onClose,
  currentPlan = "premium",
  onChangePlan,
  onUpdatePayment,
  onCancelSubscription,
  onRenewSubscription,
}: SubscriptionManagementProps) {
  // State
  const [activeTab, setActiveTab] = useState<"overview" | "plans" | "payment" | "invoices">("overview");
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlan);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Mock data
  const [paymentMethod] = useState<PaymentMethod>({
    type: "card",
    last4: "4242",
    brand: "Visa",
    expiryMonth: 12,
    expiryYear: 2025,
  });

  const currentPlanData = PLANS.find(p => p.id === currentPlan);
  const nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  /**
   * Add toast notification
   */
  const addToast = (message: string, type: Toast["type"] = "success") => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  /**
   * Remove toast
   */
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  /**
   * Handle plan change
   */
  const handleChangePlan = async (planId: string) => {
    if (planId === currentPlan) {
      addToast("You're already on this plan", "info");
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSelectedPlan(planId);
      
      if (onChangePlan) {
        onChangePlan(planId);
      }
      
      const newPlan = PLANS.find(p => p.id === planId);
      addToast(`Successfully switched to ${newPlan?.name} plan!`, "success");
      
      // Switch back to overview after plan change
      setTimeout(() => {
        setActiveTab("overview");
      }, 1000);
      
    } catch (error) {
      addToast("Failed to change plan. Please try again.", "error");
      console.error("Plan change error:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle payment update
   */
  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onUpdatePayment) {
        onUpdatePayment({});
      }
      
      addToast("Payment method updated successfully!", "success");
      setShowPaymentModal(false);
      
    } catch (error) {
      addToast("Failed to update payment method. Please try again.", "error");
      console.error("Payment update error:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle subscription cancellation
   */
  const handleCancelSubscription = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onCancelSubscription) {
        onCancelSubscription();
      }
      
      addToast("Subscription cancelled. You'll have access until the end of your billing period.", "success");
      setShowCancelConfirm(false);
      
      // Close modal after cancellation
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      addToast("Failed to cancel subscription. Please contact support.", "error");
      console.error("Cancellation error:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle invoice download
   */
  const handleDownloadInvoice = (invoice: Invoice) => {
    addToast(`Downloading invoice ${invoice.id}...`, "info");
    console.log("Download invoice:", invoice.id);
    // In production, trigger actual download
  };

  /**
   * Handle keyboard navigation
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !showCancelConfirm && !showPaymentModal) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, showCancelConfirm, showPaymentModal]);

  if (!isOpen) return null;

  return (
    <>
      {/* Full-Screen Modal Overlay */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscription-title"
      >
        {/* Center Panel */}
        <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl bg-[#1a1a1a] border-2 border-[#FF9500] shadow-2xl">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[#FF9500]/30 bg-black p-6">
            <div>
              <h1 id="subscription-title" className="text-3xl font-extrabold text-white">
                Subscription Management
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Manage your plan, billing, and payment methods
              </p>
            </div>
            <button
              onClick={onClose}
              className="group rounded-full bg-[#FF9500] p-3 text-black shadow-lg transition-all hover:bg-[#ffa520] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Close subscription management"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-[#FF9500]/20 bg-[#0f0f0f] px-6">
            <nav className="flex gap-4" role="tablist" aria-label="Subscription sections">
              {[
                { id: "overview", label: "Overview" },
                { id: "plans", label: "Change Plan" },
                { id: "payment", label: "Payment" },
                { id: "invoices", label: "Invoices" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "relative px-4 py-4 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#FF9500]",
                    activeTab === tab.id
                      ? "text-[#FF9500]"
                      : "text-gray-400 hover:text-gray-200"
                  )}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`${tab.id}-panel`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF9500]" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="max-h-[calc(90vh-200px)] overflow-y-auto p-6">
            
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6" role="tabpanel" id="overview-panel">
                {/* Current Plan Card */}
                <div className="rounded-2xl bg-black border-2 border-[#FF9500] p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {currentPlanData?.icon && (
                          <currentPlanData.icon className="h-8 w-8 text-[#FF9500]" />
                        )}
                        <h2 className="text-2xl font-extrabold text-[#FF9500]">
                          {currentPlanData?.name} Plan
                        </h2>
                      </div>
                      <p className="text-gray-400">Your current subscription</p>
                    </div>
                    <div className="rounded-full bg-[#FF9500] px-4 py-2 shadow-lg">
                      <span className="text-sm font-extrabold text-black">ACTIVE</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Price */}
                    <div className="rounded-xl bg-[#1a1a1a] p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-[#FF9500]" />
                        <span className="text-sm font-medium text-gray-400">Billing Amount</span>
                      </div>
                      <p className="text-2xl font-extrabold text-[#FF9500]">
                        ${currentPlanData?.price}
                        <span className="text-sm text-gray-400 ml-1">/month</span>
                      </p>
                    </div>

                    {/* Next Billing */}
                    <div className="rounded-xl bg-[#1a1a1a] p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-5 w-5 text-[#FF9500]" />
                        <span className="text-sm font-medium text-gray-400">Next Billing</span>
                      </div>
                      <p className="text-lg font-bold text-white">{nextBillingDate}</p>
                    </div>

                    {/* Payment Method */}
                    <div className="rounded-xl bg-[#1a1a1a] p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="h-5 w-5 text-[#FF9500]" />
                        <span className="text-sm font-medium text-gray-400">Payment Method</span>
                      </div>
                      <p className="text-lg font-bold text-white">
                        {paymentMethod.brand} •••• {paymentMethod.last4}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-6">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">
                      Plan Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {currentPlanData?.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#FF9500] shrink-0" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab("plans")}
                    className="flex items-center justify-between rounded-xl bg-[#FF9500] p-5 text-left shadow-lg transition-all hover:bg-[#ffa520] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
                  >
                    <div>
                      <h3 className="text-lg font-extrabold text-black">Change Plan</h3>
                      <p className="text-sm text-black/70">Upgrade or downgrade</p>
                    </div>
                    <ChevronRight className="h-6 w-6 text-black" />
                  </button>

                  <button
                    onClick={() => setActiveTab("payment")}
                    className="flex items-center justify-between rounded-xl border-2 border-[#FF9500] bg-transparent p-5 text-left shadow-lg transition-all hover:bg-[#FF9500] hover:text-black focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:ring-offset-2 focus:ring-offset-[#1a1a1a] group"
                  >
                    <div>
                      <h3 className="text-lg font-extrabold text-[#FF9500] group-hover:text-black">
                        Update Payment
                      </h3>
                      <p className="text-sm text-gray-400 group-hover:text-black/70">
                        Manage payment method
                      </p>
                    </div>
                    <ChevronRight className="h-6 w-6 text-[#FF9500] group-hover:text-black" />
                  </button>
                </div>

                {/* Recent Invoices Preview */}
                <div className="rounded-2xl bg-black border border-[#FF9500]/30 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Recent Invoices</h2>
                    <button
                      onClick={() => setActiveTab("invoices")}
                      className="text-sm font-bold text-[#FF9500] hover:text-[#ffa520] focus:outline-none focus:ring-2 focus:ring-[#FF9500] rounded px-2 py-1"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-2">
                    {MOCK_INVOICES.slice(0, 3).map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between rounded-xl bg-[#1a1a1a] p-4"
                      >
                        <div>
                          <p className="font-bold text-white">{invoice.planName}</p>
                          <p className="text-sm text-gray-400">{invoice.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-[#FF9500]">
                            ${invoice.amount}
                          </span>
                          <span className={cn(
                            "rounded-full px-3 py-1 text-xs font-bold",
                            invoice.status === "paid" && "bg-green-500/20 text-green-400",
                            invoice.status === "pending" && "bg-yellow-500/20 text-yellow-400",
                            invoice.status === "failed" && "bg-red-500/20 text-red-400"
                          )}>
                            {invoice.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cancel Subscription */}
                <div className="rounded-xl border-2 border-red-500/30 bg-red-500/5 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-red-400">Cancel Subscription</h3>
                      <p className="mt-1 text-sm text-gray-400">
                        You'll have access until {nextBillingDate}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="rounded-xl border-2 border-red-500 bg-transparent px-6 py-2 font-bold text-red-500 transition-all hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
                    >
                      Cancel Plan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Change Plan Tab */}
            {activeTab === "plans" && (
              <div className="space-y-6" role="tabpanel" id="plans-panel">
                <div>
                  <h2 className="text-2xl font-extrabold text-white mb-2">
                    Choose Your Plan
                  </h2>
                  <p className="text-gray-400">
                    Select the plan that best fits your needs
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {PLANS.map((plan) => {
                    const isCurrentPlan = plan.id === currentPlan;
                    const isSelected = plan.id === selectedPlan;
                    const PlanIcon = plan.icon;

                    return (
                      <div
                        key={plan.id}
                        className={cn(
                          "relative rounded-2xl border-2 p-6 transition-all cursor-pointer",
                          isSelected || isCurrentPlan
                            ? "border-[#FF9500] bg-[#FF9500]/10 shadow-xl shadow-[#FF9500]/20"
                            : "border-gray-700 bg-[#0f0f0f] hover:border-[#FF9500]/50"
                        )}
                        onClick={() => !isCurrentPlan && setSelectedPlan(plan.id)}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            !isCurrentPlan && setSelectedPlan(plan.id);
                          }
                        }}
                      >
                        {/* Popular Badge */}
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="rounded-full bg-[#FF9500] px-4 py-1 text-xs font-extrabold text-black shadow-lg">
                              MOST POPULAR
                            </span>
                          </div>
                        )}

                        {/* Current Plan Badge */}
                        {isCurrentPlan && (
                          <div className="absolute -top-3 right-4">
                            <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                              CURRENT
                            </span>
                          </div>
                        )}

                        {/* Plan Icon */}
                        <div className="mb-4">
                          <div className={cn(
                            "inline-flex items-center justify-center rounded-full p-3",
                            isSelected || isCurrentPlan ? "bg-[#FF9500]" : "bg-gray-800"
                          )}>
                            <PlanIcon className={cn(
                              "h-6 w-6",
                              isSelected || isCurrentPlan ? "text-black" : "text-[#FF9500]"
                            )} />
                          </div>
                        </div>

                        {/* Plan Name */}
                        <h3 className="text-2xl font-extrabold text-white mb-2">
                          {plan.name}
                        </h3>

                        {/* Price */}
                        <div className="mb-6">
                          <span className="text-4xl font-extrabold text-[#FF9500]">
                            ${plan.price}
                          </span>
                          <span className="text-gray-400 ml-2">/month</span>
                        </div>

                        {/* Features */}
                        <ul className="space-y-3 mb-6">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-[#FF9500] shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-300">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Select Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChangePlan(plan.id);
                          }}
                          disabled={isCurrentPlan || loading}
                          className={cn(
                            "w-full rounded-xl px-4 py-3 font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:ring-offset-2 focus:ring-offset-[#0f0f0f]",
                            isCurrentPlan
                              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                              : isSelected
                              ? "bg-[#FF9500] text-black shadow-lg hover:bg-[#ffa520]"
                              : "border-2 border-[#FF9500] bg-transparent text-[#FF9500] hover:bg-[#FF9500] hover:text-black"
                          )}
                        >
                          {loading && selectedPlan === plan.id ? (
                            <span className="flex items-center justify-center gap-2">
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Switching...
                            </span>
                          ) : isCurrentPlan ? (
                            "Current Plan"
                          ) : (
                            "Select Plan"
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === "payment" && (
              <div className="space-y-6" role="tabpanel" id="payment-panel">
                <div>
                  <h2 className="text-2xl font-extrabold text-white mb-2">
                    Payment Method
                  </h2>
                  <p className="text-gray-400">
                    Manage your billing information
                  </p>
                </div>

                {/* Current Payment Method */}
                <div className="rounded-2xl bg-black border-2 border-[#FF9500] p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-[#FF9500] p-3">
                        <CreditCard className="h-6 w-6 text-black" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {paymentMethod.brand} •••• {paymentMethod.last4}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-400">
                      ACTIVE
                    </span>
                  </div>

                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full rounded-xl border-2 border-[#FF9500] bg-transparent px-4 py-3 font-bold text-[#FF9500] transition-all hover:bg-[#FF9500] hover:text-black focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:ring-offset-2 focus:ring-offset-black"
                  >
                    Update Payment Method
                  </button>
                </div>

                {/* Security Info */}
                <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-6">
                  <div className="flex gap-3">
                    <Shield className="h-6 w-6 text-blue-400 shrink-0" />
                    <div>
                      <h3 className="font-bold text-blue-300 mb-1">
                        Your payment is secure
                      </h3>
                      <p className="text-sm text-blue-400/80">
                        We use industry-standard encryption to protect your payment information.
                        Your card details are never stored on our servers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Invoices Tab */}
            {activeTab === "invoices" && (
              <div className="space-y-6" role="tabpanel" id="invoices-panel">
                <div>
                  <h2 className="text-2xl font-extrabold text-white mb-2">
                    Invoice History
                  </h2>
                  <p className="text-gray-400">
                    View and download your past invoices
                  </p>
                </div>

                <div className="space-y-3">
                  {MOCK_INVOICES.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-black border border-[#FF9500]/30 p-5 transition-all hover:border-[#FF9500]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-[#FF9500]/20 p-3">
                          <DollarSign className="h-5 w-5 text-[#FF9500]" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{invoice.planName}</h3>
                          <p className="text-sm text-gray-400 mt-1">
                            Invoice ID: {invoice.id}
                          </p>
                          <p className="text-sm text-gray-400">Date: {invoice.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-extrabold text-[#FF9500]">
                            ${invoice.amount}
                          </p>
                          <span className={cn(
                            "inline-block mt-1 rounded-full px-3 py-1 text-xs font-bold",
                            invoice.status === "paid" && "bg-green-500/20 text-green-400",
                            invoice.status === "pending" && "bg-yellow-500/20 text-yellow-400",
                            invoice.status === "failed" && "bg-red-500/20 text-red-400"
                          )}>
                            {invoice.status.toUpperCase()}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDownloadInvoice(invoice)}
                          className="rounded-lg bg-[#FF9500] p-3 text-black transition-all hover:bg-[#ffa520] focus:outline-none focus:ring-2 focus:ring-[#FF9500]"
                          aria-label={`Download invoice ${invoice.id}`}
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Support Section (visible in all tabs) */}
            <div className="mt-8 rounded-xl bg-[#FF9500]/10 border border-[#FF9500]/30 p-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-6 w-6 text-[#FF9500] shrink-0" />
                <div>
                  <h3 className="font-bold text-white mb-1">Need Help?</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Our support team is here to assist you with any questions about your subscription.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button className="rounded-lg bg-[#FF9500] px-4 py-2 text-sm font-bold text-black transition-all hover:bg-[#ffa520] focus:outline-none focus:ring-2 focus:ring-[#FF9500]">
                      Contact Support
                    </button>
                    <button className="rounded-lg border border-[#FF9500] bg-transparent px-4 py-2 text-sm font-bold text-[#FF9500] transition-all hover:bg-[#FF9500] hover:text-black focus:outline-none focus:ring-2 focus:ring-[#FF9500]">
                      View FAQ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
          <div className="w-full max-w-md rounded-2xl bg-black border-2 border-red-500 shadow-2xl">
            <div className="border-b-2 border-red-500/30 bg-red-500/10 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-red-500/20 p-3">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Cancel Subscription?</h2>
                  <p className="text-sm text-gray-400">This action can be reversed later</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-300 mb-4">
                Your subscription will remain active until <span className="font-bold text-white">{nextBillingDate}</span>.
                After that, you'll lose access to Premium features.
              </p>
              <p className="text-sm text-gray-400">
                You can reactivate your subscription at any time before the end of your billing period.
              </p>
            </div>

            <div className="flex gap-3 bg-[#1a1a1a] p-6">
              <button
                onClick={() => setShowCancelConfirm(false)}
                disabled={loading}
                className="flex-1 rounded-xl border-2 border-gray-600 bg-transparent px-4 py-3 font-bold text-gray-300 transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
              >
                Keep Plan
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={loading}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-bold text-white transition-all hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
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
      )}

      {/* Payment Update Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
          <div className="w-full max-w-md rounded-2xl bg-black border-2 border-[#FF9500] shadow-2xl">
            <div className="flex items-center justify-between border-b-2 border-[#FF9500]/30 bg-[#1a1a1a] p-6">
              <h2 className="text-xl font-bold text-white">Update Payment Method</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FF9500]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePayment} className="p-6 space-y-4">
              <div>
                <label htmlFor="card-number" className="block text-sm font-bold text-gray-300 mb-2">
                  Card Number
                </label>
                <input
                  id="card-number"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full rounded-lg bg-[#1a1a1a] border border-gray-700 px-4 py-3 text-white focus:border-[#FF9500] focus:outline-none focus:ring-2 focus:ring-[#FF9500]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry" className="block text-sm font-bold text-gray-300 mb-2">
                    Expiry Date
                  </label>
                  <input
                    id="expiry"
                    type="text"
                    placeholder="MM/YY"
                    className="w-full rounded-lg bg-[#1a1a1a] border border-gray-700 px-4 py-3 text-white focus:border-[#FF9500] focus:outline-none focus:ring-2 focus:ring-[#FF9500]/20"
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-bold text-gray-300 mb-2">
                    CVV
                  </label>
                  <input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    className="w-full rounded-lg bg-[#1a1a1a] border border-gray-700 px-4 py-3 text-white focus:border-[#FF9500] focus:outline-none focus:ring-2 focus:ring-[#FF9500]/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#FF9500] px-4 py-3 font-bold text-black transition-all hover:bg-[#ffa520] focus:outline-none focus:ring-2 focus:ring-[#FF9500] disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Update Payment"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-[70] space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "flex items-center gap-3 rounded-xl px-6 py-4 shadow-2xl animate-in slide-in-from-right-full",
              toast.type === "success" && "bg-[#FF9500] text-black",
              toast.type === "error" && "bg-red-600 text-white",
              toast.type === "info" && "bg-black border-2 border-[#FF9500] text-white"
            )}
            role="alert"
          >
            {toast.type === "success" && <Check className="h-5 w-5 shrink-0" />}
            {toast.type === "error" && <AlertCircle className="h-5 w-5 shrink-0" />}
            {toast.type === "info" && <AlertCircle className="h-5 w-5 shrink-0 text-[#FF9500]" />}
            <p className="font-bold">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 rounded-full p-1 hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

