"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useStripe } from "@/hooks/use-stripe";

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();
  const { subscription, isLoadingSubscription } = useStripe();

  useEffect(() => {
    // Redirect to dashboard after a few seconds
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="container mx-auto py-12 px-4 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <svg
            className="w-20 h-20 text-green-500 mx-auto"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">Subscription Successful!</h1>
        <p className="text-gray-600 mb-8">
          Your subscription has been activated. You'll be redirected to your
          dashboard shortly.
        </p>
        {!isLoadingSubscription && subscription && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Trial ends on:{" "}
              <span className="font-semibold">
                {new Date(subscription.trialEnd!).toLocaleDateString()}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
