// types/stripe.ts

// Stripe subscription status
export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "trialing"
  | "unpaid";

// Stripe payment status
export type PaymentStatus =
  | "succeeded"
  | "pending"
  | "failed"
  | "canceled"
  | "requires_action"
  | "requires_payment_method";

// Subscription interval
export type SubscriptionInterval = "day" | "week" | "month" | "year";

// Price object
export interface Price {
  id: string;
  productId: string;
  amount: number;
  currency: string;
  interval: SubscriptionInterval;
  intervalCount: number;
  trialPeriodDays?: number;
}

// Product object
export interface Product {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  metadata?: Record<string, string>;
}

// Subscription item
export interface SubscriptionItem {
  id: string;
  priceId: string;
  price: Price;
  quantity: number;
}

// Subscription object
export interface Subscription {
  id: string;
  userId: string;
  customerId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date | string;
  currentPeriodEnd: Date | string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date | string | null;
  trialStart?: Date | string | null;
  trialEnd?: Date | string | null;
  items: SubscriptionItem[];
  metadata?: Record<string, string>;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Payment method
export interface PaymentMethod {
  id: string;
  type: "card" | "bank_account" | "paypal";
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  bankAccount?: {
    bankName: string;
    last4: string;
  };
}

// Invoice
export interface Invoice {
  id: string;
  amountDue: number;
  amountPaid: number;
  currency: string;
  status: "draft" | "open" | "paid" | "uncollectible" | "void";
  invoicePdf?: string;
  hostedInvoiceUrl?: string;
  created: Date | string;
}

// Payment history item
export interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description?: string;
  invoice?: Invoice;
  paymentMethod?: PaymentMethod;
  receiptUrl?: string;
  createdAt: Date | string;
}

// DTOs for API requests

// Create subscription DTO
export interface CreateSubscriptionDto {
  planName: string; // 'basic', 'growth', or 'enterprise'
  interval: "month" | "year";
  // priceId?: string;
  quantity?: number;
  trialPeriodDays?: number;
  paymentMethodId?: string; // For direct subscription creation
  couponId?: string;
  metadata?: Record<string, string>;
  trialPeriod?: boolean;
}

// Create checkout session DTO
export interface CreateCheckoutSessionDto extends CreateSubscriptionDto {
  successUrl: string;
  cancelUrl: string;
  mode?: "subscription" | "payment";
  allowPromotionCodes?: boolean;
}

// Update subscription DTO
export interface UpdateSubscriptionDto {
  priceId?: string;
  quantity?: number;
  prorationBehavior?: "create_prorations" | "none" | "always_invoice";
  metadata?: Record<string, string>;
}

// Cancel subscription DTO
export interface CancelSubscriptionDto {
  cancelAtPeriodEnd?: boolean;
  cancellationReason?: string;
}

// Webhook event types
export type StripeWebhookEvent =
  | "customer.subscription.created"
  | "customer.subscription.updated"
  | "customer.subscription.deleted"
  | "customer.subscription.trial_will_end"
  | "invoice.payment_succeeded"
  | "invoice.payment_failed"
  | "invoice.upcoming"
  | "checkout.session.completed"
  | "checkout.session.expired"
  | "payment_intent.succeeded"
  | "payment_intent.payment_failed";

// Webhook payload
export interface StripeWebhookPayload {
  id: string;
  object: "event";
  type: StripeWebhookEvent;
  data: {
    object: any; // The actual Stripe object (subscription, invoice, etc.)
    previous_attributes?: any;
  };
  created: number;
}

// Customer object
export interface Customer {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  address?: {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string;
    postalCode?: string;
    state?: string;
  };
  metadata?: Record<string, string>;
}

// Portal session
export interface BillingPortalSession {
  id: string;
  url: string;
  returnUrl: string;
}

// Checkout session
export interface CheckoutSession {
  id: string;
  url: string;
  customerId?: string;
  subscriptionId?: string;
  status: "complete" | "expired" | "open";
}

// Plan/Pricing tier (for UI)
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  priceId: string;
  price: number;
  currency: string;
  interval: SubscriptionInterval;
  features: string[];
  highlighted?: boolean;
  trialDays?: number;
}

// Subscription with additional computed fields (for UI)
export interface SubscriptionWithDetails extends Subscription {
  isActive: boolean;
  isCanceled: boolean;
  isTrialing: boolean;
  isPastDue: boolean;
  daysUntilRenewal: number;
  monthlyPrice: number;
  plan?: PricingPlan;
}

// Usage record (for metered billing)
export interface UsageRecord {
  id: string;
  subscriptionItemId: string;
  quantity: number;
  timestamp: Date | string;
  action?: "increment" | "set";
}

// Proration preview (for subscription changes)
export interface ProrationPreview {
  prorationDate: number;
  immediateCharge: number;
  nextInvoiceAmount: number;
  creditBalance: number;
  invoiceItems: Array<{
    description: string;
    amount: number;
  }>;
}
