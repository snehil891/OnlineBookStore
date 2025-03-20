import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Services/api";

// Get token from local storage
const token = localStorage.getItem("token");

const config = {
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
};

// Fetch user details
export const fetchUserDetails = createAsyncThunk(
    "order/fetchUserDetails",
    async (_, { rejectWithValue }) => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                return rejectWithValue("User not logged in.");
            }
            const response = await axiosInstance.get(`/Users/${userId}`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch user details");
        }
    }
);

// Fetch cart items for user
export const fetchCart = createAsyncThunk(
    "order/fetchCart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/Carts/user", config);
            // console.log("Cart API Response:", response.data);
            return response.data.cartItems || []; // Ensure we return an array
        } catch (error) {
            console.error("Cart API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch cart items");
        }
    }
);

// Place an order
export const placeOrder = createAsyncThunk(
    "order/placeOrder",
    async ({ shippingAddress }, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const userId = localStorage.getItem("userId");

            if (!userId) {
                return rejectWithValue("User not logged in.");
            }

            // Extract correct cartItems structure
            const cartItems = state.order.cartItems;
            const orderItems = Array.isArray(cartItems)
                ? cartItems.map((item) => ({
                    bookId: item.book?.bookId || item.bookId, // Handle possible structure variations
                    quantity: item.quantity,
                }))
                : [];

            if (orderItems.length === 0) {
                return rejectWithValue("No items in cart to place an order.");
            }

            const orderData = {
                userId: parseInt(userId),
                shippingAddress,
                orderItems,
            };

            console.log("Order Data Before Sending:", orderData); // Debugging log
            const response = await axiosInstance.post("/Orders", orderData, config);
            return response.data;
        } catch (error) {
            console.error("Order Placement Error:", error);
            return rejectWithValue(error.response?.data?.message || "Order placement failed");
        }
    }
);

export const fetchOrderHistory = createAsyncThunk(
    "order/fetchOrderHistory",
    async (_, { rejectWithValue }) => {
        try {
            const userId = localStorage.getItem("userId");

            if (!userId) {
                console.error("❌ User ID is missing. Ensure user is logged in.");
                return rejectWithValue("User ID not found. Please log in again.");
            }

            const response = await axiosInstance.get(`/Orders/user/${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            return response.data;
        } catch (error) {
            console.error("❌ Order History Fetch Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch order history");
        }
    }
);


const orderSlice = createSlice({
    name: "order",
    initialState: {
        user: null,
        cartItems: [],
        orders: [],
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearOrderState: (state) => {
            state.successMessage = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.cartItems = action.payload; // Ensure correct cart data
            })
            .addCase(placeOrder.fulfilled, (state, action) => {
                state.successMessage = "Order placed successfully!";
                state.cartItems = []; // Clear cart after successful order
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(fetchOrderHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload || [];
            })
            .addCase(fetchOrderHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
