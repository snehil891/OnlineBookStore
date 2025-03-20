import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderHistory } from "../Redux/slices/orderSlice";
import "./OrderHistory.css";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector((state) => state.order);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      dispatch(fetchOrderHistory(userId));
    }
  }, [dispatch, userId]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p>Loading order history...</p>
      </div>
    );

  if (error) return <p className="text-danger text-center">❌ {error}</p>;
  if (orders.length === 0)
    return <p className="text-center text-muted">📦 No orders found.</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-primary">📜 Order History</h2>
      {orders.map((order) => (
        <div key={order.orderId} className="card order-card shadow-sm mb-4 p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="fw-bold">Order ID: {order.orderId}</h5>
            <span
              className={`badge px-3 py-2 ${order.status === "Delivered" ? "bg-success" : "bg-warning"
                }`}
            >
              {order.status}
            </span>
          </div>
          <p className="text-muted">
            <strong>📅 Order Date:</strong>{" "}
            {new Date(order.orderDate).toLocaleDateString()}
          </p>
          <p>
            <strong>📍 Shipping Address:</strong> {order.shippingAddress}
          </p>
          <p className="fw-bold text-danger">
            <strong>💰 Total Price:</strong> ₹{order.totalAmount}
          </p>

          <h5 className="mt-3 text-secondary">📚 Ordered Books</h5>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems?.map((item) => (
                  <tr key={item.itemsId}>
                    <td>{item.book?.title || "Unknown Title"}</td>
                    <td>{item.book?.author || "Unknown Author"}</td>
                    <td>₹{item.price}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
