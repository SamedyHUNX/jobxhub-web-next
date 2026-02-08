// lib/api/stripe.ts
import axios from "axios";
import type {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  CreateCheckoutSessionDto,
  Subscription,
  PaymentHistory,
  CancelSubscriptionDto,
} from "@/types/stripe";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true,
});

function assertApiUrl() {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL env variable is not set");
  }
}

export const stripeApi = {
  // Create Subscription (Direct)
  createSubscription: async (
    dto: CreateSubscriptionDto,
  ): Promise<Subscription> => {
    assertApiUrl();
    const { data } = await api.post<Subscription>("/stripe/subscription", dto, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  },

  // Create Checkout Session
  createCheckoutSession: async (
    dto: CreateCheckoutSessionDto,
  ): Promise<{ url: string }> => {
    assertApiUrl();
    const { data } = await api.post<{ url: string }>(
      "/stripe/checkout-session",
      dto,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return data;
  },

  // Get User Subscription
  getSubscription: async (): Promise<Subscription> => {
    assertApiUrl();
    const { data } = await api.get<Subscription>("/stripe/subscription");
    return data;
  },

  // Update Subscription
  updateSubscription: async (
    dto: UpdateSubscriptionDto,
  ): Promise<Subscription> => {
    assertApiUrl();
    const { data } = await api.put<Subscription>("/stripe/subscription", dto, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  },

  // Cancel Subscription
  cancelSubscription: async (
    cancelAtPeriodEnd: boolean = true,
  ): Promise<Subscription> => {
    assertApiUrl();
    const { data } = await api.delete<Subscription>("/stripe/subscription", {
      data: { cancelAtPeriodEnd },
      headers: { "Content-Type": "application/json" },
    });
    return data;
  },

  // Reactivate Subscription
  reactivateSubscription: async (): Promise<Subscription> => {
    assertApiUrl();
    const { data } = await api.post<Subscription>(
      "/stripe/subscription/reactivate",
      {},
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return data;
  },

  // Create Billing Portal Session
  createBillingPortal: async (returnUrl: string): Promise<{ url: string }> => {
    assertApiUrl();
    const { data } = await api.post<{ url: string }>(
      "/stripe/billing-portal",
      { returnUrl },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return data;
  },

  // Get Payment History
  getPaymentHistory: async (): Promise<PaymentHistory[]> => {
    assertApiUrl();
    const { data } = await api.get<PaymentHistory[]>("/stripe/payment-history");
    return data;
  },
};
