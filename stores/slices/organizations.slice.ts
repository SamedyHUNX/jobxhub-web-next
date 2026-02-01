import { Organization } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrentOrgState {
  selectedOrgId: string | undefined;
}

const initialState: CurrentOrgState = {
  selectedOrgId: undefined,
};

const organizationsSlice = createSlice({
  name: "organizations",
  initialState,
  reducers: {
    setSelectedOrgId: (state, action: PayloadAction<string | undefined>) => {
      state.selectedOrgId = action.payload;
    },
    clearSelection: (state) => {
      state.selectedOrgId = undefined;
    },
  },
});

export const { setSelectedOrgId, clearSelection } = organizationsSlice.actions;

export default organizationsSlice.reducer;
