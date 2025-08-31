import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../../api/api";

// Thunk
export const get_all_users = createAsyncThunk(
  'user/get_all_users',
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get('/users/');
      console.log(data,"yegfhbmxc")
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
      const { data } = await api.get(`/users/${userId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch user');
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
      state.loading = false;
    },
      clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(get_all_users.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(get_all_users.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        console.log("fgdb", state.users)
      })
      .addCase(get_all_users.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch users';
      })
       .addCase(get_user_by_id.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      });
  },
});

// EXPORTS
export const { clearUsers ,clearSelectedUser} = userReducer.actions;
export default userReducer.reducer;