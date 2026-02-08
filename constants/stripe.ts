export const STRIPE_WEBHOOK_EVENTS = {
  SUBSCRIPTION_CREATED: "customer.subscription.created",
  SUBSCRIPTION_UPDATED: "customer.subscription.updated",
  SUBSCRIPTION_DELETED: "customer.subscription.deleted",
  SUBSCRIPTION_TRIAL_WILL_END: "customer.subscription.trial_will_end",
  INVOICE_PAYMENT_SUCCEEDED: "invoice.payment_succeeded",
  INVOICE_PAYMENT_FAILED: "invoice.payment_failed",
  CHECKOUT_SESSION_COMPLETED: "checkout.session.completed",
  PAYMENT_INTENT_SUCCEEDED: "payment_intent.succeeded",
} as const;

export const SUBSCRIPTION_STATUS = {
  ACTIVE: "active",
  CANCELED: "canceled",
  INCOMPLETE: "incomplete",
  PAST_DUE: "past_due",
  TRIALING: "trialing",
  UNPAID: "unpaid",
} as const;

export const PAYMENT_STATUS = {
  SUCCEEDED: "succeeded",
  PENDING: "pending",
  FAILED: "failed",
  CANCELED: "canceled",
} as const;

export const BILLING_INTERVAL = {
  MONTH: "month",
  YEAR: "year",
} as const;
