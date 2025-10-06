import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../../api/api";

export const getProjectApplicationsByUserId = createAsyncThunk(
  'projects/getProjectApplicationsByUserId',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/projects/applications/user/${userId}`);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || `Failed to load project Requests for ${userId}`;
      console.error(errorMessage);
      return rejectWithValue({ error: errorMessage });
    }
  });


export const applyToJoinProject = createAsyncThunk(
  'projects/applyToJoinProject',
  async ({ projectId, requestBody }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/projects/${projectId}/apply-employee`, requestBody);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || `Failed to request for project  ${projectId}`;
      console.error(errorMessage);
      return rejectWithValue({ error: errorMessage });
    }
  });



  export const applyToManageProject = createAsyncThunk(
  'projects/applyToManageProject',
  async ({ projectId, requestBody }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/projects/${projectId}/apply-manager`, requestBody);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || `Failed to request for project  ${projectId}`;
      console.error(errorMessage);
      return rejectWithValue({ error: errorMessage });
    }
  });



export const approveProjectApplication = createAsyncThunk(
  'projects/approveProjectApplication',
  async ({ projectId, applicationId }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/projects/${projectId}/applications/${applicationId}/approve`);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || `Failed to approve request for project  ${projectId}`;
      console.error(errorMessage);
      return rejectWithValue({ error: errorMessage });
    }
  });




export const declineProjectApplication = createAsyncThunk(
  'projects/declineProjectApplication',
  async ({ projectId, applicationId }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/projects/${projectId}/applications/${applicationId}/decline`);
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || `Failed to approve request for project  ${projectId}`;
      console.error(errorMessage);
      return rejectWithValue({ error: errorMessage });
    }
  });





const initialState = {
  projectApplications: [],
  employees: [],
  managers: [],
  loading: false,
  error: null,
  selectedProjectl: null,
};


const projectApplicationReducer = createSlice({
  name: 'projectApplications',
  initialState,
  reducers: {
    clearProjects: (state) => {
      state.projectApplications = [];
      state.error = null;
      state.loading = false;
    },
    clearSelectedProject: (state) => {
      state.selectedProjectl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Projects
      .addCase(getProjectApplicationsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjectApplicationsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.projectApplications = action.payload.requests;
      })
      .addCase(getProjectApplicationsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || `Failed to fetch projectFailed to load project Requests`;
      })

      // Apply for a Project
      .addCase(applyToJoinProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(applyToJoinProject.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;

        const createdApplication = action.payload.request;
        console.log("reducer addcase")
        console.log(createdApplication, "reducer")
        if (!createdApplication) return;
        

        state.projectApplications.unshift(createdApplication)


      })
      .addCase(applyToJoinProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Something went wrong';
      })



      .addCase(applyToManageProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(applyToManageProject.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;

        const createdApplication = action.payload.application;

        if (!createdApplication) return;

        state.projectApplications.unshift(createdApplication)

      })
      .addCase(applyToManageProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Something went wrong';
      })


      // Approve a project Request
      .addCase(approveProjectApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveProjectApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        const { applicationId } = action.payload.application.id;
        // console.log(action.payload.application,"approve reducer")
        const index = state.projectApplications.findIndex(p => p.id === applicationId);
        if (index !== -1) {
          // Replace with updated status from API
          state.projectApplications[index].status = action.payload.application.status;
        }
      })
      .addCase(approveProjectApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || `Failed to approve project Requests`;
      })




      // Reject a project Request
      .addCase(declineProjectApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(declineProjectApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        const { applicationId } = action.payload.application.id;
        // console.log(action.payload.application,"decline reducer")
        const index = state.projectApplications.findIndex(p => p.id === applicationId);

        if (index !== -1) {
          // Replace with updated status from API
          state.projectApplications[index].status = action.payload.application.status;
        }
      })
      .addCase(declineProjectApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || `Failed to approve project Requests`;
      })




      ;
  },
});

// EXPORTS
export const { clearProjects, clearSelectedProject } = projectApplicationReducer.actions;
export default projectApplicationReducer.reducer;
