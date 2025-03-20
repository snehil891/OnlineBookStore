import { useState } from 'react';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/books?query=${searchQuery}`);
        }
    };
    return (
        <form className="d-flex" onSubmit={handleSearch}>
            <input className="form-control me-2" type="search" placeholder="Search"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Search" />
            <button className="btn btn-primary" type="submit">Search</button>
        </form>
    )
}

export default SearchBar;