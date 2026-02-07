import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

interface TextFieldProps {
  form: any;
  name: string;
  label: string;
  description?: string;
  validator?: (value: any) => string | undefined;
  onChange?: (value: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function TextField({
  form,
  name,
  label,
  description,
  validator,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
  className,
}: TextFieldProps) {
  return (
    <form.Field
      name={name}
      validators={{
        onChange: validator
          ? ({ value }: { value: any }) => validator(value)
          : undefined,
      }}
    >
      {(field: any) => (
        <div className="space-y-2">
          <Label
            htmlFor={name}
            className="text-lg font-medium text-gray-700 tracking-tighter"
          >
            {label}
          </Label>
          <input
            id={name}
            type={type}
            value={field.state.value ?? ""}
            onChange={(e) => {
              field.handleChange(e.target.value);
              if (onChange) {
                onChange(e.target.value);
              }
            }}
            onBlur={field.handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",
              field.state.meta.errors.length > 0 &&
                "border-red-500 focus:ring-red-500",
              disabled && "opacity-50 cursor-not-allowed",
              className,
            )}
          />
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
          {field.state.meta.errors.length > 0 && (
            <p className="text-sm text-red-500">{field.state.meta.errors[0]}</p>
          )}
        </div>
      )}
    </form.Field>
  );
}
