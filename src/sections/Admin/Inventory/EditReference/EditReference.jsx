// EditReference.jsx
import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../../config';
import { useAuth } from '../../../../context/AuthContext';
import './EditReference.css';
import { Spinner } from 'flowbite-react';

const EditReference = ({ isOpen, onClose, onSubmit, shoeData }) => {
  const [editedShoe, setEditedShoe] = useState({
    brand: '',
    price: '',
    modelName: '',
    discount: ''
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    console.log('shoeData in EditReference:', shoeData); // Debug log
    if (shoeData) {
      setEditedShoe({
        id: shoeData.id, // Asegúrate de incluir el id
        brand: shoeData.brand || '',
        price: shoeData.price != null ? shoeData.price.toString() : '',
        modelName: shoeData.modelName || '',
        discount: shoeData.discount != null ? shoeData.discount.toString() : ''
      });
      setPreviewUrl(shoeData.imageUrl || '');
    }
  }, [shoeData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedShoe(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      
      // Añadir los campos de texto al FormData
      Object.keys(editedShoe).forEach(key => {
        formData.append(key, editedShoe[key]);
      });
      
      // Añadir la imagen si se ha seleccionado una nueva
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch(`${API_URL}shoe/image`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      onSubmit(result.newShoe);
    } catch (error) {
      console.error('Error editing shoe:', error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editar Referencia</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="brand">Marca:</label>
              <input
                id="brand"
                type="text"
                name="brand"
                value={editedShoe.brand}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Precio:</label>
              <input
                id="price"
                type="number"
                name="price"
                value={editedShoe.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="modelName">Nombre del Modelo:</label>
              <input
                id="modelName"
                type="text"
                name="modelName"
                value={editedShoe.modelName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="discount">Descuento:</label>
              <input
                id="discount"
                type="number"
                name="discount"
                value={editedShoe.discount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="image">Imagen:</label>
              <input
                id="image"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="Preview" />
              </div>
            )}
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? <Spinner size="sm" light={true} /> : 'Guardar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditReference;