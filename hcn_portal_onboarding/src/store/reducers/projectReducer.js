import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../../api/api";

// THUNKS
export const getAllProjectTitles = createAsyncThunk(
  'projects/getAllProjectTitles',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/projects/');
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to load projects';
      console.error(errorMessage);
      return rejectWithValue({ error: errorMessage });
    }
  });
// Async thunk for fetching all projects
export const get_all_projects = createAsyncThunk(
    'project/get_all_projects',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/projects');
            return data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Failed to load projects";
            return rejectWithValue({ error: errorMessage });
        }
    }
);

export const getProjectById = createAsyncThunk(
  'projects/getProjectById',
  async (projectId, { rejectWithValue }) => {
    try {
        console.log(projectId);
      const { data } = await api.get(`/projects/${projectId}`);
      return data;
    } catch (error) {
      return rejectWithValue({ error: error.response?.data?.error || 'Failed to fetch project' });
    }
  }
);

export const getEmployees = createAsyncThunk(
  'users/listAllEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/users/list/allEmployees`);
      return data;
    } catch (error) {
      return rejectWithValue({ error: error.response?.data?.error || 'Failed to fetch employees' });
    }
  }
);

export const getManagers = createAsyncThunk(
  'users/listAllManagers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/users/list/allManagers`);
      return data;
    } catch (error) {
      return rejectWithValue({ error: error.response?.data?.error || 'Failed to fetch managers' });
    }
  }
);

export const updateProjectByID = createAsyncThunk(
  'projects/updateById',
  async ({ projectId, editedProject }, { rejectWithValue }) => {
    try {
      console.log(editedProject,"in reducer")
      const { data } = await api.put(`/projects/${projectId}`, editedProject);
      return {
        project: data, // updated project object
        message: 'Project updated successfully'
      };
    } catch (error) {
      return rejectWithValue({
        error: error.response?.data?.error || 'Failed to update project'
      });
    }
  }
);


export const addEmployeesToProject = createAsyncThunk(
  'projects/addEmployeesToProject',
  async ({ projectId, requestBody }, { rejectWithValue }) => {
    try {
      console.log(requestBody,"in reducer req body")
      const { data } = await api.post(`/projects/${projectId}/employees`, requestBody);
      return data;
    } catch (error) {
      return rejectWithValue({
        error: error.response?.data?.error || 'Failed to add employee'
      });
    }
  }
);


export const addManagersToProject = createAsyncThunk(
  'projects/addManagersToProject',
  async ({ projectId, requestBody }, { rejectWithValue }) => {
    try {
      console.log(requestBody,"in reducer req body manager")
      const { data } = await api.post(`/projects/${projectId}/managers`, requestBody);
      return data;
    } catch (error) {
      return rejectWithValue({
        error: error.response?.data?.error || 'Failed to add employee'
      });
    }
  }
);

export const removeManagersFromProject = createAsyncThunk(
  'projects/removeManagersFromProject',
  async ({ projectId, managerId }, { rejectWithValue }) => {
    try {
      console.log(managerId,"in reducer req remove manager")
      const { data } = await api.delete(`/projects/${projectId}/managers/${managerId}`);
      return data;
    } catch (error) {
      return rejectWithValue({
        error: error.response?.data?.error || 'Failed to remove manager'
      });
    }
  }
);


export const removeEmployeesFromProject = createAsyncThunk(
  'projects/removeEmployeesFromProject',
  async ({ projectId, employeeId }, { rejectWithValue }) => {
    try {
      console.log(employeeId,"in reducer req remove employee")
      const { data } = await api.delete(`/projects/${projectId}/employees/${employeeId}`);
      return data;
    } catch (error) {
      return rejectWithValue({
        error: error.response?.data?.error || 'Failed to remove employee'
      });
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/',
  async ({ projectToAdd }, { rejectWithValue }) => {
    try {
      console.log(projectToAdd,"in reducer create project")
      const { data } = await api.post(`/projects/`, projectToAdd);
      return data;
    } catch (error) {
      return rejectWithValue({
        error: error.response?.data?.error || 'Failed to remove employee'
      });
    }
  });
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

export const getProjectApplicationsById = createAsyncThunk(
  'projects/getProjectApplicationsById',
  async (projectId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/projects/${projectId}/applications`);
      return data; // { message, count, requests }
    } catch (error) {
      return rejectWithValue({ error: error.response?.data?.error || 'Failed to fetch project applications' });
    }
  }
);

export const approveProjectApplication = createAsyncThunk(
  'projects/approveProjectApplication',
  async ({ projectId, applicationId }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/projects/${projectId}/applications/${applicationId}/approve`);
      return data; // { message, application, project }
    } catch (error) {
      return rejectWithValue({ error: error.response?.data?.error || 'Failed to approve application' });
    }
  }
);

export const declineProjectApplication = createAsyncThunk(
  'projects/declineProjectApplication',
  async ({ projectId, applicationId, responseNotes }, { rejectWithValue }) => {
    try {
      const body = responseNotes ? { responseNotes } : {};
      const { data } = await api.post(`/projects/${projectId}/applications/${applicationId}/decline`, body);
      return data; // { message, application }
    } catch (error) {
      return rejectWithValue({ error: error.response?.data?.error || 'Failed to decline application' });
    }
  }
);

const initialState = {
  projects: [],
  employees: [],
  managers: [],
  loadingl: false,
  error: null,
  selectedProjectl: null,
};

// SLICE
const projectReducer = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearProjects: (state) => {
      state.projects = [];
      state.error = null;
      state.loadingl = false;
    },
    clearSelectedProject: (state) => {
      state.selectedProjectl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Projects
      .addCase(getAllProjectTitles.pending, (state) => {
        state.loadingl = true;
        state.error = null;
      })
      .addCase(getAllProjectTitles.fulfilled, (state, action) => {
        state.loadingl = false;
        state.projects = action.payload.projects;
      })
      .addCase(getAllProjectTitles.rejected, (state, action) => {
        state.loadingl = false;
        state.error = action.payload?.error || 'Failed to fetch projects';
      })

      // Get All Projects (Alternative)
      .addCase(get_all_projects.pending, (state) => {
        state.loadingl = true;
        state.error = null;
      })
      .addCase(get_all_projects.fulfilled, (state, action) => {
        state.loadingl = false;
        // Expecting the API to return { projects: [] } format
        state.projects = action.payload.projects || action.payload;
      })
      .addCase(get_all_projects.rejected, (state, action) => {
        state.loadingl = false;
        state.error = action.payload?.error || 'Failed to fetch projects';
      })

      // Get Project By ID
      .addCase(getProjectById.pending, (state) => {
        state.loadingl = true;
        state.error = null;
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.loadingl = false;
        state.selectedProjectl = action.payload;
        // Add or update the project in the projects array
        const index = state.projects.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
            state.projects[index] = action.payload;
        } else {
            state.projects.push(action.payload);
        }
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.loadingl = false;
        state.error = action.payload?.error || 'Failed to fetch project';
      })

      // Get Employees
      .addCase(getEmployees.pending, (state) => {
        state.loadingl = true;
        state.error = null;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.loadingl = false;
        state.employees = action.payload.employees;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.loadingl = false;
        state.error = action.payload?.error || 'Failed to fetch employees';
      })

      // Get Managers
      .addCase(getManagers.pending, (state) => {
        state.loadingl = true;
        state.error = null;
      })
      .addCase(getManagers.fulfilled, (state, action) => {
        state.loadingl = false;
        state.managers = action.payload.managers;
      })
      .addCase(getManagers.rejected, (state, action) => {
        state.loadingl = false;
        state.error = action.payload?.error || 'Failed to fetch managers';
      })
      .addCase(updateProjectByID.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.project;
        state.projects = state.projects.map((p) =>
          p._id === updated._id ? updated : p
        );
        state.selectedProjectl= updated
        state.successMessage = action.payload.message;
      })

      // Add Employees and Managers
      .addCase(addEmployeesToProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(addEmployeesToProject.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        const { projectId } = action.meta.arg; // only need projectId
        const index = state.projects.findIndex(p => p._id === projectId);

        if (index !== -1) {
          // Replace with updated employees from API
          state.projects[index].teamMembers = action.payload.employees;
        }

        state.selectedProjectl.teamMembers = action.payload.employees;
      })
      .addCase(addEmployeesToProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Something went wrong';
      })




      // Add managers to project
      .addCase(addManagersToProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(addManagersToProject.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        const { projectId } = action.meta.arg; // only need projectId
        const index = state.projects.findIndex(p => p._id === projectId);

        if (index !== -1) {
          // Replace with updated employees from API
          state.projects[index].managers = action.payload.managers;
        }
        state.selectedProjectl.managers = action.payload.managers;

      })
      .addCase(addManagersToProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Something went wrong';
      })


// Remove Managers
      .addCase(removeManagersFromProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(removeManagersFromProject.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        const { projectId } = action.meta.arg;
        const index = state.projects.findIndex(p => p._id === projectId);
         // Replace with updated employees from API
        if (index !== -1) {
          state.projects[index].managers = action.payload.managers;
        }
        state.selectedProjectl.managers = action.payload.managers;
      }).addCase(removeManagersFromProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Something went wrong';
      })



// Remove Employees
      .addCase(removeEmployeesFromProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(removeEmployeesFromProject.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        const { projectId } = action.meta.arg;
        const index = state.projects.findIndex(p => p._id === projectId);
         // Replace with updated employees from API
        if (index !== -1) {
          state.projects[index].teamMembers = action.payload.teamMembers;
        }
        state.selectedProjectl.teamMembers = action.payload.teamMembers;
      }).addCase(removeEmployeesFromProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Something went wrong';
      })




        // Project applications
        .addCase(getProjectApplicationsById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getProjectApplicationsById.fulfilled, (state, action) => {
          state.loading = false;
          // action.payload.requests expected
          if (state.selectedProjectl) {
            state.selectedProjectl.applications = action.payload.requests || [];
          }
        })
        .addCase(getProjectApplicationsById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload?.error || 'Failed to fetch project applications';
        })

        .addCase(approveProjectApplication.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(approveProjectApplication.fulfilled, (state, action) => {
          state.loading = false;
          state.successMessage = action.payload.message;
          const { project } = action.payload;
          if (project && state.selectedProjectl && project.id === state.selectedProjectl._id) {
            // update managers/teamMembers depending on response
            if (project.teamMembers) state.selectedProjectl.teamMembers = project.teamMembers;
            if (project.managers) state.selectedProjectl.managers = project.managers;
          }
          // remove application from list if present
          if (state.selectedProjectl && state.selectedProjectl.applications) {
            const applicationId = action.payload.application?.id;
            if (applicationId) {
              state.selectedProjectl.applications = state.selectedProjectl.applications.filter(a => a._id !== applicationId && a.id !== applicationId);
            }
          }
        })
        .addCase(approveProjectApplication.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload?.error || 'Failed to approve application';
        })

        .addCase(declineProjectApplication.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(declineProjectApplication.fulfilled, (state, action) => {
          state.loading = false;
          state.successMessage = action.payload.message;
          const applicationId = action.payload.application?.id;
          if (state.selectedProjectl && applicationId && state.selectedProjectl.applications) {
            state.selectedProjectl.applications = state.selectedProjectl.applications.filter(a => a._id !== applicationId && a.id !== applicationId);
          }
        })
        .addCase(declineProjectApplication.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload?.error || 'Failed to decline application';
        })


// create a project

.addCase(createProject.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.createStatus = "succeeded";

        // The thunk returns `data`; handle either `{ project: ... }` or the project object itself.
        const created = action.payload ;

        if (!created) return;

       state.projects.unshift(created)
      })
      .addCase(createProject.rejected, (state, action) => {
         state.loading = false;
        state.error = action.payload?.error || 'Something went wrong';
      })



      ;
  },
});

// EXPORTS
export const { clearProjects, clearSelectedProject } = projectReducer.actions;
export default projectReducer.reducer;
