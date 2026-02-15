"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useStripe } from "@/hooks/use-stripe";
import Image from "next/image";
import successImg from "@/public/assets/images/success.webp";

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();
  const { subscription, isLoadingSubscription } = useStripe();

  useEffect(() => {
    // Redirect to dashboard after a few seconds
    const timer = setTimeout(() => {
      router.push("/subscription/manage");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="space-y-6 max-w-md text-center">
        <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
          <Image
            src={successImg}
            alt="success"
            width={200}
            height={200}
            className="mix-blend-screen"
          />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Subscription Successful!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your subscription has been activated
        </p>
        {!isLoadingSubscription && subscription && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
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
