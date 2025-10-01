import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPath: 'basic-info',
  expandedSection: 'Organization'
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setCurrentPath: (state, action) => {
      state.currentPath = action.payload;
    },
    setExpandedSection: (state, action) => {
      state.expandedSection = action.payload;
    },
    navigateToPath: (state, action) => {
      const { path, section } = action.payload;
      state.currentPath = path;
      if (section) {
        state.expandedSection = section;
      }
    }
  }
});

export const { setCurrentPath, setExpandedSection, navigateToPath } = navigationSlice.actions;
export default navigationSlice.reducer; 