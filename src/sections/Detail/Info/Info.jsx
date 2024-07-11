import React, { useState } from 'react';
import './Info.css';
import Sizes from '../../../components/Sizes/Sizes'; // Ruta ajustada
import WspBtn from '../../../components/WspBtn/WspBtn'; // Ruta ajustada

const Info = ({ inventoryItem }) => {
    const [selectedSize, setSelectedSize] = useState(null);

    if (!inventoryItem) {
        return null; // Evitar renderizar si `inventoryItem` no está definido
    }

    const { shoe, sizes } = inventoryItem;

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <div className="info-container w-full md:w-1/2 p-4 md:ml-12">
            <h2 className="text-2xl font-bold mb-2">{shoe.modelName}</h2>
            <p className="text-lg font-bold text-gray-700 mb-4">{shoe.brand}</p>
            <p className="text-xl font-bold text-black mb-2">$ {formatPrice(shoe.price)} COP</p>
            <Sizes sizes={sizes || []} onSizeSelect={setSelectedSize} /> {/* Asegúrate de pasar `sizes` como array */}
            <WspBtn shoe={shoe} selectedSize={selectedSize} />
        </div>
    );
};

export default Info;