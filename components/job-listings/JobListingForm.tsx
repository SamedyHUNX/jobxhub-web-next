"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  formatExperienceLevel,
  formatJobType,
  formatLocationRequirement,
  formatWageInterval,
} from "@/lib/formatter";
import {
  JobListingFormData,
  experienceLevels,
  jobListingTypes,
  wageIntervals,
  createOrUpdateJobListingSchema,
} from "@/schemas";
import { locationRequirements } from "@/types";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import TextField from "../form/TextField";
import SelectField from "../form/SelectField";
import { states } from "@/constants/australia-state";
import { FormField } from "../FormField";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import SubmitButton from "../SubmitButton";
import { JobListingFormProps } from "./_JoblistingFormProps";
import { useCustomForm } from "@/hooks/use-custom-form";

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
  const jobListingSchema = createOrUpdateJobListingSchema(validationT);

  const jobListingForm = useCustomForm({
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
    validationSchema: jobListingSchema,
    onSubmit: (value) => {
      const { id, organizationId, createdAt, updatedAt, ...safeValues } = value;
      onSubmit(safeValues);
    },
  });

  const getLabel = (field: keyof JobListingFormData, defaultLabel: string) =>
    translations?.labels?.[field] ?? defaultLabel;

  const getDescription = (field: keyof JobListingFormData) =>
    translations?.descriptions?.[field];

  const shouldShowField = (field: keyof JobListingFormData) =>
    fields?.show?.[field] ?? true;

  const isFieldDisabled = (field: keyof JobListingFormData) =>
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
      ? (translations?.buttons?.update ?? "Update Job Listing")
      : (translations?.buttons?.submit ?? "Create Job Listing");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        jobListingForm.handleSubmit();
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
              form={jobListingForm}
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
                  form={jobListingForm}
                  name="wage"
                  label={getLabel("wage", "Wage")}
                  description={getDescription("wage")}
                  type="number"
                  validator={(value) => {
                    if (value === "") {
                      return undefined;
                    }
                    const result = jobListingSchema.shape.wage.safeParse(value);
                    return result.success
                      ? undefined
                      : result.error.issues[0].message;
                  }}
                />

                {shouldShowField("wageInterval") && (
                  <SelectField
                    form={jobListingForm}
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
              form={jobListingForm}
              name="city"
              label={getLabel("city", "City")}
              description={getDescription("city")}
              type="text"
              validator={(value) => {
                // Get current form state to check locationRequirement
                const currentValues = jobListingForm.state.values;

                // Run full schema validation to catch cross-field rules
                const result = jobListingSchema.safeParse({
                  ...currentValues,
                  city: value, // Use the current value being validated
                });

                if (!result.success) {
                  // Find error specific to city field
                  const cityError = result.error.issues.find((issue) =>
                    issue.path.includes("city"),
                  );
                  return cityError?.message;
                }

                return undefined;
              }}
            />
          )}

          {shouldShowField("stateAbbreviation") && (
            <SelectField
              form={jobListingForm}
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
              validator={(value) => {
                const currentValues = jobListingForm.state.values;

                const result = jobListingSchema.safeParse({
                  ...currentValues,
                  stateAbbreviation: value,
                });

                if (!result.success) {
                  const stateError = result.error.issues.find((issue) =>
                    issue.path.includes("stateAbbreviation"),
                  );
                  return stateError?.message;
                }

                return undefined;
              }}
            />
          )}

          {shouldShowField("locationRequirement") && (
            <SelectField
              form={jobListingForm}
              name="locationRequirement"
              label={getLabel("locationRequirement", "Location Requirement")}
              description={getDescription("locationRequirement")}
              options={locationRequirements.map((lr) => ({
                value: lr,
                label: getLocationRequirementLabel(lr),
              }))}
              disabled={isFieldDisabled("locationRequirement")}
              onChange={() => {
                // Trigger validation on dependent fields
                jobListingForm.validateField("city", "change");
                jobListingForm.validateField("stateAbbreviation", "change");
              }}
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
              form={jobListingForm}
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
              form={jobListingForm}
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
            form={jobListingForm}
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
        {children?.(jobListingForm)}
      </div>

      {!hideSubmitButton && (
        <div className={cn("pt-4 mt-4", showBorder && "border-t")}>
          <SubmitButton
            isSubmitting={isLoading || jobListingForm.state.isSubmitting}
            buttonText={submitButtonText}
            buttonClassname={buttonClassName}
          />
        </div>
      )}
    </form>
  );
}
