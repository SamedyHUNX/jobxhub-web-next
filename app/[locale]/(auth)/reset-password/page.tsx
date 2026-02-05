"use client";

import AuthLeftHeader from "@/components/AuthLeftHeader";
import BrandLogo from "@/components/BrandLogo";
import { FormField } from "@/components/FormField";
import SubmitButton from "@/components/SubmitButton";
import { useAuth } from "@/hooks/use-auth";
import { createResetPasswordSchema } from "@/schemas";
import { useForm } from "@tanstack/react-form";
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

  const { resetPassword, isResettingPassword } = useAuth();

  // Define schema
  const resetPasswordFormSchema = createResetPasswordSchema(validationT);

  // Initialize TanStack Form
  const form = useForm({
    defaultValues: { newPassword: "", confirmNewPassword: "" },
    onSubmit: async ({ value }) => {
      resetPassword({ token, ...value });
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = resetPasswordFormSchema.safeParse(value);
        return result.success ? undefined : result.error.format();
      },
      onChange: ({ value }) => {
        // Only validate if both fields have values
        if (value.newPassword && value.confirmNewPassword) {
          const result = resetPasswordFormSchema.safeParse(value);
          return result.success ? undefined : result.error.format();
        }
        return undefined;
      },
    },
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
    <div className="mx-auto space-y-8 px-4 mt-auto max-w-4xl">
      <BrandLogo />
      <div className="pt-4">
        <AuthLeftHeader title={authT("yourNewPassword")} />
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await form.handleSubmit();
        }}
        className="space-y-6 w-full"
      >
        <div className="space-y-5 w-full rounded-lg bg-white dark:bg-gray-900 p-8 shadow-xl border border-gray-200 dark:border-gray-800">
          {/* New Password Field */}
          <FormField
            form={form}
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
            form={form}
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
          isCreating={isResettingPassword}
          buttonText={authT("resetPassword")}
        />
      </form>
    </div>
  );
}
