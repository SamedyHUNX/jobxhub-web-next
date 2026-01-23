"use client";

import { FormField } from "@/components/FormField";
import { LoadingSwap } from "@/components/LoadingSwap";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { extractErrorMessage } from "@/lib/utils";
import { createResetPasswordSchema } from "@/schemas";
import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { z } from "zod";

export default function ResetPasswordPage() {
  // Translations
  const t = useTranslations();
  const authT = (key: string) => t(`auth.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);
  const successT = (key: string) => t(`apiSuccess.${key}`);
  const errorT = (key: string) => t(`apiError.${key}`);

  const searchParams = useSearchParams();
  const token = searchParams.get("token") as string;

  const {
    resetPassword,
    isResettingPassword,
    resetPasswordError,
    resetPasswordSuccess,
  } = useAuth();

  // Define schema
  const resetPasswordFormSchema = useMemo(
    () => createResetPasswordSchema(validationT),
    [validationT]
  );

  // Initialize TanStack Form
  const form = useForm({
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    onSubmit: async ({ value: { newPassword, confirmNewPassword } }) => {
      resetPassword({ token, newPassword, confirmNewPassword });
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = resetPasswordFormSchema.safeParse(value);
        return result.success ? undefined : result.error.format();
      },
    },
  });

  useEffect(() => {
    if (resetPasswordError) {
      toast.error(extractErrorMessage(resetPasswordError, errorT));
    } else if (resetPasswordSuccess) {
      toast.success(successT("0"));
    }
  }, [resetPasswordError, resetPasswordSuccess, errorT, successT]);

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
          {/* New Password Field */}
          <FormField
            form={form}
            name="newPassword"
            label={authT("newPassword")}
            type="password"
            placeholder={authT("newPasswordPlaceholder")}
            validator={(value) => {
              const schema = z
                .string()
                .min(8, validationT("passwordMinLength"))
                .regex(/[A-Z]/, validationT("passwordUppercase"))
                .regex(/[a-z]/, validationT("passwordLowercase"))
                .regex(/[0-9]/, validationT("passwordNumber"));

              const result = schema.safeParse(value);
              return result.success
                ? undefined
                : result.error.errors[0].message;
            }}
          />

          <FormField
            form={form}
            name="confirmNewPassword"
            label={authT("confirmNewPassword")}
            type="password"
            placeholder={authT("confirmNewPasswordPlaceholder")}
            validator={(value) => {
              const schema = z
                .string()
                .min(1, validationT("confirmPasswordRequired"));
              const result = schema.safeParse(value);
              return result.success
                ? undefined
                : result.error.errors[0].message;
            }}
          />
        </div>

        <Button
          type="submit"
          disabled={isResettingPassword}
          className="yellow-btn w-full mt-5"
        >
          <LoadingSwap isLoading={isResettingPassword}>
            {authT("resetPassword")}
          </LoadingSwap>
        </Button>
      </form>
    </div>
  );
}
