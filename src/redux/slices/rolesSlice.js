import { createSlice } from "@reduxjs/toolkit";




const rolesSlice=createSlice({
    name:'roles',
    initialState:{
        roles: [],
        permissions: [],
        role: null,
        loading: false,
        error:null
    },
    reducers:{
        setRoles(state,action){
            state.roles = action.payload;
        },
        setRole(state, action) {
            state.role = action.payload;
        },
        setPermissions(state, action) {
            state.permissions = action.payload;
        },

         setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },

         addRoleToList(state, action) {
            if (Array.isArray(state.roles)) {
                state.roles.push(action.payload);
            }
        },
        
        removeRoleFromList(state, action) {
            const roleId = action.payload;
            if (Array.isArray(state.roles)) {
                state.roles = state.roles.filter(role => role.id !== roleId);
            }
        },
        updateRoleInList(state, action) {
            
            const updatedRole = action.payload;
            console.log(updatedRole);
    if (Array.isArray(state.roles)) {
        state.roles = state.roles.map(role => 
            role.id === updatedRole.id ? updatedRole : role
        );
    } 
}
    }

})

const rolesAction = rolesSlice.actions;
const rolesReducer = rolesSlice.reducer;
export { rolesAction, rolesReducer };