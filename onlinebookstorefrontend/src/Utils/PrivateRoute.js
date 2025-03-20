import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../Redux/slices/authSlice";

const isTokenExpired = () => {
    const token = localStorage.getItem("token");
    if (!token) return true; // If no token, consider it expired

    try {
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        const exp = decodedToken.exp * 1000; // Convert to milliseconds
        return Date.now() >= exp; // Check if expired
    } catch (error) {
        return true; // If token is invalid, consider it expired
    }
};

const ProtectedRoute = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (isTokenExpired()) {
            console.warn("Token expired! Logging out...");
            localStorage.removeItem("token");
            dispatch(logout());
            navigate("/"); // Redirect to login page
        }
    }, [dispatch, navigate]);

    return token ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
