import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface JobListingsState {
  selectedJobListingId: string | null;
}

const initialState: JobListingsState = {
  selectedJobListingId: null,
};

const jobListingsSlice = createSlice({
  name: "jobListings",
  initialState,
  reducers: {
    setSelectedJobListing: (state, action: PayloadAction<string | null>) => {
      state.selectedJobListingId = action.payload;
    },
    clearSelection: (state) => {
      state.selectedJobListingId = null;
    },
  },
});

export const { setSelectedJobListing, clearSelection } =
  jobListingsSlice.actions;

export default jobListingsSlice.reducer;
