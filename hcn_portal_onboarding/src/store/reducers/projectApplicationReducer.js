// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from "../../api/api";

// export const getProjectApplicationsByUserId = createAsyncThunk(
//   'projects/getProjectApplicationsByUserId',
//   async (userId, { rejectWithValue }) => {
//     try {
//       const { data } = await api.get(`/projects/applications/user/${userId}`);
//       return data;
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || `Failed to load project Requests for ${userId}`;
//       console.error(errorMessage);
//       return rejectWithValue({ error: errorMessage });
//     }
//   });

// export const getProjectApplicationsById = createAsyncThunk(
//   'projects/getProjectApplicationsById',
//   async (projectId, { rejectWithValue }) => {
//     try {
//       console.log(projectId,"gvbnm ")
//       const { data } = await api.get(`/projects/${projectId}/applications`);
//       return data; // { message, count, requests }
//     } catch (error) {
//       return rejectWithValue({ error: error.response?.data?.error || 'Failed to fetch project applications' });
//     }
//   }
// );
// export const applyToJoinProject = createAsyncThunk(
//   'projects/applyToJoinProject',
//   async ({ projectId, requestBody }, { rejectWithValue }) => {
//     try {
//       const { data } = await api.post(`/projects/${projectId}/apply-employee`, requestBody);
//       return data;
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || `Failed to request for project  ${projectId}`;
//       console.error(errorMessage);
//       return rejectWithValue({ error: errorMessage });
//     }
//   });



//   export const applyToManageProject = createAsyncThunk(
//   'projects/applyToManageProject',
//   async ({ projectId, requestBody }, { rejectWithValue }) => {
//     try {
//       const { data } = await api.post(`/projects/${projectId}/apply-manager`, requestBody);
//       return data;
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || `Failed to request for project  ${projectId}`;
//       console.error(errorMessage);
//       return rejectWithValue({ error: errorMessage });
//     }
//   });



// export const approveProjectApplication = createAsyncThunk(
//   'projects/approveProjectApplication',
//   async ({ projectId, applicationId }, { rejectWithValue }) => {
//     try {
//       const { data } = await api.post(`/projects/${projectId}/applications/${applicationId}/approve`);
//       return data;
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || `Failed to approve request for project  ${projectId}`;
//       console.error(errorMessage);
//       return rejectWithValue({ error: errorMessage });
//     }
//   });




// export const declineProjectApplication = createAsyncThunk(
//   'projects/declineProjectApplication',
//   async ({ projectId, applicationId }, { rejectWithValue }) => {
//     try {
//       const { data } = await api.post(`/projects/${projectId}/applications/${applicationId}/decline`);
//       return data;
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || `Failed to approve request for project  ${projectId}`;
//       console.error(errorMessage);
//       return rejectWithValue({ error: errorMessage });
//     }
//   });





// const initialState = {
//   projectApplications: [],
//   employees: [],
//   managers: [],
//   loading: false,
//   error: null,
//   selectedProjectl: null,
//   currentProjectApplications:[]
// };


// const projectApplicationReducer = createSlice({
//   name: 'projectApplications',
//   initialState,
//   reducers: {
//     clearProjects: (state) => {
//       state.projectApplications = [];
//       state.error = null;
//       state.loading = false;
//       state.currentProjectApplications = [];
//     },
//     clearSelectedProject: (state) => {
//       state.selectedProjectl = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Get All Projects
//       .addCase(getProjectApplicationsByUserId.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getProjectApplicationsByUserId.fulfilled, (state, action) => {
//         state.loading = false;
//         state.projectApplications = action.payload.requests;
//       })
//       .addCase(getProjectApplicationsByUserId.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.error || `Failed to fetch projectFailed to load project Requests`;
//       })
// // Get all applications for a projectId
//       .addCase(getProjectApplicationsById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getProjectApplicationsById.fulfilled, (state, action) => {
//         state.loading = false;
//         // action.payload.requests expected
//         console.log("inred",action.payload.requests)
//         state.currentProjectApplications = action.payload.requests || [];
//         // state.currentProjectApplications = projectAllApplications.filter((application)=> application.status=='pending')
//         console.log("inred", state.currentProjectApplications)
//         }
//       )
//       .addCase(getProjectApplicationsById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.error || 'Failed to fetch project applications';
//       })





//       // Apply for a Project
//       .addCase(applyToJoinProject.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(applyToJoinProject.fulfilled, (state, action) => {
//         state.loading = false;
//         state.successMessage = action.payload.message;

//         const createdApplication = action.payload.request;
//         // console.log("reducer addcase")
//         // console.log(createdApplication, "reducer")
//         if (!createdApplication) return;
        

//         state.projectApplications.unshift(createdApplication)


//       })
//       .addCase(applyToJoinProject.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.error || 'Something went wrong';
//       })



//       .addCase(applyToManageProject.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(applyToManageProject.fulfilled, (state, action) => {
//         state.loading = false;
//         state.successMessage = action.payload.message;

//         const createdApplication = action.payload.application;

//         if (!createdApplication) return;

//         state.projectApplications.unshift(createdApplication)

//       })
//       .addCase(applyToManageProject.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.error || 'Something went wrong';
//       })


//       // Approve a project Request
//       .addCase(approveProjectApplication.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
// //       .addCase(approveProjectApplication.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.successMessage = action.payload.message;
// //         const applicationId = action.payload.application.id;
// //         console.log(action.payload.application,"approve reducer")
// //         const index = state.projectApplications.findIndex(p => p.id === applicationId);
// //         if (index !== -1) {
// //           // Replace with updated status from API
// //           state.projectApplications[index].status = action.payload.application.status;
// //         }
// //         const curApplicationIndex = state.currentProjectApplications.findIndex(p => p.id == applicationId)
// //         // // if (curApplicationIndex !== -1) {
// //         // //   state.currentProjectApplications[curApplicationIndex] = {
// //         // //     ...state.currentProjectApplications[curApplicationIndex],
// //         // //     status: action.payload.application.status,
// //         // //   };
// //         // // }
// //         // if (curApplicationIndex !== -1) {
// //         //   state.currentProjectApplications = state.currentProjectApplications.map(
// //         //     (app, idx) =>
// //         //       idx === curApplicationIndex
// //         //         ? { ...app, status: action.payload.application.status }
// //         //         : app
// //         //   );
// //         // }
// //         if (curApplicationIndex !== -1) {
// //   console.log(
// //     'updating index',
// //     curApplicationIndex,
// //     'old:',
// //     state.currentProjectApplications[curApplicationIndex].status,
// //     'new:',
// //     action.payload.application.status
// //   );

// //   state.currentProjectApplications = state.currentProjectApplications.map(
// //     (app, idx) =>
// //       idx === curApplicationIndex
// //         ? { ...app, status: action.payload.application.status }
// //         : app
// //   );
// // }


// //         console.log(state.currentProjectApplications[curApplicationIndex].status,"console reducer")
// //       })



// .addCase(approveProjectApplication.fulfilled, (state, action) => {
//   state.loading = false;
//   state.successMessage = action.payload.message;

//   const applicationId = action.payload.application.id;
//   const newStatus = action.payload.application.status;

//   // Update projectApplications
//   const index = state.projectApplications.findIndex(p => p.id === applicationId);
//   if (index !== -1) {
//     state.projectApplications[index] = {
//       ...state.projectApplications[index],
//       status: newStatus,
//     };
//   }

//   // Update currentProjectApplications
//   const curIndex = state.currentProjectApplications.findIndex(p => p.id === applicationId);
//   if (curIndex !== -1) {
//     console.log(
//       'updating index',
//       curIndex,
//       'old:',
//       state.currentProjectApplications[curIndex].status,
//       'new:',
//       newStatus
//     );

//     state.currentProjectApplications[curIndex] = {
//       ...state.currentProjectApplications[curIndex],
//       status: newStatus,
//     };
//   }

//   console.log(
//     state.currentProjectApplications[curIndex]?.status,
//     'console reducer'
//   );
// })





//       .addCase(approveProjectApplication.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.error || `Failed to approve project Requests`;
//       })




//       // Reject a project Request
//       .addCase(declineProjectApplication.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(declineProjectApplication.fulfilled, (state, action) => {
//         state.loading = false;
//         state.successMessage = action.payload.message;
//         const { applicationId } = action.payload.application.id;
//         // console.log(action.payload.application,"decline reducer")
//         const index = state.projectApplications.findIndex(p => p.id === applicationId);

//         if (index !== -1) {
//           // Replace with updated status from API
//           state.projectApplications[index].status = action.payload.application.status;
//         }
//           const curApplicationIndex = state.currentProjectApplications.findIndex(p=>p.id==applicationId)
//         if (curApplicationIndex !== -1){
//           state.currentProjectApplications[curApplicationIndex].status = action.payload.application.status
//         }
//       })
//       .addCase(declineProjectApplication.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.error || `Failed to approve project Requests`;
//       })




//       ;
//   },
// });

// // EXPORTS
// export const { clearProjects, clearSelectedProject } = projectApplicationReducer.actions;
// export default projectApplicationReducer.reducer;
