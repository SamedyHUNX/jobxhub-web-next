"use client";

import { useEffect, useState } from "react";
import JobListingForm from "@/components/job-listings/JobListingForm";
import { Card, CardContent } from "@/components/ui/card";
import { useJobListings } from "@/hooks/use-job-listings";
import type { JobListing } from "@/types";
import { useParams } from "next/navigation";

export default function EditJobIdPage() {
  const [currentJob, setCurrentJob] = useState<JobListing | null>(null);
  const { fetchJobListingByJobId, saveJobListing } = useJobListings();
  const jobId = useParams().jobId as string;

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
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Edit Job Listing</h1>
      <Card>
        <CardContent>
          <JobListingForm
            jobListing={currentJob}
            onSubmit={(data) => saveJobListing(jobId, data)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
