"use client";

import PageLoader from "@/components/PageLoader";
import { useStripe } from "@/hooks/use-stripe";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CreditCard, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    return <PageLoader />;
  }

  if (!subscription) {
    return (
      <div className="container mx-auto py-12 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">No Active Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/pricing">View Pricing Plans</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCancel = () => {
    cancelSubscription({ cancelAtPeriodEnd: true });
  };

  const handleReactivate = () => {
    reactivateSubscription();
  };

  return (
    <div className="container mx-auto w-full p-8">
      <h1 className="text-3xl font-bold mb-8">Manage Subscription</h1>

      {/* Current Subscription */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Current Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Status:</span>
              <Badge
                variant={
                  subscription.status === "active" ? "default" : "secondary"
                }
                className={
                  subscription.status === "active"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-orange-600 hover:bg-orange-700"
                }
              >
                {subscription.status.toUpperCase()}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">
                Current Period Ends:
              </span>{" "}
              <span className="font-semibold">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </span>
            </div>
          </div>

          {subscription.cancelAtPeriodEnd && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Subscription will cancel on{" "}
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </AlertDescription>
            </Alert>
          )}

          <Separator />

          <div className="flex gap-4">
            <Button onClick={() => openBillingPortal()} className="gap-2">
              <CreditCard className="h-4 w-4" />
              Manage Billing
            </Button>

            {subscription.cancelAtPeriodEnd ? (
              <Button
                onClick={handleReactivate}
                disabled={isReactivatingSubscription}
                variant="default"
                className="bg-green-600 hover:bg-green-700"
              >
                {isReactivatingSubscription ? "Processing..." : "Reactivate"}
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    disabled={isCancellingSubscription}
                  >
                    {isCancellingSubscription
                      ? "Processing..."
                      : "Cancel Subscription"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will cancel your subscription at the end of the
                      current billing period. You'll continue to have access
                      until{" "}
                      {new Date(
                        subscription.currentPeriodEnd,
                      ).toLocaleDateString()}
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancel}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Cancel Subscription
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentHistory && paymentHistory.length > 0 ? (
            <div className="space-y-0">
              {paymentHistory.map((payment, index) => (
                <div key={payment.id}>
                  <div className="flex justify-between items-center py-4">
                    <div>
                      <p className="font-medium">
                        ${(payment.amount / 100).toFixed(2)}{" "}
                        {payment.currency.toUpperCase()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        payment.status === "succeeded" ? "default" : "secondary"
                      }
                      className={
                        payment.status === "succeeded"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-orange-100 text-orange-800 hover:bg-orange-100"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </div>
                  {index < paymentHistory.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No payment history yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
