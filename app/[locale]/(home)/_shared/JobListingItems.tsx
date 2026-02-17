"use client";

import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useJobListings } from "@/hooks/use-job-listings";
import { cn } from "@/lib/utils";
import type { JobListing, Organization } from "@/types";
import { Avatar } from "@radix-ui/react-avatar";
import Link from "next/link";
import { Suspense } from "react";
import { differenceInDays } from "date-fns";
import JobListingBadges from "@/components/job-listings/JobListingBadges";
import { searchParamsSchema } from "@/schemas";
import { useParams, useSearchParams } from "next/navigation";

export function JobListingItems() {
  const rawParams = useSearchParams();
  const { jobId } = useParams<{ jobId: string }>();

  const parsed = searchParamsSchema.parse({
    search: rawParams.get("search") ?? undefined,
    title: rawParams.get("title") ?? undefined,
    city: rawParams.get("city") ?? undefined,
    state: rawParams.get("state") ?? undefined,
    experienceLevel: rawParams.get("experienceLevel") ?? undefined,
    locationRequirement: rawParams.get("locationRequirement") ?? undefined,
    type: rawParams.get("type") ?? undefined,
    jobIds: rawParams.getAll("jobIds"),
  });

  const { jobListings } = useJobListings({
    search: parsed.search,
    title: parsed.title,
    type: parsed.type,
    locationRequirement: parsed.locationRequirement,
    experience: parsed.experience,
    city: parsed.city,
    state: parsed.state,
    jobIds: [...(parsed.jobIds ?? []), ...(jobId ? [jobId] : [])],
  });

  if (jobListings.length === 0) {
    return (
      <div className="text-muted-foreground p-4">No job listings found</div>
    );
  }

  return (
    <div className="m-4">
      <div className="space-y-4">
        {(jobListings as JobListing[]).map((jobListing) => (
          <Link
            className="block"
            key={jobListing.id}
            href={`/job-listings/${jobListing.id}`}
          >
            <JobListingListItem
              jobListing={jobListing}
              organization={jobListing.organization}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

function JobListingListItem({
  jobListing,
  organization,
}: {
  jobListing: JobListing;
  organization: Organization;
}) {
  const nameInitials = organization?.orgName
    .split(" ")
    .splice(0, 4)
    .map((word) => word[0])
    .join("");

  return (
    <Card
      className={cn(
        "@container",
        jobListing.isFeatured && "border-featured bg-featured/20",
      )}
    >
      <CardHeader>
        <div className="flex gap-4 w-full">
          <Avatar className="size-14 @max-sm:hidden">
            <AvatarImage
              src={organization.imageUrl ?? undefined}
              alt={organization.orgName}
            />
            <AvatarFallback className="uppercase bg-primary text-primary-foreground">
              {nameInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl">{jobListing.title}</CardTitle>
            <CardDescription className="text-base">
              {organization.orgName}
            </CardDescription>
            {jobListing.postedAt != null && (
              <div className="text-sm font-medium text-primary ml-auto @max-md:hidden">
                <Suspense fallback={jobListing.postedAt}>
                  <DaysSincePosting postedAt={jobListing.postedAt} />
                </Suspense>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <JobListingBadges
          jobListing={jobListing}
          className={jobListing.isFeatured ? "border-primary/35" : undefined}
        />
      </CardContent>
    </Card>
  );
}

function DaysSincePosting({ postedAt }: { postedAt: string }) {
  const daysSincePosted = differenceInDays(new Date(postedAt), new Date());

  if (daysSincePosted === 0) {
    return <>New</>;
  }

  return (
    <>
      {new Intl.RelativeTimeFormat(undefined, {
        style: "narrow",
        numeric: "always",
      }).format(-daysSincePosted, "day")}
    </>
  );
}
