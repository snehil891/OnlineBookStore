import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Services/api";

// Async thunk to fetch all books
export const fetchBooks = createAsyncThunk("books/fetchBooks", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            return rejectWithValue("Unauthorized: Please log in");
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await axiosInstance.get("/Books", config);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch books");
    }
});

// Async thunk for searching books
export const searchBooks = createAsyncThunk("books/searchBooks", async (query, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            return rejectWithValue("Unauthorized: Please log in");
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await axiosInstance.get(`Books/search?query=${encodeURIComponent(query)}`, config);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch books");
    }
});

const bookSlice = createSlice({
    name: "books",
    initialState: {
        books: [],
        loading: false,
        error: null,
    },
    reducers: {
        sortByPrice: (state, action) => {
            if (action.payload === "lowToHigh") {
                state.books.sort((a, b) => a.price - b.price);
            } else if (action.payload === "highToLow") {
                state.books.sort((a, b) => b.price - a.price);
            }
        },
        sortByCategory: (state) => {
            state.books.sort((a, b) => a.bookCategory.categoryName.localeCompare(b.bookCategory.categoryName));
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBooks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                state.loading = false;
                state.books = action.payload;
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(searchBooks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchBooks.fulfilled, (state, action) => {
                state.loading = false;
                state.books = action.payload;
            })
            .addCase(searchBooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { sortByPrice, sortByCategory } = bookSlice.actions;
export default bookSlice.reducer;