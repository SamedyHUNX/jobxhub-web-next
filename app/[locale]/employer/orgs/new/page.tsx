"use client";

import { FormField } from "@/components/FormField";
import FormFooter from "@/components/FormFooter";
import ImageUpload from "@/components/ImageUpload";
import { LoadingSwap } from "@/components/LoadingSwap";
import { Button } from "@/components/ui/button";
import { useOrgs } from "@/hooks/use-orgs";
import { extractErrorMessage } from "@/lib/utils";
import { createOrganizationSchema, CreateOrgFormData } from "@/schemas";
import { useForm } from "@tanstack/react-form";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";

export default function CreateNewOrgPage() {
  // Translations
  const t = useTranslations();
  const newOrgT = (key: string) => t(`organizations.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);
  const successT = (key: string) => t(`apiSuccess.${key}`);
  const errorT = (key: string) => t(`apiError.${key}`);

  const router = useRouter();
  const locale = useLocale();
  const { createOrganization, isCreating, createError, createSuccess } =
    useOrgs();

  useEffect(() => {
    if (createSuccess) {
      router.push(`/${locale}/employer/orgs/select`);
    }
  }, [createError]);

  const createOrganizationFormSchema = useMemo(
    () => createOrganizationSchema(validationT),
    [validationT]
  );

  // Initialize TanStack Form
  const form = useForm({
    defaultValues: {
      orgName: "",
      slug: "",
      image: null,
    } as CreateOrgFormData,
    onSubmit: async ({ value }) => {
      if (!value.image) {
        toast.error(validationT("photoRequired"));
        return;
      }

      const formData = new FormData();
      formData.append("orgName", value.orgName);
      formData.append("slug", value.slug);
      formData.append("image", value.image);

      createOrganization(formData as unknown as CreateOrgFormData);
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = createOrganizationFormSchema.safeParse(value);
        return result.success ? undefined : result.error.format();
      },
    },
  });

  // Show toast notifications
  useEffect(() => {
    if (createError) {
      toast.error(extractErrorMessage(createError, errorT));
    } else if (createSuccess) {
      toast.success(successT("createOrgSuccess"));
    }
  }, [createError, createSuccess, errorT, successT]);

  // Auto-generate slug from organization name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-[#fdfbf7] dark:bg-black flex items-center justify-center p-4">
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
              name="image"
              validators={{
                onChange: ({ value }) => {
                  const result =
                    createOrganizationFormSchema.shape.image.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.errors[0].message;
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
            placeholder="For example: Microsoft Corporation"
            label={newOrgT("orgName")}
            validator={(value) => {
              const result =
                createOrganizationFormSchema.shape.orgName.safeParse(value);
              return result.success
                ? undefined
                : result.error.errors[0].message;
            }}
            onChange={(value) => {
              // Auto-generate slug when org name changes
              form.setFieldValue("slug", generateSlug(value));
            }}
          />

          {/* Slug Input */}
          <FormField
            form={form}
            name="slug"
            label={newOrgT("slugName")}
            placeholder="Auto-generated"
            validator={(value) => {
              const result =
                createOrganizationFormSchema.shape.slug.safeParse(value);
              return result.success
                ? undefined
                : result.error.errors[0].message;
            }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isCreating}
            className="yellow-btn w-full font-semibold py-3 px-4 rounded-xl"
          >
            <LoadingSwap isLoading={isCreating}>
              {newOrgT("create")}
            </LoadingSwap>
          </Button>
        </form>

        {/* Footer Branding */}
        <FormFooter />
      </div>
    </div>
  );
}
