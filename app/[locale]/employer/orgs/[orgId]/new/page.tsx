"use client";

import JobListingForm from "@/components/job-listings/JobListingForm";
import { Card, CardContent } from "@/components/ui/card";
import { useJobListings } from "@/hooks/use-job-listings";
import { useOrgs } from "@/hooks/use-orgs";
import { translations } from "@/lib/translations";
import { useTranslations } from "next-intl";

export default function CreateJobPage() {
  // Translations
  const pageT = useTranslations("jobListings");
  const formT = useTranslations("jobListings.form");

  const formTranslations = translations(formT);

  const { selectedOrgId } = useOrgs();

  const { saveJobListing, jobListingLoading } = useJobListings();

  return (
    <div className="w-full p-8 mx-auto h-fit flex flex-col">
      <h1 className="text-4xl font-bold mb-2 shrink-0 tracking-tighter">
        {pageT("title")}
      </h1>
      <p className="text-muted-foreground mb-6 shrink-0 tracking-tighter">
        {pageT("description")}
      </p>
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 min-h-0 p-6">
          <JobListingForm
            onSubmit={(data) => saveJobListing(undefined, data)}
            translations={formTranslations}
            orgId={selectedOrgId}
            isLoading={jobListingLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
