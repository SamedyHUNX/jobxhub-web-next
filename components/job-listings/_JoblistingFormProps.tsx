import { CreateJobListingFormData } from "@/schemas";
import type { JobListing } from "@/types";
import { ReactNode } from "react";

export interface JobListingFormProps {
  jobListing?: JobListing;
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
