import { createSlice } from "@reduxjs/toolkit";

const permissionsSlice = createSlice({
    name: "permissions",
    initialState: {
        permissions: [],
        loading: false,
        error: null,
    },
    reducers: {

        setPermissions(state, action) {
            state.permissions = action.payload;
        },
               
        setLoading(state, action) {
            state.loading = action.payload;
        },

        setError(state, action) {
            state.error = action.payload;
        },

    }
});


const permissionsAction = permissionsSlice.actions;
const permissionsReducer = permissionsSlice.reducer;

export { permissionsAction, permissionsReducer };