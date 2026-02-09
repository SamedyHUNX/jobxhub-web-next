import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import orgsReducer from "./slices/organizations.slice";
import jobListingsReducer from "./slices/job-listings.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    organizations: orgsReducer,
    jobListings: jobListingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
