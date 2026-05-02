"use client";

import type { Application } from "@/types/application.types";
import type { Resume, User } from "@/types/user.types";
import { ColumnDef, Table } from "@tanstack/react-table";
import { ReactNode, useOptimistic, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DataTable } from "../data-table/DataTable";
import { DataTableSortableColumnHeader } from "../data-table/DataTableSortableColumnHeader";
import { sortApplicationsByStage } from "@/lib/sortings";
import { ApplicationStage, applicationStages } from "@/schemas";
import { StageIcon } from "./_StageIcon";
import { formatJobListingApplicationStage } from "@/lib/formatter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, MoreHorizontalIcon } from "lucide-react";
import { useJobListings } from "@/hooks/use-job-listings";
import { RatingIcons } from "../RatingIcons";
import { RATING_OPTIONS } from "@/constants/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import Link from "next/link";
import { useIsMutating, useQueryClient } from "@tanstack/react-query";
import { MarkdownRenderer } from "../markdown/MarkdownRenderer";
import { DataTableFacetedFilter } from "../data-table/DataTableFacetedFilter";

export type ApplicationCol = Pick<
  Application,
  "coverLetter" | "createdAt" | "stage" | "rating" | "jobListingId"
> & {
  coverLetterMarkdown: ReactNode | null;
  user: Pick<User, "id" | "username" | "imageUrl">;
  resume: Pick<Resume, "resumeFileUrl" | "aiSummary"> | null;
};

function getColumns({
  isOwnerAndApplicantManager,
}: {
  isOwnerAndApplicantManager: boolean;
}): ColumnDef<ApplicationCol>[] {
  return [
    {
      accessorFn: (row) => row.user.username,
      header: "Name",
      cell: ({ row }) => {
        const user = row.original.user;
        const nameInitials = user.username
          .split(" ")
          .slice(0, 2)
          .map((name) => name.charAt(0).toUpperCase())
          .join("");

        return (
          <div className="flex items-center gap-2">
            <Avatar className="rounded-full size-6">
              <AvatarImage
                src={user.imageUrl ?? undefined}
                alt={user.username}
              />
              <AvatarFallback className="uppercase bg-primary text-primary-foreground text-xs">
                {nameInitials}
              </AvatarFallback>
            </Avatar>
            <span>{user.username}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "stage",
      header: ({ column }) => (
        <DataTableSortableColumnHeader title="Stage" column={column} />
      ),
      sortingFn: ({ original: a }, { original: b }) => {
        return sortApplicationsByStage(a.stage, b.stage);
      },
      filterFn: ({ original }, _, value) => {
        return value.includes(original.stage);
      },
      cell: ({ row }) => (
        <StageCell
          isOwnerAndApplicantManager={isOwnerAndApplicantManager}
          stage={row.original.stage}
          jobId={row.original.jobListingId}
          userId={row.original.user.id}
        />
      ),
    },
    {
      accessorKey: "rating",
      header: ({ column }) => (
        <DataTableSortableColumnHeader title="Rating" column={column} />
      ),
      filterFn: ({ original }, _, value) => {
        return value.includes(original.rating);
      },
      cell: ({ row }) => (
        <RatingCell
          isOwnerAndApplicantManager={isOwnerAndApplicantManager}
          rating={row.original.rating}
          jobId={row.original.jobListingId}
          userId={row.original.user.id}
        />
      ),
    },
    {
      accessorKey: "createdAt",
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <DataTableSortableColumnHeader title="Applied On" column={column} />
      ),
      cell: ({ row }) => row.original.createdAt,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const jobListing = row.original;
        const resume = jobListing.resume;

        return (
          <ActionCell
            coverLetterMarkdown={jobListing?.coverLetterMarkdown}
            resumeMarkdown={resume?.aiSummary}
            resumeFileUrl={resume?.resumeFileUrl}
            userName={jobListing?.user.username}
          />
        );
      },
    },
  ];
}

export function SkeletonApplicationTable() {
  return (
    <ApplicationTable
      applications={[]}
      isOwnerAndApplicantManager={false}
      disabledToolbar={true}
      noResultsMessage="Loading applications..."
    />
  );
}

function ToolbarWrapper<T>({ table }: { table: Table<T> }) {
  return <Toolbar table={table} disabled={false} />;
}

export function ApplicationTable({
  applications,
  disabledToolbar = false,
  noResultsMessage = "No applications found.",
  isOwnerAndApplicantManager,
}: {
  applications: ApplicationCol[];
  disabledToolbar?: boolean;
  noResultsMessage?: ReactNode;
  isOwnerAndApplicantManager: boolean;
}) {
  if (applications.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No applications found.
      </div>
    );
  }

  return (
    <DataTable
      data={applications}
      columns={getColumns({ isOwnerAndApplicantManager })}
      noResultsMessage={noResultsMessage}
      ToolbarComponent={disabledToolbar ? DisabledToolbar : ToolbarWrapper}
    />
  );
}

function Toolbar<T>({
  table,
  disabled,
}: {
  table: Table<T>;
  disabled: boolean;
}) {
  const hiddenRows = table.getCoreRowModel().rows.length - table.getRowCount();

  return (
    <div className="flex items-center gap-2">
      {table.getColumn("stage") && (
        <DataTableFacetedFilter
          column={table.getColumn("stage")}
          title="Stage"
          disabled={disabled}
          options={applicationStages
            .toSorted(sortApplicationsByStage)
            .map((stage) => ({
              label: <StageDetails stage={stage} />,
              value: stage,
              key: stage,
            }))}
        />
      )}
      {table.getColumn("rating") && (
        <DataTableFacetedFilter
          column={table.getColumn("rating")}
          title="Rating"
          disabled={disabled}
          options={RATING_OPTIONS.map((rating, i) => ({
            label: <RatingIcons rating={rating} />,
            value: rating,
            key: rating ?? `none-${i}`,
          }))}
        />
      )}
      {hiddenRows > 0 && (
        <span className="text-sm text-muted-foreground ml-2">
          {hiddenRows} {hiddenRows > 1 ? "rows" : "row"} not shown.
        </span>
      )}
    </div>
  );
}

function DisabledToolbar<T>({ table }: { table: Table<T> }) {
  return <Toolbar table={table} disabled={true} />;
}

function StageCell({
  isOwnerAndApplicantManager,
  stage,
  jobId,
  userId,
}: {
  stage: ApplicationStage;
  jobId: string;
  userId: string;
  isOwnerAndApplicantManager: boolean;
}) {
  const { updateJobListingApplicationStage } = useJobListings();
  const queryClient = useQueryClient();
  const isMutating = useIsMutating({ mutationKey: ["stage", jobId, userId] });
  const optimisticStage = stage;

  if (!isOwnerAndApplicantManager) {
    return <StageDetails stage={optimisticStage} />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn("-ml-3", isMutating > 0 && "opacity-50")}
        >
          <StageDetails stage={stage} />
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {applicationStages
          .toSorted(sortApplicationsByStage)
          .map((stageValue) => (
            <DropdownMenuItem
              key={stageValue}
              onClick={() =>
                updateJobListingApplicationStage({ jobId, userId, stageValue })
              }
            >
              <StageDetails stage={stageValue} />
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function StageDetails({ stage }: { stage: ApplicationStage }) {
  return (
    <div className="flex gap-2 items-center">
      <StageIcon stage={stage} className="size-5 text-inherit" />
      <div>{formatJobListingApplicationStage(stage)}</div>
    </div>
  );
}

function ActionCell({
  resumeFileUrl,
  userName,
  resumeMarkdown,
  coverLetterMarkdown,
}: {
  resumeFileUrl: string | null | undefined;
  userName: string;
  resumeMarkdown: string | null | undefined;
  coverLetterMarkdown: ReactNode | string | null | undefined;
}) {
  const [openModal, setOpenModal] = useState<"resume" | "coverLetter" | null>(
    null,
  );
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <span className="sr-only">Open Menu</span>
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {resumeFileUrl != null || resumeMarkdown != null ? (
            <DropdownMenuItem onClick={() => setOpenModal("resume")}>
              View Resume
            </DropdownMenuItem>
          ) : (
            <DropdownMenuLabel className="text-muted-foreground">
              No Resume
            </DropdownMenuLabel>
          )}
          {coverLetterMarkdown != null ? (
            <DropdownMenuItem onClick={() => setOpenModal("coverLetter")}>
              View Cover Letter
            </DropdownMenuItem>
          ) : (
            <DropdownMenuLabel className="text-muted-foreground">
              No Cover Letter
            </DropdownMenuLabel>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {coverLetterMarkdown && (
        <Dialog
          open={openModal === "coverLetter"}
          onOpenChange={(o) => setOpenModal(o ? "coverLetter" : null)}
        >
          <DialogContent className="lg:max-w-5xl md:max-w-3xl max-h-[calc(100%-2rem)] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Cover Letter</DialogTitle>
              <DialogDescription>{userName}</DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto">{coverLetterMarkdown}</div>
          </DialogContent>
        </Dialog>
      )}
      {resumeMarkdown && (
        <Dialog
          open={openModal === "resume"}
          onOpenChange={(o) => setOpenModal(o ? "resume" : null)}
        >
          <DialogContent className="lg:max-w-5xl md:max-w-3xl max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Resume</DialogTitle>
              <DialogDescription>{userName}</DialogDescription>
              {resumeFileUrl && (
                <Button asChild className="self-start">
                  <Link
                    href={resumeFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resume
                  </Link>
                </Button>
              )}
              <DialogDescription className="mt-2">
                This is a generated summary of the resume.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto">
              <MarkdownRenderer source={resumeMarkdown} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function RatingCell({
  isOwnerAndApplicantManager,
  rating,
  jobId,
  userId,
}: {
  rating: number | null;
  jobId: string;
  userId: string;
  isOwnerAndApplicantManager: boolean;
}) {
  const [optimisticRating, setOptimisticRating] = useOptimistic<number | null>(
    rating,
  );
  const [isPending, startTransition] = useTransition();
  const { updateJobListingApplicationRating } = useJobListings();

  if (!isOwnerAndApplicantManager) {
    return <RatingIcons rating={optimisticRating} />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn("-ml-3", isPending && "opacity-50")}
        >
          <RatingIcons rating={optimisticRating} />
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {RATING_OPTIONS.map((ratingValue) => (
          <DropdownMenuItem
            key={ratingValue ?? "none"}
            onClick={() => {
              startTransition(async () => {
                setOptimisticRating(ratingValue);
                await updateJobListingApplicationRating({
                  jobId,
                  userId,
                  rating: ratingValue,
                });
              });
            }}
          >
            <RatingIcons rating={ratingValue} className="text-inherit" />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
