import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { differenceInDays } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProfile } from "@/hooks/use-profile";
import { useJobListings } from "@/hooks/use-job-listings";
import { NewJobListingApplicationForm } from "@/components/job-listings/NewJobListingApplicationForm";
import type { Resume } from "@/types/user.types";

export function ApplyButton({ jobId }: { jobId: string }) {
  const { user: currentUser } = useProfile();
  const { getOwnJobListingApplicationMutation, getUserResumeMutation } =
    useJobListings();

  const [application, setApplication] = useState<any | null>(null);
  const [userResume, setUserResume] = useState<Resume | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  // Keep a stable ref to the latest mutateAsync functions so the effect
  // never needs to re-run just because React Query replaced the object.
  const getApplicationRef = useRef(
    getOwnJobListingApplicationMutation.mutateAsync,
  );
  const getResumeRef = useRef(getUserResumeMutation.mutateAsync);

  // Keep refs up-to-date on every render without re-triggering the effect
  getApplicationRef.current = getOwnJobListingApplicationMutation.mutateAsync;
  getResumeRef.current = getUserResumeMutation.mutateAsync;

  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchData = async () => {
      try {
        const app = await getApplicationRef.current({ jobId });
        setApplication(app);
      } catch {
        // 404 → user hasn't applied yet, that's fine
      }

      try {
        const resume = await getResumeRef.current(currentUser.id);
        setUserResume(resume);
      } catch {
        // 404 → no resume uploaded yet, that's fine
      }
    };

    fetchData();
  }, [currentUser?.id, jobId]);

  // ─── Not logged in ──────────────────────────────────────────────────────────
  if (currentUser?.id == null) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button>Apply</Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2">
          You need to create an account before applying for a job.
          <Button>
            <Link href="/auth/sign-up" className="yellow-btn">
              Sign Up
            </Link>
          </Button>
        </PopoverContent>
      </Popover>
    );
  }

  // ─── Already applied ────────────────────────────────────────────────────────
  if (application != null) {
    const formatter = new Intl.RelativeTimeFormat(undefined, {
      style: "short",
      numeric: "always",
    });
    const difference = differenceInDays(
      new Date(application.createdAt),
      new Date(),
    );

    return (
      <div className="text-muted-foreground text-sm">
        You applied for this job{" "}
        {difference === 0 ? "today" : formatter.format(difference, "days")}
      </div>
    );
  }

  // ─── No resume uploaded ─────────────────────────────────────────────────────
  if (!userResume) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button>Apply</Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2">
          You need to upload your resume before applying for a job.
          <Button asChild>
            <Link href="/user-settings/resume">Upload Resume</Link>
          </Button>
        </PopoverContent>
      </Popover>
    );
  }

  // ─── Ready to apply ─────────────────────────────────────────────────────────
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Apply</Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-3xl max-h-[calc(100%-2rem)] overflow-hidden flex flex-col bg-white dark:bg-black">
        <DialogHeader>
          <DialogTitle>Application</DialogTitle>
          <DialogDescription>
            Applying for a job cannot be undone and is something you can only do
            once per job listing.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <NewJobListingApplicationForm
            jobId={jobId}
            buttonText="Apply"
            onSuccess={async () => {
              try {
                const app = await getApplicationRef.current({ jobId });
                setApplication(app);
              } catch {
                // ignore
              }
              setDialogOpen(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
