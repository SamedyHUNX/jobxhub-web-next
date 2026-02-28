import { authApi } from "@/lib/apis/auth-api";
import { extractErrorMessage } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { clearAuth } from "@/stores/slices/auth.slice";
import {
  AuthResponse,
  ForgotPasswordFormData,
  ResetPasswordVariables,
  SignInFormData,
  SignUpFormData,
} from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

export function useAuth() {
  const successT = useTranslations("apiSuccesses");
  const errorT = useTranslations("apiErrors");
  const dispatch = useAppDispatch();
  const { user, isInitialized } = useAppSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();

  // Sign in mutation
  // (data, error, variable)
  const signInMutation = useMutation<AuthResponse, AxiosError, SignInFormData>({
    mutationFn: (credentials) => authApi.signIn(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(successT("signInSuccess"));
      router.push("/");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, errorT));
    },
  });

  // Sign up mutation
  const signUpMutation = useMutation<AuthResponse, AxiosError, SignUpFormData>({
    mutationFn: (signUpFormData) => authApi.signUp(signUpFormData),
    onSuccess: () => {
      toast.success(successT("signUpSuccess"));
      router.push("/sign-in");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, errorT));
    },
  });

  // Verify email mutation
  const verifyEmailMutation = useMutation<AuthResponse, AxiosError, string>({
    mutationFn: (token) => authApi.verifyEmail(token),
    onSuccess: () => {
      toast.success(successT("verifyEmailSuccess"));
      router.push("/sign-in");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, errorT));
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation<
    AuthResponse,
    AxiosError,
    ForgotPasswordFormData
  >({
    mutationFn: (forgotPasswordFormData) =>
      authApi.forgotPassword(forgotPasswordFormData),
    onSuccess: (_, variables) => {
      toast.success(successT("forgotPasswordSuccess"));
      router.push(
        `/${locale}/forgot-password/email-sent?email=${encodeURIComponent(
          variables.email,
        )}`,
      );
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, errorT));
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation<
    AuthResponse, // mutation result type
    AxiosError, // error type
    ResetPasswordVariables // variables type
  >({
    mutationFn: (resetPasswordVariables) =>
      authApi.resetPassword(resetPasswordVariables),
    onSuccess: () => {
      toast.success(successT("resetPasswordSuccess"));
      router.push("/sign-in");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, errorT));
    },
  });

  // Sign out
  const signOut = useCallback(async () => {
    localStorage.removeItem("selectedOrganization");
    try {
      await authApi.signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      dispatch(clearAuth());
      queryClient.clear();
      router.push("/sign-in");
    }
  }, [dispatch, queryClient, router]);

  return {
    // Auth state
    user,
    isInitialized,

    // Sign in
    signInMutation,

    // Sign up
    signUpMutation,

    // Verify email
    verifyEmailMutation,

    // Forgot password
    forgotPasswordMutation,

    // Reset password
    resetPasswordMutation,

    // Sign Out
    signOut,
  };
}
