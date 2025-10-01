import { createSlice } from "@reduxjs/toolkit";

const workspaceSlice = createSlice({
  name: "workspaces",
  initialState: {
    workspaces: null,        // للـ assigned workspaces (filtered)
    allWorkspaces: null,     // للـ modal (all workspaces)
    workspace: null,
    currentStaffId: null,
    loading: false,
    error: null
  },
  reducers: {
    setWorkspaces(state, action) {
      if (action.payload && typeof action.payload === 'object' && 'workspaces' in action.payload) {
        state.workspaces = action.payload.workspaces;
        state.currentStaffId = action.payload.staffId;
      } else {
        state.workspaces = action.payload || [];
      }
      state.loading = false;
      state.error = null;
    },
    setAllWorkspaces(state, action) {
      state.allWorkspaces = action.payload;
      state.loading = false;
      state.error = null;
    },
    setWorkspace(state, action) {
      state.workspace = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    clearWorkspaces(state) {
      state.workspaces = null;
      state.currentStaffId = null;
      state.error = null;
    },
    clearAllWorkspaces(state) {
      state.allWorkspaces = null;
    }
  }
});

const workspaceAction = workspaceSlice.actions;
const workspaceReducer = workspaceSlice.reducer;

export { workspaceAction, workspaceReducer };