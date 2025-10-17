import { createSlice } from "@reduxjs/toolkit";



const dataProfileActions = createSlice({
    'name': 'dataProfile',
    initialState: {
        profile: null,
        staffProfile:null,
        loading: false,
        error: null,
    },
    reducers: {
        setProfile(state, action) {
            state.profile = action.payload;
        },
        setStaffProfile(state, action) {
            state.staffProfile = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            
            state.error = action.payload;
        },
    },
})

export const profileActions = dataProfileActions.actions;
export const profileReducer = dataProfileActions.reducer;