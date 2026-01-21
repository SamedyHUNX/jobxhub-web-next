import { authApi } from "@/lib/auth-api";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { selectIsAuthenticated, setAuth } from "@/stores/slices/auth.slice";
import { AuthResponse, SignInFormData } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, token, isInitialized } = useAppSelector((state) => state.auth);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: (data: SignInFormData) => authApi.signIn(data),
    onSuccess: ({ data }: AuthResponse) => {
      const user = data.users[0];
      dispatch(setAuth({ token: user.token, user }));
      localStorage.setItem("access_token", user.token);
      router.push(`/${locale}`);
    },
  });

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: ({
      formData,
      locale,
    }: {
      formData: FormData;
      locale: string;
    }) => authApi.signUp(formData, locale),
    onSuccess: () => {
      router.push("/auth/signin");
    },
  });

  return {
    // State
    user,
    token,
    isAuthenticated,
    isInitialized,

    // Sign in
    signIn: signInMutation.mutate,
    isSigningIn: signInMutation.isPending,
    signInError: signInMutation.error,
    signInSuccess: signInMutation.isSuccess,
    signInData: signInMutation.data,

    // Sign up
    signUp: signUpMutation.mutate,
    isSigningUp: signUpMutation.isPending,
    signUpError: signUpMutation.error,
    signUpSuccess: signUpMutation.isSuccess,
    signUpData: signUpMutation.data,
  };
}
