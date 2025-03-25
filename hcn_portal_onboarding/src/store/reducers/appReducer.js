import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import api from "../../api/api";

export const submit_application = createAsyncThunk(
    'app/submit_application',
    async (formData, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/applications/submit-application', formData);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);
//End Method


export const appReducer = createSlice({
    name: "app",
    initialState: {
        errorMessage: '',
        successMessage: '',
    },
    reducers: {
        messageClear : (state,_) => {
            state.errorMessage = ''
            state.successMessage = ''  
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(submit_application.rejected, (state,{payload}) => {
            state.errorMessage = payload.error
        })
        .addCase(submit_application.fulfilled, (state,{payload}) => {
            state.successMessage = payload.message
        })
    }

})

export const {messageClear} = appReducer.actions
export default appReducer.reducer