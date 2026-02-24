"use client";

import { useCustomForm } from "@/hooks/use-custom-form";
import { jobListingAiSearchSchema } from "@/schemas";
import { useTranslations } from "next-intl";
import { FormField } from "../FormField";
import SubmitButton from "../SubmitButton";
import { useJobListings } from "@/hooks/use-job-listings";
import { useRouter } from "next/navigation";

export function JobListingAiSearchForm() {
  const validationT = useTranslations("validations");
  const router = useRouter();

  const { getAiJobListingSearchResults } = useJobListings();

  const jobListingAiSearchVali = jobListingAiSearchSchema(validationT);

  const jobListingAiSearchForm = useCustomForm({
    defaultValues: {
      query: "",
    },
    validationSchema: jobListingAiSearchVali,
    onSubmit: async (values) => {
      const results = await getAiJobListingSearchResults(values);

      const ids = results.map((listing: { id: string }) => listing.id);

      const params = new URLSearchParams();
      (ids as string[]).forEach((id) => params.append("jobIds", id));
      router.push(`/?${params.toString()}`);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        jobListingAiSearchForm.handleSubmit();
      }}
      className="space-y-6"
    >
      <FormField
        form={jobListingAiSearchForm}
        name="query"
        label={"Query"}
        type="text"
        description={
          "Provide a description of your skills/experience as well as what you are looking for in a job. The more specific you are, the better the results will be."
        }
        validator={(value) => {
          const result = jobListingAiSearchVali.shape.query.safeParse(value);
          return result.success ? undefined : result.error.issues[0].message;
        }}
      />

      <SubmitButton
        isSubmitting={jobListingAiSearchForm.state.isSubmitting}
        buttonText="Search"
      />
    </form>
  );
}
