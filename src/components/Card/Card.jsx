import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Card.css';

const Card = ({ id, image, status, name, price }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/product/${id}`);
    };

    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    return (
        <div className="card" onClick={handleCardClick}>
            <div className="card-image-container">
                <img src={image} alt={name} className="card-image" />
            </div>
            <div className="card-content">
                <span className={`card-status ${status.toLowerCase() === 'disponible' ? 'disponible' : 'no-disponible'}`}>
                    {formattedStatus}
                </span>
                <h3 className="card-name">{name}</h3>
                <p className="card-price">{price}</p>
            </div>
        </div>
    );
}

export default Card;