import { JobListingFormData } from "@/schemas";
import type { JobListing } from "@/types";
import { ReactNode } from "react";

export interface JobListingFormProps {
  // Existing data for edit mode
  jobListing?: JobListing;

  // Core functionality
  onSubmit: (data: JobListingFormData) => void;
  defaultValues?: Partial<JobListingFormData>;

  // Customization
  mode?: "create" | "edit";
  translations?: {
    validations?: any;
    labels?: Partial<Record<keyof JobListingFormData, string>>;
    descriptions?: Partial<Record<keyof JobListingFormData, string>>;
    buttons?: {
      submit?: string;
      update?: string;
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
    show?: Partial<Record<keyof JobListingFormData, boolean>>;
    disabled?: Partial<Record<keyof JobListingFormData, boolean>>;
  };

  // Advanced
  validationSchema?: any;
  children?: (form: any) => ReactNode;

  // Additional props
  isLoading?: boolean;
  hideSubmitButton?: boolean;

  orgId?: string;
}
