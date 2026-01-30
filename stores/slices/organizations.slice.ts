import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Organization } from "@/types";

interface OrganizationsState {
  selectedOrgId: Organization | null;
}

const initialState: OrganizationsState = {
  selectedOrgId: null,
};

const organizationsSlice = createSlice({
  name: "organizations",
  initialState,
  reducers: {
    setSelectedOrganization: (
      state,
      action: PayloadAction<Organization | null>
    ) => {
      state.selectedOrgId = action.payload;
    },
    clearSelection: (state) => {
      state.selectedOrgId = null;
    },
  },
});

export const { setSelectedOrganization, clearSelection } =
  organizationsSlice.actions;

export default organizationsSlice.reducer;
