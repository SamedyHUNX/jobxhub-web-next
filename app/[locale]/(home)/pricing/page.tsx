"use client";

import PricingCard from "@/components/subscription/PricingCard";
import { Button } from "@/components/ui/button";
import { SubscriptionPlans } from "@/constants/subscription-plans";
import { useState } from "react";

export default function PricingPage() {
  const [interval, setInterval] = useState<"month" | "year">("month");

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

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 mb-8">Start your 14-day free trial today</p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-4 bg-gray-100 p-1 rounded-lg">
          <Button
            onClick={() => setInterval("month")}
            className={`px-6 py-2 rounded-md transition ${
              interval === "month" ? "yellow-btn" : "text-gray-600"
            }`}
          >
            Monthly
          </Button>
          <button
            onClick={() => setInterval("year")}
            className={`px-6 py-2 rounded-md transition ${
              interval === "year" ? "yellow-btn" : "text-gray-600"
            }`}
          >
            Yearly
            <span className="ml-2 text-xs text-green-600 font-semibold">
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
            planName={plan.name}
          />
        ))}
      </div>
    </div>
  );
}
