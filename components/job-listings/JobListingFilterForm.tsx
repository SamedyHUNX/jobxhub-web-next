"use client";

import { useCustomForm } from "@/hooks/use-custom-form";
import {
  ExperienceLevel,
  experienceLevels,
  JobListingType,
  jobListingTypes,
  LocationRequirement,
  locationRequirements,
} from "@/schemas";
import { useSearchParams, useRouter } from "next/navigation";
import z from "zod";
import { FormField } from "../FormField";
import SelectField from "../form/SelectField";
import { states } from "@/constants/australia-state";
import {
  formatExperienceLevel,
  formatJobType,
  formatLocationRequirement,
} from "@/lib/formatter";
import SubmitButton from "../SubmitButton";
import { useSidebar } from "../ui/sidebar";

const ANY_VALUE = "any";

const jobListingFilterSchema = z.object({
  title: z.string().optional(),
  city: z.string().optional(),
  stateAbbreviation: z.string().or(z.literal(ANY_VALUE)).optional(),
  experienceLevel: z.enum(experienceLevels).or(z.literal(ANY_VALUE)).optional(),
  type: z.enum(jobListingTypes).or(z.literal(ANY_VALUE)).optional(),
  locationRequirement: z
    .enum(locationRequirements)
    .or(z.literal(ANY_VALUE))
    .optional(),
});

export default function JobListingFilterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setOpen } = useSidebar();

  const jobListingFilterForm = useCustomForm({
    defaultValues: {
      title: searchParams.get("title") ?? "",
      city: searchParams.get("city") ?? "",
      stateAbbreviation: searchParams.get("stateAbbreviation") ?? ANY_VALUE,
      experienceLevel:
        (searchParams.get("experience") as ExperienceLevel) ?? ANY_VALUE,
      type: (searchParams.get("type") as JobListingType) ?? ANY_VALUE,
      locationRequirement:
        (searchParams.get("locationRequirement") as LocationRequirement) ??
        ANY_VALUE,
    },
    onSubmit: (values) => {
      const params = new URLSearchParams(searchParams);

      if (values.title) {
        params.set("title", values.title);
      } else {
        params.delete("title");
      }

      if (values.city) {
        params.set("city", values.city);
      } else {
        params.delete("city");
      }

      if (
        values.stateAbbreviation &&
        (values.stateAbbreviation as string) !== ANY_VALUE
      ) {
        params.set("stateAbbreviation", values.stateAbbreviation);
      } else {
        params.delete("stateAbbreviation");
      }

      if (
        values.experienceLevel &&
        (values.experienceLevel as string) !== ANY_VALUE
      ) {
        params.set("experience", values.experienceLevel);
      } else {
        params.delete("experience");
      }

      if (values.type && (values.type as string) !== ANY_VALUE) {
        params.set("type", values.type);
      } else {
        params.delete("type");
      }

      if (
        values.locationRequirement &&
        (values.locationRequirement as string) !== ANY_VALUE
      ) {
        params.set("locationRequirement", values.locationRequirement);
      } else {
        params.delete("locationRequirement");
      }

      router.push(`?${params.toString()}`);
      setOpen(false);
    },
    validationSchema: jobListingFilterSchema,
  });

  const getLocationRequirementLabel = (lr: LocationRequirement) => {
    return formatLocationRequirement(lr);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        jobListingFilterForm.handleSubmit();
      }}
      className="space-y-6"
    >
      {/* Title Field */}
      <FormField
        form={jobListingFilterForm}
        name="title"
        label={"Job Title"}
        type="text"
        placeholder={"Enter the job title"}
        validator={(value) => {
          const result = jobListingFilterSchema.shape.title.safeParse(value);
          return result.success ? undefined : result.error.issues[0].message;
        }}
      />

      {/* City Field */}
      <FormField
        form={jobListingFilterForm}
        name="city"
        label="City"
        type="text"
        placeholder="Enter city"
        validator={(value) => {
          const result = jobListingFilterSchema.shape.city.safeParse(value);
          return result.success ? undefined : result.error.issues[0].message;
        }}
      />

      {/* State Field */}
      <SelectField
        form={jobListingFilterForm}
        name="stateAbbreviation"
        label="State"
        options={[
          { value: ANY_VALUE, label: "Any" },
          ...states.map((state) => ({
            value: state.abbreviation,
            label: state.name,
          })),
        ]}
        validator={(value) => {
          const result =
            jobListingFilterSchema.shape.stateAbbreviation.safeParse(value);
          return result.success ? undefined : result.error.issues[0].message;
        }}
      />

      {/* Experience Level Field */}
      <SelectField
        form={jobListingFilterForm}
        name="experienceLevel"
        label="Experience Level"
        options={[
          { value: ANY_VALUE, label: "Any" },
          ...experienceLevels.map((level) => ({
            value: level,
            label: formatExperienceLevel(level),
          })),
        ]}
        validator={(value) => {
          const result =
            jobListingFilterSchema.shape.experienceLevel.safeParse(value);
          return result.success ? undefined : result.error.issues[0].message;
        }}
      />

      {/* Job Type Field */}
      <SelectField
        form={jobListingFilterForm}
        name="type"
        label="Job Type"
        options={[
          { value: ANY_VALUE, label: "Any" },
          ...jobListingTypes.map((type) => ({
            value: type,
            label: formatJobType(type),
          })),
        ]}
        validator={(value) => {
          const result = jobListingFilterSchema.shape.type.safeParse(value);
          return result.success ? undefined : result.error.issues[0].message;
        }}
      />

      {/* Location Requirement Field */}
      <SelectField
        form={jobListingFilterForm}
        name="locationRequirement"
        label="Location Requirement"
        options={[
          { value: ANY_VALUE, label: "Any" },
          ...locationRequirements.map((lr) => ({
            value: lr,
            label: getLocationRequirementLabel(lr),
          })),
        ]}
        onChange={() => {
          // Trigger validation on dependent fields
          jobListingFilterForm.validateField("city", "change");
          jobListingFilterForm.validateField("stateAbbreviation", "change");
        }}
        validator={(value) => {
          const result =
            jobListingFilterSchema.shape.locationRequirement.safeParse(value);
          return result.success ? undefined : result.error.issues[0].message;
        }}
      />

      <SubmitButton
        isSubmitting={jobListingFilterForm.state.isSubmitting}
        buttonText="Apply Filters"
      />
    </form>
  );
}
