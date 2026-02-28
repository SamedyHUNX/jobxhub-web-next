"use client";

import { FormField } from "@/components/FormField";
import { useAuth } from "@/hooks/use-auth";
import { forgotPasswordSchema } from "@/schemas";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import AuthLeftHeader from "@/components/AuthLeftHeader";
import { useCustomForm } from "@/hooks/use-custom-form";
import SubmitButton from "@/components/SubmitButton";
import type { ForgotPasswordFormData } from "@/types";

export default function ForgotPasswordPage() {
  // Translations
  const t = useTranslations();
  const authT = (key: string) => t(`auth.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);

  const forgotPasswordFormSchema = forgotPasswordSchema(validationT);

  const locale = useLocale();
  const { forgotPasswordMutation } = useAuth();

  const forgotPasswordForm = useCustomForm({
    defaultValues: {
      email: "",
      locale,
    },
    validationSchema: forgotPasswordFormSchema,
    onSubmit: (values: ForgotPasswordFormData) =>
      forgotPasswordMutation.mutate(values),
  });

  return (
    <div className="mx-auto space-y-8 px-4">
      {/* Header Section */}
      <AuthLeftHeader title={authT("enterYourEmail")} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          forgotPasswordForm.handleSubmit();
        }}
        className="space-y-6 w-full"
      >
        <div className="space-y-5 w-full rounded-lg bg-white dark:bg-gray-900 p-8 shadow-xl border border-gray-200 dark:border-gray-800">
          {/* Email Field */}
          <FormField
            form={forgotPasswordForm}
            name="email"
            label={authT("email")}
            type="email"
            placeholder={authT("emailPlaceholder")}
            validator={(value) => {
              const result =
                forgotPasswordFormSchema.shape.email.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0].message;
            }}
          />
        </div>

        <SubmitButton
          isSubmitting={forgotPasswordMutation.isPending}
          buttonText={authT("sendResetLink")}
        />

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
