import React, { useState, useEffect } from 'react';
import { Button, TextInput, Select, Spinner } from 'flowbite-react';
import { API_URL } from '../../../../config';

const OrderForm = ({ onSubmit, token, onClose, loading }) => {
  const [clientName, setClientName] = useState('');
  const [shoeId, setShoeId] = useState('');
  const [size, setSize] = useState('');
  const [sizes, setSizes] = useState([]);
  const [shoes, setShoes] = useState([]);

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
      console.log('Selected shoe sizes:', selectedShoe.sizes);
    } else {
      setSizes([]);
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
        status: 'Pendiente'
      };

      await onSubmit(formData);
      setClientName('');
      setShoeId('');
      setSize('');
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
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