"use client";

import { useAuth } from "@/hooks/use-auth";
import { useTranslations } from "next-intl";
import { createSignInSchema } from "@/schemas";
import { FormField } from "@/components/FormField";
import Link from "next/link";
import AuthLeftHeader from "@/components/AuthLeftHeader";
import SubmitButton from "@/components/SubmitButton";
import { useCustomForm } from "@/hooks/use-custom-form";
import type { SignInFormData } from "@/types";

export default function SignInPage() {
  // Translations
  const t = useTranslations();
  const authT = (key: string) => t(`auth.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);

  const { signIn, isSigningIn } = useAuth();

  const signInSchema = createSignInSchema(validationT);

  const signInForm = useCustomForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validationSchema: signInSchema,
    onSubmit: (formData: SignInFormData) => signIn(formData),
  });

  return (
    <div className="mx-auto space-y-8 px-4">
      {/* Header Section */}
      <AuthLeftHeader title={authT("signInToAccount")} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          signInForm.handleSubmit();
        }}
        className="space-y-6 w-full"
      >
        <div className="space-y-5 w-full rounded-lg bg-white dark:bg-gray-900 p-8 shadow-xl border border-gray-200 dark:border-gray-800">
          {/* Email Field */}
          <FormField
            form={signInForm}
            name="email"
            label={authT("email")}
            type="email"
            placeholder={authT("emailPlaceholder")}
            validator={(value) => {
              const result = signInSchema.shape.email.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0].message;
            }}
          />

          {/* Password Field */}
          <FormField
            form={signInForm}
            name="password"
            label={authT("password")}
            type="password"
            placeholder={authT("passwordPlaceholder")}
            validator={(value) => {
              const result = signInSchema.shape.password.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0].message;
            }}
          />

          <div className="flex items-center justify-between pt-1">
            <Link
              href={`/forgot-password`}
              className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
            >
              {authT("forgotPassword")}
            </Link>
          </div>
        </div>

        <SubmitButton isSubmitting={isSigningIn} buttonText={authT("signIn")} />

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {authT("dontHaveAnAccount")}{" "}
            <Link
              href={`/sign-up`}
              className="font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
            >
              {authT("signUp")}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
