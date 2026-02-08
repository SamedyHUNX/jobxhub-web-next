// app/subscription/manage/page.tsx
"use client";

import { useStripe } from "@/hooks/use-stripe";

export default function ManageSubscriptionPage() {
  const {
    subscription,
    isLoadingSubscription,
    cancelSubscription,
    isCancellingSubscription,
    reactivateSubscription,
    isReactivatingSubscription,
    openBillingPortal,
    paymentHistory,
  } = useStripe();

  if (isLoadingSubscription) {
    return <div className="container mx-auto py-12">Loading...</div>;
  }

  if (!subscription) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">No Active Subscription</h1>
        <a href="/pricing" className="text-blue-600 hover:underline">
          View Pricing Plans
        </a>
      </div>
    );
  }

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel your subscription?")) {
      cancelSubscription({ cancelAtPeriodEnd: true });
    }
  };

  const handleReactivate = () => {
    reactivateSubscription();
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Manage Subscription</h1>

      {/* Current Subscription */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
        <div className="space-y-2">
          <p>
            <span className="text-gray-600">Status:</span>{" "}
            <span
              className={`font-semibold ${
                subscription.status === "active"
                  ? "text-green-600"
                  : "text-orange-600"
              }`}
            >
              {subscription.status.toUpperCase()}
            </span>
          </p>
          <p>
            <span className="text-gray-600">Current Period Ends:</span>{" "}
            <span className="font-semibold">
              {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </span>
          </p>
          {subscription.cancelAtPeriodEnd && (
            <p className="text-orange-600 font-semibold">
              Subscription will cancel on{" "}
              {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => openBillingPortal()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Manage Billing
          </button>

          {subscription.cancelAtPeriodEnd ? (
            <button
              onClick={handleReactivate}
              disabled={isReactivatingSubscription}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isReactivatingSubscription ? "Processing..." : "Reactivate"}
            </button>
          ) : (
            <button
              onClick={handleCancel}
              disabled={isCancellingSubscription}
              className="px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
            >
              {isCancellingSubscription
                ? "Processing..."
                : "Cancel Subscription"}
            </button>
          )}
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>
        {paymentHistory && paymentHistory.length > 0 ? (
          <div className="space-y-3">
            {paymentHistory.map((payment) => (
              <div
                key={payment.id}
                className="flex justify-between items-center py-3 border-b last:border-b-0"
              >
                <div>
                  <p className="font-medium">
                    ${(payment.amount / 100).toFixed(2)}{" "}
                    {payment.currency.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    payment.status === "succeeded"
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {payment.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No payment history yet.</p>
        )}
      </div>
    </div>
  );
}
