"use client";

import SubmitButton from "@/components/SubmitButton";
import PricingCard from "@/components/subscription/PricingCard";
import { Button } from "@/components/ui/button";
import { SubscriptionPlans } from "@/constants/subscription-plans";
import { useStripe } from "@/hooks/use-stripe";
import { useState } from "react";

export default function PricingPage() {
  const [interval, setInterval] = useState<"month" | "year">("month");
  const { createCheckoutSession, isCreatingCheckout, hasActiveSubscription } =
    useStripe();

  const plans = [
    {
      ...SubscriptionPlans.Basic,
      price:
        interval === "month"
          ? SubscriptionPlans.Basic.priceMonthly
          : SubscriptionPlans.Basic.priceAnnual,
      isPopular: false,
    },
    {
      ...SubscriptionPlans.Growth,
      price:
        interval === "month"
          ? SubscriptionPlans.Growth.priceMonthly
          : SubscriptionPlans.Growth.priceAnnual,
      isPopular: true,
    },
    {
      ...SubscriptionPlans.Enterprise,
      price:
        interval === "month"
          ? SubscriptionPlans.Enterprise.priceMonthly
          : SubscriptionPlans.Enterprise.priceAnnual,
      isPopular: false,
    },
  ];

  const handleSubscribe = (planName: string) => {
    const baseUrl = window.location.origin;
    createCheckoutSession({
      planName,
      interval,
      successUrl: `${baseUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/pricing`,
      trialPeriod: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Choose Your Plan
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Start your 14-day free trial today
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setInterval("month")}
              className={`px-6 py-2 rounded-md transition ${
                interval === "month"
                  ? "bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setInterval("year")}
              className={`px-6 py-2 rounded-md transition ${
                interval === "year"
                  ? "bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Yearly
              <span className="ml-2 text-xs text-green-600 dark:text-green-400 font-semibold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              title={plan.name}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              interval={interval}
              isPopular={plan.isPopular}
              buttonComponent={
                <SubmitButton
                  onClick={() => handleSubscribe(plan.name)}
                  isSubmitting={isCreatingCheckout}
                  buttonText={
                    hasActiveSubscription ? "Upgrade Plan" : "Start Free Trial"
                  }
                />
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
