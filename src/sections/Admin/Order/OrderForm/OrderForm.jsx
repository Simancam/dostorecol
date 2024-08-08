import React, { useState, useEffect } from 'react';
import { Button, TextInput, Select, Spinner } from 'flowbite-react';
import { API_URL } from '../../../../config';
import './OrderForm.css';

const OrderForm = ({ onSubmit, token, onClose, loading }) => {
  const [clientName, setClientName] = useState('');
  const [shoeId, setShoeId] = useState('');
  const [size, setSize] = useState('');
  const [sizes, setSizes] = useState([]);
  const [shoes, setShoes] = useState([]);
  const [price, setPrice] = useState(0);
  
  // Estado para la alerta
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState('');
  const [alertType, setAlertType] = useState('success');

  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const response = await fetch(`${API_URL}inventory`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch shoes');
        }
        const inventory = await response.json();
        setShoes(inventory);
        console.log('Fetched shoes:', inventory);
      } catch (error) {
        console.error('Error fetching shoes:', error);
        handleAlert('Failed to fetch shoes', 'error'); // Mostrar alerta de error
      }
    };

    fetchShoes();
  }, [token]);

  const handleShoeChange = (event) => {
    const selectedShoeId = event.target.value;
    setShoeId(selectedShoeId);

    const selectedShoe = shoes.find(({ shoe }) => shoe.id === selectedShoeId);
    if (selectedShoe) {
      setSizes(selectedShoe.sizes);
      // Calcular el precio final basado en el descuento
      const finalPrice = selectedShoe.shoe.discount > 0
        ? selectedShoe.shoe.price * (1 - selectedShoe.shoe.discount / 100)
        : selectedShoe.shoe.price;
      setPrice(finalPrice);
      console.log('Selected shoe sizes:', selectedShoe.sizes);
      console.log('Selected shoe price:', finalPrice);
    } else {
      setSizes([]);
      setPrice(0);
    }
  };

  const handleSizeChange = (event) => {
    setSize(parseInt(event.target.value, 10));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        clientName,
        shoeId,
        size,
        price,
        status: 'Pendiente'
      };

      await onSubmit(formData);
      setClientName('');
      setShoeId('');
      setSize('');
      setPrice(0);
      onClose();
      
      handleAlert('Order saved successfully', 'success'); // Mostrar alerta de éxito
    } catch (e) {
      console.error(e);
      handleAlert('Failed to save order', 'error'); // Mostrar alerta de error
    }
  };

  // Función para manejar la alerta
  const handleAlert = (message, type) => {
    setAlertContent(message);
    setAlertType(type);
    setShowAlert(true);

    // Ocultar la alerta después de 3 segundos
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
      {/* Mostrar la alerta si `showAlert` es verdadero */}
      {showAlert && (
        <div className={`alert ${alertType} ${showAlert ? 'show' : ''}`}>
          {alertContent}
        </div>
      )}
      <div className="w-full sm:w-1/2">
        <TextInput
          placeholder="Nombre del Cliente"
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div className="w-full sm:w-1/2">
        <Select
          value={shoeId}
          onChange={handleShoeChange}
          required
          disabled={loading}
        >
          <option value="" disabled>Seleccionar Zapato</option>
          {shoes.map(({ shoe }) => (
            <option key={shoe.id} value={shoe.id}>
              {shoe.brand} - {shoe.modelName}
            </option>
          ))}
        </Select>
      </div>
      <div className="w-full sm:w-1/2">
        <Select
          value={size}
          onChange={handleSizeChange}
          required
          disabled={loading}
        >
          <option value="" disabled>Seleccionar Talla</option>
          {sizes.map((sizeObj) => (
            <option key={sizeObj.size} value={sizeObj.size}>
              {sizeObj.size} ({sizeObj.amount})
            </option>
          ))}
        </Select>
      </div>
      <div className="w-full flex justify-end space-x-2">
        <Button type="button" color="gray" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" color="blue" disabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Guardar'}
        </Button>
      </div>
    </form>
  );
};

export default OrderForm;
