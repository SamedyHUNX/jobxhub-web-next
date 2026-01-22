interface FormFieldProps {
  form: any;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  validator: (value: any) => string | undefined;
}

export function FormField({
  form,
  name,
  label,
  type = "text",
  placeholder,
  validator,
}: FormFieldProps) {
  return (
    <form.Field
      name={name}
      validators={{
        onChange: ({ value }: { value: any }) => validator(value),
      }}
    >
      {(field: any) => (
        <div>
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={type}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500 ${
              field.state.meta.errors.length > 0
                ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
          />
          {field.state.meta.errors.length > 0 && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              {field.state.meta.errors[0]}
            </p>
          )}
        </div>
      )}
    </form.Field>
  );
}

// Usage in your sign-in form:
// <FormField
//   form={form}
//   name="email"
//   label={authT("email")}
//   type="email"
//   placeholder={authT("emailPlaceholder")}
//   validator={(value) => {
//     const result = signInSchema.shape.email.safeParse(value);
//     return result.success ? undefined : result.error.errors[0].message;
//   }}
// />
//
// <FormField
//   form={form}
//   name="password"
//   label={authT("password")}
//   type="password"
//   placeholder={authT("passwordPlaceholder")}
//   validator={(value) => {
//     const result = signInSchema.shape.password.safeParse(value);
//     return result.success ? undefined : result.error.errors[0].message;
//   }}
// />
