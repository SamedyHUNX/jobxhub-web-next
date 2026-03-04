"use client";

import { Application } from "@/types/application.types";
import { Resume, User } from "@/types/user.types";
import { ColumnDef } from "@tanstack/react-table";
import { ReactNode, useOptimistic, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DataTable } from "../data-table/DataTable";
import { DataTableSortableColumnHeader } from "../data-table/DataTableSortableColumnHeader";
import { sortApplicationsByStage } from "@/lib/sortings";
import { ApplicationStage } from "@/schemas";
import { StageIcon } from "./_StageIcon";
import { formatJobListingApplicationStage } from "@/lib/formatter";

export type ApplicationCol = Pick<
  Application,
  "coverLetter" | "createdAt" | "stage" | "rating" | "jobListingId"
> & {
  coverLetterMarkdown: ReactNode | null;
  user: Pick<User, "id" | "username" | "imageUrl"> & {
    resume: Pick<Resume, "resumeFileUrl"> & {
      markdownSummary: ReactNode | null;
    };
  };
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
        return value.include(original.stage);
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
  ];
}

export function SkeletonApplicationTable() {
  return null;
}

export function ApplicationTable({
  applications,
  isOwnerAndApplicantManager,
}: {
  applications: ApplicationCol[];
  isOwnerAndApplicantManager: boolean;
}) {
  return (
    <DataTable
      data={applications}
      columns={getColumns({ isOwnerAndApplicantManager })}
    />
  );
}

function StageCell({
  isOwnerAndApplicantManager,
  stage,
  userId,
  jobId,
}: {
  stage: ApplicationStage;
  jobId: string;
  userId: string;
  isOwnerAndApplicantManager: boolean;
}) {
  const [optimisticStage, setOptimisticStage] = useOptimistic(stage);
  const [isPending, startTransition] = useTransition();

  if (isOwnerAndApplicantManager) {
    return <StageDetails stage={optimisticStage} />;
  }

  return null;
}

function StageDetails({ stage }: { stage: ApplicationStage }) {
  return (
    <div className="flex gap-2 items-center">
      <StageIcon stage={stage} className="size-5 text-inherit" />
      <div>{formatJobListingApplicationStage(stage)}</div>
    </div>
  );
}
