import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';
import Info from '../../sections/Detail/Info/Info';
import Image from '../../sections/Detail/Image/Image';
import { API_URL } from '../../config';
import { Spinner } from 'flowbite-react';

const ProductDetail = () => {
    const { id } = useParams();
    const [inventoryItem, setInventoryItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}inventory`)
            .then(response => response.json())
            .then(inventory => {
                const foundItem = inventory.find(item => item.shoe.id === id);
                setInventoryItem(foundItem || null);
            })
            .catch(error => console.error('Error fetching shoe data:', error))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="product-detail flex justify-center items-center">
                <Spinner size="xl" />
            </div>
        );
    }

    return (
        inventoryItem && (
            <div className="product-detail flex justify-center items-center">
                <div className="container mx-auto p-4 flex flex-col md:flex-row items-start bg-white rounded-lg max-w-4xl">
                    <Image imageUrl={inventoryItem.shoe.imageUrl} modelName={inventoryItem.shoe.modelName} />
                    <Info inventoryItem={inventoryItem} />
                </div>
            </div>
        )
    );
};

export default ProductDetail;