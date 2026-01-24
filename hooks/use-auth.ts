import { authApi } from "@/lib/auth-api";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { ResetPasswordFormData, SignInFormData, SignUpFormData } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isInitialized } = useAppSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: async (credentials: SignInFormData) => {
      await authApi.signIn(credentials);
    },
    onSuccess: async () => {
      // Invalidate and WAIT for the profile to be refetched
      await queryClient.invalidateQueries({ queryKey: ["profile"] });

      // Ensure the profile query has completed and Redux is updated
      await queryClient.refetchQueries({ queryKey: ["profile"] });

      // Redux state should be ready
      // router.push(`/${locale}`);
    },
    onError: (error) => {
      console.error("Sign in failed:", error);
    },
  });

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: ({
      formData,
      locale,
    }: {
      formData: SignUpFormData;
      locale: string;
    }) => authApi.signUp(formData, locale),
    onSuccess: () => {
      router.push(`/${locale}/sign-in`);
    },
  });

  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: () => {
      router.push("/sign-in");
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: ({ email, locale }: { email: string; locale: string }) =>
      authApi.forgotPassword(email, locale),
    onSuccess: (_, variables) => {
      router.push(
        `/forgot-password/email-sent?email=${encodeURIComponent(
          variables.email
        )}`
      );
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: ({
      token,
      newPassword,
      confirmNewPassword,
    }: { token: string } & ResetPasswordFormData) =>
      authApi.resetPassword(token, newPassword, confirmNewPassword),
    onSuccess: () => {
      router.push(`/${locale}/sign-in`);
    },
  });

  return {
    // State
    user,
    isInitialized,

    // Sign in
    signIn: signInMutation.mutate,
    isSigningIn: signInMutation.isPending,
    signInError: signInMutation.error as AxiosError,
    signInSuccess: signInMutation.isSuccess,
    signInData: signInMutation.data,

    // Sign up
    signUp: signUpMutation.mutate,
    isSigningUp: signUpMutation.isPending,
    signUpError: signUpMutation.error as AxiosError,
    signUpSuccess: signUpMutation.isSuccess,
    signUpData: signUpMutation.data,

    // Verify email
    verifyEmail: verifyEmailMutation.mutate,
    isVerifyingEmail: verifyEmailMutation.isPending,
    verifyEmailError: verifyEmailMutation.error as AxiosError,
    verifyEmailSuccess: verifyEmailMutation.isSuccess,
    verifyEmailData: verifyEmailMutation.data,

    // Forgot password
    forgotPassword: forgotPasswordMutation.mutate,
    isRequestingForgotPassword: forgotPasswordMutation.isPending,
    forgotPasswordError: forgotPasswordMutation.error as AxiosError,
    forgotPasswordSuccess: forgotPasswordMutation.isSuccess,
    forgotPasswordData: forgotPasswordMutation.data,

    // Reset password
    resetPassword: resetPasswordMutation.mutate,
    isResettingPassword: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error as AxiosError,
    resetPasswordSuccess: resetPasswordMutation.isSuccess,
  };
}
