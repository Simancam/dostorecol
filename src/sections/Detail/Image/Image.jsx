import React from 'react';
import './Image.css';

const Image = ({ imageUrl, modelName }) => {
    return (
        <div className="image-container w-full md:w-1/2 flex flex-col items-center md:mr-12">
            <img src={imageUrl} alt={modelName} className="w-full h-auto rounded-lg mb-4" />
        </div>
    );
};

export default Image;