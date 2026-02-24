import { createElement } from "react";
import { Label } from "./ui/label";

interface FormFieldProps {
  form: any;
  name: string;
  label: string;
  validator: (value: any) => string | undefined;
  onChange?: (value: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  description?: string;
}

export function FormField({
  form,
  name,
  label,
  validator,
  onChange,
  type = "text",
  placeholder,
  component,
  disabled,
  className,
  description,
}: FormFieldProps & { component?: React.ComponentType<any> }) {
  return (
    <form.Field
      name={name}
      validators={{
        onChange: ({ value }: { value: any }) => validator(value),
      }}
    >
      {(field: any) => (
        <div className={`space-y-2 ${className}`}>
          <Label htmlFor={name} className="tracking-tighter">
            {label}
          </Label>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
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
              disabled={disabled}
              onChange={(e) => {
                field.handleChange(e.target.value);
                if (onChange) onChange(e.target.value);
              }}
              onBlur={field.handleBlur}
              placeholder={placeholder}
              className={`w-full px-3 py-2 border border-gray-400 rounded-xl h-14 ${
                field.state.meta.errors.length > 0
                  ? "border-red-500 border-2"
                  : ""
              }`}
            />
          )}
          {field.state.meta.errors.length > 0 && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {field.state.meta.errors[0]}
            </p>
          )}
        </div>
      )}
    </form.Field>
  );
}
