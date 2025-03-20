import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails, fetchCart, placeOrder, clearOrderState } from "../Redux/slices/orderSlice";
import { useNavigate } from "react-router-dom";

const OrderForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, cartItems, loading, error, successMessage } = useSelector((state) => state.order || {});
    const [shippingAddress, setShippingAddress] = useState("");

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        // console.log("Fetched User ID:", userId); // Debugging log
        if (userId) {
            dispatch(fetchUserDetails(userId));
        }
        dispatch(fetchCart());
    }, [dispatch]);


    useEffect(() => {
        if (error) {
            alert(error);
            dispatch(clearOrderState());
        }
        if (successMessage) {
            alert(successMessage);
            dispatch(clearOrderState());
            navigate("/home-page");
        }
    }, [error, successMessage, dispatch, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // console.log("Cart Items Debug:", cartItems);

        if (!shippingAddress.trim()) {
            alert("Please enter a shipping address.");
            return;
        }

        if (!user) {
            alert("User details not found.");
            return;
        }

        // Ensures cartItems is an array
        const cartArray = Array.isArray(cartItems?.cartItems) ? cartItems.cartItems : cartItems;

        if (!Array.isArray(cartArray) || cartArray.length === 0) {
            alert("Cart is empty. Please add items before placing an order.");
            return;
        }

        const orderData = {
            userId: user.userId,
            shippingAddress,
            orderItems: cartArray.map((item) => ({
                bookId: item.book?.bookId || item.bookId, // Handle possible structure variations
                quantity: item.quantity
            })),
        };

        console.log("Order Data Before Sending:", orderData); // Debugging log

        dispatch(placeOrder(orderData));
    };



    return (
        <div className="container mt-4">
            <h2>Place Your Order</h2>
            {loading && <p>Loading...</p>}

            {user && (
                <div className="card p-3">
                    <h4>User Details</h4>
                    <p><strong>Full Name:</strong> {user.fullName}</p>
                    <p><strong>Email:</strong> {user.emailId}</p>
                    <p><strong>Phone:</strong> {user.phoneNumber}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label className="form-label">Shipping Address</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading || cartItems.length === 0}>
                    {loading ? "Placing Order..." : "Place Order"}
                </button>
            </form>
        </div>
    );
};

export default OrderForm;
