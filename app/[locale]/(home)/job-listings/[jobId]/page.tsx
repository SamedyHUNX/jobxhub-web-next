"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { JobListingItems } from "../../_shared/JobListingItems";
import PageLoader from "@/components/PageLoader";
import { Suspense } from "react";
import IsBreakpoint from "@/components/IsBreakpoint";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ClientSheet } from "./_ClientSheet";

export default function JobListingById({
  params,
  searchParams,
}: {
  params: Promise<{ jobId: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  return (
    <PanelGroup direction="horizontal" autoSaveId="jobxhub-panel">
      <Panel id="left" order={1} defaultSize={60} minSize={30}>
        <div className="h-screen overflow-y-auto">
          <Suspense fallback={<PageLoader />}>
            <JobListingItems />
          </Suspense>
        </div>
      </Panel>

      <PanelResizeHandle className="w-1 bg-border hover:bg-accent" />

      <IsBreakpoint
        breakpoint="min-width: 1024px"
        otherwise={
          <ClientSheet>
            <SheetContent showCloseButton={false} className="py-2">
              <SheetHeader className="sr-only">
                <SheetTitle>Job Listing Details</SheetTitle>
              </SheetHeader>
              <Suspense fallback={<PageLoader />}>
                <JobListingItems />
              </Suspense>
            </SheetContent>
          </ClientSheet>
        }
      >
        <PanelResizeHandle className="mx-2" />
        <Panel
          id="right"
          order={2}
          defaultSize={40}
          minSize={30}
          className="mx-2"
        >
          <div className="p-4 h-screen overflow-y-auto">
            <Suspense fallback={<PageLoader />}>
              <JobListingDetails params={params} searchParams={searchParams} />
            </Suspense>
          </div>
        </Panel>
      </IsBreakpoint>
    </PanelGroup>
  );
}

function JobListingDetails({
  params,
  searchParams,
}: {
  params: Promise<{ jobId: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  return null;
}
