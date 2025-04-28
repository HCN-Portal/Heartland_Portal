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


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import { jwtDecode } from 'jwt-decode';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      // Save token to localStorage only
      localStorage.setItem('token', data.token);
      
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Login failed' });
    }
  }
);

// Helper to decode JWT from token
const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

// Get token from localStorage on app load
const initialToken = localStorage.getItem('token');
const userInfo = decodeToken(initialToken);

const authReducer = createSlice({
  name: 'auth',
  initialState: {
    token: initialToken,
    userInfo: userInfo,
    loading: false,
    errorMessage: '',
    successMessage: ''
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.userInfo = null;
      localStorage.removeItem('token');
      // No need to delete Authorization manually because the interceptor reads token fresh each time
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
        const token = payload.token;
        const decoded = decodeToken(token);

        state.loading = false;
        state.token = token;
        state.userInfo = decoded;
        state.successMessage = payload.message || 'Login successful';
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.errorMessage = payload?.error || 'Login failed';
      });
  }
});

export const { logout, messageClear } = authReducer.actions;
export default authReducer.reducer;
