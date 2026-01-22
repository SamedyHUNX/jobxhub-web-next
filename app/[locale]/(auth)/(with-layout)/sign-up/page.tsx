"use client";

import { FormField } from "@/components/FormField";
import { LoadingSwap } from "@/components/LoadingSwap";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { countries } from "@/lib/constants";
import { extractErrorMessage } from "@/lib/utils";
import { createSignUpSchema } from "@/schemas";
import { useForm } from "@tanstack/react-form";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

export default function SignUpPage() {
  // Translations
  const t = useTranslations();
  const authT = (key: string) => t(`auth.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);
  const successT = (key: string) => t(`apiSuccess.${key}`);
  const errorT = (key: string) => t(`apiError.${key}`);
  const locale = useLocale();

  const { signUp, isSigningUp, signUpError, signUpSuccess } = useAuth();

  const signUpSchema = useMemo(
    () => createSignUpSchema(validationT),
    [validationT]
  );

  // Initialize Tanstack Form
  const form = useForm({
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      countryCode: "+61", // Default to Australia
      phoneNumber: "",
      dateOfBirth: "",
      image: null as File | null,
    },
    onSubmit: async ({ value }) => {
      // Combine country code with phone number
      const formData = {
        ...value,
        phoneNumber: `${value.countryCode}${value.phoneNumber}`,
      };
      signUp({ formData, locale });
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = signUpSchema.safeParse(value);
        return result.success ? undefined : result.error.format;
      },
    },
  });

  useEffect(() => {
    if (signUpError) {
      toast.error(extractErrorMessage(signUpError, errorT));
    } else if (signUpSuccess) {
      toast.success(successT("0"));
    }
  }, [signUpError, signUpSuccess, errorT, successT]);

  return (
    <div className="space-y-8 pb-8 px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6 w-full"
      >
        <div className="rounded-xl bg-white dark:bg-gray-900 p-8 shadow-xl border border-gray-200 dark:border-gray-800">
          {/* Profile Image Upload */}
          <div className="mb-8 flex justify-center">
            <form.Field
              name="image"
              validators={{
                onChange: ({ value }) => {
                  const result = signUpSchema.shape.image.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.errors[0].message;
                },
              }}
            >
              {(field: any) => (
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                      {field.state.value ? (
                        <img
                          src={URL.createObjectURL(field.state.value)}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          className="w-10 h-10 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      )}
                    </div>
                    <label
                      htmlFor="image-upload"
                      className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer shadow-lg transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) field.handleChange(file);
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {authT("uploadPhoto")}
                  </p>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          {/* Two Column Layout for Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <FormField
              form={form}
              name="firstName"
              label={authT("firstName")}
              placeholder={authT("firstNamePlaceholder")}
              validator={(value) => {
                const result = signUpSchema.shape.firstName.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              }}
            />
            <FormField
              form={form}
              name="lastName"
              label={authT("lastName")}
              placeholder={authT("lastNamePlaceholder")}
              validator={(value) => {
                const result = signUpSchema.shape.lastName.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              }}
            />
          </div>

          {/* Single Column Fields */}
          <div className="space-y-5">
            <FormField
              form={form}
              name="username"
              label={authT("username")}
              placeholder={authT("usernamePlaceholder")}
              validator={(value) => {
                const result = signUpSchema.shape.username.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              }}
            />

            <FormField
              form={form}
              name="email"
              label={authT("email")}
              type="email"
              placeholder={authT("emailPlaceholder")}
              validator={(value) => {
                const result = signUpSchema.shape.email.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              }}
            />

            <FormField
              form={form}
              name="password"
              label={authT("password")}
              type="password"
              placeholder={authT("passwordPlaceholder")}
              validator={(value) => {
                const result = signUpSchema.shape.password.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              }}
            />

            {/* Phone Number with Country Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {authT("phoneNumber")}
              </label>
              {/* Phone Number Input */}
              <div className="flex gap-3 w-full">
                <form.Field name="countryCode">
                  {(field: any) => (
                    <select
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-32 h-10.5 px-3 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:text-gray-300  dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-sm"
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                  )}
                </form.Field>
                <div className="flex-1 h-10.5">
                  <FormField
                    form={form}
                    name="phoneNumber"
                    type="tel"
                    placeholder="123456789"
                    validator={(value) => {
                      const result =
                        signUpSchema.shape.phoneNumber.safeParse(value);
                      return result.success
                        ? undefined
                        : result.error.errors[0].message;
                    }}
                    hideLabel
                  />
                </div>
              </div>
            </div>

            <FormField
              form={form}
              name="dateOfBirth"
              label={authT("dateOfBirth")}
              type="date"
              placeholder={authT("dateOfBirthPlaceholder")}
              validator={(value) => {
                const result = signUpSchema.shape.dateOfBirth.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSigningUp}
          className="yellow-btn w-full"
        >
          <LoadingSwap isLoading={isSigningUp}>{authT("signUp")}</LoadingSwap>
        </Button>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {authT("alreadyHaveAccount")}{" "}
            <a
              href="/sign-in"
              className="font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
            >
              {authT("signIn")}
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
