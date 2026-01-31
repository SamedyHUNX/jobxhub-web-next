import { createElement } from "react";

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
  component, // Add this prop
}: FormFieldProps & { component?: React.ComponentType<any> }) {
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
          {component ? (
            createElement(component, {
              ...field,
              markdown: field.state.value,
              onChange: (value: string) => {
                field.handleChange(value);
                if (onChange) onChange(value);
              },
              className: "min-h-[200px]",
            })
          ) : (
            <input
              id={name}
              type={type}
              value={field.state.value}
              onChange={(e) => {
                field.handleChange(e.target.value);
                if (onChange) onChange(e.target.value);
              }}
              onBlur={field.handleBlur}
              placeholder={placeholder}
              className="w-full px-3 py-2 rounded-md..."
            />
          )}
        </div>
      )}
    </form.Field>
  );
}
