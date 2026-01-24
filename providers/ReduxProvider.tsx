"use client";

import { persistor, store } from "@/stores/stores";
import { Provider } from "react-redux";
import { AuthInitializer } from "@/components/AuthInitializer";
import { PersistGate } from "redux-persist/integration/react";
import { ReactNode } from "react";

export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthInitializer>{children}</AuthInitializer>
      </PersistGate>
    </Provider>
  );
}
