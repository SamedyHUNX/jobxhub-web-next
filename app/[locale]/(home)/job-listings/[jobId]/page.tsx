"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { JobListingItems } from "../../_shared/JobListingItems";
import PageLoader from "@/components/PageLoader";
import { Suspense, useEffect, useState } from "react";
import IsBreakpoint from "@/components/IsBreakpoint";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ClientSheet } from "./_ClientSheet";
import { useJobListings } from "@/hooks/use-job-listings";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { JobListing } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { XIcon } from "lucide-react";
import JobListingBadges from "@/components/job-listings/JobListingBadges";
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer";
import ApplyButton from "@/components/job-listings/_ApplyButton";

export default function JobListingById() {
  const params = useParams();
  const { fetchJobListingByJobId } = useJobListings();

  useEffect(() => {
    if (typeof params.jobId === "string") {
      fetchJobListingByJobId(params.jobId);
    }
  }, [params.jobId]);

  return (
    <PanelGroup direction="horizontal" autoSaveId="jobxhub-panel">
      <Panel id="left" order={1} defaultSize={60} minSize={30}>
        <div className="h-full overflow-y-auto">
          <Suspense fallback={<PageLoader />}>
            <JobListingItems />
          </Suspense>
        </div>
      </Panel>

      <PanelResizeHandle className="w-2 bg-border hover:bg-primary/40 transition-colors cursor-col-resize" />

      <Panel
        id="right"
        order={2}
        defaultSize={40}
        minSize={30}
        className="mx-2"
      >
        <IsBreakpoint
          breakpoint="min-width: 1024px"
          otherwise={
            <ClientSheet>
              <SheetContent showCloseButton={false} className="py-2">
                <SheetHeader className="sr-only">
                  <SheetTitle>Job Listing Details</SheetTitle>
                </SheetHeader>
                <Suspense fallback={<PageLoader />}>
                  <JobListingDetails />
                </Suspense>
              </SheetContent>
            </ClientSheet>
          }
        >
          <div className="p-4 h-screen overflow-y-auto">
            <Suspense fallback={<PageLoader />}>
              <JobListingDetails />
            </Suspense>
          </div>
        </IsBreakpoint>
      </Panel>
    </PanelGroup>
  );
}

function JobListingDetails() {
  const jobId = useParams().jobId as string;
  const { fetchJobListingByJobId } = useJobListings();
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

  const nameInitials = currentJob?.organization?.orgName
    .split(" ")
    .splice(0, 4)
    .map((word) => word[0])
    .join("");

  return (
    <div className="space-y-6 @container">
      <div className="space-y-4">
        <div className="flex gap-4 items-start">
          <Avatar className="size-14 @max-md:hidden">
            <AvatarImage
              src={currentJob?.organization?.imageUrl ?? undefined}
              alt={currentJob?.organization?.orgName}
            />
            <AvatarFallback className="uppercase bg-primary text-primary-foreground">
              {nameInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {currentJob?.title}
            </h1>
            <div className="text-base text-muted-foreground">
              {currentJob?.organization?.orgName}
            </div>
            {currentJob?.postedAt != null && (
              <div className="text-sm text-muted-foreground @min-lg:hidden">
                {new Date(currentJob.postedAt).toLocaleDateString()}
              </div>
            )}
          </div>
          <div className="ml-auto flex items-center gap-4">
            {currentJob?.postedAt != null && (
              <div className="text-sm text-muted-foreground @max-lg:hidden">
                {new Date(currentJob.postedAt).toLocaleDateString()}
              </div>
            )}

            <Button size="icon" variant="outline" asChild>
              <Link href={"/"}>
                <span className="sr-only">Close</span>
                <XIcon />
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <JobListingBadges jobListing={currentJob} />
        </div>
        <Suspense fallback={<Button disabled>Apply</Button>}>
          <ApplyButton jobListingId={currentJob.id} />
        </Suspense>
      </div>

      <MarkdownRenderer source={currentJob.description} />
    </div>
  );
}
