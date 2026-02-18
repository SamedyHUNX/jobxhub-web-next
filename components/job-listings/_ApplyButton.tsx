import { useEffect, useState } from "react";
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

export default function ApplyButton({
  jobListingId,
}: {
  jobListingId: string;
}) {
  const { user: currentUser } = useProfile();
  const { getOwnJobApplication, getUserResume } = useJobListings();

  const [application, setApplication] = useState<any | null>(null);
  const [userResume, setUserResume] = useState<any | null>(null);

  useEffect(() => {
    if (currentUser?.id) {
      const app = getOwnJobApplication({
        jobId: jobListingId,
        userId: currentUser.id,
      });
      setApplication(app);

      const resume = getUserResume({ userId: currentUser.id });
      setUserResume(resume);
    }
  }, [currentUser?.id, jobListingId, getOwnJobApplication, getUserResume]);

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

  if (application != null) {
    const formatter = new Intl.RelativeTimeFormat(undefined, {
      style: "short",
      numeric: "always",
    });

    // Convert string to Date
    const createdAtDate = new Date(application.createdAt);

    const difference = differenceInDays(createdAtDate, new Date());

    return (
      <div className="text-muted-foreground text-sm">
        You applied for this job{" "}
        {difference === 0 ? "today" : formatter.format(difference, "days")}
      </div>
    );
  }

  if (userResume == null) {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Apply</Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-3xl max-h-[calc(100%-2rem)] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Application</DialogTitle>
          <DialogDescription>
            Applying for a job cannot be undone and is something you can only do
            once per job listing.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <NewJobListingApplicationForm jobListingId={jobListingId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
