import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const submit_application = createAsyncThunk(
    'app/submit_application',
    async (formData, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/applications/submit-application', formData);
            return fulfillWithValue(data);
        } catch (error) {
            const errorMessage = error.response?.data?.error || "An error occurred";
            return rejectWithValue({ error: errorMessage });
        }
    }
);
//End Method

export const get_dashboard_stats = createAsyncThunk(
    'app/get_dashboard_stats',
    async (_, { rejectWithValue, fulfillWithValue }) => {
      try {
        const { data } = await api.get('/applications/dashboard-stats');
        return fulfillWithValue(data);
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Failed to fetch dashboard stats';
        return rejectWithValue({ error: errorMessage });
      }
    }
  );
  

export const get_all_applications = createAsyncThunk(
    'app/get_all_applications',
    async (_, { rejectWithValue, fulfillWithValue }) => {
      try {
        const { data } = await api.get('/applications'); 
        return fulfillWithValue(data);
      } catch (error) {
        const errorMessage = error.response?.data?.error || "Failed to load applications";
        console.log(errorMessage);
        return rejectWithValue({ error: errorMessage });
      }
    }
);
//End Method
  
export const update_application_status = createAsyncThunk(
    'app/update_application_status',
    async ({ id, status }, { rejectWithValue, fulfillWithValue }) => {
      try {
        const { data } = await api.put(`/applications/${id}/status`, { status });
        console.log(data);
        return fulfillWithValue(data);
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Status update failed';
        return rejectWithValue({ error: errorMessage });
      }
    }
  );
//End Method

export const appReducer = createSlice({
    name: "app",
    initialState: {
        errorMessage: '',
        successMessage: '',
        applications: [],
        pendingApplications: 0,
        activeEmployees:0,
        ongoingProjects:0,
        loading: false,

    },
    reducers: {
        messageClear : (state,_) => {
            state.errorMessage = ''
            state.successMessage = ''  
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(submit_application.rejected, (state, { payload }) => {
            state.errorMessage = payload?.error || "Submission failed";
        })
        .addCase(submit_application.fulfilled, (state,{payload}) => {
            state.successMessage = payload.message
        })
        .addCase(get_dashboard_stats.fulfilled, (state, { payload }) => {
            state.pendingApplications = payload.pendingApplications;
            state.activeEmployees = payload.activeEmployees;
            state.ongoingProjects = payload.ongoingProjects;
        })
        .addCase(get_dashboard_stats.rejected, (state, { payload }) => {
            state.errorMessage = payload?.error || "Failed to fetch dashboard stats";
        })          
        .addCase(get_all_applications.pending, (state) => {
            state.loading = true;
        })
        .addCase(get_all_applications.fulfilled, (state, { payload }) => {
            state.applications = payload;
            state.loading = false;
        })
        .addCase(get_all_applications.rejected, (state, { payload }) => {
            state.loading = false;
            state.errorMessage = payload?.error || "Failed to fetch applications";
        })
        .addCase(update_application_status.fulfilled, (state, { payload }) => {
            state.successMessage = payload.message;
        })
        .addCase(update_application_status.rejected, (state, { payload }) => {
            state.errorMessage = payload?.error || "Failed to update status";
        });
          
    }

})

export const {messageClear} = appReducer.actions
export default appReducer.reducer