import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async thunk for fetching all projects
export const get_all_projects = createAsyncThunk(
    'project/get_all_projects',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get('/projects');
            return fulfillWithValue(data);
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Failed to load projects";
            return rejectWithValue({ error: errorMessage });
        }
    }
);

// Async thunk for fetching project details by ID
export const get_project_details = createAsyncThunk(
    'project/get_project_details',
    async (projectId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/projects/${projectId}`);
            return fulfillWithValue(data);
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Failed to load project details";
            return rejectWithValue({ error: errorMessage });
        }
    }
);

const initialState = {
    projects: [],
    currentProject: null,
    loading: false,
    error: null
};

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        clearProjectError: (state) => {
            state.error = null;
        },
        clearCurrentProject: (state) => {
            state.currentProject = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle get_all_projects
            .addCase(get_all_projects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_all_projects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload;
            })
            .addCase(get_all_projects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            })
            // Handle get_project_details
            .addCase(get_project_details.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_project_details.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProject = action.payload;
            })
            .addCase(get_project_details.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            });
    }
});

export const { clearProjectError, clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
