"use client";

import JobListingBadges from "@/components/job-listings/JobListingBadges";
import MarkdownPartial from "@/components/markdown/MarkdownPartial";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useJobListings } from "@/hooks/use-job-listings";
import { useOrgs } from "@/hooks/use-orgs";
import { formatJobListingStatus } from "@/lib/formatter";
import type { JobListing } from "@/types";
import { EditIcon, ToggleRightIcon, ToggleLeftIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer";

export default function JobIdPage() {
  const {
    fetchJobListingByJobId,
    toggleJobListingStatus,
    toggleJobListingStatusLoading,
  } = useJobListings();
  const { selectedOrgId } = useOrgs();
  const jobId = useParams().jobId as string;
  const [currentJob, setCurrentJob] = useState<JobListing | null>(null);

  useEffect(() => {
    if (jobId) {
      fetchJobListingByJobId(jobId).then((job) => {
        setCurrentJob(job);
      });
    }
  }, [jobId]);

  if (!currentJob) {
    return null;
  }

  const onToggle = () => {
    try {
      const newStatus =
        currentJob.status === "published" ? "draft" : "published";

      // Update UI immediately (optimistic)
      setCurrentJob({ ...currentJob, status: newStatus });

      toggleJobListingStatus({
        id: jobId,
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to toggle job listing status:", error);
      fetchJobListingByJobId(jobId).then(setCurrentJob);
    }
  };

  return (
    <div className="space-y-6 w-full max-auto p-8 @container">
      <div className="flex items-center justify-between gap-4 @max-4xl:flex-col @max-4xl:items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {currentJob?.title || "Job Title"}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge>{formatJobListingStatus(currentJob?.status)}</Badge>
            <JobListingBadges jobListing={currentJob} />
          </div>
        </div>
        <div className="flex items-center gap-2 empty:-mt-4">
          <Button asChild variant={"outline"}>
            <Link
              href={`/employer/orgs/${selectedOrgId}/all-jobs/${currentJob.id}/edit`}
            >
              <EditIcon className="size-4" />
              Edit
            </Link>
          </Button>
          <StatusUpdateButton currentJob={currentJob} onToggle={onToggle} />
        </div>
      </div>

      {/* <MarkdownPartial
        dialogMarkdown={<MarkdownRenderer source={currentJob.description} />}
        mainMarkdown={
          <MarkdownRenderer
            className="prose-sm"
            source={currentJob.description}
          />
        }
        dialogTitle="Description"
      /> */}
      <div className="prose max-w-none prose-sm">
        <MarkdownRenderer source={currentJob.description} />
      </div>
    </div>
  );
}

function StatusUpdateButton({
  currentJob,
  onToggle,
}: {
  currentJob: JobListing;
  onToggle: () => void;
}) {
  return (
    <Button
      variant={currentJob.status === "published" ? "destructive" : "default"}
      onClick={onToggle}
      disabled={false}
      className="w-30"
    >
      {currentJob.status === "published" ? (
        <>
          <ToggleLeftIcon className="size-4" />
          Unpublish
        </>
      ) : (
        <>
          <ToggleRightIcon className="size-4" />
          Publish
        </>
      )}
    </Button>
  );
}
