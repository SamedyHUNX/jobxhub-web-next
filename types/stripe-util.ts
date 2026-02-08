import type {
  Subscription,
  SubscriptionWithDetails,
  PricingPlan,
  SubscriptionStatus,
} from "./stripe";

// Helper type for subscription filters
export type SubscriptionFilter = {
  status?: SubscriptionStatus[];
  priceId?: string;
  productId?: string;
};

// Helper type for pagination
export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  total?: number;
}

// Stripe API response wrapper
export interface StripeApiResponse<T> {
  data: T;
  message?: string;
}

// Error response
export interface StripeErrorResponse {
  error: {
    type: string;
    message: string;
    code?: string;
    param?: string;
  };
}

// Type guards
export function isActiveSubscription(subscription: Subscription): boolean {
  return subscription.status === "active" || subscription.status === "trialing";
}

export function isSubscriptionCanceled(subscription: Subscription): boolean {
  return subscription.cancelAtPeriodEnd || subscription.status === "canceled";
}

// Utility to convert Subscription to SubscriptionWithDetails
export function enrichSubscription(
  subscription: Subscription,
  plan?: PricingPlan,
): SubscriptionWithDetails {
  const now = new Date();
  const endDate = new Date(subscription.currentPeriodEnd);
  const daysUntilRenewal = Math.ceil(
    (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Calculate monthly price from the first item
  const firstItem = subscription.items[0];
  const price = firstItem?.price;
  let monthlyPrice = 0;

  if (price) {
    monthlyPrice = price.amount / 100; // Convert from cents
    if (price.interval === "year") {
      monthlyPrice = monthlyPrice / 12;
    }
  }

  return {
    ...subscription,
    isActive: isActiveSubscription(subscription),
    isCanceled: isSubscriptionCanceled(subscription),
    isTrialing: subscription.status === "trialing",
    isPastDue: subscription.status === "past_due",
    daysUntilRenewal,
    monthlyPrice,
    plan,
  };
}
