
import { createSlice } from "@reduxjs/toolkit";

const staffSlice = createSlice({
    name: "staff",
    initialState: {
       
        staffs: [],             
        filteredStaffs: [],      
        staff: null,
        loading: false,
        error: null,
        
       
        staffsLoading: false,
        filteredStaffsLoading: false,
    },
    reducers: {
       
        setStaffs(state, action) {
            let staffData = action.payload;
            
            if (staffData?.all_staff && Array.isArray(staffData.all_staff)) {
                state.staffs = staffData.all_staff;
            } else if (Array.isArray(staffData)) {
                state.staffs = staffData;
            } else {
                state.staffs = [];
            }
        },
        
        setFilteredStaffs(state, action) {
            let staffData = action.payload;
            
            if (staffData?.all_staff && Array.isArray(staffData.all_staff)) {
                state.filteredStaffs = staffData.all_staff;
            } else if (Array.isArray(staffData)) {
                state.filteredStaffs = staffData;
            } else {
                state.filteredStaffs = [];
            }
        },
        
        setStaff(state, action) {
            state.staff = action.payload;
        },
        
        addStaffToList(state, action) {
            if (action.payload) {
                state.staffs.push(action.payload);
                state.filteredStaffs.push(action.payload);
            }
        },
        
        updateStaffInList(state, action) {
            const updatedStaff = action.payload;
            
            const staffIndex = state.staffs.findIndex(
                staff => staff.id === updatedStaff.id
            );
            if (staffIndex !== -1) {
                state.staffs[staffIndex] = {
                    ...state.staffs[staffIndex],
                    ...updatedStaff
                };
            }
            
            const filteredIndex = state.filteredStaffs.findIndex(
                staff => staff.id === updatedStaff.id
            );
            if (filteredIndex !== -1) {
                state.filteredStaffs[filteredIndex] = {
                    ...state.filteredStaffs[filteredIndex],
                    ...updatedStaff
                };
            }
        },
        
        removeStaffFromList(state, action) {
            const staffId = action.payload;
            state.staffs = state.staffs.filter(staff => staff.id !== staffId);
            state.filteredStaffs = state.filteredStaffs.filter(staff => staff.id !== staffId);
        },
        
        setStaffsLoading(state, action) {
            state.staffsLoading = action.payload;
        },
        
        setFilteredStaffsLoading(state, action) {
            state.filteredStaffsLoading = action.payload;
        },
        
        setLoading(state, action) {
            state.loading = action.payload;
        },
        
        setError(state, action) {
            state.error = typeof action.payload === 'string' 
                ? action.payload 
                : action.payload?.message || 'An error occurred';
        },
        
        clearError(state) {
            state.error = null;
        },
    }
});

const staffAction = staffSlice.actions;
const staffReducer = staffSlice.reducer;

export { staffAction, staffReducer };