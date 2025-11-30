import { createSlice } from "@reduxjs/toolkit";

const workspaceSlice = createSlice({
  name: "workspaces",
  initialState: {
    workspaces: null,
    allWorkspaces: null,
    availableStForWorkS: null,
    availableResourcesForWorkS: null,
    availableInterviewsForWorkS: null,
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
    setAvailableStForWorkS(state, action) {
      state.availableStForWorkS = action.payload;
      state.loading = false;
      state.error = null;
    },
    setAvailableResourcesForWorkS(state, action) {
      state.availableResourcesForWorkS = action.payload;
      state.loading = false;
      state.error = null;
    },
    setAvailableInterviewsForWorkS(state, action) {
      state.availableInterviewsForWorkS = action.payload;
      state.loading = false;
      state.error = null;
    },

    updateWorkspaceInList(state, action) {
      const updatedWorkspace = action.payload;
      
      if (Array.isArray(state.allWorkspaces)) {
        const index = state.allWorkspaces.findIndex(
          ws => ws.id === updatedWorkspace.id
        );
        if (index !== -1) {
          state.allWorkspaces[index] = {
            ...state.allWorkspaces[index],
            ...updatedWorkspace
          };
        }
      }
      
      // تحديث في workspaces
      if (Array.isArray(state.workspaces)) {
        const index = state.workspaces.findIndex(
          ws => ws.id === updatedWorkspace.id
        );
        if (index !== -1) {
          state.workspaces[index] = {
            ...state.workspaces[index],
            ...updatedWorkspace
          };
        }
      }
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
    },
    addWorkspaceToList(state, action) {
    if (action.payload) {
      if (Array.isArray(state.allWorkspaces)) {
        state.allWorkspaces.push(action.payload);
      }
      if (Array.isArray(state.workspaces)) {
        state.workspaces.push(action.payload);
      }
    }
  },
  
  removeWorkspaceFromList(state, action) {
    const workspaceId = action.payload;
    if (Array.isArray(state.allWorkspaces)) {
      state.allWorkspaces = state.allWorkspaces.filter(ws => ws.id !== workspaceId);
    }
    if (Array.isArray(state.workspaces)) {
      state.workspaces = state.workspaces.filter(ws => ws.id !== workspaceId);
    }
  },
  }
});

const workspaceAction = workspaceSlice.actions;
const workspaceReducer = workspaceSlice.reducer;

export { workspaceAction, workspaceReducer };