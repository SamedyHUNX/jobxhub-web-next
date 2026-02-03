"use client";

import { FormField } from "@/components/FormField";
import FormFooter from "@/components/FormFooter";
import ImageUpload from "@/components/ProfileImage";
import { useOrgs } from "@/hooks/use-orgs";
import { createOrganizationSchema, CreateOrgFormData } from "@/schemas";
import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { toast } from "sonner";
import { generateSlug } from "@/lib/utils";
import SubmitButton from "@/components/SubmitButton";

export default function CreateNewOrgPage() {
  // Translations
  const t = useTranslations();
  const newOrgT = (key: string) => t(`organizations.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);
  const { createOrganization, isCreating } = useOrgs();

  const createOrganizationFormSchema = useMemo(
    () => createOrganizationSchema(validationT),
    [validationT]
  );

  // Initialize TanStack Form
  const form = useForm({
    defaultValues: {
      orgName: "",
      orgDescription: "",
      orgSlug: "",
      orgImage: null,
    } as CreateOrgFormData,
    onSubmit: async ({ value }) => {
      if (!value.orgImage) {
        toast.error(validationT("photoRequired"));
        return;
      }

      const formData = new FormData();
      formData.append("orgName", value.orgName);
      formData.append("orgDescription", value.orgDescription);
      formData.append("orgSlug", value.orgSlug);
      formData.append("image", value.orgImage);

      createOrganization(formData as unknown as CreateOrgFormData);
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = createOrganizationFormSchema.safeParse(value);
        return result.success ? undefined : result.error.format();
      },
    },
  });

  return (
    <div className="min-h-[calc(100vh-68px)] bg-white dark:bg-black flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-[95%] max-w-2xl p-12 border border-gray-300 dark:border-gray-700">
        <h1 className="text-4xl font-bold mb-12 text-black dark:text-white tracking-tighter">
          {newOrgT("newPageTitle")}
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6 w-full"
        >
          {/* Profile Image Upload */}
          <div className="mb-8">
            <form.Field
              name="orgImage"
              validators={{
                onChange: ({ value }) => {
                  const result =
                    createOrganizationFormSchema.shape.orgImage.safeParse(
                      value
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
            </form.Field>
          </div>

          {/* Organization Name Input */}
          <FormField
            form={form}
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
              form.setFieldValue("orgSlug", generateSlug(value));
            }}
          />

          {/* Organization Description Input */}
          <FormField
            form={form}
            name="orgDescription"
            placeholder={newOrgT("orgDescriptionPlaceholder")}
            label={newOrgT("orgDescription")}
            validator={(value) => {
              const result =
                createOrganizationFormSchema.shape.orgDescription.safeParse(
                  value
                );
              return result.success
                ? undefined
                : result.error.issues[0].message;
            }}
          />

          {/* orgSlug Input */}
          <FormField
            form={form}
            name="orgSlug"
            label={newOrgT("orgSlugName")}
            placeholder="Auto-generated"
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
            isCreating={isCreating}
            buttonText={newOrgT("create")}
          />
        </form>

        {/* Footer Branding */}
        <FormFooter />
      </div>
    </div>
  );
}
