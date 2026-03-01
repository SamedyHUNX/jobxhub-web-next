"use client";

import AuthLeftHeader from "@/components/AuthLeftHeader";
import { FormField } from "@/components/FormField";
import ProfileImage from "@/components/ProfileImage";
import SubmitButton from "@/components/SubmitButton";
import { useAuth } from "@/hooks/use-auth";
import { useCustomForm } from "@/hooks/use-custom-form";
import { countries } from "@/lib/constants";
import { createSignUpSchema } from "@/schemas";
import type { SignUpFormData } from "@/types/auth.types";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function SignUpPage() {
  // Translations
  const t = useTranslations();
  const authT = (key: string) => t(`auth.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);
  const locale = useLocale();

  const { signUpMutation } = useAuth();

  const signUpSchema = createSignUpSchema(validationT);

  const signUpForm = useCustomForm({
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      countryCode: "+61",
      phoneNumber: "",
      dateOfBirth: "",
      locale,
      image: null as File | null,
    },
    validationSchema: signUpSchema,
    validateOnChange: (values) => {
      // Only validate if both fields have values
      if (!values.password || !values.confirmPassword) {
        return false;
      }
      return true;
    },
    transformBeforeSubmit: (values) => ({
      ...values,
      phoneNumber: `${values.countryCode}${values.phoneNumber}`,
    }),
    onSubmit: (signUpFormData: SignUpFormData) => {
      signUpMutation.mutate(signUpFormData);
    },
  });

  return (
    <div className="space-y-8 pb-8 px-4">
      {/* Header Section */}
      <AuthLeftHeader title={authT("signUpToProceed")} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          signUpForm.handleSubmit();
        }}
        className="space-y-6 w-full"
      >
        <div className="rounded-xl bg-white dark:bg-gray-900 p-8 shadow-xl border border-gray-200 dark:border-gray-800">
          {/* Profile Image Upload */}
          <div className="mb-8 flex justify-center">
            <signUpForm.Field
              name="image"
              validators={{
                onChange: ({ value }) => {
                  const result = signUpSchema.shape.image.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0].message;
                },
              }}
            >
              {(field: any) => (
                <ProfileImage
                  value={field.state.value}
                  onChange={(file) => field.handleChange(file)}
                  label={authT("uploadPhoto")}
                  error={field.state.meta.errors[0]}
                  size="md"
                  editable={true}
                />
              )}
            </signUpForm.Field>
          </div>

          {/* Two Column Layout for Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <FormField
              form={signUpForm}
              name="firstName"
              label={authT("firstName")}
              placeholder={authT("firstNamePlaceholder")}
              validator={(value) => {
                const result = signUpSchema.shape.firstName.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              }}
            />
            <FormField
              form={signUpForm}
              name="lastName"
              label={authT("lastName")}
              placeholder={authT("lastNamePlaceholder")}
              validator={(value) => {
                const result = signUpSchema.shape.lastName.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              }}
            />
          </div>

          {/* Single Column Fields */}
          <div className="space-y-5">
            <FormField
              form={signUpForm}
              name="username"
              label={authT("username")}
              placeholder={authT("usernamePlaceholder")}
              validator={(value) => {
                const result = signUpSchema.shape.username.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              }}
            />

            <FormField
              form={signUpForm}
              name="email"
              label={authT("email")}
              type="email"
              placeholder={authT("emailPlaceholder")}
              validator={(value) => {
                const result = signUpSchema.shape.email.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              }}
            />

            <FormField
              form={signUpForm}
              name="password"
              label={authT("password")}
              type="password"
              placeholder={authT("passwordPlaceholder")}
              validator={(value) => {
                const result = signUpSchema.shape.password.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              }}
            />

            <FormField
              form={signUpForm}
              name="confirmPassword"
              label={authT("confirmPassword")}
              type="password"
              placeholder={authT("confirmPasswordPlaceholder")}
              validator={(value) => {
                const result =
                  signUpSchema.shape.confirmPassword.safeParse(value);
                if (!result.success) {
                  return result.error.issues[0].message;
                }

                // Check if passwords match
                const passwordValue = signUpForm.getFieldValue("password");
                if (value && passwordValue && value !== passwordValue) {
                  return validationT("passwordsDoNotMatch");
                }

                return undefined;
              }}
            />

            {/* Phone Number with Country Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {authT("phoneNumber")}
              </label>
              {/* Phone Number Input */}
              <div className="flex gap-3 w-full">
                <signUpForm.Field name="countryCode">
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
                </signUpForm.Field>
                <div className="flex-1 h-10.5">
                  <FormField
                    label=""
                    form={signUpForm}
                    name="phoneNumber"
                    type="tel"
                    placeholder="123456789"
                    validator={(value) => {
                      const result =
                        signUpSchema.shape.phoneNumber.safeParse(value);
                      return result.success
                        ? undefined
                        : result.error.issues[0].message;
                    }}
                  />
                </div>
              </div>
            </div>

            <FormField
              form={signUpForm}
              name="dateOfBirth"
              label={authT("dateOfBirth")}
              type="date"
              placeholder={authT("dateOfBirthPlaceholder")}
              validator={(value) => {
                const result = signUpSchema.shape.dateOfBirth.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <SubmitButton
          isSubmitting={signUpMutation.isPending}
          buttonText={authT("signUp")}
        />

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {authT("alreadyHaveAccount")}{" "}
            <Link
              href={"/sign-in"}
              className="font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
            >
              {authT("signIn")}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
