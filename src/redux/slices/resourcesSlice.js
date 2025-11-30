import { createSlice } from "@reduxjs/toolkit";

const resourcesSlice = createSlice({
    name: "resources",
    initialState: {
        resources: [],
        resource: null,
        loading: false,
        deleteLoading: false, 
        dataFetched: false,
        error: null,
    },
    reducers: {
        setResources(state, action) {
            state.resources = action.payload;
        },
        setResource(state, action) {
            state.resource = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setDeleteLoading(state, action) {
            state.deleteLoading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        setDataFetched(state, action) {
            state.dataFetched = action.payload;
        },
        // إضافة مورد جديد للقائمة
        addResourceToList(state, action) {
            console.log("Adding resource to list:", action.payload);
            console.log("Current state structure:", state.resources);
            
            // إذا كانت البيانات في شكل object مع array بداخلها
            if (state.resources && typeof state.resources === 'object' && state.resources.resources) {
                state.resources.resources.unshift(action.payload);
            } 
            // إذا كانت البيانات في شكل object مع array مباشر
            else if (state.resources && typeof state.resources === 'object' && Array.isArray(state.resources.data)) {
                state.resources.data.unshift(action.payload);
            }
            // إذا كانت البيانات array مباشر
            else if (Array.isArray(state.resources)) {
                state.resources.unshift(action.payload);
            }
            // إذا كان resources فاضي أو null، إنشاء structure جديد
            else {
                state.resources = [action.payload];
            }
        },
        
        // حذف مورد من القائمة
        removeResourceFromList(state, action) {
            const resourceId = action.payload;
            
            if (state.resources && typeof state.resources === 'object' && state.resources.resources) {
                state.resources.resources = state.resources.resources.filter(resource => resource.id !== resourceId);
            } 
            else if (state.resources && typeof state.resources === 'object' && Array.isArray(state.resources.data)) {
                state.resources.data = state.resources.data.filter(resource => resource.id !== resourceId);
            }
            else if (Array.isArray(state.resources)) {
                state.resources = state.resources.filter(resource => resource.id !== resourceId);
            }
        },
        
        updateResourceInList(state, action) {
            const updatedResource = action.payload;
            
            if (state.resources && typeof state.resources === 'object' && state.resources.resources) {
                const index = state.resources.resources.findIndex(resource => resource.id === updatedResource.id);
                if (index !== -1) {
                    state.resources.resources[index] = { ...state.resources.resources[index], ...updatedResource };
                }
            } 
            else if (state.resources && typeof state.resources === 'object' && Array.isArray(state.resources.data)) {
                const index = state.resources.data.findIndex(resource => resource.id === updatedResource.id);
                if (index !== -1) {
                    state.resources.data[index] = { ...state.resources.data[index], ...updatedResource };
                }
            }
            else if (Array.isArray(state.resources)) {
                const index = state.resources.findIndex(resource => resource.id === updatedResource.id);
                if (index !== -1) {
                    state.resources[index] = { ...state.resources[index], ...updatedResource };
                }
            }
        }
    }
});

const resourceAction = resourcesSlice.actions;
const resourceReducer = resourcesSlice.reducer;

export { resourceAction, resourceReducer };