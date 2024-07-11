import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="header-logo" />
        </header>
    );
}

export default Header;
