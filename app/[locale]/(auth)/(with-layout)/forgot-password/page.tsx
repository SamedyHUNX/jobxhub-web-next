"use client";

import { useMemo } from "react";
import { FormField } from "@/components/FormField";
import { LoadingSwap } from "@/components/LoadingSwap";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { forgotPasswordSchema } from "@/schemas";
import { useForm } from "@tanstack/react-form";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function ForgotPasswordPage() {
  // Translations
  const t = useTranslations();
  const authT = (key: string) => t(`auth.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);

  const forgotPasswordFormSchema = useMemo(
    () => forgotPasswordSchema(validationT),
    [validationT]
  );

  const locale = useLocale();
  const {
    forgotPassword,
    isRequestingForgotPassword,
  } = useAuth();

  // Initialize Transtack Form
  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      forgotPassword({ email: value.email, locale });
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = forgotPasswordFormSchema.safeParse(value);
        return result.success ? undefined : result.error.format();
      },
    },
  });

  return (
    <div className="mx-auto space-y-8 px-4">
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
              const result =
                forgotPasswordFormSchema.shape.email.safeParse(value);
              return result.success
                ? undefined
                : result.error.errors[0].message;
            }}
          />
        </div>

        <Button
          type="submit"
          disabled={isRequestingForgotPassword}
          className="yellow-btn w-full mt-5"
        >
          <LoadingSwap isLoading={isRequestingForgotPassword}>
            {authT("sendResetLink")}
          </LoadingSwap>
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {authT("rememberPassword")}{" "}
            <Link
              href="/sign-in"
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
