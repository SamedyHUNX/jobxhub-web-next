import { useCustomForm } from "@/hooks/use-custom-form";
import { newJobListingApplicationSchema } from "@/schemas";
import { FormField } from "../FormField";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import SubmitButton from "../SubmitButton";
import { useJobListings } from "@/hooks/use-job-listings";

export function NewJobListingApplicationForm({
  jobListingId,
  buttonText,
  onSuccess,
}: {
  jobListingId: string;
  buttonText?: string;
  onSuccess?: () => void;
}) {
  const { createJobListingApplication } = useJobListings();

  const form = useCustomForm({
    defaultValues: { coverLetter: "" },
    validationSchema: newJobListingApplicationSchema,
    onSubmit: async (values) => {
      createJobListingApplication(
        {
          jobListingId: jobListingId,
          dto: values,
        },
        { onSuccess },
      );
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className={"space-y-6"}
    >
      <FormField
        form={form}
        name="coverLetter"
        label="Cover Letter"
        component={MarkdownEditor}
        className="min-h-50"
        validator={(value) => {
          const result =
            newJobListingApplicationSchema.shape.coverLetter.safeParse(value);
          return result.success ? undefined : result.error.issues[0].message;
        }}
      />

      <SubmitButton
        isSubmitting={form.state.isSubmitting}
        buttonText={buttonText}
      />
    </form>
  );
}
