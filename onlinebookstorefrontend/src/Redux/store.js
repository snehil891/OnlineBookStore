import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import bookReducer from "./slices/bookSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import adminReducer from "./slices/adminSlice";
import homeReducer from "./slices/homeSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        books: bookReducer,
        cart: cartReducer,
        order: orderReducer,
        admin: adminReducer,
        home: homeReducer,
    },
});

export default store;