import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Services/api";

const token = localStorage.getItem("token");
const config = { headers: { Authorization: `Bearer ${token}` } };

// ✅ Fetch all categories
export const fetchCategories = createAsyncThunk("admin/fetchCategories", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("/BookCategories");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch categories");
    }
});

// ✅ Add a new category
export const addCategory = createAsyncThunk("admin/addCategory", async (categoryName, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/BookCategories", { categoryName }, config);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to add category");
    }
});

// ✅ Delete a category
export const deleteCategory = createAsyncThunk("admin/deleteCategory", async (categoryId, { rejectWithValue }) => {
    try {
        await axiosInstance.delete(`/BookCategories/delete/${categoryId}`, config);
        return categoryId;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete category");
    }
});

// ✅ Fetch all books
export const fetchBooks = createAsyncThunk("admin/fetchBooks", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("/Books");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch books");
    }
});

// ✅ Add a new book
export const addBook = createAsyncThunk("admin/addBook", async (bookData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/Books", bookData, config);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to add book");
    }
});

// ✅ Delete a book
export const deleteBook = createAsyncThunk("admin/deleteBook", async (bookId, { rejectWithValue }) => {
    try {
        await axiosInstance.delete(`/Books/delete/${bookId}`, config);
        return bookId;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete book");
    }
});

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        books: [],
        categories: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload; })
            .addCase(fetchBooks.fulfilled, (state, action) => { state.books = action.payload; })
            .addCase(addCategory.fulfilled, (state, action) => { state.categories.push(action.payload); })
            .addCase(addBook.fulfilled, (state, action) => { state.books.push(action.payload); })
            .addCase(deleteCategory.fulfilled, (state, action) => { 
                state.categories = state.categories.filter(category => category.bookCategoryId !== action.payload);
            })
            .addCase(deleteBook.fulfilled, (state, action) => { 
                state.books = state.books.filter(book => book.bookId !== action.payload);
            });
    },
});

export default adminSlice.reducer;