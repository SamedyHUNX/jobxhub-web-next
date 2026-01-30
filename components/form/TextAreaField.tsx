import { cn } from "@/lib/utils";
import { MarkdownEditor } from "../markdown/MarkdownEditor";

interface TextAreaFieldProps {
  form: any;
  name: string;
  label: string;
  description?: string;
  validator?: (value: any) => string | undefined;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  rows?: number;
}

export default function TextAreaField({
  form,
  name,
  label,
  description,
  validator,
  onChange,
  placeholder,
  disabled = false,
  className,
  rows = 4,
}: TextAreaFieldProps) {
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
          <label
            htmlFor={name}
            className="text-lg font-medium text-gray-700 tracking-tighter"
          >
            {label}
          </label>
          <div className={cn(disabled && "opacity-50 pointer-events-none")}>
            <MarkdownEditor
              markdown={field.state.value ?? ""}
              onChange={(value) => {
                field.handleChange(value);
                if (onChange) {
                  onChange(value);
                }
              }}
              className={cn("min-h-50", className)}
            />
          </div>
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
