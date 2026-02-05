"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  formatExperienceLevel,
  formatJobType,
  formatLocationRequirement,
  formatWageInterval,
} from "@/lib/formatter";
import {
  CreateJobListingFormData,
  createJobListingSchema,
  experienceLevels,
  jobListingTypes,
  wageIntervals,
} from "@/schemas";
import { locationRequirements } from "@/types";
import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import TextField from "../form/TextField";
import SelectField from "../form/SelectField";
import { states } from "@/data/australia-state";
import { FormField } from "../FormField";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import SubmitButton from "../SubmitButton";
import { JobListingFormProps } from "./_JoblistingFormProps";

export default function JobListingForm({
  jobListing,
  onSubmit,
  defaultValues,
  mode = "create",
  translations,
  className,
  buttonClassName,
  showBorder = true,
  isLoading,
  fields,
  children,
  hideSubmitButton = false,
}: JobListingFormProps) {
  const validationT = useTranslations("validations");
  const isMobile = useIsMobile();

  // Define schema
  const jobListingSchema = useMemo(
    () => createJobListingSchema(validationT),
    [validationT],
  );

  // Initialize TanStack Form
  const form = useForm({
    defaultValues: {
      ...{
        title: "",
        description: "",
        stateAbbreviation: "" as string | null,
        city: "" as string | null,
        experienceLevel: "junior" as const,
        wage: undefined,
        wageInterval: "yearly" as const,
        type: "full-time" as const,
        locationRequirement: "in-office" as const,
      },
      ...defaultValues,
      ...jobListing,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = jobListingSchema.safeParse(value);
        return result.success ? undefined : result.error.format();
      },
    },
  });

  const getLabel = (
    field: keyof CreateJobListingFormData,
    defaultLabel: string,
  ) => translations?.labels?.[field] ?? defaultLabel;

  const getDescription = (field: keyof CreateJobListingFormData) =>
    translations?.descriptions?.[field];

  const shouldShowField = (field: keyof CreateJobListingFormData) =>
    fields?.show?.[field] ?? true;

  const isFieldDisabled = (field: keyof CreateJobListingFormData) =>
    fields?.disabled?.[field] ?? false;

  // Option translation helpers
  const getWageIntervalLabel = (interval: (typeof wageIntervals)[number]) =>
    translations?.options?.wageIntervals?.[interval] ??
    formatWageInterval(interval);

  const getLocationRequirementLabel = (
    requirement: (typeof locationRequirements)[number],
  ) =>
    translations?.options?.locationRequirements?.[requirement] ??
    formatLocationRequirement(requirement);

  const getJobTypeLabel = (type: (typeof jobListingTypes)[number]) =>
    translations?.options?.jobTypes?.[type] ?? formatJobType(type);

  const getExperienceLevelLabel = (level: (typeof experienceLevels)[number]) =>
    translations?.options?.experienceLevels?.[level] ??
    formatExperienceLevel(level);

  const getClearStateLabel = () => translations?.options?.clearState ?? "Clear";

  const submitButtonText =
    mode === "edit"
      ? (translations?.buttons?.submit ?? "Update Job Listing")
      : (translations?.buttons?.submit ?? "Create Job Listing");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className={cn("h-full flex flex-col @container", className)}
    >
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        <div
          className={`grid grid-cols-1 ${
            !isMobile ? "@md:grid-cols-2" : ""
          } gap-x-4 gap-y-6 items-start`}
        >
          {shouldShowField("title") && (
            <TextField
              form={form}
              name="title"
              label={getLabel("title", "Job Title")}
              description={getDescription("title")}
              disabled={isFieldDisabled("title")}
              validator={(value) => {
                const result = jobListingSchema.shape.title.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              }}
            />
          )}

          {shouldShowField("wage") && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <TextField
                  form={form}
                  name="wage"
                  label={getLabel("wage", "Wage")}
                  description={getDescription("wage")}
                  type="text"
                  validator={(value) => {
                    const result = jobListingSchema.shape.wage.safeParse(value);
                    return result.success
                      ? undefined
                      : result.error.issues[0].message;
                  }}
                />

                {shouldShowField("wageInterval") && (
                  <SelectField
                    form={form}
                    name="wageInterval"
                    label={getLabel("wageInterval", "Wage")}
                    description={getDescription("wageInterval")}
                    options={wageIntervals.map((interval) => ({
                      value: interval,
                      label: getWageIntervalLabel(interval),
                    }))}
                    disabled={isFieldDisabled("wageInterval")}
                  />
                )}
              </div>
              <p className="text-sm text-gray-500">
                {getDescription("wage") ?? "Optional"}
              </p>
            </div>
          )}
        </div>

        <div
          className={`grid grid-cols-1 ${
            !isMobile ? "@md:grid-cols-3" : ""
          } gap-x-4 gap-y-6 items-start`}
        >
          {shouldShowField("city") && (
            <TextField
              form={form}
              name="city"
              label={getLabel("city", "City")}
              description={getDescription("city")}
              type="text"
              validator={(value) => {
                const result = jobListingSchema.shape.city.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              }}
            />
          )}

          {shouldShowField("stateAbbreviation") && (
            <SelectField
              form={form}
              name="stateAbbreviation"
              label={getLabel("stateAbbreviation", "State")}
              description={getDescription("stateAbbreviation")}
              options={states.map((state) => ({
                value: state.abbreviation,
                label: state.name,
              }))}
              disabled={isFieldDisabled("stateAbbreviation")}
              allowClear
              clearLabel={getClearStateLabel()}
            />
          )}

          {shouldShowField("locationRequirement") && (
            <SelectField
              form={form}
              name="locationRequirement"
              label={getLabel("locationRequirement", "Location Requirement")}
              description={getDescription("locationRequirement")}
              options={locationRequirements.map((lr) => ({
                value: lr,
                label: getLocationRequirementLabel(lr),
              }))}
              disabled={isFieldDisabled("locationRequirement")}
            />
          )}
        </div>

        <div
          className={`grid grid-cols-1 ${
            !isMobile ? "@md:grid-cols-2" : ""
          } gap-x-4 gap-y-6 items-start`}
        >
          {shouldShowField("type") && (
            <SelectField
              form={form}
              name="type"
              label={getLabel("type", "Job Type")}
              description={getDescription("type")}
              options={jobListingTypes.map((type) => ({
                value: type,
                label: getJobTypeLabel(type),
              }))}
              disabled={isFieldDisabled("type")}
              validator={(value) => {
                const result = jobListingSchema.shape.type.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              }}
            />
          )}

          {shouldShowField("experienceLevel") && (
            <SelectField
              form={form}
              name="experienceLevel"
              label={getLabel("experienceLevel", "Experience Level")}
              description={getDescription("experienceLevel")}
              options={experienceLevels.map((level) => ({
                value: level,
                label: getExperienceLevelLabel(level),
              }))}
              disabled={isFieldDisabled("experienceLevel")}
              validator={(value) => {
                const result =
                  jobListingSchema.shape.experienceLevel.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              }}
            />
          )}
        </div>

        {shouldShowField("description") && (
          <FormField
            form={form}
            name="description"
            label={getLabel("description", "Description")}
            component={MarkdownEditor}
            className="min-h-50"
            validator={(value) => {
              const result =
                jobListingSchema.shape.description.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0].message;
            }}
          />
        )}
        {children?.(form)}
      </div>

      {!hideSubmitButton && (
        <div className={cn("pt-4 mt-4", showBorder && "border-t")}>
          <SubmitButton
            isCreating={isLoading || form.state.isSubmitting}
            buttonText={submitButtonText}
            buttonClassname={buttonClassName}
          />
        </div>
      )}
    </form>
  );
}
