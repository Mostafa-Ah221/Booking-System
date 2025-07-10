
import {createSlice} from "@reduxjs/toolkit";

const workspaceSlice = createSlice({
    name:"workspaces",
    initialState:{
        workspaces:[],
        workspace:null,
        loading:false,
        error:null
    },
    reducers:{
        setWorkspaces(state,action){
            state.workspaces = action.payload
        },
        setWorkspace(state,action){
            state.workspace = action.payload
        },
        setLoading(state, action) {
         state.loading = action.payload;
        },
        setError(state, action) {
          state.error = action.payload;
        }
    }
})

const workspaceAction=workspaceSlice.actions
const workspaceReducer=workspaceSlice.reducer

export {workspaceAction,workspaceReducer} 