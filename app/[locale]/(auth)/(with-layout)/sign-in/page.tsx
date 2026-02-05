"use client";

import { useAuth } from "@/hooks/use-auth";
import { useForm } from "@tanstack/react-form";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { SignInFormData } from "@/types";
import { createSignInSchema } from "@/schemas";
import { FormField } from "@/components/FormField";
import Link from "next/link";
import AuthLeftHeader from "@/components/AuthLeftHeader";
import SubmitButton from "@/components/SubmitButton";

export default function SignInPage() {
  // Translations
  const t = useTranslations();
  const authT = (key: string) => t(`auth.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);

  const locale = useLocale();

  const { signIn, isSigningIn } = useAuth();

  // Define schema
  const signInSchema = useMemo(
    () => createSignInSchema(validationT),
    [validationT],
  );

  // Initialize TanStack Form
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: ({ value }: { value: SignInFormData }) => {
      signIn(value);
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = signInSchema.safeParse(value);
        return result.success ? undefined : result.error.format();
      },
    },
  });

  return (
    <div className="mx-auto space-y-8 px-4">
      {/* Header Section */}
      <AuthLeftHeader title={authT("signInToAccount")} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6 w-full"
      >
        <div className="space-y-5 w-full rounded-lg bg-white dark:bg-gray-900 p-8 shadow-xl border border-gray-200 dark:border-gray-800">
          {/* Email Field */}
          <FormField
            form={form}
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
            form={form}
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
              href={`/${locale}/forgot-password`}
              className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
            >
              {authT("forgotPassword")}
            </Link>
          </div>
        </div>

        <SubmitButton isCreating={isSigningIn} buttonText={authT("signIn")} />

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
