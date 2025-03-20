import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Services/api";

// Add to cart
export const addToCart = createAsyncThunk("cart/addToCart", async (book, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/CartItems", {
            bookId: book.bookId,
            quantity: 1
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to add to cart");
    }
});

// Fetch cart items for the logged-in user
export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("/Carts/user", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        // console.log("Cart API Response:", response.data);
        return response.data.cartItems;
    } catch (error) {
        // console.error("Cart API Error:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
    }
});


// Remove an item from cart
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (cartItemId, { rejectWithValue }) => {
    try {
        await axiosInstance.delete(`/CartItems/${cartItemId}`);
        return cartItemId;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to remove from cart");
    }
});

// Increase item quantity
export const increaseQuantity = createAsyncThunk("cart/increaseQuantity", async (cartItemId, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.put(`/CartItems/increase/${cartItemId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to increase quantity");
    }
});

// Decrease item quantity
export const decreaseQuantity = createAsyncThunk("cart/decreaseQuantity", async (cartItemId, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.put(`/CartItems/decrease/${cartItemId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to decrease quantity");
    }
});

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action) => { state.cartItems = action.payload; })
            .addCase(addToCart.fulfilled, (state, action) => { state.cartItems.push(action.payload); })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.cartItems = state.cartItems.filter(item => item.cartItemId !== action.payload);
            });
    },
});

export default cartSlice.reducer;