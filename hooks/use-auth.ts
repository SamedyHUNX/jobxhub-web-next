import { authApi } from "@/lib/auth-api";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { selectIsAuthenticated, setAuth } from "@/stores/slices/auth.slice";
import { AuthResponse, SignInFormData, SignUpFormData } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isInitialized } = useAppSelector((state) => state.auth);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: async (credentials: SignInFormData) => {
      const response = await authApi.signIn(credentials);
      const data: AuthResponse = response;

      if (!data.data.users || data.data.users.length === 0) {
        throw new Error("Invalid authentication response");
      }

      return data;
    },
    onSuccess: (data: AuthResponse) => {
      if (!data.data.users || data.data.users.length === 0) {
        throw new Error("Invalid authentication response");
      }

      const user = data.data.users[0];

      // Keep user info in memory (Redux)
      dispatch(setAuth({ user }));

      // The token is already stored in the HttpOnly cookie by the backend

      // Redirect after login
      router.push(`/${locale}`);
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

  return {
    // State
    user,
    isAuthenticated,
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
  };
}
