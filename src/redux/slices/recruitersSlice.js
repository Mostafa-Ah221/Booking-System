import { createSlice } from "@reduxjs/toolkit";

const recruitersSlice = createSlice({
    name: "recruiters",
    initialState: {
        recruiters: {
            customers: [] // Initialize with proper structure
        },
        recruiter: null,
        loading: false,
        error: {},
    },
    reducers: {
        setRecruiters(state, action) {
            console.log("Setting recruiters data:", action.payload);
            state.recruiters = action.payload || { customers: [] };
        },
        setRecruiter(state, action) {
            state.recruiter = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        
        addRecruiterToList(state, action) {
            console.log("Adding recruiter to list:", action.payload);
            console.log("Current recruiters structure:", state.recruiters);
            
            // تأكد من إن البيانات تتضاف في المكان الصحيح
            if (!state.recruiters) {
                state.recruiters = { customers: [] };
            }
            
            if (!state.recruiters.customers) {
                state.recruiters.customers = [];
            }
            
            // تأكد من إن البيانات كاملة قبل الإضافة
            if (action.payload && action.payload.id) {
                // إضافة في أول القائمة عشان يظهر فوق
                state.recruiters.customers.unshift(action.payload);
                console.log("Successfully added recruiter. New list:", state.recruiters.customers);
            } else {
                console.error("Invalid recruiter data:", action.payload);
            }
        },
        
        removeRecruiterFromList(state, action) {
            const recruiterId = action.payload;
            console.log("Removing recruiter with ID:", recruiterId);
            
            if (state.recruiters?.customers) {
                const originalLength = state.recruiters.customers.length;
                state.recruiters.customers = state.recruiters.customers.filter(
                    recruiter => recruiter.id !== recruiterId
                );
                console.log(`Removed ${originalLength - state.recruiters.customers.length} recruiter(s)`);
            }
        },
        
        updateRecruiterInList(state, action) {
            const updatedRecruiter = action.payload;
            console.log("Updating recruiter:", updatedRecruiter);
            
            if (state.recruiters?.customers && updatedRecruiter.id) {
                const index = state.recruiters.customers.findIndex(
                    recruiter => recruiter.id === updatedRecruiter.id
                );
                
                if (index !== -1) {
                    // احتفظ بالبيانات الأصلية وحدث اللي جاي جديد بس
                    state.recruiters.customers[index] = {
                        ...state.recruiters.customers[index],
                        ...updatedRecruiter
                    };
                    console.log("Successfully updated recruiter at index:", index);
                } else {
                    console.error("Recruiter not found for update. ID:", updatedRecruiter.id);
                }
            }
        },

        clearError(state) {
            state.error = {};
        }
    }
});

const recruiterAction = recruitersSlice.actions;
const recruiterReducer = recruitersSlice.reducer;

export { recruiterAction, recruiterReducer };