"use client";

import { useAuth } from "@/hooks/use-auth";
import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { SignInFormData } from "@/types";
import { createSignInSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/LoadingSwap";
import { extractErrorMessage } from "@/lib/utils";

export default function SignInPage() {
  // Translations
  const t = useTranslations();
  const authT = (key: string) => t(`auth.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);
  const successT = (key: string) => t(`apiSuccess.${key}`);
  const errorT = (key: string) => t(`apiError.${key}`);

  const { signIn, isSigningIn, signInError, signInSuccess } = useAuth();

  // Define schema
  const signInSchema = useMemo(
    () => createSignInSchema(validationT),
    [validationT]
  );

  // Initialize TanStack Form
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      signIn(value as SignInFormData);
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = signInSchema.safeParse(value);
        return result.success ? undefined : result.error.format();
      },
    },
  });

  useEffect(() => {
    if (signInError) {
      toast.error(extractErrorMessage(signInError, errorT));
    } else if (signInSuccess) {
      toast.success(successT("0"));
    }
  }, [signInError, signInSuccess, validationT, successT]);

  return (
    <div className="mx-auto max-w-lg space-y-8">
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
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const result = signInSchema.shape.email.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              },
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {authT("email")}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={authT("emailPlaceholder")}
                  className={`w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500 ${
                    field.state.meta.errors.length > 0
                      ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Password Field */}
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => {
                const result = signInSchema.shape.password.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              },
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {authT("password")}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={authT("passwordPlaceholder")}
                  className={`w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500 ${
                    field.state.meta.errors.length > 0
                      ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <div className="flex items-center justify-between pt-1">
            <a
              href="/auth/forgot-password"
              className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
            >
              {authT("forgotPassword")}
            </a>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSigningIn}
          className="yellow-btn w-full mt-5"
        >
          <LoadingSwap isLoading={isSigningIn}>{authT("signIn")}</LoadingSwap>
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {authT("dontHaveAnAccount")}{" "}
            <a
              href="/auth/signup"
              className="font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
            >
              {authT("signUp")}
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
