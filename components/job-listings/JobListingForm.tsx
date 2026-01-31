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
import { ReactNode, useMemo } from "react";
import { cn } from "@/lib/utils";
import TextField from "../form/TextField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import SelectField from "../form/SelectField";
import TextAreaField from "../form/TextAreaField";
import { Button } from "../ui/button";
import { LoadingSwap } from "../LoadingSwap";
import { states } from "@/data/australia-state";

export interface JobListingFormProps {
  // Core functionality
  onSubmit: (data: CreateJobListingFormData) => void;
  defaultValues?: Partial<CreateJobListingFormData>;

  // Customization
  mode?: "create" | "edit";
  translations?: {
    validations?: any;
    labels?: Partial<Record<keyof CreateJobListingFormData, string>>;
    descriptions?: Partial<Record<keyof CreateJobListingFormData, string>>;
    buttons?: {
      submit?: string;
      submitting?: string;
    };
    options?: {
      wageIntervals?: Record<string, string>;
      locationRequirements?: Record<string, string>;
      jobTypes?: Record<string, string>;
      experienceLevels?: Record<string, string>;
      clearState?: string;
    };
  };

  // Layout & styling
  className?: string;
  buttonClassName?: string;
  showBorder?: boolean;

  // Field visibility/customization
  fields?: {
    show?: Partial<Record<keyof CreateJobListingFormData, boolean>>;
    disabled?: Partial<Record<keyof CreateJobListingFormData, boolean>>;
  };

  // Advanced
  validationSchema?: any;
  children?: (form: any) => ReactNode;

  // Additional props
  isLoading?: boolean;
  hideSubmitButton?: boolean;

  orgId?: string;
}

export default function JobListingForm({
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
  orgId,
}: JobListingFormProps) {
  const validationT = useTranslations("validations");
  const isMobile = useIsMobile();

  // Define schema
  const jobListingSchema = useMemo(
    () => createJobListingSchema(validationT),
    [validationT]
  );

  // Initialize TanStack Form
  const form = useForm({
    defaultValues: {
      organizationId: orgId,
      title: "",
      description: "",
      stateAbbreviation: "",
      city: "",
      experienceLevel: "junior",
      wage: undefined,
      wageInterval: "yearly",
      type: "full-time",
      locationRequirement: "in-office",
      ...defaultValues,
    },
    onSubmit: async ({ value }) => {
      try {
        onSubmit(value);
      } catch (error) {
        console.error("Failed to create the job", error);
      }
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
    defaultLabel: string
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
    requirement: (typeof locationRequirements)[number]
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
      ? translations?.buttons?.submit ?? "Update Job Listing"
      : translations?.buttons?.submit ?? "Create Job Listing";

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
            />
          )}

          {shouldShowField("wage") && (
            <div className="space-y-2">
              <label className="text-lg font-medium text-gray-700 tracking-tighter">
                {getLabel("wage", "Wage")}
              </label>
              <div className="flex gap-2">
                <form.Field name="wage">
                  {(field: any) => (
                    <input
                      type="number"
                      value={field.state.value ?? ""}
                      onChange={(e) => {
                        const value = isNaN(e.target.valueAsNumber)
                          ? null
                          : e.target.valueAsNumber;
                        field.handleChange(value);
                      }}
                      disabled={isFieldDisabled("wage")}
                      className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </form.Field>

                {shouldShowField("wageInterval") && (
                  <form.Field name="wageInterval">
                    {(field: any) => (
                      <div className="w-37.5">
                        <Select
                          value={field.state.value ?? ""}
                          onValueChange={(val) => field.handleChange(val)}
                          disabled={isFieldDisabled("wageInterval")}
                        >
                          <SelectTrigger className="rounded-l-none">
                            / <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {wageIntervals.map((interval) => (
                              <SelectItem key={interval} value={interval}>
                                {getWageIntervalLabel(interval)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </form.Field>
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
              disabled={isFieldDisabled("city")}
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
            />
          )}
        </div>

        {shouldShowField("description") && (
          <TextAreaField
            form={form}
            name="description"
            label={getLabel("description", "Description")}
            description={getDescription("description")}
            disabled={isFieldDisabled("description")}
          />
        )}

        {/* Custom children for additional fields */}
        {children?.(form)}
      </div>

      {!hideSubmitButton && (
        <div className={cn("pt-4 mt-4", showBorder && "border-t")}>
          <form.Subscribe
            selector={(state) => ({
              isSubmitting: state.isSubmitting,
              canSubmit: state.canSubmit,
            })}
          >
            {({ isSubmitting, canSubmit }) => (
              <Button
                type="submit"
                disabled={isSubmitting || !canSubmit}
                className={cn("yellow-btn w-full", buttonClassName)}
              >
                <LoadingSwap isLoading={isSubmitting}>
                  {submitButtonText}
                </LoadingSwap>
              </Button>
            )}
          </form.Subscribe>
        </div>
      )}
    </form>
  );
}
