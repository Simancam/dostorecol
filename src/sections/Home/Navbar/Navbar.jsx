import React from 'react';
import './Navbar.css';

const Navbar = ({ onFilter }) => {
    const items = ['Nike', 'Adidas', 'New Balance', 'Otros'];

    return (
        <nav className="navbar">
            {items.map((item, index) => (
                <div key={index} className="nav-item" onClick={() => onFilter(item)}>
                    {item}
                    <div className="underline-animation"></div>
                </div>
            ))}
        </nav>
    );
}

export default Navbar;
