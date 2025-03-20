import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../Redux/slices/bookSlice";
import BookCard from "../Components/BookCard";

const BookList = () => {
    const dispatch = useDispatch();
    const { books, loading, error } = useSelector((state) => state.books || {});

    useEffect(() => {
        dispatch(fetchBooks());
    }, [dispatch]);
    if (loading) return <p>Loading books...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    // Ensure books is an array before mapping
    return (
        <div className="container mt-4">
            <h2><i class="bi bi-book"></i>Books Collection</h2>
            <div className="row">
                {(Array.isArray(books) ? books : []).map((book) => (
                    <div key={book.bookId} className="col-md-4 mb-4">
                        <BookCard book={book} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookList;
