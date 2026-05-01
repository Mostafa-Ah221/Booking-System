import { createSlice } from "@reduxjs/toolkit";

const interviewsSlice = createSlice({
  name: "interviews",
  initialState: {
    interviews: null,    
    allInterviews: null, 
    availableStForIntV: null,   
    interview: null,
    availability: null,
    unavailability: null,
    notifications: null,
    currentWorkspaceId: null,
    currentStaffId: null,
    currentType: null, 
    loading: false,
    error: null,
  },
  reducers: {
    setInterviews(state, action) {
      if (action.payload && typeof action.payload === 'object' && 'interviews' in action.payload) {
        state.interviews = action.payload.interviews;
        state.currentWorkspaceId = action.payload.workspaceId;
        state.currentStaffId = action.payload.staffId;
         state.currentType = action.payload.type;
      } else {
        state.interviews = action.payload || [];
      }
      state.loading = false;
      state.error = null;
    },updateInterviewPin(state, action) {
    const { id, is_pinned } = action.payload;
    if (state.interviews) {
      const interview = state.interviews.find(i => i.id === id);
      if (interview) {
        interview.is_pinned = is_pinned;
      }
    }
  },
    setAllInterviews(state, action) {
      state.allInterviews = action.payload;
      state.loading = false;
      state.error = null;
    },
    setAvailableStForIntV(state, action) {
      state.availableStForIntV = action.payload;
      state.loading = false;
      state.error = null;
    },
    setInterview(state, action) {
      state.interview = action.payload;
    },
    setAvailability(state, action) {
      state.availability = action.payload;
    },
    setUnAvailability(state, action) {
      state.unavailability = action.payload;
    },
    setNotifications(state, action) {
      state.notifications = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    removeInterview(state, action) {
      state.interviews = state.interviews?.filter(
        (interview) => interview.id !== action.payload
      );
    },
    clearInterviews(state) {
      state.interviews = null;
      state.currentWorkspaceId = null;
      state.currentStaffId = null;
      state.currentType = null;
      state.error = null;
    },
    clearAllInterviews(state) { 
      state.allInterviews = null;
    },
    updateInterviewNotifications(state, action) {
      const { interviewId, notifications } = action.payload;
      if (state.interview && state.interview.id === interviewId) {
        state.interview.notifications = notifications;
      }
      const interviewIndex = state.interviews?.findIndex(
        (interview) => interview.id === interviewId
      );
      if (interviewIndex !== -1) {
        state.interviews[interviewIndex].notifications = notifications;
      }
    },
    updateInterviewInList(state, action) {
    const updatedInterview = action.payload;
    
    if (state.interviews) {
      state.interviews = state.interviews.map(interview => 
        interview.id === updatedInterview.id 
          ? { ...interview, ...updatedInterview }
          : interview
      );
    }
    
    if (state.allInterviews) {
      state.allInterviews = state.allInterviews.map(interview => 
        interview.id === updatedInterview.id 
          ? { ...interview, ...updatedInterview }
          : interview
      );
    }
    
    if (state.interview?.id === updatedInterview.id) {
      state.interview = { ...state.interview, ...updatedInterview };
    }
  },
 updateInterviewShareLink(state, action) {
  const { id, share_link } = action.payload;
  
  if (state.interviews) {
    state.interviews = state.interviews.map(interview => 
      interview.id === id 
        ? { ...interview, share_link: share_link }
        : interview
    );
  }
  
  if (state.allInterviews) {
    state.allInterviews = state.allInterviews.map(interview => 
      interview.id === id 
        ? { ...interview, share_link: share_link }
        : interview
    );
  }
  
  if (state.interview?.id === id) {
    state.interview = { ...state.interview, share_link: share_link };
  }
},
   addInterviewToList(state, action) {
  const newInterview = action.payload;
   console.log('newInterview keys:', JSON.stringify(newInterview)); // ← هنا
  console.log('=== addInterviewToList ===');
  console.log('newInterview.work_space_id:', newInterview.work_space_id, typeof newInterview.work_space_id);
  console.log('state.currentWorkspaceId:', state.currentWorkspaceId, typeof state.currentWorkspaceId);
  console.log('state.interviews is array:', Array.isArray(state.interviews));
  
  if (Array.isArray(state.allInterviews)) {
    state.allInterviews.unshift(newInterview);
  } else {
    state.allInterviews = [newInterview];
  }

  if (Array.isArray(state.interviews)) {
    const matchesFilter = 
      (!state.currentWorkspaceId || state.currentWorkspaceId === 0 || 
        Number(newInterview.work_space_id) === Number(state.currentWorkspaceId)) &&
      (!state.currentStaffId || 
        Number(newInterview.staff_id) === Number(state.currentStaffId));
    
    if (matchesFilter) {
      state.interviews.unshift(newInterview);
    }
  }
}
    
  }
});

const interviewAction = interviewsSlice.actions;
const interviewReducer = interviewsSlice.reducer;

export { interviewAction, interviewReducer };