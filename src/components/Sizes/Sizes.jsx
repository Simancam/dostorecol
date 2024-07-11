import React, { useState } from 'react';
import './Sizes.css';

const Sizes = ({ sizes, onSizeSelect }) => {
    const [selectedSize, setSelectedSize] = useState(null);

    const handleSizeClick = (size) => {
        setSelectedSize(size);
        onSizeSelect(size);
    };

    if (!sizes || !Array.isArray(sizes) || sizes.length === 0) {
        return <div className="sizes-container mb-4">No hay tallas disponibles</div>;
    }

    return (
        <div className="sizes-container mb-4">
            <h3 className="text-lg font-semibold mb-2">Tallas Disponibles:</h3>
            <div className="size-container">
                {sizes.map((size, index) => (
                    <span
                        key={index}
                        className={`size-item ${selectedSize === size.size ? 'selected' : ''}`}
                        onClick={() => handleSizeClick(size.size)}
                    >
                        {size.size}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default Sizes;