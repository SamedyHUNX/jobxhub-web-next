// interface FormFieldProps {
//   form: any;
//   name: string;
//   label?: string;
//   type?: string;
//   placeholder?: string;
//   hideLabel?: boolean;
//   validator: (value: any) => string | undefined;
// }

// export function FormField({
//   form,
//   name,
//   label,
//   type = "text",
//   placeholder,
//   validator,
//   hideLabel = false,
// }: FormFieldProps) {
//   return (
//     <form.Field
//       name={name}
//       validators={{
//         onChange: ({ value }: { value: any }) => validator(value),
//       }}
//     >
//       {(field: any) => (
//         <div>
//           <label
//             htmlFor={field.name}
//             className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${
//               hideLabel ? "sr-only" : ""
//             }`}
//           >
//             {label}
//           </label>
//           <input
//             id={field.name}
//             name={field.name}
//             type={type}
//             value={field.state.value}
//             onBlur={field.handleBlur}
//             aria-label={hideLabel ? label : undefined}
//             onChange={(e) => field.handleChange(e.target.value)}
//             placeholder={placeholder}
//             className={`w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500 ${
//               field.state.meta.errors.length > 0
//                 ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500"
//                 : ""
//             }`}
//           />
//           {field.state.meta.errors.length > 0 && (
//             <p className="mt-1 text-sm text-red-500 dark:text-red-400">
//               {field.state.meta.errors[0]}
//             </p>
//           )}
//         </div>
//       )}
//     </form.Field>
//   );
// }

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
            className="block text-sm font-medium text-gray-700"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-400"
          />
          {field.state.meta.errors.length > 0 && (
            <p className="text-sm text-red-500">{field.state.meta.errors[0]}</p>
          )}
        </div>
      )}
    </form.Field>
  );
}
