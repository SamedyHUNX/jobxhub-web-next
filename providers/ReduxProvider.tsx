"use client";

import { store } from "@/stores/stores";
import { Provider } from "react-redux";
import { AuthInitializer } from "@/components/AuthInitializer";
import { ReactNode } from "react";

export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
