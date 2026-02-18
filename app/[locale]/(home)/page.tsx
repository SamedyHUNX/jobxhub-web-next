import PageLoader from "@/components/PageLoader";
import { JobListingItems } from "./_shared/JobListingItems";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <JobListingItems />
    </Suspense>
  );
}
