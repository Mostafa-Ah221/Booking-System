import { createSlice } from "@reduxjs/toolkit";

const customersSlice = createSlice({
    name: "customers",
    initialState: {
        customers: [],
        customer: null,
        loading: false,
         deleteLoading: false, 
         dataFetched: false,
        error: null,
    },
    reducers: {
        setCustomers(state, action) {
            state.customers = action.payload;
        },
        setCustomer(state, action) {
            state.customer = action.payload;
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
        // إضافة عميل جديد للقائمة
        addCustomerToList(state, action) {
            console.log("Adding customer to list:", action.payload);
            console.log("Current state structure:", state.customers);
            
            // إذا كانت البيانات في شكل object مع array بداخلها
            if (state.customers && typeof state.customers === 'object' && state.customers.clients) {
                state.customers.clients.unshift(action.payload); // نضيف في الأول عشان يظهر فوق
            } 
            // إذا كانت البيانات في شكل object مع array مباشر
            else if (state.customers && typeof state.customers === 'object' && Array.isArray(state.customers.data)) {
                state.customers.data.unshift(action.payload);
            }
            // إذا كانت البيانات array مباشر
            else if (Array.isArray(state.customers)) {
                state.customers.unshift(action.payload);
            }
            // إذا كان customers فاضي أو null، إنشاء structure جديد
            else {
                state.customers = [action.payload];
            }
        },
        
        // حذف عميل من القائمة
        removeCustomerFromList(state, action) {
            const customerId = action.payload;
            
            if (state.customers && typeof state.customers === 'object' && state.customers.clients) {
                state.customers.clients = state.customers.clients.filter(customer => customer.id !== customerId);
            } 
            else if (state.customers && typeof state.customers === 'object' && Array.isArray(state.customers.data)) {
                state.customers.data = state.customers.data.filter(customer => customer.id !== customerId);
            }
            else if (Array.isArray(state.customers)) {
                state.customers = state.customers.filter(customer => customer.id !== customerId);
            }
        },
        
        // تحديث عميل في القائمة
        updateCustomerInList(state, action) {
            const updatedCustomer = action.payload;
            
            if (state.customers && typeof state.customers === 'object' && state.customers.clients) {
                const index = state.customers.clients.findIndex(customer => customer.id === updatedCustomer.id);
                if (index !== -1) {
                    state.customers.clients[index] = { ...state.customers.clients[index], ...updatedCustomer };
                }
            } 
            else if (state.customers && typeof state.customers === 'object' && Array.isArray(state.customers.data)) {
                const index = state.customers.data.findIndex(customer => customer.id === updatedCustomer.id);
                if (index !== -1) {
                    state.customers.data[index] = { ...state.customers.data[index], ...updatedCustomer };
                }
            }
            else if (Array.isArray(state.customers)) {
                const index = state.customers.findIndex(customer => customer.id === updatedCustomer.id);
                if (index !== -1) {
                    state.customers[index] = { ...state.customers[index], ...updatedCustomer };
                }
            }
        }
    }
});

const customerAction = customersSlice.actions;
const customerReducer = customersSlice.reducer;

export { customerAction, customerReducer };