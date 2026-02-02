import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SelectFieldProps {
  form: any;
  name: string;
  label: string;
  description?: string;
  validator?: (value: any) => string | undefined;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  clearLabel?: string;
  className?: string;
}

export default function SelectField({
  form,
  name,
  label,
  description,
  validator,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
  allowClear = false,
  clearLabel = "None",
  className,
}: SelectFieldProps) {
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
          <Select
            value={field.state.value ?? ""}
            onValueChange={(val) => {
              const newValue = val === "___CLEAR___" ? null : val;
              field.handleChange(newValue);
              if (onChange) {
                onChange(newValue!);
              }
            }}
            disabled={disabled}
          >
            <SelectTrigger className={cn("w-full", className)}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {allowClear && field.state.value != null && (
                <SelectItem
                  value="___CLEAR___"
                  className="text-muted-foreground"
                >
                  {clearLabel}
                </SelectItem>
              )}
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
