import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Services/api";

// Login
export const loginUser = createAsyncThunk("auth/loginUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/Users/login", userData);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Login failed");
    }
});

// Signup
export const registerUser = createAsyncThunk("auth/registerUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/Users/signup", userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
});

// Fetch security question for password reset
export const getSecurityQuestion = createAsyncThunk("auth/getSecurityQuestion", async (emailId, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/auth/forgot-password", { emailId });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "User not found");
    }
});

// Reset password using security question
export const resetPassword = createAsyncThunk("auth/resetPassword", async (resetData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/auth/reset-password", resetData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Incorrect security answer");
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: localStorage.getItem("token") || null,
        loading: false,
        error: null,
        securityQuestion: "", // Stores security question for reset password
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem("token");
            state.user = null;
            state.token = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.token = action.payload.token; })
            .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Signup cases
            .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(registerUser.fulfilled, (state, action) => { state.loading = false; })
            .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Fetch security question
            .addCase(getSecurityQuestion.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getSecurityQuestion.fulfilled, (state, action) => { state.loading = false; state.securityQuestion = action.payload.securityQuestion; })
            .addCase(getSecurityQuestion.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Reset password
            .addCase(resetPassword.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(resetPassword.fulfilled, (state) => { state.loading = false; })
            .addCase(resetPassword.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;