import type { User } from "@/types/user.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: User | undefined;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: undefined,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User | undefined }>) => {
      state.user = action.payload.user;
      state.isInitialized = true;
    },
    clearAuth: (state) => {
      state.user = undefined;
      state.isInitialized = true;
    },
    markInitialized: (state) => {
      state.isInitialized = true;
    },
  },
});

export const { setAuth, clearAuth, markInitialized } = authSlice.actions;
export default authSlice.reducer;
