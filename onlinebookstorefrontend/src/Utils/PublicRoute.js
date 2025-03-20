import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};

const PublicRoute = () => {
    return isAuthenticated() ? <Navigate to="/home-page" /> : <Outlet />;
};

export default PublicRoute;
