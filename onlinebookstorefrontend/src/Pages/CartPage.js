import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart, increaseQuantity, decreaseQuantity } from "../Redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems, loading, error } = useSelector((state) => state.cart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleRemove = (cartItemId) => {
        dispatch(removeFromCart(cartItemId));
    };

    const handleIncreaseQuantity = (cartItemId) => {
        dispatch(increaseQuantity(cartItemId)).then(() => dispatch(fetchCart()));
    };

    const handleDecreaseQuantity = (cartItemId) => {
        dispatch(decreaseQuantity(cartItemId)).then(() => dispatch(fetchCart()));
    };

    const handleProceedToCheckout = () => {
        navigate("/order-form");
    };

    const totalAmount = cartItems.reduce((total, item) => total + item.book.price * item.quantity, 0);

    return (
        <div className="cart-page">
            <div className="container mt-4">
                <h2 className="mb-4 text-center text-primary"><i className="bi bi-cart"></i> Your Book Cart</h2>

                {loading && (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p>Loading cart...</p>
                    </div>
                )}

                {error && <p className="text-danger text-center">❌ {error}</p>}

                {cartItems.length === 0 && !loading ? (
                    <div className="text-center mt-5">
                        <img src="https://cdn-icons-png.flaticon.com/512/4555/4555976.png" alt="Empty Cart" width="200" />
                        <p className="text-muted mt-3">Your cart is empty. Start adding books!</p>
                    </div>
                ) : (
                    <div className="row">
                        {cartItems.map((cartItem) => (
                            cartItem.book && (
                                <div key={cartItem.cartItemId} className="col-md-6">
                                    <div className="card cart-item-card shadow-sm mb-3">
                                        <div className="card-body d-flex justify-content-between align-items-center">
                                            <div>
                                                <h5 className="mb-1">{cartItem.book.title}</h5>
                                                <p className="text-muted mb-1"><strong>Author:</strong> {cartItem.book.author}</p>
                                                <p className="fw-bold text-danger">₹{cartItem.book.price}</p>
                                                <div className="quantity-controls d-flex align-items-center">
                                                    <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleDecreaseQuantity(cartItem.cartItemId)}>➖</button>
                                                    <span className="fw-bold">{cartItem.quantity}</span>
                                                    <button className="btn btn-outline-primary btn-sm ms-2" onClick={() => handleIncreaseQuantity(cartItem.cartItemId)}>➕</button>
                                                </div>
                                            </div>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleRemove(cartItem.cartItemId)}>
                                                ❌ Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}

                {cartItems.length > 0 && (
                    <div className="cart-summary text-center mt-4">
                        <h4 className="text-success">Total Price: ₹{totalAmount.toFixed(2)}</h4>
                        <button className="btn btn-primary w-50 mt-2" onClick={handleProceedToCheckout}>
                            🛍️ Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
