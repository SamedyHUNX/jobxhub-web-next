import { useForm } from "@tanstack/react-form";

interface FormConfig<T> {
  defaultValues: T;
  onSubmit: (value: T) => void | Promise<void>;
  validationSchema?: any;
  transformBeforeSubmit?: (value: T) => any;
  validateOnChange?: boolean | ((value: T) => boolean); // New option
}

export function useCustomForm<T>({
  defaultValues,
  onSubmit,
  validationSchema,
  transformBeforeSubmit,
  validateOnChange = false,
}: FormConfig<T>) {
  return useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const transformedData = transformBeforeSubmit
        ? transformBeforeSubmit(value)
        : value;
      await onSubmit(transformedData);
    },
    validators: validationSchema
      ? {
          onSubmit: ({ value }) => {
            const result = validationSchema.safeParse(value);
            return result.success ? undefined : result.error.format();
          },
          onChange: ({ value }) => {
            // Check if onChange validation is enabled
            const shouldValidate =
              typeof validateOnChange === "function"
                ? validateOnChange(value)
                : validateOnChange;

            if (shouldValidate) {
              const result = validationSchema.safeParse(value);
              return result.success ? undefined : result.error.format();
            }
            return undefined;
          },
        }
      : undefined,
  });
}
