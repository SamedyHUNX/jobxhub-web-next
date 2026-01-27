interface FormFieldProps {
  form: any;
  name: string;
  label: string;
  validator: (value: any) => string | undefined;
  onChange?: (value: string) => void;
  type?: string;
  placeholder?: string;
}

export function FormField({
  form,
  name,
  label,
  validator,
  onChange,
  type = "text",
  placeholder,
}: FormFieldProps) {
  return (
    <form.Field
      name={name}
      validators={{
        onChange: ({ value }: { value: any }) => validator(value),
      }}
    >
      {(field: any) => (
        <div className="space-y-2">
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            {label}
          </label>
          <input
            id={name}
            type={type}
            value={field.state.value}
            onChange={(e) => {
              field.handleChange(e.target.value);
              if (onChange) {
                onChange(e.target.value);
              }
            }}
            onBlur={field.handleBlur}
            placeholder={placeholder}
            className={`w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500 ${
              field.state.meta.errors.length > 0
                ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
          />
        </div>
      )}
    </form.Field>
  );
}
