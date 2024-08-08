import React, { useState, useEffect, useRef } from 'react';
import { Button, TextInput, Spinner, Alert } from 'flowbite-react';
import { API_URL } from '../../../../config';
import './ReferenceForm.css';

const ReferenceForm = ({ item, token, onClose, setLoading, loading, fetchInventory }) => {
  const [brand, setBrand] = useState('');
  const [modelName, setModelName] = useState('');
  const [sizeData, setSizeData] = useState([{ size: '', amount: '' }]);
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState('');
  const [alertType, setAlertType] = useState('success');

  useEffect(() => {
    if (item) {
      setBrand(item.shoe?.brand || '');
      setModelName(item.shoe?.modelName || '');
      setPrice(item.shoe?.price?.toString() || '');
      setImageUrl(item.shoe?.imageUrl || '');
      setSizeData(
        item.sizes
          ? item.sizes.map((size, idx) => ({
              size: size.toString(),
              amount: item.amounts[idx].toString(),
            }))
          : [{ size: '', amount: '' }]
      );
    }
  }, [item]);

  const handleAlert = (message, type) => {
    setAlertContent(message);
    setAlertType(type);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      console.log('Archivo seleccionado:', file.name);
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

  const validateFormData = () => {
    const sizes = sizeData.map((item) => parseInt(item.size));
    const amounts = sizeData.map((item) => parseInt(item.amount));
    if (sizes.some(isNaN) || amounts.some(isNaN) || isNaN(parseFloat(price))) {
      throw new Error('Invalid input data');
    }
    return {
      brand,
      modelName,
      price: parseFloat(price),
      sizes,
      amounts,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const shoeData = validateFormData();

      const formData = new FormData();
      formData.append('brand', brand);
      formData.append('modelName', modelName);
      formData.append('price', shoeData.price);
      formData.append('color', 'Rojo');

      if (!imageFile) {
        throw new Error('Debe seleccionar una imagen');
      }

      formData.append('image', imageFile, imageFile.name);

      shoeData.sizes.forEach((size, index) => {
        formData.append(`sizes[${index}]`, size);
      });
      shoeData.amounts.forEach((amount, index) => {
        formData.append(`amounts[${index}]`, amount);
      });

      const response = await fetch(`${API_URL}shoe`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      handleAlert('Referencia añadida correctamente', 'success');

      // Llamar a fetchInventory después de agregar la referencia
      if (typeof fetchInventory === 'function') {
        await fetchInventory();
        console.log('Inventory updated after adding reference');
      } else {
        console.error('fetchInventory is not a function');
      }

      onClose(); // Cerrar el formulario
    } catch (e) {
      console.error('Error en la solicitud:', e);
      handleAlert(e.message, 'error');
    } finally {
      setLoading(false);
    };
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
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          disabled={loading}
        />
        <Button
          color="blue"
          onClick={() => fileInputRef.current.click()}
          className="rounded-full"
          disabled={loading}
        >
          Seleccionar Imagen
        </Button>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Vista previa"
            className="mt-2 rounded-md object-cover"
            style={{ maxWidth: '100%', maxHeight: '200px' }}
          />
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
