import React from "react";

const Footer = () => {
    return (
        <footer className="bg-dark text-light py-3 mt-5">
            <div className="container text-center">
                <p className="mb-0">© {new Date().getFullYear()} Online Bookstore. All Rights Reserved.</p>
                <p>
                    <a href="/home-page" className="text-light mx-2">Privacy Policy</a> |
                    <a href="/home-page" className="text-light mx-2">Terms of Service</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;