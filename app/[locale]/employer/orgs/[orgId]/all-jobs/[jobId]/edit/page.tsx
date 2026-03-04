"use client";

import { JobListingForm } from "@/components/job-listings/JobListingForm";
import { Card, CardContent } from "@/components/ui/card";
import { useJobListings } from "@/hooks/use-job-listings";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { translations } from "@/lib/translations";
import { useOrgs } from "@/hooks/use-orgs";
import type { JobListing } from "@/types/job-listing.types";

export default function EditJobIdPage() {
  const { selectedOrgId } = useOrgs();
  const { saveJobListing, jobListingMutation, jobListings } = useJobListings();
  const jobId = useParams().jobId as string;
  const pageT = useTranslations("jobListings");
  const editFormT = useTranslations("jobListings.form");

  const currentJob = jobListings.find((job: JobListing) => job.id === jobId);

  const formTranslations = translations(editFormT);

  if (!currentJob) {
    return null;
  }

  return (
    <div className="w-[95%] mx-auto px-4 pt-8 h-fit flex flex-col">
      <h1 className="text-4xl font-bold mb-2 shrink-0 tracking-tighter">
        {pageT("editFormTitle")}
      </h1>
      <p className="text-muted-foreground mb-6 shrink-0 tracking-tighter">
        {pageT("description")}
      </p>
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 min-h-0 p-6">
          <JobListingForm
            jobListing={currentJob}
            onSubmit={(data) => saveJobListing(currentJob.id, data)}
            translations={formTranslations}
            orgId={selectedOrgId}
            isLoading={jobListingMutation.isPending}
            mode="edit"
          />
        </CardContent>
      </Card>
    </div>
  );
}
