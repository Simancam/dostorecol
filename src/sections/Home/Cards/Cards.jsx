import React, { useEffect, useState } from 'react';
import Card from '../../../components/Card/Card';

const Cards = () => {
    const [shoes, setShoes] = useState([]);

    useEffect(() => {
        fetch('/shoes.json') // Carga el JSON desde public
            .then(response => response.json())
            .then(data => setShoes(data))
            .catch(error => console.error('Error cargando los datos:', error));
    }, []);

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <div className="cards-container animate-blurred-fade-in">
            {shoes.map(item => (
                <Card
                    key={item.id}
                    id={item.id}
                    image={item.imageUrl}
                    status="disponible"
                    name={item.modelName}
                    brand={item.brand}
                    description={item.description}
                    price={`$ ${formatPrice(item.price)} COP`}
                    sizes={item.sizes.join(', ')}
                    category={item.category}
                />
            ))}
        </div>
    );
};

export default Cards;
