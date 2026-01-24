"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useAppDispatch } from "@/stores/hooks";
import { setAuth, clearAuth } from "@/stores/slices/auth.slice";
import { authApi } from "@/lib/auth-api";

export function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const isMounting = useRef(true);

  useEffect(() => {
    const initAuth = async () => {
      // Prevent double invocation in Strict Mode
      if (!isMounting.current) return;
      isMounting.current = false;

      // ALWAYS verify the session, even if we have persisted data
      // This ensures cookie and Redux state stay in sync
      try {
        const user = await authApi.getProfile();
        if (user) {
          dispatch(setAuth({ user }));
        } else {
          // No user returned, clear persisted state
          dispatch(clearAuth());
        }
      } catch (error) {
        // Failed to restore session (cookie missing/expired)
        // Clear any stale persisted data
        dispatch(clearAuth());
      }
    };

    initAuth();
  }, [dispatch]);

  return <>{children}</>;
}
