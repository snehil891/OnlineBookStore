import axios from "axios";
import store from "../Redux/store";
import { logout } from "../Redux/slices/authSlice";

const API_URL = "http://localhost:5124/api";

const axiosInstance = axios.create({
    baseURL: API_URL,
});

// Function to check token expiry
const isTokenExpired = () => {
    const token = localStorage.getItem("token");
    if (!token) return true; // If no token, consider it expired

    try {
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        const exp = decodedToken.exp * 1000; // Convert to milliseconds
        return Date.now() >= exp; // Compare expiration time with current time
    } catch (error) {
        console.error("Error decoding token:", error);
        return true; // If decoding fails, assume expired
    }
};

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
    (config) => {
        if (config.url.includes("/Users/login") || config.url.includes("/Users/signup")) {
            return config; // Allow login/signup requests even if token expired
        }

        if (isTokenExpired()) {
            console.warn("Token expired! Logging out...");
            localStorage.removeItem("token"); // Remove expired token
            store.dispatch(logout());
            window.location.href = "/"; // Redirect to login page
            return Promise.reject(new Error("Token expired"));
        }

        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 (Unauthorized)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Unauthorized! Logging out...");
            localStorage.removeItem("token");
            store.dispatch(logout());
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;