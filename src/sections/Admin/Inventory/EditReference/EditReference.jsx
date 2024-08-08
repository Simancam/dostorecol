import React, { useState, useEffect } from 'react';
import { Button, TextInput, Spinner } from 'flowbite-react';
import { API_URL } from '../../../../config';
import Modal from '../../../../components/Modal/Modal';
import './EditReference.css';

const EditShoeForm = ({ item, token, onClose, setAlert, fetchInventory, isOpen }) => {
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState('');
  const [modelName, setModelName] = useState('');
  const [sizeData, setSizeData] = useState([{ size: '', amount: '' }]);
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [discount, setDiscount] = useState(0);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (item) {
      setBrand(item.brand || '');
      setModelName(item.modelName || '');
      setPrice(item.price ? item.price.toString() : '');
      setImageUrl(item.imageUrl || '');
      setDiscount(item.discount !== undefined ? item.discount : 0);
      setSizeData(item.sizes ? item.sizes.map((size) => ({ size: size.size, amount: size.amount })) : [{ size: '', amount: '' }]);
    }
  }, [item]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const filePath = URL.createObjectURL(file);
      setImageUrl(filePath);
      setImageFile(file);
    }
  };

  const updateShoeDetails = async (shoeDetails) => {
    const response = await fetch(`${API_URL}shoe`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shoeDetails)
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Error ${response.status}: ${responseText}`);
    }

    return response.json();
  };

  const updateShoeImage = async (id, imageFile) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('image', imageFile);

    const response = await fetch(`${API_URL}shoe/image`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Error ${response.status}: ${responseText}`);
    }

    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const shoeDetails = {
        id: item.id,
        brand,
        modelName,
        price: parseFloat(price),
        discount: parseFloat(discount),
      };

      await updateShoeDetails(shoeDetails);

      if (imageFile) {
        await updateShoeImage(item.id, imageFile);
      }

      setAlert({ type: 'success', message: 'Zapato actualizado exitosamente' });
      await fetchInventory();
      console.log('Inventory updated after editing shoe');
      onClose();
    } catch (error) {
      console.error('Error updating shoe:', error);
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Zapato">
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
        <div className="w-full sm:w-1/2">
          <TextInput
            placeholder="Marca"
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <TextInput
            placeholder="Nombre del Modelo"
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <TextInput
            placeholder="Precio"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <TextInput
            placeholder="Descuento"
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            min="0"
            max="100"
            required
            disabled={loading}
          />
        </div>
        <div className="w-full sm:w-1/2 flex flex-col items-center">
          <Button
            color="blue"
            onClick={() => document.getElementById('image-input').click()}
            className="rounded-full"
            disabled={loading}
          >
            Seleccionar Imagen
          </Button>
          <input
            id="image-input"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            disabled={loading}
          />
          {imageUrl && (
            <img src={imageUrl} alt="Vista previa" className="mt-2 rounded-md h-20" />
          )}
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
    </Modal>
  );
};

export default EditShoeForm;