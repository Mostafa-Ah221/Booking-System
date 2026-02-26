import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "themes",
  initialState: {
    themes: [],
    theme: null,
    loading: false,
    error: null,
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null; // امسح الـ error لما تبدأ loading جديد
      }
    },

    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },

    setThemes(state, action) {
      const incomingData = action.payload;

      if (Array.isArray(incomingData)) {
        state.themes = incomingData;
      } else if (incomingData?.themes && Array.isArray(incomingData.themes)) {
        state.themes = incomingData.themes;
      } else if (incomingData?.data && Array.isArray(incomingData.data)) {
        state.themes = incomingData.data;
      } else {
        console.warn("Unexpected themes data:", incomingData);
        state.themes = [];
      }
      state.loading = false;
      state.error = null;
    },

    setTheme(state, action) {
      state.theme = action.payload;
      state.loading = false;
      state.error = null;
    },
 clearTheme(state) {
    state.theme = null;
    state.error = null;
  },
    addTheme(state, action) {
      if (!Array.isArray(state.themes)) state.themes = [];
      state.themes.push(action.payload);
      state.loading = false;
      state.error = null;
    },

    updateTheme(state, action) {
      if (Array.isArray(state.themes)) {
        const index = state.themes.findIndex(
          (t) => t.id === action.payload.id
        );

        if (index !== -1) {
          state.themes[index] = {
            ...state.themes[index],
            ...action.payload,
          };
        }
      }

      if (state.theme?.id === action.payload.id) {
        state.theme = {
          ...state.theme,
          ...action.payload,
        };
      }
      
      state.loading = false;
      state.error = null;
    },

    removeTheme(state, action) {
      state.themes = state.themes.filter((t) => t.id !== action.payload);
      state.loading = false;
      state.error = null;
    },

    clearThemes(state) {
      state.themes = [];
      state.theme = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const themeActions = themeSlice.actions;
export const themeReducer = themeSlice.reducer;