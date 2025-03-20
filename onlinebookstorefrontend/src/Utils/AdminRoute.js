import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
    const userRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    return token && userRole === "Admin" ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
