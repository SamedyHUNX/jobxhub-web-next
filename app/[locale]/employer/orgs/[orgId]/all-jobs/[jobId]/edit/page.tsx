"use client";

import { useEffect, useState } from "react";
import JobListingForm from "@/components/job-listings/JobListingForm";
import { Card, CardContent } from "@/components/ui/card";
import { useJobListings } from "@/hooks/use-job-listings";
import type { JobListing } from "@/types";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { translations } from "@/lib/translations";
import { useOrgs } from "@/hooks/use-orgs";

export default function EditJobIdPage() {
  const [currentJob, setCurrentJob] = useState<JobListing | null>(null);
  const { selectedOrganization } = useOrgs();
  const { fetchJobListingByJobId, saveJobListing, jobListingLoading } =
    useJobListings();
  const jobId = useParams().jobId as string;
  const pageT = useTranslations("jobListings");
  const formT = useTranslations("jobListings.form");
  const optionsT = useTranslations("jobListings.form.options");

  const formTranslations = translations(formT, optionsT);

  useEffect(() => {
    if (jobId) {
      fetchJobListingByJobId(jobId).then((job) => {
        setCurrentJob(job);
      });
    }
  }, [jobId, fetchJobListingByJobId]);

  if (!currentJob) {
    return null;
  }

  return (
    <div className="w-[95%] mx-auto px-4 pt-8 h-fit flex flex-col">
      <h1 className="text-4xl font-bold mb-2 shrink-0 tracking-tighter">
        {pageT("title")}
      </h1>
      <p className="text-muted-foreground mb-6 shrink-0 tracking-tighter">
        {pageT("description")}
      </p>
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 min-h-0 p-6">
          <JobListingForm
            jobListing={currentJob}
            onSubmit={(data) => saveJobListing(undefined, data)}
            translations={formTranslations}
            orgId={selectedOrganization}
            isLoading={jobListingLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
