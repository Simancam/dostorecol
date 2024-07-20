import React from 'react';
import Card from '../../../components/Card/Card';

const Cards = ({ filteredShoes }) => {
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <div className="cards-container animate-blurred-fade-in">
            {filteredShoes.map(item => (
                <Card
                    key={item.shoe.id}
                    id={item.shoe.id}
                    image={item.shoe.imageUrl}
                    status="disponible"
                    name={item.shoe.modelName}
                    price={`$ ${formatPrice(item.shoe.price)} COP`}
                />
            ))}
        </div>
    );
};

export default Cards;