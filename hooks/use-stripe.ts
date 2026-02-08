import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { extractErrorMessage } from "@/lib/utils";
import type {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  CreateCheckoutSessionDto,
  Subscription,
  PaymentHistory,
} from "@/types/stripe";
import { stripeApi } from "@/lib/apis/stripe-api";

export function useStripe() {
  const successT = useTranslations("apiSuccesses");
  const errorT = useTranslations("apiErrors");
  const queryClient = useQueryClient();
  const router = useRouter();

  // Get subscription query
  const {
    data: subscription,
    isLoading: isLoadingSubscription,
    error: subscriptionError,
  } = useQuery<Subscription, AxiosError>({
    queryKey: ["subscription"],
    queryFn: () => stripeApi.getSubscription(),
  });

  // Get payment history query
  const { data: paymentHistory, isLoading: isLoadingPaymentHistory } = useQuery<
    PaymentHistory[],
    AxiosError
  >({
    queryKey: ["payment-history"],
    queryFn: () => stripeApi.getPaymentHistory(),
  });

  // Create subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: (dto: CreateSubscriptionDto) =>
      stripeApi.createSubscription(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      toast.success(successT("subscriptionCreated"));
    },
    onError: (error: AxiosError) => {
      toast.error(extractErrorMessage(error, errorT));
    },
  });

  // Create checkout session mutation
  const createCheckoutSessionMutation = useMutation({
    mutationFn: (dto: CreateCheckoutSessionDto) =>
      stripeApi.createCheckoutSession(dto),
    onSuccess: (data) => {
      // Redirect to Stripe checkout
      window.location.href = data.url;
    },
    onError: (error: AxiosError) => {
      toast.error(extractErrorMessage(error, errorT));
    },
  });

  // Update subscription mutation
  const updateSubscriptionMutation = useMutation({
    mutationFn: (dto: UpdateSubscriptionDto) =>
      stripeApi.updateSubscription(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      toast.success(successT("subscriptionUpdated"));
    },
    onError: (error: AxiosError) => {
      toast.error(extractErrorMessage(error, errorT));
    },
  });

  // Cancel subscription mutation
  const cancelSubscriptionMutation = useMutation({
    mutationKey: ["cancel-subscription"],
    mutationFn: ({
      cancelAtPeriodEnd = true,
    }: {
      cancelAtPeriodEnd?: boolean;
    }) => stripeApi.cancelSubscription(cancelAtPeriodEnd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      toast.success(successT("subscriptionCancelled"));
    },
    onError: (error: AxiosError) => {
      toast.error(extractErrorMessage(error, errorT));
    },
  });

  // Reactivate subscription mutation
  const reactivateSubscriptionMutation = useMutation({
    mutationKey: ["reactivate-subscription"],
    mutationFn: () => stripeApi.reactivateSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      toast.success(successT("subscriptionReactivated"));
    },
    onError: (error: AxiosError) => {
      toast.error(extractErrorMessage(error, errorT));
    },
  });

  // Create billing portal session mutation
  const createBillingPortalMutation = useMutation<
    { url: string },
    AxiosError,
    { returnUrl: string }
  >({
    mutationFn: ({ returnUrl }) => stripeApi.createBillingPortal(returnUrl),
    onSuccess: (data) => {
      // Redirect to Stripe billing portal
      window.location.href = data.url;
    },
    onError: (error: AxiosError) => {
      toast.error(extractErrorMessage(error, errorT));
    },
  });

  // Helper to open billing portal
  const openBillingPortal = useCallback(
    (returnUrl?: string) => {
      const url = returnUrl || window.location.href;
      createBillingPortalMutation.mutate({ returnUrl: url });
    },
    [createBillingPortalMutation],
  );

  return {
    // Subscription state
    subscription,
    isLoadingSubscription,
    subscriptionError,
    hasActiveSubscription: subscription?.status === "active",

    // Payment history
    paymentHistory,
    isLoadingPaymentHistory,

    // Create subscription
    createSubscription: createSubscriptionMutation.mutate,
    isCreatingSubscription: createSubscriptionMutation.isPending,

    // Create checkout session
    createCheckoutSession: createCheckoutSessionMutation.mutate,
    isCreatingCheckout: createCheckoutSessionMutation.isPending,

    // Update subscription
    updateSubscription: updateSubscriptionMutation.mutate,
    isUpdatingSubscription: updateSubscriptionMutation.isPending,

    // Cancel subscription
    cancelSubscription: cancelSubscriptionMutation.mutate,
    isCancellingSubscription: cancelSubscriptionMutation.isPending,

    // Reactivate subscription
    reactivateSubscription: reactivateSubscriptionMutation.mutate,
    isReactivatingSubscription: reactivateSubscriptionMutation.isPending,

    // Billing portal
    openBillingPortal,
    isOpeningBillingPortal: createBillingPortalMutation.isPending,
  };
}
