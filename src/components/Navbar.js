import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
    <nav className="navbar">
        <h2>Neelu Beauty Parlour</h2>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/booking">Book Makeup</Link></li>
            <li><Link to="/training">Training</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    </nav>
);

export default Navbar;
