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
import type { Resume } from "@/types/user.types";

export default function ApplyButton({
  jobListingId,
}: {
  jobListingId: string;
}) {
  const { user: currentUser } = useProfile();
  const { getOwnJobApplication, getUserResume } = useJobListings();

  const [application, setApplication] = useState<any | null>(null);
  const [userResume, setUserResume] = useState<Resume | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    // Define the async logic inside the effect
    const fetchData = async () => {
      if (!currentUser?.id) return;

      try {
        // 1. Fetch application
        const app = await getOwnJobApplication({
          jobId: jobListingId,
        });
        setApplication(app);

        // 2. Fetch resume
        const resume = await getUserResume(currentUser.id);
        setUserResume(resume);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchData();
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

  if (userResume == null || !userResume) {
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
            jobListingId={jobListingId}
            buttonText="Apply"
            onSuccess={async () => {
              const app = await getOwnJobApplication({ jobId: jobListingId });
              setApplication(app);
              setDialogOpen(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
