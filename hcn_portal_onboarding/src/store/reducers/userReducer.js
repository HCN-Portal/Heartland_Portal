import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../../api/api";

// Thunk
export const get_all_users = createAsyncThunk(
  'user/get_all_users',
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get('/users/');
      return fulfillWithValue(data);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to load users';
      console.error(errorMessage);
      return rejectWithValue({ error: errorMessage });
    }
  }
);

export const get_user_by_id = createAsyncThunk(
  'user/get_user_by_id',
  async (userId, { rejectWithValue }) => {
    try {
      console.log('Making API call to /users/' + userId);
      const token = localStorage.getItem('token');
      const { data } = await api.get(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('API Response:', data);
      return data;
    } catch (error) {
      console.error('API Error:', error.response || error);
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch user');
    }
  }
);

export const update_profile = createAsyncThunk(
  'user/update_profile',
  async ({ userId, profileData }, { rejectWithValue }) => {
    try {
      console.log('Updating profile for ID:', userId, 'with data:', profileData);
      const { data } = await api.put(`/users/${userId}`, profileData);
      return data.user;
    } catch (error) {
      console.error('Error updating profile:', error);
      return rejectWithValue(error.response?.data?.error || 'Failed to update profile');
    }
  }
);

// Slice
const initialState = {
  users: [],
  loading: false,
  error: null,
  selectedUser: null,

};

const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = [];
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle get_all_users
      .addCase(get_all_users.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(get_all_users.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(get_all_users.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })
      // Handle get_user_by_id
      .addCase(get_user_by_id.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(get_user_by_id.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
        console.log('Updated selectedUser:', action.payload);
      })
      .addCase(get_user_by_id.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('Error in reducer:', action.payload);
      })
      // Handle update_profile
      .addCase(update_profile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(update_profile.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(update_profile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// EXPORTS
export const { clearUsers ,clearSelectedUser} = userReducer.actions;
export default userReducer.reducer;