import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux/slices/cartSlice";
import "./BookCard.css";

const BookCard = ({ book }) => {
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(addToCart({ bookId: book.bookId }));
    };

    return (
        <div className="card book-card shadow-sm border-0">
            <div className="book-img-container">
                <img
                    src={book.coverImageUrl || "https://via.placeholder.com/200"}
                    className="card-img-top"
                    alt={book.title}
                />
            </div>
            <div className="card-body text-center">
                <h5 className="card-title text-primary fw-bold">{book.title}</h5>
                <p className="card-text text-muted">{book.description.substring(0, 80)}...</p>
                <p className="card-text"><strong>Author:</strong> {book.author}</p>
                <p className="book-price">₹{book.price}</p>
                <button className="btn btn-gradient" onClick={handleAddToCart}>
                    🛒 Add to Cart
                </button>
            </div>
        </div>
    );
};

export default BookCard;