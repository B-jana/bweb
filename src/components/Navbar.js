import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
    <nav className="navbar">
        <h2>BeautifyMe</h2>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/booking">Book Makeup</Link></li>
            <li><Link to="/training">Training</Link></li>
        </ul>
    </nav>
);

export default Navbar;
