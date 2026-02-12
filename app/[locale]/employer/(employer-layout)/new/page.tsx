"use client";

import { FormField } from "@/components/FormField";
import FormFooter from "@/components/FormFooter";
import ImageUpload from "@/components/ProfileImage";
import { useOrgs } from "@/hooks/use-orgs";
import { createOrganizationSchema, CreateOrgFormData } from "@/schemas";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { generateSlug } from "@/lib/utils";
import SubmitButton from "@/components/SubmitButton";
import { useCustomForm } from "@/hooks/use-custom-form";

export default function CreateNewOrgPage() {
  // Translations
  const t = useTranslations();
  const newOrgT = (key: string) => t(`organizations.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);
  const { createOrganization, isCreating } = useOrgs();

  const createOrganizationFormSchema = createOrganizationSchema(validationT);
  const createOrgForm = useCustomForm({
    defaultValues: {
      orgName: "",
      orgDescription: "",
      orgSlug: "",
      orgImage: null,
    } as CreateOrgFormData,
    validationSchema: createOrganizationFormSchema,
    onSubmit: async (values) => {
      if (!values.orgImage) {
        toast.error(validationT("photoRequired"));
        return;
      }

      const formData = new FormData();
      formData.append("orgName", values.orgName);
      formData.append("orgDescription", values.orgDescription);
      formData.append("orgSlug", values.orgSlug);
      formData.append("image", values.orgImage);

      createOrganization(formData as unknown as CreateOrgFormData);
    },
  });

  return (
    <div className="min-h-[calc(100vh-68px)]  flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-[95%] max-w-2xl p-12 border border-gray-300 dark:border-gray-700">
        <h1 className="text-4xl font-bold mb-12 text-black dark:text-white tracking-tighter">
          {newOrgT("newPageTitle")}
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            createOrgForm.handleSubmit();
          }}
          className="space-y-6 w-full"
        >
          {/* Profile Image Upload */}
          <div className="mb-8">
            <createOrgForm.Field
              name="orgImage"
              validators={{
                onChange: ({ value }) => {
                  const result =
                    createOrganizationFormSchema.shape.orgImage.safeParse(
                      value,
                    );
                  return result.success
                    ? undefined
                    : result.error.issues[0].message;
                },
              }}
            >
              {(field: any) => (
                <ImageUpload
                  value={field.state.value}
                  onChange={(file) => field.handleChange(file)}
                  label={newOrgT("uploadPhoto")}
                  error={
                    field.state.meta.errors.length > 0
                      ? field.state.meta.errors[0]
                      : undefined
                  }
                  size="md"
                />
              )}
            </createOrgForm.Field>
          </div>

          {/* Organization Name Input */}
          <FormField
            form={createOrgForm}
            name="orgName"
            placeholder={newOrgT("orgNamePlaceholder")}
            label={newOrgT("orgName")}
            validator={(value) => {
              const result =
                createOrganizationFormSchema.shape.orgName.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0].message;
            }}
            onChange={(value) => {
              // Auto-generate orgSlug when org name changes
              createOrgForm.setFieldValue("orgSlug", generateSlug(value));
            }}
          />

          {/* Organization Description Input */}
          <FormField
            form={createOrgForm}
            name="orgDescription"
            placeholder={newOrgT("orgDescriptionPlaceholder")}
            label={newOrgT("orgDescription")}
            validator={(value) => {
              const result =
                createOrganizationFormSchema.shape.orgDescription.safeParse(
                  value,
                );
              return result.success
                ? undefined
                : result.error.issues[0].message;
            }}
          />

          {/* orgSlug Input */}
          <FormField
            form={createOrgForm}
            name="orgSlug"
            label={newOrgT("orgSlugName")}
            placeholder={newOrgT("orgSlugPlaceholder")}
            disabled={true}
            validator={(value) => {
              const result =
                createOrganizationFormSchema.shape.orgSlug.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0].message;
            }}
          />

          {/* Submit Button */}
          <SubmitButton
            isSubmitting={isCreating}
            buttonText={newOrgT("create")}
          />
        </form>

        {/* Footer Branding */}
        <FormFooter />
      </div>
    </div>
  );
}
