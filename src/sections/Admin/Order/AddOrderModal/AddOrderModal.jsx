// src/components/AddOrderModal.js
import React, { useState } from 'react';
import CustomModal from '../../../../components/Modal/Modal';
import OrderForm from '../OrderForm/OrderForm';
import { API_URL } from '../../../../config';

const AddOrderModal = ({ isOpen, onClose, token, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la orden');
      }

      const data = await response.json();
      console.log(data);
      setLoading(false);
      onSuccess();
      return Promise.resolve();
    } catch (e) {
      console.error(e);
      setLoading(false);
      return Promise.reject(e);
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Añadir Orden">
      <OrderForm
        onSubmit={handleFormSubmit}
        token={token}
        onClose={onClose}
        loading={loading}
      />
    </CustomModal>
  );
};

export default AddOrderModal;
