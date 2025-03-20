import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Services/api";

// Fetch Best Sellers from API
export const fetchBestSellers = createAsyncThunk(
    "home/fetchBestSellers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/Orders/bestsellers");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to load best sellers");
        }
    }
);

const homeSlice = createSlice({
    name: "home",
    initialState: {
        bestSellers: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBestSellers.pending, (state) => { state.loading = true; })
            .addCase(fetchBestSellers.fulfilled, (state, action) => {
                state.loading = false;
                state.bestSellers = action.payload;
            })
            .addCase(fetchBestSellers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default homeSlice.reducer;
