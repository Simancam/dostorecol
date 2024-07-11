import React from 'react';
import './Marquee.css';

const Marquee = ({ text }) => {
    return (
        <div className="marquee bg-red-600 text-white py-2 overflow-hidden whitespace-nowrap">
            <div className="marquee-text">{text}</div>
        </div>
    );
}

export default Marquee;