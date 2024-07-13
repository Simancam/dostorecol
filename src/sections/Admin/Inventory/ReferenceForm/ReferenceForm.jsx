import React, { useState, useEffect } from 'react';
import { Button, TextInput, Alert, Spinner } from 'flowbite-react';
import { API_URL } from '../../../../config';

const ReferenceForm = ({ item, token, onClose, setAlert, setLoading, loading }) => {
  const [brand, setBrand] = useState('');
  const [modelName, setModelName] = useState('');
  const [sizeData, setSizeData] = useState([{ size: '', amount: '' }]);
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (item) {
      setBrand(item.shoe.brand);
      setModelName(item.shoe.modelName);
      setPrice(item.price || '');
      setImageUrl(item.shoe.imageUrl || '');
      setSizeData(item.sizes ? item.sizes.map((size, idx) => ({ size, amount: item.amounts[idx] })) : [{ size: '', amount: '' }]);
    } else {
      setBrand('');
      setModelName('');
      setPrice('');
      setImageUrl('');
      setSizeData([{ size: '', amount: '' }]);
      setImageFile(null);
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

  const handleSizeChange = (index, field, value) => {
    const newSizeData = [...sizeData];
    newSizeData[index][field] = value;
    setSizeData(newSizeData);
  };

  const addSizeField = () => {
    setSizeData([...sizeData, { size: '', amount: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('brand', brand);
      formData.append('modelName', modelName);
      formData.append('price', price);
      formData.append('image', imageFile);

      sizeData.forEach((item, index) => {
        formData.append(`sizes[${index}]`, item.size);
        formData.append(`amounts[${index}]`, item.amount);
      });

      const response = await fetch(`${API_URL}shoe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el zapato');
      }

      setAlert({ type: 'success', message: 'Referencia añadida correctamente' });
      setLoading(false);
      setTimeout(() => {
        setAlert(null);
        setBrand('');
        setModelName('');
        setPrice('');
        setImageUrl('');
        setSizeData([{ size: '', amount: '' }]);
        setImageFile(null);
        onClose();
      }, 2000);
    } catch (e) {
      console.log(e);
      setAlert({ type: 'error', message: e.message });
      setLoading(false);
    }
  };

  return (
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
        {sizeData.map((item, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <TextInput
              placeholder="Talla"
              type="number"
              value={item.size}
              onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
              required
              disabled={loading}
            />
            <TextInput
              placeholder="Cantidad"
              type="number"
              value={item.amount}
              onChange={(e) => handleSizeChange(index, 'amount', e.target.value)}
              required
              disabled={loading}
            />
          </div>
        ))}
        <Button color="gray" onClick={addSizeField} disabled={loading}>
          +
        </Button>
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
          required
          disabled={loading}
        />
        {imageUrl && (
          <img src={imageUrl} alt="Vista previa" className="mt-2 rounded-md" />
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
  );
};

export default ReferenceForm;