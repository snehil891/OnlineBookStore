import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, fetchBooks, addCategory, addBook, deleteCategory, deleteBook } from "../Redux/slices/adminSlice";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { books, categories, loading, error } = useSelector((state) => state.admin);

    const [categoryName, setCategoryName] = useState("");
    const [newBook, setNewBook] = useState({ title: "", author: "", price: "", coverImageUrl: "", categoryId: "" });

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchBooks());
    }, [dispatch]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        navigate("/");
    }

    const handleAddCategory = () => {
        if (categoryName.trim()) {
            dispatch(addCategory(categoryName));
            setCategoryName("");
        }
    };

    const handleAddBook = () => {
        if (newBook.title && newBook.author && newBook.price && newBook.categoryId) {
            dispatch(addBook(newBook));
            setNewBook({ title: "", author: "", price: "", coverImageUrl: "", categoryId: "" });
        }
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            dispatch(deleteCategory(id));
        }
    };

    const handleDeleteBook = (id) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            dispatch(deleteBook(id));
        }
    };

    return (
        <div className="container mt-4">
            <h2>Admin Dashboard</h2>
            <button className="btn btn-danger" onClick={handleLogout}>LogOut</button>
            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}

            {/* Add Category Section */}
            <div className="card p-3 mt-3">
                <h4>Add Category</h4>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Category Name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                />
                <button className="btn btn-primary mt-2" onClick={handleAddCategory}>
                    Add Category
                </button>
            </div>

            {/* Category List with Delete */}
            <div className="card p-3 mt-3">
                <h4>Categories</h4>
                <ul className="list-group">
                    {categories.map((category) => (
                        <li key={category.bookCategoryId} className="list-group-item d-flex justify-content-between">
                            {category.categoryName}
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCategory(category.bookCategoryId)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Add Book Section */}
            <div className="card p-3 mt-3">
                <h4>Add Book</h4>
                <input type="text" className="form-control" placeholder="Title" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} />
                <input type="text" className="form-control mt-2" placeholder="Author" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} />
                <input type="number" className="form-control mt-2" placeholder="Price" value={newBook.price} onChange={(e) => setNewBook({ ...newBook, price: e.target.value })} />
                <input type="text" className="form-control mt-2" placeholder="Cover Image URL" value={newBook.coverImageUrl} onChange={(e) => setNewBook({ ...newBook, coverImageUrl: e.target.value })} />
                <select className="form-control mt-2" value={newBook.categoryId} onChange={(e) => setNewBook({ ...newBook, categoryId: e.target.value })}>
                    <option value="">Select Category</option>
                    {categories.map(category => (
                        <option key={category.bookCategoryId} value={category.bookCategoryId}>{category.categoryName}</option>
                    ))}
                </select>
                <button className="btn btn-primary mt-2" onClick={handleAddBook}>
                    Add Book
                </button>
            </div>

            {/* Book List with Delete */}
            <div className="card p-3 mt-3">
                <h4>Books</h4>
                <ul className="list-group">
                    {books.map((book) => (
                        <li key={book.bookId} className="list-group-item d-flex justify-content-between">
                            {book.title} - {book.author}
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteBook(book.bookId)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;
