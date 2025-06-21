import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';

// Login User action (Async thunk)
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });

      // Save token to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data.userInfo)); 

      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Login failed' });
    }
  }
);

// Forgot Password action (Async thunk)
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Password reset failed' });
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ isFirstTime, password, token }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const payload = { password };

      if (isFirstTime) {
        const authToken = localStorage.getItem('token');
        const { data } = await api.post('/auth/reset-passwords/first-time', payload, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        return fulfillWithValue({ message: data.message || 'Password set', redirect: '/employee/home' });
      } else {
        const { data } = await api.post(`/auth/reset-password/${token}`, payload);
        return fulfillWithValue({ message: data.message || 'Password reset', redirect: '/login' });
      }
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: 'Password reset failed' });
    }
  }
);

// Auth reducer slice
const authReducer = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    userInfo: null,
    loading: false,
    errorMessage: '',
    successMessage: ''
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.userInfo = null;
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    },
    messageClear: (state) => {
      state.errorMessage = '';
      state.successMessage = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
        state.successMessage = '';
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token = payload.token;
        state.userInfo = payload.userInfo; // Assuming userInfo is part of the response
        state.successMessage = payload.message || 'Login successful';
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload?.error || 'Login failed';
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = 'Password reset email sent';
      })
      .addCase(forgotPassword.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload?.error || 'Password reset failed';
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
        state.successMessage = '';
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload?.error || 'Password reset failed';
      });
  }
});

export const { logout, messageClear } = authReducer.actions;

export default authReducer.reducer;





// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../api/api';
// import { jwtDecode } from 'jwt-decode';

// export const loginUser = createAsyncThunk(
//   'auth/loginUser',
//   async ({ email, password }, { rejectWithValue, fulfillWithValue }) => {
//     try {
//       const { data } = await api.post('/auth/login', { email, password });
//       // Save token to localStorage
//       localStorage.setItem('token', data.token);
//       api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
//       return fulfillWithValue(data);
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { error: 'Login failed' });
//     }
//   }
// );

// // Helper to decode JWT from localStorage
// const decodeToken = (token) => {
//   try {
//     return jwtDecode(token);
//   } catch {
//     return null;
//   }
// };

// const initialToken = localStorage.getItem('token');

// // Set token globally at app start if it exists
// if (initialToken) {
//   api.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
// }

// const userInfo = decodeToken(initialToken);

// const authReducer = createSlice({
//   name: 'auth',
//   initialState: {
//     token: initialToken,
//     userInfo: userInfo,
//     loading: false,
//     errorMessage: '',
//     successMessage: ''
//   },
//   reducers: {
//     logout: (state) => {
//       state.token = null;
//       state.userInfo = null;
//       localStorage.removeItem('token');

//       // Remove token from global axios
//       delete api.defaults.headers.common['Authorization'];
//     },
//     messageClear: (state) => {
//       state.errorMessage = '';
//       state.successMessage = '';
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.errorMessage = '';
//         state.successMessage = '';
//       })
//       .addCase(loginUser.fulfilled, (state, { payload }) => {
//         const token = payload.token;
//         const decoded = decodeToken(token);

//         state.loading = false;
//         state.token = token;
//         state.userInfo = decoded;
//         state.successMessage = payload.message || 'Login successful';
//       })
//       .addCase(loginUser.rejected, (state, { payload }) => {
//         state.loading = false;
//         state.errorMessage = payload?.error || 'Login failed';
//       });
//   }
// });

// export const { logout, messageClear } = authReducer.actions;
// export default authReducer.reducer;


// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../api/api';
// import { jwtDecode } from 'jwt-decode';

// export const loginUser = createAsyncThunk(
//   'auth/loginUser',
//   async ({ email, password }, { rejectWithValue, fulfillWithValue }) => {
//     try {
//       const { data } = await api.post('/auth/login', { email, password });

//       // Save token to localStorage only
//       localStorage.setItem('token', data.token);

//       return fulfillWithValue(data);
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { error: 'Login failed' });
//     }
//   }
// );

// // Helper to decode JWT from token
// const decodeToken = (token) => {
//   try {
//     return jwtDecode(token);
//   } catch {
//     return null;
//   }
// };

// // Get token from localStorage on app load
// const initialToken = localStorage.getItem('token');
// const userInfo = decodeToken(initialToken);

// const authReducer = createSlice({
//   name: 'auth',
//   initialState: {
//     token: initialToken,
//     userInfo: userInfo,
//     loading: false,
//     errorMessage: '',
//     successMessage: ''
//   },
//   reducers: {
//     logout: (state) => {
//       state.token = null;
//       state.userInfo = null;
//       localStorage.removeItem('token');
//       // No need to delete Authorization manually because the interceptor reads token fresh each time
//     },
//     messageClear: (state) => {
//       state.errorMessage = '';
//       state.successMessage = '';
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.errorMessage = '';
//         state.successMessage = '';
//       })
//       .addCase(loginUser.fulfilled, (state, { payload }) => {
//         const token = payload.token;
//         const decoded = decodeToken(token);

//         state.loading = false;
//         state.token = token;
//         state.userInfo = decoded;
//         state.successMessage = payload.message || 'Login successful';
//       })
//       .addCase(loginUser.rejected, (state, { payload }) => {
//         state.loading = false;
//         state.errorMessage = payload?.error || 'Login failed';
//       });
//   }
// });

// export const { logout, messageClear } = authReducer.actions;
// export default authReducer.reducer;