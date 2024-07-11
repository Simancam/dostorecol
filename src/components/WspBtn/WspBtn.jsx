import React, { useState } from 'react';
import { Button, TextInput, Spinner } from 'flowbite-react';
import './WspBtn.css';
import { API_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';

const WspBtn = ({ shoe, selectedSize }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    if (!shoe) {
        return null;
    }

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const currentUrl = window.location.href;

    const message = `Hola, soy *${fullName}*.
Estoy interesado en comprar las *${shoe.modelName}*
Marca: *${shoe.brand}*
Talla: *${selectedSize}*
Precio: *${formatPrice(shoe.price)} COP*
Url: *${currentUrl}*`;

    const handleWspClick = () => {
        if (!selectedSize) {
            alert('Por favor selecciona una talla.');
            return;
        }
        setIsModalOpen(true);
    };

    const createOrder = async () => {
        try {
            const response = await fetch(`${API_URL}order`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shoeId: shoe.id,
                    clientName: fullName,
                    size: selectedSize,
                    color: shoe.color,
                    status: 'Pendiente'
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to create order: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Order created:', data);
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    const handleFormSubmit = async () => {
        setLoading(true);
        await createOrder();
        const wspUrl = `https://wa.me/3012270153?text=${encodeURIComponent(message)}`;
        window.open(wspUrl, '_blank');
        setIsModalOpen(false);
        setLoading(false);
    };

    return (
        <>
            <button
                onClick={handleWspClick}
                className={`whatsapp-button ${!selectedSize ? 'inactive' : ''}`}
            >
                <i className="bi bi-whatsapp"></i>
                <span className="ml-2">Comprar via WhatsApp</span>
            </button>

            {isModalOpen && (
                <div className={`custom-modal ${isModalOpen ? 'show' : ''}`}>
                    <div className="custom-modal-content">
                        <div className="custom-modal-header">
                            <h2>Ingresa tu nombre completo</h2>
                            <button onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>
                        <div className="custom-modal-body">
                            <TextInput
                                placeholder="Nombre completo"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="custom-modal-footer">
                            <Button onClick={handleFormSubmit} color="blue" disabled={loading}>
                                {loading ? <Spinner size="sm" /> : 'Enviar'}
                            </Button>
                            <Button color="gray" onClick={() => setIsModalOpen(false)} disabled={loading}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default WspBtn;