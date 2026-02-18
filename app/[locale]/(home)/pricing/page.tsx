"use client";

import SubmitButton from "@/components/SubmitButton";
import PricingCard from "@/components/subscription/PricingCard";
import { stripeSubscriptionPlansConst } from "@/constants/subscription-plans";
import { useProfile } from "@/hooks/use-profile";
import { useStripe } from "@/hooks/use-stripe";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PricingPage() {
  const [interval, setInterval] = useState<"month" | "year">("month");
  const { createCheckoutSession, isCreatingCheckout, hasActiveSubscription } =
    useStripe();
  const { user: currentUser } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (currentUser?.hasActiveSubscription) {
      router.push("/employer");
    } else {
      router.push("/pricing");
    }
  }, [currentUser, router]);

  const stripeSubscriptionPlans = stripeSubscriptionPlansConst(interval);

  const handleSubscribe = (planName: string) => {
    const baseUrl = window.location.origin;
    const data = {
      planName,
      interval,
      successUrl: `${baseUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/pricing`,
      trialPeriod: true,
    };
    try {
      createCheckoutSession(data);
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <div className="min-h-screen  ">
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
          {stripeSubscriptionPlans.map((plan) => (
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
