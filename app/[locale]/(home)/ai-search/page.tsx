"use client";

import { JobListingAiSearchForm } from "@/components/job-listings/JobListingAiSearchForm";
import { LoadingSwap } from "@/components/LoadingSwap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProfile } from "@/hooks/use-profile";

export default function AiSearchPage() {
  const { user: currentUser } = useProfile();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="p-8 flex items-center justify-center min-h-screen text-black dark:text-white">
      <Card className="max-w-4xl">
        <LoadingSwap isLoading={false}>
          <AiCard />
        </LoadingSwap>
      </Card>
    </div>
  );
}

function AiCard() {
  return (
    <>
      <CardHeader>
        <CardTitle>AI Search</CardTitle>
        <CardDescription>
          This can take a few minutes to process, so please be patient.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <JobListingAiSearchForm />
      </CardContent>
    </>
  );
}
