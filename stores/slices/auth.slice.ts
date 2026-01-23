import { User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/stores/stores";

interface AuthState {
  user: User | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isInitialized = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isInitialized = true;
    },
    markInitialized: (state) => {
      state.isInitialized = true;
    },
  },
});

export const { setAuth, clearAuth, markInitialized } = authSlice.actions;

export const selectIsAuthenticated = (state: RootState) => !!state.auth.user;

export default authSlice.reducer;
