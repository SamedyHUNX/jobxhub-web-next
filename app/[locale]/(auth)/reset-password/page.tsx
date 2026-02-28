"use client";

import AuthLeftHeader from "@/components/AuthLeftHeader";
import BrandLogo from "@/components/BrandLogo";
import { FormField } from "@/components/FormField";
import SubmitButton from "@/components/SubmitButton";
import { useAuth } from "@/hooks/use-auth";
import { useCustomForm } from "@/hooks/use-custom-form";
import { createResetPasswordSchema } from "@/schemas";
import type { ResetPasswordVariables } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ResetPasswordPage() {
  // Translations
  const t = useTranslations();
  const authT = (key: string) => t(`auth.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);
  const router = useRouter();
  const locale = useLocale();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { resetPasswordMutation } = useAuth();

  // Define schema
  const resetPasswordFormSchema = createResetPasswordSchema(validationT);

  const resetPasswordForm = useCustomForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      token,
    },
    validationSchema: resetPasswordFormSchema,
    validateOnChange: (values) => {
      // Only validate if both fields have values
      if (!values.newPassword || !values.confirmPassword) {
        return false;
      }
      return true;
    },
    onSubmit: (values: ResetPasswordVariables) =>
      resetPasswordMutation.mutate(values),
  });

  // Redirect if no token provided
  useEffect(() => {
    if (!token) {
      router.push(`/auth/reset-password`);
    }
  }, [token, router, locale]);

  if (!token) {
    return null;
  }

  return (
    <div className="mx-auto space-y-8 px-4 mt-[25vh] max-w-4xl">
      <BrandLogo />
      <div className="pt-4">
        <AuthLeftHeader title={authT("yourNewPassword")} />
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await resetPasswordForm.handleSubmit();
        }}
        className="space-y-6 w-full"
      >
        <div className="space-y-5 w-full rounded-lg bg-white dark:bg-gray-900 p-8 shadow-xl border border-gray-200 dark:border-gray-800">
          {/* New Password Field */}
          <FormField
            form={resetPasswordForm}
            name="newPassword"
            label={authT("newPassword")}
            type="password"
            placeholder={authT("newPasswordPlaceholder")}
            validator={(value) => {
              const result =
                resetPasswordFormSchema.shape.newPassword.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0].message;
            }}
          />

          <FormField
            form={resetPasswordForm}
            name="confirmNewPassword"
            label={authT("confirmNewPassword")}
            type="password"
            placeholder={authT("confirmNewPasswordPlaceholder")}
            validator={(value) => {
              const result =
                resetPasswordFormSchema.shape.confirmNewPassword.safeParse(
                  value,
                );
              return result.success
                ? undefined
                : result.error.issues[0].message;
            }}
          />
        </div>

        <SubmitButton
          isSubmitting={resetPasswordMutation.isPending}
          buttonText={authT("resetPassword")}
        />
      </form>
    </div>
  );
}
