import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../Redux/slices/authSlice';
import SearchBar from '../Components/SearchBar';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div className="container-fluid">
                {/* Brand */}
                <Link className="navbar-brand text-info fw-bold" to="/">
                    <i className="bi bi-book-half"></i> Book Store
                </Link>

                {/* Toggler for mobile screens */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link text-white fw-semibold" to="/books-details">
                                <i className="bi bi-book"></i> Books
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white fw-semibold" to="/order-history">
                                <i className="bi bi-clock-history"></i> Order History
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white fw-semibold" to="/cart">
                                <i className="bi bi-cart"></i> Cart
                            </Link>
                        </li>
                    </ul>

                    {/* Search Bar */}
                    <SearchBar />

                    {/* Logout Button */}
                    <button className="btn btn-outline-danger ms-3" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right"></i> Log Out
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
