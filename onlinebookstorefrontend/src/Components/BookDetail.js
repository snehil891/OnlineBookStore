import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchBooks } from "../Redux/slices/bookSlice";

const BookDetails = () => {
    const dispatch = useDispatch();
    const { books, loading, error } = useSelector((state) => state.books);
    const { bookId } = useParams();

    useEffect(() => {
        if (books.length === 0) {
            dispatch(fetchBooks());
        }
    }, [dispatch, books.length]);

    const book = books.find((b) => b.bookId === parseInt(bookId));

    if (loading) return <p>Loading book details...</p>;
    if (error) return <p className="text-danger">{error}</p>;
    if (!book) return <p className="text-danger">Book not found</p>;

    return (
        <div className="container mt-4">
            <div className="card p-3">
                <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="card-img-top"
                    style={{ height: "300px", objectFit: "cover" }}
                />
                <div className="card-body">
                    <h2>{book.title}</h2>
                    <p><strong>Author:</strong> {book.author}</p>
                    <p><strong>Category:</strong> {book.bookCategory.categoryName}</p>
                    <p>{book.description}</p>
                    <p><strong>Price:</strong> ₹{book.price}</p>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;