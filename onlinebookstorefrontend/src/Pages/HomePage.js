import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBestSellers } from "../Redux/slices/homeSlice";
import { Link } from "react-router-dom";

const HomePage = () => {
    const dispatch = useDispatch();
    const { bestSellers, loading, error } = useSelector((state) => state.home);

    useEffect(() => {
        dispatch(fetchBestSellers());
    }, [dispatch]);

    return (
        <div className="container mt-4">
            {/* Hero Section */}
            <div className="hero-section text-center text-white p-5 rounded shadow-sm" style={{ background: "linear-gradient(135deg, #6a11cb, #2575fc)", minHeight: "250px" }}>
                <h1 className="fw-bold">Discover Your Next Favorite Book 📖</h1>
                <p className="lead">Browse best sellers and find books that inspire you.</p>
                <Link to="/books" className="btn btn-light fw-bold px-4 py-2">Explore Now</Link>
            </div>

            {/* Quote Section */}
            <div className="text-center my-5 p-4 bg-light rounded shadow-sm">
                <h3 className="fw-bold text-primary">
                    "A reader lives a thousand lives before he dies."
                    <span className="text-secondary"> – George R.R. Martin</span>
                </h3>
            </div>

            <div id="homeCarousel" className="carousel slide my-5 shadow rounded" data-bs-ride="carousel">
                <div className="carousel-inner text-center" style={{ maxHeight: "500px", background: "#f8f9fa" }}>

                    {/* Slide 1 - Knowledge & Learning */}
                    <div className="carousel-item active">
                        <div className="p-5">
                            <h2 className="text-primary fw-bold">📚 Expand Your Knowledge</h2>
                            <p className="lead text-dark">
                                Reading helps you learn new things, gain insights, and develop a deeper understanding of the world.
                            </p>
                        </div>
                    </div>

                    {/* Slide 2 - Stress Reduction */}
                    <div className="carousel-item">
                        <div className="p-5">
                            <h2 className="text-success fw-bold">🧘‍♂️ Reduces Stress & Anxiety</h2>
                            <p className="lead text-dark">
                                Immersing yourself in a good book can lower stress levels, improve mental well-being, and provide relaxation.
                            </p>
                        </div>
                    </div>

                    {/* Slide 3 - Creativity & Imagination */}
                    <div className="carousel-item">
                        <div className="p-5">
                            <h2 className="text-warning fw-bold">✨ Boosts Creativity & Imagination</h2>
                            <p className="lead text-dark">
                                Books open the door to new ideas, enhance imagination, and inspire innovative thinking.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Carousel Controls */}
                <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>


            {/* Best Sellers Section */}
            <div className="d-flex justify-content-between align-items-center">
                <h3 className="fw-bold text-dark">🔥 Best Sellers</h3>
                <Link to="/bestsellers" className="btn btn-outline-primary btn-sm">View More</Link>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-danger">{error}. <button onClick={() => dispatch(fetchBestSellers())} className="btn btn-link">Retry</button></p>
            ) : bestSellers.length > 0 ? (
                <div className="row">
                    {bestSellers.slice(0, 3).map((book) => (
                        <div className="col-md-4 mb-3" key={book.bookId}>
                            <div className="card shadow-sm border-0 book-card">
                                <img
                                    src={book.bookCoverImageUrl || "https://via.placeholder.com/250"}
                                    className="card-img-top"
                                    alt={book.bookTitle || "Book Cover"}
                                    style={{ height: "250px", objectFit: "cover", contain:"size"}}
                                />
                                <div className="card-body text-center">
                                    <h5 className="card-title text-primary">{book.bookTitle || "Unknown Title"}</h5>
                                    <p className="card-text text-muted">By {book.bookAuthor || "Unknown"}</p>
                                    <p className="card-text text-dark">Orders: {book.totalOrders || 0}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-muted">No best sellers available.</p>
            )}

            {/* Call to Action Section */}
            <div className="cta-section text-center text-white p-5 rounded shadow-sm mt-5" style={{ background: "linear-gradient(135deg, #ff416c, #ff4b2b)", minHeight: "200px" }}>
                <h2 className="fw-bold">Ready to Start Your Reading Journey? 📚</h2>
                <p className="lead">Discover books that ignite your imagination and fuel your passion for reading.</p>
                <Link to="/books" className="btn btn-light fw-bold px-4 py-2">Get Started</Link>
            </div>
        </div>
    );
};

export default HomePage;