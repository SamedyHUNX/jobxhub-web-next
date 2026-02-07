import { useForm } from "@tanstack/react-form";

interface FormConfig<T> {
  defaultValues: T;
  onSubmit: (value: T) => void | Promise<void>;
  validationSchema?: any;
  transformBeforeSubmit?: (value: T) => any;
}

export function useCustomForm<T>({
  defaultValues,
  onSubmit,
  validationSchema,
  transformBeforeSubmit,
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
        }
      : undefined,
  });
}
