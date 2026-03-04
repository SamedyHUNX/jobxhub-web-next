"use client";

import { Application } from "@/types/application.types";
import { Resume, User } from "@/types/user.types";
import { ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DataTable } from "../data-table/DataTable";

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
