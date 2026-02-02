import { authApi } from "@/lib/apis/auth-api";
import { extractErrorMessage } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { clearAuth } from "@/stores/slices/auth.slice";
import {
  ForgotPasswordResponse,
  ResetPasswordResponse,
  ResetPasswordVariables,
  SignInFormData,
  SignInResponse,
  SignUpFormData,
  SignUpResponse,
  VerifyEmailResponse,
} from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
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
  const signInMutation = useMutation<
    SignInResponse,
    AxiosError,
    SignInFormData
  >({
    mutationFn: (credentials) => authApi.signIn(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"], exact: true });
      toast.success(successT("signInSuccess"));
      router.push(`/${locale}`);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, errorT));
    },
  });

  // Sign up mutation
  const signUpMutation = useMutation<
    SignUpResponse,
    AxiosError,
    { formData: SignUpFormData; locale: string }
  >({
    mutationFn: ({ formData, locale }) => authApi.signUp(formData, locale),
    onSuccess: () => {
      toast.success(successT("signUpSuccess"));
      router.push(`/${locale}/sign-in`);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, errorT));
    },
  });

  // Verify email mutation
  const verifyEmailMutation = useMutation<
    VerifyEmailResponse,
    AxiosError,
    string
  >({
    mutationFn: (token) => authApi.verifyEmail(token),
    onSuccess: () => {
      toast.success(successT("verifyEmailSuccess"));
      router.push(`/${locale}/sign-in`);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, errorT));
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation<
    ForgotPasswordResponse,
    AxiosError,
    { email: string; locale: string }
  >({
    mutationFn: ({ email, locale }) => authApi.forgotPassword(email, locale),
    onSuccess: (_, variables) => {
      toast.success(successT("forgotPasswordSuccess"));
      router.push(
        `/${locale}/forgot-password/email-sent?email=${encodeURIComponent(
          variables.email
        )}`
      );
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, errorT));
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation<
    ResetPasswordResponse, // mutation result type
    AxiosError, // error type
    ResetPasswordVariables // variables type
  >({
    mutationFn: ({ token, newPassword, confirmNewPassword }) =>
      authApi.resetPassword(token, newPassword, confirmNewPassword),
    onSuccess: () => {
      toast.success(successT("resetPasswordSuccess"));
      router.push(`/${locale}/sign-in`);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, errorT));
    },
  });

  // Sign out
  const signOut = async () => {
    localStorage.removeItem("selectedOrganization");
    try {
      await authApi.signOut();

      dispatch(clearAuth());
      queryClient.clear();

      router.push(`/${locale}/sign-in`);
    } catch (error) {
      console.error("Sign out failed:", error);
      dispatch(clearAuth());
      queryClient.clear();
      router.push(`/${locale}/sign-in`);
    }
  };

  return {
    // Auth state
    user,
    isInitialized,

    // Sign in
    signIn: signInMutation.mutate,
    isSigningIn: signInMutation.isPending,

    // Sign up
    signUp: signUpMutation.mutate,
    isSigningUp: signUpMutation.isPending,

    // Verify email
    verifyEmail: verifyEmailMutation.mutate,
    isVerifyingEmail: verifyEmailMutation.isPending,
    verifyEmailError: verifyEmailMutation.error as AxiosError,
    verifyEmailSuccess: verifyEmailMutation.isSuccess,
    verifyEmailData: verifyEmailMutation.data,

    // Forgot password
    forgotPassword: forgotPasswordMutation.mutate,
    isRequestingForgotPassword: forgotPasswordMutation.isPending,

    // Reset password
    resetPassword: resetPasswordMutation.mutate,
    isResettingPassword: resetPasswordMutation.isPending,

    // Sign Out
    signOut,
  };
}
