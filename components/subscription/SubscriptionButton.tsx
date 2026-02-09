"use client";

import { useStripe } from "@/hooks/use-stripe";
import { Button } from "../ui/button";

interface SubscriptionButtonProps {
  planName: "Basic" | "Growth" | "Enterprise";
  interval: "month" | "year";
}

export function SubscriptionButton({
  planName,
  interval,
}: SubscriptionButtonProps) {
  const { createCheckoutSession, isCreatingCheckout, hasActiveSubscription } =
    useStripe();

  const handleSubscribe = () => {
    const baseUrl = window.location.origin;

    // Send planName and interval instead of priceId
    createCheckoutSession({
      planName, // 'basic', 'growth', or 'enterprise'
      interval, // 'month' or 'year'
      successUrl: `${baseUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/pricing`,
      trialPeriod: true,
    });
  };

  return (
    <Button
      onClick={handleSubscribe}
      disabled={isCreatingCheckout}
      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
    >
      {isCreatingCheckout ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </span>
      ) : hasActiveSubscription ? (
        "Upgrade Plan"
      ) : (
        "Start Free Trial"
      )}
    </Button>
  );
}
