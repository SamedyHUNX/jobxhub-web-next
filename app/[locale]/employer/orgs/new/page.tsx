"use client";

import { FormField } from "@/components/FormField";
import FormFooter from "@/components/FormFooter";
import { LoadingSwap } from "@/components/LoadingSwap";
import { Button } from "@/components/ui/button";
import { useOrgs } from "@/hooks/use-orgs";
import { extractErrorMessage } from "@/lib/utils";
import { createOrganizationSchema, CreateOrgFormData } from "@/schemas";
import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function CreateNewOrgPage() {
  // Translations
  const t = useTranslations();
  const newOrgT = (key: string) => t(`organizations.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);
  const successT = (key: string) => t(`apiSuccess.${key}`);
  const errorT = (key: string) => t(`apiError.${key}`);

  const router = useRouter();
  const { createOrganization, isCreating, createError, createSuccess } =
    useOrgs();

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
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                      {field.state.value ? (
                        <img
                          src={URL.createObjectURL(field.state.value)}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          className="w-10 h-10 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      )}
                    </div>
                    <label
                      htmlFor="image-upload"
                      className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer shadow-lg transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) field.handleChange(file);
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    {newOrgT("uploadPhoto")}
                  </p>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
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
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
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
