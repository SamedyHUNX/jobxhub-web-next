"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setAuth, markInitialized } from "@/stores/slices/auth.slice";
import { authApi } from "@/lib/auth-api";

export function AuthInitializer({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    const { isInitialized } = useAppSelector((state) => state.auth);
    const isMounting = useRef(true);

    useEffect(() => {
        const initAuth = async () => {
            // Prevent double invocation in Strict Mode
            if (!isMounting.current) return;
            isMounting.current = false;

            if (isInitialized) return;

            try {
                const user = await authApi.getProfile();
                if (user) {
                    dispatch(setAuth({ user }));
                } else {
                    dispatch(markInitialized());
                }
            } catch (error) {
                // Failed to restore session (e.g., no cookie or expired)
                dispatch(markInitialized());
            }
        };

        initAuth();
    }, [dispatch, isInitialized]);

    return <>{children}</>;
}
