"use client";

import JobListingBadges from "@/components/job-listings/JobListingBadges";
import MarkdownPartial from "@/components/markdown/MarkdownPartial";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useJobListings } from "@/hooks/use-job-listings";
import { useOrgs } from "@/hooks/use-orgs";
import { formatJobListingStatus } from "@/lib/formatter";
import type { JobListing } from "@/types";
import {
  EditIcon,
  ToggleRightIcon,
  ToggleLeftIcon,
  StarIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer";
import { useProfile } from "@/hooks/use-profile";
import { SubscriptionPlans } from "@/constants/subscription-plans";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CustomDialog from "@/components/CustomDialog";

export default function JobIdPage() {
  const {
    fetchJobListingByJobId,
    toggleJobListingStatus,
    toggleJobListingFeatured,
    publishedJobListings,
    featuredJobListings,
  } = useJobListings();
  const { selectedOrgId } = useOrgs();
  const { user: currentUser } = useProfile();
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

  const isOwner = currentJob.organizationId === selectedOrgId;

  // Get current plan limits
  const currentPlanName = currentUser?.subscription?.planName;
  const currentPlan = currentPlanName
    ? SubscriptionPlans[currentPlanName as keyof typeof SubscriptionPlans]
    : null;

  // Check if user can publish/feature more jobs
  const publishedJobsCount = publishedJobListings.length;
  const canPublishMore = currentPlan
    ? publishedJobsCount < currentPlan.limits.jobPostings
    : false;
  const canFeatureMore = currentPlan
    ? featuredJobListings.length < currentPlan.limits.featuredListings
    : false;

  // If trying to publish and at limit, block the action
  const canToggleToPublished =
    currentJob.status === "draft" ? canPublishMore : true; // Always allow unpublishing

  const onToggleStatus = () => {
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

  // Check if user can feature more jobs
  const canToggleToFeatured = !currentJob.isFeatured ? canFeatureMore : true; // Always allow un-featuring

  const onToggleFeatured = () => {
    try {
      const newFeaturedStatus = !currentJob.isFeatured;

      // Update UI immediately (optimistic)
      setCurrentJob({ ...currentJob, isFeatured: newFeaturedStatus });

      toggleJobListingFeatured({
        id: jobId,
        isFeatured: newFeaturedStatus,
      });
    } catch (error) {
      console.error("Failed to toggle job listing featured status:", error);
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
        {isOwner && (
          <div className="flex items-center gap-2 empty:-mt-4">
            <Button asChild variant={"outline"}>
              <Link
                href={`/employer/orgs/${selectedOrgId}/all-jobs/${currentJob.id}/edit`}
              >
                <EditIcon className="size-4" />
                Edit
              </Link>
            </Button>
            <FeaturedToggleButton
              currentJob={currentJob}
              canFeature={canToggleToFeatured}
              featuredCount={featuredJobListings.length}
              maxFeatured={currentPlan?.limits.featuredListings}
              onToggle={onToggleFeatured}
            />
            <StatusUpdateButton
              currentJob={currentJob}
              onToggle={onToggleStatus}
              canPublish={canToggleToPublished}
              publishedCount={publishedJobsCount}
              maxJobs={currentPlan?.limits.jobPostings}
            />
          </div>
        )}
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
  canPublish,
  publishedCount,
  maxJobs,
}: {
  currentJob: JobListing;
  onToggle: () => void;
  canPublish: boolean;
  publishedCount?: number;
  maxJobs?: number;
}) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const isPublishing = currentJob.status === "draft";
  const disabled = isPublishing && !canPublish;

  const handleButtonClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    setShowConfirmDialog(false);
    onToggle();
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
  };

  // Show popover when at limit
  if (disabled && typeof maxJobs === "number") {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="default" disabled={false} className="w-30">
            <ToggleRightIcon className="size-4" />
            Publish
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2">
          <p className="text-sm">
            You must upgrade your subscription plan to publish more job
            listings.
          </p>
          <p className="text-xs text-muted-foreground">
            Limit: {publishedCount}/{maxJobs}
          </p>
          <Button asChild>
            <Link href="/pricing">Upgrade Plan</Link>
          </Button>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <>
      <div className="flex flex-col items-end gap-1">
        <Button
          variant={
            currentJob.status === "published" ? "destructive" : "default"
          }
          onClick={handleButtonClick}
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
      </div>

      <CustomDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title={isPublishing ? "Publish Job Listing?" : "Unpublish Job Listing?"}
        description={
          isPublishing
            ? "Are you sure? This will immediately show this job listing to all users."
            : "Are you sure you want to unpublish this job listing? It will be hidden from all users."
        }
        cancelButtonText="Cancel"
        buttonText="Confirm"
        onCancel={handleCancel}
        href={undefined}
        onConfirm={handleConfirm}
      />
    </>
  );
}

function FeaturedToggleButton({
  currentJob,
  onToggle,
  canFeature,
  featuredCount,
  maxFeatured,
}: {
  currentJob: JobListing;
  onToggle: () => void;
  canFeature: boolean;
  featuredCount?: number;
  maxFeatured?: number;
}) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const isFeaturing = !currentJob.isFeatured;
  const disabled = isFeaturing && !canFeature;

  const handleButtonClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    setShowConfirmDialog(false);
    onToggle();
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
  };

  // Show popover when at limit
  if (disabled && typeof maxFeatured === "number") {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" disabled={false} className="w-30">
            <StarIcon className="size-4" />
            Feature
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2">
          <p className="text-sm">
            You must upgrade your subscription plan to feature more job
            listings.
          </p>
          <p className="text-xs text-muted-foreground">
            Limit: {featuredCount}/{maxFeatured}
          </p>
          <Button asChild>
            <Link href="/pricing">Upgrade Plan</Link>
          </Button>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <>
      <div className="flex flex-col items-end gap-1">
        <Button
          variant={currentJob.isFeatured ? "secondary" : "outline"}
          onClick={handleButtonClick}
          className="w-30"
        >
          {currentJob.isFeatured ? (
            <>
              <StarIcon className="size-4 fill-current" />
              Featured
            </>
          ) : (
            <>
              <StarIcon className="size-4" />
              Feature
            </>
          )}
        </Button>
      </div>

      <CustomDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title={
          currentJob.isFeatured
            ? "Remove Featured Status?"
            : "Feature Job Listing?"
        }
        description={
          currentJob.isFeatured
            ? "Are you sure you want to remove the featured status from this job listing?"
            : "Are you sure you want to feature this job listing? It will be highlighted to users."
        }
        cancelButtonText="Cancel"
        buttonText="Confirm"
        onCancel={handleCancel}
        href={undefined}
        onConfirm={handleConfirm}
      />
    </>
  );
}

function statusToggleButtonText(status: string) {
  return status === "published" ? "Unpublish" : "Publish";
}
